import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { ExploreSchema, parseOr400 } from '@/lib/schemas';
import { getRouteClient } from '@/lib/supabase/route-client';
import { NextResponse } from 'next/server';

const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMS = 3072;
const GUEST_RESULT_LIMIT = 5;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

const VIBE_PRESET_TAGS: Record<string, string[]> = {
  'brain-food': ['philosophical', 'cerebral', 'thought-provoking', 'existential', 'psychological'],
  'cozy-warm': ['cozy', 'wholesome', 'uplifting', 'heartwarming', 'slice of life'],
  'dark-gritty': ['dark', 'gritty', 'mature', 'bleak', 'morally grey'],
  'adrenaline-rush': ['fast-paced', 'explosive', 'action', 'intense', 'high-stakes'],
  'emotionally-heavy': ['melancholic', 'cathartic', 'bittersweet', 'tragedy', 'emotionally heavy'],
  'surreal-weird': ['surreal', 'avant-garde', 'experimental', 'mind-bending', 'atmospheric'],
};

async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  const result = await model.embedContent({
    content: { role: 'user', parts: [{ text }] },
    taskType: 'RETRIEVAL_QUERY' as never,
    outputDimensionality: EMBEDDING_DIMS,
  } as never);

  return result.embedding.values;
}

function averageVectors(vectors: number[][]): number[] {
  const dim = vectors[0].length;
  const avg = new Array(dim).fill(0);
  for (const vec of vectors) {
    for (let i = 0; i < dim; i++) avg[i] += vec[i];
  }
  const n = vectors.length;
  for (let i = 0; i < dim; i++) avg[i] /= n;
  return avg;
}

export async function POST(request: Request) {
  const start = Date.now();

  try {
    const supabase = await getRouteClient();

    const { data: { user } } = await supabase.auth.getUser();
    const identifier = user ? `explore:${user.id}` : `explore:anon:${request.headers.get('x-forwarded-for') ?? 'unknown'}`;
    const limited = rateLimit(identifier, rateLimitPresets.expensive);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    if (!body) {
      return json({ success: false, error: 'Invalid JSON body', code: 'INVALID_INPUT' }, 400);
    }

    const parsed = parseOr400(ExploreSchema, body, json);
    if (!parsed.success) return parsed.response;
    const { mode, tags, vibe_id, match_count, max_popularity } = parsed.data;

    let resolvedTags: string[] = [];
    if (mode === 'vibe_starter' && vibe_id) {
      resolvedTags = VIBE_PRESET_TAGS[vibe_id] ?? [];
    } else if (mode === 'tags' && tags) {
      resolvedTags = tags.slice(0, 5).map((t) => String(t).trim().toLowerCase());
    }

    const tagPrompt = `anime with these vibes and themes: ${resolvedTags.join(', ')}`;
    const centroidEmbedding = await generateEmbedding(tagPrompt);
    const embeddingVector = `[${centroidEmbedding.join(',')}]`;

    const effectiveLimit = user ? match_count : GUEST_RESULT_LIMIT;

    const { data: results, error: rpcError } = await supabase.rpc('match_anime', {
      query_embedding: embeddingVector,
      match_threshold: 0.65,
      match_count: effectiveLimit + 3,
      max_popularity,
      min_score: 6.5,
    });

    if (rpcError) {
      console.error('[/api/explore] RPC error:', rpcError);
      return json({ success: false, error: 'Vector search failed', code: 'SEARCH_ERROR' }, 500);
    }

    type MatchResult = {
      id: number;
      anilist_id: number;
      title: string;
      title_english: string | null;
      synopsis: string | null;
      cover_image: string | null;
      genres: string[];
      mood_tags: string[];
      popularity_rank: number;
      average_score: number;
      total_episodes: number | null;
      similarity: number;
    };

    const mapped = ((results as MatchResult[]) ?? [])
      .slice(0, effectiveLimit)
      .map((r) => ({
        ...r,
        similarity: Math.round(r.similarity * 1000) / 1000,
      }));

    const avgSimilarity = mapped.length > 0
      ? Math.round((mapped.reduce((s, r) => s + r.similarity, 0) / mapped.length) * 1000) / 1000
      : 0;

    return json({
      success: true,
      mode: mode ?? 'tags',
      query_tags: resolvedTags,
      results: mapped,
      metadata: {
        total_results: mapped.length,
        avg_similarity: avgSimilarity,
        processing_time_ms: Date.now() - start,
        authenticated: !!user,
      },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };

    if (error.status === 429 || error.message?.includes('429')) {
      return json({ success: false, error: 'Rate limit reached. Try again shortly.', code: 'RATE_LIMITED' }, 429);
    }

    console.error('[/api/explore] Unexpected error:', error.message ?? error);
    return json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500);
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMS = 3072;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupaClient = any;

async function findByAnilistId(supabase: SupaClient, anilistId: number) {
  const { data, error } = await supabase
    .from('anime_official_library')
    .select('id, embedding, metadata')
    .filter('metadata->>anilist_id', 'eq', String(anilistId))
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

async function findByTitle(supabase: SupaClient, query: string) {
  const q = query.toLowerCase();

  const { data, error } = await supabase
    .from('anime_official_library')
    .select('id, embedding, metadata');

  if (error || !data || data.length === 0) return null;

  type Row = { id: number; embedding: string; metadata: Record<string, unknown> };

  const match = (data as Row[]).find((row) => {
    const title = (row.metadata?.title as string || '').toLowerCase();
    const titleEn = (row.metadata?.title_english as string || '').toLowerCase();
    return title === q || titleEn === q || title.includes(q) || titleEn.includes(q);
  });

  return match ?? null;
}

/**
 * Generate a fresh embedding via Google AI for arbitrary text.
 */
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

export async function POST(request: Request) {
  const start = Date.now();

  try {
    const supabase = await getSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return json({ success: false, error: 'Authentication required', code: 'UNAUTHORIZED' }, 401);
    }

    const limited = rateLimit(`discover:${user.id}`, rateLimitPresets.expensive);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    if (!body) {
      return json({ success: false, error: 'Invalid JSON body', code: 'INVALID_INPUT' }, 400);
    }

    const {
      query,
      anilist_id,
      match_count = 20,
      max_popularity = 1000000,
      min_score = 7.0,
    } = body as {
      query?: string;
      anilist_id?: number;
      match_count?: number;
      max_popularity?: number;
      min_score?: number;
    };

    if (!query && !anilist_id) {
      return json({
        success: false,
        error: 'Provide either "query" (anime title) or "anilist_id"',
        code: 'INVALID_INPUT',
      }, 400);
    }

    // ── Step 1: Resolve the seed embedding ──────────────────────────────────

    let seedId: number | null = null;
    let embeddingVector: string;
    let resolvedQuery = query ?? '';

    if (anilist_id) {
      const match = await findByAnilistId(supabase, anilist_id);
      if (!match) {
        return json({ success: false, error: `Anime with anilist_id ${anilist_id} not found`, code: 'NOT_FOUND' }, 404);
      }
      seedId = match.id;
      embeddingVector = match.embedding;
      resolvedQuery = (match.metadata as Record<string, unknown>)?.title_english as string
        ?? (match.metadata as Record<string, unknown>)?.title as string
        ?? `anilist:${anilist_id}`;
    } else {
      const match = await findByTitle(supabase, query!);
      if (match) {
        seedId = match.id;
        embeddingVector = match.embedding;
      } else {
        const embedding = await generateEmbedding(query!);
        embeddingVector = `[${embedding.join(',')}]`;
      }
    }

    // ── Step 2: Vector similarity search via match_anime ────────────────────

    const { data: results, error: rpcError } = await supabase.rpc('match_anime', {
      query_embedding: embeddingVector,
      match_threshold: 0.70,
      match_count: match_count + 5, // fetch extra to compensate for seed removal
      max_popularity,
      min_score,
    });

    if (rpcError) {
      console.error('[/api/discover] RPC error:', rpcError);
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

    const filtered = ((results as MatchResult[]) ?? [])
      .filter((r) => r.id !== seedId)
      .slice(0, match_count)
      .map((r) => ({
        ...r,
        similarity: Math.round(r.similarity * 1000) / 1000,
      }));

    const avgSimilarity = filtered.length > 0
      ? Math.round((filtered.reduce((s, r) => s + r.similarity, 0) / filtered.length) * 1000) / 1000
      : 0;

    return json({
      success: true,
      query: resolvedQuery,
      results: filtered,
      metadata: {
        total_results: filtered.length,
        avg_similarity: avgSimilarity,
        processing_time_ms: Date.now() - start,
      },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };

    if (error.status === 429 || error.message?.includes('429')) {
      return json({ success: false, error: 'Rate limit reached. Try again shortly.', code: 'RATE_LIMITED' }, 429);
    }

    console.error('[/api/discover] Unexpected error:', error.message ?? error);
    return json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500);
  }
}

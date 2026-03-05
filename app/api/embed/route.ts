import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 3072;
const MAX_INPUT_LENGTH = 8000;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: Request) {
  const start = Date.now();

  try {
    const user = await getUser();
    if (!user) {
      return json({ success: false, error: 'Authentication required', code: 'UNAUTHORIZED' }, 401);
    }

    const limited = rateLimit(`embed:${user.id}`, rateLimitPresets.expensive);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    if (!body || typeof body.text !== 'string') {
      return json({ success: false, error: 'Request body must include a "text" field (string)', code: 'INVALID_INPUT' }, 400);
    }

    const text = body.text.trim();
    if (text.length === 0) {
      return json({ success: false, error: 'Text must not be empty', code: 'INVALID_INPUT' }, 400);
    }
    if (text.length > MAX_INPUT_LENGTH) {
      return json({
        success: false,
        error: `Text exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
        code: 'INPUT_TOO_LONG',
      }, 400);
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error('[/api/embed] GOOGLE_AI_API_KEY is not set');
      return json({ success: false, error: 'Embedding service is not configured', code: 'SERVICE_UNAVAILABLE' }, 503);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

    const result = await model.embedContent({
      content: { role: 'user', parts: [{ text }] },
      taskType: 'RETRIEVAL_DOCUMENT' as never,
      outputDimensionality: EMBEDDING_DIMENSIONS,
    } as never);

    const embedding = result.embedding.values;

    return json({
      success: true,
      embedding,
      metadata: {
        model: EMBEDDING_MODEL,
        dimensions: embedding.length,
        processing_time_ms: Date.now() - start,
      },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string; code?: string };

    if (error.status === 429 || error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit')) {
      return json({
        success: false,
        error: 'Embedding rate limit reached. Please wait a moment and try again.',
        code: 'RATE_LIMITED',
      }, 429);
    }

    if (error.status === 403 || error.message?.toLowerCase().includes('api key')) {
      return json({ success: false, error: 'Invalid or expired API key', code: 'AUTH_FAILED' }, 503);
    }

    console.error('[/api/embed] Unexpected error:', error.message ?? error);
    return json({
      success: false,
      error: 'Failed to generate embedding',
      code: 'INTERNAL_ERROR',
    }, 500);
  }
}

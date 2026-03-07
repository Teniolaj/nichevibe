import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { AutocompleteSchema, parseOr400 } from '@/lib/schemas';
import { getRouteClient } from '@/lib/supabase/route-client';
import { NextResponse } from 'next/server';

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function GET(request: Request) {
  try {
    const supabase = await getRouteClient();
    const { data: { user } } = await supabase.auth.getUser();
    const identifier = user ? `autocomplete:${user.id}` : `autocomplete:anon:${request.headers.get('x-forwarded-for') ?? 'unknown'}`;
    const limited = rateLimit(identifier, rateLimitPresets.read);
    if (limited) return limited;

    const url = new URL(request.url);
    const params = {
      q: url.searchParams.get('q')?.trim(),
      limit: url.searchParams.get('limit') ?? '5',
    };

    const parsed = parseOr400(AutocompleteSchema, params, json);
    if (!parsed.success) return parsed.response;
    const { q, limit } = parsed.data;

    if (!q || q.length < 2) {
      return json({ results: [] });
    }

    const { data: rows, error } = await supabase
      .from('anime_official_library')
      .select('id, metadata');

    if (error) {
      console.error('[/api/search/autocomplete]', error);
      return json({ results: [], error: 'Search failed' }, 500);
    }

    const query = q.toLowerCase();
    type Row = { id: number; metadata: Record<string, unknown> | null };

    const matches = (rows as Row[] ?? [])
      .filter((row) => {
        const title = (row.metadata?.title as string || '').toLowerCase();
        const titleEn = (row.metadata?.title_english as string || '').toLowerCase();
        return title.includes(query) || titleEn.includes(query);
      })
      .map((row) => {
        const m = row.metadata as Record<string, unknown> | null;
        const title = (m?.title as string) ?? 'Unknown';
        const titleEn = m?.title_english as string | null;
        const titleLower = title.toLowerCase();
        const titleEnLower = (titleEn ?? '').toLowerCase();

        let score = 0;
        if (titleLower === query || titleEnLower === query) score = 100;
        else if (titleLower.startsWith(query) || titleEnLower.startsWith(query)) score = 80;
        else if (titleLower.includes(query) || titleEnLower.includes(query)) score = 50;

        return {
          id: row.id,
          anilist_id: m?.anilist_id ?? row.id,
          title,
          title_english: titleEn,
          cover_image: m?.cover_image ?? null,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ id, anilist_id, title, title_english, cover_image }) => ({
        id,
        anilist_id,
        title,
        title_english,
        cover_image,
      }));

    return json({ results: matches });
  } catch (err) {
    console.error('[/api/search/autocomplete] Unexpected:', err);
    return json({ results: [], error: 'Internal server error' }, 500);
  }
}

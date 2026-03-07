import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { json, requireAuth } from '@/lib/supabase/route-client';

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;
    const { supabase, user } = auth;

    const limited = rateLimit(`library-list:${user.id}`, rateLimitPresets.read);
    if (limited) return limited;

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sort_by') || 'last_updated';
    const order = url.searchParams.get('order') === 'asc';

    let query = supabase
      .from('user_library')
      .select('*')
      .eq('user_id', user.id)
      .order(sortBy, { ascending: order });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('[/api/library/list]', error);
      return json({ success: false, error: 'Failed to fetch library', code: 'DB_ERROR' }, 500);
    }

    const animeIds = (items ?? []).map((i) => i.anime_id);

    let animeMap: Record<number, Record<string, unknown>> = {};
    if (animeIds.length > 0) {
      const { data: animeRows } = await supabase
        .from('anime_official_library')
        .select('id, metadata')
        .in('id', animeIds);

      if (animeRows) {
        for (const row of animeRows) {
          const m = row.metadata as Record<string, unknown> | null;
          animeMap[row.id] = {
            id: row.id,
            anilist_id: m?.anilist_id ?? row.id,
            title: m?.title ?? 'Unknown',
            title_english: m?.title_english ?? null,
            cover_image: m?.cover_image ?? null,
            total_episodes: m?.total_episodes ?? null,
            genres: m?.genres ?? [],
            average_score: m?.average_score ?? null,
            popularity_rank: m?.popularity_rank ?? null,
          };
        }
      }
    }

    const library = (items ?? []).map((item) => ({
      ...item,
      anime: animeMap[item.anime_id] || { id: item.anime_id, title: 'Unknown' },
    }));

    const stats = {
      total_items: library.length,
      watching: library.filter((i) => i.status === 'watching').length,
      completed: library.filter((i) => i.status === 'completed').length,
      plan_to_watch: library.filter((i) => i.status === 'plan_to_watch').length,
      on_hold: library.filter((i) => i.status === 'on_hold').length,
      dropped: library.filter((i) => i.status === 'dropped').length,
    };

    return json({ success: true, library, stats });
  } catch (err) {
    console.error('[/api/library/list] Unexpected:', err);
    return json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500);
  }
}

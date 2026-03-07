import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { LibraryAddSchema, parseOr400 } from '@/lib/schemas';
import { json, requireAuth } from '@/lib/supabase/route-client';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;
    const { supabase, user } = auth;

    const limited = rateLimit(`library-add:${user.id}`, rateLimitPresets.write);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    if (!body) {
      return json({ success: false, error: 'Invalid JSON body', code: 'INVALID_INPUT' }, 400);
    }

    const parsed = parseOr400(LibraryAddSchema, body, json);
    if (!parsed.success) return parsed.response;
    const { anime_id, status } = parsed.data;

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('user_library')
      .insert({
        user_id: user.id,
        anime_id: body.anime_id,
        status,
        started_at: status === 'watching' ? now : null,
        completed_at: status === 'completed' ? now : null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('user_library')
          .select('status')
          .eq('user_id', user.id)
          .eq('anime_id', anime_id)
          .single();

        return json({
          success: false,
          error: 'Anime already in library',
          code: 'DUPLICATE_ENTRY',
          existing_status: existing?.status ?? null,
        }, 409);
      }
      console.error('[/api/library/add]', error);
      return json({ success: false, error: 'Failed to add to library', code: 'DB_ERROR' }, 500);
    }

    return json({ success: true, library_item: data });
  } catch (err) {
    console.error('[/api/library/add] Unexpected:', err);
    return json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500);
  }
}

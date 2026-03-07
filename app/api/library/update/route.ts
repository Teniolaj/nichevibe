import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { LibraryUpdateSchema, parseOr400 } from '@/lib/schemas';
import { json, requireAuth } from '@/lib/supabase/route-client';

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;
    const { supabase, user } = auth;

    const limited = rateLimit(`library-update:${user.id}`, rateLimitPresets.write);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    if (!body) {
      return json({ success: false, error: 'Invalid JSON body', code: 'INVALID_INPUT' }, 400);
    }

    const parsed = parseOr400(LibraryUpdateSchema, body, json);
    if (!parsed.success) return parsed.response;
    const { library_item_id, status, current_episode, personal_rating, notes, is_favorite } = parsed.data;

    const now = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = { last_updated: now };

    if (status) {
      updates.status = status;
      if (status === 'watching') updates.started_at = now;
      if (status === 'completed') updates.completed_at = now;
    }
    if (current_episode !== undefined) updates.current_episode = current_episode;
    if (personal_rating !== undefined) updates.personal_rating = personal_rating;
    if (notes !== undefined) updates.notes = notes;
    if (is_favorite !== undefined) updates.is_favorite = is_favorite;

    const { data, error } = await supabase
      .from('user_library')
      .update(updates)
      .eq('id', library_item_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[/api/library/update]', error);
      return json({ success: false, error: 'Failed to update library item', code: 'DB_ERROR' }, 500);
    }
    if (!data) {
      return json({ success: false, error: 'Library item not found', code: 'NOT_FOUND' }, 404);
    }

    return json({ success: true, updated_item: data });
  } catch (err) {
    console.error('[/api/library/update] Unexpected:', err);
    return json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500);
  }
}

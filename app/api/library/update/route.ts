import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { json, requireAuth } from '@/lib/supabase/route-client';

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;
    const { supabase, user } = auth;

    const limited = rateLimit(`library-update:${user.id}`, rateLimitPresets.write);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    if (!body || typeof body.library_item_id !== 'number') {
      return json({ success: false, error: '"library_item_id" (number) is required', code: 'INVALID_INPUT' }, 400);
    }

    const validStatuses = ['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped'];
    if (body.status && !validStatuses.includes(body.status)) {
      return json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`, code: 'INVALID_INPUT' }, 400);
    }

    if (body.personal_rating !== undefined && (body.personal_rating < 1 || body.personal_rating > 10)) {
      return json({ success: false, error: 'Rating must be between 1 and 10', code: 'INVALID_INPUT' }, 400);
    }

    const now = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = { last_updated: now };

    if (body.status) {
      updates.status = body.status;
      if (body.status === 'watching') updates.started_at = now;
      if (body.status === 'completed') updates.completed_at = now;
    }
    if (body.current_episode !== undefined) updates.current_episode = body.current_episode;
    if (body.personal_rating !== undefined) updates.personal_rating = body.personal_rating;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.is_favorite !== undefined) updates.is_favorite = body.is_favorite;

    const { data, error } = await supabase
      .from('user_library')
      .update(updates)
      .eq('id', body.library_item_id)
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

import { rateLimit, rateLimitPresets } from '@/lib/rate-limit';
import { LibraryRemoveSchema, parseOr400 } from '@/lib/schemas';
import { json, requireAuth } from '@/lib/supabase/route-client';

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;
    const { supabase, user } = auth;

    const limited = rateLimit(`library-remove:${user.id}`, rateLimitPresets.write);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    if (!body) {
      return json({ success: false, error: 'Invalid JSON body', code: 'INVALID_INPUT' }, 400);
    }

    const parsed = parseOr400(LibraryRemoveSchema, body, json);
    if (!parsed.success) return parsed.response;
    const { library_item_id } = parsed.data;

    const { error, count } = await supabase
      .from('user_library')
      .delete({ count: 'exact' })
      .eq('id', library_item_id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[/api/library/remove]', error);
      return json({ success: false, error: 'Failed to remove from library', code: 'DB_ERROR' }, 500);
    }
    if (count === 0) {
      return json({ success: false, error: 'Library item not found', code: 'NOT_FOUND' }, 404);
    }

    return json({ success: true, removed_id: library_item_id });
  } catch (err) {
    console.error('[/api/library/remove] Unexpected:', err);
    return json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500);
  }
}

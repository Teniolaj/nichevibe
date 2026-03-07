import { z } from 'zod';

// ── Shared ─────────────────────────────────────────────────────────────────

const LIBRARY_STATUS = z.enum([
  'plan_to_watch',
  'watching',
  'completed',
  'on_hold',
  'dropped',
]);

// ── Discover (POST /api/discover) ───────────────────────────────────────────

export const DiscoverSchema = z
  .object({
    query: z.string().trim().optional(),
    anilist_id: z.number().int().positive().optional(),
    match_count: z.number().int().min(1).max(50).default(20),
    max_popularity: z.number().int().min(1).max(10_000_000).default(1_000_000),
    min_score: z.number().min(0).max(10).default(7.0),
  })
  .refine((data) => !!data.query || !!data.anilist_id, {
    message: 'Provide either "query" (anime title) or "anilist_id"',
    path: ['query'],
  });

export type DiscoverInput = z.infer<typeof DiscoverSchema>;

// ── Explore (POST /api/explore) ─────────────────────────────────────────────

const VIBE_IDS = [
  'brain-food',
  'cozy-warm',
  'dark-gritty',
  'adrenaline-rush',
  'emotionally-heavy',
  'surreal-weird',
] as const;

export const ExploreSchema = z
  .object({
    mode: z.enum(['vibe_starter', 'tags']),
    tags: z.array(z.string().trim().min(1)).optional(),
    vibe_id: z.enum(VIBE_IDS).optional(),
    match_count: z.number().int().min(1).max(30).default(15),
    max_popularity: z.number().int().min(1).max(10_000_000).default(1_000_000),
  })
  .refine(
    (data) => {
      if (data.mode === 'vibe_starter') return !!data.vibe_id;
      if (data.mode === 'tags') return Array.isArray(data.tags) && data.tags.length > 0;
      return false;
    },
    {
      message: 'Provide mode "tags" with tags[] array, or mode "vibe_starter" with vibe_id',
      path: ['mode'],
    }
  );

export type ExploreInput = z.infer<typeof ExploreSchema>;

// ── Embed (POST /api/embed) ──────────────────────────────────────────────────

export const EmbedSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Text must not be empty')
    .max(8000, 'Text exceeds maximum length of 8000 characters'),
});

export type EmbedInput = z.infer<typeof EmbedSchema>;

// ── Library Add (POST /api/library/add) ─────────────────────────────────────

export const LibraryAddSchema = z.object({
  anime_id: z.number().int().positive(),
  status: LIBRARY_STATUS.default('plan_to_watch'),
});

export type LibraryAddInput = z.infer<typeof LibraryAddSchema>;

// ── Library Update (PATCH /api/library/update) ───────────────────────────────

export const LibraryUpdateSchema = z.object({
  library_item_id: z.number().int().positive(),
  status: LIBRARY_STATUS.optional(),
  current_episode: z.number().int().min(0).optional(),
  personal_rating: z.number().min(1).max(10).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  is_favorite: z.boolean().optional(),
});

export type LibraryUpdateInput = z.infer<typeof LibraryUpdateSchema>;

// ── Library Remove (DELETE /api/library/remove) ──────────────────────────────

export const LibraryRemoveSchema = z.object({
  library_item_id: z.number().int().positive(),
});

export type LibraryRemoveInput = z.infer<typeof LibraryRemoveSchema>;

// ── Autocomplete (GET /api/search/autocomplete) ─────────────────────────────

export const AutocompleteSchema = z.object({
  q: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

export type AutocompleteInput = z.infer<typeof AutocompleteSchema>;

// ── Validation helper ────────────────────────────────────────────────────────

export function parseOr400<T>(
  schema: z.ZodType<T>,
  data: unknown,
  json: (body: Record<string, unknown>, status?: number) => Response
): { success: true; data: T } | { success: false; response: Response } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const first = result.error.issues[0];
  const message = first?.message ?? 'Invalid input';
  const path = first?.path?.join('.');
  return {
    success: false,
    response: json(
      {
        success: false,
        error: path ? `${path}: ${message}` : message,
        code: 'INVALID_INPUT',
      },
      400
    ),
  };
}

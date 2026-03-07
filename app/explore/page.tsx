'use client';

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useCallback, useState } from 'react';
import Navbar from '../components/Navbar';
import { AnimeCoverImage } from '../components/AnimeCoverImage';

/* ─── Types ─── */
interface AnimeResult {
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
}

interface ExploreResponse {
  success: boolean;
  mode: string;
  query_tags: string[];
  results: AnimeResult[];
  metadata: { total_results: number; avg_similarity: number; processing_time_ms: number; authenticated: boolean };
  error?: string;
}

/* ─── Vibe preset cards data ─── */
const VIBE_PRESETS = [
  { id: 'brain-food', emoji: '🧠', title: 'BRAIN FOOD', desc: 'Deep philosophical themes and intricate plots.', accentColor: '#0CCEC0', bg: 'rgba(12,206,192,0.06)' },
  { id: 'cozy-warm', emoji: '🍵', title: 'COZY & WARM', desc: 'Heartwarming stories and peaceful atmospheres.', accentColor: '#22c55e', bg: 'rgba(34,197,94,0.06)' },
  { id: 'dark-gritty', emoji: '🌑', title: 'DARK & GRITTY', desc: 'Bleak worlds and morally grey characters.', accentColor: '#ec4899', bg: 'rgba(236,72,153,0.06)' },
  { id: 'adrenaline-rush', emoji: '⚡', title: 'ADRENALINE RUSH', desc: 'High-octane action and intense pacing.', accentColor: '#f97316', bg: 'rgba(249,115,22,0.06)' },
  { id: 'emotionally-heavy', emoji: '💔', title: 'EMOTIONALLY HEAVY', desc: 'Bring tissues. Powerful emotional journeys.', accentColor: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
  { id: 'surreal-weird', emoji: '🌀', title: 'SURREAL & WEIRD', desc: 'Avant-garde art styles and mind-bending logic.', accentColor: '#818cf8', bg: 'rgba(129,140,248,0.06)' },
];

/* ─── Manual input tags ─── */
const TAGS = [
  'BITTERSWEET', 'SLOW-BURN', 'CEREBRAL', 'DYSTOPIAN',
  'COMING OF AGE', 'TRAGEDY', 'ANTI-HERO', 'CYBERPUNK',
  'CLASS STRUGGLE', 'PSYCHOLOGICAL', 'DARK', 'REVENGE',
  'BODY HORROR', 'CRIME', 'SURREAL', 'ATMOSPHERIC',
  'MATURE', 'METHODICAL', 'MEDITATIVE', 'EXPLOSIVE', 'COZY',
];

const MAX_TAGS = 5;
const SWIPE_THRESHOLD = 100;

/* ─── Genre → accent color ─── */
const GENRE_COLORS: Record<string, string> = {
  Action: '#ef4444', Adventure: '#f97316', Comedy: '#84cc16', Drama: '#3b82f6',
  Fantasy: '#a78bfa', Horror: '#dc2626', Mystery: '#f59e0b', Psychological: '#7c3aed',
  Romance: '#ec4899', 'Sci-Fi': '#06b6d4', 'Slice of Life': '#0CCEC0',
  Supernatural: '#8b5cf6', Thriller: '#ef4444', Sports: '#10b981', Mecha: '#6366f1',
};

function getAccent(genres: string[]): string {
  for (const g of genres) { if (GENRE_COLORS[g]) return GENRE_COLORS[g]; }
  return '#0CCEC0';
}

/* ═══════════════════════════════════════════════════════════════════════════
   SWIPE CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function SwipeCard({ anime, onSwipe, isFront, exitDir }: {
  anime: AnimeResult; onSwipe: (dir: 'left' | 'right') => void; isFront: boolean; exitDir: 'left' | 'right';
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacitySkip = useTransform(x, [-150, -40, 0], [1, 0, 0]);
  const opacityAdd = useTransform(x, [0, 40, 150], [0, 0, 1]);
  const accent = getAccent(anime.genres);
  const displayTitle = anime.title_english || anime.title;

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) onSwipe('left');
    else if (info.offset.x > SWIPE_THRESHOLD) onSwipe('right');
  }

  return (
    <motion.div
      className="nv-swipe-card"
      style={{
        x, rotate, position: 'absolute', width: '100%', height: '100%',
        borderRadius: 14, overflow: 'hidden', cursor: isFront ? 'grab' : 'default',
        background: '#0a0a12', border: '1px solid rgba(200,210,230,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', touchAction: 'none',
        zIndex: isFront ? 10 : 5,
      }}
      drag={isFront ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isFront ? 1 : 0.95, opacity: isFront ? 1 : 0.7 }}
      animate={{ scale: isFront ? 1 : 0.95, opacity: isFront ? 1 : 0.7 }}
      exit={{ x: exitDir === 'right' ? 400 : -400, opacity: 0, rotate: exitDir === 'right' ? 15 : -15, transition: { duration: 0.35, ease: 'easeIn' } }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {anime.cover_image && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <AnimeCoverImage
            src={anime.cover_image}
            alt={displayTitle}
            fill
            style={{ opacity: 0.4, pointerEvents: 'none' }}
          />
        </div>
      )}
      <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(239,68,68,0.15)', opacity: opacitySkip, pointerEvents: 'none', zIndex: 3 }} />
      <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(12,206,192,0.15)', opacity: opacityAdd, pointerEvents: 'none', zIndex: 3 }} />
      <motion.div style={{ position: 'absolute', top: 24, right: 24, zIndex: 4, opacity: opacitySkip, padding: '6px 16px', borderRadius: 6, border: '2px solid #ef4444', color: '#ef4444', fontSize: 18, fontWeight: 800, letterSpacing: '0.1em', fontFamily: "'Space Grotesk', sans-serif", transform: 'rotate(12deg)' }}>SKIP</motion.div>
      <motion.div style={{ position: 'absolute', top: 24, left: 24, zIndex: 4, opacity: opacityAdd, padding: '6px 16px', borderRadius: 6, border: '2px solid #0CCEC0', color: '#0CCEC0', fontSize: 18, fontWeight: 800, letterSpacing: '0.1em', fontFamily: "'Space Grotesk', sans-serif", transform: 'rotate(-12deg)' }}>ADD</motion.div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        background: 'linear-gradient(to top, rgba(5,5,8,1) 0%, rgba(5,5,8,0.95) 40%, rgba(5,5,8,0.6) 70%, transparent 100%)',
        padding: '60px 24px 24px', pointerEvents: 'none',
      }}>
        <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, marginBottom: 12, background: 'rgba(12,206,192,0.12)', border: '1px solid rgba(12,206,192,0.25)', fontSize: 11, fontWeight: 700, color: '#0CCEC0', letterSpacing: '0.05em', fontFamily: "'Space Grotesk', monospace" }}>
          {Math.round(anime.similarity * 100)}% match
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e8eaf6', marginBottom: 6, lineHeight: 1.2, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>{displayTitle}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(200,210,230,0.4)' }}>{anime.genres.slice(0, 3).join(' · ')}</span>
          {anime.total_episodes && <span style={{ fontSize: 12, color: 'rgba(200,210,230,0.3)' }}>{anime.total_episodes} ep</span>}
          <span style={{ fontSize: 12, color: '#0CCEC0', fontWeight: 600 }}>★ {anime.average_score}</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(200,210,230,0.45)', lineHeight: 1.55, fontFamily: "'Inter', sans-serif", overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
          {anime.synopsis || 'No synopsis available.'}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
          {anime.mood_tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, background: `${accent}18`, border: `1px solid ${accent}30`, color: accent, textTransform: 'uppercase', fontFamily: "'Space Grotesk', monospace" }}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SWIPE CARD STACK
   ═══════════════════════════════════════════════════════════════════════════ */

function SwipeCardStack({ results, onClose }: { results: AnimeResult[]; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDir, setExitDir] = useState<'left' | 'right'>('right');
  const [toast, setToast] = useState<{ text: string; type: 'add' | 'skip' } | null>(null);

  const showToast = (text: string, type: 'add' | 'skip') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleSwipe = async (dir: 'left' | 'right') => {
    const anime = results[currentIndex];
    setExitDir(dir);
    setCurrentIndex((i) => i + 1);

    if (dir === 'right') {
      try {
        const res = await fetch('/api/library/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anime_id: anime.id, status: 'plan_to_watch' }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`${anime.title_english || anime.title} added to Plan to Watch`, 'add');
        } else if (data.code === 'DUPLICATE_ENTRY') {
          showToast(`Already in library (${data.existing_status?.replace(/_/g, ' ')})`, 'skip');
        } else {
          showToast('Failed to add — sign in to save', 'skip');
        }
      } catch {
        showToast('Network error', 'skip');
      }
    } else {
      showToast('Skipped', 'skip');
    }
  };

  const isDone = currentIndex >= results.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <button type="button" onClick={onClose} aria-label="Close swipe modal" style={{
        position: 'absolute', top: 20, right: 24, zIndex: 110,
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,210,230,0.1)',
        borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
        color: 'rgba(200,210,230,0.5)', fontSize: 12, fontWeight: 600,
        fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em', transition: 'color 0.2s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#e8eaf6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(200,210,230,0.5)'; }}
      >✕ CLOSE</button>

      <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', fontSize: 12, color: 'rgba(200,210,230,0.3)', fontFamily: "'Space Grotesk', monospace", letterSpacing: '0.1em' }}>
        {isDone ? 'DONE' : `CARD ${currentIndex + 1} / ${results.length}`}
      </div>
      <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', width: 200, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
        <motion.div animate={{ width: `${(currentIndex / results.length) * 100}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', borderRadius: 2, background: '#0CCEC0' }} />
      </div>

      {isDone ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', color: '#e8eaf6', fontFamily: "'Space Grotesk', sans-serif" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>All cards reviewed!</div>
          <div style={{ fontSize: 13, color: 'rgba(200,210,230,0.4)', marginBottom: 24 }}>Check your library for saved shows</div>
          <button type="button" onClick={onClose} aria-label="Back to explore" style={{ padding: '10px 28px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#0CCEC0', color: '#050508', fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em' }}>BACK TO EXPLORE</button>
        </motion.div>
      ) : (
        <>
          <div className="nv-swipe-stack">
            <AnimatePresence>
              {results.slice(currentIndex, currentIndex + 2).map((anime, i) => (
                <SwipeCard key={anime.id} anime={anime} isFront={i === 0} onSwipe={handleSwipe} exitDir={exitDir} />
              ))}
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginTop: 24 }} className="nv-swipe-actions">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => handleSwipe('left')}
              style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: 22 }}
              aria-label="Skip">✕</motion.button>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => handleSwipe('right')}
              style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(12,206,192,0.1)', border: '2px solid rgba(12,206,192,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0CCEC0', fontSize: 22 }}
              aria-label="Add to library">✓</motion.button>
          </div>
        </>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            padding: '10px 20px', borderRadius: 8,
            background: toast.type === 'add' ? 'rgba(12,206,192,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${toast.type === 'add' ? 'rgba(12,206,192,0.3)' : 'rgba(200,210,230,0.1)'}`,
            color: toast.type === 'add' ? '#0CCEC0' : 'rgba(200,210,230,0.5)',
            fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", whiteSpace: 'nowrap', zIndex: 120,
          }}>
            {toast.type === 'add' ? '✓ ' : ''}{toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIBE CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function VibeCard({ preset, isSelected, onSelect, index }: {
  preset: typeof VIBE_PRESETS[0]; isSelected: boolean; onSelect: () => void; index: number;
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${preset.title} vibe`}
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      style={{
        background: isSelected ? preset.bg : 'rgba(13,13,22,0.7)',
        border: `1px solid ${isSelected ? preset.accentColor : 'rgba(200,210,230,0.08)'}`,
        borderRadius: 12, padding: '28px 24px', cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.25s ease, background 0.25s ease',
        borderLeft: `3px solid ${isSelected ? preset.accentColor : 'rgba(200,210,230,0.12)'}`,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 16, lineHeight: 1 }}>{preset.emoji}</div>
      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#e8eaf6', letterSpacing: '0.06em', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.3 }}>{preset.title}</h3>
      <p style={{ fontSize: 12, color: isSelected ? 'rgba(200,210,230,0.65)' : 'rgba(200,210,230,0.38)', lineHeight: 1.6, fontWeight: 400, transition: 'color 0.25s ease' }}>{preset.desc}</p>
      {isSelected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: 16, right: 16, width: 20, height: 20, borderRadius: '50%', background: preset.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#050508" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <span style={{ color: '#0CCEC0', fontSize: 12, fontWeight: 600, letterSpacing: '0.15em' }}>//</span>
      <span style={{ color: '#0CCEC0', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Space Grotesk', monospace" }}>{text}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPLORE PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ExplorePage() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnimeResult[] | null>(null);
  const [error, setError] = useState('');
  const [swipeOpen, setSwipeOpen] = useState(false);
  const [meta, setMeta] = useState<ExploreResponse['metadata'] | null>(null);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) { next.delete(tag); } else if (next.size < MAX_TAGS) { next.add(tag); }
      return next;
    });
  }

  const canRun = selectedPreset !== null || selectedTags.size > 0;

  const handleDiscover = useCallback(async () => {
    if (!canRun || loading) return;
    setLoading(true);
    setError('');
    setResults(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: Record<string, any>;

    if (selectedPreset) {
      body = { mode: 'vibe_starter', vibe_id: selectedPreset, match_count: 15 };
    } else {
      body = { mode: 'tags', tags: Array.from(selectedTags).map((t) => t.toLowerCase()), match_count: 15 };
    }

    try {
      const res = await fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data: ExploreResponse = await res.json();

      if (data.success && data.results.length > 0) {
        setResults(data.results);
        setMeta(data.metadata);
        setSwipeOpen(true);
      } else if (data.success && data.results.length === 0) {
        setError('No matches found for this vibe. Try different tags.');
      } else {
        setError(data.error || 'Discovery failed');
      }
    } catch {
      setError('Network error — check your connection');
    } finally {
      setLoading(false);
    }
  }, [canRun, loading, selectedPreset, selectedTags]);

  const hasResults = results && results.length > 0;

  return (
    <div style={{ background: '#050508', minHeight: '100vh', position: 'relative' }}>
      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(12,206,192,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(12,206,192,0.025) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <Navbar active="explore" />

      <div style={{ paddingTop: 64, position: 'relative', zIndex: 10 }}>

        {/* ─── Section 1: Pick Your Signal ─── */}
        <section style={{ padding: '64px 40px 80px', maxWidth: 1100, marginInline: 'auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SectionLabel text="VIBE_SELECTOR" />
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#e8eaf6', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
              Pick Your Signal
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(200,210,230,0.45)', lineHeight: 1.7, maxWidth: 380, marginBottom: 48 }}>
              Not sure where to start? Choose a frequency or build your own custom signal.
            </p>
          </motion.div>

          <div className="nv-explore-grid">
            {VIBE_PRESETS.map((preset, i) => (
              <VibeCard key={preset.id} preset={preset} isSelected={selectedPreset === preset.id}
                onSelect={() => { setSelectedPreset(selectedPreset === preset.id ? null : preset.id); setSelectedTags(new Set()); }}
                index={i} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(12,206,192,0.1), transparent)', maxWidth: 1100, marginInline: 'auto' }} />

        {/* ─── Section 2: Build your own signal ─── */}
        <section style={{ padding: '72px 40px 100px', maxWidth: 1100, marginInline: 'auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel text="MANUAL_INPUT" />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#e8eaf6', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Or build your own signal
              </h2>
              <span style={{ fontSize: 12, color: '#0CCEC0', fontWeight: 600, letterSpacing: '0.18em', fontFamily: "'Space Grotesk', monospace" }}>
                {selectedTags.size} / {MAX_TAGS} ACTIVE
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}>
            {TAGS.map((tag, i) => {
              const isSel = selectedTags.has(tag);
              const maxed = selectedTags.size >= MAX_TAGS && !isSel;
              return (
                <motion.button key={tag} type="button" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: 0.03 * i }}
                  whileHover={!maxed ? { scale: 1.05 } : undefined} whileTap={!maxed ? { scale: 0.97 } : undefined}
                  aria-pressed={isSel}
                  aria-label={`${isSel ? 'Deselect' : 'Select'} tag ${tag}`}
                  onClick={() => { toggleTag(tag); setSelectedPreset(null); }}
                  style={{
                    padding: '7px 16px', borderRadius: 6,
                    border: isSel ? '1px solid #0CCEC0' : '1px solid rgba(200,210,230,0.14)',
                    background: isSel ? 'rgba(12,206,192,0.1)' : 'rgba(255,255,255,0.02)',
                    color: isSel ? '#0CCEC0' : 'rgba(200,210,230,0.5)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', fontFamily: "'Space Grotesk', monospace",
                    cursor: maxed ? 'not-allowed' : 'pointer', opacity: maxed ? 0.3 : 1,
                    transition: 'all 0.2s ease', boxShadow: isSel ? '0 0 10px rgba(12,206,192,0.12)' : 'none', textTransform: 'uppercase',
                  }}>{tag}</motion.button>
              );
            })}
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
              padding: '12px 16px', borderRadius: 8, marginBottom: 24, textAlign: 'center',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 13,
            }}>{error}</motion.div>
          )}

          {/* Results summary bar */}
          {hasResults && !swipeOpen && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
              padding: '14px 18px', borderRadius: 8, marginBottom: 32,
              background: 'rgba(12,206,192,0.04)', border: '1px solid rgba(12,206,192,0.12)',
            }}>
              <span style={{ fontSize: 13, color: 'rgba(200,210,230,0.5)', fontFamily: "'Space Grotesk', sans-serif" }}>
                Found <strong style={{ color: '#0CCEC0' }}>{meta?.total_results}</strong> shows · avg {meta ? Math.round(meta.avg_similarity * 100) : 0}% match
              </span>
              <button type="button" onClick={() => setSwipeOpen(true)} aria-label="Open swipe cards" style={{
                padding: '8px 20px', borderRadius: 6, border: '1px solid rgba(12,206,192,0.3)', background: 'rgba(12,206,192,0.08)',
                color: '#0CCEC0', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer',
              }}>SWIPE CARDS</button>
            </motion.div>
          )}

          {/* RUN DISCOVERY button */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.button
              type="button"
              aria-disabled={!canRun || loading}
              whileHover={canRun && !loading ? { scale: 1.02, borderColor: 'rgba(12,206,192,0.5)', backgroundColor: 'rgba(12,206,192,0.06)' } : undefined}
              whileTap={canRun && !loading ? { scale: 0.98 } : undefined}
              onClick={handleDiscover}
              style={{
                padding: '16px 0', width: '100%', maxWidth: 480, borderRadius: 8,
                border: `1px solid ${canRun ? 'rgba(12,206,192,0.25)' : 'rgba(200,210,230,0.1)'}`,
                background: 'rgba(255,255,255,0.02)',
                color: canRun ? 'rgba(200,210,230,0.6)' : 'rgba(200,210,230,0.2)',
                fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', monospace",
                cursor: canRun && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'ANALYZING VIBE...' : 'RUN DISCOVERY'}
            </motion.button>
          </motion.div>
        </section>
      </div>

      {/* Swipe overlay */}
      <AnimatePresence>
        {swipeOpen && hasResults && (
          <SwipeCardStack key="explore-swipe" results={results!} onClose={() => setSwipeOpen(false)} />
        )}
      </AnimatePresence>

      <style>{`
        .nv-explore-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .nv-swipe-stack {
          position: relative; width: 350px; height: 500px;
        }
        .nv-swipe-actions { margin-top: 28px; }

        @media (max-width: 768px) {
          .nv-explore-grid { grid-template-columns: repeat(2, 1fr); }
          .nv-swipe-stack { width: calc(100vw - 48px); height: 70vh; max-height: 520px; }
          .nv-swipe-actions { margin-top: 20px; }
        }
        @media (max-width: 480px) {
          .nv-explore-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

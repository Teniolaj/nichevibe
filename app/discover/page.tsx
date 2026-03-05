'use client';

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

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

interface DiscoverResponse {
  success: boolean;
  query: string;
  results: AnimeResult[];
  metadata: { total_results: number; avg_similarity: number; processing_time_ms: number };
  error?: string;
}

type ViewMode = 'grid' | 'swipe';

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
   SWIPE CARD — single draggable card with spring physics
   ═══════════════════════════════════════════════════════════════════════════ */

const SWIPE_THRESHOLD = 100;

function SwipeCard({
  anime, onSwipe, isFront, exitDir,
}: {
  anime: AnimeResult;
  onSwipe: (dir: 'left' | 'right') => void;
  isFront: boolean;
  exitDir: 'left' | 'right';
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
        x, rotate,
        position: 'absolute', width: '100%', height: '100%',
        borderRadius: 14, overflow: 'hidden', cursor: isFront ? 'grab' : 'default',
        background: '#0a0a12',
        border: '1px solid rgba(200,210,230,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        touchAction: 'none',
        zIndex: isFront ? 10 : 5,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isFront ? 1 : 0.95, opacity: isFront ? 1 : 0.7 }}
      animate={{ scale: isFront ? 1 : 0.95, opacity: isFront ? 1 : 0.7 }}
      exit={{ x: exitDir === 'right' ? 400 : -400, opacity: 0, rotate: exitDir === 'right' ? 15 : -15, transition: { duration: 0.35, ease: 'easeIn' } }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Cover image */}
      {anime.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={anime.cover_image} alt={displayTitle}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.4, pointerEvents: 'none',
          }}
        />
      )}

      {/* Swipe direction overlays */}
      <motion.div style={{
        position: 'absolute', inset: 0, background: 'rgba(239,68,68,0.15)',
        opacity: opacitySkip, pointerEvents: 'none', zIndex: 3,
      }} />
      <motion.div style={{
        position: 'absolute', inset: 0, background: 'rgba(12,206,192,0.15)',
        opacity: opacityAdd, pointerEvents: 'none', zIndex: 3,
      }} />

      {/* SKIP label */}
      <motion.div style={{
        position: 'absolute', top: 24, right: 24, zIndex: 4, opacity: opacitySkip,
        padding: '6px 16px', borderRadius: 6, border: '2px solid #ef4444',
        color: '#ef4444', fontSize: 18, fontWeight: 800, letterSpacing: '0.1em',
        fontFamily: "'Space Grotesk', sans-serif", transform: 'rotate(12deg)',
      }}>
        SKIP
      </motion.div>

      {/* ADD label */}
      <motion.div style={{
        position: 'absolute', top: 24, left: 24, zIndex: 4, opacity: opacityAdd,
        padding: '6px 16px', borderRadius: 6, border: '2px solid #0CCEC0',
        color: '#0CCEC0', fontSize: 18, fontWeight: 800, letterSpacing: '0.1em',
        fontFamily: "'Space Grotesk', sans-serif", transform: 'rotate(-12deg)',
      }}>
        ADD
      </motion.div>

      {/* Content area */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        background: 'linear-gradient(to top, rgba(5,5,8,1) 0%, rgba(5,5,8,0.95) 40%, rgba(5,5,8,0.6) 70%, transparent 100%)',
        padding: '60px 24px 24px', pointerEvents: 'none',
      }}>
        {/* Similarity */}
        <div style={{
          display: 'inline-block', padding: '3px 10px', borderRadius: 4, marginBottom: 12,
          background: 'rgba(12,206,192,0.12)', border: '1px solid rgba(12,206,192,0.25)',
          fontSize: 11, fontWeight: 700, color: '#0CCEC0', letterSpacing: '0.05em',
          fontFamily: "'Space Grotesk', monospace",
        }}>
          {Math.round(anime.similarity * 100)}% match
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: '#e8eaf6', marginBottom: 6,
          lineHeight: 1.2, fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.02em',
        }}>
          {displayTitle}
        </h2>

        {/* Metadata row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(200,210,230,0.4)' }}>
            {anime.genres.slice(0, 3).join(' · ')}
          </span>
          {anime.total_episodes && (
            <span style={{ fontSize: 12, color: 'rgba(200,210,230,0.3)' }}>
              {anime.total_episodes} ep
            </span>
          )}
          <span style={{ fontSize: 12, color: '#0CCEC0', fontWeight: 600 }}>
            ★ {anime.average_score}
          </span>
        </div>

        {/* Synopsis */}
        <p style={{
          fontSize: 13, color: 'rgba(200,210,230,0.45)', lineHeight: 1.55,
          fontFamily: "'Inter', sans-serif",
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
        }}>
          {anime.synopsis || 'No synopsis available.'}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
          {anime.mood_tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
              padding: '3px 8px', borderRadius: 4,
              background: `${accent}18`, border: `1px solid ${accent}30`,
              color: accent, textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', monospace",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SWIPE CARD STACK — manages index, buttons, progress, toasts
   ═══════════════════════════════════════════════════════════════════════════ */

function SwipeCardStack({
  results, onClose,
}: {
  results: AnimeResult[];
  onClose: () => void;
}) {
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
          showToast('Failed to add', 'skip');
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 24, zIndex: 110,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,210,230,0.1)',
          borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
          color: 'rgba(200,210,230,0.5)', fontSize: 12, fontWeight: 600,
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em',
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#e8eaf6'; e.currentTarget.style.borderColor = 'rgba(200,210,230,0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(200,210,230,0.5)'; e.currentTarget.style.borderColor = 'rgba(200,210,230,0.1)'; }}
      >
        ✕ CLOSE
      </button>

      {/* Progress */}
      <div style={{
        position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
        fontSize: 12, color: 'rgba(200,210,230,0.3)', fontFamily: "'Space Grotesk', monospace",
        letterSpacing: '0.1em',
      }}>
        {isDone ? 'DONE' : `CARD ${currentIndex + 1} / ${results.length}`}
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)',
      }}>
        <motion.div
          animate={{ width: `${((currentIndex) / results.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', borderRadius: 2, background: '#0CCEC0' }}
        />
      </div>

      {isDone ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', color: '#e8eaf6', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>All cards reviewed!</div>
          <div style={{ fontSize: 13, color: 'rgba(200,210,230,0.4)', marginBottom: 24 }}>
            Check your library for saved shows
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 28px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: '#0CCEC0', color: '#050508', fontSize: 13, fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em',
            }}
          >
            BACK TO RESULTS
          </button>
        </motion.div>
      ) : (
        <>
          {/* Card stack */}
          <div className="nv-swipe-stack">
            <AnimatePresence>
              {results.slice(currentIndex, currentIndex + 2).map((anime, i) => (
                <SwipeCard
                  key={anime.id}
                  anime={anime}
                  isFront={i === 0}
                  onSwipe={handleSwipe}
                  exitDir={exitDir}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex', gap: 32, alignItems: 'center', marginTop: 24,
          }}
            className="nv-swipe-actions"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSwipe('left')}
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ef4444', fontSize: 22, transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              aria-label="Skip"
            >
              ✕
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSwipe('right')}
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(12,206,192,0.1)', border: '2px solid rgba(12,206,192,0.3)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0CCEC0', fontSize: 22, transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(12,206,192,0.2)'; e.currentTarget.style.borderColor = 'rgba(12,206,192,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(12,206,192,0.1)'; e.currentTarget.style.borderColor = 'rgba(12,206,192,0.3)'; }}
              aria-label="Add to library"
            >
              ✓
            </motion.button>
          </div>
        </>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
              padding: '10px 20px', borderRadius: 8,
              background: toast.type === 'add' ? 'rgba(12,206,192,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${toast.type === 'add' ? 'rgba(12,206,192,0.3)' : 'rgba(200,210,230,0.1)'}`,
              color: toast.type === 'add' ? '#0CCEC0' : 'rgba(200,210,230,0.5)',
              fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
              whiteSpace: 'nowrap', zIndex: 120,
            }}
          >
            {toast.type === 'add' ? '✓ ' : ''}{toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GRID VIEW COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function AnimeCard({ anime, index }: { anime: AnimeResult; index: number }) {
  const [hovered, setHovered] = useState(false);
  const accent = getAccent(anime.genres);
  const displayTitle = anime.title_english || anime.title;

  return (
    <motion.div
      className="nv-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${hovered ? accent + '55' : 'rgba(200,210,230,0.07)'}`,
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 32px ${accent}22` : 'none',
        background: '#080810',
      }}
    >
      {anime.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={anime.cover_image} alt={displayTitle}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: hovered ? 0.55 : 0.45, transition: 'opacity 0.3s ease',
          }}
        />
      )}
      {!anime.cover_image && (
        <>
          <div style={{
            position: 'absolute', bottom: -30, right: -30, width: 140, height: 140, borderRadius: '50%',
            background: accent, opacity: hovered ? 0.22 : 0.1, filter: 'blur(40px)',
            transition: 'opacity 0.3s ease', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: -10, left: -10, width: 80, height: 80, borderRadius: '50%',
            background: accent, opacity: hovered ? 0.13 : 0.06, filter: 'blur(25px)',
            transition: 'opacity 0.3s ease', pointerEvents: 'none',
          }} />
        </>
      )}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 2,
        padding: '4px 10px', borderRadius: 4, background: 'rgba(5,5,8,0.85)',
        border: `1px solid ${accent}50`, fontSize: 9, fontWeight: 700,
        color: accent, letterSpacing: '0.12em', fontFamily: "'Space Grotesk', monospace",
        textTransform: 'uppercase', backdropFilter: 'blur(6px)',
      }}>
        {anime.genres[0] || 'Anime'}
      </div>
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 2,
        padding: '3px 8px', borderRadius: 4, background: 'rgba(12,206,192,0.15)',
        border: '1px solid rgba(12,206,192,0.3)', fontSize: 9, fontWeight: 700,
        color: '#0CCEC0', letterSpacing: '0.05em', fontFamily: "'Space Grotesk', monospace",
        backdropFilter: 'blur(6px)',
      }}>
        {Math.round(anime.similarity * 100)}% match
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        background: 'linear-gradient(to top, rgba(5,5,8,0.98) 0%, rgba(5,5,8,0.7) 50%, transparent 100%)',
        padding: '44px 12px 14px',
      }}>
        <div className="nv-tags" style={{ gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {anime.mood_tags.slice(0, 2).map((tag) => (
            <span key={tag} style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', padding: '2px 7px',
              borderRadius: 3, background: `${accent}20`, border: `1px solid ${accent}35`,
              color: accent, textTransform: 'uppercase', fontFamily: "'Space Grotesk', monospace", whiteSpace: 'nowrap',
            }}>{tag}</span>
          ))}
        </div>
        <h3 style={{
          fontSize: 13, fontWeight: 700, color: '#e8eaf6', marginBottom: 5, lineHeight: 1.3,
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em',
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {displayTitle}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'rgba(200,210,230,0.35)', fontWeight: 400 }}>
            {anime.total_episodes ? `${anime.total_episodes} ep` : '—'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 11, color: '#0CCEC0' }}>★</span>
            <span style={{ fontSize: 11, color: '#0CCEC0', fontWeight: 600 }}>{anime.average_score}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      className="nv-card"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.04 }}
      style={{
        borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(200,210,230,0.06)', position: 'relative',
      }}
    >
      <div className="nv-skeleton-shimmer" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', bottom: 14, left: 12, right: 12 }}>
        <div style={{ width: '60%', height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
        <div style={{ width: '40%', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIEW MODE TOGGLE
   ═══════════════════════════════════════════════════════════════════════════ */

function ViewToggle({ mode, onChange, mobileFirst }: { mode: ViewMode; onChange: (m: ViewMode) => void; mobileFirst?: boolean }) {
  const options: [ViewMode, string][] = mobileFirst
    ? [['swipe', 'Swipe'], ['grid', 'Grid']]
    : [['grid', 'Grid'], ['swipe', 'Swipe']];

  return (
    <div style={{
      display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)',
      borderRadius: 8, border: '1px solid rgba(200,210,230,0.08)', overflow: 'hidden',
    }}>
      {options.map(([val, label]) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          style={{
            padding: '6px 16px', border: 'none', cursor: 'pointer',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase',
            background: mode === val ? 'rgba(12,206,192,0.12)' : 'transparent',
            color: mode === val ? '#0CCEC0' : 'rgba(200,210,230,0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          {val === 'grid' ? '▦ ' : '◇ '}{label}
        </button>
      ))}
    </div>
  );
}

/* ─── Grid pattern ─── */
function GridOverlay() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `
        linear-gradient(rgba(12,206,192,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(12,206,192,0.025) 1px, transparent 1px)
      `, backgroundSize: '60px 60px',
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN DISCOVER PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnimeResult[] | null>(null);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [error, setError] = useState('');
  const [meta, setMeta] = useState<DiscoverResponse['metadata'] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [swipeOpen, setSwipeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true); setError(''); setResults(null); setSearchedQuery(q); setMeta(null);
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, match_count: 20 }),
      });
      const data: DiscoverResponse = await res.json();
      if (!data.success) { setError(data.error || 'Search failed'); setResults([]); return; }
      setResults(data.results);
      setMeta(data.metadata);
      if (isMobile && data.results.length > 0) {
        setViewMode('swipe');
        setSwipeOpen(true);
      }
    } catch { setError('Network error. Please try again.'); setResults([]); }
    finally { setLoading(false); }
  }, [query, loading, isMobile]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  const hasSearched = results !== null;
  const hasResults = hasSearched && results!.length > 0;

  const handleViewChange = (m: ViewMode) => {
    setViewMode(m);
    if (m === 'swipe' && hasResults) setSwipeOpen(true);
  };

  return (
    <div style={{ background: '#050508', minHeight: '100vh', position: 'relative' }}>
      <GridOverlay />
      <Navbar active="discover" />

      <div style={{ paddingTop: 64, position: 'relative', zIndex: 10 }}>
        <div className="nv-discover-container">

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 800, color: '#e8eaf6', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10,
            }}>
              Discover
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(200,210,230,0.4)', lineHeight: 1.6, maxWidth: 460 }}>
              Type an anime title or describe a vibe — we&apos;ll find shows that match.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="nv-search-bar"
            style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${focused ? 'rgba(12,206,192,0.35)' : 'rgba(200,210,230,0.12)'}`,
              borderRadius: 10, padding: '0 14px', marginBottom: 32,
              transition: 'border-color 0.2s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(200,210,230,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text" placeholder="Search by title or vibe... (press Enter)"
              value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} disabled={loading}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#e8eaf6', fontSize: 14, padding: '13px 12px',
                fontFamily: "'Inter', sans-serif", caretColor: '#0CCEC0', minWidth: 0,
                opacity: loading ? 0.5 : 1,
              }}
            />
            <button onClick={handleSearch} disabled={loading || !query.trim()} style={{
              background: 'none', border: 'none', cursor: loading ? 'wait' : 'pointer',
              padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0,
              color: loading ? '#0CCEC0' : query.trim() ? '#0CCEC0' : 'rgba(200,210,230,0.2)',
              transition: 'color 0.2s',
            }}>
              {loading ? (
                <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </motion.svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{
              padding: '12px 16px', borderRadius: 8, marginBottom: 24,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', fontSize: 13, fontFamily: "'Inter', sans-serif",
            }}>
              {error}
            </motion.div>
          )}

          {/* Results header + view toggle */}
          {hasSearched && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20, flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{
                  fontSize: 12, color: 'rgba(200,210,230,0.35)', letterSpacing: '0.08em',
                  textTransform: 'uppercase', fontFamily: "'Space Grotesk', monospace",
                }}>
                  {results!.length} result{results!.length !== 1 ? 's' : ''} for &ldquo;{searchedQuery}&rdquo;
                </span>
                {meta && (
                  <span style={{ fontSize: 11, color: 'rgba(200,210,230,0.2)', fontFamily: "'Space Grotesk', monospace" }}>
                    {meta.processing_time_ms}ms · avg {Math.round(meta.avg_similarity * 100)}% match
                  </span>
                )}
              </div>
              {hasResults && <ViewToggle mode={viewMode} onChange={handleViewChange} mobileFirst={isMobile} />}
            </motion.div>
          )}

          {/* Grid content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className="nv-card-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
              </motion.div>
            ) : hasResults ? (
              <motion.div key="results" className="nv-card-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {results!.map((anime, i) => <AnimeCard key={anime.id} anime={anime} index={i} />)}
              </motion.div>
            ) : hasSearched ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                textAlign: 'center', padding: '80px 0', color: 'rgba(200,210,230,0.25)', fontFamily: "'Space Grotesk', sans-serif",
              }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>◎</div>
                <div style={{ fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>No signal found in the void</div>
                <div style={{ fontSize: 12, marginTop: 8, color: 'rgba(200,210,230,0.15)' }}>Try a different title or describe the vibe you&apos;re looking for</div>
              </motion.div>
            ) : (
              <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                textAlign: 'center', padding: '80px 0', color: 'rgba(200,210,230,0.2)', fontFamily: "'Space Grotesk', sans-serif",
              }}>
                <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>⚡</div>
                <div style={{ fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, color: 'rgba(200,210,230,0.3)' }}>Enter a title or vibe to begin</div>
                <div style={{ fontSize: 12, color: 'rgba(200,210,230,0.15)', maxWidth: 360, marginInline: 'auto', lineHeight: 1.6 }}>
                  Try &ldquo;Death Note&rdquo;, &ldquo;Attack on Titan&rdquo;, or describe a mood like &ldquo;dark psychological thriller&rdquo;
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Swipe modal overlay ─── */}
      <AnimatePresence>
        {swipeOpen && hasResults && (
          <SwipeCardStack
            key="swipe-stack"
            results={results!}
            onClose={() => { setSwipeOpen(false); setViewMode('grid'); }}
          />
        )}
      </AnimatePresence>

      {/* ─── Styles ─── */}
      <style>{`
        .nv-discover-container { max-width: 1100px; margin-inline: auto; padding: 48px 40px 80px; }
        .nv-search-bar { max-width: 520px; }
        .nv-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 16px; }
        .nv-card { height: 300px; width: 100%; }
        .nv-tags { display: none; }
        .nv-card:hover .nv-tags { display: flex; }

        .nv-swipe-stack {
          position: relative;
          width: 350px; height: 500px;
        }
        .nv-swipe-actions { margin-top: 28px; }

        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .nv-skeleton-shimmer::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
          animation: shimmer 1.5s infinite;
        }

        @media (max-width: 640px) {
          .nv-discover-container { padding: 28px 16px 64px; }
          .nv-search-bar { max-width: 100%; margin-bottom: 24px; }
          .nv-card-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .nv-card { height: 260px; }
          .nv-tags { display: flex; }
          .nv-swipe-stack { width: calc(100vw - 48px); height: 70vh; max-height: 520px; }
          .nv-swipe-actions { margin-top: 20px; }
        }
        @media (max-width: 380px) {
          .nv-card { height: 230px; }
          .nv-swipe-stack { width: calc(100vw - 32px); height: 65vh; }
        }
      `}</style>
    </div>
  );
}

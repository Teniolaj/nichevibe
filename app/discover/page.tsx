'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';

/* ─── Anime data ─── */
const ANIME_LIST = [
  {
    id: 1,
    title: 'Serial Experiments Lain',
    year: 1998,
    rating: 8.5,
    genre: 'Psychological',
    tags: ['Cyberpunk', 'Existential', 'Surreal'],
    color: '#1a0a2e',
    accent: '#7c3aed',
    poster: null,
  },
  {
    id: 2,
    title: 'Haibane Renmei',
    year: 2002,
    rating: 8.3,
    genre: 'Slice of Life',
    tags: ['Atmospheric', 'Philosophical', 'Melancholy'],
    color: '#0a1628',
    accent: '#0CCEC0',
    poster: null,
  },
  {
    id: 3,
    title: 'Texhnolyze',
    year: 2003,
    rating: 8.2,
    genre: 'Cyberpunk',
    tags: ['Dark', 'Dystopian', 'Cerebral'],
    color: '#0d0a1a',
    accent: '#6366f1',
    poster: null,
  },
  {
    id: 4,
    title: 'Ergo Proxy',
    year: 2006,
    rating: 7.9,
    genre: 'Sci-Fi',
    tags: ['Psychological', 'Dystopian', 'Philosophical'],
    color: '#0a1a10',
    accent: '#10b981',
    poster: null,
  },
  {
    id: 5,
    title: 'Paranoia Agent',
    year: 2004,
    rating: 8.0,
    genre: 'Mystery',
    tags: ['Psychological', 'Surreal', 'Dark'],
    color: '#1a0a0a',
    accent: '#ef4444',
    poster: null,
  },
  {
    id: 6,
    title: 'Kino no Tabi',
    year: 2003,
    rating: 8.6,
    genre: 'Philosophical',
    tags: ['Episodic', 'Contemplative', 'Journey'],
    color: '#0a120a',
    accent: '#84cc16',
    poster: null,
  },
  {
    id: 7,
    title: 'Mousou Dairinin',
    year: 2004,
    rating: 7.8,
    genre: 'Mystery',
    tags: ['Dark', 'Surreal', 'Social Commentary'],
    color: '#1a100a',
    accent: '#f97316',
    poster: null,
  },
  {
    id: 8,
    title: 'NHK ni Youkoso',
    year: 2006,
    rating: 8.4,
    genre: 'Slice of Life',
    tags: ['Social Anxiety', 'Dark Comedy', 'NEET'],
    color: '#0a0d1a',
    accent: '#3b82f6',
    poster: null,
  },
  {
    id: 9,
    title: 'Kaiba',
    year: 2008,
    rating: 8.1,
    genre: 'Sci-Fi',
    tags: ['Surreal', 'Memory', 'Identity'],
    color: '#1a0a1a',
    accent: '#ec4899',
    poster: null,
  },
  {
    id: 10,
    title: 'Ryuu to Freckles',
    year: 2010,
    rating: 7.7,
    genre: 'Slice of Life',
    tags: ['Bittersweet', 'Quiet', 'Mature'],
    color: '#0e0a14',
    accent: '#a78bfa',
    poster: null,
  },
];

/* ─── Anime Card ─── */
function AnimeCard({
  anime,
  index,
  featured,
}: {
  anime: (typeof ANIME_LIST)[0];
  index: number;
  featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`nv-card${featured ? ' nv-card--featured' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${hovered ? anime.accent + '55' : 'rgba(200,210,230,0.07)'}`,
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 32px ${anime.accent}22` : 'none',
        background: `linear-gradient(160deg, ${anime.color} 0%, #080810 100%)`,
      }}
    >
      {/* Ambient glow — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: anime.accent,
          opacity: hovered ? 0.22 : 0.1,
          filter: 'blur(40px)',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />
      {/* Ambient glow — top left */}
      <div
        style={{
          position: 'absolute',
          top: -10,
          left: -10,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: anime.accent,
          opacity: hovered ? 0.13 : 0.06,
          filter: 'blur(25px)',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Genre badge */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          padding: '4px 10px',
          borderRadius: 4,
          background: 'rgba(5,5,8,0.8)',
          border: `1px solid ${anime.accent}45`,
          fontSize: 9,
          fontWeight: 700,
          color: anime.accent,
          letterSpacing: '0.12em',
          fontFamily: "'Space Grotesk', monospace",
          textTransform: 'uppercase',
          backdropFilter: 'blur(6px)',
        }}
      >
        {anime.genre}
      </div>

      {/* Bottom scrim + info */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          background:
            'linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.55) 60%, transparent 100%)',
          padding: '44px 12px 14px',
        }}
      >
        {/* Tags — always visible on mobile, hover-revealed on desktop */}
        <div className="nv-tags-wrap" style={{ marginBottom: 8 }}>
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="nv-tags-hover"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}
              >
                {anime.tags.slice(0, 2).map((tag) => (
                  <TagPill key={tag} tag={tag} accent={anime.accent} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Always-visible on mobile */}
          <div className="nv-tags-mobile" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {anime.tags.slice(0, 2).map((tag) => (
              <TagPill key={tag} tag={tag} accent={anime.accent} />
            ))}
          </div>
        </div>

        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#e8eaf6',
            marginBottom: 5,
            lineHeight: 1.3,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {anime.title}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{ fontSize: 11, color: 'rgba(200,210,230,0.35)', fontWeight: 400 }}
          >
            {anime.year}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 11, color: '#0CCEC0' }}>★</span>
            <span style={{ fontSize: 11, color: '#0CCEC0', fontWeight: 600 }}>
              {anime.rating}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TagPill({ tag, accent }: { tag: string; accent: string }) {
  return (
    <span
      style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.1em',
        padding: '2px 7px',
        borderRadius: 3,
        background: `${accent}20`,
        border: `1px solid ${accent}35`,
        color: accent,
        textTransform: 'uppercase',
        fontFamily: "'Space Grotesk', monospace",
        whiteSpace: 'nowrap',
      }}
    >
      {tag}
    </span>
  );
}

/* ─── Grid overlay ─── */
function GridOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(12,206,192,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(12,206,192,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

/* ─── Main Discover Page ─── */
export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return ANIME_LIST;
    const q = query.toLowerCase();
    return ANIME_LIST.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div style={{ background: '#050508', minHeight: '100vh', position: 'relative' }}>
      <GridOverlay />
      <Navbar active="discover" />

      <div style={{ paddingTop: 64, position: 'relative', zIndex: 10 }}>
        <div className="nv-discover-container">

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 28 }}
          >
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                fontWeight: 800,
                color: '#e8eaf6',
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                marginBottom: 10,
              }}
            >
              Discover
            </h1>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(200,210,230,0.4)',
                lineHeight: 1.6,
                maxWidth: 460,
              }}
            >
              Search through the archives of the void. Find exactly what you&apos;re looking for.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="nv-search-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${focused ? 'rgba(12,206,192,0.35)' : 'rgba(200,210,230,0.12)'}`,
              borderRadius: 10,
              padding: '0 14px',
              marginBottom: 40,
              transition: 'border-color 0.2s ease',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(200,210,230,0.35)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder="Search by title, genre, or vibe..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e8eaf6',
                fontSize: 14,
                padding: '13px 12px',
                fontFamily: "'Inter', sans-serif",
                caretColor: '#0CCEC0',
                minWidth: 0,
              }}
            />

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: filterOpen ? '#0CCEC0' : 'rgba(200,210,230,0.35)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
          </motion.div>

          {/* Results count */}
          {query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: 12,
                color: 'rgba(200,210,230,0.35)',
                marginBottom: 20,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </motion.div>
          )}

          {/* Card grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="results"
                className="nv-card-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filtered.map((anime, i) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    index={i}
                    featured={i === 1}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '80px 0',
                  color: 'rgba(200,210,230,0.25)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>◎</div>
                <div
                  style={{
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  No signal found in the void
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer tagline */}
          <div
            style={{
              marginTop: 64,
              textAlign: 'center',
              fontSize: 11,
              color: 'rgba(200,210,230,0.15)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            THE VOID HAS {ANIME_LIST.length} SIGNALS INDEXED
          </div>
        </div>
      </div>

      {/* ─── Responsive styles ─── */}
      <style>{`
        /* ── Page container ── */
        .nv-discover-container {
          max-width: 1100px;
          margin-inline: auto;
          padding: 48px 40px 80px;
        }

        /* ── Search bar ── */
        .nv-search-bar {
          max-width: 460px;
        }

        /* ── Card grid: auto-fill wrap on desktop ── */
        .nv-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 16px;
        }

        /* ── Card: height and sizing ── */
        .nv-card {
          height: 280px;
          width: 100%;
        }
        .nv-card--featured {
          height: 320px;
        }

        /* ── Tags: desktop = hover only, mobile = always visible ── */
        .nv-tags-hover  { display: flex; }
        .nv-tags-mobile { display: none; }

        /* ══════════════════════════════════════
           MOBILE  ≤ 640px
        ══════════════════════════════════════ */
        @media (max-width: 640px) {
          .nv-discover-container {
            padding: 28px 16px 64px;
          }

          .nv-search-bar {
            max-width: 100%;
            margin-bottom: 28px;
          }

          /* 2-column grid, equal heights */
          .nv-card-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          /* Taller cards so content fits in portrait */
          .nv-card {
            height: 240px;
          }
          .nv-card--featured {
            height: 260px;
          }

          /* Tags always visible on touch — hide hover version */
          .nv-tags-hover  { display: none !important; }
          .nv-tags-mobile { display: flex; }
        }

        /* ══════════════════════════════════════
           SMALL MOBILE  ≤ 380px
        ══════════════════════════════════════ */
        @media (max-width: 380px) {
          .nv-card     { height: 210px; }
          .nv-card--featured { height: 230px; }
        }
      `}</style>
    </div>
  );
}

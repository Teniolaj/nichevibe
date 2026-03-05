'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

/* ─── Types ─── */
type Status = 'plan_to_watch' | 'watching' | 'completed' | 'on_hold' | 'dropped';

interface AnimeInfo {
  id: number;
  title: string;
  title_english?: string | null;
  cover_image?: string | null;
  total_episodes?: number | null;
  genres?: string[];
  average_score?: number | null;
}

interface LibraryItem {
  id: number;
  anime_id: number;
  status: Status;
  current_episode: number;
  personal_rating: number | null;
  notes: string | null;
  is_favorite: boolean;
  added_at: string;
  started_at: string | null;
  completed_at: string | null;
  last_updated: string;
  anime: AnimeInfo;
}

interface LibraryResponse {
  success: boolean;
  library: LibraryItem[];
  stats: Record<string, number>;
  error?: string;
}

/* ─── Constants ─── */
const TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'watching', label: 'Watching' },
  { key: 'plan_to_watch', label: 'Plan to Watch' },
  { key: 'completed', label: 'Completed' },
  { key: 'on_hold', label: 'On Hold' },
  { key: 'dropped', label: 'Dropped' },
];

const STATUS_COLORS: Record<Status, string> = {
  watching: '#3b82f6',
  plan_to_watch: '#0CCEC0',
  completed: '#10b981',
  on_hold: '#f59e0b',
  dropped: '#ef4444',
};

const STATUS_LABELS: Record<Status, string> = {
  watching: 'Watching',
  plan_to_watch: 'Plan to Watch',
  completed: 'Completed',
  on_hold: 'On Hold',
  dropped: 'Dropped',
};

/* ═══════════════════════════════════════════════════════════════════════════
   LIBRARY CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function LibraryCard({
  item, onUpdate, onRemove,
}: {
  item: LibraryItem;
  onUpdate: (id: number, updates: Record<string, unknown>) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [localStatus, setLocalStatus] = useState(item.status);
  const [localEp, setLocalEp] = useState(item.current_episode);
  const [localRating, setLocalRating] = useState(item.personal_rating);
  const [localNotes, setLocalNotes] = useState(item.notes || '');
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const color = STATUS_COLORS[item.status];
  const anime = item.anime;
  const displayTitle = anime.title_english || anime.title;
  const totalEp = anime.total_episodes;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(item.id, {
      status: localStatus,
      current_episode: localEp,
      personal_rating: localRating,
      notes: localNotes || null,
    });
    setSaving(false);
    setEditing(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        borderRadius: 10, overflow: 'hidden', position: 'relative',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? color + '40' : 'rgba(200,210,230,0.06)'}`,
        transition: 'border-color 0.25s ease',
      }}
    >
      {/* Cover section */}
      <div style={{ position: 'relative', height: 180, background: '#0a0a12' }}>
        {anime.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={anime.cover_image} alt={displayTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
          />
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(5,5,8,1) 0%, transparent 100%)',
          height: 80,
        }} />

        {/* Status badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10, padding: '3px 10px', borderRadius: 4,
          background: `${color}20`, border: `1px solid ${color}40`,
          fontSize: 9, fontWeight: 700, color, letterSpacing: '0.1em',
          fontFamily: "'Space Grotesk', monospace", textTransform: 'uppercase',
        }}>
          {STATUS_LABELS[item.status]}
        </div>

        {/* Favorite */}
        {item.is_favorite && (
          <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 16 }}>♥</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: '#e8eaf6', marginBottom: 6, lineHeight: 1.3,
          fontFamily: "'Space Grotesk', sans-serif",
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {displayTitle}
        </h3>

        {/* Episode progress */}
        {(item.status === 'watching' || totalEp) && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: 'rgba(200,210,230,0.4)', fontFamily: "'Space Grotesk', monospace" }}>
                Episode {localEp}{totalEp ? ` / ${totalEp}` : ''}
              </span>
              {item.personal_rating && (
                <span style={{ fontSize: 11, color: '#0CCEC0', fontWeight: 600 }}>
                  ★ {item.personal_rating}/10
                </span>
              )}
            </div>
            {totalEp && (
              <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: color,
                  width: `${Math.min((localEp / totalEp) * 100, 100)}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            )}
          </div>
        )}

        {/* Quick actions */}
        {!editing ? (
          <div style={{ display: 'flex', gap: 6 }}>
            {item.status === 'watching' && totalEp && localEp < totalEp && (
              <button
                onClick={() => {
                  const next = localEp + 1;
                  setLocalEp(next);
                  onUpdate(item.id, { current_episode: next });
                }}
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: `${color}15`, color, fontSize: 11, fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${color}25`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}
              >
                + EP
              </button>
            )}
            <button
              onClick={() => setEditing(true)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid rgba(200,210,230,0.08)',
                cursor: 'pointer', background: 'transparent', color: 'rgba(200,210,230,0.4)',
                fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#e8eaf6'; e.currentTarget.style.borderColor = 'rgba(200,210,230,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(200,210,230,0.4)'; e.currentTarget.style.borderColor = 'rgba(200,210,230,0.08)'; }}
            >
              EDIT
            </button>
          </div>
        ) : (
          /* ─── Edit panel ─── */
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
            {/* Status */}
            <label style={{ display: 'block', fontSize: 9, color: 'rgba(200,210,230,0.3)', letterSpacing: '0.12em', fontFamily: "'Space Grotesk', monospace", textTransform: 'uppercase', marginBottom: 4 }}>
              STATUS
            </label>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value as Status)}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6, marginBottom: 10,
                background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(200,210,230,0.1)',
                color: '#e8eaf6', fontSize: 12, fontFamily: "'Inter', sans-serif",
                outline: 'none', cursor: 'pointer',
              }}
            >
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            {/* Episode */}
            <label style={{ display: 'block', fontSize: 9, color: 'rgba(200,210,230,0.3)', letterSpacing: '0.12em', fontFamily: "'Space Grotesk', monospace", textTransform: 'uppercase', marginBottom: 4 }}>
              EPISODE
            </label>
            <input
              type="number" min={0} max={totalEp || 9999} value={localEp}
              onChange={(e) => setLocalEp(Math.max(0, parseInt(e.target.value) || 0))}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6, marginBottom: 10,
                background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(200,210,230,0.1)',
                color: '#e8eaf6', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none',
              }}
            />

            {/* Rating */}
            <label style={{ display: 'block', fontSize: 9, color: 'rgba(200,210,230,0.3)', letterSpacing: '0.12em', fontFamily: "'Space Grotesk', monospace", textTransform: 'uppercase', marginBottom: 4 }}>
              RATING (1-10)
            </label>
            <input
              type="number" min={1} max={10} value={localRating ?? ''}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setLocalRating(isNaN(v) ? null : Math.min(10, Math.max(1, v)));
              }}
              placeholder="—"
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6, marginBottom: 10,
                background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(200,210,230,0.1)',
                color: '#e8eaf6', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none',
              }}
            />

            {/* Notes */}
            <label style={{ display: 'block', fontSize: 9, color: 'rgba(200,210,230,0.3)', letterSpacing: '0.12em', fontFamily: "'Space Grotesk', monospace", textTransform: 'uppercase', marginBottom: 4 }}>
              NOTES
            </label>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Your thoughts..."
              rows={2}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6, marginBottom: 12,
                background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(200,210,230,0.1)',
                color: '#e8eaf6', fontSize: 12, fontFamily: "'Inter', sans-serif",
                outline: 'none', resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleSave} disabled={saving}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: '#0CCEC0', color: '#050508', fontSize: 11, fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em',
                  opacity: saving ? 0.5 : 1,
                }}
              >
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '7px 12px', borderRadius: 6, border: '1px solid rgba(200,210,230,0.1)',
                  cursor: 'pointer', background: 'transparent', color: 'rgba(200,210,230,0.4)',
                  fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                ✕
              </button>
              <button
                onClick={handleRemove} disabled={removing}
                style={{
                  padding: '7px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)',
                  cursor: 'pointer', background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                  fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
                  opacity: removing ? 0.5 : 1,
                }}
              >
                {removing ? '...' : 'DEL'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN LIBRARY PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LibraryPage() {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<Status | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLibrary = useCallback(async () => {
    try {
      const res = await fetch('/api/library/list');
      const data: LibraryResponse = await res.json();
      if (data.success) {
        setLibrary(data.library);
        setStats(data.stats);
        setError('');
      } else {
        setError(data.error || 'Failed to load library');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLibrary(); }, [fetchLibrary]);

  const handleUpdate = async (id: number, updates: Record<string, unknown>) => {
    await fetch('/api/library/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ library_item_id: id, ...updates }),
    });
    fetchLibrary();
  };

  const handleRemove = async (id: number) => {
    await fetch('/api/library/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ library_item_id: id }),
    });
    fetchLibrary();
  };

  const filtered = activeTab === 'all' ? library : library.filter((i) => i.status === activeTab);

  return (
    <div style={{ background: '#050508', minHeight: '100vh', position: 'relative' }}>
      {/* Grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(12,206,192,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(12,206,192,0.025) 1px, transparent 1px)
        `, backgroundSize: '60px 60px',
      }} />

      <Navbar active="library" />

      <div style={{ paddingTop: 64, position: 'relative', zIndex: 10 }}>
        <div className="nv-lib-container">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 800, color: '#e8eaf6', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10,
            }}>
              My Library
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(200,210,230,0.4)', lineHeight: 1.6, maxWidth: 460 }}>
              {stats.total_items ? `${stats.total_items} shows tracked · ${stats.watching || 0} watching` : 'Your collection of discovered shows'}
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="nv-lib-tabs"
          >
            {TABS.map((tab) => {
              const count = tab.key === 'all' ? stats.total_items : stats[tab.key];
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
                    fontFamily: "'Space Grotesk', sans-serif", whiteSpace: 'nowrap',
                    background: activeTab === tab.key ? 'rgba(12,206,192,0.12)' : 'rgba(255,255,255,0.03)',
                    color: activeTab === tab.key ? '#0CCEC0' : 'rgba(200,210,230,0.35)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <span style={{
                      marginLeft: 6, padding: '1px 6px', borderRadius: 4, fontSize: 10,
                      background: activeTab === tab.key ? 'rgba(12,206,192,0.2)' : 'rgba(255,255,255,0.05)',
                      color: activeTab === tab.key ? '#0CCEC0' : 'rgba(200,210,230,0.25)',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 8, marginBottom: 24,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="nv-lib-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  style={{
                    borderRadius: 10, height: 300, background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(200,210,230,0.05)',
                  }}
                >
                  <div className="nv-skeleton-shimmer" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 10 }} />
                </motion.div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <motion.div className="nv-lib-grid" layout>
              <AnimatePresence>
                {filtered.map((item) => (
                  <LibraryCard key={item.id} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
              textAlign: 'center', padding: '80px 0', color: 'rgba(200,210,230,0.25)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>📚</div>
              <div style={{ fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, color: 'rgba(200,210,230,0.3)' }}>
                {activeTab === 'all' ? 'Your library is empty' : `No ${STATUS_LABELS[activeTab as Status] ?? ''} shows`}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(200,210,230,0.15)', maxWidth: 320, marginInline: 'auto', lineHeight: 1.6 }}>
                Head to Discover to find shows and add them to your library
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .nv-lib-container { max-width: 1100px; margin-inline: auto; padding: 48px 40px 80px; }
        .nv-lib-tabs {
          display: flex; gap: 6px; margin-bottom: 32px;
          overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;
        }
        .nv-lib-tabs::-webkit-scrollbar { display: none; }
        .nv-lib-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .nv-skeleton-shimmer::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
          animation: shimmer 1.5s infinite;
        }
        @media (max-width: 640px) {
          .nv-lib-container { padding: 28px 16px 64px; }
          .nv-lib-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 380px) {
          .nv-lib-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

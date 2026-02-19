'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';

/* ─── Vibe preset cards data ─── */
const VIBE_PRESETS = [
  {
    id: 'brain-food',
    emoji: '🧠',
    title: 'BRAIN FOOD',
    desc: 'Deep philosophical themes and intricate plots.',
    accentColor: '#0CCEC0',
    bg: 'rgba(12,206,192,0.06)',
  },
  {
    id: 'cozy-warm',
    emoji: '🍵',
    title: 'COZY & WARM',
    desc: 'Heartwarming stories and peaceful atmospheres.',
    accentColor: '#22c55e',
    bg: 'rgba(34,197,94,0.06)',
  },
  {
    id: 'dark-gritty',
    emoji: '🌑',
    title: 'DARK & GRITTY',
    desc: 'Bleak worlds and morally grey characters.',
    accentColor: '#ec4899',
    bg: 'rgba(236,72,153,0.06)',
  },
  {
    id: 'adrenaline-rush',
    emoji: '⚡',
    title: 'ADRENALINE RUSH',
    desc: 'High-octane action and intense pacing.',
    accentColor: '#f97316',
    bg: 'rgba(249,115,22,0.06)',
  },
  {
    id: 'emotionally-heavy',
    emoji: '💔',
    title: 'EMOTIONALLY HEAVY',
    desc: 'Bring tissues. Powerful emotional journeys.',
    accentColor: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
  },
  {
    id: 'surreal-weird',
    emoji: '🌀',
    title: 'SURREAL & WEIRD',
    desc: 'Avant-garde art styles and mind-bending logic.',
    accentColor: '#818cf8',
    bg: 'rgba(129,140,248,0.06)',
  },
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

/* ─── Vibe Preset Card ─── */
function VibeCard({
  preset,
  isSelected,
  onSelect,
  index,
}: {
  preset: typeof VIBE_PRESETS[0];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      style={{
        background: isSelected ? preset.bg : 'rgba(13,13,22,0.7)',
        border: `1px solid ${isSelected ? preset.accentColor : 'rgba(200,210,230,0.08)'}`,
        borderRadius: 12,
        padding: '28px 24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, background 0.25s ease',
        borderLeft: `3px solid ${isSelected ? preset.accentColor : 'rgba(200,210,230,0.12)'}`,
      }}
    >
      {/* Emoji icon */}
      <div style={{ fontSize: 28, marginBottom: 16, lineHeight: 1 }}>
        {preset.emoji}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 13,
        fontWeight: 800,
        color: '#e8eaf6',
        letterSpacing: '0.06em',
        marginBottom: 8,
        fontFamily: "'Space Grotesk', sans-serif",
        lineHeight: 1.3,
      }}>
        {preset.title}
      </h3>

      {/* Desc */}
      <p style={{
        fontSize: 12,
        color: isSelected ? 'rgba(200,210,230,0.65)' : 'rgba(200,210,230,0.38)',
        lineHeight: 1.6,
        fontWeight: 400,
        transition: 'color 0.25s ease',
      }}>
        {preset.desc}
      </p>

      {/* Selected checkmark */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: 16, right: 16,
            width: 20, height: 20,
            borderRadius: '50%',
            background: preset.accentColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#050508" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l3 3 5-5" />
          </svg>
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
      <span style={{
        color: '#0CCEC0', fontSize: 12, fontWeight: 600,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: "'Space Grotesk', monospace",
      }}>
        {text}
      </span>
    </div>
  );
}

/* ─── Grid pattern ─── */
function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(12,206,192,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(12,206,192,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

/* ─── Main Explore Page ─── */
export default function ExplorePage() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else if (next.size < MAX_TAGS) {
        next.add(tag);
      }
      return next;
    });
  }

  const canRun = selectedPreset !== null || selectedTags.size > 0;

  return (
    <div style={{ background: '#050508', minHeight: '100vh', position: 'relative' }}>
      <GridOverlay />

      {/* Navbar */}
      <Navbar active="explore" />

      {/* Page content */}
      <div style={{ paddingTop: 64, position: 'relative', zIndex: 10 }}>

        {/* ─── Section 1: Pick Your Signal ─── */}
        <section style={{ padding: '64px 40px 80px', maxWidth: 1100, marginInline: 'auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel text="VIBE_SELECTOR" />

            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              color: '#e8eaf6',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Pick Your Signal
            </h1>

            <p style={{
              fontSize: 14,
              color: 'rgba(200,210,230,0.45)',
              lineHeight: 1.7,
              maxWidth: 380,
              marginBottom: 48,
            }}>
              Not sure where to start? Choose a frequency or build your own custom signal.
            </p>
          </motion.div>

          {/* 3×2 vibe card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {VIBE_PRESETS.map((preset, i) => (
              <VibeCard
                key={preset.id}
                preset={preset}
                isSelected={selectedPreset === preset.id}
                onSelect={() => setSelectedPreset(
                  selectedPreset === preset.id ? null : preset.id
                )}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(12,206,192,0.1), transparent)',
          maxWidth: 1100, marginInline: 'auto',
        }} />

        {/* ─── Section 2: Build your own signal ─── */}
        <section style={{ padding: '72px 40px 100px', maxWidth: 1100, marginInline: 'auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel text="MANUAL_INPUT" />

            {/* Heading + counter row */}
            <div style={{
              display: 'flex', alignItems: 'baseline',
              justifyContent: 'space-between', flexWrap: 'wrap',
              gap: 12, marginBottom: 36,
            }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                fontWeight: 800,
                color: '#e8eaf6',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}>
                Or build your own signal
              </h2>
              <span style={{
                fontSize: 12, color: '#0CCEC0', fontWeight: 600,
                letterSpacing: '0.18em', fontFamily: "'Space Grotesk', monospace",
              }}>
                {selectedTags.size} / {MAX_TAGS} ACTIVE
              </span>
            </div>
          </motion.div>

          {/* Tag chips */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}
          >
            {TAGS.map((tag, i) => {
              const isSel = selectedTags.has(tag);
              const maxed = selectedTags.size >= MAX_TAGS && !isSel;
              return (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: 0.03 * i }}
                  whileHover={!maxed ? { scale: 1.05 } : undefined}
                  whileTap={!maxed ? { scale: 0.97 } : undefined}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 6,
                    border: isSel
                      ? '1px solid #0CCEC0'
                      : '1px solid rgba(200,210,230,0.14)',
                    background: isSel
                      ? 'rgba(12,206,192,0.1)'
                      : 'rgba(255,255,255,0.02)',
                    color: isSel ? '#0CCEC0' : 'rgba(200,210,230,0.5)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    fontFamily: "'Space Grotesk', monospace",
                    cursor: maxed ? 'not-allowed' : 'pointer',
                    opacity: maxed ? 0.3 : 1,
                    transition: 'all 0.2s ease',
                    boxShadow: isSel ? '0 0 10px rgba(12,206,192,0.12)' : 'none',
                    textTransform: 'uppercase',
                  }}
                >
                  {tag}
                </motion.button>
              );
            })}
          </motion.div>

          {/* RUN DISCOVERY button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.button
              whileHover={canRun ? {
                scale: 1.02,
                borderColor: 'rgba(12,206,192,0.5)',
                backgroundColor: 'rgba(12,206,192,0.06)',
              } : undefined}
              whileTap={canRun ? { scale: 0.98 } : undefined}
              style={{
                padding: '16px 0',
                width: '100%',
                maxWidth: 480,
                borderRadius: 8,
                border: `1px solid ${canRun ? 'rgba(12,206,192,0.25)' : 'rgba(200,210,230,0.1)'}`,
                background: 'rgba(255,255,255,0.02)',
                color: canRun ? 'rgba(200,210,230,0.6)' : 'rgba(200,210,230,0.2)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', monospace",
                cursor: canRun ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}
            >
              RUN DISCOVERY
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

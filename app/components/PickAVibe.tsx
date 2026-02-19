'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const MOODS = [
  'BITTERSWEET', 'SLOW-BURN', 'CEREBRAL', 'DYSTOPIAN',
  'COMING OF AGE', 'TRAGEDY', 'ANTI-HERO', 'CYBERPUNK',
  'CLASS STRUGGLE', 'PSYCHOLOGICAL', 'DARK FANTASY',
  'EXISTENTIAL', 'SURREAL', 'FOUND FAMILY', 'ISOLATION',
  'REDEMPTION', 'WAR', 'POLITICAL',
];

const MAX_SELECT = 6;

export default function PickAVibe() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(mood: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(mood)) {
        next.delete(mood);
      } else if (next.size < MAX_SELECT) {
        next.add(mood);
      }
      return next;
    });
  }

  return (
    <section
      style={{
        background: '#050508',
        padding: '80px 40px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(12,206,192,0.12), transparent)',
      }} />

      <div style={{ maxWidth: 1100, marginInline: 'auto' }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}
        >
          <span style={{ color: '#0CCEC0', fontSize: 12, fontWeight: 600, letterSpacing: '0.15em' }}>//</span>
          <span style={{ color: '#0CCEC0', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Space Grotesk', monospace" }}>
            TONIGHT&apos;S_SIGNAL
          </span>
        </motion.div>

        {/* Heading row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 40,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            color: '#e8eaf6',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            Pick a Vibe
          </h2>

          {/* Counter */}
          <div style={{ fontSize: 12, color: '#0CCEC0', fontWeight: 600, letterSpacing: '0.2em', fontFamily: "'Space Grotesk', monospace" }}>
            {selected.size} / {MAX_SELECT} SELECTED
          </div>
        </motion.div>

        {/* Mood tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}
        >
          {MOODS.map((mood, i) => {
            const isSelected = selected.has(mood);
            const maxedOut = selected.size >= MAX_SELECT && !isSelected;
            return (
              <motion.button
                key={mood}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                whileHover={!maxedOut ? { scale: 1.04 } : undefined}
                whileTap={!maxedOut ? { scale: 0.97 } : undefined}
                onClick={() => toggle(mood)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: isSelected
                    ? '1px solid #0CCEC0'
                    : '1px solid rgba(200,210,230,0.12)',
                  background: isSelected
                    ? 'rgba(12,206,192,0.12)'
                    : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#0CCEC0' : 'rgba(200,210,230,0.55)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  fontFamily: "'Space Grotesk', monospace",
                  cursor: maxedOut ? 'not-allowed' : 'pointer',
                  opacity: maxedOut ? 0.35 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 12px rgba(12,206,192,0.15)' : 'none',
                  textTransform: 'uppercase',
                }}
              >
                {mood}
              </motion.button>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <motion.button
            whileHover={selected.size > 0 ? { scale: 1.03, backgroundColor: 'rgba(12,206,192,0.08)' } : undefined}
            whileTap={selected.size > 0 ? { scale: 0.97 } : undefined}
            style={{
              padding: '16px 80px',
              borderRadius: 8,
              border: `1px solid ${selected.size > 0 ? 'rgba(12,206,192,0.4)' : 'rgba(200,210,230,0.12)'}`,
              background: 'rgba(255,255,255,0.02)',
              color: selected.size > 0 ? '#e8eaf6' : 'rgba(200,210,230,0.3)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', monospace",
              cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              minWidth: 300,
            }}
          >
            EXPLORE VIBE
          </motion.button>
        </motion.div>
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          textAlign: 'center',
          marginTop: 64,
          fontSize: 11,
          color: 'rgba(200,210,230,0.2)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: "'Space Grotesk', monospace",
        }}
      >
        NO ACCOUNT NEEDED TO EXPLORE • BUILT FOR THE VOID
      </motion.div>
    </section>
  );
}

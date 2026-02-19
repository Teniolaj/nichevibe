'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';

/* ─── Tiny animated particle ─── */
function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-teal-400 opacity-0"
      style={{ left: `${x}%`, top: `${y}%`, width: 2, height: 2, backgroundColor: '#0CCEC0' }}
      animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 0], y: [0, -20, -40] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

/* ─── Ambient orb ─── */
function Orb({
  cx, cy, size, color, delay = 0,
}: { cx: string; cy: string; size: number; color: string; delay?: number }) {
  return (
    <motion.div
      className="orb absolute"
      style={{ left: cx, top: cy, width: size, height: size, background: color, transform: 'translate(-50%,-50%)' }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ─── Grid pattern ─── */
function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(12,206,192,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(12,206,192,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

/* ─── Blinking cursor ─── */
function BlinkingCursor() {
  return (
    <motion.span
      style={{
        display: 'inline-block',
        width: 3,
        height: '1em',
        verticalAlign: 'middle',
        background: '#0CCEC0',
        marginLeft: 8,
        borderRadius: 2,
        boxShadow: '0 0 10px #0CCEC0, 0 0 20px rgba(12,206,192,0.4)',
      }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
    />
  );
}

/* ─── Badge ─── */
function Badge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="inline-flex items-center gap-2 rounded-full border mb-8"
      style={{
        borderColor: 'rgba(12,206,192,0.25)',
        background: 'rgba(12,206,192,0.06)',
        backdropFilter: 'blur(8px)',
        padding: '10px 24px',
      }}
    >
      <span
        className="w-2 h-2 rounded-full badge-pulse"
        style={{ background: '#0CCEC0' }}
      />
      <span style={{ fontSize: 12, color: '#0CCEC0', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        ANIME DISCOVERY POWERED BY VIBE
      </span>
    </motion.div>
  );
}

/* ─── Headline ─── */
function Headline() {
  const line1 = 'Find Your Next';
  const line2Parts = ['Hidden', ' Gem'];

  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: '-0.03em',
        textAlign: 'center',
      }}
    >
      {/* Line 1 */}
      <motion.span
        className="block"
        style={{
          fontSize: 'clamp(2.8rem, 8vw, 6rem)',
          background: 'linear-gradient(135deg, #ffffff 0%, #c8d4e8 60%, #8896b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {line1}
      </motion.span>

      {/* Line 2 */}
      <motion.span
        className="flex items-baseline justify-center flex-wrap"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* "Hidden Gem" in teal */}
        <span
          className="teal-text-glow"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            color: '#0CCEC0',
          }}
        >
          Hidden Gem
        </span>
        {/* blinking cursor after headline */}
        <BlinkingCursor />
      </motion.span>
    </motion.h1>
  );
}

/* ─── Subheadline ─── */
function Subheadline() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
      style={{
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        color: 'rgba(200, 210, 230, 0.55)',
        maxWidth: 520,
        textAlign: 'center',
        lineHeight: 1.7,
        fontWeight: 400,
      }}
    >
      Discover anime that matches your vibe — from forgotten masterpieces to
      under-the-radar gems the algorithm will never show you.
    </motion.p>
  );
}

/* ─── CTA Buttons ─── */
function CTAButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
      className="flex flex-wrap gap-4 justify-center"
    >
      {/* Primary — Discover by Anime */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden shimmer-btn btn-teal-glow"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 28px',
          borderRadius: 12,
          background: '#0CCEC0',
          color: '#050508',
          fontWeight: 700,
          fontSize: 15,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '-0.01em',
          border: 'none',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s ease',
          boxShadow: '0 0 0 1px rgba(12,206,192,0.3)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        Discover by Anime
      </motion.button>

      {/* Secondary — Explore by Mood */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="btn-ghost-glow"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 28px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          color: '#e8eaf6',
          fontWeight: 600,
          fontSize: 15,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '-0.01em',
          border: '1px solid rgba(200, 210, 230, 0.12)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0CCEC0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        Explore by Mood
      </motion.button>
    </motion.div>
  );
}

/* ─── Social proof / stats ─── */
function Stats() {
  const stats = [
    { value: '12K+', label: 'Hidden Gems' },
    { value: '50+', label: 'Mood Filters' },
    { value: '200+', label: 'Niches' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.0, ease: 'easeOut' }}
      className="flex gap-10 justify-center flex-wrap"
    >
      {stats.map((s, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <span style={{ fontSize: 22, fontWeight: 800, color: '#0CCEC0', fontFamily: "'Space Grotesk', sans-serif" }}>
            {s.value}
          </span>
          <span style={{ fontSize: 12, color: 'rgba(200,210,230,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Floating anime card ─── */
function FloatingCard({ delay, x, y, title, genre, rating }: {
  delay: number; x: string; y: string; title: string; genre: string; rating: string;
}) {
  return (
    <motion.div
      className="absolute hidden lg:flex flex-col gap-2"
      style={{ left: x, top: y, zIndex: 10 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{
          background: 'rgba(13,13,24,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(12,206,192,0.15)',
          borderRadius: 12,
          padding: '12px 16px',
          minWidth: 160,
        }}
      >
        <div style={{ fontSize: 11, color: '#0CCEC0', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4, textTransform: 'uppercase' }}>
          {genre}
        </div>
        <div style={{ fontSize: 14, color: '#e8eaf6', fontWeight: 600, lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
          <span style={{ fontSize: 12, color: 'rgba(200,210,230,0.5)' }}>{rating}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Wave / separator line ─── */
function TealDivider() {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(12,206,192,0.3), transparent)' }} />
  );
}

/* ─── Main HeroSection ─── */
export default function HeroSection() {
  // Generate particles client-side only to avoid SSR/client hydration mismatch
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
      }))
    );
    setMounted(true);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#050508',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Grid */}
      <GridOverlay />

      {/* Ambient orbs */}
      <Orb cx="20%" cy="30%" size={500} color="rgba(12,206,192,0.06)" delay={0} />
      <Orb cx="80%" cy="20%" size={400} color="rgba(12,206,192,0.05)" delay={2} />
      <Orb cx="60%" cy="70%" size={350} color="rgba(100,80,200,0.05)" delay={1} />
      <Orb cx="10%" cy="80%" size={300} color="rgba(12,206,192,0.04)" delay={3} />

      {/* Particles */}
      {particles.map((p) => (
        <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />
      ))}

      {/* Floating anime cards — client only */}
      {mounted && (
        <>
          <FloatingCard
            delay={1.2} x="5%" y="25%"
            title="Kino no Tabi" genre="Philosophical" rating="8.7 Hidden"
          />
          <FloatingCard
            delay={1.5} x="72%" y="20%"
            title="Haibane Renmei" genre="Slice of Life" rating="8.5 Gem"
          />
          <FloatingCard
            delay={1.8} x="78%" y="60%"
            title="Texhnolyze" genre="Cyberpunk" rating="8.2 Niche"
          />
        </>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Hero content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          padding: '0 24px',
          maxWidth: 820,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Badge />
        <Headline />
        <Subheadline />
        <CTAButtons />

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
          style={{ width: 80, height: 1, background: 'rgba(12,206,192,0.3)', borderRadius: 1 }}
        />

        <Stats />
      </div>

      {/* Bottom separator */}
      <TealDivider />
    </section>
  );
}

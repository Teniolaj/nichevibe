'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'DROP YOUR ANCHOR',
    desc: 'Search for a show you just finished watching.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0CCEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'VIBE ANALYSIS',
    desc: 'AI reads the themes, mood, and emotional weight.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0CCEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'HIDDEN GEMS SURFACE',
    desc: 'Niche shows with matching DNA are revealed.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0CCEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 12 12 22 2 12 12 2" />
      </svg>
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

export default function HowItWorks() {
  return (
    <section
      style={{
        background: '#050508',
        padding: '100px 40px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top separator line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(12,206,192,0.15), transparent)',
      }} />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 48,
          maxWidth: 1100, marginInline: 'auto',
        }}
      >
        <span style={{ color: '#0CCEC0', fontSize: 12, fontWeight: 600, letterSpacing: '0.15em' }}>//</span>
        <span style={{ color: '#0CCEC0', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Space Grotesk', monospace" }}>
          HOW_IT_WORKS
        </span>
      </motion.div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          maxWidth: 1100,
          marginInline: 'auto',
        }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ borderColor: 'rgba(12,206,192,0.35)', backgroundColor: 'rgba(12,206,192,0.04)', y: -4 }}
            style={{
              background: 'rgba(13,13,22,0.8)',
              border: '1px solid rgba(12,206,192,0.12)',
              borderRadius: 12,
              padding: '32px 28px',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s ease',
            }}
          >
            {/* Step number */}
            <div style={{
              fontSize: 11,
              color: '#0CCEC0',
              fontWeight: 700,
              letterSpacing: '0.2em',
              marginBottom: 20,
              fontFamily: "'Space Grotesk', monospace",
            }}>
              {step.num}
            </div>

            {/* Icon */}
            <div style={{ marginBottom: 24 }}>
              {step.icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#e8eaf6',
              letterSpacing: '0.05em',
              marginBottom: 12,
              fontFamily: "'Space Grotesk', sans-serif",
              lineHeight: 1.3,
            }}>
              {step.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: 13,
              color: 'rgba(200,210,230,0.45)',
              lineHeight: 1.65,
              fontWeight: 400,
            }}>
              {step.desc}
            </p>

            {/* Teal left accent bar */}
            <div style={{
              position: 'absolute',
              left: 0, top: 32, bottom: 32,
              width: 2,
              background: 'rgba(12,206,192,0.4)',
              borderRadius: '0 2px 2px 0',
            }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'DISCOVER', href: '/discover', key: 'discover' },
  { label: 'EXPLORE', href: '/explore', key: 'explore' },
  { label: 'LIBRARY', href: '/library', key: 'library' },
];

export default function Navbar({ active }: { active?: 'discover' | 'explore' | 'library' }) {
  const [menuOpen, setMenuOpen] = useState(false);

  /* Prevent body scroll when menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ─── Main navbar bar ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          height: 64,
          background: 'rgba(5,5,8,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(12,206,192,0.08)',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #0CCEC0, rgba(12,206,192,0.4))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#050508" strokeWidth="3">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 18,
            color: '#e8eaf6', letterSpacing: '-0.02em',
          }}>
            Niche<span style={{ color: '#0CCEC0' }}>Vibe</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {NAV_LINKS.map((link) => {
            const isActive = active === link.key;
            return (
              <Link key={link.key} href={link.href} style={{
                fontSize: 12,
                color: isActive ? '#0CCEC0' : 'rgba(200,210,230,0.45)',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.12em',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'color 0.2s',
                paddingBottom: isActive ? 2 : 0,
                borderBottom: isActive ? '1px solid #0CCEC0' : '1px solid transparent',
              }}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop sign up */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="hidden-mobile"
          style={{
            padding: '8px 24px', borderRadius: 8,
            background: '#0CCEC0', border: '1px solid #0CCEC0',
            color: '#050508', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.04em',
          }}
        >
          SIGN UP
        </motion.button>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="show-mobile"
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', padding: 6,
            color: '#e8eaf6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </motion.nav>

      {/* ─── Full-screen slide-out menu ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0, right: 0, bottom: 0, left: 0,
              width: '100vw', height: '100vh',
              zIndex: 100,
              background: '#0D0D12',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                position: 'absolute',
                top: 20, right: 24,
                background: 'none', border: 'none',
                color: 'rgba(200,210,230,0.6)',
                cursor: 'pointer', padding: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e8eaf6')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,230,0.6)')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Menu links */}
            <nav style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 32,
              marginBottom: 48,
            }}>
              {NAV_LINKS.map((link, i) => {
                const isActive = active === link.key;
                return (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        fontSize: '1.5rem',   /* text-2xl */
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        color: isActive ? '#0CCEC0' : '#e8eaf6',
                        fontFamily: "'Space Grotesk', sans-serif",
                        transition: 'color 0.2s',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Sign up */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 48px',
                borderRadius: 10,
                background: '#0CCEC0',
                border: '1px solid #0CCEC0',
                color: '#050508',
                fontSize: 16, fontWeight: 800,
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              SIGN UP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Responsive helpers ─── */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

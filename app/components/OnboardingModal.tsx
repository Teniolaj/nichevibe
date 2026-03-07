'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const STORAGE_KEY = 'nichevibe_onboarding_completed';

export function setOnboardingCompleted() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, '1');
  }
}

export function hasOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.localStorage.getItem(STORAGE_KEY);
}

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleDiscover = () => {
    setOnboardingCompleted();
    onClose();
  };

  const handleExplore = () => {
    setOnboardingCompleted();
    onClose();
    router.push('/explore');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(5,5,8,0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              maxWidth: 520,
              width: '100%',
              background: 'rgba(12,12,20,0.95)',
              border: '1px solid rgba(200,210,230,0.1)',
              borderRadius: 16,
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 20, lineHeight: 1 }} aria-hidden="true">✨</div>
            <h2 id="onboarding-title" style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800,
              color: '#e8eaf6',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: 12,
            }}>
              Welcome to NicheVibe
            </h2>
            <p style={{
              fontSize: 14,
              color: 'rgba(200,210,230,0.5)',
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              Pick your style to get started
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                padding: 20, borderRadius: 12, textAlign: 'left',
                background: 'rgba(12,206,192,0.04)', border: '1px solid rgba(12,206,192,0.2)',
              }}>
                <button
                  onClick={handleDiscover}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 8,
                    border: '1px solid rgba(12,206,192,0.35)',
                    background: 'rgba(12,206,192,0.1)',
                    color: '#0CCEC0',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    fontFamily: "'Space Grotesk', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(12,206,192,0.18)';
                    e.currentTarget.style.borderColor = 'rgba(12,206,192,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(12,206,192,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(12,206,192,0.35)';
                  }}
                >
                  I know what I like
                </button>
                <p style={{
                  fontSize: 13, color: 'rgba(200,210,230,0.55)', lineHeight: 1.6, margin: 0,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Finished watching something and want more like it?
                </p>
              </div>

              <div style={{
                padding: 20, borderRadius: 12, textAlign: 'left',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(200,210,230,0.1)',
              }}>
                <button
                  onClick={handleExplore}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 8,
                    border: '1px solid rgba(200,210,230,0.15)',
                    background: 'rgba(255,255,255,0.02)',
                    color: 'rgba(200,210,230,0.9)',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    fontFamily: "'Space Grotesk', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(200,210,230,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(200,210,230,0.15)';
                  }}
                >
                  I want to explore
                </button>
                <p style={{
                  fontSize: 13, color: 'rgba(200,210,230,0.55)', lineHeight: 1.6, margin: 0,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Not sure what to watch? Pick a vibe and we&apos;ll find it.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

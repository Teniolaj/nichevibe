'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

/* ─── Google G SVG ─── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.017 17.64 11.71 17.64 9.2z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ─── NicheVibe Wordmark ─── */
function Wordmark() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #0CCEC0, rgba(12,206,192,0.4))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#050508" strokeWidth="3">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: '#e8eaf6',
          letterSpacing: '-0.02em',
        }}
      >
        Niche<span style={{ color: '#0CCEC0' }}>Vibe</span>
      </span>
    </Link>
  );
}

/* ─── Input field ─── */
function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(200,210,230,0.5)',
          marginBottom: 8,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: '#050508',
          border: `1px solid ${focused ? '#0CCEC0' : 'rgba(200,210,230,0.1)'}`,
          borderRadius: 4,
          padding: '12px 14px',
          color: '#e8eaf6',
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: focused ? '0 0 0 3px rgba(12,206,192,0.12)' : 'none',
          fontFamily: "'Inter', sans-serif",
        }}
      />
    </div>
  );
}

/* ─── Main Login Page ─── */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleHovered, setGoogleHovered] = useState(false);

  const handleSignIn = () => {
    console.log('Sign in clicked', { email, password });
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050508' }}>

      {/* ═══════════════════════════════════════
          LEFT PANEL — hidden on mobile
      ═══════════════════════════════════════ */}
      <div
        className="nv-left-panel"
        style={{
          width: '60%',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Background image — dramatic mountain/ocean landscape */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />

        {/* Base dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5,5,8,0.38)',
          }}
        />

        {/* Gradient fade — right edge bleeds into form panel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, rgba(5,5,8,0.05) 0%, rgba(5,5,8,0.25) 55%, rgba(5,5,8,0.92) 100%)',
          }}
        />

        {/* Bottom vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(5,5,8,0.5) 0%, transparent 40%)',
          }}
        />

        {/* Teal grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(12,206,192,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(12,206,192,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Wordmark — top left */}
        <div style={{ position: 'absolute', top: 32, left: 48, zIndex: 10 }}>
          <Wordmark />
        </div>

        {/* Text content — left third */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '0 56px',
            maxWidth: 500,
          }}
        >
          {/* ★ ANIME label */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}
          >
            <span style={{ color: '#0CCEC0', fontSize: 15, lineHeight: 1 }}>★</span>
            <span
              style={{
                color: '#e8eaf6',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              ANIME
            </span>
          </motion.div>

          {/* EXPLORE HORIZONS */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              lineHeight: 0.94,
              letterSpacing: '-0.03em',
              color: '#e8eaf6',
              fontSize: 'clamp(3.2rem, 4.8vw, 5.5rem)',
              marginBottom: 24,
              textShadow: '0 2px 48px rgba(0,0,0,0.5)',
            }}
          >
            EXPLORE
            <br />
            HORIZONS
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: 'easeOut' }}
            style={{
              color: '#e8eaf6',
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.5,
              marginBottom: 14,
              textShadow: '0 1px 24px rgba(0,0,0,0.7)',
            }}
          >
            Where Your Dream Anime Become Reality.
          </motion.p>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
            style={{
              color: 'rgba(232,234,246,0.6)',
              fontSize: 14,
              lineHeight: 1.8,
              maxWidth: 340,
            }}
          >
            Embark on a journey where every corner of the anime world is within your reach.
          </motion.p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — full-width on mobile
      ═══════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          background: '#0d0d18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {/* Mobile-only wordmark */}
        <div
          className="nv-mobile-wordmark"
          style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}
        >
          <Wordmark />
        </div>

        {/* ─── Login Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: 400,
            background: '#111122',
            border: '1px solid rgba(12,206,192,0.1)',
            borderRadius: 16,
            padding: '40px 36px',
          }}
        >
          {/* Card header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ marginBottom: 32 }}
          >
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 24,
                color: '#e8eaf6',
                letterSpacing: '-0.02em',
                marginBottom: 6,
              }}
            >
              Welcome Back
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(200,210,230,0.5)',
                lineHeight: 1.5,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Sign in to continue your discovery
            </p>
          </motion.div>

          {/* Email field */}
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
          />

          {/* Password field — no bottom margin (forgot link handles spacing) */}
          <div style={{ marginBottom: 0 }}>
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 28 }}>
            <button
              onClick={handleForgotPassword}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(200,210,230,0.5)',
                fontSize: 13,
                cursor: 'pointer',
                padding: 0,
                fontFamily: "'Inter', sans-serif",
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0CCEC0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(200,210,230,0.5)')}
            >
              Forgot password?
            </button>
          </div>

          {/* SIGN IN button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignIn}
            className="btn-teal-glow shimmer-btn"
            style={{
              width: '100%',
              background: '#0CCEC0',
              border: 'none',
              borderRadius: 4,
              padding: '13px',
              color: '#050508',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              marginBottom: 20,
              transition: 'box-shadow 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            Sign In
          </motion.button>

          {/* ── or divider ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(200,210,230,0.08)' }} />
            <span
              style={{
                fontSize: 13,
                color: 'rgba(200,210,230,0.3)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(200,210,230,0.08)' }} />
          </div>

          {/* Google button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleSignIn}
            onHoverStart={() => setGoogleHovered(true)}
            onHoverEnd={() => setGoogleHovered(false)}
            style={{
              width: '100%',
              background: '#0d0d18',
              border: `1px solid ${googleHovered ? 'rgba(12,206,192,0.35)' : 'rgba(200,210,230,0.1)'}`,
              borderRadius: 4,
              padding: '12px',
              color: '#e8eaf6',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontFamily: "'Inter', sans-serif",
              marginBottom: 28,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxShadow: googleHovered ? '0 0 14px rgba(12,206,192,0.1)' : 'none',
            }}
          >
            <GoogleIcon />
            Sign in with Google
          </motion.button>

          {/* Create account link */}
          <p
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: 'rgba(200,210,230,0.4)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Are you new?{' '}
            <Link
              href="/auth/signup"
              style={{ color: '#0CCEC0', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none')
              }
            >
              Create an Account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ─── Responsive helpers ─── */}
      <style>{`
        .nv-left-panel {
          display: flex;
        }
        .nv-mobile-wordmark {
          display: none;
        }
        @media (max-width: 1024px) {
          .nv-left-panel {
            display: none !important;
          }
          .nv-mobile-wordmark {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

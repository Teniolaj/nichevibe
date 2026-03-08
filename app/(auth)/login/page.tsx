'use client';

import { createClient } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, type FormEvent, useState } from 'react';

/* ─── Types ─── */
type AlertType = 'error' | 'success';

interface AlertState {
  type: AlertType;
  message: string;
}

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

/* ─── Spinner ─── */
function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <motion.path
        d="M12 2a10 10 0 0 1 10 10"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '12px', originY: '12px' }}
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
  disabled = false,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
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
          color: disabled ? 'rgba(200,210,230,0.25)' : 'rgba(200,210,230,0.5)',
          marginBottom: 8,
          fontFamily: "'Inter', sans-serif",
          transition: 'color 0.2s ease',
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
        disabled={disabled}
        style={{
          width: '100%',
          background: disabled ? 'rgba(5,5,8,0.5)' : '#050508',
          border: `1px solid ${focused && !disabled ? '#0CCEC0' : 'rgba(200,210,230,0.1)'}`,
          borderRadius: 4,
          padding: '12px 14px',
          color: disabled ? 'rgba(232,234,246,0.4)' : '#e8eaf6',
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: focused && !disabled ? '0 0 0 3px rgba(12,206,192,0.12)' : 'none',
          fontFamily: "'Inter', sans-serif",
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
        }}
      />
    </div>
  );
}

/* ─── Alert box (error or success) ─── */
function AlertBox({ alert }: { alert: AlertState }) {
  const isError = alert.type === 'error';
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 6,
        marginBottom: 24,
        background: isError
          ? 'rgba(239,68,68,0.07)'
          : 'rgba(12,206,192,0.07)',
        border: `1px solid ${isError ? 'rgba(239,68,68,0.25)' : 'rgba(12,206,192,0.3)'}`,
      }}
    >
      {/* Icon */}
      <span style={{ flexShrink: 0, marginTop: 1 }}>
        {isError ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(252,165,165,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0CCEC0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
      </span>
      <span
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          color: isError ? 'rgba(252,165,165,0.9)' : 'rgba(12,206,192,0.9)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {alert.message}
      </span>
    </motion.div>
  );
}

/* ─── Login form (uses useSearchParams, must be in Suspense) ─── */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const redirectTo = searchParams.get('redirectTo');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [googleHovered, setGoogleHovered] = useState(false);

  const isAnyLoading = loading || googleLoading;

  /* ── Email / Password sign-in ── */
  const handleEmailSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);

    if (!email.trim()) {
      setAlert({ type: 'error', message: 'Please enter your email address.' });
      return;
    }
    if (!password) {
      setAlert({ type: 'error', message: 'Please enter your password.' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // Map Supabase error codes to friendly messages
        if (error.message.includes('Invalid login credentials')) {
          setAlert({ type: 'error', message: 'Incorrect email or password. Please try again.' });
        } else if (error.message.includes('Email not confirmed')) {
          setAlert({ type: 'error', message: 'Please verify your email before signing in. Check your inbox.' });
        } else {
          setAlert({ type: 'error', message: error.message });
        }
        return;
      }

      router.push(redirectTo && /^\/(discover|library|explore)(\/.*)?$/.test(redirectTo) ? redirectTo : '/discover');
      router.refresh();
    } catch {
      setAlert({ type: 'error', message: 'Something went wrong. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Google OAuth ── */
  const handleGoogleSignIn = async () => {
    setAlert(null);
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setAlert({ type: 'error', message: error.message });
        setGoogleLoading(false);
      }
      // On success Supabase redirects the browser — don't reset loading
    } catch {
      setAlert({ type: 'error', message: 'Could not connect to Google. Please try again.' });
      setGoogleLoading(false);
    }
  };

  /* ── Forgot password ── */
  const handleForgotPassword = async () => {
    setAlert(null);

    if (!email.trim()) {
      setAlert({ type: 'error', message: 'Enter your email address above, then click "Forgot password?"' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/auth/callback` },
      );

      if (error) {
        setAlert({ type: 'error', message: error.message });
      } else {
        setAlert({ type: 'success', message: `Password reset link sent to ${email.trim()}. Check your inbox.` });
      }
    } catch {
      setAlert({ type: 'error', message: 'Could not send reset email. Please try again.' });
    } finally {
      setLoading(false);
    }
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
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/Login_Banner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,0.38)' }} />

        {/* Gradient fade → right edge bleeds into form panel */}
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
            background: 'linear-gradient(to top, rgba(5,5,8,0.5) 0%, transparent 40%)',
          }}
        />

        {/* Teal grid */}
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

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 10, padding: '0 56px', maxWidth: 500 }}
        >
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

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
            style={{ color: 'rgba(232,234,246,0.6)', fontSize: 14, lineHeight: 1.8, maxWidth: 340 }}
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
            style={{ marginBottom: 28 }}
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

          {/* ── Alert box ── */}
          <AnimatePresence mode="wait">
            {alert && <AlertBox key={alert.message} alert={alert} />}
          </AnimatePresence>

          {/* ── Form ── */}
          <form onSubmit={handleEmailSignIn} noValidate>
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              disabled={isAnyLoading}
            />

            <div style={{ marginBottom: 0 }}>
              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                disabled={isAnyLoading}
              />
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 28 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isAnyLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(200,210,230,0.5)',
                  fontSize: 13,
                  cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                  padding: 0,
                  fontFamily: "'Inter', sans-serif",
                  transition: 'color 0.2s ease',
                  opacity: isAnyLoading ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isAnyLoading) e.currentTarget.style.color = '#0CCEC0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(200,210,230,0.5)';
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* SIGN IN button */}
            <motion.button
              type="submit"
              whileHover={isAnyLoading ? {} : { scale: 1.01 }}
              whileTap={isAnyLoading ? {} : { scale: 0.97 }}
              disabled={isAnyLoading}
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
                cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif",
                marginBottom: 20,
                transition: 'box-shadow 0.3s ease, opacity 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                opacity: isAnyLoading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <Spinner />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* ── or divider ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(200,210,230,0.08)' }} />
            <span style={{ fontSize: 13, color: 'rgba(200,210,230,0.3)', fontFamily: "'Inter', sans-serif" }}>
              or
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(200,210,230,0.08)' }} />
          </div>

          {/* Google button */}
          <motion.button
            type="button"
            whileHover={isAnyLoading ? {} : { scale: 1.01 }}
            whileTap={isAnyLoading ? {} : { scale: 0.97 }}
            onClick={handleGoogleSignIn}
            onHoverStart={() => { if (!isAnyLoading) setGoogleHovered(true); }}
            onHoverEnd={() => setGoogleHovered(false)}
            disabled={isAnyLoading}
            style={{
              width: '100%',
              background: '#0d0d18',
              border: `1px solid ${googleHovered && !isAnyLoading ? 'rgba(12,206,192,0.35)' : 'rgba(200,210,230,0.1)'}`,
              borderRadius: 4,
              padding: '12px',
              color: '#e8eaf6',
              fontSize: 14,
              fontWeight: 500,
              cursor: isAnyLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontFamily: "'Inter', sans-serif",
              marginBottom: 28,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
              boxShadow: googleHovered && !isAnyLoading ? '0 0 14px rgba(12,206,192,0.1)' : 'none',
              opacity: isAnyLoading ? 0.5 : 1,
            }}
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            {googleLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
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
              href="/signup"
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
        .nv-left-panel { display: flex; }
        .nv-mobile-wordmark { display: none; }
        @media (max-width: 1024px) {
          .nv-left-panel { display: none !important; }
          .nv-mobile-wordmark { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Page wrapper with Suspense (required for useSearchParams) ─── */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', height: '100vh', background: '#050508', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '3px solid rgba(12,206,192,0.2)',
              borderTopColor: '#0CCEC0',
            }}
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

'use client';

import { createClient } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

/* ─── Types ─── */
type AlertType = 'error' | 'success';
interface AlertState { type: AlertType; message: string }

/* ─── Google G SVG ─── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.017 17.64 11.71 17.64 9.2z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

/* ─── Spinner ─── */
function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <motion.path
        d="M12 2a10 10 0 0 1 10 10"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '12px', originY: '12px' }}
      />
    </svg>
  );
}

/* ─── Wordmark ─── */
function Wordmark() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: 'linear-gradient(135deg, #0CCEC0, rgba(12,206,192,0.4))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#050508" strokeWidth="3">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#e8eaf6', letterSpacing: '-0.02em' }}>
        Niche<span style={{ color: '#0CCEC0' }}>Vibe</span>
      </span>
    </Link>
  );
}

/* ─── Input field ─── */
function InputField({
  label, type, value, onChange, placeholder, disabled = false, hint,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  disabled?: boolean; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: disabled ? 'rgba(200,210,230,0.25)' : 'rgba(200,210,230,0.5)',
        marginBottom: 8, fontFamily: "'Inter', sans-serif", transition: 'color 0.2s ease',
      }}>
        {label}
      </label>
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={type === 'password' ? 'new-password' : type === 'email' ? 'email' : 'username'}
        style={{
          width: '100%',
          background: disabled ? 'rgba(5,5,8,0.5)' : '#050508',
          border: `1px solid ${focused && !disabled ? '#0CCEC0' : 'rgba(200,210,230,0.1)'}`,
          borderRadius: 4, padding: '12px 14px',
          color: disabled ? 'rgba(232,234,246,0.4)' : '#e8eaf6',
          fontSize: 14, outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: focused && !disabled ? '0 0 0 3px rgba(12,206,192,0.12)' : 'none',
          fontFamily: "'Inter', sans-serif",
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
        }}
      />
      {hint && (
        <p style={{ fontSize: 11, color: 'rgba(200,210,230,0.3)', marginTop: 6, fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ─── Alert box ─── */
function AlertBox({ alert }: { alert: AlertState }) {
  const isError = alert.type === 'error';
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '12px 14px', borderRadius: 6, marginBottom: 24,
        background: isError ? 'rgba(239,68,68,0.07)' : 'rgba(12,206,192,0.07)',
        border: `1px solid ${isError ? 'rgba(239,68,68,0.25)' : 'rgba(12,206,192,0.3)'}`,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 1 }}>
        {isError ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(252,165,165,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0CCEC0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
      </span>
      <span style={{ fontSize: 13, lineHeight: 1.5, color: isError ? 'rgba(252,165,165,0.9)' : 'rgba(12,206,192,0.9)', fontFamily: "'Inter', sans-serif" }}>
        {alert.message}
      </span>
    </motion.div>
  );
}

/* ─── Password strength bar ─── */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;

  const colors = ['rgba(239,68,68,0.7)', 'rgba(251,191,36,0.7)', 'rgba(34,197,94,0.6)', '#0CCEC0'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div style={{ marginTop: -12, marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= strength ? colors[strength - 1] : 'rgba(200,210,230,0.08)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, color: strength > 0 ? colors[strength - 1] : 'rgba(200,210,230,0.3)', fontFamily: "'Inter', sans-serif" }}>
        {strength > 0 ? labels[strength - 1] : ''}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN SIGNUP PAGE
═══════════════════════════════════════ */
export default function SignupPage() {
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [googleHovered, setGoogleHovered] = useState(false);
  const [verified, setVerified] = useState(false);

  const isAnyLoading = loading || googleLoading;

  /* ── Validation ── */
  const validate = (): string | null => {
    if (!username.trim()) return 'Please enter a username.';
    if (username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))
      return 'Username can only contain letters, numbers and underscores.';
    if (!email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return 'Please enter a valid email address.';
    if (!password) return 'Please create a password.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    return null;
  };

  /* ── Email sign-up ── */
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);

    const validationError = validate();
    if (validationError) {
      setAlert({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            username: username.trim(),
            display_name: username.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setAlert({ type: 'error', message: 'An account with this email already exists. Try signing in instead.' });
        } else {
          setAlert({ type: 'error', message: error.message });
        }
        return;
      }

      // Supabase returns identities=[] when email is already taken but unconfirmed
      if (data.user && data.user.identities?.length === 0) {
        setAlert({ type: 'error', message: 'An account with this email already exists. Try signing in instead.' });
        return;
      }

      setVerified(true);
    } catch {
      setAlert({ type: 'error', message: 'Something went wrong. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Google sign-up ── */
  const handleGoogleSignUp = async () => {
    setAlert(null);
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) {
        setAlert({ type: 'error', message: error.message });
        setGoogleLoading(false);
      }
    } catch {
      setAlert({ type: 'error', message: 'Could not connect to Google. Please try again.' });
      setGoogleLoading(false);
    }
  };

  /* ── Verify success screen ── */
  const SuccessCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%', maxWidth: 400,
        background: '#111122',
        border: '1px solid rgba(12,206,192,0.2)',
        borderRadius: 16, padding: '48px 36px',
        textAlign: 'center',
      }}
    >
      {/* Teal circle with checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
        style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(12,206,192,0.12)',
          border: '1px solid rgba(12,206,192,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0CCEC0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </motion.div>

      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: '#e8eaf6', letterSpacing: '-0.02em', marginBottom: 10 }}>
        Check Your Email
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(200,210,230,0.5)', lineHeight: 1.7, marginBottom: 32, fontFamily: "'Inter', sans-serif" }}>
        We sent a verification link to{' '}
        <span style={{ color: '#e8eaf6', fontWeight: 500 }}>{email}</span>.
        Click the link to activate your account and start discovering hidden gems.
      </p>

      <Link
        href="/login"
        style={{
          display: 'block', width: '100%',
          background: '#0CCEC0', border: 'none', borderRadius: 4,
          padding: '13px', color: '#050508',
          fontSize: 14, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          textDecoration: 'none', fontFamily: "'Inter', sans-serif",
          textAlign: 'center',
        }}
      >
        Back to Sign In
      </Link>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050508' }}>

      {/* ═══════════════════════════════════════
          LEFT PANEL — hidden on mobile
      ═══════════════════════════════════════ */}
      <div
        className="nv-left-panel"
        style={{ width: '60%', position: 'relative', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}
      >
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85')",
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,0.38)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(5,5,8,0.05) 0%, rgba(5,5,8,0.25) 55%, rgba(5,5,8,0.92) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,0.5) 0%, transparent 40%)' }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(12,206,192,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(12,206,192,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Wordmark */}
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
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}
          >
            <span style={{ color: '#0CCEC0', fontSize: 15, lineHeight: 1 }}>★</span>
            <span style={{ color: '#e8eaf6', fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>
              ANIME
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, lineHeight: 0.94, letterSpacing: '-0.03em', color: '#e8eaf6', fontSize: 'clamp(3.2rem, 4.8vw, 5.5rem)', marginBottom: 24, textShadow: '0 2px 48px rgba(0,0,0,0.5)' }}
          >
            YOUR VIBE,<br />YOUR GEMS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: 'easeOut' }}
            style={{ color: '#e8eaf6', fontSize: 18, fontWeight: 500, lineHeight: 1.5, marginBottom: 14, textShadow: '0 1px 24px rgba(0,0,0,0.7)' }}
          >
            Join thousands discovering hidden anime masterpieces.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
            style={{ color: 'rgba(232,234,246,0.6)', fontSize: 14, lineHeight: 1.8, maxWidth: 340 }}
          >
            No algorithms, no trending bias — just pure semantic vibe matching built for the true anime explorer.
          </motion.p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — full-width on mobile
      ═══════════════════════════════════════ */}
      <div style={{
        flex: 1, background: '#0d0d18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 24px', position: 'relative', overflowY: 'hidden',
      }}>
        {/* Mobile wordmark */}
        <div className="nv-mobile-wordmark" style={{ position: 'fixed', top: 24, left: 24, zIndex: 10 }}>
          <Wordmark />
        </div>

        <AnimatePresence mode="wait">
          {verified ? (
            <SuccessCard key="success" />
          ) : (
            /* ─── Signup Card ─── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '100%', maxWidth: 400,
                background: '#111122',
                border: '1px solid rgba(12,206,192,0.1)',
                borderRadius: 16, padding: '40px 36px',
              }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                style={{ marginBottom: 28 }}
              >
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#e8eaf6', letterSpacing: '-0.02em', marginBottom: 6 }}>
                  Create Account
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(200,210,230,0.5)', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                  Start your discovery journey today
                </p>
              </motion.div>

              {/* Alert */}
              <AnimatePresence mode="wait">
                {alert && <AlertBox key={alert.message} alert={alert} />}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSignUp} noValidate>
                <InputField
                  label="Username"
                  type="text"
                  value={username}
                  onChange={setUsername}
                  placeholder="e.g. anime_explorer"
                  disabled={isAnyLoading}
                  hint="Letters, numbers and underscores only. Min. 3 characters."
                />

                <InputField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter your email"
                  disabled={isAnyLoading}
                />

                <InputField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Create a password"
                  disabled={isAnyLoading}
                />

                {/* Password strength */}
                <PasswordStrength password={password} />

                {/* CREATE ACCOUNT button */}
                <motion.button
                  type="submit"
                  whileHover={isAnyLoading ? {} : { scale: 1.01 }}
                  whileTap={isAnyLoading ? {} : { scale: 0.97 }}
                  disabled={isAnyLoading}
                  className="btn-teal-glow shimmer-btn"
                  style={{
                    width: '100%', background: '#0CCEC0', border: 'none',
                    borderRadius: 4, padding: '13px', color: '#050508',
                    fontSize: 14, fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                    fontFamily: "'Inter', sans-serif", marginBottom: 20,
                    transition: 'box-shadow 0.3s ease, opacity 0.2s ease',
                    position: 'relative', overflow: 'hidden',
                    opacity: isAnyLoading ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {loading ? <><Spinner />Creating account...</> : 'Create Account'}
                </motion.button>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(200,210,230,0.08)' }} />
                <span style={{ fontSize: 13, color: 'rgba(200,210,230,0.3)', fontFamily: "'Inter', sans-serif" }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(200,210,230,0.08)' }} />
              </div>

              {/* Google button */}
              <motion.button
                type="button"
                whileHover={isAnyLoading ? {} : { scale: 1.01 }}
                whileTap={isAnyLoading ? {} : { scale: 0.97 }}
                onClick={handleGoogleSignUp}
                onHoverStart={() => { if (!isAnyLoading) setGoogleHovered(true); }}
                onHoverEnd={() => setGoogleHovered(false)}
                disabled={isAnyLoading}
                style={{
                  width: '100%', background: '#0d0d18',
                  border: `1px solid ${googleHovered && !isAnyLoading ? 'rgba(12,206,192,0.35)' : 'rgba(200,210,230,0.1)'}`,
                  borderRadius: 4, padding: '12px', color: '#e8eaf6',
                  fontSize: 14, fontWeight: 500,
                  cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  fontFamily: "'Inter', sans-serif", marginBottom: 28,
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                  boxShadow: googleHovered && !isAnyLoading ? '0 0 14px rgba(12,206,192,0.1)' : 'none',
                  opacity: isAnyLoading ? 0.5 : 1,
                }}
              >
                {googleLoading ? <Spinner /> : <GoogleIcon />}
                {googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
              </motion.button>

              {/* Sign in link */}
              <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(200,210,230,0.4)', fontFamily: "'Inter', sans-serif" }}>
                Already have an account?{' '}
                <Link
                  href="/login"
                  style={{ color: '#0CCEC0', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none')}
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive helpers */}
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

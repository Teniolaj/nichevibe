'use client';

import type { User } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

const NAV_LINKS = [
  { label: 'DISCOVER', href: '/discover', key: 'discover' },
  { label: 'EXPLORE', href: '/explore', key: 'explore' },
  { label: 'LIBRARY', href: '/library', key: 'library' },
];

/* ─── Avatar ─── */
function Avatar({
  user,
  size = 32,
  highlighted = false,
}: {
  user: User;
  size?: number;
  highlighted?: boolean;
}) {
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const fullName = (user.user_metadata?.full_name as string | undefined) ?? '';
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : (fullName.slice(0, 2) || (user.email?.[0] ?? '?')).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${highlighted ? '#0CCEC0' : '#1a1a35'}`,
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: highlighted ? '0 0 0 3px rgba(12,206,192,0.2)' : 'none',
      }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={fullName || 'User avatar'}
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0CCEC0, rgba(12,206,192,0.45))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#050508',
            fontSize: Math.round(size * 0.38),
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            userSelect: 'none',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

/* ─── Desktop user dropdown ─── */
function UserDropdown({
  user,
  onSignOut,
  signingOut,
  onClose,
}: {
  user: User;
  onSignOut: () => void;
  signingOut: boolean;
  onClose: () => void;
}) {
  const fullName = (user.user_metadata?.full_name as string | undefined) ?? '';
  const email = user.email ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        width: 240,
        background: '#111122',
        border: '1px solid #1a1a35',
        borderRadius: 6,
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        padding: 8,
        zIndex: 200,
      }}
    >
      {/* User identity */}
      <div style={{ padding: '8px 12px 10px' }}>
        {fullName && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#e8eaf6',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.01em',
              marginBottom: 2,
            }}
          >
            {fullName}
          </div>
        )}
        <div
          style={{
            fontSize: 12,
            color: 'rgba(200,210,230,0.45)',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {email}
        </div>
      </div>

      <Divider />

      {/* Navigation links */}
      <div style={{ padding: '4px 0' }}>
        <DropdownLink href="/library" onClick={onClose}>
          MY LIBRARY
        </DropdownLink>
        <div
          title="Coming soon..."
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: 4,
            fontSize: 13,
            color: 'rgba(200,210,230,0.3)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'not-allowed',
            userSelect: 'none',
          }}
        >
          SETTINGS
          <span style={{ fontSize: 10, color: 'rgba(200,210,230,0.25)', fontStyle: 'italic' }}>
            Coming soon...
          </span>
        </div>
      </div>

      <Divider />

      {/* Sign out */}
      <button
        onClick={onSignOut}
        disabled={signingOut}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px 12px',
          borderRadius: 4,
          fontSize: 13,
          color: signingOut ? 'rgba(252,165,165,0.35)' : 'rgba(252,165,165,0.8)',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          cursor: signingOut ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s ease, color 0.15s ease',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={(e) => {
          if (!signingOut) {
            e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
            e.currentTarget.style.color = 'rgba(252,165,165,1)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = signingOut
            ? 'rgba(252,165,165,0.35)'
            : 'rgba(252,165,165,0.8)';
        }}
      >
        {signingOut ? 'Signing out...' : 'SIGN OUT'}
      </button>
    </motion.div>
  );
}

/* ─── Small helpers ─── */
function Divider() {
  return <div style={{ height: 1, background: '#1a1a35', margin: '4px 0' }} />;
}

function DropdownLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'block',
        padding: '8px 12px',
        borderRadius: 4,
        fontSize: 13,
        color: '#e8eaf6',
        textDecoration: 'none',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        letterSpacing: '0.02em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(12,206,192,0.06)';
        (e.currentTarget as HTMLAnchorElement).style.color = '#0CCEC0';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
        (e.currentTarget as HTMLAnchorElement).style.color = '#e8eaf6';
      }}
    >
      {children}
    </Link>
  );
}

/* ═══════════════════════════════════════
   MAIN NAVBAR
═══════════════════════════════════════ */
export default function Navbar({ active }: { active?: 'discover' | 'explore' | 'library' }) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarHighlighted, setAvatarHighlighted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [signedInToast, setSignedInToast] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Auth state: get user on mount + listen for changes ── */
  useEffect(() => {
    const supabase = createClient();

    // Hydrate immediately from existing session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthLoading(false);
    });

    // React to sign-in / sign-out events in real time
    let toastTimer: ReturnType<typeof setTimeout> | null = null;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (event === 'SIGNED_IN' && session?.user) {
        setSignedInToast(true);
        toastTimer = setTimeout(() => setSignedInToast(false), 2200);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, []); // runs once on mount; createClient() returns a stable singleton

  /* ── Close dropdown when clicking outside ── */
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen]);

  /* ── Body scroll lock when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /* ── Sign out ── */
  const handleSignOut = async () => {
    setSigningOut(true);
    setDropdownOpen(false);
    setMenuOpen(false);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('[Navbar] Sign out error:', err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          SIGNED-IN TOAST — brief feedback when returning from OAuth
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {signedInToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9998,
              padding: '12px 24px',
              borderRadius: 10,
              background: 'rgba(12,206,192,0.12)',
              border: '1px solid rgba(12,206,192,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: 18 }}>✓</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0CCEC0', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.04em' }}>
              Signed in
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          SIGN-OUT OVERLAY — full-screen app-like transition
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {signingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5,5,8,0.96)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}
          >
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
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'rgba(200,210,230,0.7)',
                letterSpacing: '0.12em',
                fontFamily: "'Space Grotesk', sans-serif",
                textTransform: 'uppercase',
              }}
            >
              Signing out...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          DESKTOP / TABLET NAVBAR
      ═══════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
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
        <Link href="/" aria-label="NicheVibe home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0CCEC0, rgba(12,206,192,0.4))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#050508"
              strokeWidth="3"
            >
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

        {/* Nav links */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {NAV_LINKS.map((link) => {
            const isActive = active === link.key;
            return (
              <Link
                key={link.key}
                href={link.href}
                style={{
                  fontSize: 12,
                  color: isActive ? '#0CCEC0' : 'rgba(200,210,230,0.45)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: 'color 0.2s',
                  paddingBottom: isActive ? 2 : 0,
                  borderBottom: isActive ? '1px solid #0CCEC0' : '1px solid transparent',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side — loading, sign up, OR user menu */}
        <div
          ref={dropdownRef}
          className="hidden-mobile"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: 100, justifyContent: 'flex-end' }}
        >
          {authLoading ? (
            /* ─── Auth loading ─── */
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2px solid rgba(12,206,192,0.2)',
                  borderTopColor: '#0CCEC0',
                }}
              />
            </div>
          ) : user ? (
            /* ─── Authenticated ─── */
            <>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                onMouseEnter={() => setAvatarHighlighted(true)}
                onMouseLeave={() => setAvatarHighlighted(false)}
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar user={user} size={34} highlighted={avatarHighlighted || dropdownOpen} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <UserDropdown
                    key="dropdown"
                    user={user}
                    onSignOut={handleSignOut}
                    signingOut={signingOut}
                    onClose={() => setDropdownOpen(false)}
                  />
                )}
              </AnimatePresence>
            </>
          ) : (
            /* ─── Unauthenticated ─── */
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-block',
                  padding: '8px 24px',
                  borderRadius: 8,
                  background: '#0CCEC0',
                  border: '1px solid #0CCEC0',
                  color: '#050508',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '0.04em',
                }}
              >
                SIGN UP
              </motion.span>
            </Link>
          )}
        </div>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="show-mobile"
          aria-label="Open menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            color: '#e8eaf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </motion.nav>

      {/* ═══════════════════════════════════════
          MOBILE FULL-SCREEN MENU
      ═══════════════════════════════════════ */}
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
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
                top: 20,
                right: 24,
                background: 'none',
                border: 'none',
                color: 'rgba(200,210,230,0.6)',
                cursor: 'pointer',
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e8eaf6')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(200,210,230,0.6)')}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* User info — shown at TOP when signed in */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 40,
                  padding: '14px 20px',
                  background: 'rgba(12,206,192,0.04)',
                  border: '1px solid rgba(12,206,192,0.1)',
                  borderRadius: 12,
                }}
              >
                <Avatar user={user} size={42} />
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#e8eaf6',
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {(user.user_metadata?.full_name as string | undefined) ??
                      user.email?.split('@')[0]}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(200,210,230,0.45)',
                      fontFamily: "'Inter', sans-serif",
                      marginTop: 2,
                    }}
                  >
                    {user.email}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Nav links */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 32,
                marginBottom: 48,
              }}
            >
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
                        fontSize: '1.5rem',
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

            {/* Bottom CTA — loading, sign up (guest), OR sign out (authenticated) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              {authLoading ? (
                <div
                  style={{
                    padding: '14px 48px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(200,210,230,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '2px solid rgba(12,206,192,0.2)',
                      borderTopColor: '#0CCEC0',
                    }}
                  />
                  <span style={{ fontSize: 13, color: 'rgba(200,210,230,0.4)', fontFamily: "'Space Grotesk', sans-serif" }}>
                    Loading...
                  </span>
                </div>
              ) : user ? (
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  style={{
                    padding: '14px 48px',
                    borderRadius: 10,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: signingOut ? 'rgba(252,165,165,0.35)' : 'rgba(252,165,165,0.85)',
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: signingOut ? 'not-allowed' : 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
                </button>
              ) : (
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      display: 'inline-block',
                      padding: '14px 48px',
                      borderRadius: 10,
                      background: '#0CCEC0',
                      border: '1px solid #0CCEC0',
                      color: '#050508',
                      fontSize: 16,
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    SIGN UP
                  </motion.span>
                </Link>
              )}
            </motion.div>
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

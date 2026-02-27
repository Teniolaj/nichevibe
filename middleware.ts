import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Start with a passthrough response; the cookie helpers below may swap it out
  let res = NextResponse.next({
    request: { headers: req.headers },
  });

  // @supabase/ssr is Edge-compatible — cookie get/set/remove wired to Next.js
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Write cookie onto the request (for the current handler) …
          req.cookies.set({ name, value, ...options });
          // … and onto the response (so the browser receives it)
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  // Refresh the session on every request (keeps the token from going stale)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ── Protected routes — must be signed in ──────────────────────────────────
  const protectedPaths = ['/discover', '/library'];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Auth pages — redirect signed-in users away ────────────────────────────
  const authPaths = ['/login', '/signup'];
  const isAuthPage = authPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/discover', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/discover/:path*',
    '/library/:path*',
    '/login',
    '/signup',
  ],
};

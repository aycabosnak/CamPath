/**
 * middleware.ts — Auth & role-gating placeholder
 *
 * FIX (routing bug report): this previously redirected any request to
 * an AUTH_PREFIXES route to "/login" whenever `session` was falsy —
 * and since `session` is hardcoded to `null` until real auth exists,
 * EVERY request to /my-journey, /account, or /writing was redirected
 * to a page that was never built ("/login" doesn't exist), causing a
 * 404. This is Design Review Report Finding #21 made concrete.
 *
 * Until real auth exists, there is nothing meaningful to gate, so
 * this middleware no longer redirects student-auth routes at all —
 * pretending to protect them with a permanently-null session was
 * worse than not gating them, because it silently broke navigation.
 * Teacher routes are left gated (with a comment, not a redirect to a
 * nonexistent page) as a reminder for when real auth lands.
 */
import { NextRequest, NextResponse } from "next/server";

const INTERNAL_PREFIXES = ["/design-system"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Internal/QA-only routes: still blocked in production builds.
  if (INTERNAL_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // TODO once real auth exists (Database & API Design doc, Section 4.1):
  // - Verify the access token cookie here.
  // - Redirect unauthenticated users away from /my-journey, /account,
  //   /writing, and unauthenticated/non-teacher users away from /teacher.
  // - Only wire these redirects up once /login actually exists as a page.

  return NextResponse.next();
}

export const config = {
  matcher: ["/design-system/:path*"],
};

/**
 * middleware.ts — Auth & role-gating placeholder
 *
 * Real implementation depends on the chosen backend's token format
 * (see Database & API Design doc, Section 0 — JWT with a `role` claim).
 * This file only sketches the decision points so route groups have
 * a concrete enforcement point from day one.
 */
import { NextRequest, NextResponse } from "next/server";

const TEACHER_PREFIX = "/teacher";
const AUTH_PREFIXES = ["/my-journey", "/account", "/writing"];
const INTERNAL_PREFIXES = ["/design-system"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO: replace with real session/JWT verification against the
  // access token cookie once the auth API (Section 4.1) exists.
  const session: { role?: "student" | "teacher" | "parent" | "admin" } | null = null;

  if (INTERNAL_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (TEACHER_PREFIX && pathname.startsWith(TEACHER_PREFIX)) {
    if (!session || session.role !== "teacher") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-journey/:path*", "/account/:path*", "/writing/:path*", "/teacher/:path*", "/design-system/:path*"],
};

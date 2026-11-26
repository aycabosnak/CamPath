/**
 * lib/authSession.ts
 *
 * Where the signed-in session lives on this device. Dependency-free on
 * purpose: both the API client (to attach the token) and authService
 * (to create/clear the session) need it, and neither may import the
 * other without a cycle.
 *
 * Storage choice: the JWT is kept in localStorage and sent as a Bearer
 * header. That keeps the API usable from any origin (separate frontend
 * and backend deployments) at the cost of being readable by injected
 * script — acceptable here because the app renders no user-generated
 * HTML. Moving to an httpOnly cookie is the upgrade path once frontend
 * and API share a domain (see docs/TechnicalDecisions.md).
 */
import { STORAGE_KEYS } from "@/constants/storageKeys";

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAt: string;
  user: SessionUser;
}

export const AUTH_CHANGED_EVENT = "campath:auth-changed";

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.authSession);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEYS.authSession);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthSession | null): void {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEYS.authSession);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

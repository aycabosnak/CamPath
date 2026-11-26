/**
 * services/authService.ts
 *
 * Sign-in / sign-up / sign-out for the learner. Accounts are optional:
 * everything still works signed-out on one device (localStorage), and
 * signing in only adds backup + cross-device sync on top.
 */
import * as authApi from "@/lib/api-client/auth";
import { readSession, writeSession, type AuthSession } from "@/lib/authSession";
import { syncNow, type SyncOutcome } from "@/services/syncService";
import { trackEvent } from "@/services/analyticsService";

export function getSession(): AuthSession | null {
  return readSession();
}

/**
 * Signs in, then immediately merges this device's progress into the
 * account (and pulls down anything recorded on other devices). The
 * sign-in succeeds even if that first sync fails — it'll retry later.
 */
export async function signIn(email: string, password: string): Promise<SyncOutcome> {
  const session = await authApi.login(email, password);
  writeSession(session);
  trackEvent("login", {});
  return syncNow();
}

export async function signUp(email: string, password: string, displayName: string): Promise<SyncOutcome> {
  const session = await authApi.register({ email, password, displayName });
  writeSession(session);
  trackEvent("signup", {});
  return syncNow();
}

/**
 * Signs out on this device. Progress stays in localStorage — it's the
 * learner's own device, and wiping it would surprise people who sign
 * out just to switch accounts back later.
 */
export function signOut(): void {
  writeSession(null);
  trackEvent("logout", {});
}

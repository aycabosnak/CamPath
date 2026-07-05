/**
 * lib/api-client/auth.ts
 * Mirrors Database & API Design doc, Section 4.1 and 5.2.
 */
import { apiRequest } from "./index";
import type { User } from "@/types/entities";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    authenticated: false,
  });
}

/**
 * `guest_token` is optional here specifically to support the Guest →
 * Account Claim flow: if the person just finished a Placement Test as
 * a guest, the token they were issued gets passed through so the
 * backend can attach that LevelTestSession to the new account in the
 * same request — see Database & API Design doc Section 5.2.
 */
export function signup(params: { email: string; password: string; guest_token?: string }) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: params,
    authenticated: false,
  });
}

export function refreshSession() {
  return apiRequest<{ access_token: string }>("/auth/refresh", { method: "POST" });
}

export function requestPasswordReset(email: string) {
  return apiRequest<{ ok: true }>("/auth/reset-password", {
    method: "POST",
    body: { email },
    authenticated: false,
  });
}

/**
 * lib/api-client/auth.ts
 *
 * Typed calls to the ASP.NET Core API's /api/auth endpoints
 * (backend/src/CamPath.Api/Controllers/AuthController.cs).
 *
 * Replaces the earlier pre-backend sketch (signup/refresh/reset with
 * snake_case fields): the real API issues one access token per sign-in
 * and has no refresh or password-reset endpoints yet — see
 * docs/PROJECT_STATUS.md for what's deferred.
 */
import { apiRequest } from "./index";
import type { AuthSession, SessionUser } from "@/lib/authSession";

export type AuthResponse = AuthSession;

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    authenticated: false,
  });
}

export function register(params: { email: string; password: string; displayName: string }) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: params,
    authenticated: false,
  });
}

export function me() {
  return apiRequest<SessionUser>("/auth/me");
}

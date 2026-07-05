/**
 * lib/api-client/index.ts
 *
 * Single choke point for every HTTP call the frontend makes.
 *
 * Technical Reasoning (see Database & API Design doc, Section 0 and
 * the IA Blueprint's "Future Django Integration Strategy"): no other
 * file in the app should call `fetch` directly against the backend.
 * If the backend's response envelope or auth mechanism changes later
 * (e.g. moving to Django REST Framework), only this file changes —
 * every page and component keeps working against the same typed
 * function signatures in the sibling api-client modules.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the current access token. Defaults to true — pass false
   *  only for genuinely public endpoints (content graph, guest level test). */
  authenticated?: boolean;
}

/**
 * TODO once auth exists: read the access token from wherever the
 * chosen auth strategy stores it (httpOnly cookie read server-side,
 * or a client-side store) and attach it as `Authorization: Bearer`.
 */
function getAccessToken(): string | null {
  return null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, authenticated = true } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authenticated) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Backend error shape is not finalized yet — normalize defensively
    // rather than assuming a specific error envelope.
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      /* response wasn't JSON — keep the generic message */
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

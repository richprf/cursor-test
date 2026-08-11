import type { AuthResponse, BackendUser } from '@/types/api';

/**
 * Thin client for the NestJS API. Everything here runs on the server only —
 * the browser never sees the API access token or talks to NestJS directly.
 */

export class BackendError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'BackendError';
  }
}

function apiUrl(path: string): string {
  const baseUrl = process.env.NEST_API_URL;
  if (!baseUrl) {
    throw new Error('NEST_API_URL is not set — copy .env.local.example to .env.local');
  }
  return new URL(path, baseUrl).toString();
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    cache: 'no-store',
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new BackendError(response.status, extractMessage(body) ?? response.statusText);
  }

  return body as T;
}

/** NestJS validation errors arrive as `{ message: string | string[] }`. */
function extractMessage(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const { message } = body as { message?: unknown };
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.join('، ');
  return null;
}

export function login(input: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function register(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Trades the Google `id_token` for an access token issued by NestJS. The backend
 * re-verifies the token with Google, so a forged profile gets nowhere.
 */
export function exchangeGoogleIdToken(idToken: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/oauth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

/** Example of calling a protected NestJS route with the session's access token. */
export function getMe(accessToken: string): Promise<BackendUser> {
  return request<BackendUser>('/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

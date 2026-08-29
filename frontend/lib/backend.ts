import type {
  AccountRole,
  AuthResponse,
  BackendUser,
  CartItem,
  CartResponse,
  WishlistItem,
  WishlistResponse,
} from '@/types/api';
import type { GoldPriceSnapshot } from '@/lib/gold-price';

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
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(apiUrl(path), {
    cache: 'no-store',
    ...init,
    headers,
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
  role: AccountRole;
  shopName?: string;
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

export function completeProfile(
  accessToken: string,
  input: { role: AccountRole; shopName?: string },
): Promise<BackendUser> {
  return request<BackendUser>('/auth/complete-profile', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(input),
  });
}

export function uploadShopLogo(accessToken: string, file: File): Promise<BackendUser> {
  const body = new FormData();
  body.append('file', file);
  return request<BackendUser>('/auth/shop/logo', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body,
  });
}

/** Price snapshot for the first server render; the browser's WebSocket takes over afterwards. */
export function getGoldPriceSnapshot(): Promise<GoldPriceSnapshot> {
  return request<GoldPriceSnapshot>('/gold-price/snapshot', { method: 'GET' });
}

/** Example of calling a protected NestJS route with the session's access token. */
export function getMe(accessToken: string): Promise<BackendUser> {
  return request<BackendUser>('/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function bearer(accessToken: string): HeadersInit {
  return { Authorization: `Bearer ${accessToken}` };
}

export function getWishlist(accessToken: string): Promise<WishlistResponse> {
  return request<WishlistResponse>('/wishlist', {
    method: 'GET',
    headers: bearer(accessToken),
  });
}

export function addWishlistItem(accessToken: string, productId: string): Promise<WishlistItem> {
  return request<WishlistItem>('/wishlist', {
    method: 'POST',
    headers: bearer(accessToken),
    body: JSON.stringify({ productId }),
  });
}

export function removeWishlistItem(accessToken: string, productId: string): Promise<{ productId: string }> {
  return request<{ productId: string }>(`/wishlist/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: bearer(accessToken),
  });
}

export function getCart(accessToken: string): Promise<CartResponse> {
  return request<CartResponse>('/cart', {
    method: 'GET',
    headers: bearer(accessToken),
  });
}

export function addCartItem(
  accessToken: string,
  productId: string,
  quantity = 1,
): Promise<CartItem> {
  return request<CartItem>('/cart', {
    method: 'POST',
    headers: bearer(accessToken),
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(
  accessToken: string,
  productId: string,
  quantity: number,
): Promise<CartItem> {
  return request<CartItem>(`/cart/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    headers: bearer(accessToken),
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(accessToken: string, productId: string): Promise<{ productId: string }> {
  return request<{ productId: string }>(`/cart/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: bearer(accessToken),
  });
}

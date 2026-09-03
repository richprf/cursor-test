import type { CartItem, CartResponse, ProductListing, ProductsResponse, WishlistItem, WishlistResponse } from '@/types/api';

async function readJson<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as { message: unknown }).message)
        : response.statusText;
    const error = new Error(message);
    (error as Error & { status: number }).status = response.status;
    throw error;
  }
  return body as T;
}

/** Authenticated NestJS calls — the BFF attaches the access token server-side. */
function proxy(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`/api/proxy${path}`, { cache: 'no-store', ...init });
}

export function fetchWishlist(): Promise<WishlistResponse> {
  return proxy('/wishlist').then((response) => readJson<WishlistResponse>(response));
}

export function postWishlist(productId: string): Promise<WishlistItem> {
  return proxy('/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  }).then((response) => readJson<WishlistItem>(response));
}

export function deleteWishlist(productId: string): Promise<{ productId: string }> {
  return proxy(`/wishlist/${encodeURIComponent(productId)}`, { method: 'DELETE' }).then(
    (response) => readJson<{ productId: string }>(response),
  );
}

export function fetchCart(): Promise<CartResponse> {
  return proxy('/cart').then((response) => readJson<CartResponse>(response));
}

export function postCart(productId: string, quantity = 1): Promise<CartItem> {
  return proxy('/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  }).then((response) => readJson<CartItem>(response));
}

export function patchCart(productId: string, quantity: number): Promise<CartItem> {
  return proxy(`/cart/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }).then((response) => readJson<CartItem>(response));
}

export function deleteCart(productId: string): Promise<{ productId: string }> {
  return proxy(`/cart/${encodeURIComponent(productId)}`, { method: 'DELETE' }).then((response) =>
    readJson<{ productId: string }>(response),
  );
}

/** Public seller listings — no auth header, so this stays off the BFF. */
export function fetchProducts(): Promise<ProductsResponse> {
  return fetch('/api/products', { cache: 'no-store' }).then((response) =>
    readJson<ProductsResponse>(response),
  );
}

export function fetchMyProducts(): Promise<ProductsResponse> {
  return proxy('/products/mine').then((response) => readJson<ProductsResponse>(response));
}

export function postProduct(body: FormData): Promise<ProductListing> {
  return proxy('/products', { method: 'POST', body }).then((response) =>
    readJson<ProductListing>(response),
  );
}

export function patchProduct(id: string, body: FormData): Promise<ProductListing> {
  return proxy(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body }).then((response) =>
    readJson<ProductListing>(response),
  );
}

export function deleteListing(id: string): Promise<{ id: string }> {
  return proxy(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }).then((response) =>
    readJson<{ id: string }>(response),
  );
}

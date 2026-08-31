export type AccountRole = 'BUYER' | 'SELLER';
export type UserRole = AccountRole | 'ADMIN';

export interface BackendUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  provider: 'CREDENTIALS' | 'GOOGLE';
  onboardingComplete: boolean;
  shopName: string | null;
  logoUrl: string | null;
}

/** Response shape of `/auth/login`, `/auth/register` and `/auth/oauth/google`. */
export interface AuthResponse {
  user: BackendUser;
  accessToken: string;
  /** Epoch milliseconds. */
  accessTokenExpires: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
}

export interface ProductListing {
  id: string;
  sellerId: string;
  name: string;
  imageUrl: string | null;
  weightGrams: number;
  karat: number;
  price: number;
  description: string | null;
  quantity: number | null;
  shopName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  items: ProductListing[];
}

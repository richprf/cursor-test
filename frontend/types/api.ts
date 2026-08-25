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

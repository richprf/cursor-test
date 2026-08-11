export type UserRole = 'USER' | 'ADMIN';

export interface BackendUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  provider: 'CREDENTIALS' | 'GOOGLE';
}

/** Response shape of `/auth/login`, `/auth/register` and `/auth/oauth/google`. */
export interface AuthResponse {
  user: BackendUser;
  accessToken: string;
  /** Epoch milliseconds. */
  accessTokenExpires: number;
}

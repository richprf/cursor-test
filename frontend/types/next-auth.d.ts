import type { DefaultSession } from 'next-auth';
import type { UserRole } from '@/types/api';

/**
 * NestJS-owned profile fields are copied onto the session for the UI.
 * Access/refresh tokens stay on the encrypted JWT and are never put here —
 * `/api/auth/session` would otherwise leak them to any script on the page.
 */
declare module 'next-auth' {
  interface Session {
    /** Set when the NestJS token expired and the user has to sign in again. */
    error?: 'AccessTokenExpired' | 'RefreshTokenExpired';
    user: {
      id: string;
      role: UserRole;
      onboardingComplete: boolean;
      shopName?: string | null;
      logoUrl?: string | null;
      googleLinked?: boolean;
    } & DefaultSession['user'];
  }

  /** What `CredentialsProvider.authorize()` returns. */
  interface User {
    role?: UserRole;
    onboardingComplete?: boolean;
    shopName?: string | null;
    logoUrl?: string | null;
    googleLinked?: boolean;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
  }
}

// `next-auth/jwt` only re-exports this interface, so the augmentation has to target
// the module that declares it.
declare module '@auth/core/jwt' {
  interface JWT {
    /** Id of the user row in Postgres (not the Google `sub`). */
    userId?: string;
    role?: UserRole;
    onboardingComplete?: boolean;
    shopName?: string | null;
    logoUrl?: string | null;
    googleLinked?: boolean;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    error?: 'AccessTokenExpired' | 'RefreshTokenExpired';
  }
}

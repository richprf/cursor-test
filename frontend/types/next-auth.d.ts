import type { DefaultSession } from 'next-auth';
import type { UserRole } from '@/types/api';

/**
 * The NestJS access token and the fields NestJS owns (id, role) are carried
 * through the NextAuth JWT and exposed on the session.
 */
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
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

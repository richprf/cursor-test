import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import {
  BackendError,
  assertGoogleSignInAllowed,
  exchangeGoogleIdToken,
  getMe,
  linkGoogleAccount,
  login,
  refreshAccessToken,
  revokeRefreshToken,
} from '@/lib/backend';
import { loginSchema } from '@/lib/validation';
import type { BackendUser } from '@/types/api';

/**
 * NextAuth is only the session layer: NestJS stays the source of truth for users
 * and issues the access token that every later API call carries.
 *
 * Keep this module edge-safe (no Node-only imports) — `middleware.ts` imports it.
 */

/** Surfaces as `?code=invalid_credentials` on the login page. */
class InvalidCredentials extends CredentialsSignin {
  code = 'invalid_credentials';
}

/** The API is down or unreachable — worth telling the user apart from a typo. */
class BackendUnavailable extends CredentialsSignin {
  code = 'backend_unavailable';
}

/** The API's brute-force limiter kicked in. */
class TooManyRequests extends CredentialsSignin {
  code = 'too_many_requests';
}

/** Keep the NextAuth cookie alive as long as a refresh token can still be used. */
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const ACCESS_TOKEN_REFRESH_SKEW_MS = 60_000;

function copyBackendUser(tokenTarget: Record<string, unknown>, user: BackendUser) {
  tokenTarget.userId = user.id;
  tokenTarget.role = user.role;
  tokenTarget.onboardingComplete = user.onboardingComplete;
  tokenTarget.shopName = user.shopName;
  tokenTarget.logoUrl = user.logoUrl;
  tokenTarget.name = user.name;
  tokenTarget.email = user.email;
  tokenTarget.picture = user.image;
  tokenTarget.googleLinked = user.googleLinked;
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  trustHost: true,
  // NestJS owns the user data, so there is nothing to persist here.
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE_SECONDS },
  jwt: { maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: '/login', error: '/login' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'ایمیل', type: 'email' },
        password: { label: 'رمز عبور', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new InvalidCredentials();
        }

        try {
          const { user, accessToken, accessTokenExpires, refreshToken } = await login(parsed.data);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            onboardingComplete: user.onboardingComplete,
            shopName: user.shopName,
            logoUrl: user.logoUrl,
            googleLinked: user.googleLinked,
            accessToken,
            accessTokenExpires,
            refreshToken,
          };
        } catch (error) {
          if (error instanceof BackendError && error.status === 401) {
            throw new InvalidCredentials();
          }
          if (error instanceof BackendError && error.status === 429) {
            throw new TooManyRequests();
          }
          console.error('[auth] credentials login failed', error);
          throw new BackendUnavailable();
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account?.provider !== 'google') return true;
      if (!account.id_token) return false;

      // Already-authenticated users are linking Google; jwt handles `/auth/link-google`.
      const session = await auth();
      if (session?.user?.id && !session.error) return true;

      try {
        await assertGoogleSignInAllowed(account.id_token);
        return true;
      } catch (error) {
        if (
          error instanceof BackendError &&
          (error.status === 409 || error.code === 'CREDENTIALS_ACCOUNT_EXISTS')
        ) {
          return '/login?error=OAuthAccountNotLinked';
        }
        return '/login?error=OAuthCallbackError';
      }
    },

    async jwt({ token, user, account, trigger }) {
      // Credentials: `user` is exactly what `authorize()` returned above.
      if (account?.provider === 'credentials' && user) {
        token.userId = user.id;
        token.role = user.role;
        token.onboardingComplete = user.onboardingComplete;
        token.shopName = user.shopName;
        token.logoUrl = user.logoUrl;
        token.googleLinked = user.googleLinked;
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.refreshToken = user.refreshToken;
        delete token.error;
      }

      // Google: swap the Google `id_token` for an access token minted by NestJS,
      // which also creates or links the user row on first sign-in.
      if (account?.provider === 'google') {
        if (!account.id_token) {
          throw new Error('Google did not return an id_token');
        }

        if (token.accessToken && token.userId) {
          try {
            const linked = await linkGoogleAccount(token.accessToken, account.id_token);
            copyBackendUser(token as unknown as Record<string, unknown>, linked);
            delete token.error;
          } catch (error) {
            console.error('[auth] linking Google to the current session failed', error);
          }
        } else {
          const { user: backendUser, accessToken, accessTokenExpires, refreshToken } =
            await exchangeGoogleIdToken(account.id_token);

          copyBackendUser(token as unknown as Record<string, unknown>, backendUser);
          token.accessToken = accessToken;
          token.accessTokenExpires = accessTokenExpires;
          token.refreshToken = refreshToken;
          delete token.error;
        }
      }

      // After complete-profile (or a logo upload) pull the latest role/shop from Nest.
      if (trigger === 'update' && token.accessToken) {
        try {
          const me = await getMe(token.accessToken);
          copyBackendUser(token as unknown as Record<string, unknown>, me);
        } catch (error) {
          console.error('[auth] session update failed to refresh /auth/me', error);
        }
      }

      const expiresAt = token.accessTokenExpires;
      const needsRefresh =
        typeof expiresAt === 'number' && Date.now() >= expiresAt - ACCESS_TOKEN_REFRESH_SKEW_MS;

      if (needsRefresh && token.refreshToken) {
        try {
          const refreshed = await refreshAccessToken(token);
          token.accessToken = refreshed.accessToken;
          token.accessTokenExpires = refreshed.accessTokenExpires;
          token.refreshToken = refreshed.refreshToken;
          delete token.error;
        } catch (error) {
          console.error('[auth] refresh token failed', error);
          token.error = 'RefreshTokenExpired';
        }
      } else if (typeof expiresAt === 'number' && Date.now() >= expiresAt) {
        // Older sessions issued before refresh tokens existed.
        token.error = 'AccessTokenExpired';
      }

      return token;
    },

    // Keep secrets off this object: `/api/auth/session` returns it to the browser.
    // The Nest access/refresh tokens stay on the encrypted JWT cookie only.
    session({ session, token }) {
      session.user.id = token.userId ?? session.user.id;
      session.user.role = token.role ?? 'BUYER';
      session.user.onboardingComplete = token.onboardingComplete ?? true;
      session.user.shopName = token.shopName ?? null;
      session.user.logoUrl = token.logoUrl ?? null;
      session.user.googleLinked = token.googleLinked ?? false;
      session.error = token.error;
      return session;
    },
  },
  events: {
    async signOut(message) {
      const refreshToken =
        'token' in message ? (message.token as { refreshToken?: string }).refreshToken : undefined;
      if (!refreshToken) return;
      try {
        await revokeRefreshToken(refreshToken);
      } catch (error) {
        console.error('[auth] failed to revoke refresh token on sign-out', error);
      }
    },
  },
});

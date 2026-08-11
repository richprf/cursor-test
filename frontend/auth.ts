import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { BackendError, exchangeGoogleIdToken, login } from '@/lib/backend';
import { loginSchema } from '@/lib/validation';

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

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // keep in sync with JWT_EXPIRES_IN

export const { handlers, auth, signIn, signOut } = NextAuth({
  // NestJS owns the user data, so there is nothing to persist here.
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE_SECONDS },
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
          const { user, accessToken, accessTokenExpires } = await login(parsed.data);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            accessToken,
            accessTokenExpires,
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
    async jwt({ token, user, account }) {
      // Credentials: `user` is exactly what `authorize()` returned above.
      if (account?.provider === 'credentials' && user) {
        token.userId = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
        delete token.error;
      }

      // Google: swap the Google `id_token` for an access token minted by NestJS,
      // which also creates or links the user row on first sign-in.
      if (account?.provider === 'google') {
        if (!account.id_token) {
          throw new Error('Google did not return an id_token');
        }

        const { user: backendUser, accessToken, accessTokenExpires } =
          await exchangeGoogleIdToken(account.id_token);

        token.userId = backendUser.id;
        token.role = backendUser.role;
        token.name = backendUser.name;
        token.email = backendUser.email;
        token.picture = backendUser.image;
        token.accessToken = accessToken;
        token.accessTokenExpires = accessTokenExpires;
        delete token.error;
      }

      // There is no refresh token, so an expired access token means "sign in again".
      if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
        token.error = 'AccessTokenExpired';
      }

      return token;
    },

    // Note: whatever lands on `session` is also returned by `/api/auth/session`, so
    // the access token is readable by the browser. That is intentional here (client
    // components may need it); drop it below to keep the token server-only.
    session({ session, token }) {
      session.user.id = token.userId ?? session.user.id;
      session.user.role = token.role ?? 'USER';
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});

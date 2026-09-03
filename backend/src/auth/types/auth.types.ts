import type { PublicUser } from '../../users/users.service';

/** Claims of the access token issued by this API. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  /** Access token expiry as epoch milliseconds, so the client can refresh in time. */
  accessTokenExpires: number;
  refreshToken: string;
}

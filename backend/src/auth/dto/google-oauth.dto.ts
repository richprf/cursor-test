import { IsJWT, IsString } from 'class-validator';

/**
 * Only the Google `id_token` is accepted: profile fields are read from the
 * verified token payload so the frontend cannot claim an arbitrary identity.
 */
export class GoogleOAuthDto {
  @IsString()
  @IsJWT({ message: 'idToken must be a Google id_token (JWT)' })
  idToken!: string;
}

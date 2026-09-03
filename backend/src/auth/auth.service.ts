import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService, type PublicUser, type UserWithShop, type GoogleProfile } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import type { AuthResponse, JwtPayload } from './types/auth.types';
import { publicLogoUrl } from './logo-upload';
import { CredentialsAccountExistsException } from './credentials-account-exists.exception';

const BCRYPT_ROUNDS = 12;

/**
 * Compared against when the email is unknown or has no password, so that a wrong
 * email and a wrong password take a similar amount of time to answer.
 */
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.CtM3n4qMs2/eiVQ0hcpiVMoTiCUAP2u';

const DEFAULT_ACCESS_TTL = '15m';
const DEFAULT_REFRESH_TTL = '30d';
const REFRESH_REUSE_GRACE_MS = 10_000;

type RefreshTokenRow = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedById: string | null;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    try {
      const existing = await this.users.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('An account with this email already exists');
      }

      const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
      const user = await this.users.createWithPassword({
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role,
        shopName: dto.shopName,
      });

      return this.buildAuthResponse(user);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      if (isPrismaCode(error, 'P2002')) {
        throw new ConflictException('An account with this email already exists');
      }

      this.logger.error('Registration failed', error instanceof Error ? error.stack : error);

      if (isPrismaCode(error, 'P1001') || isPrismaCode(error, 'P1017') || isPrismaCode(error, 'P1000')) {
        throw new InternalServerErrorException(
          'Database is unavailable. Check DATABASE_URL and that Postgres is running.',
        );
      }
      if (isPrismaCode(error, 'P2021') || isPrismaCode(error, 'P2010')) {
        throw new InternalServerErrorException(
          'Database schema is missing. Run `npm run prisma:migrate` in the backend.',
        );
      }

      throw new InternalServerErrorException('Could not create the account. Please try again.');
    }
  }

  /** Verifies email + password; used by the NextAuth `CredentialsProvider`. */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.users.findByEmail(dto.email);
    const passwordMatches = await bcrypt.compare(dto.password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !user.passwordHash || !passwordMatches) {
      // Deliberately vague: never reveal whether the email exists.
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  /**
   * Exchanges a Google `id_token` for tokens issued by this API. A credentials
   * account with the same email is *not* auto-linked (see `linkGoogle`).
   */
  async loginWithGoogle(dto: GoogleOAuthDto): Promise<AuthResponse> {
    const profile = await this.googleProfileFromIdToken(dto.idToken);
    const user = await this.resolveGoogleSignIn(profile);
    return this.buildAuthResponse(user);
  }

  /**
   * Same Google checks as sign-in, but does not mint tokens. NextAuth's `signIn`
   * callback uses this so a credentials collision can redirect before a session
   * is created.
   */
  async assertGoogleSignInAllowed(dto: GoogleOAuthDto): Promise<void> {
    const profile = await this.googleProfileFromIdToken(dto.idToken);
    await this.resolveGoogleSignIn(profile);
  }

  /**
   * Attaches Google to the currently authenticated user after they have already
   * proved ownership (password session). Email on the id_token must match.
   */
  async linkGoogle(userId: string, dto: GoogleOAuthDto): Promise<PublicUser> {
    const profile = await this.googleProfileFromIdToken(dto.idToken);
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User no longer exists');
    }

    if (normalizeCompare(user.email) !== normalizeCompare(profile.email)) {
      throw new BadRequestException('Google email does not match this account');
    }

    const taken = await this.users.findByGoogleId(profile.googleId);
    if (taken && taken.id !== user.id) {
      throw new ConflictException('This Google account is already linked to another user');
    }

    if (user.googleId && user.googleId !== profile.googleId) {
      throw new ConflictException('This account is already linked to a different Google identity');
    }

    const linked = await this.users.linkGoogleIdentity(user.id, profile);
    return UsersService.toPublicUser(linked);
  }

  async completeProfile(userId: string, dto: CompleteProfileDto): Promise<PublicUser> {
    const user = await this.users.completeProfile(userId, {
      role: dto.role,
      shopName: dto.shopName,
    });
    return UsersService.toPublicUser(user);
  }

  async saveShopLogo(userId: string, file?: Express.Multer.File): Promise<PublicUser> {
    if (!file) {
      throw new BadRequestException('Upload a JPG, PNG, WEBP or GIF image (max 2 MB)');
    }

    const user = await this.users.setShopLogo(userId, publicLogoUrl(file.filename));
    return UsersService.toPublicUser(user);
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User no longer exists');
    }
    return UsersService.toPublicUser(user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenHash = hashRefreshToken(refreshToken);
    const row = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { shop: true } } },
    });

    if (!row) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (row.revokedAt) {
      const rotatedRecently =
        Boolean(row.replacedById) && Date.now() - row.revokedAt.getTime() < REFRESH_REUSE_GRACE_MS;
      if (rotatedRecently && row.replacedById) {
        const replacement = await this.prisma.refreshToken.findUnique({
          where: { id: row.replacedById },
        });
        // Only concurrent rotation is forgiven, and only while the successor is
        // still live. Logout (and theft after logout) revokes the successor, so
        // the previous token must not mint another pair during the grace window.
        if (
          replacement &&
          !replacement.revokedAt &&
          replacement.expiresAt.getTime() > Date.now()
        ) {
          return this.buildAuthResponse(row.user);
        }
      }
      await this.revokeAllRefreshTokens(row.userId);
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (row.expiresAt.getTime() <= Date.now()) {
      await this.prisma.refreshToken.update({
        where: { id: row.id },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Refresh token has expired');
    }

    return this.buildAuthResponse(row.user, row);
  }

  async logout(refreshToken?: string, userId?: string): Promise<void> {
    if (refreshToken) {
      const tokenHash = hashRefreshToken(refreshToken);
      const row = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
      if (row) {
        // Drop every live token for this user so rotation siblings (and other
        // devices) cannot keep the session alive after sign-out.
        await this.revokeAllRefreshTokens(row.userId);
      }
      return;
    }

    if (userId) {
      await this.revokeAllRefreshTokens(userId);
    }
  }

  private async resolveGoogleSignIn(profile: GoogleProfile): Promise<UserWithShop> {
    const byGoogle = await this.users.findByGoogleId(profile.googleId);
    if (byGoogle) {
      return byGoogle;
    }

    const byEmail = await this.users.findByEmail(profile.email);
    if (!byEmail) {
      return this.users.createGoogleUser(profile);
    }

    if (byEmail.googleId && byEmail.googleId !== profile.googleId) {
      throw new ConflictException('This email is already linked to a different Google identity');
    }

    if (byEmail.passwordHash && !byEmail.googleId) {
      throw new CredentialsAccountExistsException();
    }

    // Google-only row that somehow lost its googleId — safe to reattach.
    return this.users.linkGoogleIdentity(byEmail.id, profile);
  }

  private async googleProfileFromIdToken(idToken: string): Promise<GoogleProfile> {
    const payload = await this.verifyGoogleIdToken(idToken);

    if (!payload.email) {
      throw new UnauthorizedException('Google account did not expose an email address');
    }
    if (payload.email_verified === false) {
      throw new UnauthorizedException('Google email address is not verified');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.picture,
    };
  }

  private async verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    const audience = (this.config.get<string>('GOOGLE_CLIENT_ID') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (audience.length === 0) {
      this.logger.error('GOOGLE_CLIENT_ID is not configured; refusing Google sign-in');
      throw new InternalServerErrorException('Google sign-in is not configured on the server');
    }

    try {
      // Checks the signature against Google's public keys plus `aud`, `iss` and `exp`.
      const ticket = await this.googleClient.verifyIdToken({ idToken, audience });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Empty id_token payload');
      }
      return payload;
    } catch (error) {
      this.logger.warn(`Rejected Google id_token: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid Google credentials');
    }
  }

  private async buildAuthResponse(user: UserWithShop, rotateFrom?: RefreshTokenRow): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessTtl = this.config.get<string>('JWT_EXPIRES_IN', DEFAULT_ACCESS_TTL);
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: accessTtl as JwtSignOptions['expiresIn'],
    });
    const decoded = this.jwt.decode<JwtPayload | null>(accessToken);
    const issued = await this.issueRefreshToken(user.id);

    if (rotateFrom && !rotateFrom.revokedAt) {
      await this.prisma.refreshToken.update({
        where: { id: rotateFrom.id },
        data: { revokedAt: new Date(), replacedById: issued.id },
      });
    }

    return {
      user: UsersService.toPublicUser(user),
      accessToken,
      accessTokenExpires: (decoded?.exp ?? 0) * 1000,
      refreshToken: issued.plain,
    };
  }

  private async issueRefreshToken(userId: string): Promise<{ id: string; plain: string }> {
    const plain = randomBytes(32).toString('base64url');
    const ttl = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', DEFAULT_REFRESH_TTL);
    const row = await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashRefreshToken(plain),
        expiresAt: new Date(Date.now() + durationToMs(ttl, 30 * 24 * 60 * 60 * 1000)),
      },
      select: { id: true },
    });
    return { id: row.id, plain };
  }

  private async revokeAllRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function durationToMs(value: string, fallback: number): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/i.exec(value.trim());
  if (!match) return fallback;
  const amount = Number(match[1]);
  switch (match[2].toLowerCase()) {
    case 'ms':
      return amount;
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60_000;
    case 'h':
      return amount * 3_600_000;
    case 'd':
      return amount * 86_400_000;
    default:
      return fallback;
  }
}

function normalizeCompare(email: string): string {
  return email.trim().toLowerCase();
}

function isPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === code
  );
}

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { UsersService, type PublicUser } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import type { AuthResponse, JwtPayload } from './types/auth.types';
import type { UserModel as User } from '../generated/prisma/models';

const BCRYPT_ROUNDS = 12;

/**
 * Compared against when the email is unknown or has no password, so that a wrong
 * email and a wrong password take a similar amount of time to answer.
 */
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.CtM3n4qMs2/eiVQ0hcpiVMoTiCUAP2u';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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
   * Exchanges a Google `id_token` for an access token issued by this API,
   * creating or linking the account on the way.
   */
  async loginWithGoogle(dto: GoogleOAuthDto): Promise<AuthResponse> {
    const payload = await this.verifyGoogleIdToken(dto.idToken);

    if (!payload.email) {
      throw new UnauthorizedException('Google account did not expose an email address');
    }
    if (payload.email_verified === false) {
      throw new UnauthorizedException('Google email address is not verified');
    }

    const user = await this.users.upsertGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.picture,
    });

    return this.buildAuthResponse(user);
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('User no longer exists');
    }
    return UsersService.toPublicUser(user);
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

  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);
    const decoded = this.jwt.decode<JwtPayload | null>(accessToken);

    return {
      user: UsersService.toPublicUser(user),
      accessToken,
      accessTokenExpires: (decoded?.exp ?? 0) * 1000,
    };
  }
}

function isPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === code
  );
}


import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { logoUploadOptions } from './logo-upload';
import { LogoutDto, RefreshTokenDto } from './dto/refresh-token.dto';
import type { PublicUser } from '../users/users.service';
import type { AuthResponse } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // per email address, see AuthThrottlerGuard
  register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.auth.register(dto);
  }

  /** Called server-side by the NextAuth `CredentialsProvider`. */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // brute-force protection, per email address
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.auth.login(dto);
  }

  /** Called server-side by NextAuth after a successful Google sign-in. */
  @Post('oauth/google')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  google(@Body() dto: GoogleOAuthDto): Promise<AuthResponse> {
    return this.auth.loginWithGoogle(dto);
  }

  /**
   * Same Google checks as `/oauth/google` without minting tokens, so NextAuth can
   * redirect a credentials collision before it creates a session.
   */
  @Post('oauth/google/preflight')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async assertGoogleSignIn(@Body() dto: GoogleOAuthDto): Promise<{ ok: true }> {
    await this.auth.assertGoogleSignInAllowed(dto);
    return { ok: true };
  }

  /** Logged-in password users prove ownership, then attach Google. */
  @Post('link-google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  linkGoogle(@CurrentUser() user: PublicUser, @Body() dto: GoogleOAuthDto): Promise<PublicUser> {
    return this.auth.linkGoogle(user.id, dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponse> {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async logout(@Body() dto?: LogoutDto): Promise<{ ok: true }> {
    await this.auth.logout(dto?.refreshToken);
    return { ok: true };
  }

  /** First-time Google users pick buyer/seller (and a shop name) here. */
  @Post('complete-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  completeProfile(
    @CurrentUser() user: PublicUser,
    @Body() dto: CompleteProfileDto,
  ): Promise<PublicUser> {
    return this.auth.completeProfile(user.id, dto);
  }

  @Post('shop/logo')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', logoUploadOptions))
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  uploadLogo(
    @CurrentUser() user: PublicUser,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PublicUser> {
    return this.auth.saveShopLogo(user.id, file);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: PublicUser): Promise<PublicUser> {
    return this.auth.me(user.id);
  }
}

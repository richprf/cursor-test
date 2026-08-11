import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthProvider } from '../generated/prisma/enums';
import type { UserModel as User } from '../generated/prisma/models';

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'image' | 'role' | 'provider'>;

export interface GoogleProfile {
  googleId: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  createWithPassword(input: {
    email: string;
    passwordHash: string;
    name?: string | null;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: normalizeEmail(input.email),
        passwordHash: input.passwordHash,
        name: input.name ?? null,
        provider: AuthProvider.CREDENTIALS,
      },
    });
  }

  /**
   * Creates the account on first Google sign-in, and otherwise links the Google
   * identity to the existing account with that email. `provider` is left alone so
   * a user who registered with a password keeps being able to use it.
   */
  upsertGoogleUser(profile: GoogleProfile): Promise<User> {
    const email = normalizeEmail(profile.email);

    return this.prisma.user.upsert({
      where: { email },
      update: {
        googleId: profile.googleId,
        // Only fill in details Google knows and we are missing.
        name: profile.name ?? undefined,
        image: profile.image ?? undefined,
      },
      create: {
        email,
        googleId: profile.googleId,
        name: profile.name ?? null,
        image: profile.image ?? null,
        provider: AuthProvider.GOOGLE,
      },
    });
  }

  static toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      provider: user.provider,
    };
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

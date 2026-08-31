import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthProvider, Role } from '../generated/prisma/enums';
import type { ShopModel as Shop, UserModel as User } from '../generated/prisma/models';
import type { AccountRole } from '../auth/account-role';

export type UserWithShop = User & { shop: Shop | null };

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'image' | 'role' | 'provider' | 'onboardingComplete'> & {
  shopName: string | null;
  logoUrl: string | null;
};

export interface GoogleProfile {
  googleId: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

const withShop = { shop: true } as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<UserWithShop | null> {
    return this.prisma.user.findUnique({ where: { email: normalizeEmail(email) }, include: withShop });
  }

  findById(id: string): Promise<UserWithShop | null> {
    return this.prisma.user.findUnique({ where: { id }, include: withShop });
  }

  createWithPassword(input: {
    email: string;
    passwordHash: string;
    name?: string | null;
    role: AccountRole;
    shopName?: string | null;
  }): Promise<UserWithShop> {
    const role = input.role === 'SELLER' ? Role.SELLER : Role.BUYER;

    return this.prisma.user.create({
      data: {
        email: normalizeEmail(input.email),
        passwordHash: input.passwordHash,
        name: input.name ?? null,
        provider: AuthProvider.CREDENTIALS,
        role,
        onboardingComplete: true,
        ...(role === Role.SELLER && input.shopName
          ? { shop: { create: { name: input.shopName.trim() } } }
          : {}),
      },
      include: withShop,
    });
  }

  /**
   * Creates the account on first Google sign-in, and otherwise links the Google
   * identity to the existing account with that email. `provider` is left alone so
   * a user who registered with a password keeps being able to use it.
   *
   * Brand-new Google users still need to pick buyer/seller (and a shop name),
   * because Google does not provide that.
   */
  upsertGoogleUser(profile: GoogleProfile): Promise<UserWithShop> {
    const email = normalizeEmail(profile.email);

    return this.prisma.user.upsert({
      where: { email },
      update: {
        googleId: profile.googleId,
        // Refresh the profile details Google returned, keep ours when it sent none.
        name: profile.name ?? undefined,
        image: profile.image ?? undefined,
      },
      create: {
        email,
        googleId: profile.googleId,
        name: profile.name ?? null,
        image: profile.image ?? null,
        provider: AuthProvider.GOOGLE,
        role: Role.BUYER,
        onboardingComplete: false,
      },
      include: withShop,
    });
  }

  async completeProfile(
    userId: string,
    input: { role: AccountRole; shopName?: string | null },
  ): Promise<UserWithShop> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User no longer exists');
    }
    if (user.onboardingComplete) {
      throw new BadRequestException('Profile is already complete');
    }

    const role = input.role === 'SELLER' ? Role.SELLER : Role.BUYER;
    const shopName = input.shopName?.trim() ?? '';

    if (role === Role.SELLER && shopName.length < 2) {
      throw new BadRequestException('Shop name is required for seller accounts');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role,
        onboardingComplete: true,
        shop:
          role === Role.SELLER
            ? {
                upsert: {
                  create: { name: shopName },
                  update: { name: shopName },
                },
              }
            : user.shop
              ? { delete: true }
              : undefined,
      },
      include: withShop,
    });
  }

  async setShopLogo(userId: string, logoUrl: string): Promise<UserWithShop> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User no longer exists');
    }
    if (user.role !== Role.SELLER) {
      throw new BadRequestException('Only seller accounts can upload a shop logo');
    }
    if (!user.shop) {
      throw new BadRequestException('Create a shop before uploading a logo');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { shop: { update: { logoUrl } } },
      include: withShop,
    });
  }

  static toPublicUser(user: UserWithShop | User): PublicUser {
    const shop = 'shop' in user ? user.shop : null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      provider: user.provider,
      onboardingComplete: user.onboardingComplete,
      shopName: shop?.name ?? null,
      logoUrl: shop?.logoUrl ?? null,
    };
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

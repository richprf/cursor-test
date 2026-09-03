import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type WishlistItemDto = {
  id: string;
  productId: string;
  createdAt: Date;
};

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<{ items: WishlistItemDto[] }> {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, productId: true, createdAt: true },
    });
    return { items };
  }

  async add(userId: string, productId: string): Promise<WishlistItemDto> {
    return this.prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
      select: { id: true, productId: true, createdAt: true },
    });
  }

  async remove(userId: string, productId: string): Promise<{ productId: string }> {
    await this.prisma.wishlist.deleteMany({
      where: { userId, productId },
    });
    return { productId };
  }
}

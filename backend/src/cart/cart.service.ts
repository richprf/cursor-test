import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type CartItemDto = {
  id: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

const ITEM_SELECT = {
  id: true,
  productId: true,
  quantity: true,
  createdAt: true,
  updatedAt: true,
} as const;

const MAX_QUANTITY = 99;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<{ items: CartItemDto[]; totalItems: number }> {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: ITEM_SELECT,
    });
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, totalItems };
  }

  async add(userId: string, productId: string, quantity = 1): Promise<CartItemDto> {
    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: Math.min(MAX_QUANTITY, existing.quantity + quantity) },
        select: ITEM_SELECT,
      });
    }

    return this.prisma.cartItem.create({
      data: { userId, productId, quantity: Math.min(MAX_QUANTITY, quantity) },
      select: ITEM_SELECT,
    });
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<CartItemDto> {
    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!existing) {
      throw new NotFoundException('Product is not in the cart');
    }

    return this.prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity },
      select: ITEM_SELECT,
    });
  }

  async remove(userId: string, productId: string): Promise<{ productId: string }> {
    await this.prisma.cartItem.deleteMany({
      where: { userId, productId },
    });
    return { productId };
  }
}

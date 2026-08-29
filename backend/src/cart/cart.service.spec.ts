import { NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import type { PrismaService } from '../prisma/prisma.service';

const now = new Date();
const item = {
  id: 'c1',
  productId: 'rings-0',
  quantity: 2,
  createdAt: now,
  updatedAt: now,
};

describe('CartService', () => {
  let prisma: {
    cartItem: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      deleteMany: jest.Mock;
    };
  };
  let service: CartService;

  beforeEach(() => {
    prisma = {
      cartItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    service = new CartService(prisma as unknown as PrismaService);
  });

  it('lists items and sums quantities for the current user', async () => {
    prisma.cartItem.findMany.mockResolvedValue([item, { ...item, id: 'c2', quantity: 1 }]);

    await expect(service.list('user-1')).resolves.toEqual({
      items: [item, { ...item, id: 'c2', quantity: 1 }],
      totalItems: 3,
    });
    expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        productId: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('creates a row on first add and increments quantity later', async () => {
    prisma.cartItem.findUnique.mockResolvedValueOnce(null);
    prisma.cartItem.create.mockResolvedValue({ ...item, quantity: 1 });

    await expect(service.add('user-1', 'rings-0', 1)).resolves.toEqual({ ...item, quantity: 1 });
    expect(prisma.cartItem.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', productId: 'rings-0', quantity: 1 },
      select: {
        id: true,
        productId: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    prisma.cartItem.findUnique.mockResolvedValueOnce(item);
    prisma.cartItem.update.mockResolvedValue({ ...item, quantity: 3 });

    await expect(service.add('user-1', 'rings-0', 1)).resolves.toEqual({ ...item, quantity: 3 });
    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { quantity: 3 },
      select: {
        id: true,
        productId: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('caps quantity at 99', async () => {
    prisma.cartItem.findUnique.mockResolvedValue({ ...item, quantity: 98 });
    prisma.cartItem.update.mockResolvedValue({ ...item, quantity: 99 });

    await service.add('user-1', 'rings-0', 5);
    expect(prisma.cartItem.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { quantity: 99 } }),
    );
  });

  it('sets quantity with PATCH and 404s when the product is missing', async () => {
    prisma.cartItem.findUnique.mockResolvedValueOnce(item);
    prisma.cartItem.update.mockResolvedValue({ ...item, quantity: 4 });

    await expect(service.updateQuantity('user-1', 'rings-0', 4)).resolves.toEqual({
      ...item,
      quantity: 4,
    });

    prisma.cartItem.findUnique.mockResolvedValueOnce(null);
    await expect(service.updateQuantity('user-1', 'missing', 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deletes scoped to the current user', async () => {
    prisma.cartItem.deleteMany.mockResolvedValue({ count: 1 });
    await expect(service.remove('user-1', 'rings-0')).resolves.toEqual({ productId: 'rings-0' });
    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', productId: 'rings-0' },
    });
  });
});

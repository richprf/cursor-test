import { WishlistService } from './wishlist.service';
import type { PrismaService } from '../prisma/prisma.service';

describe('WishlistService', () => {
  let prisma: {
    wishlist: {
      findMany: jest.Mock;
      upsert: jest.Mock;
      deleteMany: jest.Mock;
    };
  };
  let service: WishlistService;

  beforeEach(() => {
    prisma = {
      wishlist: {
        findMany: jest.fn(),
        upsert: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    service = new WishlistService(prisma as unknown as PrismaService);
  });

  it('lists only the current user items, newest first', async () => {
    const items = [{ id: 'w1', productId: 'rings-0', createdAt: new Date() }];
    prisma.wishlist.findMany.mockResolvedValue(items);

    await expect(service.list('user-1')).resolves.toEqual({ items });
    expect(prisma.wishlist.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, productId: true, createdAt: true },
    });
  });

  it('upserts so adding twice is idempotent', async () => {
    const row = { id: 'w1', productId: 'rings-0', createdAt: new Date() };
    prisma.wishlist.upsert.mockResolvedValue(row);

    await expect(service.add('user-1', 'rings-0')).resolves.toEqual(row);
    expect(prisma.wishlist.upsert).toHaveBeenCalledWith({
      where: { userId_productId: { userId: 'user-1', productId: 'rings-0' } },
      create: { userId: 'user-1', productId: 'rings-0' },
      update: {},
      select: { id: true, productId: true, createdAt: true },
    });
  });

  it('deletes by user and product so one buyer cannot touch another', async () => {
    prisma.wishlist.deleteMany.mockResolvedValue({ count: 1 });

    await expect(service.remove('user-1', 'rings-0')).resolves.toEqual({ productId: 'rings-0' });
    expect(prisma.wishlist.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', productId: 'rings-0' },
    });
  });
});

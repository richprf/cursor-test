import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { PrismaService } from '../prisma/prisma.service';

const now = new Date();
const seller = {
  id: 'seller-1',
  name: 'رضا',
  shop: { name: 'طلای پژواک' },
};
const row = {
  id: 'prod-1',
  sellerId: 'seller-1',
  name: 'سکه بهار آزادی',
  imageUrl: '/uploads/products/coin.jpg',
  weightGrams: 8.13,
  karat: 24,
  price: 42_000_000,
  description: 'سکه تمام',
  quantity: 3,
  createdAt: now,
  updatedAt: now,
  seller,
};
const publicRow = {
  id: row.id,
  sellerId: row.sellerId,
  name: row.name,
  imageUrl: row.imageUrl,
  weightGrams: row.weightGrams,
  karat: row.karat,
  price: row.price,
  description: row.description,
  quantity: row.quantity,
  shopName: 'طلای پژواک',
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
};

describe('ProductsService', () => {
  let prisma: {
    product: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let service: ProductsService;

  beforeEach(() => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new ProductsService(prisma as unknown as PrismaService);
  });

  it('lists every seller product for the public shop, newest first', async () => {
    prisma.product.findMany.mockResolvedValue([row]);

    await expect(service.listPublic()).resolves.toEqual({ items: [publicRow] });
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            shop: { select: { name: true } },
          },
        },
      },
    });
  });

  it('lists only the current seller catalog', async () => {
    prisma.product.findMany.mockResolvedValue([row]);

    await expect(service.listMine('seller-1')).resolves.toEqual({ items: [publicRow] });
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { sellerId: 'seller-1' } }),
    );
  });

  it('creates a product owned by the seller and stores the uploaded image url', async () => {
    prisma.product.create.mockResolvedValue(row);

    await expect(
      service.create(
        'seller-1',
        {
          name: 'سکه بهار آزادی',
          weightGrams: 8.13,
          karat: 24,
          price: 42_000_000,
          description: 'سکه تمام',
          quantity: 3,
        },
        { filename: 'coin.jpg' } as Express.Multer.File,
      ),
    ).resolves.toEqual(publicRow);

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        sellerId: 'seller-1',
        name: 'سکه بهار آزادی',
        imageUrl: '/uploads/products/coin.jpg',
        weightGrams: 8.13,
        karat: 24,
        price: 42_000_000,
        description: 'سکه تمام',
        quantity: 3,
      },
      include: expect.any(Object),
    });
  });

  it('falls back to the seller name when the shop is missing', async () => {
    prisma.product.findMany.mockResolvedValue([
      { ...row, seller: { id: 'seller-1', name: 'رضا', shop: null } },
    ]);

    await expect(service.listPublic()).resolves.toEqual({
      items: [{ ...publicRow, shopName: 'رضا' }],
    });
  });

  it('lets the owner patch a product and 403s anyone else', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'prod-1', sellerId: 'seller-1' });
    prisma.product.update.mockResolvedValue({ ...row, name: 'دستبند طلا' });

    await expect(
      service.update('seller-1', 'prod-1', { name: 'دستبند طلا' }),
    ).resolves.toMatchObject({ name: 'دستبند طلا', shopName: 'طلای پژواک' });

    prisma.product.findUnique.mockResolvedValue({ id: 'prod-1', sellerId: 'seller-1' });
    await expect(service.update('other-seller', 'prod-1', { name: 'x' })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prisma.product.update).toHaveBeenCalledTimes(1);
  });

  it('404s when the product does not exist', async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    await expect(service.remove('seller-1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes only after confirming ownership', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'prod-1', sellerId: 'seller-1' });
    prisma.product.delete.mockResolvedValue(row);

    await expect(service.remove('seller-1', 'prod-1')).resolves.toEqual({ id: 'prod-1' });
    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 'prod-1' } });
  });
});

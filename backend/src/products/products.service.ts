import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { publicProductImageUrl } from './product-upload';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

const productInclude = {
  seller: {
    select: {
      id: true,
      name: true,
      shop: { select: { name: true } },
    },
  },
} as const;

type ProductWithSeller = {
  id: string;
  sellerId: string;
  name: string;
  imageUrl: string | null;
  weightGrams: number;
  karat: number;
  price: number;
  description: string | null;
  quantity: number | null;
  createdAt: Date;
  updatedAt: Date;
  seller: {
    id: string;
    name: string | null;
    shop: { name: string } | null;
  };
};

export type PublicProduct = {
  id: string;
  sellerId: string;
  name: string;
  imageUrl: string | null;
  weightGrams: number;
  karat: number;
  price: number;
  description: string | null;
  quantity: number | null;
  shopName: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(): Promise<{ items: PublicProduct[] }> {
    const rows = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: productInclude,
    });
    return { items: rows.map(toPublicProduct) };
  }

  async listMine(sellerId: string): Promise<{ items: PublicProduct[] }> {
    const rows = await this.prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      include: productInclude,
    });
    return { items: rows.map(toPublicProduct) };
  }

  async create(
    sellerId: string,
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<PublicProduct> {
    const row = await this.prisma.product.create({
      data: {
        sellerId,
        name: dto.name.trim(),
        imageUrl: file ? publicProductImageUrl(file.filename) : null,
        weightGrams: dto.weightGrams,
        karat: dto.karat,
        price: dto.price,
        description: dto.description?.trim() || null,
        quantity: dto.quantity ?? null,
      },
      include: productInclude,
    });
    return toPublicProduct(row);
  }

  async update(
    sellerId: string,
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<PublicProduct> {
    await this.requireOwnedProduct(sellerId, id);

    const row = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.weightGrams !== undefined ? { weightGrams: dto.weightGrams } : {}),
        ...(dto.karat !== undefined ? { karat: dto.karat } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
        ...(dto.quantity !== undefined ? { quantity: dto.quantity } : {}),
        ...(file ? { imageUrl: publicProductImageUrl(file.filename) } : {}),
      },
      include: productInclude,
    });
    return toPublicProduct(row);
  }

  async remove(sellerId: string, id: string): Promise<{ id: string }> {
    await this.requireOwnedProduct(sellerId, id);
    await this.prisma.product.delete({ where: { id } });
    return { id };
  }

  private async requireOwnedProduct(sellerId: string, id: string): Promise<void> {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }
    if (existing.sellerId !== sellerId) {
      throw new ForbiddenException('You can only change your own products');
    }
  }
}

function toPublicProduct(row: ProductWithSeller): PublicProduct {
  return {
    id: row.id,
    sellerId: row.sellerId,
    name: row.name,
    imageUrl: row.imageUrl,
    weightGrams: row.weightGrams,
    karat: row.karat,
    price: row.price,
    description: row.description,
    quantity: row.quantity,
    shopName: row.seller.shop?.name ?? row.seller.name ?? 'فروشنده',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

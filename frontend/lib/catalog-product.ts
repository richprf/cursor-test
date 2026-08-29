import { ALL_PRODUCTS, getCollectionProduct } from '@/lib/wwake-collections';
import { CATALOG } from '@/lib/wwake-data';
import { FEATURED_PRODUCT_SLUG, getProduct, productHref } from '@/lib/wwake-product';

export type CatalogSnapshot = {
  id: string;
  title: string;
  href: string;
  image: string;
  price: string;
  priceValue: number;
};

export function parseMoney(price: string): number {
  const value = Number(price.replace(/[^\d.]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

/** Homepage catalog id `rings-2` is the same piece as the featured collection handle. */
export function canonicalProductId(productId: string): string {
  if (productId === 'rings-2') return FEATURED_PRODUCT_SLUG;
  return productId;
}

export function getCatalogSnapshot(productId: string): CatalogSnapshot | null {
  const id = canonicalProductId(productId);
  const collection = getCollectionProduct(id);
  if (collection) {
    return {
      id: collection.handle,
      title: collection.title,
      href: productHref(collection.handle),
      image: collection.images[0] ?? '',
      price: collection.price,
      priceValue: collection.priceValue,
    };
  }

  const catalog = CATALOG.find((item) => item.id === productId || item.id === id);
  if (catalog) {
    return {
      id: catalog.id,
      title: catalog.title,
      href: productHref(catalog.id),
      image: catalog.image,
      price: catalog.price,
      priceValue: parseMoney(catalog.price),
    };
  }

  const product = getProduct(id);
  if (!product) return null;
  return {
    id: product.slug,
    title: product.title,
    href: productHref(product.slug),
    image: product.gallery[0] ?? '',
    price: product.price,
    priceValue: parseMoney(product.price),
  };
}

export function catalogIdFromTitle(title: string): string | null {
  const collection = ALL_PRODUCTS.find((item) => item.title === title);
  if (collection) return collection.handle;
  const catalog = CATALOG.find((item) => item.title === title);
  return catalog?.id ?? null;
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

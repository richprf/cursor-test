import { ALL_PRODUCTS, getCollectionProduct } from '@/lib/wwake-collections';
import { CATALOG } from '@/lib/wwake-data';
import { FEATURED_PRODUCT_SLUG, getProduct, productHref } from '@/lib/wwake-product';
import { publicAssetPath } from '@/lib/dashboard';
import { formatToman } from '@/lib/format';
import type { ProductListing } from '@/types/api';

export type CatalogCurrency = 'USD' | 'TOMAN';

export type CatalogSnapshot = {
  id: string;
  title: string;
  href: string;
  image: string;
  price: string;
  priceValue: number;
  currency: CatalogCurrency;
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

export function listingToSnapshot(listing: ProductListing): CatalogSnapshot {
  return {
    id: listing.id,
    title: listing.name,
    href: `/shop#listing-${listing.id}`,
    image: publicAssetPath(listing.imageUrl) ?? '',
    price: formatToman(listing.price),
    priceValue: listing.price,
    currency: 'TOMAN',
  };
}

export function getCatalogSnapshot(
  productId: string,
  listings: ProductListing[] = [],
): CatalogSnapshot | null {
  const listing = listings.find((item) => item.id === productId);
  if (listing) return listingToSnapshot(listing);

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
      currency: 'USD',
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
      currency: 'USD',
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
    currency: 'USD',
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

export function formatCatalogPrice(product: CatalogSnapshot, quantity = 1): string {
  const amount = product.priceValue * quantity;
  return product.currency === 'TOMAN' ? formatToman(amount) : formatUsd(amount);
}

export function formatMixedTotals(usd: number, toman: number): string {
  const parts: string[] = [];
  if (usd > 0) parts.push(formatUsd(usd));
  if (toman > 0) parts.push(formatToman(toman));
  return parts.join(' + ') || formatUsd(0);
}

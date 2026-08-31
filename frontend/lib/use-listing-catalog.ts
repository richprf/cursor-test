'use client';

import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/shop-bag-api';
import type { ProductListing } from '@/types/api';

/** Public seller listings so wishlist/cart can hydrate UUID product ids. */
export function useListingCatalog(): ProductListing[] {
  const [listings, setListings] = useState<ProductListing[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled) setListings(data.items);
      })
      .catch(() => {
        if (!cancelled) setListings([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return listings;
}

import { canonicalProductId } from '@/lib/catalog-product';
import type { RootState } from '@/store';

export const selectWishlistIds = (state: RootState) => state.wishlist.ids;
export const selectWishlistCount = (state: RootState) => state.wishlist.ids.length;
export const selectWishlistStatus = (state: RootState) => state.wishlist.status;

export const selectIsWished = (productId: string) => (state: RootState) =>
  state.wishlist.ids.includes(canonicalProductId(productId));

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartQuantity = (productId: string) => (state: RootState) =>
  state.cart.items.find((item) => item.productId === canonicalProductId(productId))?.quantity ?? 0;

export const selectShopReady = (state: RootState) =>
  state.cart.status === 'ready' && state.wishlist.status === 'ready';

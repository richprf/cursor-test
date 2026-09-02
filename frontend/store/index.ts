import {
  configureStore,
  createListenerMiddleware,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import cartReducer from '@/store/cartSlice';
import wishlistReducer from '@/store/wishlistSlice';
import type { ShopApiError } from '@/store/shop-error';

const authListener = createListenerMiddleware();

authListener.startListening({
  matcher: isRejectedWithValue,
  effect: (action) => {
    if (
      action.type === 'wishlist/toggle/rejected' ||
      action.type === 'cart/updateQuantity/rejected' ||
      action.type === 'cart/moveFromWishlist/rejected'
    ) {
      return;
    }
    const payload = action.payload as ShopApiError | undefined;
    if (payload?.status !== 401 || typeof window === 'undefined') return;
    const { pathname, search } = window.location;
    const next = pathname === '/login' ? '/dashboard/buyer' : `${pathname}${search}`;
    window.location.assign(`/login?callbackUrl=${encodeURIComponent(next)}`);
  },
});

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(authListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

'use client';

import { useEffect, type ReactNode } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { store, type AppDispatch } from '@/store';
import { fetchCartItems, setCart } from '@/store/cartSlice';
import { fetchWishlistItems, setWishlist } from '@/store/wishlistSlice';
import { hasUsableAccessToken } from '@/lib/session-status';

function ShopBagSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const signedIn = hasUsableAccessToken(session);

  useEffect(() => {
    if (status === 'loading') return;
    if (!signedIn) {
      dispatch(setWishlist([]));
      dispatch(setCart([]));
      return;
    }
    void dispatch(fetchWishlistItems());
    void dispatch(fetchCartItems());
  }, [signedIn, status, session?.accessToken, dispatch]);

  return null;
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ShopBagSync />
      {children}
    </Provider>
  );
}

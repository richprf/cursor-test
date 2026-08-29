'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { canonicalProductId } from '@/lib/catalog-product';
import {
  deleteCart,
  deleteWishlist,
  fetchCart,
  fetchWishlist,
  patchCart,
  postCart,
  postWishlist,
} from '@/lib/shop-bag-api';

type ShopBagValue = {
  ready: boolean;
  signedIn: boolean;
  wishlistIds: ReadonlySet<string>;
  cartQuantities: ReadonlyMap<string, number>;
  cartCount: number;
  wishlistCount: number;
  isWished: (productId: string) => boolean;
  cartQuantity: (productId: string) => number;
  toggleWishlist: (productId: string) => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  setCartQuantity: (productId: string, quantity: number) => Promise<void>;
  moveWishlistToCart: (productId: string) => Promise<void>;
};

const ShopBagContext = createContext<ShopBagValue | null>(null);

function withId(set: Set<string>, id: string, present: boolean) {
  const next = new Set(set);
  if (present) next.add(id);
  else next.delete(id);
  return next;
}

function withQty(map: Map<string, number>, id: string, quantity: number | null) {
  const next = new Map(map);
  if (quantity === null || quantity < 1) next.delete(id);
  else next.set(id, quantity);
  return next;
}

export function ShopBagProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [cartQuantities, setCartQuantities] = useState<Map<string, number>>(new Map());
  const [ready, setReady] = useState(false);

  const signedIn = Boolean(session?.accessToken) && session?.error !== 'AccessTokenExpired';

  const goToLogin = useCallback(() => {
    const next = pathname && pathname !== '/login' ? pathname : '/dashboard/buyer';
    router.push(`/login?callbackUrl=${encodeURIComponent(next)}`);
  }, [pathname, router]);

  const requireSignIn = useCallback(() => {
    if (signedIn) return true;
    goToLogin();
    return false;
  }, [signedIn, goToLogin]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!signedIn) {
      setWishlistIds(new Set());
      setCartQuantities(new Map());
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);
    Promise.all([fetchWishlist(), fetchCart()])
      .then(([wish, cart]) => {
        if (cancelled) return;
        setWishlistIds(new Set(wish.items.map((item) => canonicalProductId(item.productId))));
        setCartQuantities(
          new Map(cart.items.map((item) => [canonicalProductId(item.productId), item.quantity])),
        );
      })
      .catch((error: Error & { status?: number }) => {
        if (cancelled) return;
        if (error.status === 401) {
          setWishlistIds(new Set());
          setCartQuantities(new Map());
          return;
        }
        console.error('[shop-bag] sync failed', error);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [signedIn, status, session?.accessToken]);

  const isWished = useCallback(
    (productId: string) => wishlistIds.has(canonicalProductId(productId)),
    [wishlistIds],
  );

  const cartQuantity = useCallback(
    (productId: string) => cartQuantities.get(canonicalProductId(productId)) ?? 0,
    [cartQuantities],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!requireSignIn()) return;
      const id = canonicalProductId(productId);
      const was = wishlistIds.has(id);
      setWishlistIds((current) => withId(current, id, !was));
      try {
        if (was) await deleteWishlist(id);
        else await postWishlist(id);
      } catch (error) {
        setWishlistIds((current) => withId(current, id, was));
        if ((error as Error & { status?: number }).status === 401) goToLogin();
      }
    },
    [requireSignIn, wishlistIds, goToLogin],
  );

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (!requireSignIn()) return;
      const id = canonicalProductId(productId);
      const previous = cartQuantities.get(id) ?? 0;
      const nextQty = Math.min(99, previous + quantity);
      setCartQuantities((current) => withQty(current, id, nextQty));
      try {
        const item = await postCart(id, quantity);
        setCartQuantities((current) => withQty(current, id, item.quantity));
      } catch (error) {
        setCartQuantities((current) => withQty(current, id, previous || null));
        if ((error as Error & { status?: number }).status === 401) goToLogin();
      }
    },
    [requireSignIn, cartQuantities, goToLogin],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!requireSignIn()) return;
      const id = canonicalProductId(productId);
      const previous = cartQuantities.get(id) ?? 0;
      setCartQuantities((current) => withQty(current, id, null));
      try {
        await deleteCart(id);
      } catch (error) {
        setCartQuantities((current) => withQty(current, id, previous || null));
        if ((error as Error & { status?: number }).status === 401) goToLogin();
      }
    },
    [requireSignIn, cartQuantities, goToLogin],
  );

  const setCartQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!requireSignIn()) return;
      const id = canonicalProductId(productId);
      if (quantity < 1) {
        await removeFromCart(id);
        return;
      }
      const previous = cartQuantities.get(id) ?? 0;
      const nextQty = Math.min(99, quantity);
      setCartQuantities((current) => withQty(current, id, nextQty));
      try {
        const item = await patchCart(id, nextQty);
        setCartQuantities((current) => withQty(current, id, item.quantity));
      } catch (error) {
        setCartQuantities((current) => withQty(current, id, previous || null));
        if ((error as Error & { status?: number }).status === 401) goToLogin();
      }
    },
    [requireSignIn, cartQuantities, goToLogin, removeFromCart],
  );

  const moveWishlistToCart = useCallback(
    async (productId: string) => {
      if (!requireSignIn()) return;
      const id = canonicalProductId(productId);
      const previousQty = cartQuantities.get(id) ?? 0;
      const wasWished = wishlistIds.has(id);
      setCartQuantities((current) => withQty(current, id, Math.min(99, previousQty + 1)));
      setWishlistIds((current) => withId(current, id, false));
      try {
        const item = await postCart(id, 1);
        setCartQuantities((current) => withQty(current, id, item.quantity));
        if (wasWished) await deleteWishlist(id);
      } catch (error) {
        setCartQuantities((current) => withQty(current, id, previousQty || null));
        setWishlistIds((current) => withId(current, id, wasWished));
        if ((error as Error & { status?: number }).status === 401) goToLogin();
      }
    },
    [requireSignIn, cartQuantities, wishlistIds, goToLogin],
  );

  const cartCount = useMemo(
    () => [...cartQuantities.values()].reduce((sum, qty) => sum + qty, 0),
    [cartQuantities],
  );

  const value = useMemo<ShopBagValue>(
    () => ({
      ready,
      signedIn,
      wishlistIds,
      cartQuantities,
      cartCount,
      wishlistCount: wishlistIds.size,
      isWished,
      cartQuantity,
      toggleWishlist,
      addToCart,
      removeFromCart,
      setCartQuantity,
      moveWishlistToCart,
    }),
    [
      ready,
      signedIn,
      wishlistIds,
      cartQuantities,
      cartCount,
      isWished,
      cartQuantity,
      toggleWishlist,
      addToCart,
      removeFromCart,
      setCartQuantity,
      moveWishlistToCart,
    ],
  );

  return <ShopBagContext.Provider value={value}>{children}</ShopBagContext.Provider>;
}

export function useShopBag() {
  const value = useContext(ShopBagContext);
  if (!value) {
    throw new Error('useShopBag must be used inside ShopBagProvider');
  }
  return value;
}

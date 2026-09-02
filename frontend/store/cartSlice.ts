import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { canonicalProductId } from '@/lib/catalog-product';
import { deleteCart, deleteWishlist, fetchCart, patchCart, postCart } from '@/lib/shop-bag-api';
import { toShopApiError, type ShopApiError } from '@/store/shop-error';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';

export type CartLine = {
  productId: string;
  quantity: number;
};

export type CartState = {
  items: CartLine[];
  status: 'idle' | 'loading' | 'ready';
};

const initialState: CartState = {
  items: [],
  status: 'idle',
};

function lineQuantity(items: CartLine[], productId: string) {
  return items.find((item) => item.productId === canonicalProductId(productId))?.quantity ?? 0;
}

function addLine(items: CartLine[], productId: string, quantity: number) {
  const id = canonicalProductId(productId);
  const nextQty = Math.min(99, Math.max(1, quantity));
  const existing = items.find((item) => item.productId === id);
  if (existing) existing.quantity = Math.min(99, existing.quantity + nextQty);
  else items.unshift({ productId: id, quantity: nextQty });
}

function setLine(items: CartLine[], productId: string, quantity: number) {
  const id = canonicalProductId(productId);
  if (quantity < 1) {
    const index = items.findIndex((item) => item.productId === id);
    if (index >= 0) items.splice(index, 1);
    return;
  }
  const existing = items.find((item) => item.productId === id);
  const nextQty = Math.min(99, quantity);
  if (existing) existing.quantity = nextQty;
  else items.unshift({ productId: id, quantity: nextQty });
}

export const fetchCartItems = createAsyncThunk<CartLine[], void, { rejectValue: ShopApiError }>(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCart();
      return data.items.map((item) => ({
        productId: canonicalProductId(item.productId),
        quantity: item.quantity,
      }));
    } catch (error) {
      return rejectWithValue(toShopApiError(error));
    }
  },
);

export const addCartItem = createAsyncThunk<
  CartLine,
  { productId: string; quantity?: number },
  { rejectValue: ShopApiError }
>('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  const id = canonicalProductId(productId);
  try {
    const item = await postCart(id, quantity);
    return { productId: canonicalProductId(item.productId), quantity: item.quantity };
  } catch (error) {
    return rejectWithValue(toShopApiError(error));
  }
});

async function loadCartSnapshot(): Promise<CartLine[] | undefined> {
  try {
    const data = await fetchCart();
    return data.items.map((item) => ({
      productId: canonicalProductId(item.productId),
      quantity: item.quantity,
    }));
  } catch {
    return undefined;
  }
}

export const removeCartItem = createAsyncThunk<string, string, { rejectValue: ShopApiError }>(
  'cart/remove',
  async (productId, { rejectWithValue }) => {
    const id = canonicalProductId(productId);
    try {
      await deleteCart(id);
      return id;
    } catch (error) {
      return rejectWithValue({
        ...toShopApiError(error),
        cartSnapshot: await loadCartSnapshot(),
      });
    }
  },
);

export const updateCartQuantity = createAsyncThunk<
  CartLine | { productId: string; removed: true },
  { productId: string; quantity: number },
  { rejectValue: ShopApiError }
>('cart/updateQuantity', async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
  const id = canonicalProductId(productId);
  if (quantity < 1) {
    const result = await dispatch(removeCartItem(id));
    if (removeCartItem.rejected.match(result)) {
      return rejectWithValue(result.payload ?? { message: 'درخواست ناموفق بود.' });
    }
    return { productId: id, removed: true as const };
  }
  try {
    const item = await patchCart(id, Math.min(99, quantity));
    return { productId: canonicalProductId(item.productId), quantity: item.quantity };
  } catch (error) {
    return rejectWithValue({
      ...toShopApiError(error),
      cartSnapshot: await loadCartSnapshot(),
    });
  }
});

export const moveWishlistToCart = createAsyncThunk<string, string, { rejectValue: ShopApiError }>(
  'cart/moveFromWishlist',
  async (productId, { dispatch, rejectWithValue }) => {
    const id = canonicalProductId(productId);
    dispatch(removeFromWishlist(id));
    const added = await dispatch(addCartItem({ productId: id, quantity: 1 }));
    if (addCartItem.rejected.match(added)) {
      dispatch(addToWishlist(id));
      return rejectWithValue(added.payload ?? { message: 'درخواست ناموفق بود.' });
    }
    try {
      await deleteWishlist(id);
    } catch (error) {
      dispatch(addToWishlist(id));
      return rejectWithValue(toShopApiError(error));
    }
    return id;
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ productId: string; quantity?: number }>) {
      addLine(state.items, action.payload.productId, action.payload.quantity ?? 1);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const id = canonicalProductId(action.payload);
      state.items = state.items.filter((item) => item.productId !== id);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      setLine(state.items, action.payload.productId, action.payload.quantity);
    },
    setCart(state, action: PayloadAction<CartLine[]>) {
      state.items = action.payload.map((item) => ({
        productId: canonicalProductId(item.productId),
        quantity: item.quantity,
      }));
      state.status = 'ready';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'ready';
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        if (action.payload?.status === 401) state.items = [];
        state.status = 'ready';
      })
      .addCase(addCartItem.pending, (state, action) => {
        addLine(state.items, action.meta.arg.productId, action.meta.arg.quantity ?? 1);
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        setLine(state.items, action.payload.productId, action.payload.quantity);
      })
      .addCase(addCartItem.rejected, (state, action) => {
        const { productId, quantity = 1 } = action.meta.arg;
        const id = canonicalProductId(productId);
        const current = lineQuantity(state.items, id);
        setLine(state.items, id, current - quantity);
      })
      .addCase(removeCartItem.pending, (state, action) => {
        const id = canonicalProductId(action.meta.arg);
        state.items = state.items.filter((item) => item.productId !== id);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        if (action.payload?.cartSnapshot) state.items = action.payload.cartSnapshot;
        state.status = 'ready';
      })
      .addCase(updateCartQuantity.pending, (state, action) => {
        setLine(state.items, action.meta.arg.productId, action.meta.arg.quantity);
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        if ('removed' in action.payload) {
          setLine(state.items, action.payload.productId, 0);
          return;
        }
        setLine(state.items, action.payload.productId, action.payload.quantity);
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        if (action.payload?.cartSnapshot) state.items = action.payload.cartSnapshot;
        state.status = 'ready';
      })
      .addCase(moveWishlistToCart.fulfilled, (state) => {
        state.status = 'ready';
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCart } = cartSlice.actions;
export default cartSlice.reducer;

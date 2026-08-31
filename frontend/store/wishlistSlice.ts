import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { canonicalProductId } from '@/lib/catalog-product';
import { deleteWishlist, fetchWishlist, postWishlist } from '@/lib/shop-bag-api';
import { toShopApiError, type ShopApiError } from '@/store/shop-error';

export type WishlistState = {
  ids: string[];
  status: 'idle' | 'loading' | 'ready';
};

const initialState: WishlistState = {
  ids: [],
  status: 'idle',
};

function hasId(ids: string[], productId: string) {
  return ids.includes(canonicalProductId(productId));
}

export const fetchWishlistItems = createAsyncThunk<
  string[],
  void,
  { rejectValue: ShopApiError }
>('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchWishlist();
    return data.items.map((item) => canonicalProductId(item.productId));
  } catch (error) {
    return rejectWithValue(toShopApiError(error));
  }
});

export const addWishlistItem = createAsyncThunk<string, string, { rejectValue: ShopApiError }>(
  'wishlist/add',
  async (productId, { rejectWithValue }) => {
    const id = canonicalProductId(productId);
    try {
      await postWishlist(id);
      return id;
    } catch (error) {
      return rejectWithValue(toShopApiError(error));
    }
  },
);

export const removeWishlistItem = createAsyncThunk<string, string, { rejectValue: ShopApiError }>(
  'wishlist/remove',
  async (productId, { rejectWithValue }) => {
    const id = canonicalProductId(productId);
    try {
      await deleteWishlist(id);
      return id;
    } catch (error) {
      return rejectWithValue(toShopApiError(error));
    }
  },
);

export const toggleWishlistItem = createAsyncThunk<
  { id: string; wished: boolean },
  string,
  { state: { wishlist: WishlistState } }
>('wishlist/toggle', async (productId, { getState, dispatch }) => {
  const id = canonicalProductId(productId);
  const wished = hasId(getState().wishlist.ids, id);
  if (wished) await dispatch(removeWishlistItem(id));
  else await dispatch(addWishlistItem(id));
  return { id, wished: !wished };
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<string>) {
      const id = canonicalProductId(action.payload);
      if (!state.ids.includes(id)) state.ids.push(id);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      const id = canonicalProductId(action.payload);
      state.ids = state.ids.filter((item) => item !== id);
    },
    setWishlist(state, action: PayloadAction<string[]>) {
      state.ids = [...new Set(action.payload.map(canonicalProductId))];
      state.status = 'ready';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.ids = action.payload;
        state.status = 'ready';
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        if (action.payload?.status === 401) state.ids = [];
        state.status = 'ready';
      })
      .addCase(addWishlistItem.pending, (state, action) => {
        const id = canonicalProductId(action.meta.arg);
        if (!state.ids.includes(id)) state.ids.push(id);
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        const id = canonicalProductId(action.meta.arg);
        state.ids = state.ids.filter((item) => item !== id);
      })
      .addCase(removeWishlistItem.pending, (state, action) => {
        const id = canonicalProductId(action.meta.arg);
        state.ids = state.ids.filter((item) => item !== id);
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        const id = canonicalProductId(action.meta.arg);
        if (!state.ids.includes(id)) state.ids.push(id);
      });
  },
});

export const { addToWishlist, removeFromWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

'use client';

import type { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store';
import { addCartItem, removeCartItem } from '@/store/cartSlice';
import { selectCartQuantity, selectIsWished } from '@/store/selectors';
import { useRequireSignIn } from '@/store/use-require-sign-in';
import { toggleWishlistItem } from '@/store/wishlistSlice';

export function ProductBagButtons({
  productId,
  className = '',
  variant = 'overlay',
}: {
  productId: string;
  className?: string;
  variant?: 'overlay' | 'inline';
}) {
  const dispatch = useDispatch<AppDispatch>();
  const requireSignIn = useRequireSignIn();
  const wished = useSelector((state: RootState) => selectIsWished(productId)(state));
  const inCart = useSelector((state: RootState) => selectCartQuantity(productId)(state) > 0);

  const stop = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={`ww-bag-actions${variant === 'inline' ? ' is-inline' : ''} ${className}`.trim()}
      onClick={stop}
      onMouseDown={stop}
    >
      <button
        type="button"
        className={`ww-bag-btn${wished ? ' is-on' : ''}`}
        aria-pressed={wished}
        aria-label={wished ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        title={wished ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        onClick={(event) => {
          stop(event);
          if (!requireSignIn()) return;
          void dispatch(toggleWishlistItem(productId));
        }}
      >
        <Heart size={16} fill={wished ? 'currentColor' : 'none'} strokeWidth={1.6} />
      </button>
      <button
        type="button"
        className={`ww-bag-btn${inCart ? ' is-on' : ''}`}
        aria-pressed={inCart}
        aria-label={inCart ? 'در سبد خرید' : 'افزودن به سبد خرید'}
        title={inCart ? 'در سبد خرید' : 'افزودن به سبد خرید'}
        onClick={(event) => {
          stop(event);
          if (!requireSignIn()) return;
          if (inCart) void dispatch(removeCartItem(productId));
          else void dispatch(addCartItem({ productId }));
        }}
      >
        <ShoppingBag size={16} fill={inCart ? 'currentColor' : 'none'} strokeWidth={1.6} />
      </button>
    </div>
  );
}

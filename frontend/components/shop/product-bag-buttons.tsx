'use client';

import type { MouseEvent } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useShopBag } from '@/components/shop/shop-bag-provider';

export function ProductBagButtons({
  productId,
  className = '',
  variant = 'overlay',
}: {
  productId: string;
  className?: string;
  variant?: 'overlay' | 'inline';
}) {
  const bag = useShopBag();
  const wished = bag.isWished(productId);
  const inCart = bag.cartQuantity(productId) > 0;

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
          void bag.toggleWishlist(productId);
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
          if (inCart) void bag.removeFromCart(productId);
          else void bag.addToCart(productId);
        }}
      >
        <ShoppingBag size={16} fill={inCart ? 'currentColor' : 'none'} strokeWidth={1.6} />
      </button>
    </div>
  );
}

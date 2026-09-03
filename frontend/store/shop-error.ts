export type ShopApiError = {
  message: string;
  status?: number;
  cartSnapshot?: { productId: string; quantity: number }[];
};

export function toShopApiError(error: unknown): ShopApiError {
  if (error && typeof error === 'object' && 'message' in error) {
    const { message, status } = error as { message: unknown; status?: number };
    return {
      message: typeof message === 'string' ? message : 'درخواست ناموفق بود.',
      status: typeof status === 'number' ? status : undefined,
    };
  }
  return { message: 'درخواست ناموفق بود.' };
}

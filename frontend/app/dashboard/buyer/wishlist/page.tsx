import { requireDashboardSession } from '@/lib/require-dashboard';
import { BuyerWishlistPanel } from '@/components/dashboard/buyer-wishlist-panel';

export const metadata = { title: 'علاقه‌مندی‌ها' };

export default async function BuyerWishlistPage() {
  await requireDashboardSession('BUYER');
  return <BuyerWishlistPanel />;
}

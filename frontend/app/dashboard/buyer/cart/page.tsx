import { requireDashboardSession } from '@/lib/require-dashboard';
import { BuyerCartPanel } from '@/components/dashboard/buyer-cart-panel';

export const metadata = { title: 'سبد خرید' };

export default async function BuyerCartPage() {
  await requireDashboardSession('BUYER');
  return <BuyerCartPanel />;
}

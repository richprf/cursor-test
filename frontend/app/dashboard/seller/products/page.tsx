import { BackendError, listMyProducts } from '@/lib/backend';
import { requireDashboardSession } from '@/lib/require-dashboard';
import { getServerAccessTokenFromHeaders } from '@/lib/server-auth';
import { Alert } from '@/components/ui';
import { SellerProductsManager } from '@/components/dashboard/seller-products-manager';
import { Verdict } from '@/components/dashboard/kpi-card';
import type { ProductListing } from '@/types/api';

export const metadata = { title: 'محصولات مغازه' };

export default async function SellerProductsPage() {
  await requireDashboardSession('SELLER');
  const accessToken = await getServerAccessTokenFromHeaders();

  let items: ProductListing[] = [];
  let loadError: string | null = null;

  try {
    if (!accessToken) {
      throw new BackendError(401, 'Missing access token');
    }
    items = (await listMyProducts(accessToken)).items;
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) {
      loadError = 'نشست منقضی شده است. دوباره وارد شوید.';
    } else {
      loadError = 'خواندن محصولات از سرور ناموفق بود.';
    }
  }

  return (
    <>
      <div className="mb-10">
        <Verdict
          eyebrow="کاتالوگ"
          value="محصولات طلا"
          detail="قطعه جدید اضافه کنید یا موارد قبلی را ویرایش و حذف کنید. خریدارها همان کارت‌ها را در فروشگاه می‌بینند."
        />
      </div>
      {loadError ? (
        <div className="mb-8">
          <Alert>{loadError}</Alert>
        </div>
      ) : null}
      <SellerProductsManager initialItems={items} />
    </>
  );
}

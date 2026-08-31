import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { LenisRoot } from '@/components/landing/lenis-root';
import { WwakeHeader } from '@/components/landing/wwake/wwake-header';
import { WwakeFooter } from '@/components/landing/wwake/wwake-rest';
import { CollectionGrid } from '@/components/shop/collection-grid';
import { collectionHandles, getCollection } from '@/lib/wwake-collections';
import '../../wwake.css';

export function generateStaticParams() {
  return collectionHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) return { title: 'مجموعه' };
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const session = await auth();
  const accountHref = session ? '/dashboard' : '/login';
  const accountLabel = session ? 'داشبورد' : 'ورود';

  return (
    <LenisRoot>
      <div className="wwake" dir="rtl" lang="fa">
        <WwakeHeader accountHref={accountHref} accountLabel={accountLabel} />
        <main>
          <CollectionGrid collection={collection} />
        </main>
        <WwakeFooter />
      </div>
    </LenisRoot>
  );
}

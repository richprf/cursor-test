import { CATALOG, SHOP_TABS, type WwakeProduct } from '@/lib/wwake-data';

export const RING_SIZES = [
  { us: '3', inside: '44.2', diameter: '14.1' },
  { us: '3.25', inside: '44.8', diameter: '14.3' },
  { us: '3.5', inside: '45.5', diameter: '14.5' },
  { us: '3.75', inside: '46.1', diameter: '14.7' },
  { us: '4', inside: '46.8', diameter: '14.9' },
  { us: '4.25', inside: '47.4', diameter: '15.1' },
  { us: '4.5', inside: '48', diameter: '15.3' },
  { us: '4.75', inside: '48.7', diameter: '15.5' },
  { us: '5', inside: '49.3', diameter: '15.7' },
  { us: '5.25', inside: '50', diameter: '15.9' },
  { us: '5.5', inside: '50.6', diameter: '16.1' },
  { us: '5.75', inside: '51.2', diameter: '16.3' },
  { us: '6', inside: '51.9', diameter: '16.5' },
  { us: '6.25', inside: '52.5', diameter: '16.7' },
  { us: '6.5', inside: '53.1', diameter: '16.9' },
  { us: '6.75', inside: '53.8', diameter: '17.1' },
  { us: '7', inside: '54.4', diameter: '17.3' },
  { us: '7.25', inside: '55.1', diameter: '17.5' },
  { us: '7.5', inside: '55.7', diameter: '17.7' },
  { us: '7.75', inside: '56.3', diameter: '17.9' },
  { us: '8', inside: '57', diameter: '18.1' },
  { us: '8.25', inside: '57.6', diameter: '18.3' },
  { us: '8.5', inside: '58.3', diameter: '18.5' },
  { us: '8.75', inside: '58.9', diameter: '18.7' },
  { us: '9', inside: '59.5', diameter: '18.9' },
  { us: '9.25', inside: '60.2', diameter: '19.1' },
  { us: '9.5', inside: '60.8', diameter: '19.4' },
  { us: '9.75', inside: '61.4', diameter: '19.6' },
  { us: '10', inside: '62.1', diameter: '19.8' },
  { us: '10.25', inside: '62.7', diameter: '20' },
  { us: '10.5', inside: '63.4', diameter: '20.2' },
  { us: '10.75', inside: '64', diameter: '20.4' },
  { us: '11', inside: '64.6', diameter: '20.6' },
] as const;

export type ProductLink = { title: string; href: string; image: string; hover?: string; badge?: string };

export type ProductRecord = {
  slug: string;
  title: string;
  price: string;
  category: string;
  description: string;
  caption: string;
  video?: { src: string; poster: string };
  gallery: string[];
  details: string[];
  sizeFit: string;
  sourcing: string;
  delivery: string;
  madeToOrder: boolean;
  pair: ProductLink[];
  related: WwakeProduct[];
  prev: ProductLink;
  next: ProductLink;
};

export const FEATURED_PRODUCT_SLUG = 'oval-moonstone-dyad-signet-ring';

export function productHref(id: string) {
  return id === 'rings-2' ? `/products/${FEATURED_PRODUCT_SLUG}` : `/products/${id}`;
}

const FEATURED: ProductRecord = {
  slug: FEATURED_PRODUCT_SLUG,
  title: 'انگشتر سیگنت دوتایی مون‌استون بیضی',
  price: '$2,865.00',
  category: 'انگشتر',
  description:
    'دو مون‌استون با اندازهٔ متفاوت، سر به سر کنار هم، در عدم‌تقارن به تعادل می‌رسند؛ سیلوئت کشیده‌ای که درخشش آبی نرم و پخش سنگ را نشان می‌دهد.',
  caption: 'مون‌استون تانزانیا با منبع اخلاقی.',
  video: {
    src: '/landing/wwake/product/loop.mp4',
    poster: '/landing/wwake/product/loop.jpg',
  },
  gallery: [
    '/landing/wwake/product/gallery-a.jpg',
    '/landing/wwake/product/gallery-detail.jpg',
    '/landing/wwake/product/gallery-b.jpg',
    '/landing/wwake/product/gallery-portrait.jpg',
  ],
  details: [
    'طلای زرد بازیافتی جامد ۱۰ عیار',
    'مون‌استون، تراش کابوشن بیضی، ۵×۳ میلی‌متر، ۰٫۲ قیراط، تانزانیا',
    'مون‌استون، تراش کابوشن بیضی، ۱۰×۵ میلی‌متر، ۱٫۳ قیراط، تانزانیا',
    'نوار از ۱۱×۲٫۷ میلی‌متر باریک می‌شود با دهانهٔ ۱٫۵ میلی‌متر',
    'پرداخت مات',
  ],
  sizeFit:
    'سایزبندی فراگیر — سایز مدنظرتان در فهرست نیست؟ سایزهای ربع‌تایی و خارج از فهرست را بدون هزینهٔ اضافه می‌سازیم. نزدیک‌ترین سایز را انتخاب کنید و سایز دقیق را در «یادداشت سفارش» بنویسید تا تأیید و تاریخ ارسال را برایتان بفرستیم.',
  sourcing:
    'این قطعه در نیویورک با دست ساخته می‌شود؛ با مون‌استون تانزانیا با منبع اخلاقی و طلای ۱۰۰٪ بازیافتی پسامصرف.',
  delivery:
    'موجودی ظرف ۲ روز کاری ارسال می‌شود. قطعه‌های ساخت‌سفارشی ۵ تا ۶ هفته تا ارسال وقت می‌گیرند.\n\nارسال و بسته‌بندی\nبیمهٔ بسته در تسویه قابل انتخاب است. کد پیگیری ایمیل می‌شود. سفارش بالای ۵۰۰ دلار امضا هنگام تحویل می‌خواهد.\n-UPS استاندارد — ۱۱ دلار (۲ تا ۷ روز کاری)\n-UPS دو روزه — ۲۵ دلار\n-آلاسکا، هاوایی، پورتوریکو — ۲۸ دلار\n-بین‌المللی FedEx؛ هزینه و عوارض در تسویه محاسبه می‌شود\n\nمرجوعی واجد شرایط تا ۱۵ روز پس از دریافت. بازپرداخت به همان شیوهٔ پرداخت فقط تا ۷ روز پس از تحویل. اعتبار فروشگاه تا ۱۵ روز. قطعه باید در بسته‌بندی اصلی و بدون نشانهٔ استفاده باشد. اقلام تخفیف‌خورده، فروش نهایی و حکاکی‌شده قابل مرجوعی نیستند.',
  madeToOrder: true,
  pair: [
    {
      title: 'انگشتر زنجیر رولو طلا',
      href: '/products/earrings-0',
      image: '/landing/wwake/product/pair-1.jpg',
      hover: '/landing/wwake/product/pair-1h.jpg',
    },
    {
      title: 'انگشتر ستون یاقوت و الماس',
      href: '/products/rings-0',
      image: '/landing/wwake/product/pair-2.jpg',
      hover: '/landing/wwake/product/pair-2h.jpg',
    },
    {
      title: 'حلقهٔ مدرج الماس میکرونی کوچک',
      href: '/products/rings-5',
      image: '/landing/wwake/product/pair-3.jpg',
      hover: '/landing/wwake/product/pair-3h.jpg',
      badge: 'پرفروش',
    },
    {
      title: 'انگشتر صورتی یال طلا',
      href: '/products/rings-6',
      image: '/landing/wwake/product/pair-4.jpg',
      hover: '/landing/wwake/product/pair-4h.jpg',
      badge: 'حکاکی',
    },
  ],
  related: [...SHOP_TABS[0].products],
  prev: {
    title: 'انگشتر مونولیت مون‌استون بیضی',
    href: '/products/rings-1',
    image: '/landing/wwake/p-moon-mono.jpg',
  },
  next: {
    title: 'انگشتر آشیانهٔ یاقوت و الماس شمارهٔ ۲۴',
    href: '/products/rings-3',
    image: '/landing/wwake/p-nestled24.jpg',
  },
};

export const PRODUCT_ETHOS = [
  {
    title: 'منشور',
    image: '/landing/wwake/custom/hands.jpg',
    copy: 'همهٔ قطعه‌ها در نیویورک ساخته می‌شوند تا کیفیت در بالاترین حد بماند. نگاه‌مان بلندمدت است: مواد از کجا می‌آیند، چطور ساخته می‌شوند، و چه کسانی اثر می‌پذیرند. اولویت با طلای Fairmined، گوهر جوامعی که می‌شناسیم، فلز بازیافتی و الماس عتیقه است.',
    links: [
      { href: '/custom', label: 'بیشتر بخوانید' },
      { href: '/shop', label: 'همه را ببینید' },
    ],
  },
  {
    title: 'طلا',
    image: '/landing/wwake/product/ethos-gold.jpg',
    copy: 'قطعه‌ها اینجا در نیویورک با طلای Fairmined یا بازیافتی گواهی‌شده ساخته می‌شوند. این کار از جوامع مبدأ حمایت می‌کند. طلایی هست، و طلای فرهنگی: شکلی که باید نگه داشته شود، پوشیده شود، به یاد بماند. پژواک طلای فرهنگی امروز را می‌سازد.',
    links: [
      { href: '/custom', label: 'بیشتر بخوانید' },
      { href: '/shop', label: 'همه را ببینید' },
    ],
  },
  {
    title: 'متناسب با شما',
    image: '/landing/wwake/product/ethos-studio.jpg',
    copy: 'چه پروژهٔ سفارشی باشد، چه تغییر طرح، چه راهنمایی سایز و ماده و استایل، تیم همراهتان است. از ایده تا قطعهٔ نهایی، از تأمین سنگ تا توسعهٔ طرح. در کارگاه گرین‌پوینت بروکلین یا وقت مجازی با متخصص جواهر.',
    links: [
      { href: '/#visit', label: 'رزرو وقت' },
      { href: 'mailto:hello@pezhvak.test', label: 'گفت‌وگو با متخصص' },
    ],
  },
  {
    title: 'ضمانت',
    image: '/landing/wwake/custom/intention.jpg',
    copy: 'تعهد ما ساخت قطعه‌هایی با کیفیت ممتاز است؛ مهارت و طرح هنری. این قطعه مشمول ضمانت سه ساله است: یک بار تغییر سایز رایگان، پرداخت سالانه، و تعمیرهای لازم.',
    links: [
      { href: '/custom', label: 'بیشتر بخوانید' },
      { href: 'mailto:hello@pezhvak.test', label: 'گفت‌وگو با متخصص' },
    ],
  },
] as const;

export const PRODUCT_FAQ = [
  {
    q: 'سایز انگشترم را نمی‌دانم. کمک می‌کنید؟',
    a: 'راهنمای سایز کنار انتخاب سایز در همین صفحه است. برای اندازهٔ دقیق‌تر می‌توانید حلقه‌سنج بخرید. اگر در نیویورک هستید به کارگاه بروکلین بیایید تا متخصص اندازه بگیرد. سوال بیشتر را به customerservice بفرستید.',
  },
  {
    q: 'سایزم در فهرست آنلاین نیست. سایز دیگری می‌سازید؟',
    a: 'رایج‌ترین سایزها آنلاین است اما سایز کوچک‌تر، بزرگ‌تر و ربع‌تایی را هم می‌سازیم. نزدیک‌ترین سایز را انتخاب کنید و در یادداشت سبد سایز دقیق را بنویسید. اگر مطمئن نیستید راهنما را ببینید یا بنویسید.',
  },
  {
    q: 'اگر اندازه نبود، قابل تغییر سایز است؟',
    a: 'تا ۱۵ روز می‌توانید تعویض سایز بخواهید. بسته به موجودی یا قطعه عوض می‌شود یا همین قطعه تغییر سایز می‌گیرد. بعد از این بازه، خدمت تغییر سایز با هزینهٔ یارانه‌ای ممکن است. در ضمانت سه ساله اولین درخواست رایگان است. بعضی طرح‌ها تغییر سایز نمی‌پذیرند؛ در این صورت بازساخت با هزینه انجام می‌شود.',
  },
  {
    q: 'برنامهٔ امتحان در خانه دارید؟',
    a: 'بله. قطعه‌های واجد شرایط را با فیلتر امتحان در خانه در صفحات مجموعه پیدا می‌کنید. روی صفحهٔ محصول هم اگر موجود باشد گزینهٔ درخواست دیده می‌شود.',
  },
] as const;

function fromCatalog(item: (typeof CATALOG)[number], index: number): ProductRecord {
  const prev = CATALOG[(index - 1 + CATALOG.length) % CATALOG.length];
  const next = CATALOG[(index + 1) % CATALOG.length];
  const related = CATALOG.filter((entry) => entry.categoryId === item.categoryId).slice(0, 8);
  return {
    slug: item.id,
    title: item.title,
    price: item.price,
    category: item.category,
    description: item.title,
    caption: 'ساخته‌شده با مواد مسئولانه در کارگاه.',
    gallery: [item.image, item.hover],
    details: ['طلای بازیافتی', 'ساخت کارگاه', 'پرداخت دستی'],
    sizeFit: FEATURED.sizeFit,
    sourcing: FEATURED.sourcing,
    delivery: FEATURED.delivery,
    madeToOrder: true,
    pair: related.slice(0, 4).map((entry) => ({
      title: entry.title,
      href: productHref(entry.id),
      image: entry.image,
      hover: entry.hover,
      badge: 'badge' in entry ? entry.badge : undefined,
    })),
    related,
    prev: { title: prev.title, href: productHref(prev.id), image: prev.image },
    next: { title: next.title, href: productHref(next.id), image: next.image },
  };
}

export function getProduct(slug: string): ProductRecord | undefined {
  if (slug === FEATURED_PRODUCT_SLUG || slug === 'rings-2') return FEATURED;
  const index = CATALOG.findIndex((item) => item.id === slug);
  if (index < 0) return undefined;
  return fromCatalog(CATALOG[index], index);
}

export function productSlugs() {
  return [FEATURED_PRODUCT_SLUG, ...CATALOG.map((item) => item.id)];
}

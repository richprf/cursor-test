export type WwakeProduct = {
  title: string;
  price: string;
  image: string;
  hover: string;
  badge?: string;
};

export const ECHO_CATEGORIES = [
  {
    id: 'charms',
    index: '۱',
    title: 'آویز و پلاک',
    count: '۳۸',
    image: '/landing/wwake/echo-charms.jpg',
    product: '/landing/wwake/echo-charms-p.jpg',
    copy: 'فرم‌های کوچک، نزدیک به بدن. آویز و پلاک‌هایی که معنا را با خود حمل می‌کنند؛ شخصی، نمادین یا در گذر زمان. برای لایه‌لایه کردن، جمع کردن و نگه داشتن ساخته شده‌اند.',
  },
  {
    id: 'earrings',
    index: '۲',
    title: 'گوشواره',
    count: '۹۲',
    image: '/landing/wwake/echo-earrings.jpg',
    product: '/landing/wwake/echo-earrings-p.jpg',
    copy: 'گوشواره‌های طلای دست‌ساز با نیت. هر قطعه با دقت در تعادل، وزن و حرکت شکل گرفته است. جواهری که هم بدن را حرمت می‌گذارد و هم زمین را؛ صمیمی و ماندگار.',
  },
  {
    id: 'necklaces',
    index: '۳',
    title: 'گردنبند',
    count: '۶۹',
    image: '/landing/wwake/echo-necklaces.jpg',
    product: '/landing/wwake/echo-necklaces-p.jpg',
    copy: 'گردنبند روی مرکز بدن می‌نشیند و اغلب لنگر خاطره می‌شود. گردنبندهای طلا وزن آرام طلای خالص را با معنایی شخصی متعادل می‌کنند.',
  },
  {
    id: 'rings',
    index: '۴',
    title: 'انگشتر',
    count: '۱۶۳',
    image: '/landing/wwake/echo-rings.jpg',
    product: '/landing/wwake/echo-rings-p.jpg',
    copy: 'انگشترهای ما فرم، تناسب و نماد آرام چیزی را می‌کاوند که نزدیک‌ترین جای بدن است. از طلای خالص و سنگ‌های گزیده ساخته شده‌اند تا پوشیده شوند، لایه‌لایه شوند و بمانند.',
  },
] as const;

export const STACK_PINS = [
  { index: '۱', title: 'آویز حلقهٔ طلا', image: '/landing/wwake/stack-1.jpg', left: '50%', top: '57%' },
  { index: '۲', title: 'پلاک توری الماس بزرگ', image: '/landing/wwake/stack-2.jpg', left: '48%', top: '79%' },
  { index: '۳', title: 'آویز حوضهٔ آکوامارین', image: '/landing/wwake/stack-3.jpg', left: '61%', top: '55%' },
  { index: '۴', title: 'گردنبند تنیس الماس صحرا، تک‌نسخه', image: '/landing/wwake/stack-4.jpg', left: '70%', top: '35%' },
] as const;

export const SHOP_TABS = [
  {
    id: 'rings',
    index: '۱',
    title: 'انگشتر',
    count: '۱۶۳',
    products: [
      { title: 'انگشتر حوضهٔ باگت', price: '$1,695.00', image: '/landing/wwake/p-baguette-pool.jpg', hover: '/landing/wwake/p-baguette-pool-h.jpg' },
      { title: 'انگشتر مونولیت مون‌استون بیضی', price: '$2,250.00', image: '/landing/wwake/p-moon-mono.jpg', hover: '/landing/wwake/p-moon-mono-h.jpg' },
      { title: 'انگشتر سیگنت دوتایی مون‌استون بیضی', price: '$2,865.00', image: '/landing/wwake/p-dyad.jpg', hover: '/landing/wwake/p-dyad-h.jpg' },
      { title: 'انگشتر آشیانهٔ یاقوت و الماس شمارهٔ ۲۴', price: '$6,875.00', image: '/landing/wwake/p-nestled24.jpg', hover: '/landing/wwake/p-nestled24-h.jpg', badge: 'تک‌نسخه' },
      { title: 'انگشتر سیگنت الماس بیضی شمارهٔ ۷', price: '$17,405.00', image: '/landing/wwake/p-signet7.jpg', hover: '/landing/wwake/p-signet7-h.jpg', badge: 'تک‌نسخه' },
      { title: 'انگشتر ساحل الماس میکرونی', price: '$4,115.00', image: '/landing/wwake/p-coast.jpg', hover: '/landing/wwake/p-coast-h.jpg', badge: 'تک‌نسخه' },
      { title: 'انگشتر سولیتر یال الماس باگت شمارهٔ ۱۳', price: '$5,730.00', image: '/landing/wwake/p-ridge13.jpg', hover: '/landing/wwake/p-ridge13-h.jpg', badge: 'تک‌نسخه' },
      { title: 'انگشتر سیگنت الماس اشکی', price: 'از $4,890.00', image: '/landing/wwake/p-pear-signet.jpg', hover: '/landing/wwake/p-pear-signet-h.jpg', badge: 'الماس خودتان را انتخاب کنید' },
    ] satisfies WwakeProduct[],
  },
  {
    id: 'earrings',
    index: '۲',
    title: 'گوشواره',
    count: '۹۲',
    products: [
      { title: 'گوشوارهٔ آویز مون‌استون بیضی', price: 'از $515.00', image: '/landing/wwake/p-moon-drop.jpg', hover: '/landing/wwake/p-moon-drop-h.jpg' },
      { title: 'گوشوارهٔ آویز یاقوت و آکوامارین', price: 'از $655.00', image: '/landing/wwake/p-sapph-aqua.jpg', hover: '/landing/wwake/p-sapph-aqua-h.jpg' },
      { title: 'گوشوارهٔ اشکی اپال', price: 'از $425.00', image: '/landing/wwake/p-opal-tear.jpg', hover: '/landing/wwake/p-opal-tear-h.jpg' },
      { title: 'گوشوارهٔ گلبرگ مروارید', price: 'از $450.00', image: '/landing/wwake/p-petal.jpg', hover: '/landing/wwake/p-petal-h.jpg' },
      { title: 'گوشوارهٔ گره مروارید', price: 'از $385.00', image: '/landing/wwake/p-hitch.jpg', hover: '/landing/wwake/p-hitch-h.jpg' },
      { title: 'گوشوارهٔ داربست مروارید', price: 'از $400.00', image: '/landing/wwake/p-trellis.jpg', hover: '/landing/wwake/p-trellis-h.jpg' },
    ] satisfies WwakeProduct[],
  },
  {
    id: 'necklaces',
    index: '۳',
    title: 'گردنبند',
    count: '۶۹',
    products: [
      { title: 'گردنبند آویز اپال', price: '$2,625.00', image: '/landing/wwake/p-opal-drop-n.jpg', hover: '/landing/wwake/p-opal-drop-n-h.jpg' },
      { title: 'گردنبند آویز مون‌استون', price: '$2,925.00', image: '/landing/wwake/p-moon-drop-n.jpg', hover: '/landing/wwake/p-moon-drop-n-h.jpg' },
      { title: 'گردنبند مدار آویز لولایی', price: '$5,315.00', image: '/landing/wwake/p-orbit.jpg', hover: '/landing/wwake/p-orbit-h.jpg' },
      { title: 'پلاک اپال مارکیز', price: 'از $775.00', image: '/landing/wwake/p-marq-opal.jpg', hover: '/landing/wwake/p-marq-opal-h.jpg' },
      { title: 'آویز حوضهٔ آکوامارین', price: 'از $1,095.00', image: '/landing/wwake/p-aqua-pool.jpg', hover: '/landing/wwake/p-aqua-pool-h.jpg' },
      { title: 'مدال درگاه مون‌استون بیضی', price: 'از $2,250.00', image: '/landing/wwake/p-locket.jpg', hover: '/landing/wwake/p-locket-h.jpg' },
    ] satisfies WwakeProduct[],
  },
  {
    id: 'bracelets',
    index: '۴',
    title: 'دستبند',
    count: '۱۱',
    products: [
      { title: 'دستبند گلبرگ مروارید', price: 'از $475.00', image: '/landing/wwake/p-petal-b.jpg', hover: '/landing/wwake/p-petal-b-h.jpg' },
      { title: 'دستبند داربست مروارید', price: 'از $675.00', image: '/landing/wwake/p-trellis-b.jpg', hover: '/landing/wwake/p-trellis-b-h.jpg' },
      { title: 'دستبند سه‌پله الماس', price: 'از $975.00', image: '/landing/wwake/p-three-step.jpg', hover: '/landing/wwake/p-three-step-h.jpg', badge: 'پرفروش' },
      { title: 'دستبند دوپله اپال و الماس', price: 'از $565.00', image: '/landing/wwake/p-two-step.jpg', hover: '/landing/wwake/p-two-step-h.jpg' },
      { title: 'دستبند زنجیر گندمی طلا', price: 'از $1,105.00', image: '/landing/wwake/p-wheat.jpg', hover: '/landing/wwake/p-wheat-h.jpg' },
      { title: 'دستبند مروارید قفسه‌ای', price: 'از $515.00', image: '/landing/wwake/p-caged.jpg', hover: '/landing/wwake/p-caged-h.jpg' },
    ] satisfies WwakeProduct[],
  },
] as const;

export const VALUE_CATEGORIES = [
  {
    id: 'diamond',
    index: '۱',
    title: 'مجموعهٔ الماس',
    count: '۶۴',
    image: '/landing/wwake/val-diamond.jpg',
    product: '/landing/wwake/val-diamond-p.jpg',
    copy: 'الماس از کربن خالص و زیر فشار عظیم در دل زمین شکل گرفته است. مجموعهٔ الماس‌های یکتا را ببینید؛ هر کدام بازیافت‌شده و برای زیبایی طبیعی‌شان برگزیده شده‌اند.',
  },
  {
    id: 'ooak',
    index: '۲',
    title: 'تک‌نسخه‌ها',
    count: '۴۶',
    image: '/landing/wwake/val-ooak.jpg',
    product: '/landing/wwake/val-ooak-p.jpg',
    copy: 'هیچ دو قطعه‌ای یکی نیست. هر کار با سنگی یکتا آغاز می‌شود، برای شخصیتش انتخاب می‌شود و به طرحی تبدیل می‌شود که فقط یک‌بار وجود دارد.',
  },
  {
    id: 'sapphire',
    index: '۳',
    title: 'مجموعهٔ یاقوت',
    count: '۳۸',
    image: '/landing/wwake/val-sapphire.jpg',
    product: '/landing/wwake/val-sapphire-p.jpg',
    copy: 'یاقوت در رنگ‌ها و گرادیان‌های گوناگون می‌آید؛ مثل آبرنگ. رنگ مناسب خودتان را پیدا کنید.',
  },
  {
    id: 'ceremonial',
    index: '۴',
    title: 'آیینی',
    count: '۱۲۳',
    image: '/landing/wwake/val-ceremonial.jpg',
    product: '/landing/wwake/val-ceremonial-p.jpg',
    copy: 'آیین، به هر شکلش. مجموعهٔ آیینی قطعه‌هایی را کنار هم می‌گذارد برای بزنگاه‌هایی که زندگی را شکل می‌دهند: نامزدی، پیمان، و آستانه‌های آرام میان آن‌ها.',
  },
] as const;

export const JOURNAL = [
  { title: 'گوشوارهٔ فلت‌بک به‌عنوان قطعهٔ پایه', date: '۲۶ مرداد ۱۴۰۵', image: '/landing/wwake/j1.jpg' },
  { title: 'بازطراحی میراث: انگشتری که دست‌به‌دست می‌شود', date: '۷ خرداد ۱۴۰۵', image: '/landing/wwake/j2.jpg' },
  { title: 'مجموعهٔ سنگ و کانی: راهنمای گردآوری گوهر', date: '۷ خرداد ۱۴۰۵', image: '/landing/wwake/j3.jpg' },
  { title: 'از مرجع تا انگشتر: یک قطعهٔ سفارشی چگونه آغاز می‌شود', date: '۶ خرداد ۱۴۰۵', image: '/landing/wwake/j4.jpg' },
  { title: 'الماس طبیعی و عتیقه: هر سنگ چه چیزی با خود دارد', date: '۶ خرداد ۱۴۰۵', image: '/landing/wwake/j5.jpg' },
  { title: 'لایه‌لایه کردن انگشتر: یک شیوهٔ فکر کردن', date: '۶ خرداد ۱۴۰۵', image: '/landing/wwake/j6.jpg' },
] as const;

export type GoldSize = 'hero' | 'wide' | 'tall' | 'square' | 'slim' | 'feature';

const GOLD_SIZES: GoldSize[] = [
  'hero',
  'slim',
  'tall',
  'square',
  'wide',
  'feature',
  'slim',
  'tall',
  'square',
  'wide',
  'feature',
  'slim',
];

export const CATALOG = SHOP_TABS.flatMap((tab, tabIndex) =>
  tab.products.map((product, index) => ({
    ...product,
    id: `${tab.id}-${index}`,
    category: tab.title,
    categoryId: tab.id,
    size: GOLD_SIZES[(tabIndex * 5 + index * 3) % GOLD_SIZES.length],
  })),
);

export const CATALOG_FILTERS = [
  { id: 'all', label: 'همه' },
  ...SHOP_TABS.map((tab) => ({ id: tab.id, label: tab.title })),
] as const;

export const TILES = [
  { title: 'مشاهدهٔ همه', count: '۳۳۴', image: '/landing/wwake/tile-view.jpg', href: '#shop' },
  { title: 'آیینی', count: '۱۲۳', image: '/landing/wwake/tile-ceremonial.jpg', href: '#values' },
  { title: 'تک‌نسخه‌ها', count: '۴۶', image: '/landing/wwake/tile-ooak.jpg', href: '#values' },
  { title: 'انگشتر سفارشی', count: '۴۷', image: '/landing/wwake/tile-personal.jpg', href: '#values' },
  { title: 'بازدید', image: '/landing/wwake/tile-visit.jpg', href: '#visit' },
  { title: 'سفارشی', image: '/landing/wwake/tile-custom.jpg', href: '/custom' },
  { title: 'منشور', image: '/landing/wwake/tile-ethos.jpg', href: '#journal' },
  { title: 'مواد', image: '/landing/wwake/tile-materials.jpg', href: '#visit' },
] as const;

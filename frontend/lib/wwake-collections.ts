import { CATALOG } from '@/lib/wwake-data';

export type ProductType = 'rings' | 'earrings' | 'necklaces' | 'bracelets' | 'charms';
export type StoneKind = 'moonstone' | 'birthstones' | 'diamond' | 'sapphire' | 'pearl' | 'opal' | 'aquamarine' | 'mixed';
export type CutKind = 'oval-cabochon' | 'round-cabochon' | 'round' | 'multiple';
export type MaterialKind = '10k' | '14k';

export type CollectionProduct = {
  handle: string;
  title: string;
  price: string;
  priceValue: number;
  priceFrom?: boolean;
  images: string[];
  type: ProductType;
  material: MaterialKind;
  stone: StoneKind;
  cut: CutKind;
  badge?: string;
  readyToShip?: boolean;
};

export type WwakeCollection = {
  handle: string;
  title: string;
  description: string;
  products: CollectionProduct[];
};

const COL = '/landing/wwake/col';

function slides(handle: string, count = 3) {
  return Array.from({ length: count }, (_, i) => `${COL}/${handle}-${i}.jpg`);
}

function money(value: number, from = false) {
  const formatted = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return from ? `از $${formatted}` : `$${formatted}`;
}

function item(
  handle: string,
  title: string,
  value: number,
  type: ProductType,
  extras: Partial<CollectionProduct> & { count?: number } = {},
): CollectionProduct {
  const { count = 3, ...rest } = extras;
  return {
    handle,
    title,
    price: money(value, Boolean(rest.priceFrom)),
    priceValue: value,
    images: rest.images ?? slides(handle, count),
    type,
    material: rest.material ?? '14k',
    stone: rest.stone ?? 'moonstone',
    cut: rest.cut ?? 'oval-cabochon',
    ...rest,
  };
}

export const TYPE_LABELS: Record<ProductType, string> = {
  rings: 'انگشتر',
  earrings: 'گوشواره',
  necklaces: 'گردنبند',
  bracelets: 'دستبند',
  charms: 'آویز و پلاک',
};

export const MATERIAL_LABELS: Record<MaterialKind, string> = {
  '10k': 'طلای ۱۰ عیار',
  '14k': 'طلای ۱۴ عیار',
};

export const STONE_LABELS: Record<StoneKind, string> = {
  moonstone: 'مون‌استون',
  birthstones: 'سنگ تولد',
  diamond: 'الماس',
  sapphire: 'یاقوت',
  pearl: 'مروارید',
  opal: 'اپال',
  aquamarine: 'آکوامارین',
  mixed: 'ترکیبی',
};

export const CUT_LABELS: Record<CutKind, string> = {
  'oval-cabochon': 'کابوشن بیضی',
  'round-cabochon': 'کابوشن گرد',
  round: 'گرد',
  multiple: 'چندگانه',
};

export const SORT_OPTIONS = [
  { id: 'featured', label: 'منتخب' },
  { id: 'relevant', label: 'مرتبط‌ترین' },
  { id: 'best', label: 'پرفروش' },
  { id: 'title-asc', label: 'الفبا، الف تا ی' },
  { id: 'title-desc', label: 'الفبا، ی تا الف' },
  { id: 'price-asc', label: 'قیمت، کم به زیاد' },
  { id: 'price-desc', label: 'قیمت، زیاد به کم' },
  { id: 'date-asc', label: 'تاریخ، قدیم به جدید' },
  { id: 'date-desc', label: 'تاریخ، جدید به قدیم' },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]['id'];

const DOWNLOADED: CollectionProduct[] = [
  item('oval-moonstone-monolith-ring', 'انگشتر مونولیت مون‌استون بیضی', 2250, 'rings'),
  item('oval-moonstone-dyad-signet-ring', 'انگشتر سیگنت دوتایی مون‌استون بیضی', 2865, 'rings', {
    material: '10k',
  }),
  item('moonstone-drop-necklace', 'گردنبند آویز مون‌استون', 2925, 'necklaces', { cut: 'multiple' }),
  item('oval-moonstone-portal-locket', 'مدال درگاه مون‌استون بیضی', 2250, 'necklaces', { priceFrom: true }),
  item('oval-moonstone-drop-earring', 'گوشوارهٔ آویز مون‌استون بیضی', 515, 'earrings', {
    priceFrom: true,
    cut: 'round-cabochon',
    count: 2,
  }),
  item('moonstone-globe-stud-earring', 'گوشوارهٔ گلولهٔ مون‌استون', 368, 'earrings', {
    priceFrom: true,
    cut: 'round-cabochon',
  }),
  item('moonstone-tempo-earring-single', 'گوشوارهٔ تمپو مون‌استون', 580, 'earrings', {
    priceFrom: true,
    badge: 'پرفروش',
    readyToShip: true,
  }),
  item('moonstone-and-diamond-nestled-necklace', 'گردنبند آشیانهٔ مون‌استون و الماس', 595, 'necklaces', {
    priceFrom: true,
    cut: 'round',
  }),
  item('moonstone-and-diamond-linear-chain', 'زنجیر خطی مون‌استون و الماس', 1375, 'necklaces', {
    cut: 'round',
    readyToShip: true,
  }),
  item('moonstone-locket-charm', 'پلاک قفل مون‌استون', 1480, 'necklaces', { priceFrom: true }),
  item('moonstone-pillow-charm', 'پلاک بالشی مون‌استون', 1250, 'necklaces', {
    priceFrom: true,
    cut: 'round-cabochon',
    badge: 'حکاکی',
    readyToShip: true,
  }),
  item('birthstone-float-ring', 'انگشتر شناور سنگ تولد', 5180, 'rings', {
    priceFrom: true,
    stone: 'birthstones',
    cut: 'multiple',
  }),
  item('tempo-pendants', 'آویزهای تمپو سنگ تولد', 650, 'necklaces', {
    priceFrom: true,
    stone: 'birthstones',
    cut: 'multiple',
    badge: 'پرفروش',
    readyToShip: true,
  }),
  item('birthstone-float-charm', 'پلاک شناور سنگ تولد', 1515, 'necklaces', {
    priceFrom: true,
    stone: 'birthstones',
    cut: 'multiple',
    readyToShip: true,
  }),
  item('sapphire-and-aquamarine-drop-earring', 'گوشوارهٔ آویز یاقوت و آکوامارین', 655, 'earrings', {
    priceFrom: true,
    stone: 'sapphire',
    cut: 'multiple',
    count: 2,
  }),
  item('aquamarine-pool-pendant', 'آویز حوضهٔ آکوامارین', 1095, 'necklaces', {
    priceFrom: true,
    stone: 'aquamarine',
    cut: 'multiple',
  }),
  item('hinged-charm-orbit-necklace', 'گردنبند مدار آویز لولایی', 5315, 'necklaces', { stone: 'mixed', cut: 'multiple' }),
  item('baguette-pool-ring', 'انگشتر حوضهٔ باگت', 1695, 'rings', { stone: 'mixed', cut: 'multiple' }),
  item('origin-charms', 'پلاک‌های خاستگاه سنگ تولد', 240, 'necklaces', {
    priceFrom: true,
    stone: 'birthstones',
    cut: 'round',
    badge: 'پرفروش',
  }),
  item('large-birthstone-row-ring', 'انگشتر ردیف بزرگ سنگ تولد', 4785, 'rings', {
    priceFrom: true,
    stone: 'birthstones',
    cut: 'multiple',
  }),
  item('small-birthstone-row-ring', 'انگشتر ردیف کوچک سنگ تولد', 2525, 'rings', {
    priceFrom: true,
    stone: 'birthstones',
    cut: 'multiple',
  }),
];

function inferStone(title: string): StoneKind {
  if (title.includes('مون‌استون')) return 'moonstone';
  if (title.includes('الماس')) return 'diamond';
  if (title.includes('یاقوت')) return 'sapphire';
  if (title.includes('مروارید')) return 'pearl';
  if (title.includes('اپال')) return 'opal';
  if (title.includes('آکوامارین')) return 'aquamarine';
  return 'mixed';
}

function catalogProduct(entry: (typeof CATALOG)[number]): CollectionProduct {
  const priceValue = Number(entry.price.replace(/[^\d.]/g, '')) || 0;
  return {
    handle: entry.id,
    title: entry.title,
    price: entry.price,
    priceValue,
    priceFrom: entry.price.includes('از'),
    images: [entry.image, entry.hover],
    type: entry.categoryId as ProductType,
    material: '14k',
    stone: inferStone(entry.title),
    cut: 'multiple',
    badge: 'badge' in entry ? entry.badge : undefined,
  };
}

const TITLE_TO_HANDLE: Record<string, string> = Object.fromEntries(DOWNLOADED.map((product) => [product.title, product.handle]));

const CATALOG_ONLY = CATALOG.filter((entry) => !TITLE_TO_HANDLE[entry.title]).map(catalogProduct);

export const ALL_PRODUCTS: CollectionProduct[] = [...DOWNLOADED, ...CATALOG_ONLY];

const BY_HANDLE = Object.fromEntries(ALL_PRODUCTS.map((product) => [product.handle, product]));

function pick(handles: string[]) {
  return handles.map((handle) => BY_HANDLE[handle]).filter(Boolean);
}

function byType(type: ProductType) {
  return ALL_PRODUCTS.filter((product) => product.type === type);
}

export const COLLECTION_DEFS: Record<string, Omit<WwakeCollection, 'products'> & { productHandles?: string[]; type?: ProductType; match?: (product: CollectionProduct) => boolean }> = {
  moonstones: {
    handle: 'moonstones',
    title: 'مون‌استون',
    description:
      'مون‌استون به پدیدهٔ نوری آدولارسانس شناخته می‌شود؛ درخششی هیپنوتیک در سنگی که جز آن شفاف است. مجموعه‌ای را ببینید که بسیاری از فرهنگ‌ها آن را به خود ماه نسبت می‌دهند.',
    productHandles: DOWNLOADED.slice(0, 14).map((product) => product.handle),
  },
  aquamarine: {
    handle: 'aquamarine',
    title: 'آکوامارین',
    description:
      'آکوامارین نامش را از چیزی گرفته که شبیه آن است: نه عمق تاریک دریا، که آب‌های شفاف کم‌عمق جایی که نور از آن می‌گذرد. از آبی آسمان تا فیروزه‌ای‌سبز، گونه‌ای از بریل است.',
    productHandles: [
      'sapphire-and-aquamarine-drop-earring',
      'aquamarine-pool-pendant',
      'hinged-charm-orbit-necklace',
      'tempo-pendants',
      'baguette-pool-ring',
      'origin-charms',
      'birthstone-float-ring',
      'large-birthstone-row-ring',
      'birthstone-float-charm',
      'small-birthstone-row-ring',
    ],
  },
  rings: {
    handle: 'rings',
    title: 'انگشتر',
    description: 'انگشترهای ما فرم، تناسب و نماد آرام چیزی را می‌کاوند که نزدیک‌ترین جای بدن است؛ از طلای خالص و سنگ‌های گزیده.',
    type: 'rings',
  },
  earrings: {
    handle: 'earrings',
    title: 'گوشواره',
    description: 'گوشواره‌های طلای دست‌ساز با نیت. هر قطعه با دقت در تعادل، وزن و حرکت شکل گرفته است.',
    type: 'earrings',
  },
  necklaces: {
    handle: 'necklaces',
    title: 'گردنبند',
    description: 'گردنبند روی مرکز بدن می‌نشیند و اغلب لنگر خاطره می‌شود. وزن آرام طلا را با معنایی شخصی متعادل می‌کند.',
    type: 'necklaces',
  },
  bracelets: {
    handle: 'bracelets',
    title: 'دستبند',
    description: 'دستبندهایی برای لایه‌لایه کردن و پوشیدن هر روز؛ فرم‌های نرم مروارید، زنجیر و پله‌های الماس.',
    type: 'bracelets',
  },
  charms: {
    handle: 'charms',
    title: 'آویز و پلاک',
    description: 'فرم‌های کوچک، نزدیک به بدن. آویز و پلاک‌هایی که معنا را با خود حمل می‌کنند؛ شخصی، نمادین یا در گذر زمان.',
    productHandles: [
      'origin-charms',
      'oval-moonstone-portal-locket',
      'moonstone-locket-charm',
      'moonstone-pillow-charm',
      'tempo-pendants',
      'birthstone-float-charm',
    ],
  },
  diamond: {
    handle: 'diamond',
    title: 'مجموعهٔ الماس',
    description: 'الماس از کربن خالص و زیر فشار عظیم در دل زمین شکل گرفته است. مجموعه‌ای از الماس‌های گزیده و بازیافت‌شده.',
    match: (product) => product.stone === 'diamond' || product.title.includes('الماس'),
  },
  ooak: {
    handle: 'ooak',
    title: 'تک‌نسخه‌ها',
    description: 'هیچ دو قطعه‌ای یکی نیست. هر کار با سنگی یکتا آغاز می‌شود و به طرحی تبدیل می‌شود که فقط یک‌بار وجود دارد.',
    match: (product) => product.badge === 'تک‌نسخه',
  },
  sapphire: {
    handle: 'sapphire',
    title: 'مجموعهٔ یاقوت',
    description: 'یاقوت در رنگ‌ها و گرادیان‌های گوناگون می‌آید؛ مثل آبرنگ. رنگ مناسب خودتان را پیدا کنید.',
    match: (product) => product.stone === 'sapphire' || product.title.includes('یاقوت'),
  },
  ceremonial: {
    handle: 'ceremonial',
    title: 'آیینی',
    description: 'آیین، به هر شکلش. قطعه‌هایی برای بزنگاه‌هایی که زندگی را شکل می‌دهند: نامزدی، پیمان، و آستانه‌های آرام میان آن‌ها.',
    match: (product) => product.priceValue >= 2500 && (product.type === 'rings' || product.stone === 'diamond'),
  },
  'view-all': {
    handle: 'view-all',
    title: 'همه',
    description: 'هر قطعه می‌تواند تنها بایستد یا بخشی از چیزی بزرگ‌تر شود. تمام مجموعه‌ها را در یک فهرست ببینید.',
  },
};

const ALIASES: Record<string, string> = {
  aquamarines: 'aquamarine',
  moonstone: 'moonstones',
  diamonds: 'diamond',
  sapphires: 'sapphire',
  'one-of-a-kinds': 'ooak',
  'one-of-a-kind': 'ooak',
  shop: 'view-all',
};

export function resolveCollectionHandle(handle: string) {
  return ALIASES[handle] ?? handle;
}

export function collectionHref(handle: string) {
  const resolved = resolveCollectionHandle(handle);
  return resolved === 'view-all' ? '/shop' : `/collections/${resolved}`;
}

export function getCollection(handle: string): WwakeCollection | undefined {
  const resolved = resolveCollectionHandle(handle);
  const def = COLLECTION_DEFS[resolved];
  if (!def) return undefined;

  let products: CollectionProduct[];
  if (def.productHandles) products = pick(def.productHandles);
  else if (def.type) products = byType(def.type);
  else if (def.match) products = ALL_PRODUCTS.filter(def.match);
  else products = ALL_PRODUCTS;

  return { handle: def.handle, title: def.title, description: def.description, products };
}

export function collectionHandles() {
  return Object.keys(COLLECTION_DEFS);
}

export function getCollectionProduct(handle: string) {
  return BY_HANDLE[handle];
}

export function collectionProductHandles() {
  return Object.keys(BY_HANDLE);
}

export function categoryCollectionHref(category: string) {
  const match = (Object.entries(TYPE_LABELS) as [ProductType, string][]).find(([, label]) => label === category);
  return match ? collectionHref(match[0]) : '/shop';
}

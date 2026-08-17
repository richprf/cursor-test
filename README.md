# احراز هویت با NextAuth + NestJS

سیستم احراز هویت کامل با دو روش ورود:

- **گوگل** (Google OAuth) از طریق NextAuth
- **ایمیل و رمز عبور** (Credentials) با هش bcrypt در NestJS

NextAuth فقط لایهٔ **session** در فرانت‌اند است و **NestJS منبع حقیقت کاربران** و صادرکنندهٔ access token
(JWT) است. هر درخواست بعدی فرانت به بک‌اند این توکن را در هدر `Authorization: Bearer <token>` می‌فرستد.

## استک

| بخش      | فناوری                                                              |
| -------- | ------------------------------------------------------------------- |
| فرانت‌اند | Next.js 15 (App Router)، TypeScript، next-auth v5، Tailwind CSS v4، react-hook-form + zod |
| بک‌اند    | NestJS 11، TypeScript، Passport + JWT، bcrypt، class-validator، @nestjs/throttler |
| دیتابیس  | PostgreSQL 16 با Prisma 7                                            |

## ساختار پوشه‌ها

```
.
├── backend/                     # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma        # مدل User (+ enum های AuthProvider و Role)
│   │   └── migrations/
│   ├── prisma.config.ts         # تنظیمات Prisma CLI (Prisma 7)
│   └── src/
│       ├── auth/                # AuthModule: register / login / oauth-google / me
│       │   ├── dto/             # اعتبارسنجی ورودی با class-validator
│       │   ├── guards/          # JwtAuthGuard
│       │   ├── strategies/      # JwtStrategy (Passport)
│       │   └── auth.service.spec.ts
│       ├── users/               # UsersModule (دسترسی به جدول users)
│       ├── common/guards/       # AuthThrottlerGuard (rate limit بر اساس ایمیل)
│       ├── gold-price/          # فید قیمت لحظه‌ای (REST snapshot + WebSocket)
│       ├── prisma/              # PrismaService (driver adapter برای Postgres)
│       ├── config/              # اعتبارسنجی متغیرهای محیطی
│       └── main.ts              # CORS + ValidationPipe سراسری
└── frontend/                    # Next.js App Router
    ├── auth.ts                  # تنظیمات NextAuth (Google + Credentials + callbacks)
    ├── middleware.ts            # ریدایرکت کاربران لاگین‌نکرده به /login
    ├── app/
    │   ├── api/auth/[...nextauth]/route.ts
    │   ├── login/               # صفحهٔ ورود (فرم + دکمهٔ گوگل)
    │   ├── register/            # صفحهٔ ثبت‌نام (server action)
    │   └── dashboard/           # صفحهٔ محافظت‌شده (فراخوانی GET /auth/me)
    ├── components/ui.tsx        # پریمیتیوهای مشترک (input، دکمه، کارت، Alert)
    ├── components/brand.tsx     # لوگو (شمش‌های طلا) و ورد‌مارک
    ├── components/landing/      # بخش‌های صفحهٔ لندینگ (هر Section یک فایل)
    ├── lib/use-gold-price-socket.ts  # اتصال WebSocket به فید قیمت
    ├── lib/gsap.ts              # ثبت ScrollTrigger در سمت کلاینت
    ├── lib/backend.ts           # کلاینت سمت-سرور برای NestJS
    ├── lib/validation.ts        # اسکیماهای zod مشترک
    └── types/next-auth.d.ts     # افزودن accessToken و role به Session/JWT
```

## ظاهر (تم روشن / تاریک با لهجهٔ طلایی)

- توکن‌های رنگ در `frontend/app/globals.css` هستند. حالت روشن: `--background` سفید (`#FFFFFF`)،
  `--background-elevated` کرم (`#FAF9F6`)، متن `--foreground` (`#1A1A1A`). حالت تاریک روی کلاس
  `.dark`: پس‌زمینه `#0D0D0F` تا سطح `#1A1A1F`، متن سفید/خاکستری روشن. طیف طلایی
  (`#D4AF37` → `#F5C542`) در هر دو حالت رنگ تاکید است.
- سوییچ تم در هدر لندینگ و گوشهٔ صفحات ورود/ثبت‌نام/داشبورد است. انتخاب در `localStorage`
  (و cookie) ذخیره می‌شود؛ اگر کاربر دستی انتخاب نکرده باشد، `prefers-color-scheme` اعمال می‌شود.
- یک اسکریپت کوتاه در `<head>` قبل از اولین paint تم را روی `<html>` می‌گذارد تا صفحه چشمک نزند.
- کارت‌ها از `bg-surface` استفاده می‌کنند تا با سوییچ تم عوض شوند.
- سه کلاس کمکی: `.bg-gold-metallic`، `.border-gold-hairline` و `.text-gold-gradient`.
- فونت **Vazirmatn** با `next/font/google` در `app/layout.tsx` لود می‌شود (subset های `arabic` و
  `latin`) و `dir="rtl"` روی `<html>` است. فیلد ایمیل `dir="ltr"` دارد تا آدرس‌ها درست نمایش داده شوند.
- دکمهٔ گوگل از `bg-surface` و بوردر `border-border` پیروی می‌کند (هماهنگ با هر دو تم).
- نام برند («زرین‌سرمایه») و آیکون شمش طلا در `components/brand.tsx` است و با یک فایل عوض می‌شود.

## صفحهٔ لندینگ و انیمیشن‌ها

صفحهٔ `/` یک لندینگ کامل است و از ۹ بخش تشکیل شده که هر کدام در `components/landing/` یک فایل
جداگانه دارد: `hero`، `trust-bar`، `features`، `how-it-works`، `price-chart`، `testimonials`،
`faq`، `final-cta` و `site-footer` (به‌همراه `site-header` چسبان).

تقسیم کار بین دو کتابخانه:

- **Framer Motion** برای انیمیشن کامپوننت‌ها: reveal با `whileInView` (یک‌بار، هنگام ورود به دید) و
  `staggerChildren` در `reveal.tsx`، شمارش عدد در trust bar، کاروسل نظرات (`AnimatePresence`)،
  آکاردئون FAQ، پارالاکس ماوس روی ویژوال Hero و منوی موبایل.
- **GSAP + ScrollTrigger** برای کارهای اسکرول‌محور: پارالاکس اسکرول ویژوال Hero، خط پیشرفت
  timeline در «نحوهٔ کار» (`scrub` و در RTL از راست به چپ) و رسم شدن مسیر نمودار قیمت
  (`strokeDashoffset`).

اصولی که رعایت شده:

- انیمیشن ورود Hero با **CSS keyframes** است (نه JS) تا تیتر بدون انتظار برای hydration رنگ
  بگیرد؛ بقیهٔ بخش‌ها که زیر fold هستند با Framer Motion انیمیت می‌شوند.
- مدت انیمیشن‌ها ۳۰۰ تا ۶۰۰ میلی‌ثانیه با easing نرم `cubic-bezier(0.22, 0.61, 0.36, 1)`.
- فقط `transform` و `opacity` انیمیت می‌شوند؛ تنها استثنا `height` در آکاردئون FAQ است که ماهیت
  همان کامپوننت است.
- `prefers-reduced-motion`: همهٔ ScrollTrigger ها داخل `gsap.matchMedia('(prefers-reduced-motion:
  no-preference)')` ثبت می‌شوند و **حالت پایهٔ CSS همان حالت نهایی است**؛ یعنی اگر انیمیشنی اجرا
  نشود، کاربر UI کامل را می‌بیند (نمودار رسم‌شده، خط timeline کامل، اعداد نهایی). در Framer Motion
  هم با `useReducedMotion()` جابه‌جایی‌ها حذف و فقط opacity محو می‌شود، و autoplay کاروسل خاموش است.
- روی موبایل پارالاکس اسکرول Hero اجرا نمی‌شود (فقط `min-width: 1024px`) و پارالاکس ماوس تنها با
  `pointerType === 'mouse'` فعال می‌شود.
- نظرات کاربران **نمایشی** هستند. قیمت طلا واقعی است و از WebSocket می‌آید (در حالت پیش‌فرض روی
  سرور شبیه‌سازی می‌شود مگر `GOLD_PRICE_API_URL` تنظیم شود).

## قیمت لحظه‌ای طلا (WebSocket)

بک‌اند روی namespaceی `gold-price` (socket.io) هر چند ثانیه یک قیمت جدید به کلاینت‌های متصل
push می‌کند. مسیر REST `GET /gold-price/snapshot` هم همان داده را برای رندر اولیهٔ سرور می‌دهد.

- سرویس `GoldPriceService` به‌صورت پیش‌فرض یک random walk با mean-reversion شبیه‌سازی می‌کند.
  اگر `GOLD_PRICE_API_URL` روی یک endpoint با شکل `{ "price": <number> }` تنظیم شود، از آن فید
  استفاده می‌کند و در صورت خطا همان تیک را شبیه‌سازی می‌کند (استریم قطع نمی‌شود).
- Gateway مبدأ را با همان `CORS_ORIGINS` چک می‌کند؛ اتصال از دامنه‌های دیگر قطع می‌شود.
- هوک `useGoldPriceSocket` در فرانت اتصال، reconnect خودکار (socket.io) و قطع اتصال هنگام unmount
  را مدیریت می‌کند. `GoldPriceProvider` یک سوکت مشترک برای Hero و نمودار نگه می‌دارد.
- عدد قیمت با انیمیشن count (نه پرش) عوض می‌شود و برای حدود ۱٫۴ ثانیه سبز/قرمز flash می‌کند.
  خط نمودار با `d` path به‌صورت morph به‌روز می‌شود.

## جریان احراز هویت

**ورود با ایمیل/پسورد**

1. فرم `/login` تابع `signIn('credentials', …)` را صدا می‌زند.
2. در `authorize` (فایل `frontend/auth.ts`) یک `POST /auth/login` به NestJS زده می‌شود.
3. NestJS پسورد را با bcrypt چک می‌کند و `{ user, accessToken, accessTokenExpires }` برمی‌گرداند.
4. callback های `jwt` و `session` توکن و اطلاعات کاربر را در session ذخیره می‌کنند.

**ورود با گوگل**

1. دکمهٔ «ورود با گوگل» تابع `signIn('google')` را صدا می‌زند.
2. پس از بازگشت از گوگل، در callback `jwt` مقدار `account.id_token` به
   `POST /auth/oauth/google` فرستاده می‌شود.
3. NestJS با `google-auth-library` امضای `id_token` و `aud` را **در سمت سرور verify می‌کند**
   (به داده‌های فرستاده‌شده از فرانت اعتماد نمی‌شود)، کاربر را upsert می‌کند و JWT خودش را صادر می‌کند.
4. همان توکن در session ذخیره می‌شود تا فرانت با آن به بقیهٔ APIها درخواست بزند.

`session.strategy` برابر `jwt` است (نه database session) چون NestJS خودش دادهٔ کاربران را دارد.

## API بک‌اند

| متد    | مسیر                 | توضیح                                                  |
| ------ | -------------------- | ------------------------------------------------------ |
| `POST` | `/auth/register`      | ثبت‌نام با ایمیل/پسورد (هش bcrypt) — ۵ درخواست در دقیقه |
| `POST` | `/auth/login`         | بررسی ایمیل/پسورد و صدور JWT — ۵ درخواست در دقیقه       |
| `POST` | `/auth/oauth/google`  | verify کردن `idToken` گوگل، upsert کاربر، صدور JWT      |
| `GET`  | `/auth/me`            | اطلاعات کاربر جاری (محافظت‌شده با `JwtAuthGuard`)        |
| `GET`  | `/gold-price/snapshot` | آخرین قیمت + تاریخچهٔ نمودار (بدون احراز هویت)          |
| `WS`   | `/gold-price`         | namespaceی socket.io — رویدادهای `gold-price:snapshot` و `gold-price:tick` |
| `GET`  | `/health`             | health check                                            |

## راه‌اندازی

### ۱) دیتابیس

```bash
docker compose up -d          # Postgres روی localhost:5432
```

اگر Postgres خودتان را دارید، فقط `DATABASE_URL` را در `backend/.env` تنظیم کنید.

### ۲) بک‌اند (NestJS)

```bash
cd backend
cp .env.example .env          # مقدار JWT_SECRET و GOOGLE_CLIENT_ID را پر کنید
npm install                   # prisma generate روی postinstall اجرا می‌شود
npm run prisma:migrate        # ساخت جدول users
npm run start:dev             # http://localhost:4000
```

متغیرهای `backend/.env`:

```
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql://authapp:authapp@localhost:5432/authdb?schema=public
JWT_SECRET=...                # openssl rand -base64 32
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=...          # همان client id فرانت‌اند (برای verify کردن id_token)
GOLD_PRICE_INTERVAL_MS=3000   # فاصلهٔ ارسال قیمت روی WebSocket
# GOLD_PRICE_API_URL=         # اختیاری؛ بدون آن قیمت شبیه‌سازی می‌شود
```

### ۳) فرانت‌اند (Next.js)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

متغیرهای `frontend/.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...           # openssl rand -base64 32
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEST_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000   # WebSocket قیمت طلا (قابل دسترس از مرورگر)
```

### ۴) تنظیم Google OAuth

در [Google Cloud Console](https://console.cloud.google.com/apis/credentials) یک OAuth client از نوع
**Web application** بسازید و این‌ها را اضافه کنید:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

سپس `GOOGLE_CLIENT_ID` را در **هر دو** فایل env قرار دهید (بک‌اند از آن به‌عنوان `aud` برای
verify کردن `id_token` استفاده می‌کند) و `GOOGLE_CLIENT_SECRET` را فقط در فرانت‌اند.

## تست و لینت

```bash
cd backend  && npm test && npm run lint && npm run build
cd frontend && npx tsc --noEmit && npm run lint && npm run build
```

هنگام `next build` این هشدار از کتابخانهٔ `jose` (وابستگی next-auth) نمایش داده می‌شود و
بی‌خطر است؛ `CompressionStream` فقط برای JWE فشرده لازم است که Auth.js تولید نمی‌کند:

```
A Node.js API is used (CompressionStream …) which is not supported in the Edge Runtime.
```

## نکات امنیتی پیاده‌سازی‌شده

- پسوردها فقط به‌صورت هش bcrypt (۱۲ round) ذخیره می‌شوند؛ کاربران گوگلی `passwordHash` ندارند.
- JWT با انقضای مشخص (`JWT_EXPIRES_IN`) صادر می‌شود و انقضای آن در session هم نگه‌داری می‌شود؛
  پس از انقضا کاربر مجبور به ورود مجدد می‌شود.
- Rate limiting با `@nestjs/throttler`: سراسری ۳۰۰/دقیقه و روی `/auth/login` و `/auth/register`
  فقط ۵/دقیقه. چون همهٔ درخواست‌ها از سرور Next.js می‌آید و IP یکسان است، شمارش این مسیرها
  **بر اساس ایمیل** انجام می‌شود (`AuthThrottlerGuard`) تا حملهٔ brute-force روی یک حساب،
  بقیهٔ کاربران را قفل نکند.
- `id_token` گوگل در بک‌اند با `google-auth-library` verify می‌شود؛ ایمیل تأییدنشده رد می‌شود.
- پیام خطای ورود همیشه «ایمیل یا رمز عبور اشتباه است» است (بدون افشای وجود یا نبود کاربر) و
  در نبود کاربر هم یک مقایسهٔ bcrypt ساختگی انجام می‌شود تا زمان پاسخ لو ندهد.
- `ValidationPipe` با `whitelist` و `forbidNonWhitelisted` جلوی فیلدهای ناشناخته (مثل `role`) را می‌گیرد.
- CORS فقط برای دامنه‌های `CORS_ORIGINS` باز است.
- access token در کوکی رمزنگاری‌شدهٔ session نگهداری می‌شود و در این پروژه همهٔ تماس‌ها با NestJS
  از سمت سرور Next.js انجام می‌شود. توجه: چون توکن روی آبجکت `session` قرار داده شده، مسیر
  استاندارد `/api/auth/session` آن را به مرورگر هم می‌دهد (طبق خواستهٔ همین طراحی، تا کامپوننت‌های
  کلاینت هم بتوانند API صدا بزنند). اگر می‌خواهید توکن فقط سمت سرور بماند، `session.accessToken`
  را از callback `session` در `frontend/auth.ts` بردارید و در سرور با `getToken` از
  `next-auth/jwt` بخوانید.
- پارامتر `callbackUrl` فقط مسیر نسبی را می‌پذیرد (جلوگیری از open redirect).

در production حتماً HTTPS، `NODE_ENV=production` و secret های تازه استفاده کنید. اگر روزی API را
مستقیم در اختیار مرورگر گذاشتید، برای درست شدن `req.ip` باید `trust proxy` را در Express فعال کنید.

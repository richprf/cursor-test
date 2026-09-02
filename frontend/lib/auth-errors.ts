/**
 * Turns the `?error=` / `?code=` pair that NextAuth puts on the login page (and the
 * `code` returned by `signIn(..., { redirect: false })`) into a message for the user.
 */
export function authErrorMessage(
  error?: string | null,
  code?: string | null,
): string | null {
  if (!error && !code) return null;

  switch (code) {
    case 'invalid_credentials':
      return 'ایمیل یا رمز عبور اشتباه است.';
    case 'backend_unavailable':
      return 'ارتباط با سرور برقرار نشد. لطفاً بعداً دوباره تلاش کنید.';
    case 'too_many_requests':
      return 'تلاش‌های ناموفق زیاد بود. چند دقیقه صبر کنید و دوباره تلاش کنید.';
  }

  switch (error) {
    case 'CredentialsSignin':
      return 'ایمیل یا رمز عبور اشتباه است.';
    case 'OAuthAccountNotLinked':
      return 'این ایمیل قبلاً با رمز عبور ثبت شده است. با ایمیل وارد شوید، سپس از داشبورد حساب گوگل را متصل کنید.';
    case 'AccessDenied':
      return 'دسترسی داده نشد. حساب گوگل شما اجازه ورود ندارد.';
    case 'Configuration':
      return 'تنظیمات احراز هویت کامل نیست. با پشتیبانی تماس بگیرید.';
    case 'Callback':
    case 'OAuthCallbackError':
    case 'OAuthSignInError':
      return 'ورود با گوگل کامل نشد. دوباره تلاش کنید.';
    case 'SessionExpired':
    case 'RefreshTokenExpired':
    case 'AccessTokenExpired':
      return 'نشست شما منقضی شده، دوباره وارد شوید.';
    case 'SessionRequired':
      return 'برای دیدن این صفحه ابتدا وارد شوید.';
    default:
      return 'ورود ناموفق بود. دوباره تلاش کنید.';
  }
}

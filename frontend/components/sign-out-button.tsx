import { signOut } from '@/auth';
import { secondaryButtonClass } from '@/components/ui';

/** Server action based sign-out — no client JavaScript required. */
export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/login' });
      }}
    >
      <button type="submit" className={secondaryButtonClass}>
        خروج از حساب
      </button>
    </form>
  );
}

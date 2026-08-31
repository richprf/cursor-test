import type { UserRole } from '@/types/api';

export function dashboardPath(role: UserRole | undefined): '/dashboard/seller' | '/dashboard/buyer' {
  return role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer';
}

/** Shop logos are stored on Nest and rewritten through this Next.js app at the same path. */
export function publicAssetPath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

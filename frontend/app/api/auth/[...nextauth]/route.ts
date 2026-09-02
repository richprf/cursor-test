import { handlers } from '@/auth';

// Exposes the NextAuth endpoints (/api/auth/signin, /api/auth/callback/google, /api/auth/session, …).
export const { GET, POST } = handlers;

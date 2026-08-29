import { auth } from '@/auth';
import { BackendError } from '@/lib/backend';

export async function requireAccessToken(): Promise<
  { accessToken: string } | { response: Response }
> {
  const session = await auth();
  if (!session?.accessToken || session.error === 'AccessTokenExpired') {
    return {
      response: Response.json({ message: 'برای ادامه وارد شوید.' }, { status: 401 }),
    };
  }
  return { accessToken: session.accessToken };
}

export function nestErrorResponse(error: unknown): Response {
  if (error instanceof BackendError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  console.error('[shop-bag]', error);
  return Response.json({ message: 'ارتباط با سرور برقرار نشد.' }, { status: 502 });
}

export async function readJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

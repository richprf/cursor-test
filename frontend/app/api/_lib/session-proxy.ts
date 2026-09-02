import { BackendError } from '@/lib/backend';

export function nestErrorResponse(error: unknown): Response {
  if (error instanceof BackendError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  console.error('[shop-bag]', error);
  return Response.json({ message: 'ارتباط با سرور برقرار نشد.' }, { status: 502 });
}

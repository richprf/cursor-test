import { listMyProducts } from '@/lib/backend';
import { nestErrorResponse, requireAccessToken } from '../../_lib/session-proxy';

export async function GET() {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  try {
    return Response.json(await listMyProducts(auth.accessToken));
  } catch (error) {
    return nestErrorResponse(error);
  }
}

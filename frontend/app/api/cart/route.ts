import { addCartItem, getCart } from '@/lib/backend';
import { nestErrorResponse, readJsonBody, requireAccessToken } from '../_lib/session-proxy';

export async function GET() {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  try {
    return Response.json(await getCart(auth.accessToken));
  } catch (error) {
    return nestErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  const body = await readJsonBody<{ productId?: string; quantity?: number }>(request);
  if (!body?.productId) {
    return Response.json({ message: 'productId is required' }, { status: 400 });
  }
  try {
    const item = await addCartItem(auth.accessToken, body.productId, body.quantity ?? 1);
    return Response.json(item, { status: 201 });
  } catch (error) {
    return nestErrorResponse(error);
  }
}

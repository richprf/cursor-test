import { removeCartItem, updateCartItem } from '@/lib/backend';
import { nestErrorResponse, readJsonBody, requireAccessToken } from '../../_lib/session-proxy';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  const { productId } = await params;
  const body = await readJsonBody<{ quantity?: number }>(request);
  if (typeof body?.quantity !== 'number') {
    return Response.json({ message: 'quantity is required' }, { status: 400 });
  }
  try {
    return Response.json(
      await updateCartItem(auth.accessToken, decodeURIComponent(productId), body.quantity),
    );
  } catch (error) {
    return nestErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  const { productId } = await params;
  try {
    return Response.json(await removeCartItem(auth.accessToken, decodeURIComponent(productId)));
  } catch (error) {
    return nestErrorResponse(error);
  }
}

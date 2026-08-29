import { removeWishlistItem } from '@/lib/backend';
import { nestErrorResponse, requireAccessToken } from '../../_lib/session-proxy';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  const { productId } = await params;
  try {
    return Response.json(await removeWishlistItem(auth.accessToken, decodeURIComponent(productId)));
  } catch (error) {
    return nestErrorResponse(error);
  }
}

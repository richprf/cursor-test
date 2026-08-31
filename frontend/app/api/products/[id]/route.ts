import { deleteProduct, updateProduct } from '@/lib/backend';
import { nestErrorResponse, requireAccessToken } from '../../_lib/session-proxy';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  const { id } = await params;
  try {
    return Response.json(await updateProduct(auth.accessToken, id, await request.formData()));
  } catch (error) {
    return nestErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  const { id } = await params;
  try {
    return Response.json(await deleteProduct(auth.accessToken, id));
  } catch (error) {
    return nestErrorResponse(error);
  }
}

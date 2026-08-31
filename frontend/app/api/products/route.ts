import {
  createProduct,
  deleteProduct,
  listMyProducts,
  listProducts,
  updateProduct,
} from '@/lib/backend';
import { nestErrorResponse, requireAccessToken } from '../_lib/session-proxy';

export async function GET() {
  try {
    return Response.json(await listProducts());
  } catch (error) {
    return nestErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireAccessToken();
  if ('response' in auth) return auth.response;
  try {
    const item = await createProduct(auth.accessToken, await request.formData());
    return Response.json(item, { status: 201 });
  } catch (error) {
    return nestErrorResponse(error);
  }
}

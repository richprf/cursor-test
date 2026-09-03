import { listProducts } from '@/lib/backend';
import { nestErrorResponse } from '../_lib/session-proxy';

/** Public catalog — no access token. Authenticated product writes go through `/api/proxy`. */
export async function GET() {
  try {
    return Response.json(await listProducts());
  } catch (error) {
    return nestErrorResponse(error);
  }
}

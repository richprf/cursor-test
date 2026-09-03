import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { PublicUser } from '../../users/users.service';

/** Reads the user that `JwtStrategy.validate()` attached to the request. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user?: PublicUser }>();
  return request.user;
});

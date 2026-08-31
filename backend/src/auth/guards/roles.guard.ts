import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '../../generated/prisma/enums';
import type { PublicUser } from '../../users/users.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;

    const request = context.switchToHttp().getRequest<{ user?: PublicUser }>();
    const role = request.user?.role;
    if (!role || !roles.includes(role)) {
      throw new ForbiddenException('Only sellers can manage products');
    }
    return true;
  }
}

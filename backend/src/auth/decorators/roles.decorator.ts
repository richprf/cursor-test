import { SetMetadata } from '@nestjs/common';
import type { Role } from '../../generated/prisma/enums';

export const ROLES_KEY = 'roles';

/** Restricts a route to one or more account roles after JWT auth has run. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

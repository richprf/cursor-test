import { IsIn, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { ACCOUNT_ROLES, type AccountRole } from '../account-role';

export class CompleteProfileDto {
  @IsIn(ACCOUNT_ROLES, { message: 'Role must be BUYER or SELLER' })
  role!: AccountRole;

  @ValidateIf((dto: CompleteProfileDto) => dto.role === 'SELLER')
  @IsString({ message: 'Shop name is required for seller accounts' })
  @MinLength(2, { message: 'Shop name must be at least 2 characters long' })
  @MaxLength(120)
  shopName?: string;
}

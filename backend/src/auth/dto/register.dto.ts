import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { ACCOUNT_ROLES, type AccountRole } from '../account-role';

export class RegisterDto {
  @IsEmail({}, { message: 'A valid email address is required' })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(72, { message: 'Password must be at most 72 characters long' }) // bcrypt input limit
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsIn(ACCOUNT_ROLES, { message: 'Role must be BUYER or SELLER' })
  role!: AccountRole;

  @ValidateIf((dto: RegisterDto) => dto.role === 'SELLER')
  @IsString({ message: 'Shop name is required for seller accounts' })
  @MinLength(2, { message: 'Shop name must be at least 2 characters long' })
  @MaxLength(120)
  shopName?: string;
}

import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PRODUCT_ID_PATTERN } from '../../wishlist/dto/wishlist.dto';

export class AddCartDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  @Matches(PRODUCT_ID_PATTERN, { message: 'A valid product id is required' })
  productId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  quantity?: number;
}

export class UpdateCartDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  quantity!: number;
}

export class CartProductParamDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  @Matches(PRODUCT_ID_PATTERN, { message: 'A valid product id is required' })
  productId!: string;
}

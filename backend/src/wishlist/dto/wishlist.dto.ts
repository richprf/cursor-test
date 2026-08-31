import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/** Catalog handles (`oval-moonstone-dyad-signet-ring`) and shop ids (`rings-2`). */
export const PRODUCT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export class ProductIdDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  @Matches(PRODUCT_ID_PATTERN, { message: 'A valid product id is required' })
  productId!: string;
}

export class AddWishlistDto extends ProductIdDto {}

export class WishlistProductParamDto extends ProductIdDto {}

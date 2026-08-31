import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

const ALLOWED_KARATS = [18, 21, 22, 24] as const;

function blankToUndefined(value: unknown): unknown {
  if (value === '' || value === null) return undefined;
  return value;
}

function optionalNumber(value: unknown): number | undefined {
  const next = blankToUndefined(value);
  if (next === undefined) return undefined;
  return Number(next);
}

function emptyToNull(value: unknown): unknown {
  if (value === '') return null;
  return value;
}

export class UpdateProductDto {
  @IsOptional()
  @Transform(({ value }) => blankToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsNumber()
  @Min(0.01)
  weightGrams?: number;

  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsInt()
  @IsIn(ALLOWED_KARATS)
  karat?: number;

  @IsOptional()
  @Transform(({ value }) => optionalNumber(value))
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @Transform(({ value }) => emptyToNull(value))
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    if (value === '') return null;
    return Number(value);
  })
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(0)
  quantity?: number | null;
}

import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const ALLOWED_KARATS = [18, 21, 22, 24] as const;

function blankToUndefined(value: unknown): unknown {
  if (value === '' || value === null) return undefined;
  return value;
}

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  weightGrams!: number;

  @Type(() => Number)
  @IsInt()
  @IsIn(ALLOWED_KARATS)
  karat!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price!: number;

  @IsOptional()
  @Transform(({ value }) => blankToUndefined(value))
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @Transform(({ value }) => blankToUndefined(value))
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity?: number;
}

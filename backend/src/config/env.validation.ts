import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Fail fast on a bad `.env` instead of discovering it on the first request.
 */
export class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  @IsOptional()
  NODE_ENV: 'development' | 'test' | 'production' = 'development';

  @IsNumber()
  @IsOptional()
  PORT: number = 4000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @MinLength(16, { message: 'JWT_SECRET must be at least 16 characters long' })
  JWT_SECRET!: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '15m';

  /** Lifetime of the rotating refresh token stored in Postgres. */
  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '30d';

  /** Comma separated list of origins allowed to call this API. */
  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000';

  /**
   * Audience used to verify Google `id_token`s. Must match the client id the
   * frontend signs in with, otherwise tokens minted for another app would pass.
   */
  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID?: string;

  /** How often the gold price WebSocket publishes a new price. */
  @IsNumber()
  @IsOptional()
  GOLD_PRICE_INTERVAL_MS: number = 3000;

  /**
   * Optional real price feed returning `{ "price": <number> }`. Without it the
   * service simulates a random walk.
   */
  @IsUrl({ require_tld: false })
  @IsOptional()
  GOLD_PRICE_API_URL?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: false,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: false,
  });

  if (errors.length > 0) {
    const details = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('\n  - ');
    throw new Error(`Invalid environment configuration:\n  - ${details}`);
  }

  return validated;
}

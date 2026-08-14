import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthThrottlerGuard } from './common/guards/auth-throttler.guard';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { GoldPriceModule } from './gold-price/gold-price.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    // Baseline rate limit for the whole API; `/auth/*` tightens it further.
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 300 }],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    GoldPriceModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthThrottlerGuard }],
})
export class AppModule {}

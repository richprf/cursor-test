import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { ensureShopUploadDir } from './auth/logo-upload';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  ensureShopUploadDir();
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // drop properties without a decorator
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Only the Next.js app may call this API from a browser.
  app.enableCors({
    origin: config
      .get<string>('CORS_ORIGINS', 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  });

  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}

void bootstrap();

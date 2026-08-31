import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { GoldPriceService } from './gold-price.service';
import type { GoldPriceSnapshot } from './gold-price.types';

@Controller('gold-price')
export class GoldPriceController {
  constructor(private readonly goldPrice: GoldPriceService) {}

  /**
   * Lets the Next.js server render a real price on first paint, before the browser's
   * WebSocket is connected. Read-only and cheap, so it stays out of the rate limiter.
   */
  @Get('snapshot')
  @SkipThrottle()
  snapshot(): GoldPriceSnapshot {
    return this.goldPrice.getSnapshot();
  }
}

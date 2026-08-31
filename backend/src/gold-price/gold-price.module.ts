import { Module } from '@nestjs/common';
import { GoldPriceController } from './gold-price.controller';
import { GoldPriceGateway } from './gold-price.gateway';
import { GoldPriceService } from './gold-price.service';

@Module({
  controllers: [GoldPriceController],
  providers: [GoldPriceService, GoldPriceGateway],
})
export class GoldPriceModule {}

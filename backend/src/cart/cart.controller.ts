import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { PublicUser } from '../users/users.service';
import { AddCartDto, CartProductParamDto, UpdateCartDto } from './dto/cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  list(@CurrentUser() user: PublicUser) {
    return this.cart.list(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  add(@CurrentUser() user: PublicUser, @Body() dto: AddCartDto) {
    return this.cart.add(user.id, dto.productId, dto.quantity ?? 1);
  }

  @Patch(':productId')
  update(
    @CurrentUser() user: PublicUser,
    @Param() params: CartProductParamDto,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cart.updateQuantity(user.id, params.productId, dto.quantity);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user: PublicUser, @Param() params: CartProductParamDto) {
    return this.cart.remove(user.id, params.productId);
  }
}

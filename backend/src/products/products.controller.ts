import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { Role } from '../generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { PublicUser } from '../users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productImageUploadOptions } from './product-upload';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @SkipThrottle()
  listPublic() {
    return this.products.listPublic();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  listMine(@CurrentUser() user: PublicUser) {
    return this.products.listMine(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @UseInterceptors(FileInterceptor('image', productImageUploadOptions))
  create(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.products.create(user.id, dto, file);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @UseInterceptors(FileInterceptor('image', productImageUploadOptions))
  update(
    @CurrentUser() user: PublicUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.products.update(user.id, id, dto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  remove(@CurrentUser() user: PublicUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.products.remove(user.id, id);
  }
}

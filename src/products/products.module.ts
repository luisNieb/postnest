import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Category, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

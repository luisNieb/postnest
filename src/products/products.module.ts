import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadImageModule } from 'src/upload-image/upload-image.module';

@Module({
  imports:[TypeOrmModule.forFeature([Category, Product]),UploadImageModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

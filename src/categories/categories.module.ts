import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Category])],//usamos forFeature por que solo lo ocupamos en este modulo
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}

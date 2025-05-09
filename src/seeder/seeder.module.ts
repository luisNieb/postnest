import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmconfig } from '../config/typeorm.config';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';


@Module({
    imports: [
        ConfigModule.forRoot({
          isGlobal:true
        }),//para usar de manera global
        TypeOrmModule.forRootAsync({
          useFactory:typeOrmconfig,
          inject: [ConfigService]//para inyectar las variables de entorno
        }),
        TypeOrmModule.forFeature([Product, Category])
      ],
  providers: [SeederService]
})
export class SeederModule {}

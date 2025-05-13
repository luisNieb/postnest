import { Module } from '@nestjs/common';
import {ConfigModule ,ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { Type } from 'class-transformer';
import { typeOrmconfig } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CouponsModule } from './coupons/coupons.module';
import { UploadImageModule } from './upload-image/upload-image.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),//para usar de manera global
    TypeOrmModule.forRootAsync({
      useFactory:typeOrmconfig,
      inject: [ConfigService]//para inyectar las variables de entorno
    }),
    CategoriesModule,//se agrega al crear el recurso
    ProductsModule, TransactionsModule, CouponsModule, UploadImageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

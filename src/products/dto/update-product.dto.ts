import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

import {  IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateProductDto extends PartialType(CreateProductDto) {
     
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
        @IsString()
        @IsNotEmpty({message: "EL Nombre de la categoria no puede ir vacio"})
        name:string
}

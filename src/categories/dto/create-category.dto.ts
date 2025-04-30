import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty({message: "EL Nombre de la categoria no puede ir vacio"})
    name:string


}

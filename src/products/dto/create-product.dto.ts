import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateProductDto {

  @IsNotEmpty({message:'El nombre del produto es obligatorio'})
  @IsString({message:'Nombre no valido'})
  name: string;

 // image: string;

  @IsNotEmpty({message: 'El precio del producto es obligatorio'})
  @IsNumber({maxDecimalPlaces:2}, {message:'Precio no valido'})
  price: number;

  @IsNotEmpty({message: 'La cantidad no puede ir vacio'})
  @IsNumber({maxDecimalPlaces:0}, {message:'Cantidad  no valido'})
  inventory: number;

  @IsNotEmpty({message: 'La categoria es obligatoria'})
  @IsInt({message:'Cantidad  no valido'})
  categoryId: number;
}

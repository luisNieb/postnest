
import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ){}

  create(createCategoryDto: CreateCategoryDto) {
   
    //guardamos en la base de datos
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

   async findOne(id: number,product?:string) {
 
    const options :FindManyOptions<Category>={
       where:{
        id
       }
    }

    if(product ==='true'){
      options.relations={
        products:true
      }
    }
    
    const category= await this.categoryRepository.findOne(options);
    if(!category){
      //excepcion que vine con nest
      throw new NotFoundException("La categoria no existe ")
    }

    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {

    //reutilizamos la funcion de findOne de nuestra clase
   const categoria= await this.findOne(id)
   categoria.name =updateCategoryDto.name

   return await this.categoryRepository.save(categoria)

  }

  async remove(id: number) {
    const categoria = await this.findOne(id)
    //remove se puede eliminar multiples y delite solo uno
    await this.categoryRepository.delete(categoria)
    return "Categoria Eliminada"
  }
}

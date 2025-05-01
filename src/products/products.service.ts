import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepository:Repository<Product>,
    @InjectRepository(Category) private readonly CategoryRepository:Repository<Category>
  ){}


  async create(createProductDto: CreateProductDto) {
   
      const category = await this.CategoryRepository.findOneBy({id:createProductDto.categoryId})

      if(!category){
         let errors:string[]= []
         errors.push('La categoria no existe')
        throw new NotFoundException(errors)
      }

      // al usar el cascade en category entitie podemos pasar el objeto de categoria completo
      
      return this. productRepository.save({
         ...createProductDto,
            category
      })

  }

  async findAll(categoryId : number ,take : number, skip:number
   ) {

    const options:FindManyOptions<Product> ={
       //loadEagerRelatinons :false para desabilitar el eager 
      relations:{
        category:true
     },
     order:{
       id:'ASC'
     },
     take: take,// para mostrar una cantidad en especifico
     skip:skip  // saltar algunos resultados
    }


    if(categoryId){
       options.where = {
         category:{
          id:categoryId
         }
       }
       
    }
    //usamos relatios para traer tambien los datos de las relaciones
    const [produts, total]= await this.productRepository.findAndCount(options)

    return {
      produts,
      total
    }
  }

  async findOne(id: number) {

    const product =await this.productRepository.findOne({
      where:{
         id
        },
        relations:{
          category:true
        }
      })

      if(!product){
        throw new NotFoundException(`El producto con ${id} no fue encontrado`)
      }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id)
    //asigamos los valores de updatePorductDto a product
    Object.assign(product, updateProductDto)

    if(updateProductDto.categoryId){
        
      const category = await this.CategoryRepository.findOneBy({id:updateProductDto.categoryId})

      if(!category){
         let errors:string[]= []
         errors.push('La categoria no existe')
        throw new NotFoundException(errors)
      }
      product.category = category
    }

    return await this.productRepository.save(product)
  }

 async remove(id: number) {
  const product = await this.findOne(id)
  await this.productRepository.remove(product)
    return `Producto eliminado`;
  }
}

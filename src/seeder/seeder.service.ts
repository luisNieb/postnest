import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeederService {

    constructor(
        @InjectRepository(Category) private readonly categoryRepository:Repository<Category>,
        @InjectRepository(Product) private readonly productRepository:Repository<Product>,
        private dataSource:DataSource
    ){}

    //limpiar la base de datos
    async onModuleInit(){
        const connection = this.dataSource
        await connection.dropDatabase()
        await connection.synchronize()
         
    }


    async seed(){
        await this.categoryRepository.save(categories)

        for await ( const seedProduct of products){
            const cateory = await this.categoryRepository.findOneBy({id: seedProduct.categoryId})
            const product = new Product()
            product.name= seedProduct.name
            product.inventory= seedProduct.inventory
            product.price= seedProduct.price
            product.image = seedProduct.image
            product.category = cateory!

            await this.productRepository.save(product)
        }
    }
}

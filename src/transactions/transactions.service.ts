import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Transaction,
  TransactionContents
} from "./entities/transaction.entity";
import { Between, FindManyOptions, Repository, ReturningStatementNotSupportedError } from "typeorm";
import { Product } from "../products/entities/product.entity";

import { endOfDay, isValid, parseISO, startOfDay } from "date-fns";
import { CouponsService } from "../coupons/coupons.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContensRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly couponService:CouponsService //inyectar el service de coupon
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    //utilizamos transacciones con typeOrm
    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const transaction = new Transaction();
        const total = createTransactionDto.contents.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );
        transaction.total = total;

        //verificar si existe algun cupon
 
        if(createTransactionDto.coupon){
             //itulizamos el metodo se couponService
             const coupon = await this.couponService.applyCouponService(createTransactionDto.coupon)
             
             //calcular el toal del porcenteje del cupon y asignar los valores
             const discount = (coupon.percentage / 100)*total
             transaction.discount =discount
             transaction.coupon= coupon.name
             transaction.total -= discount

        }


        //Guardar la transaccion
        await transactionEntityManager.save(transaction);

        //iteramos el contenido
        for (const contents of createTransactionDto.contents) {
          //tenemos que agregar la entidad ya que en este caso no se hizo una instancia
          const product = await transactionEntityManager.findOneBy(Product, {
            id: contents.productId
          });

          const errors = [""];

          if (!product) {
            errors.push(
              `El producto con el ID: ${contents.productId} no existe`
            );
            throw new NotFoundException(errors);
          }

          if (contents.quantity > product.inventory) {
            errors.push(
              `El articulo ${product?.name} excede la cantidad disponible`
            );
            throw new BadRequestException(errors);
          }

          product.inventory -= contents.quantity;

          //creamos la instacia de TransactionContents
          const transactinContent = new TransactionContents();
          transactinContent.price = contents.price;
          transactinContent.product = product;
          transactinContent.quantity = contents.quantity;
          transactinContent.transaction = transaction;

          //guradamos el contenido de la transaccion
          await transactionEntityManager.save(transactinContent);
        }
      }
    );

    return "Venta almacenada correctamente";
  }

  findAll(transactionDate?:string) {

    const options:FindManyOptions<Transaction>={
        relations:{
          contents:true
        }
    }

    if(transactionDate){
       //transfomar a fecha
       const date = parseISO(transactionDate)

       if(!isValid(date)){
           throw new BadRequestException('Fecha no valida')
       }

       const start = startOfDay(date)
       const end = endOfDay(date)

       options.where= {
          transactionDate:Between(start, end)
       }

    }

    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaccion= await this.transactionRepository.findOne({
      where:{
        id
      },
      relations:{
        contents:true
      }
    })

    if(!transaccion){
      throw new NotFoundException("Transaccion no encontrada")
    }
    return transaccion
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

 async remove(id: number) {
    //buscmos la transaccion
    const transaccion= await this.findOne(id)

    //devemos eliminar primero el contenido de la transaccion 
    for(const contents of transaccion.contents){
        
      //buscamosla referencia al producto actualizamos la su inventario 
      const product = await this.productRepository.findOneBy({id:contents.product.id})
      product!.inventory += contents.quantity
      await this.productRepository.save(product!)


        const transaccionContents= await this.transactionContensRepository.findOneBy({id:contents.id})
        await this.transactionContensRepository.remove(transaccionContents!)
    }

    await this.transactionRepository.remove(transaccion)
  
    return {
      message:'Venta eliminada'
    }
  }
}

import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import {  Repository } from 'typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {
  

  //inyeccion de dependecia
  constructor(@InjectRepository(Coupon) private readonly couponRepository:Repository<Coupon>){}


  create(createCouponDto: CreateCouponDto) {
    return  this.couponRepository.save(createCouponDto)
  }

  findAll() {
    return this.couponRepository.find()
  }

  async findOne(id: number) {

    const cupon =await this.couponRepository.findOne( {
        where:{
          id
        }
    })
    console.log(cupon)
    if(!cupon){
       throw new NotFoundException('El Cupon no existe')
    }
    return cupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
     const cupon = await this.findOne(id)
     //asigamos los valores del dto a cupon
     Object.assign(cupon, updateCouponDto)

     return this.couponRepository.save(cupon)
    
  }

  async remove(id: number) {
   
    const cupon = await this.findOne(id)
    await this.couponRepository.remove(cupon!)
    return `El cupon a sido eliminado`;
  }

  async applyCouponService(applyCoupon:string){
     
      
      const coupon = await this.couponRepository.findOneBy({
         name:applyCoupon
      })

      if(!coupon){
        throw new NotFoundException("El cupon no existe")
      }

      //fecha actual 
      const currentDate = new Date()
      const expiratinDtae = endOfDay(coupon.expirationDate)

      //verificamos que fecha actual no pasara la fecha de expiracion
      if(isAfter(currentDate, expiratinDtae)){
         throw  new UnprocessableEntityException("Cupon y expirado")
      }


      return{
        message:"Cupon valido",
        ...coupon 
      }

  }



}

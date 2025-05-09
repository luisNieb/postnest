import { IsNotEmpty } from "class-validator";



export class ApplyCouponDto{
    @IsNotEmpty()
    coupon_name:string
}
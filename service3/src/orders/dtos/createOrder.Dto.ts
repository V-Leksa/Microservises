import { IsArray, IsNumber, IsOptional } from "class-validator";
import { BaseOrderDto } from "./baseOrdersDTO/baseOrders.dto";

export class CreateOrderDto extends BaseOrderDto {
    @IsArray()
    readonly products: {productId: number; quantity: number; price: number}[]
}
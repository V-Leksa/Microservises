import { IsArray, IsNumber, IsOptional } from "class-validator";
import { BaseOrderDto } from "./baseOrdersDTO/baseOrders.dto";

export class UpdateProductDto {
    @IsNumber()
    readonly productId: number;

    @IsOptional()
    @IsNumber()
    readonly quantity?: number; 
}

export class UpdateOrderDto extends BaseOrderDto {
    @IsOptional()
    @IsArray()
    readonly products?: UpdateProductDto[]; 
}
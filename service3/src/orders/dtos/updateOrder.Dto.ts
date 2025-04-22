import { IsArray, IsNumber, IsOptional } from "class-validator";
import { BaseOrderDto } from "./baseOrdersDTO/baseOrders.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductDto {
    @IsNumber()
    @ApiProperty({ example: 1, description: 'ID товара' })
    readonly productId: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 3, description: 'Количество товара', required: false })
    readonly quantity?: number; 
}

export class UpdateOrderDto extends BaseOrderDto {
    @IsOptional()
    @IsArray()
    @ApiProperty({ type: UpdateProductDto, isArray: true, required: false, description: 'Список обновляемых товаров' })
    readonly products?: UpdateProductDto[]; 
}
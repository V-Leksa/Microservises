import { IsArray, IsNumber, IsOptional } from "class-validator";
import { BaseOrderDto } from "./baseOrdersDTO/baseOrders.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto extends BaseOrderDto {
    @IsArray()
    @ApiProperty({ type: () => {
        return {
          productId: { type: Number, example: 1, description: 'ID товара' },
          quantity: { type: Number, example: 2, description: 'Количество товара' },
          price: { type: Number, example: 100.0, description: 'Цена товара' }
        };
      }, isArray: true, description: 'Список товаров в корзине' })
    readonly products: {productId: number; quantity: number; price: number}[]
}
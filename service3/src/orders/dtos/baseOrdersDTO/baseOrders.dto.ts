import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber } from "class-validator";

export class BaseOrderDto {
    @IsNumber()
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    readonly userId: number;

    @IsArray()
    @ApiProperty({ example: [1, 2, 3], description: 'Массив ID товаров' })
    readonly productsIds: number[];
}
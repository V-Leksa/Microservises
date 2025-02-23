import { IsArray, IsNumber } from "class-validator";

export class BaseOrderDto {
    @IsNumber()
    readonly userId: number;

    @IsArray()
    readonly productsIds: number[];
}
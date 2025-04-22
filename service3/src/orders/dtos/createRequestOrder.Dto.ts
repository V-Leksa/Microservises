import { ApiProperty } from "@nestjs/swagger";
import { CreateOrderDto } from "../dtos/createOrder.Dto";

export class CreateRequestOrder {
    @ApiProperty({ type: CreateOrderDto })
    order: CreateOrderDto;
  
    @ApiProperty({
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: { create: true }
    })
    permissions: Record<string, boolean>;
}
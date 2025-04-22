import { ApiProperty } from "@nestjs/swagger";
import { UpdateOrderDto, UpdateProductDto } from "../dtos/updateOrder.Dto";

export class UpadeRequestOrder {
    @ApiProperty({ type: UpdateOrderDto })
    order: UpdateOrderDto;
  
    @ApiProperty({
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: { create: true }
    })
    permissions: Record<string, boolean>;
}
export class UpadeRequestProduct {
    @ApiProperty({ type: UpdateProductDto })
    order: UpdateProductDto;
  
    @ApiProperty({
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: { create: true }
    })
    permissions: Record<string, boolean>;
}
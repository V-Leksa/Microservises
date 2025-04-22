import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entities/product.entity";

export class ProductRequestDto {
    @ApiProperty({ type: Product })
    product: Product;
  
    @ApiProperty({
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: { create: true }
    })
    permissions: Record<string, boolean>;
}
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class CreateUserRequest {
    @ApiProperty({ type: User })
    user: User;
  
    @ApiProperty({
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: { create: true }
    })
    permissions: Record<string, boolean>;
}
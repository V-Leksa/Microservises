import { ApiProperty } from "@nestjs/swagger";
import { CreateReportsDto } from "../dtos/reports.dto";

export class CreateReportRequest {
    @ApiProperty({ type: CreateReportsDto })
    order: CreateReportsDto;
  
    @ApiProperty({
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: { create: true }
    })
    permissions: Record<string, boolean>;
}
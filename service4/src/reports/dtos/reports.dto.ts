import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min, ValidateNested } from "class-validator";

class ReportDto {
    
    @ApiProperty({ example: 4, description: 'Значение рейтинга', minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    readonly rating: number
}

export class CreateReportsDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    readonly userId: number;

    @ApiProperty({ example: 1, description: 'ID товара' })
    readonly goodId: number;
    
    @ApiProperty({ type: () => {
      return {
        title: { type: String, example: 'Заголовок отчета', description: 'Название отчета' },
        reportInfo: { type: String, example: 'Информация об отчете', description: 'Описание отчета' },
        rating: { type: ReportDto, example: { rating: 4 }, description: 'Рейтинг отчета' }
      };
    }, description: 'Детали отчета' })

    @ValidateNested()
    @Type(() => ReportDto)
    readonly report: {
      title: string;
      reportInfo: string;
      rating: ReportDto;
    }
}
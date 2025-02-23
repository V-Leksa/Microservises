import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportsDto } from './dtos/reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('create')
  public async create(@Body() createReportData: CreateReportsDto): Promise<Report> {
    return this.reportsService.create(createReportData);
  }

  // проверка в postman
  // {
  //   "userId": 123,
  //   "goodId": 456,
  //   "report": {
  //     "title": "Хороший товар",
  //     "reportInfo": "Рекомендую",
  //     "rating": 5
  //   }
  // }

  @Get(':id')
  public async findOne(@Param('id')id: string): Promise<Report> {
    return this.reportsService.findOne(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<any> {
    return this.reportsService.delete(id);
  }
  @Patch(':id')
  public async update(@Param('id') id: string, @Body() payload: CreateReportsDto): Promise<Report> {
    return this.reportsService.update(id, payload);
  }
}


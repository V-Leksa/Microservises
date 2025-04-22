import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReportRequest } from './dtos/createReport.dto';

@ApiTags('Отчеты')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Создание нового отзыва'})
  @ApiBody({type: CreateReportRequest})
  @ApiResponse({status:201, description: 'Отзыв успешно создался'})
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async create(@Body() body: CreateReportRequest): Promise<Report> {

    if (!body.permissions.create) {
      throw new ForbiddenException('Нет прав на создание');
    }

    return this.reportsService.create(body.order);
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

  @Get('findAll')
  public async findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Найти отзыв по ID'})
  @ApiParam({name: 'id', description: 'ID отзыва'})
  @ApiResponse({status: 200, description: 'Отзыв успешно найден'})@ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({status: 404, description: 'Отзыв не найден'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async findOne(@Param('id')id: string): Promise<Report> {
    return this.reportsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Удаление отзыва'})
  @ApiParam({name: 'id', description: 'ID отзыва'})
  @ApiResponse({status: 200, description: 'Отзыв успешно удален'})
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({status: 404, description: 'Отзыв не найден'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async delete(@Param('id') id: string, @Body() body: {permissions: Record<string, boolean>}): Promise<any> {

    if (!body.permissions.delete) {
      throw new ForbiddenException('Нет прав на удаление');
    }

    return this.reportsService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Обновление отзыва'})
  @ApiParam({name: 'id', description: 'ID отзыва'})
  @ApiBody({type: CreateReportRequest})
  @ApiResponse({status: 200, description: 'Отзыв успешно обновлен'})
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({status: 404, description: 'Отзыв не найден'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async update(@Param('id') id: string, @Body() body: CreateReportRequest): Promise<Report> {

    if (!body.permissions.update) {
      throw new ForbiddenException('Нет прав на обновление');
    }

    return this.reportsService.update(id, body.order);
  }
}
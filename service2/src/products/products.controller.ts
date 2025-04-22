import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { addProducts } from 'src/shared/productGenerator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';
import { ProductRequestDto } from './dto/productRequest.dto';

export class UpdateProductDto extends PartialType(Product) {}

@ApiTags('Товары')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  @Get('cache-test')
  async testCache() {
    return await this.productsService.findCache();
  }

  @Get('allByDb')
  @ApiOperation({summary: 'Получение всех товаров'})
  @ApiResponse({status: 200, description: 'Товары успешно получены'})
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async findAll(@Body('user') user: {id: number; username: string; email: string}): Promise<Product[]> {
    console.log('Получен пользователь:', user)
    return await this.productsService.findAll();
  }
  //проверка - в теле отправить в таком виде

  // {
  //   "user": {
  //         "userId": 1,
  //         "username": "Lavada",
  //         "email": "Cathryn.Erdman@hotmail.com"
  //     }
  // }

  @Post('new')
  @ApiOperation({summary: 'Создание нового товара'})
  @ApiBody({type: ProductRequestDto})
  @ApiResponse({status: 201, description: 'Товар успешно создан'})
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async createNew(@Body() body: ProductRequestDto): Promise<Product> {
    if (!body.permissions.create) {
      throw new ForbiddenException('Нет прав на создание');
    }

    return await this.productsService.create(body.product);
  }

  @Get('/:id')
  @ApiOperation({summary: 'Получение товара по ID'})
  @ApiParam({name: 'id', description: 'ID товара'})
  @ApiResponse({status:200, description: 'Товар успешно получен'})
  @ApiResponse({ status: 400, description: 'Товар не найден' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public getOneById(@Param('id') id: number): Promise<Product> {
    return this.productsService.getOneById(id);
  }
  
  @Get('product/Search')
  @ApiOperation({summary: 'Поиск товаров по ключевому слову'})
  @ApiParam({name: 'query', description: 'Ключевое слово для поиска'})
  @ApiResponse({status:200, description: 'Товары успешно найдены'}) 
  @ApiResponse({ status: 400, description: 'Товар не найден' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async searcProducts(@Query('query') query: string): Promise<Product[]> {
    return await this.productsService.searchByKeyword(query);
  }
  
  @Patch(':id')
  @ApiOperation({summary: 'Частичное обновление товара'})
  @ApiParam({name: 'id', description: 'ID товара'})
  @ApiBody({type: UpdateProductDto})
  @ApiResponse({status:200, description: 'Товар успешно обновлен'})
  @ApiResponse({status:400, description: 'Товар не найден'})
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async partialUpdateProduct(@Param('id') id: number, @Body() body: {productData: Partial<Product>, permissions: Record<string, boolean>}): Promise<Product> {
    if (!body.permissions.update) {
      throw new ForbiddenException('Нет прав на обновление товара');
    }
    return await this.productsService.partialUpdateProduct(id, body.productData);
  }

  @Patch('full/:id')
  @ApiOperation({ summary: 'Полное обновление товара' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiBody({ type: ProductRequestDto })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен' })
  @ApiResponse({status:400, description: 'Товар не найден'})
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async updateProduct(@Param('id') id: number, @Body() body: ProductRequestDto): Promise<Product> {
    if (!body.permissions.update) {
      throw new ForbiddenException('Нет прав на полное обновление товара');
    }
    return await this.productsService.updateProduct(id, body.product);
  }

  //не делаем
  @Post('seed')
  @ApiOperation({ summary: 'Создание тестовых данных' })
  @ApiResponse({ status: 200, description: 'Тестовые данные успешно созданы' })
  public async seedProducts(@Body() body: {permissions: Record<string, boolean>}): Promise<void> {

    if (!body.permissions.create) {
      throw new ForbiddenException('Нет прав на создание');
    }

    await addProducts(this.productsService, 10); // Создаст 10 продуктов
  }

}

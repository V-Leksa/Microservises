import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { addProducts } from 'src/shared/productGenerator';
import { UserGuard } from './guard/user.guard';
import { RoleGuard } from './guard/user.roleGuard';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('allByDb')
  @UseGuards(UserGuard)
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
  @UseGuards(RoleGuard)
  public async createNew(@Body() product: Product): Promise<Product> {
    return await this.productsService.create(product);
  }

  @Get('/:id')
  public getOneById(@Param('id') id: number): Promise<Product> {
    return this.productsService.getOneById(id);
  }
  
  @Get('product/Search') 
  public async searcProducts(@Query('query') query: string): Promise<Product[]> {
    return await this.productsService.searchByKeyword(query);
  }
  
  @Patch(':id')
  public async partialUpdateProduct(@Param('id') id: number, @Body() productData: Partial<Product>): Promise<Product> {
    return await this.productsService.partialUpdateProduct(id, productData);
  }
  @Patch('full/:id')
  public async updateProduct(@Param('id') id: number, @Body() productData: Product): Promise<Product> {
    return await this.productsService.updateProduct(id, productData);
  }
  @Post('seed')
  public async seedProducts(): Promise<void> {
    await addProducts(this.productsService, 10); // Создаст 10 продуктов
  }

}

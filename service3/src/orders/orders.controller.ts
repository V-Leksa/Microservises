import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './interfaces/orders.interfaces';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRequestOrder } from './dtos/createRequestOrder.Dto';
import { UpadeRequestOrder, UpadeRequestProduct } from './dtos/updateRequestOrder.Dto';

@ApiTags('Корзина')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('create')
  @ApiOperation({ summary: 'Создание нового заказа' })
  @ApiBody({ type: CreateRequestOrder })
  @ApiResponse({ status: 201, description: 'Заказ успешно создан' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async create(@Body() body: CreateRequestOrder): Promise<Order> {

    if (!body.permissions.create) {
      throw new ForbiddenException('Нет прав на создание');
    }

    return this.ordersService.create(body.order);
  }

  // проверка в postman:
  //   {
  //     "userId": 1,
  //     "products": [
  //       {
  //         "productId": 101,
  //         "quantity": 2,
  //         "price": 1500
  //       },
  //       {
  //         "productId": 102,
  //         "quantity": 1,
  //         "price": 2000
  //       }
  //     ]
  //   }

  @Get('findAll')
  @ApiOperation({ summary: 'Получение всех заказов' })
  @ApiResponse({ status: 200, description: 'Заказы успешно получены' })
  public async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
  @Get(':id') //id -id созданной корзины
  @ApiOperation({ summary: 'Получение заказа по ID' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({ status: 200, description: 'Заказ успешно получен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  
  @Patch(':id')
  @ApiOperation({ summary: 'Обновление заказа' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiBody({ type: UpadeRequestOrder })
  @ApiResponse({ status: 200, description: 'Заказ успешно обновлен' }) 
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async update(@Param('id') id: string, @Body() body: UpadeRequestOrder): Promise<Order> {

    if (!body.permissions.update) {
      throw new ForbiddenException('Нет прав на обновление');
    }

    return this.ordersService.update(id, body.order);
  }
  
  // Метод для обновления количества товара
  @Patch(':orderId/products/:productId/')
  @ApiOperation({ summary: 'Обновление количества товара в заказе' })
  @ApiParam({ name: 'orderId', description: 'ID заказа' })
  @ApiParam({ name: 'productId', description: 'ID товара' })
  @ApiBody({ type: UpadeRequestOrder })
  @ApiResponse({ status: 200, description: 'Количество товара успешно обновлено' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async updateProductQuantity(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
    @Body() body: UpadeRequestProduct
  ): Promise<Order> {

    if (!body.permissions.update) {
      throw new ForbiddenException('Нет прав на обновление');
    }

    const { quantity } = body.order;
    console.log(orderId);
    console.log(productId);
    console.log(quantity);

    if (!quantity || quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const updatedOrder = await this.ordersService.updateProductQuantity(orderId, productId, quantity);
    
    if (!updatedOrder) {
      throw new NotFoundException('Order not found or product quantity not updated');
    }
    
    return updatedOrder;
  }

  // /orders/<orderId> - обновление заказа
  // проверка в postman:
  // 
    //  {
    //    "products":
    //        [
    //            {
    //                "productId": 1,
    //                "quantity": 15
    //            }
    //        ]   
    //    }
  // ________________________
  // /orders/<orderId>/products/<productId>/quantity - обновление кол-ва товара в заказе
  // {
  // "quantity": 4
  // }

  // Метод для удаления товара из корзины
  @Delete(':orderId/products/:productId')
  @ApiOperation({ summary: 'Удаление товара из заказа' })
  @ApiParam({ name: 'orderId', description: 'ID заказа' })
  @ApiParam({ name: 'productId', description: 'ID товара' })
  @ApiResponse({ status: 200, description: 'Товар успешно удален из заказа' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async removeProduct(
    @Param('orderId') orderId: string,
    @Param('productId') productId: number,
    @Body() body: {permissions: Record<string, boolean>}
  ): Promise<Order> {

    if (!body.permissions.delete) {
      throw new ForbiddenException('Нет прав на удаление');
    }

    const order = await this.ordersService.removeProductFromOrder(orderId, productId);
    
    if (!order) {
      throw new NotFoundException('Order not found or product not removed');
    }
    
    return order;
  }

  // проверка в postman:
  // http://localhost:3003/orders/1/products/101

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление заказа' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({ status: 200, description: 'Заказ успешно удален' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав для выполнения операции'})
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера'})
  public async delete(@Param('id') id: string, @Body() body: {permissions: Record<string, boolean>}): Promise<any> {

    if (!body.permissions.delete) {
      throw new ForbiddenException('Нет прав на удаление');
    }

    return this.ordersService.delete(id);
  }
}
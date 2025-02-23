import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './interfaces/orders.interfaces';
import { CreateOrderDto } from './dtos/createOrder.Dto';
import { UpdateOrderDto, UpdateProductDto } from './dtos/updateOrder.Dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('create')
  public async create(@Body() createOrderData: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderData);
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
  public async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
  @Get(':id') //id -id созданной корзины
  public async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }
  @Patch(':id')
  public async update(@Param('id') id: string, @Body() payload: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(id, payload);
  }
  
  // Метод для обновления количества товара
  @Patch(':orderId/products/:productId/quantity')
  public async updateProductQuantity(
    @Param('orderId') orderId: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Order> {
    const { productId, quantity } = updateProductDto;

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
  //   {
  //     "userId": 1,
  //     "products": [
  //       {
  //         "productId": 101,
  //         "quantity": 3,
  //         "price": 1500
  //       }
  //     ]
  //   }
  // ________________________
  // /orders/<orderId>/products/<productId>/quantity - обновление кол-ва товара в заказе
  // {
  // "quantity": 4
  // }

  // Метод для удаления товара из корзины
  @Delete(':orderId/products/:productId')
  public async removeProduct(
    @Param('orderId') orderId: string,
    @Param('productId') productId: number
  ): Promise<Order> {
    const order = await this.ordersService.removeProductFromOrder(orderId, productId);
    
    if (!order) {
      throw new NotFoundException('Order not found or product not removed');
    }
    
    return order;
  }

  // проверка в postman:
  // http://localhost:3003/orders/1/products/101

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<any> {
    return this.ordersService.delete('id');
  }
}

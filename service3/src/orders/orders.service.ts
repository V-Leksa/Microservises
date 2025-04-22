import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order } from './interfaces/orders.interfaces';
import { CreateOrderDto } from './dtos/createOrder.Dto';
import { UpdateOrderDto } from './dtos/updateOrder.Dto';
import {Cache} from '@nestjs/cache-manager';
import logger from '../logger/orders.logger';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<Order>,
        private readonly cacheManager: Cache,

    ) { }

    public async create(createOrderData: CreateOrderDto): Promise<Order> {
        logger.info('Creating a new order'); // Логирование создание заказа

        const createdOrder: Order = new this.orderModel(createOrderData);
        await createdOrder.save();

        logger.info(`Order created with ID: ${createdOrder.id}`); // Логирование ID созданного заказа
        
        // Удаление всех заказов из кэша, создан новый
        await this.cacheManager.del('all_orders');
        
        return createdOrder;
    }

    public async findAll(): Promise<Order[]> {
        logger.info('Fetching all orders'); // Логирование запроса на получение всех заказов

        const cachedOrders = await this.cacheManager.get<Order[]>('all_orders'); 
        if (cachedOrders) {
            console.log('Получение данных из кэша');
            return cachedOrders; 
        }

        const orders = await this.orderModel.find().exec();

        logger.info(`Fetched ${orders.length} orders`); // Логирование количества полученных заказов

        await this.cacheManager.set('all_orders', orders); 
        return orders;
    }
    public async findOne(id: string): Promise<Order> {

        logger.info(`Finding order with ID: ${id}`); // Логирование поиска заказа по ID

        const cachedOrder = await this.cacheManager.get<Order>(`order_${id}`); 
        if (cachedOrder) {
            console.log(`Получение заказа ${id} из кэша`);
            return cachedOrder; 
        }

        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            logger.error(`No order found with ID: ${id}`); // Логирование ошибки, если заказ не найден
            throw new BadRequestException('No order found with the provided id');
        }
        
        await this.cacheManager.set(`order_${id}`, order); 
        return order;
    }
    public async update(id: string, payload: UpdateOrderDto): Promise<Order> {
        
        logger.info(`Updating order with ID: ${id}`); // Логирование обновление заказа

        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, payload, { new: true }).exec();
        
        if (!updatedOrder) {
            logger.error(`No order found with ID: ${id} for update`); // Логирование ошибки при обновлении

            throw new BadRequestException('No order found with the provided id');
        }

        await this.cacheManager.del(`order_${id}`);

        logger.info(`Order updated with ID: ${updatedOrder.id}`); // Логирование успешное обновление заказа
        
        return updatedOrder;
    }
    public async updateProductQuantity(orderId: string, productId: string, quantity: number): Promise<Order> {

        function processOrder({ _id: orderId }) {
            return orderId; // ObjectId
        }

        const updatedOrder = await this.orderModel.findById(orderId).exec();
        console.log(updatedOrder.id);
        console.log(updatedOrder.userId);
        console.log(updatedOrder['products']);
        const allProducts = updatedOrder['products'];

        const productIdObj = new mongoose.Types.ObjectId(productId);
        console.log('First step');
        console.log(productIdObj);

        
        const wtf = processOrder({
            _id: new mongoose.Types.ObjectId('67e2d5b6f1cfcc1342ce47ab')
        });
        console.log('Second step');
        console.log(wtf);

        console.log('Result');
        console.log(productIdObj.equals(wtf));

        const seekingProduct = allProducts.find(product => Object(product._id).equals(productIdObj));
        const updatedArray = allProducts.map((product) => {
            if (Object(product._id).equals(productIdObj)) {
                product.quantity = quantity;
            }
            return product;
        })

        
        
        console.log(seekingProduct);
        seekingProduct.quantity = quantity;
        console.log(seekingProduct);
        console.log(updatedArray);

        // Конвертация orderId в ObjectId
        const orderIdObj = new mongoose.Types.ObjectId(orderId);
    
        if (!updatedOrder) {
            throw new BadRequestException('No order found with the provided id');
        }

        await this.cacheManager.del(`order_${orderId}`); 
        const updatedProducts = await (await this.orderModel.findOneAndUpdate({_id: orderId, products: updatedArray})).save();
        
        return updatedProducts;
    }

    public async removeProductFromOrder(orderId: string, productId: number): Promise<Order> {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(
            orderId,
            { $pull: { products: { product_id: productId } } },
            { new: true }
        ).exec();

        if (!updatedOrder) {
            throw new BadRequestException('No order found with the provided id');
        }

        await this.cacheManager.del(`order_${orderId}`);
        
        return updatedOrder;
    }

    public async delete(id: string): Promise<any> {

        logger.info(`Deleting order with ID: ${id}`); // Логирование удаление заказа

        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
        
        if (!deletedOrder) {
            logger.error(`No order found with ID: ${id} for deletion`); // Логирование ошибки при удалении

            throw new BadRequestException('No order found with the provided id');
        }

        await this.cacheManager.del(`order_${id}`);

        logger.info(`Order deleted with ID: ${id}`); // Логирование успешное удаление заказа
        
        return deletedOrder;
    }
}

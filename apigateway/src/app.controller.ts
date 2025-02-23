import { Controller, All, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AbilityFactory, Action, User } from './factories/ability.factory';
import { CaslGuard } from './factories/casl.guard';
import { Request } from 'express';
import { subject } from '@casl/ability';
import { CustomRequest } from './factories/request.interface';

@Controller()
@UseGuards(CaslGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @All('/users/*')
  public async requestUser(@Req() request: CustomRequest): Promise<any> {
    const user: User = request.user; 

    const ability = this.abilityFactory.defineAbility(user);

    if (ability.cannot(Action.Read, subject('User', { id: user.id, role: user.role }))) {
      throw new ForbiddenException('У вас нет прав на выполнение этого действия');
    }

    return this.appService.apiRequestToUsers(request.url, request.method, request.body);
  }

  @All('/products/*')
  public async requestProduct(@Req() request: CustomRequest): Promise<any> {
    const user: User = request.user; 
    
    const productId = this.extractProductId(request); 

    const ability = this.abilityFactory.defineAbility(user);

    if (ability.cannot(Action.Read, subject('Product', { id: productId, name: 'Example Product' }))) {
      throw new ForbiddenException('У вас нет прав на выполнение этого действия');
    }

    return this.appService.apiRequestToUsers(request.url, request.method, request.body);
  }

  @All('/orders/*')
  public async requestOrders(@Req() request: CustomRequest): Promise<any> {
    const user: User = request.user; 
    
    const orderId = this.extractOrderId(request); 
    const orderDate = new Date(); 

    const ability = this.abilityFactory.defineAbility(user);

    if (ability.cannot(Action.Read, subject('Order', { id: orderId, userId: user.id, orderDate }))) {
      throw new ForbiddenException('У вас нет прав на выполнение этого действия');
    }

    return this.appService.apiRequestToUsers(request.url, request.method, request.body);
  }

  @All('/chat/*')
  public async requestChat(@Req() request: CustomRequest): Promise<any> {
    return this.appService.apiRequestToUsers(request.url, request.method, request.body);
  }

  @All('/reports/*')
  public async requestReport(@Req() request: CustomRequest): Promise<any> {
    return this.appService.apiRequestToUsers(request.url, request.method, request.body);
  }

  private extractProductId(request: Request): number {
    const productId = parseInt(request.params.id); 
    if (isNaN(productId)) {
      throw new ForbiddenException('Неверный ID продукта');
    }
    return productId;
  }

  private extractOrderId(request: Request): number {
    const orderId = parseInt(request.params.id); 
    if (isNaN(orderId)) {
      throw new ForbiddenException('Неверный ID заказа');
    }
    return orderId;
  }
}
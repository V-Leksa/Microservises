import { Controller, All, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AbilityFactory, Action, Product, User, Report, Order } from './factories/ability.factory';
import { CaslGuard } from './factories/casl.guard';
import { Request } from 'express';
import { CustomRequest } from './factories/request.interface';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@UseGuards(CaslGuard)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @All('/auth/*')
  public async requestSecurity(@Req() request: CustomRequest): Promise<any> {
    return this.appService.apiRequestToSecurity(request.url, request.method, request.body);
  }


  @All('/users/*')
  public async requestUser(@Req() request: CustomRequest): Promise<any> {

    let user: User;

    if (!request.headers['authorization']) {
      const guestUserResponse = (await axios.get('http://service-security:3000/auth/guest-token')).data;
      console.log("Hooray");
      console.log(guestUserResponse);
      const guestDecoded = jwt.verify(guestUserResponse.guestToken, 'jwt_secret_token') as { userId: number; role: string };
      user = { id: guestDecoded.userId, role: guestDecoded.role};
    } else {
      console.log(request.headers['authorization']);
      const decoded = jwt.verify(request.headers['authorization'], 'jwt_secret_token') as { userId: number; role: string }; // декодирование токена
      console.log("А это я не знаю, что такое");
      console.log(decoded);
      user = { id: decoded.userId, role: decoded.role };
    }

      const ability = this.abilityFactory.defineAbility(user);

      if (ability.cannot(Action.Read, User)) {
        throw new ForbiddenException('У вас нет прав на выполнение этого действия');
      } 
      return this.appService.apiRequestToUsers(request.url, request.method, request.body, request);
    }
    
  @All('/products/*')
  public async requestProduct(@Req() request: CustomRequest): Promise<any> {
    
    let user: User;

    if (!request.headers['authorization']) {
      const guestUserResponse = (await axios.get('http://service-security:3000/auth/guest-token')).data;
      console.log("Hooray");
      console.log(guestUserResponse);
      const guestDecoded = jwt.verify(guestUserResponse.guestToken, 'jwt_secret_token') as { userId: number; role: string };
      user = { id: guestDecoded.userId, role: guestDecoded.role};
    } else {
      console.log(request.headers['authorization']);
      const decoded = jwt.verify(request.headers['authorization'], 'jwt_secret_token') as { userId: number; role: string }; // декодирование токена
      console.log("А это я не знаю, что такое");
      console.log(decoded);
      user = { id: decoded.userId, role: decoded.role };
    }

    const ability = this.abilityFactory.defineAbility(user);
    

    if (ability.cannot(Action.Read, Product)) {
      throw new ForbiddenException('У вас нет прав на выполнение этого действия');
    } 
    
    const productsResponse = this.appService.apiRequestToUsers(request.url, request.method, request.body, request);
    
    return productsResponse;
  }


  @All('/orders/*')
  public async requestOrders(@Req() request: CustomRequest): Promise<any> {

    let user: User;

    if (!request.headers['authorization']) {
      const guestUserResponse = (await axios.get('http://service-security:3000/auth/guest-token')).data;
      console.log("Hooray");
      console.log(guestUserResponse);
      const guestDecoded = jwt.verify(guestUserResponse.guestToken, 'jwt_secret_token') as { userId: number; role: string };
      user = { id: guestDecoded.userId, role: guestDecoded.role};
    } else {
      console.log(request.headers['authorization']);
      const decoded = jwt.verify(request.headers['authorization'], 'jwt_secret_token') as { userId: number; role: string }; // декодирование токена
      console.log("А это я не знаю, что такое");
      console.log(decoded);
      user = { id: decoded.userId, role: decoded.role };
    }


    const ability = this.abilityFactory.defineAbility(user);

    if (ability.cannot(Action.Read, Order)) {
      throw new ForbiddenException('У вас нет прав на выполнение этого действия');
    }
    
    
    return this.appService.apiRequestToUsers(request.url, request.method, request.body, request);
  }

  
  @All('/chat/*')
  public async requestChat(@Req() request: CustomRequest): Promise<any> {
    return this.appService.apiRequestToUsers(request.url, request.method, request.body, request);
  }

  
  @All('/reports/*')
  public async requestReport(@Req() request: CustomRequest): Promise<any> {

    let user: User;

    if (!request.headers['authorization']) {
      const guestUserResponse = (await axios.get('http://service-security:3000/auth/guest-token')).data;
      console.log("Hooray");
      console.log(guestUserResponse);
      const guestDecoded = jwt.verify(guestUserResponse.guestToken, 'jwt_secret_token') as { userId: number; role: string };
      user = { id: guestDecoded.userId, role: guestDecoded.role};
    } else {
      console.log(request.headers['authorization']);
      const decoded = jwt.verify(request.headers['authorization'], 'jwt_secret_token') as { userId: number; role: string }; // декодирование токена
      console.log("А это я не знаю, что такое");
      console.log(decoded);
      user = { id: decoded.userId, role: decoded.role };
    }

  
    const ability = this.abilityFactory.defineAbility(user);

    if (ability.cannot(Action.Read, Report)) {
      throw new ForbiddenException('У вас нет прав на выполнение этого действия');
    }
    

    return this.appService.apiRequestToUsers(request.url, request.method, request.body, request);
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
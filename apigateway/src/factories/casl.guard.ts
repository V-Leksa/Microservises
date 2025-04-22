import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, Action, Order, Product, Report, User } from './ability.factory';
import { subject } from '@casl/ability';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers['authorization']);
    let user;
    if (!request.headers['authorization']) {
      const guestUserResponse = (await axios.get('http://service-security:3000/auth/guest-token')).data;
      console.log("Hooray");
      console.log(guestUserResponse);
      const guestDecoded = jwt.verify(guestUserResponse.guestToken, 'jwt_secret_token') as { userId: number; role: string };
      user = { id: guestDecoded.userId, role: guestDecoded.role};
    }
    else {
    console.log("Это начальный реквест");
    console.log(request.headers['authorization']);
    user = this.getUserFromRequest(request); // получение пользователя из запроса.
    console.log("Это юзер из реквеста");
    console.log(user);
    }

    if (!user) return false; // если пользователь не найден

    request.permissions = {};

    const ability = this.abilityFactory.defineAbility(user);
    console.log(ability);

    const requestUrl = request.url;
    const requestMethod = request.method;

    let action!: Action;
    let subjectType!: string;

    let subjectData: any;

    if (requestUrl.startsWith('/users')) {
      subjectType = 'User';
      subjectData = User;
      action = Action.Read;   
      action = Action.Update;   
      action = Action.Delete;   
      action = Action.Create;   
    } else if (requestUrl.startsWith('/products')) {
      subjectType = 'Product';
      subjectData = Product;
      action = Action.Read; 
      action = Action.Update;   
      action = Action.Delete;   
      action = Action.Create; 
    } else if (requestUrl.startsWith('/orders')) {
      subjectType = 'Order';
      subjectData = Order;
      action = Action.Read; 
    } else if (requestUrl.startsWith('/chat')) {
      subjectType = 'Chat'; 
      action = Action.Read; 
    } else if (requestUrl.startsWith('/reports')) {
      subjectType = 'Report'; 
      subjectData = Report;
      action = Action.Read; 
    } 
    else {
      return true; // разрешить доступ к маршрутам без проверки CASL
    }



    //  объект Subject, определение данных
    const subjectInstance = subject(subjectType, subjectData); 
    console.log("Это начальная субджект инстансе", subjectInstance);

    Object.values(Action).forEach(action => {
      console.log('Это каждый action', action);
      console.log('Это каждый ability', ability.can(action, subjectInstance));
      request.permissions[action.toLowerCase()] = ability.can(action, subjectInstance);
    });

    console.log("Это пермиссии",  request.permissions);

    if (user.role === 'admin') {
      return !ability.cannot(action, subjectInstance);
    }

    return ability.cannot(action, subjectInstance); // запрет доступа при отсутствии прав
  }

  private getUserFromRequest(request: Request): User {
      const token = request.headers['authorization'];
      console.log("Это токен из заголовка");
      console.log(token);
  
      if (!token) {
        throw new ForbiddenException('Токен не предоставлен');
      }
  
      try {
        const decodedToken = this.decodeToken(token); // декодирование токена
        console.log("Это декодированный токен из заголовка");
        console.log(decodedToken);
        return decodedToken; // возврат объекта пользователя
      } catch (error) {
        throw new ForbiddenException('Неверный токен');
      }
    }
  
    private decodeToken(token: string): User {
      try {
        const secretKey = process.env.JWT_SECRET || 'jwt_secret_token'; // использование секретного ключа
        const decoded = jwt.verify(token, secretKey) as { userId: number; role: string }; // декодирование токена
        console.log("А это я не знаю, что такое");
        console.log(decoded);
        return { id: decoded.userId, role: decoded.role }; // возврат объекта пользователя
      } catch (error) {
        throw new ForbiddenException('Неверный токен'); // Обработка ошибок
      }
    }
}

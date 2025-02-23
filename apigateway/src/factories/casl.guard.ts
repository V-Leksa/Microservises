import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, Action, User } from './ability.factory';
import { subject } from '@casl/ability';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = this.getUserFromRequest(request); // получение пользователя из запроса.

    if (!user) return false; // если пользователь не найден

    const ability = this.abilityFactory.defineAbility(user);

    const requestUrl = request.url;
    const requestMethod = request.method;

    let action!: Action;
    let subjectType!: string;

    if (requestUrl.startsWith('/users')) {
      subjectType = 'User';
      action = Action.Read; 
    } else if (requestUrl.startsWith('/products')) {
      subjectType = 'Product';
      action = Action.Read; 
    } else if (requestUrl.startsWith('/orders')) {
      subjectType = 'Order';
      action = Action.Read; 
    } else if (requestUrl.startsWith('/chat')) {
      subjectType = 'Chat'; 
      action = Action.Read; 
    } else if (requestUrl.startsWith('/reports')) {
      subjectType = 'Report'; 
      action = Action.Read; 
    } else {
      return true; // разрешить доступ к маршрутам без проверки CASL
    }

    //  объект Subject, определение данных
    const subjectInstance = subject(subjectType, { id: user.id, content: '' }); 

    return !ability.cannot(action!, subjectInstance); // запрет доступа при отсутствии прав
  }

  private getUserFromRequest(request: Request): User {
      const token = request.headers['authorization']?.split(' ')[1];
  
      if (!token) {
        throw new ForbiddenException('Токен не предоставлен');
      }
  
      try {
        const decodedToken = this.decodeToken(token); // декодирование токена
        return decodedToken; // возврат объекта пользователя
      } catch (error) {
        throw new ForbiddenException('Неверный токен');
      }
    }
  
    private decodeToken(token: string): User {
      try {
        const secretKey = process.env.JWT_SECRET || 'secret-key-for-api'; // использование секретного ключа
        const decoded = jwt.verify(token, secretKey) as { id: number; role: string }; // декодирование токена
  
        return { id: decoded.id, role: decoded.role }; // возврат объекта пользователя
      } catch (error) {
        throw new ForbiddenException('Неверный токен'); // Обработка ошибок
      }
    }
}

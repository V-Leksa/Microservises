import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const { userId } = request.body.user; // Получение userId из body запроса

    if (!userId) {
      throw new BadRequestException('User ID must be provided');
    }

    // Проверка существования пользователя через fetch
    try {
      const response = await firstValueFrom(this.httpService.get(`http://users-service:3000/users/all`));
      const users = response.data;

      // Проверка существования  пользователя с данным ID, дописать email и username
      const userExists = users.some(user => user.id === userId);

      return userExists; // Возврат true, если пользователь найден, иначе false
    }catch(error) {
      console.error(error);
      throw new BadRequestException('Error fetching users');
    }
  }
}

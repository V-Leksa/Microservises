import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly httpService: HttpService) {} // Внедряем HttpService

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.body; 

        if (!userId) {
            throw new ForbiddenException('User ID must be provided');
        }

        // Получение роли пользователя 
        try {
            const response = await firstValueFrom(this.httpService.get(`http://users-service:3000/users/${userId}`));
            const user = response.data; 
            
            if (!user) {
                throw new ForbiddenException('User not found or invalid');
            }

            const userRole = user.role; // ответ содержит поле role

            // Проверка является ли пользователь менеджером или оператором
            if (userRole !== 'manager' && userRole !== 'operator') {
                throw new ForbiddenException('Insufficient permissions');
            }

            return true; 
        } catch (error) {
            console.error(error); 
            throw new ForbiddenException('Error fetching user role'); // Обработка ошибок
        }
    }
}

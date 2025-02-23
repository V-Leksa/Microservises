import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly usersServiceUrl = 'http://localhost:3001';
  private readonly productsServiceUrl = 'http://localhost:3002'; 
  private readonly ordersServiceUrl = 'http://localhost:3003'; 
  private readonly chatServiceUrl = 'http://localhost:3004'; 
  private readonly reportsServiceUrl = 'http://localhost:3008'; 
  constructor(private readonly httpService: HttpService) {}
  
  public async apiRequestToUsers(url: string, method: string, body: any): Promise<any> {
    const serviceUrl = this.getServiceUrl(url);
    try {
      const response = await firstValueFrom(this.httpService.request({ method, url: serviceUrl, data: body }));
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при запросе к сервису: ${error.message}`);
    }
  }

  private getServiceUrl(requestUrl: string): string {
    if (requestUrl.startsWith('/users')) {
      return `${this.usersServiceUrl}${requestUrl}`;
    } else if (requestUrl.startsWith('/products')) {
      return `${this.productsServiceUrl}${requestUrl}`;
    } else if (requestUrl.startsWith('/orders')) {
      return `${this.ordersServiceUrl}${requestUrl}`;
    } else if (requestUrl.startsWith('/chat')) {
      return `${this.chatServiceUrl}${requestUrl}`;
    } else if (requestUrl.startsWith('/reports')) {
      return `${this.reportsServiceUrl}${requestUrl}`;
    }
    throw new Error('Неизвестный маршрут');
  }
}

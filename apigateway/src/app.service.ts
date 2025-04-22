import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly usersServiceUrl = 'http://users-service:3000';
  private readonly productsServiceUrl = 'http://products-service:3000'; 
  private readonly ordersServiceUrl = 'http://orders-service:3000'; 
  private readonly chatServiceUrl = 'http://chat-service:3000'; 
  private readonly reportsServiceUrl = 'http://reports-service:3000'; 
  private readonly securityServiceUrl = 'http://service-security:3000'; 
  constructor(private readonly httpService: HttpService) {}
  
  public async apiRequestToUsers(url: string, method: string, body: any, request: any): Promise<any> {
    const serviceUrl = this.getServiceUrl(url);
    console.log("Это url");
    console.log(serviceUrl);
    console.log(body);

    const requestBody = {
      ...body,
      permissions: request.permissions
    };

    try {
      const token = 'Bearer ' + request.headers.authorization;
      console.log("Это token");
      console.log(token);
      console.log('Это данные с permissions');
      console.log(requestBody);
      const response = await firstValueFrom(this.httpService.request({ method, url: serviceUrl, data: requestBody, 
        headers: {
          Authorization: token,
        }
    })
  );
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
    } else if (requestUrl.startsWith('/auth')) {
      return `${this.securityServiceUrl}${requestUrl}`;
    }
    throw new Error('Неизвестный маршрут');
  }

  public async apiRequestToSecurity(url: string, method: string, body: any): Promise<any> {
    const serviceUrl = this.getServiceUrl(url);
    console.log("Это url");
    console.log(serviceUrl);
    
    const requestBody = {
      ...body,
      permissions: {"create": true, "read": true}
    };

    

    try {
      console.log("Это token");
      const response = await firstValueFrom(this.httpService.request({ method, url: serviceUrl, data: requestBody, 
        headers: {
          Authorization: 'lol',
        }
    })
  );
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при запросе к сервису: ${error.message}`);
    }
  }

  
}

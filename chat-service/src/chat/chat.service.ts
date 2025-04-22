import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
    constructor(private httpService: HttpService) {}

    public async searchProducts(keyword: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(`http://products-service:3000/products/product/Search?query=${keyword}`));
            
            return response.data; 
        } catch (error) {
            console.error('Error fetching products:', error); 
            throw new Error('Failed to fetch products'); 
        }
    }
}


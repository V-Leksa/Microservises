import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { ChatService } from './chat.service';
import { HttpService } from '@nestjs/axios'; // Добавил это


@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*'
  }
})
export class ChatGateway {
  
  private chatService: ChatService = new ChatService(new HttpService()); // 

  @WebSocketServer()  
  server: Server

  @SubscribeMessage('searchProduct') //возврат клиенту, использовать client
  async handleSearchProduct(@MessageBody() payload: { query: string }, @ConnectedSocket() client: Socket) {
    
    // логирование всего payload для отладки
    console.log('Получен payload:', payload);

    // проверка наличия query
    if (!payload || !payload.query || payload.query.trim() === '') {
      console.error('Ошибка: отсутствует параметр query');
      client.emit('productSearchResult', 'Параметр query обязателен');
      return; 
    }

    try {
      console.log(`Получен запрос на поиск продукта с параметром: ${payload.query}`);

      // поиск продуктов через сервис
      const products = await this.chatService.searchProducts(payload.query);
      console.log('Найденные продукты:', products);

      // проверка, есть ли найденные продукты
      if (products.length === 0) {
        client.emit('searchProduct', 'Товар с данными характеристиками не найден');
      } else {
        client.emit('searchProduct', products);
      }
    } catch (error) {
      // логирование ошибки и отправка сообщения клиенту
      console.error('Ошибка при обработке поиска продуктов:', error.message);
      client.emit('searchProduct', { status: 'error', message: error.message });
    }
  }
}

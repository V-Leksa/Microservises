import { Module } from '@nestjs/common';

import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import logger from './logger/orders.logger';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    
    WinstonModule.forRoot({
      instance: logger, 
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


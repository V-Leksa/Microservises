import { Module } from '@nestjs/common';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import logger from './logger/reports.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configServise: ConfigService) => ({
        uri: configServise.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService]
    }),
    WinstonModule.forRoot({
      instance: logger, 
    }),
    ReportsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



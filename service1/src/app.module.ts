import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import logger from './logger/users.logger';

@Module({
  imports: [
    ConfigModule.forRoot(), //для получения переменных среды
    TypeOrmModule.forRoot(
      {
        type: 'mariadb',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true
      }
    ),
    WinstonModule.forRoot({
      instance: logger,
    }),
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

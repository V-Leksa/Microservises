import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpModule } from '@nestjs/axios';
import { UserGuard } from './guard/user.guard';
import { RoleGuard } from './guard/user.roleGuard';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore} from 'cache-manager-redis-yet';


@Module({
  imports: [
    
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        console.log('Redis Host:', process.env.REDIS_HOST || 'localhost');
        console.log('Redis port:', process.env.REDIS_PORT || 6379);

        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'redis',
            port: 6379,
          },
        });
        return {
          store,
          ttl: 60 * 60 * 1000,
        };
      }
      
    }), 

    TypeOrmModule.forFeature([Product]), HttpModule],

  controllers: [ProductsController],
  providers: [ProductsService, UserGuard, RoleGuard],
})
export class ProductsModule {}

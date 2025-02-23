import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpModule } from '@nestjs/axios';
import { UserGuard } from './guard/user.guard';
import { RoleGuard } from './guard/user.roleGuard';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({
        ttl: 6000,
        max: 100,
      }),TypeOrmModule.forFeature([Product]), HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService, UserGuard, RoleGuard],
})
export class ProductsModule {}

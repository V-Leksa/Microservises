import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from './entities/user.entity';

@Module({
  imports: [CacheModule.register({
        ttl: 6000,
        max: 100,
      }), 
      TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService], 
  exports: [UsersService],
})
export class UsersModule {}

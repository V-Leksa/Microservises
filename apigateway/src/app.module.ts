import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import {AbilityFactory} from './factories/ability.factory';
import { CaslGuard } from './factories/casl.guard';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, AbilityFactory, CaslGuard ],
})
export class AppModule {}

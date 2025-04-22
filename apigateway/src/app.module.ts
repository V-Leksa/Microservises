import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import {AbilityFactory} from './factories/ability.factory';
import { CaslGuard } from './factories/casl.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, 
    JwtModule.register({
      secret: 'jwt-secret-token',
      signOptions: {expiresIn: '1h'}
    })
  ],
  controllers: [AppController],
  providers: [AppService, AbilityFactory, CaslGuard ],
})
export class AppModule {}

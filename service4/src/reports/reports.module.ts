import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsSchema } from './schemas/reports.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 6000,
      max: 100
    }),
    MongooseModule.forFeature([
      {name: 'Report', schema: ReportsSchema}
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

import { Module } from '@nestjs/common';
import { AwardsController, AwardEditionsController } from './awards.controller.js';
import { AwardsService } from './awards.service.js';

@Module({
  controllers: [AwardsController, AwardEditionsController],
  providers: [AwardsService]
})
export class AwardsModule {}

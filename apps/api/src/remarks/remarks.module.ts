import { Module } from '@nestjs/common';
import { RemarksController } from './remarks.controller.js';
import { RemarksService } from './remarks.service.js';

@Module({
  controllers: [RemarksController],
  providers: [RemarksService]
})
export class RemarksModule {}

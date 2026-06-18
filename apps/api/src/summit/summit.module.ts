import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { SummitController } from './summit.controller.js';
import { SummitService } from './summit.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [SummitController],
  providers: [SummitService]
})
export class SummitModule {}

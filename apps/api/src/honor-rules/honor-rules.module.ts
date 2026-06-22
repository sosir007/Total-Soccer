import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { HonorRulesController } from './honor-rules.controller.js';
import { HonorRulesService } from './honor-rules.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [HonorRulesController],
  providers: [HonorRulesService]
})
export class HonorRulesModule {}

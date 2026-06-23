import { Module } from '@nestjs/common';
import { AwardRulesController } from './award-rules.controller.js';
import { AwardRulesService } from './award-rules.service.js';

@Module({
  controllers: [AwardRulesController],
  providers: [AwardRulesService]
})
export class AwardRulesModule {}

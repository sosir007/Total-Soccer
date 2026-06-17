import { Module } from '@nestjs/common';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { DatabaseModule } from '../database/database.module.js';
import {
  CompetitionEditionsController,
  CompetitionsController
} from './competitions.controller.js';
import { CompetitionsService } from './competitions.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CompetitionsController, CompetitionEditionsController],
  providers: [CompetitionsService, CatalogStatsService]
})
export class CompetitionsModule {}

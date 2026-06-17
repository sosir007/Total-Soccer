import { Module } from '@nestjs/common';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardController],
  providers: [DashboardService, CatalogStatsService]
})
export class DashboardModule {}

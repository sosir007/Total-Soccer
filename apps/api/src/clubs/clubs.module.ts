import { Module } from '@nestjs/common';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { ClubsController } from './clubs.controller.js';
import { ClubsService } from './clubs.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ClubsController],
  providers: [ClubsService, CatalogStatsService]
})
export class ClubsModule {}

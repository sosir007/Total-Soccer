import { Module } from '@nestjs/common';
import { CatalogStatsService } from '../common/catalog-stats.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { CountriesController } from './countries.controller.js';
import { CountriesService } from './countries.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CountriesController],
  providers: [CountriesService, CatalogStatsService]
})
export class CountriesModule {}

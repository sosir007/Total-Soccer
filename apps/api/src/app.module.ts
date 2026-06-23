import { Module } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppConfigModule } from './config/app-config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { ImportPreviewModule } from './import-preview/import-preview.module.js';
import { PlayersModule } from './players/players.module.js';
import { CountriesModule } from './countries/countries.module.js';
import { ClubsModule } from './clubs/clubs.module.js';
import { CompetitionsModule } from './competitions/competitions.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { SummitModule } from './summit/summit.module.js';
import { BaseConfigModule } from './base-config/base-config.module.js';
import { HonorRulesModule } from './honor-rules/honor-rules.module.js';
import { AwardsModule } from './awards/awards.module.js';
import { AwardRulesModule } from './award-rules/award-rules.module.js';
import { RemarksModule } from './remarks/remarks.module.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    HealthModule,
    ImportPreviewModule,
    PlayersModule,
    CountriesModule,
    ClubsModule,
    CompetitionsModule,
    DashboardModule,
    SummitModule,
    BaseConfigModule,
    HonorRulesModule,
    AwardsModule,
    AwardRulesModule,
    RemarksModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

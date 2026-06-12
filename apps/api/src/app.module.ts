import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppConfigModule } from './config/app-config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { ImportPreviewModule } from './import-preview/import-preview.module.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

@Module({
  imports: [AppConfigModule, DatabaseModule, HealthModule, ImportPreviewModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {}

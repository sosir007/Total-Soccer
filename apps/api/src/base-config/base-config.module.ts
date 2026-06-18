import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { BaseConfigController } from './base-config.controller.js';
import { BaseConfigService } from './base-config.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [BaseConfigController],
  providers: [BaseConfigService]
})
export class BaseConfigModule {}

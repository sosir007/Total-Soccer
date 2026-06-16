import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { ClubsController } from './clubs.controller.js';
import { ClubsService } from './clubs.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ClubsController],
  providers: [ClubsService]
})
export class ClubsModule {}

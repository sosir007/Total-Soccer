import { Module } from '@nestjs/common';
import { ImportPreviewController } from './import-preview.controller.js';
import { ImportPreviewService } from './import-preview.service.js';

@Module({
  controllers: [ImportPreviewController],
  providers: [ImportPreviewService]
})
export class ImportPreviewModule {}

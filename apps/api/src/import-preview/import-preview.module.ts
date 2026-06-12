import { Module } from '@nestjs/common';
import { ImportPreviewController } from './import-preview.controller.js';

@Module({
  controllers: [ImportPreviewController]
})
export class ImportPreviewModule {}

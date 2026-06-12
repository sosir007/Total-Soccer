import { Body, Controller, Post } from '@nestjs/common';

interface ImportPreviewRequest {
  fileName?: string;
  sourceType?: 'lakesheet' | 'excel' | 'csv';
}

@Controller('import-preview')
export class ImportPreviewController {
  @Post()
  preview(@Body() body: ImportPreviewRequest) {
    return {
      fileName: body.fileName ?? null,
      sourceType: body.sourceType ?? 'lakesheet',
      status: 'pending',
      message: '导入预览接口已预留，后续接入文件解析与校验。'
    };
  }
}

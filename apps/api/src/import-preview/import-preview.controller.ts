import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImportPreviewService } from './import-preview.service.js';
import type { ImportSourceType, UploadedImportFile } from './import-preview.types.js';

interface ImportPreviewBody {
  sourceType?: ImportSourceType;
}

@ApiTags('import')
@Controller('import-preview')
export class ImportPreviewController {
  constructor(private readonly importPreviewService: ImportPreviewService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024
      }
    })
  )
  @ApiOperation({ summary: '生成数据导入预览' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        },
        sourceType: {
          type: 'string',
          enum: ['lakesheet', 'excel', 'csv']
        }
      }
    }
  })
  preview(@UploadedFile() file: UploadedImportFile, @Body() body: ImportPreviewBody) {
    return this.importPreviewService.preview(file, body.sourceType);
  }

  @Post(':taskId/confirm')
  @ApiOperation({ summary: '确认导入预览数据到正式业务表' })
  confirm(@Param('taskId') taskId: string) {
    return this.importPreviewService.confirm(taskId);
  }
}

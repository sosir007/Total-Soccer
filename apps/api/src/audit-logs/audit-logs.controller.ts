import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service.js';
import type { AuditLogListQuery } from './audit-logs.types.js';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: '获取审计日志列表' })
  findAll(@Query() query: AuditLogListQuery) {
    return this.auditLogsService.findAll(query);
  }
}

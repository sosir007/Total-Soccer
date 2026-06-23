import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemarksService } from './remarks.service.js';
import type { RemarkListQuery } from './remarks.types.js';

@ApiTags('remarks')
@Controller('remarks')
export class RemarksController {
  constructor(private readonly remarksService: RemarksService) {}

  @Get()
  @ApiOperation({ summary: '获取备注聚合列表' })
  findAll(@Query() query: RemarkListQuery) {
    return this.remarksService.findAll(query);
  }
}

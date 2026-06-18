import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SummitService } from './summit.service.js';
import type { SummitCandidatesQuery, SummitQuery } from './summit.types.js';

@ApiTags('summit')
@Controller('summit')
export class SummitController {
  constructor(private readonly summitService: SummitService) {}

  @Get('lineup')
  @ApiOperation({ summary: '获取紫禁之巅最佳阵容' })
  lineup(@Query() query: SummitQuery) {
    return this.summitService.lineup(query);
  }

  @Get('candidates')
  @ApiOperation({ summary: '获取紫禁之巅位置候选' })
  candidates(@Query() query: SummitCandidatesQuery) {
    return this.summitService.candidates(query);
  }
}

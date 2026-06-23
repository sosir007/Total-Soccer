import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AwardRulesService } from './award-rules.service.js';
import type { AwardRuleListQuery, AwardRulePayload } from './award-rules.types.js';

@ApiTags('award-rules')
@Controller('award-rules')
export class AwardRulesController {
  constructor(private readonly awardRulesService: AwardRulesService) {}

  @Get()
  @ApiOperation({ summary: '获取球员奖项评分规则列表' })
  findAll(@Query() query: AwardRuleListQuery) {
    return this.awardRulesService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '创建球员奖项评分规则' })
  create(@Body() body: AwardRulePayload) {
    return this.awardRulesService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑球员奖项评分规则' })
  update(@Param('id') id: string, @Body() body: AwardRulePayload) {
    return this.awardRulesService.update(id, body);
  }

  @Post('recalculate')
  @ApiOperation({ summary: '重新计算球员荣誉分' })
  recalculate() {
    return this.awardRulesService.recalculate();
  }
}

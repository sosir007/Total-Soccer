import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HonorRulesService } from './honor-rules.service.js';
import type { HonorRuleListQuery, HonorRulePayload } from './honor-rules.types.js';

@ApiTags('honor-rules')
@Controller('honor-rules')
export class HonorRulesController {
  constructor(private readonly honorRulesService: HonorRulesService) {}

  @Get()
  @ApiOperation({ summary: '获取荣誉规则列表' })
  findAll(@Query() query: HonorRuleListQuery) {
    return this.honorRulesService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '创建荣誉规则' })
  create(@Body() body: HonorRulePayload) {
    return this.honorRulesService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑荣誉规则' })
  update(@Param('id') id: string, @Body() body: HonorRulePayload) {
    return this.honorRulesService.update(id, body);
  }

  @Post('recalculate')
  @ApiOperation({ summary: '重新计算国家和俱乐部荣誉分' })
  recalculate() {
    return this.honorRulesService.recalculate();
  }
}

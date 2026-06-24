import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseConfigService } from './base-config.service.js';
import type { BaseConfigBody, BaseConfigQuery, BaseConfigType } from './base-config.types.js';

@ApiTags('base-config')
@Controller('base-config')
export class BaseConfigController {
  constructor(private readonly baseConfigService: BaseConfigService) {}

  @Get(':type')
  @ApiOperation({ summary: '获取基础配置列表' })
  findAll(@Param('type') type: BaseConfigType, @Query() query: BaseConfigQuery) {
    return this.baseConfigService.findAll(type, query);
  }

  @Post(':type')
  @ApiOperation({ summary: '创建基础配置' })
  create(@Param('type') type: BaseConfigType, @Body() body: BaseConfigBody) {
    return this.baseConfigService.create(type, body);
  }

  @Put(':type/:id')
  @ApiOperation({ summary: '编辑基础配置' })
  update(
    @Param('type') type: BaseConfigType,
    @Param('id') id: string,
    @Body() body: BaseConfigBody
  ) {
    return this.baseConfigService.update(type, id, body);
  }

  @Delete(':type/:id')
  @ApiOperation({ summary: '删除基础配置' })
  remove(@Param('type') type: BaseConfigType, @Param('id') id: string) {
    return this.baseConfigService.remove(type, id);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClubsService } from './clubs.service.js';
import type { ClubHonorListQuery, ClubListQuery, ClubPayload } from './clubs.types.js';

@ApiTags('clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  @ApiOperation({ summary: '获取俱乐部列表' })
  findAll(@Query() query: ClubListQuery) {
    return this.clubsService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增俱乐部' })
  create(@Body() body: ClubPayload) {
    return this.clubsService.create(body);
  }

  @Get('honors')
  @ApiOperation({ summary: '获取俱乐部荣誉列表' })
  findHonors(@Query() query: ClubHonorListQuery) {
    return this.clubsService.findHonors(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取俱乐部详情' })
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑俱乐部' })
  update(@Param('id') id: string, @Body() body: ClubPayload) {
    return this.clubsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除俱乐部' })
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }
}

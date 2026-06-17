import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClubsService } from './clubs.service.js';
import type { ClubHonorListQuery, ClubListQuery } from './clubs.types.js';

@ApiTags('clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  @ApiOperation({ summary: '获取俱乐部列表' })
  findAll(@Query() query: ClubListQuery) {
    return this.clubsService.findAll(query);
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
}

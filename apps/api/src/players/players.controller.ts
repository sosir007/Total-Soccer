import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayersService } from './players.service.js';
import type { PlayerListQuery, PlayerPayload } from './players.types.js';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: '获取球员列表' })
  findAll(@Query() query: PlayerListQuery) {
    return this.playersService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增球员' })
  create(@Body() body: PlayerPayload) {
    return this.playersService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取球员详情' })
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑球员' })
  update(@Param('id') id: string, @Body() body: PlayerPayload) {
    return this.playersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除球员' })
  remove(@Param('id') id: string) {
    return this.playersService.remove(id);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayersService } from './players.service.js';
import type { PlayerListQuery } from './players.types.js';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: '获取球员列表' })
  findAll(@Query() query: PlayerListQuery) {
    return this.playersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取球员详情' })
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }
}

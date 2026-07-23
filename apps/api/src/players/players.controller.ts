import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayersService } from './players.service.js';
import type {
  PlayerAwardRecipientPayload,
  PlayerListQuery,
  PlayerPayload,
  PlayerTeamHonorPayload,
  SavePlayerAwardRecipientGroupBody,
  SavePlayerCareersBody,
  TeamHonorStandingOptionQuery
} from './players.types.js';

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

  @Get('team-honor-standings')
  @ApiOperation({ summary: '查询可关联的球队或国家队荣誉结果' })
  findTeamHonorStandingOptions(@Query() query: TeamHonorStandingOptionQuery) {
    return this.playersService.findTeamHonorStandingOptions(query);
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

  @Put(':id/careers')
  @ApiOperation({ summary: '保存球员结构化经历' })
  saveCareers(@Param('id') id: string, @Body() body: SavePlayerCareersBody) {
    return this.playersService.saveCareers(id, body);
  }

  @Post(':id/award-recipients')
  @ApiOperation({ summary: '新增或更新球员个人奖项记录' })
  createAwardRecipient(@Param('id') id: string, @Body() body: PlayerAwardRecipientPayload) {
    return this.playersService.createAwardRecipient(id, body);
  }

  @Put(':id/award-recipient-groups')
  @ApiOperation({ summary: '按奖项批量保存球员个人奖项记录' })
  saveAwardRecipientGroup(
    @Param('id') id: string,
    @Body() body: SavePlayerAwardRecipientGroupBody
  ) {
    return this.playersService.saveAwardRecipientGroup(id, body);
  }

  @Put(':id/award-recipients/:recipientId')
  @ApiOperation({ summary: '编辑球员个人奖项记录' })
  updateAwardRecipient(
    @Param('id') id: string,
    @Param('recipientId') recipientId: string,
    @Body() body: PlayerAwardRecipientPayload
  ) {
    return this.playersService.updateAwardRecipient(id, recipientId, body);
  }

  @Delete(':id/award-recipients/:recipientId')
  @ApiOperation({ summary: '删除球员个人奖项记录' })
  removeAwardRecipient(@Param('id') id: string, @Param('recipientId') recipientId: string) {
    return this.playersService.removeAwardRecipient(id, recipientId);
  }

  @Get(':id/team-honors')
  @ApiOperation({ summary: '获取球员关联团队荣誉' })
  findTeamHonors(@Param('id') id: string) {
    return this.playersService.findTeamHonors(id);
  }

  @Post(':id/team-honors')
  @ApiOperation({ summary: '新增或更新球员关联团队荣誉' })
  createTeamHonor(@Param('id') id: string, @Body() body: PlayerTeamHonorPayload) {
    return this.playersService.createTeamHonor(id, body);
  }

  @Put(':id/team-honors/:honorId')
  @ApiOperation({ summary: '编辑球员关联团队荣誉' })
  updateTeamHonor(
    @Param('id') id: string,
    @Param('honorId') honorId: string,
    @Body() body: PlayerTeamHonorPayload
  ) {
    return this.playersService.updateTeamHonor(id, honorId, body);
  }

  @Delete(':id/team-honors/:honorId')
  @ApiOperation({ summary: '删除球员关联团队荣誉' })
  removeTeamHonor(@Param('id') id: string, @Param('honorId') honorId: string) {
    return this.playersService.removeTeamHonor(id, honorId);
  }
}

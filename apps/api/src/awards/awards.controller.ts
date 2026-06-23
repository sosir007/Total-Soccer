import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AwardsService } from './awards.service.js';
import type {
  AwardListQuery,
  AwardRecipientListQuery,
  CreateAwardBody,
  CreateAwardEditionBody,
  SaveAwardRecipientsBody,
  UpdateAwardBody,
  UpdateAwardEditionBody
} from './awards.types.js';

@ApiTags('awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  @ApiOperation({ summary: '获取奖项列表' })
  findAll(@Query() query: AwardListQuery) {
    return this.awardsService.findAll(query);
  }

  @Get('recipients')
  @ApiOperation({ summary: '获取奖项获奖人列表' })
  findRecipients(@Query() query: AwardRecipientListQuery) {
    return this.awardsService.findRecipients(query);
  }

  @Post()
  @ApiOperation({ summary: '创建奖项' })
  create(@Body() body: CreateAwardBody) {
    return this.awardsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取奖项详情' })
  findOne(@Param('id') id: string) {
    return this.awardsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑奖项' })
  update(@Param('id') id: string, @Body() body: UpdateAwardBody) {
    return this.awardsService.update(id, body);
  }

  @Post(':id/editions')
  @ApiOperation({ summary: '新增奖项年份或届次' })
  createEdition(@Param('id') id: string, @Body() body: CreateAwardEditionBody) {
    return this.awardsService.createEdition(id, body);
  }
}

@ApiTags('award-editions')
@Controller('award-editions')
export class AwardEditionsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Put(':id')
  @ApiOperation({ summary: '编辑奖项年份或届次' })
  updateEdition(@Param('id') id: string, @Body() body: UpdateAwardEditionBody) {
    return this.awardsService.updateEdition(id, body);
  }

  @Put(':id/recipients')
  @ApiOperation({ summary: '保存奖项获奖人' })
  saveRecipients(@Param('id') id: string, @Body() body: SaveAwardRecipientsBody) {
    return this.awardsService.saveRecipients(id, body);
  }
}

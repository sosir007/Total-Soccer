import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompetitionsService } from './competitions.service.js';
import type {
  CompetitionListQuery,
  CreateCompetitionBody,
  CreateCompetitionEditionBody,
  SaveCompetitionStandingsBody,
  UpdateCompetitionBody,
  UpdateCompetitionEditionBody
} from './competitions.types.js';

@ApiTags('competitions')
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Get()
  @ApiOperation({ summary: '获取赛事列表' })
  findAll(@Query() query: CompetitionListQuery) {
    return this.competitionsService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '创建赛事' })
  create(@Body() body: CreateCompetitionBody) {
    return this.competitionsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取赛事详情' })
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑赛事' })
  update(@Param('id') id: string, @Body() body: UpdateCompetitionBody) {
    return this.competitionsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除赛事' })
  remove(@Param('id') id: string) {
    return this.competitionsService.remove(id);
  }

  @Post(':id/editions')
  @ApiOperation({ summary: '新增赛事届次或赛季' })
  createEdition(@Param('id') id: string, @Body() body: CreateCompetitionEditionBody) {
    return this.competitionsService.createEdition(id, body);
  }
}

@ApiTags('competition-editions')
@Controller('competition-editions')
export class CompetitionEditionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Put(':id')
  @ApiOperation({ summary: '编辑赛事届次或赛季' })
  updateEdition(@Param('id') id: string, @Body() body: UpdateCompetitionEditionBody) {
    return this.competitionsService.updateEdition(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除赛事届次或赛季' })
  removeEdition(@Param('id') id: string) {
    return this.competitionsService.removeEdition(id);
  }

  @Put(':id/standings')
  @ApiOperation({ summary: '保存赛事届次名次结果' })
  saveStandings(@Param('id') id: string, @Body() body: SaveCompetitionStandingsBody) {
    return this.competitionsService.saveStandings(id, body);
  }
}

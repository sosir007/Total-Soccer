import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service.js';
import type {
  CountryHonorListQuery,
  CountryHonorSummaryQuery,
  CountryListQuery,
  CountryPayload
} from './countries.types.js';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: '获取国家列表' })
  findAll(@Query() query: CountryListQuery) {
    return this.countriesService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增国家' })
  create(@Body() body: CountryPayload) {
    return this.countriesService.create(body);
  }

  @Get('honors/summary')
  @ApiOperation({ summary: '获取国家队荣誉汇总矩阵' })
  findHonorSummary(@Query() query: CountryHonorSummaryQuery) {
    return this.countriesService.findHonorSummary(query);
  }

  @Get('honors')
  @ApiOperation({ summary: '获取国家队荣誉列表' })
  findHonors(@Query() query: CountryHonorListQuery) {
    return this.countriesService.findHonors(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取国家详情' })
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑国家' })
  update(@Param('id') id: string, @Body() body: CountryPayload) {
    return this.countriesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除国家' })
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}

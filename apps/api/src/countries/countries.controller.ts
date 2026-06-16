import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service.js';
import type { CountryListQuery } from './countries.types.js';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: '获取国家列表' })
  findAll(@Query() query: CountryListQuery) {
    return this.countriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取国家详情' })
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }
}

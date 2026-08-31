import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  CENTRAL_EUROPEAN_INTERNATIONAL_CUP_RESULTS,
  HISTORICAL_COUNTRIES,
  REQUIRED_COUNTRIES
} from '../../../../data/competition-results/national-team/global/central-european-international-cup.js';

const prisma = new PrismaClient();

function getCentralEuropeanInternationalCupEditionUrl(season: string) {
  return `https://en.wikipedia.org/wiki/${season.replace('-', '%E2%80%93')}_Central_European_International_Cup`;
}

function getResultSeason(season: string | null | undefined) {
  if (!season) {
    throw new Error(
      'Central European International Cup edition season is required to build external URL.'
    );
  }

  return season;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    historicalCountries: HISTORICAL_COUNTRIES,
    competition: {
      code: 'CENTRAL_EUROPEAN_INTERNATIONAL_CUP',
      create: {
        code: 'CENTRAL_EUROPEAN_INTERNATIONAL_CUP',
        name: '中欧国际杯',
        englishName: 'Central European International Cup',
        shortName: '中欧国际杯',
        alias: '欧洲国际杯、什韦拉杯、格罗杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Central_European_International_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '早期中欧成年国家队长期主客场循环赛事，1927 年创办，1960 年欧洲杯创办后停办；本系统按国家队其他二级杯赛计分。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-27T00:00:00.000Z'),
        dataRemark:
          '职业国家队正赛五届完赛记录已完整录入；1936-37 届中止及同期业余组赛事不建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 72
      },
      update: {
        name: '中欧国际杯',
        englishName: 'Central European International Cup',
        shortName: '中欧国际杯',
        alias: '欧洲国际杯、什韦拉杯、格罗杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Central_European_International_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '早期中欧成年国家队长期主客场循环赛事，1927 年创办，1960 年欧洲杯创办后停办；本系统按国家队其他二级杯赛计分。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-27T00:00:00.000Z'),
        dataRemark:
          '职业国家队正赛五届完赛记录已完整录入；1936-37 届中止及同期业余组赛事不建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 72
      }
    },
    editions: withStandingMode(
      CENTRAL_EUROPEAN_INTERNATIONAL_CUP_RESULTS.map((result) => ({
        ...result,
        externalUrl: getCentralEuropeanInternationalCupEditionUrl(getResultSeason(result.season))
      }))
    ),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 5,
      standings: 15
    },
    completedMessage: 'Central European International Cup seed completed.'
  });
}

void runSeed(prisma, main);

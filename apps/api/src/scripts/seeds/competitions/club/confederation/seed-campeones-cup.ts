import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildCampeonesCupStandings,
  CAMPEONES_CUP_REQUIRED_CLUBS,
  CAMPEONES_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/campeones-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['加拿大', '墨西哥', '美国']),
    clubs: CAMPEONES_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'CAMPEONES_CUP',
      create: {
        code: 'CAMPEONES_CUP',
        name: '冠军杯',
        englishName: 'Campeones Cup',
        shortName: '冠军杯',
        alias: 'Campeones Cup、北美冠军对抗杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Campeones_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          'MLS Cup 冠军与 Liga MX Campeón de Campeones 冠军之间的年度单场跨联赛冠军对抗赛；本系统按俱乐部其他二级杯赛处理。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-08T00:00:00.000Z'),
        dataRemark:
          '录入 2018、2019、2021 至 2025 年冠亚军；2020 年因 COVID-19 疫情未举办，不创建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20005
      },
      update: {
        name: '冠军杯',
        englishName: 'Campeones Cup',
        shortName: '冠军杯',
        alias: 'Campeones Cup、北美冠军对抗杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Campeones_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          'MLS Cup 冠军与 Liga MX Campeón de Campeones 冠军之间的年度单场跨联赛冠军对抗赛；本系统按俱乐部其他二级杯赛处理。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-08T00:00:00.000Z'),
        dataRemark:
          '录入 2018、2019、2021 至 2025 年冠亚军；2020 年因 COVID-19 疫情未举办，不创建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20005
      }
    },
    scope: {
      countryNames: ['加拿大', '墨西哥', '美国']
    },
    editions: withStandingMode(CAMPEONES_CUP_RESULTS),
    buildStandings: buildCampeonesCupStandings,
    expected: {
      editions: 7,
      standings: 14
    },
    completedMessage: 'Campeones Cup seed completed.'
  });
}

void runSeed(prisma, main);

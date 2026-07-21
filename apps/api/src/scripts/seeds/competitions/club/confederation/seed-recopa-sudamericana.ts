import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildRecopaSudamericanaStandings,
  RECOPA_SUDAMERICANA_REQUIRED_CLUBS,
  RECOPA_SUDAMERICANA_RESULTS
} from '../../../../data/competition-results/club/confederation/recopa-sudamericana.js';

const prisma = new PrismaClient();

function getRecopaSudamericanaEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Recopa_Sudamericana`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Recopa Sudamericana edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries([
      '阿根廷',
      '巴西',
      '智利',
      '哥伦比亚',
      '厄瓜多尔',
      '墨西哥',
      '巴拉圭',
      '秘鲁',
      '乌拉圭'
    ]),
    clubs: RECOPA_SUDAMERICANA_REQUIRED_CLUBS,
    competition: {
      code: 'RECOPA_SUDAMERICANA',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'RECOPA_SUDAMERICANA',
        name: '南美优胜者杯',
        alias: '南美超级杯、南美足联超级杯、Recopa Sudamericana',
        externalUrl: 'https://en.wikipedia.org/wiki/Recopa_Sudamericana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description: '南美足联超级杯性质赛事，通常由南美解放者杯冠军对阵南美杯冠军。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 64
      },
      update: {
        name: '南美优胜者杯',
        alias: '南美超级杯、南美足联超级杯、Recopa Sudamericana',
        externalUrl: 'https://en.wikipedia.org/wiki/Recopa_Sudamericana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description: '南美足联超级杯性质赛事，通常由南美解放者杯冠军对阵南美杯冠军。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 64
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: RECOPA_SUDAMERICANA_RESULTS.map((result) => ({
      ...result,
      externalUrl: getRecopaSudamericanaEditionUrl(getResultYear(result.year))
    })),
    buildStandings: buildRecopaSudamericanaStandings,
    expected: {
      editions: 34,
      standings: 67
    },
    allowPartialStandings: true,
    completedMessage: 'Recopa Sudamericana seed completed.'
  });
}

void runSeed(prisma, main);

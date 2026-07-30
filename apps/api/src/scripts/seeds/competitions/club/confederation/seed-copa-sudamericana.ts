import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildCopaSudamericanaStandings,
  COPA_SUDAMERICANA_REQUIRED_CLUBS,
  COPA_SUDAMERICANA_RESULTS
} from '../../../../data/competition-results/club/confederation/copa-sudamericana.js';

const prisma = new PrismaClient();

function getCopaSudamericanaEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Copa_Sudamericana`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Copa Sudamericana edition year is required to build external URL.');
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
      '秘鲁'
    ]),
    clubs: COPA_SUDAMERICANA_REQUIRED_CLUBS,
    competition: {
      code: 'COPA_SUDAMERICANA',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'COPA_SUDAMERICANA',
        name: '南美杯',
        englishName: 'Copa Sudamericana',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Sudamericana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '南美足联现行二级俱乐部洲际杯赛，2002 年创办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 62
      },
      update: {
        name: '南美杯',
        englishName: 'Copa Sudamericana',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Sudamericana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '南美足联现行二级俱乐部洲际杯赛，2002 年创办。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 62
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: COPA_SUDAMERICANA_RESULTS.map((result) => ({
      ...result,
      externalUrl: getCopaSudamericanaEditionUrl(getResultYear(result.year))
    })),
    buildStandings: buildCopaSudamericanaStandings,
    expected: {
      editions: 24,
      standings: 38
    },
    allowPartialStandings: true,
    completedMessage: 'Copa Sudamericana seed completed.'
  });
}

void runSeed(prisma, main);

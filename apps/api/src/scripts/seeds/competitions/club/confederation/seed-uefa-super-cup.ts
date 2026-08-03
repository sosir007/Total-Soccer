import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import {
  runCompetitionSeed,
  runSeed,
  type SeedEdition
} from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildUefaSuperCupStandings,
  UEFA_SUPER_CUP_REQUIRED_CLUBS,
  UEFA_SUPER_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/uefa-super-cup.js';

const prisma = new PrismaClient();

function getSuperCupEditionUrl(result: SeedEdition) {
  const year = getResultYear(result.year);

  return `https://en.wikipedia.org/wiki/${year}_UEFA_Super_Cup`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('UEFA Super Cup edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: [
      ...pickSeedCountries([
        '比利时',
        '英格兰',
        '法国',
        '德国',
        '意大利',
        '荷兰',
        '葡萄牙',
        '俄罗斯',
        '塞尔维亚',
        '西班牙',
        '土耳其'
      ]),
      { uid: '800', name: '乌克兰', confederationCode: 'UEFA' },
      { uid: '793', name: '苏格兰', confederationCode: 'UEFA' },
      { uid: '790', name: '罗马尼亚', confederationCode: 'UEFA' }
    ],
    clubs: UEFA_SUPER_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'UEFA_SUPER_CUP',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'UEFA_SUPER_CUP',
        name: '欧洲超级杯',
        englishName: 'UEFA Super Cup',
        shortName: '欧超杯',
        alias: '欧足联超级杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Super_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description: '欧足联超级杯赛事，1973 年创办，冠军为欧冠冠军与欧联冠军之间的对决结果。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 33
      },
      update: {
        name: '欧洲超级杯',
        englishName: 'UEFA Super Cup',
        shortName: '欧超杯',
        alias: '欧足联超级杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Super_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description: '欧足联超级杯赛事，1973 年创办，冠军为欧冠冠军与欧联冠军之间的对决结果。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 33
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    editions: withStandingMode(
      UEFA_SUPER_CUP_RESULTS.map((result) => ({
        ...result,
        externalUrl: getSuperCupEditionUrl(result)
      }))
    ),
    buildStandings: buildUefaSuperCupStandings,
    expected: {
      editions: 50,
      standings: 100
    },
    completedMessage: 'UEFA Super Cup seed completed.'
  });
}

void runSeed(prisma, main);

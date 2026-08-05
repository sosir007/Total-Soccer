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
import { pickSeedCountries, CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  buildLatinCupStandings,
  LATIN_CUP_REQUIRED_CLUBS,
  LATIN_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/latin-cup.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';

const prisma = new PrismaClient();

function getLatinCupEditionUrl(result: SeedEdition) {
  if (result.year === undefined) {
    throw new Error('Latin Cup edition year is required to build external URL.');
  }

  return `https://en.wikipedia.org/wiki/${result.year}_Latin_Cup`;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['法国', '意大利', '葡萄牙', '西班牙']),
    clubs: LATIN_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'LATIN_CUP',
      create: {
        code: 'LATIN_CUP',
        name: '拉丁杯',
        englishName: 'Latin Cup',
        shortName: '拉丁杯',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Latin_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          '1949 至 1957 年举办的欧洲拉丁国家俱乐部四强赛，由法国、意大利、西班牙和葡萄牙联赛冠军参加，赛事已停办。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 20000
      },
      update: {
        name: '拉丁杯',
        englishName: 'Latin Cup',
        shortName: '拉丁杯',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Latin_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          '1949 至 1957 年举办的欧洲拉丁国家俱乐部四强赛，由法国、意大利、西班牙和葡萄牙联赛冠军参加，赛事已停办。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 20000
      }
    },
    editions: withStandingMode(
      LATIN_CUP_RESULTS.map((result) => ({
        ...result,
        externalUrl: getLatinCupEditionUrl(result)
      }))
    ),
    buildStandings: buildLatinCupStandings,
    expected: {
      editions: 8,
      standings: 32
    },
    allowPartialStandings: true,
    completedMessage: 'Latin Cup seed completed.'
  });
}

void runSeed(prisma, main);

import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildCopaInteramericanaStandings,
  COPA_INTERAMERICANA_REQUIRED_CLUBS,
  COPA_INTERAMERICANA_RESULTS
} from '../../../../data/competition-results/club/global/copa-interamericana.js';

const prisma = new PrismaClient();

function getCopaInteramericanaEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Copa_Interamericana`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Copa Interamericana edition year is required to build external URL.');
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
      '哥斯达黎加',
      '墨西哥',
      '巴拉圭',
      '美国',
      '乌拉圭'
    ]),
    clubs: COPA_INTERAMERICANA_REQUIRED_CLUBS,
    competition: {
      code: 'COPA_INTERAMERICANA',
      create: {
        code: 'COPA_INTERAMERICANA',
        name: '美洲洲际杯',
        englishName: 'Copa Interamericana',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Interamericana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '四级',
        format: '杯赛',
        description:
          '南美解放者杯冠军与中北美冠军杯冠军之间的跨足联俱乐部赛事，举办于 1969 至 1998 年。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 4
      },
      update: {
        name: '美洲洲际杯',
        englishName: 'Copa Interamericana',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Interamericana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '四级',
        format: '杯赛',
        description:
          '南美解放者杯冠军与中北美冠军杯冠军之间的跨足联俱乐部赛事，举办于 1969 至 1998 年。',
        confederationId: null,
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 4
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL', 'CONCACAF']
    },
    editions: COPA_INTERAMERICANA_RESULTS.map((result) => ({
      ...result,
      externalUrl: getCopaInteramericanaEditionUrl(getResultYear(result.year))
    })),
    buildStandings: buildCopaInteramericanaStandings,
    expected: {
      editions: 18,
      standings: 26
    },
    allowPartialStandings: true,
    completedMessage: 'Copa Interamericana seed completed.'
  });
}

void runSeed(prisma, main);

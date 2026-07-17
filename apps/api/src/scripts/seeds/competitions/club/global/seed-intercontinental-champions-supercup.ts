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
  buildIntercontinentalChampionsSupercupStandings,
  INTERCONTINENTAL_CHAMPIONS_SUPERCUP_REQUIRED_CLUBS,
  INTERCONTINENTAL_CHAMPIONS_SUPERCUP_RESULTS
} from '../../../../data/competition-results/club/global/intercontinental-champions-supercup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷', '巴西', '意大利', '乌拉圭']),
    clubs: INTERCONTINENTAL_CHAMPIONS_SUPERCUP_REQUIRED_CLUBS,
    competition: {
      code: 'INTERCONTINENTAL_CHAMPIONS_SUPERCUP',
      create: {
        code: 'INTERCONTINENTAL_CHAMPIONS_SUPERCUP',
        name: '洲际冠军超级杯',
        alias: '洲际超级杯、Recopa Intercontinental',
        externalUrl: 'https://en.wikipedia.org/wiki/Intercontinental_Champions%27_Supercup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '四级',
        format: '杯赛',
        description:
          '由旧洲际杯历届冠军参加的短期历史赛事，1968 届为跨洲冠军杯，1969 届仅完成南美区比赛。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 3
      },
      update: {
        name: '洲际冠军超级杯',
        alias: '洲际超级杯、Recopa Intercontinental',
        externalUrl: 'https://en.wikipedia.org/wiki/Intercontinental_Champions%27_Supercup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '四级',
        format: '杯赛',
        description:
          '由旧洲际杯历届冠军参加的短期历史赛事，1968 届为跨洲冠军杯，1969 届仅完成南美区比赛。',
        confederationId: null,
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 3
      }
    },
    editions: withStandingMode(INTERCONTINENTAL_CHAMPIONS_SUPERCUP_RESULTS),
    buildStandings: buildIntercontinentalChampionsSupercupStandings,
    expected: {
      editions: 2,
      standings: 4
    },
    completedMessage: "Intercontinental Champions' Supercup seed completed."
  });
}

void runSeed(prisma, main);

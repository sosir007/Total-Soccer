import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildFifaIntercontinentalCupStandings,
  FIFA_INTERCONTINENTAL_CUP_REQUIRED_CLUBS,
  FIFA_INTERCONTINENTAL_CUP_RESULTS
} from '../../../../data/competition-results/club/global/fifa-intercontinental-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['西班牙', '墨西哥', '法国', '巴西']),
    clubs: FIFA_INTERCONTINENTAL_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'FIFA_INTERCONTINENTAL_CUP',
      create: {
        code: 'FIFA_INTERCONTINENTAL_CUP',
        name: '国际足联洲际杯',
        alias: '洲际杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Intercontinental_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '二级',
        format: '杯赛',
        description: '国际足联主办的年度俱乐部世界冠军赛事，2024 年起由各足联冠军参与。',
        enabled: true,
        includeInStats: true,
        sortOrder: 1
      },
      update: {
        name: '国际足联洲际杯',
        alias: '洲际杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Intercontinental_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '二级',
        format: '杯赛',
        description: '国际足联主办的年度俱乐部世界冠军赛事，2024 年起由各足联冠军参与。',
        confederationId: null,
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 1
      }
    },
    editions: withStandingMode(FIFA_INTERCONTINENTAL_CUP_RESULTS),
    buildStandings: buildFifaIntercontinentalCupStandings,
    expected: {
      editions: 2,
      standings: 4
    },
    completedMessage: 'FIFA Intercontinental Cup seed completed.'
  });
}

void runSeed(prisma, main);

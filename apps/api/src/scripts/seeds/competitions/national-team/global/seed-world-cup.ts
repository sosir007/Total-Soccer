import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  type TopFourCompetitionResult
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  COUNTRIES,
  HISTORICAL_COUNTRIES,
  WORLD_CUP_RESULTS
} from '../../../../data/competition-results/national-team/global/world-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: COUNTRIES,
    historicalCountries: HISTORICAL_COUNTRIES,
    competition: {
      code: 'FIFA_WORLD_CUP',
      create: {
        code: 'FIFA_WORLD_CUP',
        name: '国际足联世界杯',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '一级',
        format: '其他',
        description: '国际足联主办的男子国家队最高级别赛事。',
        enabled: true,
        includeInStats: true,
        sortOrder: 0
      },
      update: {
        name: '国际足联世界杯',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '一级',
        format: '其他',
        enabled: true,
        includeInStats: true,
        sortOrder: 0
      }
    },
    editions: WORLD_CUP_RESULTS.map<TopFourCompetitionResult>(
      ([yearText, host, champion, runnerUp, thirdPlace, fourthPlace, quantity]) => ({
        year: Number(yearText),
        host,
        quantity,
        champion,
        runnerUp,
        thirdPlace,
        fourthPlace
      })
    ),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 22,
      standings: 88
    },
    completedMessage: 'World Cup seed completed.'
  });
}

void runSeed(prisma, main);

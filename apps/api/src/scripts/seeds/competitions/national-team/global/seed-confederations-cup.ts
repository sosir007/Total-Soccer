import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { buildCompetitionResultStandings } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  REQUIRED_COUNTRIES,
  CONFEDERATIONS_CUP_RESULTS
} from '../../../../data/competition-results/national-team/global/confederations-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    competition: {
      code: 'FIFA_CONFEDERATIONS_CUP',
      create: {
        code: 'FIFA_CONFEDERATIONS_CUP',
        name: '国际足联联合会杯',
        alias: '联合会杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '二级',
        format: '杯赛',
        description: '国际足联主办的国家队洲际冠军邀请赛，前身为法赫德国王杯，2017 年后停办。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 1
      },
      update: {
        name: '国际足联联合会杯',
        alias: '联合会杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '二级',
        format: '杯赛',
        description: '国际足联主办的国家队洲际冠军邀请赛，前身为法赫德国王杯，2017 年后停办。',
        confederationId: null,
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 1
      }
    },
    editions: CONFEDERATIONS_CUP_RESULTS,
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 10,
      standings: 40
    },
    completedMessage: 'FIFA Confederations Cup seed completed.'
  });
}

void runSeed(prisma, main);

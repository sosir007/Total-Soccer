import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { GERMAN_SUPER_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/german-super-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['德国']),
    competition: {
      code: 'GERMAN_SUPER_CUP',
      primaryCountryName: '德国',
      create: {
        code: 'GERMAN_SUPER_CUP',
        name: '德国超级杯',
        englishName: 'Franz Beckenbauer Supercup',
        shortName: '德超杯',
        alias: 'DFB-Supercup、DFL-Supercup',
        externalUrl: 'https://en.wikipedia.org/wiki/Franz_Beckenbauer_Supercup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '德国国内超级杯赛事，1987-1996 为 DFB-Supercup，2010-2026 为 DFL-Supercup / Franz Beckenbauer Supercup。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '1987-1996、2010-2026 已录；2008-2009 非正式届次不纳入。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      },
      update: {
        name: '德国超级杯',
        englishName: 'Franz Beckenbauer Supercup',
        shortName: '德超杯',
        alias: 'DFB-Supercup、DFL-Supercup',
        externalUrl: 'https://en.wikipedia.org/wiki/Franz_Beckenbauer_Supercup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '德国国内超级杯赛事，1987-1996 为 DFB-Supercup，2010-2026 为 DFL-Supercup / Franz Beckenbauer Supercup。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '1987-1996、2010-2026 已录；2008-2009 非正式届次不纳入。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      }
    },
    scope: {
      countryNames: ['德国']
    },
    editions: GERMAN_SUPER_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'German Super Cup seed completed.'
  });
}

void runSeed(prisma, main);

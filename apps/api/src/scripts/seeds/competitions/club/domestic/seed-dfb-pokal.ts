import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { DFB_POKAL_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/dfb-pokal.js';
import { DFB_POKAL_RESULTS } from '../../../../data/competition-results/club/domestic/dfb-pokal.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['德国', '奥地利']),
    clubs: DFB_POKAL_REQUIRED_CLUBS,
    competition: {
      code: 'DFB_POKAL',
      primaryCountryName: '德国',
      create: {
        code: 'DFB_POKAL',
        name: '德国足协杯',
        englishName: 'DFB-Pokal',
        shortName: '德国杯',
        alias: 'DFB杯',
        externalUrl: 'https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/statistik/bisherige-sieger',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description:
          '德国全国性国内杯赛，自 1934-35 赛季起举办；前身 Tschammer-Pokal 已并入同一历史口径。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      },
      update: {
        name: '德国足协杯',
        englishName: 'DFB-Pokal',
        shortName: '德国杯',
        alias: 'DFB杯',
        externalUrl: 'https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/statistik/bisherige-sieger',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description:
          '德国全国性国内杯赛，自 1934-35 赛季起举办；前身 Tschammer-Pokal 已并入同一历史口径。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      }
    },
    scope: {
      countryNames: ['德国']
    },
    editions: DFB_POKAL_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: DFB_POKAL_RESULTS.length,
      standings: 0
    },
    allowPartialStandings: true,
    completedMessage: 'DFB-Pokal seed completed.'
  });
}

void runSeed(prisma, main);

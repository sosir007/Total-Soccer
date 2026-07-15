import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { BRAZIL_SERIE_B_RESULTS } from '../../../../data/competition-results/club/domestic/brazil-serie-b.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['巴西']),
    competition: {
      code: 'BRAZIL_SERIE_B',
      primaryCountryName: '巴西',
      create: {
        code: 'BRAZIL_SERIE_B',
        name: '巴西乙级联赛',
        alias: '巴乙',
        externalUrl: 'https://en.wikipedia.org/wiki/Campeonato_Brasileiro_S%C3%A9rie_B',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description: '巴西全国第二级别职业联赛，按官方认可赛季统一纳入巴乙赛事体系。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16520
      },
      update: {
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16520
      }
    },
    scope: {
      countryNames: ['巴西']
    },
    editions: BRAZIL_SERIE_B_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Brazil Serie B seed completed.'
  });
}

void runSeed(prisma, main);

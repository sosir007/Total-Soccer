import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { BRAZIL_SERIE_A_RESULTS } from '../../../../data/competition-results/club/domestic/brazil-serie-a.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['巴西']),
    competition: {
      code: 'BRAZIL_SERIE_A',
      primaryCountryName: '巴西',
      create: {
        code: 'BRAZIL_SERIE_A',
        name: '巴西甲级联赛',
        alias: '巴甲、Campeonato Brasileiro Serie A、Brasileirao',
        externalUrl: 'https://en.wikipedia.org/wiki/Campeonato_Brasileiro_S%C3%A9rie_A',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description:
          '按 CBF 官方承认的全国冠军统一口径整合的巴西顶级联赛，涵盖 1937、Taça Brasil、Roberto Gomes Pedrosa / Taça de Prata 及 1971 年后的 Campeonato Brasileiro。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16510
      },
      update: {
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16510
      }
    },
    scope: {
      countryNames: ['巴西']
    },
    editions: BRAZIL_SERIE_A_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Brazil Serie A seed completed.'
  });
}

void runSeed(prisma, main);

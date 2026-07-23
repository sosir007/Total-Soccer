import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { CAMPEONATO_PAULISTA_RESULTS } from '../../../../data/competition-results/club/domestic/campeonato-paulista.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['巴西']),
    competition: {
      code: 'CAMPEONATO_PAULISTA',
      primaryCountryName: '巴西',
      create: {
        code: 'CAMPEONATO_PAULISTA',
        name: '保利斯塔锦标赛',
        alias: '圣保罗州锦标赛、Paulistão',
        externalUrl: 'https://en.wikipedia.org/wiki/Campeonato_Paulista',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '巴西圣保罗州级顶级联赛；因巴西州级赛事历史权重较高，系统暂按俱乐部国内二级联赛计分。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16518
      },
      update: {
        name: '保利斯塔锦标赛',
        alias: '圣保罗州锦标赛、Paulistão',
        externalUrl: 'https://en.wikipedia.org/wiki/Campeonato_Paulista',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '巴西圣保罗州级顶级联赛；因巴西州级赛事历史权重较高，系统暂按俱乐部国内二级联赛计分。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16518
      }
    },
    scope: {
      countryNames: ['巴西']
    },
    editions: CAMPEONATO_PAULISTA_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Campeonato Paulista seed completed.'
  });
}

void runSeed(prisma, main);

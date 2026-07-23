import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { TORNEIO_RIO_SAO_PAULO_RESULTS } from '../../../../data/competition-results/club/domestic/torneio-rio-sao-paulo.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['巴西']),
    competition: {
      code: 'TORNEIO_RIO_SAO_PAULO',
      primaryCountryName: '巴西',
      create: {
        code: 'TORNEIO_RIO_SAO_PAULO',
        name: '里约-圣保罗锦标赛',
        alias: 'Torneio Rio-São Paulo、Rio-São Paulo Tournament',
        externalUrl: 'https://en.wikipedia.org/wiki/Torneio_Rio_%E2%80%93_S%C3%A3o_Paulo',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '巴西历史跨州地区杯赛，由里约热内卢州和圣保罗州俱乐部参加；系统暂按俱乐部国内三级杯赛计分。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 16519
      },
      update: {
        name: '里约-圣保罗锦标赛',
        alias: 'Torneio Rio-São Paulo、Rio-São Paulo Tournament',
        externalUrl: 'https://en.wikipedia.org/wiki/Torneio_Rio_%E2%80%93_S%C3%A3o_Paulo',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '巴西历史跨州地区杯赛，由里约热内卢州和圣保罗州俱乐部参加；系统暂按俱乐部国内三级杯赛计分。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 16519
      }
    },
    scope: {
      countryNames: ['巴西']
    },
    editions: TORNEIO_RIO_SAO_PAULO_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Torneio Rio-Sao Paulo seed completed.'
  });
}

void runSeed(prisma, main);

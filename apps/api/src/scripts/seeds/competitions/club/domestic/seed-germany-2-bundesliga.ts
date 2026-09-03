import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { GERMANY_2_BUNDESLIGA_RESULTS } from '../../../../data/competition-results/club/domestic/germany-2-bundesliga.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['德国']),
    competition: {
      code: 'GERMANY_2_BUNDESLIGA',
      primaryCountryName: '德国',
      create: {
        code: 'GERMANY_2_BUNDESLIGA',
        name: '德国足球乙级联赛',
        englishName: '2. Bundesliga',
        shortName: '德乙',
        alias: '德国乙级联赛、Bundesliga 2、Zweite Bundesliga',
        externalUrl: 'https://en.wikipedia.org/wiki/2._Bundesliga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '德国第二级职业足球联赛，自 1974-75 赛季创办；1974-81 和 1991-92 为南北分区赛季。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '1974-75 至 2025-26 已按当前库内俱乐部录入；分区赛季按北/南区分别建届并按 1/2 分摊冠军分，库外球队留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      },
      update: {
        name: '德国足球乙级联赛',
        englishName: '2. Bundesliga',
        shortName: '德乙',
        alias: '德国乙级联赛、Bundesliga 2、Zweite Bundesliga',
        externalUrl: 'https://en.wikipedia.org/wiki/2._Bundesliga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '德国第二级职业足球联赛，自 1974-75 赛季创办；1974-81 和 1991-92 为南北分区赛季。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '1974-75 至 2025-26 已按当前库内俱乐部录入；分区赛季按北/南区分别建届并按 1/2 分摊冠军分，库外球队留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      }
    },
    scope: {
      countryNames: ['德国']
    },
    editions: GERMANY_2_BUNDESLIGA_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Germany 2. Bundesliga seed completed.'
  });
}

void runSeed(prisma, main);

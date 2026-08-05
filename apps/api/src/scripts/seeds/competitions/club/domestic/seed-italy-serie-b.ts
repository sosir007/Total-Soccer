import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ITALY_SERIE_B_RESULTS } from '../../../../data/competition-results/club/domestic/italy-serie-b.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['意大利']),
    competition: {
      code: 'ITALY_SERIE_B',
      primaryCountryName: '意大利',
      create: {
        code: 'ITALY_SERIE_B',
        name: '意大利足球乙级联赛',
        englishName: 'Serie B',
        shortName: '意乙',
        alias: '意大利乙级联赛、Serie BKT',
        externalUrl: 'https://en.wikipedia.org/wiki/Serie_B',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '意大利第二级职业足球联赛，自 1929-30 赛季起以 Serie B 名义运行；项目口径纳入 1922-1928 年第二级别前身赛事。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7761
      },
      update: {
        name: '意大利足球乙级联赛',
        englishName: 'Serie B',
        shortName: '意乙',
        alias: '意大利乙级联赛、Serie BKT',
        externalUrl: 'https://en.wikipedia.org/wiki/Serie_B',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '意大利第二级职业足球联赛，自 1929-30 赛季起以 Serie B 名义运行；项目口径纳入 1922-1928 年第二级别前身赛事。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7761
      }
    },
    scope: {
      countryNames: ['意大利']
    },
    editions: ITALY_SERIE_B_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Italy Serie B seed completed.'
  });
}

void runSeed(prisma, main);

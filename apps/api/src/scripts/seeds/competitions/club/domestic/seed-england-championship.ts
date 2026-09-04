import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ENGLAND_CHAMPIONSHIP_RESULTS } from '../../../../data/competition-results/club/domestic/england-championship.js';
import { ENGLAND_CHAMPIONSHIP_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/england-championship.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰', '威尔士']),
    clubs: ENGLAND_CHAMPIONSHIP_REQUIRED_CLUBS,
    competition: {
      code: 'ENGLAND_CHAMPIONSHIP',
      primaryCountryName: '英格兰',
      create: {
        code: 'ENGLAND_CHAMPIONSHIP',
        name: '英格兰足球冠军联赛',
        englishName: 'EFL Championship',
        shortName: '英冠',
        alias: '英格兰第二级别联赛、Football League First Division、Football League Championship',
        externalUrl: 'https://en.wikipedia.org/wiki/EFL_Championship',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '英格兰第二级别职业足球联赛；1992-93 至 2003-04 为 Football League First Division，2004-05 起为 Championship / EFL Championship。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '1992-93 至 2024-25 已按最终联赛前三名录入；2025-26 最终名次待核对后补录。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      },
      update: {
        name: '英格兰足球冠军联赛',
        englishName: 'EFL Championship',
        shortName: '英冠',
        alias: '英格兰第二级别联赛、Football League First Division、Football League Championship',
        externalUrl: 'https://en.wikipedia.org/wiki/EFL_Championship',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '英格兰第二级别职业足球联赛；1992-93 至 2003-04 为 Football League First Division，2004-05 起为 Championship / EFL Championship。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '1992-93 至 2024-25 已按最终联赛前三名录入；2025-26 最终名次待核对后补录。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      }
    },
    scope: {
      countryNames: ['英格兰', '威尔士']
    },
    editions: ENGLAND_CHAMPIONSHIP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'England Championship seed completed.'
  });
}

void runSeed(prisma, main);

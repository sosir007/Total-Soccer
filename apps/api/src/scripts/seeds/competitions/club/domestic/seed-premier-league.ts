import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ENGLAND_PREMIER_LEAGUE_RESULTS } from '../../../../data/competition-results/club/domestic/premier-league.js';
import { ENGLAND_PREMIER_LEAGUE_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/premier-league.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰']),
    clubs: ENGLAND_PREMIER_LEAGUE_REQUIRED_CLUBS,
    competition: {
      code: 'ENGLAND_PREMIER_LEAGUE',
      primaryCountryName: '英格兰',
      create: {
        code: 'ENGLAND_PREMIER_LEAGUE',
        name: '英格兰足球超级联赛',
        englishName: 'Premier League',
        shortName: '英超',
        alias: '英格兰超级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Premier_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '英格兰顶级职业足球联赛，自 1992-93 赛季起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-01T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      },
      update: {
        name: '英格兰足球超级联赛',
        englishName: 'Premier League',
        shortName: '英超',
        alias: '英格兰超级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Premier_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '英格兰顶级职业足球联赛，自 1992-93 赛季起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-01T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      }
    },
    scope: {
      countryNames: ['英格兰']
    },
    editions: ENGLAND_PREMIER_LEAGUE_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Premier League seed completed.'
  });
}

void runSeed(prisma, main);

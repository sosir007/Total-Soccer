import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildNorthAmericanSoccerLeagueStandings,
  NORTH_AMERICAN_SOCCER_LEAGUE_REQUIRED_CLUBS,
  NORTH_AMERICAN_SOCCER_LEAGUE_RESULTS
} from '../../../../data/competition-results/club/domestic/north-american-soccer-league.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['美国']),
    clubs: NORTH_AMERICAN_SOCCER_LEAGUE_REQUIRED_CLUBS,
    competition: {
      code: 'NORTH_AMERICAN_SOCCER_LEAGUE_1968_1984',
      primaryCountryName: '美国',
      create: {
        code: 'NORTH_AMERICAN_SOCCER_LEAGUE_1968_1984',
        name: '北美足球联赛',
        alias: '旧北美足球联赛、NASL',
        externalUrl: 'https://en.wikipedia.org/wiki/North_American_Soccer_League_(1968%E2%80%9384)',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description:
          '旧北美足球联赛 1968-1984，美国和加拿大俱乐部参加的历史顶级职业联赛；系统按美国国内历史一级联赛处理。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 3900
      },
      update: {
        name: '北美足球联赛',
        alias: '旧北美足球联赛、NASL',
        externalUrl: 'https://en.wikipedia.org/wiki/North_American_Soccer_League_(1968%E2%80%9384)',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description:
          '旧北美足球联赛 1968-1984，美国和加拿大俱乐部参加的历史顶级职业联赛；系统按美国国内历史一级联赛处理。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 3900
      }
    },
    scope: {
      countryNames: ['美国']
    },
    editions: NORTH_AMERICAN_SOCCER_LEAGUE_RESULTS,
    buildStandings: buildNorthAmericanSoccerLeagueStandings,
    expected: {
      editions: 6,
      standings: 6
    },
    allowPartialStandings: true,
    completedMessage: 'North American Soccer League seed completed.'
  });
}

void runSeed(prisma, main);

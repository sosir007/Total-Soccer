import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildUefaChampionsLeagueStandings,
  UEFA_CHAMPIONS_LEAGUE_REQUIRED_CLUBS,
  UEFA_CHAMPIONS_LEAGUE_RESULTS
} from '../../../../data/competition-results/club/confederation/uefa-champions-league.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: [
      ...pickSeedCountries([
        '比利时',
        '英格兰',
        '法国',
        '德国',
        '希腊',
        '意大利',
        '荷兰',
        '葡萄牙',
        '塞尔维亚',
        '西班牙',
        '瑞典',
        '威尔士'
      ]),
      { uid: '790', name: '罗马尼亚', confederationCode: 'UEFA' },
      { uid: '793', name: '苏格兰', confederationCode: 'UEFA' }
    ],
    clubs: UEFA_CHAMPIONS_LEAGUE_REQUIRED_CLUBS,
    competition: {
      code: 'UEFA_CHAMPIONS_LEAGUE',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'UEFA_CHAMPIONS_LEAGUE',
        name: '欧洲冠军联赛',
        alias: '欧冠、欧洲冠军杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Champions_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '欧足联最高级别俱乐部杯赛，前身为欧洲冠军杯。',
        enabled: true,
        includeInStats: true,
        sortOrder: 10
      },
      update: {
        name: '欧洲冠军联赛',
        alias: '欧冠、欧洲冠军杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Champions_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '欧足联最高级别俱乐部杯赛，前身为欧洲冠军杯。',
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 10
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    editions: withStandingMode(UEFA_CHAMPIONS_LEAGUE_RESULTS),
    buildStandings: buildUefaChampionsLeagueStandings,
    expected: {
      editions: 71,
      standings: 142
    },
    completedMessage: 'UEFA Champions League seed completed.'
  });
}

void runSeed(prisma, main);

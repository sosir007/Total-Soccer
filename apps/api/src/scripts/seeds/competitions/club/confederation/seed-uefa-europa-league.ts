import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildUefaEuropaLeagueStandings,
  UEFA_EUROPA_LEAGUE_REQUIRED_CLUBS,
  UEFA_EUROPA_LEAGUE_RESULTS
} from '../../../../data/competition-results/club/confederation/uefa-europa-league.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: [
      ...pickSeedCountries([
        '奥地利',
        '比利时',
        '英格兰',
        '法国',
        '德国',
        '匈牙利',
        '意大利',
        '荷兰',
        '葡萄牙',
        '俄罗斯',
        '塞尔维亚',
        '西班牙',
        '瑞典',
        '土耳其'
      ]),
      { uid: '793', name: '苏格兰', confederationCode: 'UEFA' },
      { uid: '800', name: '乌克兰', confederationCode: 'UEFA' }
    ],
    clubs: UEFA_EUROPA_LEAGUE_REQUIRED_CLUBS,
    competition: {
      code: 'UEFA_EUROPA_LEAGUE',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'UEFA_EUROPA_LEAGUE',
        name: '欧足联欧洲联赛',
        alias: '欧联、欧联杯、欧洲联盟杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Europa_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '欧足联第二级别俱乐部杯赛，前身为欧洲联盟杯。',
        enabled: true,
        includeInStats: true,
        sortOrder: 31
      },
      update: {
        name: '欧足联欧洲联赛',
        alias: '欧联、欧联杯、欧洲联盟杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Europa_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '欧足联第二级别俱乐部杯赛，前身为欧洲联盟杯。',
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 31
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    editions: withStandingMode(UEFA_EUROPA_LEAGUE_RESULTS),
    buildStandings: buildUefaEuropaLeagueStandings,
    expected: {
      editions: 55,
      standings: 110
    },
    completedMessage: 'UEFA Europa League seed completed.'
  });
}

void runSeed(prisma, main);

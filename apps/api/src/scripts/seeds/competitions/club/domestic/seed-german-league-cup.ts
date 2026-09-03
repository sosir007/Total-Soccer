import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { GERMAN_LEAGUE_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/german-league-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['德国']),
    competition: {
      code: 'GERMAN_LEAGUE_CUP',
      primaryCountryName: '德国',
      create: {
        code: 'GERMAN_LEAGUE_CUP',
        name: '德国联赛杯',
        englishName: 'DFL-Ligapokal',
        shortName: '德联杯',
        alias: 'DFB-Ligapokal、Premiere-Ligapokal',
        externalUrl: 'https://en.wikipedia.org/wiki/DFL-Ligapokal',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        description:
          '德国职业俱乐部国内联赛杯赛事，1972-73 有一届 DFB-Ligapokal 前身，1997-2007 以 DFL-Ligapokal 名义举办。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '1972-73、1997-2007 已按当前库内俱乐部完整录入冠亚军。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      },
      update: {
        name: '德国联赛杯',
        englishName: 'DFL-Ligapokal',
        shortName: '德联杯',
        alias: 'DFB-Ligapokal、Premiere-Ligapokal',
        externalUrl: 'https://en.wikipedia.org/wiki/DFL-Ligapokal',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        description:
          '德国职业俱乐部国内联赛杯赛事，1972-73 有一届 DFB-Ligapokal 前身，1997-2007 以 DFL-Ligapokal 名义举办。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '1972-73、1997-2007 已按当前库内俱乐部完整录入冠亚军。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      }
    },
    scope: {
      countryNames: ['德国']
    },
    editions: GERMAN_LEAGUE_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'German League Cup seed completed.'
  });
}

void runSeed(prisma, main);

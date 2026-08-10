import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  ANGLO_ITALIAN_LEAGUE_CUP_REQUIRED_CLUBS,
  ANGLO_ITALIAN_LEAGUE_CUP_RESULTS,
  buildAngloItalianLeagueCupStandings
} from '../../../../data/competition-results/club/confederation/anglo-italian-league-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰', '意大利']),
    clubs: ANGLO_ITALIAN_LEAGUE_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'ANGLO_ITALIAN_LEAGUE_CUP',
      create: {
        code: 'ANGLO_ITALIAN_LEAGUE_CUP',
        name: '英意联赛杯',
        englishName: 'Anglo-Italian League Cup',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Anglo-Italian_League_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '1969 至 1976 年间举办的英格兰与意大利杯赛冠军两回合对抗赛，1972-1974 未举办，赛事已停办。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-10T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 20002
      },
      update: {
        name: '英意联赛杯',
        englishName: 'Anglo-Italian League Cup',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Anglo-Italian_League_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '1969 至 1976 年间举办的英格兰与意大利杯赛冠军两回合对抗赛，1972-1974 未举办，赛事已停办。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-10T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 20002
      }
    },
    editions: withStandingMode(ANGLO_ITALIAN_LEAGUE_CUP_RESULTS),
    buildStandings: buildAngloItalianLeagueCupStandings,
    expected: {
      editions: 5,
      standings: 10
    },
    allowPartialStandings: true,
    completedMessage: 'Anglo-Italian League Cup seed completed.'
  });
}

void runSeed(prisma, main);

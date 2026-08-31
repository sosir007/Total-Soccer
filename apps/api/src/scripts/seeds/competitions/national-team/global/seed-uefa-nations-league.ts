import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  REQUIRED_COUNTRIES,
  UEFA_NATIONS_LEAGUE_RESULTS
} from '../../../../data/competition-results/national-team/global/uefa-nations-league.js';

const prisma = new PrismaClient();

function getUefaNationsLeagueEditionUrl(season: string | null | undefined) {
  if (!season) {
    throw new Error('UEFA Nations League edition season is required to build external URL.');
  }

  return `https://en.wikipedia.org/wiki/${season}_UEFA_Nations_League`;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    competition: {
      code: 'UEFA_NATIONS_LEAGUE',
      create: {
        code: 'UEFA_NATIONS_LEAGUE',
        name: '欧洲国家联赛',
        englishName: 'UEFA Nations League',
        shortName: '欧国联',
        alias: '欧足联国家联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Nations_League',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          '欧足联官方成年国家队赛事，2018-19 起每两年一届；本系统按国家队其他一级杯赛计分。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-27T00:00:00.000Z'),
        dataRemark: '截至 2024-25 届已按冠亚季殿军完整录入；殿军仅展示不计分。',
        enabled: true,
        includeInStats: true,
        sortOrder: 71
      },
      update: {
        name: '欧洲国家联赛',
        englishName: 'UEFA Nations League',
        shortName: '欧国联',
        alias: '欧足联国家联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Nations_League',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          '欧足联官方成年国家队赛事，2018-19 起每两年一届；本系统按国家队其他一级杯赛计分。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-27T00:00:00.000Z'),
        dataRemark: '截至 2024-25 届已按冠亚季殿军完整录入；殿军仅展示不计分。',
        enabled: true,
        includeInStats: true,
        sortOrder: 71
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    editions: withStandingMode(
      UEFA_NATIONS_LEAGUE_RESULTS.map((result) => ({
        ...result,
        externalUrl: getUefaNationsLeagueEditionUrl(result.season)
      }))
    ),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 4,
      standings: 16
    },
    completedMessage: 'UEFA Nations League seed completed.'
  });
}

void runSeed(prisma, main);

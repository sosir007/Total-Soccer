import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import {
  runCompetitionSeed,
  runSeed,
  type SeedEdition
} from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildUefaCupWinnersCupStandings,
  UEFA_CUP_WINNERS_CUP_REQUIRED_CLUBS,
  UEFA_CUP_WINNERS_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/uefa-cup-winners-cup.js';

const prisma = new PrismaClient();

function formatSeasonForUrl(season: string) {
  return season.replace('-', '%E2%80%93');
}

function getUefaCupWinnersCupEditionUrl(result: SeedEdition) {
  const season = getResultSeason(result.season);

  return `https://en.wikipedia.org/wiki/${formatSeasonForUrl(season)}_European_Cup_Winners%27_Cup`;
}

function getResultSeason(season: string | null | undefined) {
  if (!season) {
    throw new Error("UEFA Cup Winners' Cup edition season is required to build external URL.");
  }

  return season;
}

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
        '波兰',
        '葡萄牙',
        '俄罗斯',
        '斯洛伐克',
        '西班牙'
      ]),
      { uid: '770', name: '格鲁吉亚', confederationCode: 'UEFA' },
      { uid: '793', name: '苏格兰', confederationCode: 'UEFA' },
      { uid: '800', name: '乌克兰', confederationCode: 'UEFA' }
    ],
    clubs: UEFA_CUP_WINNERS_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'UEFA_CUP_WINNERS_CUP',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'UEFA_CUP_WINNERS_CUP',
        name: '欧洲优胜者杯',
        englishName: "UEFA Cup Winners' Cup",
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Cup_Winners%27_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description:
          '欧足联历史上的欧洲俱乐部杯赛，由各协会国内杯赛冠军参加，举办于 1960-61 至 1998-99 赛季。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-04T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 32
      },
      update: {
        name: '欧洲优胜者杯',
        englishName: "UEFA Cup Winners' Cup",
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Cup_Winners%27_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description:
          '欧足联历史上的欧洲俱乐部杯赛，由各协会国内杯赛冠军参加，举办于 1960-61 至 1998-99 赛季。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-04T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 32
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    editions: withStandingMode(
      UEFA_CUP_WINNERS_CUP_RESULTS.map((result) => ({
        ...result,
        externalUrl: getUefaCupWinnersCupEditionUrl(result)
      }))
    ),
    buildStandings: buildUefaCupWinnersCupStandings,
    expected: {
      editions: 39,
      standings: 78
    },
    completedMessage: "UEFA Cup Winners' Cup seed completed."
  });
}

void runSeed(prisma, main);

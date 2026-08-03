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
  buildInterCitiesFairsCupStandings,
  INTER_CITIES_FAIRS_CUP_REQUIRED_CLUBS,
  INTER_CITIES_FAIRS_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/inter-cities-fairs-cup.js';

const prisma = new PrismaClient();

function formatSeasonForUrl(season: string) {
  return season.replace('-', '%E2%80%93');
}

function getInterCitiesFairsCupEditionUrl(result: SeedEdition) {
  const season = getResultSeason(result.season);

  return `https://en.wikipedia.org/wiki/${formatSeasonForUrl(season)}_Inter-Cities_Fairs_Cup`;
}

function getResultSeason(season: string | null | undefined) {
  if (!season) {
    throw new Error('Inter-Cities Fairs Cup edition season is required to build external URL.');
  }

  return season;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: [
      ...pickSeedCountries(['比利时', '英格兰', '意大利', '西班牙']),
      { uid: '761', name: '克罗地亚', confederationCode: 'UEFA' }
    ],
    clubs: INTER_CITIES_FAIRS_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'INTER_CITIES_FAIRS_CUP',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'INTER_CITIES_FAIRS_CUP',
        name: '国际城市博览会杯',
        englishName: 'Inter-Cities Fairs Cup',
        shortName: '博览会杯',
        alias: '欧洲博览会杯、博览会城市杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Inter-Cities_Fairs_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description:
          '1955 至 1971 年举办的欧洲俱乐部杯赛，后由欧洲联盟杯取代；该赛事不并入欧足联官方欧联冠军履历。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 32
      },
      update: {
        name: '国际城市博览会杯',
        englishName: 'Inter-Cities Fairs Cup',
        shortName: '博览会杯',
        alias: '欧洲博览会杯、博览会城市杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Inter-Cities_Fairs_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description:
          '1955 至 1971 年举办的欧洲俱乐部杯赛，后由欧洲联盟杯取代；该赛事不并入欧足联官方欧联冠军履历。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 32
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    editions: withStandingMode(
      INTER_CITIES_FAIRS_CUP_RESULTS.map((result) => ({
        ...result,
        externalUrl: getInterCitiesFairsCupEditionUrl(result)
      }))
    ),
    buildStandings: buildInterCitiesFairsCupStandings,
    expected: {
      editions: 13,
      standings: 20
    },
    allowPartialStandings: true,
    completedMessage: 'Inter-Cities Fairs Cup seed completed.'
  });
}

void runSeed(prisma, main);

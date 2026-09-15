import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import {
  runCompetitionSeed,
  runSeed,
  type SeedEdition
} from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildUefaConferenceLeagueStandings,
  UEFA_CONFERENCE_LEAGUE_REQUIRED_CLUBS,
  UEFA_CONFERENCE_LEAGUE_RESULTS
} from '../../../../data/competition-results/club/confederation/uefa-conference-league.js';

const prisma = new PrismaClient();

function formatSeasonForUrl(season: string) {
  return season.replace('-', '%E2%80%93');
}

function getConferenceLeagueEditionUrl(result: SeedEdition) {
  const season = getResultSeason(result.season);
  const startYear = Number(season.slice(0, 4));
  const competitionSlug =
    startYear <= 2023 ? 'UEFA_Europa_Conference_League' : 'UEFA_Conference_League';

  return `https://en.wikipedia.org/wiki/${formatSeasonForUrl(season)}_${competitionSlug}`;
}

function getResultSeason(season: string | null | undefined) {
  if (!season) {
    throw new Error('UEFA Conference League edition season is required to build external URL.');
  }

  return season;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰', '希腊', '意大利', '荷兰', '西班牙']),
    clubs: UEFA_CONFERENCE_LEAGUE_REQUIRED_CLUBS,
    competition: {
      code: 'UEFA_CONFERENCE_LEAGUE',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'UEFA_CONFERENCE_LEAGUE',
        name: '欧足联协会联赛',
        englishName: 'UEFA Conference League',
        shortName: '欧协联',
        alias: '欧洲协会联赛、欧洲足联协会联赛、欧足联欧洲协会联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Conference_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '三级',
        format: '杯赛',
        description:
          '欧足联自 2021-22 赛季起举办的第三级俱乐部洲际杯赛，2024-25 赛季起由欧足联欧洲协会联赛更名为欧足联协会联赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 32
      },
      update: {
        name: '欧足联协会联赛',
        englishName: 'UEFA Conference League',
        shortName: '欧协联',
        alias: '欧洲协会联赛、欧洲足联协会联赛、欧足联欧洲协会联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_Conference_League',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '三级',
        format: '杯赛',
        description:
          '欧足联自 2021-22 赛季起举办的第三级俱乐部洲际杯赛，2024-25 赛季起由欧足联欧洲协会联赛更名为欧足联协会联赛。',
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 32
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    editions: withStandingMode(
      UEFA_CONFERENCE_LEAGUE_RESULTS.map((result) => ({
        ...result,
        externalUrl: getConferenceLeagueEditionUrl(result)
      }))
    ),
    buildStandings: buildUefaConferenceLeagueStandings,
    expected: {
      editions: 5,
      standings: 10
    },
    completedMessage: 'UEFA Conference League seed completed.'
  });
}

void runSeed(prisma, main);

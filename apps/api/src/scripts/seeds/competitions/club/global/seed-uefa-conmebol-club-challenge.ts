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
  buildUefaConmebolClubChallengeStandings,
  UEFA_CONMEBOL_CLUB_CHALLENGE_REQUIRED_CLUBS,
  UEFA_CONMEBOL_CLUB_CHALLENGE_RESULTS
} from '../../../../data/competition-results/club/global/uefa-conmebol-club-challenge.js';

const prisma = new PrismaClient();

function getUefaConmebolClubChallengeEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_UEFA%E2%80%93CONMEBOL_Club_Challenge`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('UEFA-CONMEBOL Club Challenge edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['西班牙', '厄瓜多尔']),
    clubs: UEFA_CONMEBOL_CLUB_CHALLENGE_REQUIRED_CLUBS,
    competition: {
      code: 'UEFA_CONMEBOL_CLUB_CHALLENGE',
      create: {
        code: 'UEFA_CONMEBOL_CLUB_CHALLENGE',
        name: '欧足联-南美足联俱乐部挑战赛',
        englishName: 'UEFA-CONMEBOL Club Challenge',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA%E2%80%93CONMEBOL_Club_Challenge',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '四级',
        format: '杯赛',
        description:
          '欧足联欧洲联赛冠军与南美杯冠军之间的跨足联俱乐部挑战赛，目前仅确认举办 2023 一届。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-04T00:00:00.000Z'),
        dataRemark: '截至 2026-08-04 仅确认举办 2023 一届；2024、2025 未找到已举办记录。',
        enabled: true,
        includeInStats: true,
        sortOrder: 5
      },
      update: {
        name: '欧足联-南美足联俱乐部挑战赛',
        englishName: 'UEFA-CONMEBOL Club Challenge',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA%E2%80%93CONMEBOL_Club_Challenge',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '四级',
        format: '杯赛',
        description:
          '欧足联欧洲联赛冠军与南美杯冠军之间的跨足联俱乐部挑战赛，目前仅确认举办 2023 一届。',
        confederationId: null,
        countryId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-04T00:00:00.000Z'),
        dataRemark: '截至 2026-08-04 仅确认举办 2023 一届；2024、2025 未找到已举办记录。',
        enabled: true,
        includeInStats: true,
        sortOrder: 5
      }
    },
    scope: {
      confederationCodes: ['UEFA', 'CONMEBOL']
    },
    editions: withStandingMode(
      UEFA_CONMEBOL_CLUB_CHALLENGE_RESULTS.map((result) => ({
        ...result,
        externalUrl: getUefaConmebolClubChallengeEditionUrl(getResultYear(result.year))
      }))
    ),
    buildStandings: buildUefaConmebolClubChallengeStandings,
    expected: {
      editions: 1,
      standings: 2
    },
    completedMessage: 'UEFA-CONMEBOL Club Challenge seed completed.'
  });
}

void runSeed(prisma, main);

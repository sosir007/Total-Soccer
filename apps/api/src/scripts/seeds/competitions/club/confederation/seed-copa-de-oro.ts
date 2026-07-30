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
  buildCopaDeOroStandings,
  COPA_DE_ORO_REQUIRED_CLUBS,
  COPA_DE_ORO_RESULTS
} from '../../../../data/competition-results/club/confederation/copa-de-oro.js';

const prisma = new PrismaClient();

function getCopaDeOroEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Copa_de_Oro`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Copa de Oro edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷', '巴西']),
    clubs: COPA_DE_ORO_REQUIRED_CLUBS,
    competition: {
      code: 'COPA_DE_ORO',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'COPA_DE_ORO',
        name: '南美金杯赛',
        englishName: 'Copa de Oro',
        alias: 'Copa de Oro Nicolás Leoz',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_de_Oro',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description:
          '南美足联短期历史俱乐部杯赛，由各项 CONMEBOL 洲际赛事冠军参加，举办于 1993、1995、1996 年。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 65
      },
      update: {
        name: '南美金杯赛',
        englishName: 'Copa de Oro',
        alias: 'Copa de Oro Nicolás Leoz',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_de_Oro',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description:
          '南美足联短期历史俱乐部杯赛，由各项 CONMEBOL 洲际赛事冠军参加，举办于 1993、1995、1996 年。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 65
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: withStandingMode(
      COPA_DE_ORO_RESULTS.map((result) => ({
        ...result,
        externalUrl: getCopaDeOroEditionUrl(getResultYear(result.year))
      }))
    ),
    buildStandings: buildCopaDeOroStandings,
    expected: {
      editions: 3,
      standings: 6
    },
    completedMessage: 'Copa de Oro seed completed.'
  });
}

void runSeed(prisma, main);

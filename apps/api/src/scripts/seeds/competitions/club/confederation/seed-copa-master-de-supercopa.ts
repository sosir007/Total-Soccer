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
  buildCopaMasterDeSupercopaStandings,
  COPA_MASTER_DE_SUPERCOPA_REQUIRED_CLUBS,
  COPA_MASTER_DE_SUPERCOPA_RESULTS
} from '../../../../data/competition-results/club/confederation/copa-master-de-supercopa.js';

const prisma = new PrismaClient();

function getCopaMasterDeSupercopaEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Copa_Master_de_Supercopa`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Copa Master de Supercopa edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷', '巴西', '巴拉圭']),
    clubs: COPA_MASTER_DE_SUPERCOPA_REQUIRED_CLUBS,
    competition: {
      code: 'COPA_MASTER_DE_SUPERCOPA',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'COPA_MASTER_DE_SUPERCOPA',
        name: '南美解放者超级杯大师赛',
        englishName: 'Copa Master de Supercopa',
        alias: 'Supercopa Masters',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Master_de_Supercopa',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description:
          '南美足联短期历史俱乐部杯赛，由曾夺得南美解放者超级杯的俱乐部参加，举办于 1992、1995 年。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 66
      },
      update: {
        name: '南美解放者超级杯大师赛',
        englishName: 'Copa Master de Supercopa',
        alias: 'Supercopa Masters',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Master_de_Supercopa',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '四级',
        format: '杯赛',
        description:
          '南美足联短期历史俱乐部杯赛，由曾夺得南美解放者超级杯的俱乐部参加，举办于 1992、1995 年。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 66
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: withStandingMode(
      COPA_MASTER_DE_SUPERCOPA_RESULTS.map((result) => ({
        ...result,
        externalUrl: getCopaMasterDeSupercopaEditionUrl(getResultYear(result.year))
      }))
    ),
    buildStandings: buildCopaMasterDeSupercopaStandings,
    expected: {
      editions: 2,
      standings: 4
    },
    completedMessage: 'Copa Master de Supercopa seed completed.'
  });
}

void runSeed(prisma, main);

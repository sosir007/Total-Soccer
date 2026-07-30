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
  buildSupercopaLibertadoresStandings,
  SUPERCOPA_LIBERTADORES_REQUIRED_CLUBS,
  SUPERCOPA_LIBERTADORES_RESULTS
} from '../../../../data/competition-results/club/confederation/supercopa-libertadores.js';

const prisma = new PrismaClient();

function getSupercopaLibertadoresEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Supercopa_Libertadores`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Supercopa Libertadores edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷', '巴西', '巴拉圭', '乌拉圭']),
    clubs: SUPERCOPA_LIBERTADORES_REQUIRED_CLUBS,
    competition: {
      code: 'SUPERCOPA_LIBERTADORES',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'SUPERCOPA_LIBERTADORES',
        name: '南美解放者超级杯',
        englishName: 'Supercopa Libertadores',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Supercopa_Libertadores',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '历届南美解放者杯冠军俱乐部参赛的南美足联洲际杯赛，举办于 1988 至 1997 年。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 61
      },
      update: {
        name: '南美解放者超级杯',
        englishName: 'Supercopa Libertadores',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Supercopa_Libertadores',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '历届南美解放者杯冠军俱乐部参赛的南美足联洲际杯赛，举办于 1988 至 1997 年。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 61
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: withStandingMode(
      SUPERCOPA_LIBERTADORES_RESULTS.map((result) => ({
        ...result,
        externalUrl: getSupercopaLibertadoresEditionUrl(getResultYear(result.year))
      }))
    ),
    buildStandings: buildSupercopaLibertadoresStandings,
    expected: {
      editions: 10,
      standings: 20
    },
    completedMessage: 'Supercopa Libertadores seed completed.'
  });
}

void runSeed(prisma, main);

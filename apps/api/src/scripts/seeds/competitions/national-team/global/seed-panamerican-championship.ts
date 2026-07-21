import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { buildCompetitionResultStandings } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  PANAMERICAN_CHAMPIONSHIP_RESULTS,
  REQUIRED_COUNTRIES
} from '../../../../data/competition-results/national-team/global/panamerican-championship.js';

const prisma = new PrismaClient();

function getPanamericanChampionshipEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Panamerican_Championship`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Panamerican Championship edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    competition: {
      code: 'PANAMERICAN_CHAMPIONSHIP',
      create: {
        code: 'PANAMERICAN_CHAMPIONSHIP',
        name: '泛美锦标赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Panamerican_Championship',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description:
          '泛美足球联合会举办的历史性成年国家队正式赛事，覆盖南美、北美和中美及加勒比地区，1960 年后停办。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 3
      },
      update: {
        name: '泛美锦标赛',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Panamerican_Championship',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description:
          '泛美足球联合会举办的历史性成年国家队正式赛事，覆盖南美、北美和中美及加勒比地区，1960 年后停办。',
        confederationId: null,
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 3
      }
    },
    editions: PANAMERICAN_CHAMPIONSHIP_RESULTS.map((result) => ({
      ...result,
      externalUrl: getPanamericanChampionshipEditionUrl(getResultYear(result.year))
    })),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 3,
      standings: 12
    },
    completedMessage: 'Panamerican Championship seed completed.'
  });
}

void runSeed(prisma, main);

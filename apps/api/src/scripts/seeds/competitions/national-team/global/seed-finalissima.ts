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
  FINALISSIMA_RESULTS,
  REQUIRED_COUNTRIES
} from '../../../../data/competition-results/national-team/global/finalissima.js';

const prisma = new PrismaClient();

function getFinalissimaEditionUrl(year: number) {
  return year === 2022
    ? 'https://en.wikipedia.org/wiki/2022_Finalissima'
    : `https://en.wikipedia.org/wiki/${year}_Artemio_Franchi_Cup`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Finalissima edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    competition: {
      code: 'FINALISSIMA',
      create: {
        code: 'FINALISSIMA',
        name: '南美洲-欧洲冠军杯',
        englishName: 'CONMEBOL-UEFA Cup of Champions',
        shortName: 'Finalissima',
        alias: '阿特米奥·弗兰基杯、欧美杯',
        externalUrl: 'https://en.wikipedia.org/wiki/CONMEBOL%E2%80%93UEFA_Cup_of_Champions',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          '欧洲杯冠军与美洲杯冠军之间的国家队冠军赛，旧名阿特米奥·弗兰基杯，2022 年以后以 Finalissima 名义重启。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-05T00:00:00.000Z'),
        dataRemark: '1985、1993、2022 已录；2026 届已取消，不建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 70
      },
      update: {
        name: '南美洲-欧洲冠军杯',
        englishName: 'CONMEBOL-UEFA Cup of Champions',
        shortName: 'Finalissima',
        alias: '阿特米奥·弗兰基杯、欧美杯',
        externalUrl: 'https://en.wikipedia.org/wiki/CONMEBOL%E2%80%93UEFA_Cup_of_Champions',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          '欧洲杯冠军与美洲杯冠军之间的国家队冠军赛，旧名阿特米奥·弗兰基杯，2022 年以后以 Finalissima 名义重启。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-05T00:00:00.000Z'),
        dataRemark: '1985、1993、2022 已录；2026 届已取消，不建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 70
      }
    },
    scope: {
      confederationCodes: ['UEFA', 'CONMEBOL']
    },
    editions: withStandingMode(
      FINALISSIMA_RESULTS.map((result) => ({
        ...result,
        externalUrl: getFinalissimaEditionUrl(getResultYear(result.year))
      }))
    ),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 3,
      standings: 6
    },
    completedMessage: 'Finalissima seed completed.'
  });
}

void runSeed(prisma, main);

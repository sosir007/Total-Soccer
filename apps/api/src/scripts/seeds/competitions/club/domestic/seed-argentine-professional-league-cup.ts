import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ARGENTINE_PROFESSIONAL_LEAGUE_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/argentine-professional-league-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷']),
    competition: {
      code: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
      primaryCountryName: '阿根廷',
      create: {
        code: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
        name: '阿根廷职业联赛杯',
        englishName: 'Copa de la Liga Profesional',
        shortName: null,
        alias: 'Copa Diego Armando Maradona',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_de_la_Liga_Profesional',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        description:
          '阿根廷顶级俱乐部短期联赛杯赛事，2020 届以 Copa Diego Armando Maradona 名义举行，2021-2024 届为 Copa de la Liga Profesional。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 16493
      },
      update: {
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 16493
      }
    },
    scope: {
      countryNames: ['阿根廷']
    },
    editions: ARGENTINE_PROFESSIONAL_LEAGUE_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Argentine Professional League Cup seed completed.'
  });
}

void runSeed(prisma, main);

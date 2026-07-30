import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY_RESULTS } from '../../../../data/competition-results/club/domestic/argentine-professional-league-champions-trophy.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷']),
    competition: {
      code: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
      primaryCountryName: '阿根廷',
      create: {
        code: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
        name: '阿根廷职业联赛冠军杯',
        englishName: 'Trofeo de Campeones de la Liga Profesional',
        shortName: null,
        alias: 'Trofeo de Campeones',
        externalUrl: 'https://en.wikipedia.org/wiki/Trofeo_de_Campeones_de_la_Liga_Profesional',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '阿根廷职业联赛冠军杯赛事，2021-2024 届由职业联赛冠军对阵职业联赛杯冠军，2025 届起由 Apertura 与 Clausura 冠军对阵。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16494
      },
      update: {
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16494
      }
    },
    scope: {
      countryNames: ['阿根廷']
    },
    editions: ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Argentine Professional League Champions Trophy seed completed.'
  });
}

void runSeed(prisma, main);

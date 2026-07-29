import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ARGENTINE_PRIMERA_DIVISION_RESULTS } from '../../../../data/competition-results/club/domestic/argentine-primera-division.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷']),
    competition: {
      code: 'ARGENTINE_PRIMERA_DIVISION',
      primaryCountryName: '阿根廷',
      create: {
        code: 'ARGENTINE_PRIMERA_DIVISION',
        name: '阿根廷足球甲级联赛',
        englishName: 'Argentine Primera Division',
        shortName: '阿甲',
        externalUrl: 'https://en.wikipedia.org/wiki/Argentine_Primera_Divisi%C3%B3n',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description:
          '阿根廷顶级职业足球联赛；职业时代存在 Metropolitano / Nacional、Apertura / Clausura 等同届多冠军赛制，系统按多冠军届次分摊冠军分。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16490
      },
      update: {
        name: '阿根廷足球甲级联赛',
        englishName: 'Argentine Primera Division',
        shortName: '阿甲',
        externalUrl: 'https://en.wikipedia.org/wiki/Argentine_Primera_Divisi%C3%B3n',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description:
          '阿根廷顶级职业足球联赛；职业时代存在 Metropolitano / Nacional、Apertura / Clausura 等同届多冠军赛制，系统按多冠军届次分摊冠军分。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16490
      }
    },
    scope: {
      countryNames: ['阿根廷']
    },
    editions: ARGENTINE_PRIMERA_DIVISION_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Argentine Primera Division seed completed.'
  });
}

void runSeed(prisma, main);

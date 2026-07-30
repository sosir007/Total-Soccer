import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ARGENTINE_PRIMERA_NACIONAL_RESULTS } from '../../../../data/competition-results/club/domestic/argentine-primera-nacional.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷']),
    competition: {
      code: 'ARGENTINE_PRIMERA_NACIONAL',
      primaryCountryName: '阿根廷',
      create: {
        code: 'ARGENTINE_PRIMERA_NACIONAL',
        name: '阿根廷足球乙级联赛',
        englishName: 'Primera Nacional',
        shortName: '阿乙',
        externalUrl: 'https://en.wikipedia.org/wiki/Primera_Nacional',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '阿根廷第二级别职业足球联赛，1986-87 年创办时名为 Primera B Nacional，现名 Primera Nacional。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16491
      },
      update: {
        name: '阿根廷足球乙级联赛',
        englishName: 'Primera Nacional',
        shortName: '阿乙',
        externalUrl: 'https://en.wikipedia.org/wiki/Primera_Nacional',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '阿根廷第二级别职业足球联赛，1986-87 年创办时名为 Primera B Nacional，现名 Primera Nacional。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16491
      }
    },
    scope: {
      countryNames: ['阿根廷']
    },
    editions: ARGENTINE_PRIMERA_NACIONAL_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Argentine Primera Nacional seed completed.'
  });
}

void runSeed(prisma, main);

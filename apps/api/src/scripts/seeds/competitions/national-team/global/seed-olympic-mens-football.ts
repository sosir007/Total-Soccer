import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  REQUIRED_COUNTRIES,
  HISTORICAL_COUNTRIES,
  OLYMPIC_RESULTS
} from '../../../../data/competition-results/national-team/global/olympic-mens-football.js';

const prisma = new PrismaClient();

function getOlympicMensFootballEditionUrl(year: number) {
  if (year >= 1996) {
    return `https://en.wikipedia.org/wiki/Football_at_the_${year}_Summer_Olympics_%E2%80%93_Men%27s_tournament`;
  }

  return `https://en.wikipedia.org/wiki/Football_at_the_${year}_Summer_Olympics`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Olympic men football edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    historicalCountries: HISTORICAL_COUNTRIES,
    competition: {
      code: 'OLYMPIC_MENS_FOOTBALL',
      create: {
        code: 'OLYMPIC_MENS_FOOTBALL',
        name: '奥运会男子足球赛',
        alias: '奥运男足',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_at_the_Summer_Olympics',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description: '夏季奥林匹克运动会男子足球赛事，现代男足奥运会长期采用年龄限制规则。',
        enabled: true,
        includeInStats: true,
        sortOrder: 2
      },
      update: {
        name: '奥运会男子足球赛',
        alias: '奥运男足',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_at_the_Summer_Olympics',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description: '夏季奥林匹克运动会男子足球赛事，现代男足奥运会长期采用年龄限制规则。',
        confederationId: null,
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 2
      }
    },
    editions: withStandingMode(
      OLYMPIC_RESULTS.map((result) => ({
        ...result,
        externalUrl: getOlympicMensFootballEditionUrl(getResultYear(result.year))
      }))
    ),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 26,
      standings: 104
    },
    completedMessage: 'Olympic men football seed completed.'
  });
}

void runSeed(prisma, main);

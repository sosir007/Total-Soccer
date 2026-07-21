import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from '../../../../helpers/seed-data.js';
import { COPA_AMERICA_RESULTS } from '../../../../data/competition-results/national-team/confederation/copa-america.js';
import type { SeedEdition } from '../../../../helpers/competition-seed.js';

const prisma = new PrismaClient();

function getCopaAmericaEditionUrl(result: SeedEdition) {
  const year = getResultYear(result.year);

  if (year === 1959 && result.name?.includes('阿根廷')) {
    return 'https://en.wikipedia.org/wiki/1959_South_American_Championship_%28Argentina%29';
  }

  if (year === 1959 && result.name?.includes('厄瓜多尔')) {
    return 'https://en.wikipedia.org/wiki/1959_South_American_Championship_%28Ecuador%29';
  }

  if (year <= 1967) {
    return `https://en.wikipedia.org/wiki/${year}_South_American_Championship`;
  }

  if (year === 2016) {
    return 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica_Centenario';
  }

  return `https://en.wikipedia.org/wiki/${year}_Copa_Am%C3%A9rica`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Copa America edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'COPA_AMERICA',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'COPA_AMERICA',
        name: '南美足联美洲杯',
        alias: '美洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '南美足联主办的男子国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 60
      },
      update: {
        name: '南美足联美洲杯',
        alias: '美洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 60
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: withStandingMode(
      COPA_AMERICA_RESULTS.map((result) => ({
        ...result,
        externalUrl: getCopaAmericaEditionUrl(result)
      }))
    ),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 48,
      standings: 191
    },
    completedMessage: 'Copa America seed completed.'
  });
}

void runSeed(prisma, main);

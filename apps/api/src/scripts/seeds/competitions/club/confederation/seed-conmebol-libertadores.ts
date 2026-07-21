import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildConmebolLibertadoresStandings,
  CONMEBOL_LIBERTADORES_REQUIRED_CLUBS,
  CONMEBOL_LIBERTADORES_RESULTS
} from '../../../../data/competition-results/club/confederation/conmebol-libertadores.js';

const prisma = new PrismaClient();

function getLibertadoresEditionUrl(year: number) {
  return `https://en.wikipedia.org/wiki/${year}_Copa_Libertadores`;
}

function getResultYear(year: number | undefined) {
  if (year === undefined) {
    throw new Error('Copa Libertadores edition year is required to build external URL.');
  }

  return year;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries([
      '阿根廷',
      '巴西',
      '智利',
      '哥伦比亚',
      '厄瓜多尔',
      '墨西哥',
      '巴拉圭',
      '秘鲁',
      '乌拉圭'
    ]),
    clubs: CONMEBOL_LIBERTADORES_REQUIRED_CLUBS,
    competition: {
      code: 'CONMEBOL_LIBERTADORES',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'CONMEBOL_LIBERTADORES',
        name: '南美解放者杯',
        alias: '解放者杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Libertadores',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '南美足联最高级别俱乐部杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 60
      },
      update: {
        name: '南美解放者杯',
        alias: '解放者杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Libertadores',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '南美足联最高级别俱乐部杯赛。',
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 60
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: withStandingMode(
      CONMEBOL_LIBERTADORES_RESULTS.map((result) => ({
        ...result,
        externalUrl: getLibertadoresEditionUrl(getResultYear(result.year))
      }))
    ),
    buildStandings: buildConmebolLibertadoresStandings,
    expected: {
      editions: 66,
      standings: 132
    },
    completedMessage: 'CONMEBOL Libertadores seed completed.'
  });
}

void runSeed(prisma, main);

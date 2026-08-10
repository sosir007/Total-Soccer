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
  buildCupOfTheAlpsStandings,
  CUP_OF_THE_ALPS_REQUIRED_CLUBS,
  CUP_OF_THE_ALPS_RESULTS
} from '../../../../data/competition-results/club/confederation/cup-of-the-alps.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['法国', '德国', '意大利', '瑞士']),
    clubs: CUP_OF_THE_ALPS_REQUIRED_CLUBS,
    competition: {
      code: 'CUP_OF_THE_ALPS',
      create: {
        code: 'CUP_OF_THE_ALPS',
        name: '阿尔卑斯杯',
        englishName: 'Cup of the Alps',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Cup_of_the_Alps',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '1960 至 1987 年间举办的欧洲跨国俱乐部邀请赛；1960、1961 为联赛代表队阶段，本系统只录入 1962 起的俱乐部阶段，赛事已停办。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-10T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 20001
      },
      update: {
        name: '阿尔卑斯杯',
        englishName: 'Cup of the Alps',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Cup_of_the_Alps',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '1960 至 1987 年间举办的欧洲跨国俱乐部邀请赛；1960、1961 为联赛代表队阶段，本系统只录入 1962 起的俱乐部阶段，赛事已停办。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-08-10T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 20001
      }
    },
    editions: withStandingMode(CUP_OF_THE_ALPS_RESULTS),
    buildStandings: buildCupOfTheAlpsStandings,
    expected: {
      editions: 24,
      standings: 48
    },
    allowPartialStandings: true,
    completedMessage: 'Cup of the Alps seed completed.'
  });
}

void runSeed(prisma, main);

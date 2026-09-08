import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { pickSeedCountries, CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';
import {
  buildLeaguesCupStandings,
  LEAGUES_CUP_REQUIRED_CLUBS,
  LEAGUES_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/leagues-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['加拿大', '墨西哥', '美国']),
    clubs: LEAGUES_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'LEAGUES_CUP',
      create: {
        code: 'LEAGUES_CUP',
        name: '北美联赛杯',
        englishName: 'Leagues Cup',
        shortName: '联赛杯',
        alias: '北美联盟杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Leagues_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          'MLS 与 Liga MX 共同组织的北美跨联赛俱乐部杯赛，2019 年创办，2023 年起赛事前三名获得中北美冠军杯资格；本系统按俱乐部其他一级杯赛处理。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-08T00:00:00.000Z'),
        dataRemark:
          '2019、2021 录入冠亚军，2023 至 2026 录入冠亚季殿军；规则只计算冠亚军分值；2020 取消、2022 Showcase 无冠军，不建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20004
      },
      update: {
        name: '北美联赛杯',
        englishName: 'Leagues Cup',
        shortName: '联赛杯',
        alias: '北美联盟杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Leagues_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '一级',
        format: '杯赛',
        description:
          'MLS 与 Liga MX 共同组织的北美跨联赛俱乐部杯赛，2019 年创办，2023 年起赛事前三名获得中北美冠军杯资格；本系统按俱乐部其他一级杯赛处理。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-08T00:00:00.000Z'),
        dataRemark:
          '2019、2021 录入冠亚军，2023 至 2026 录入冠亚季殿军；规则只计算冠亚军分值；2020 取消、2022 Showcase 无冠军，不建届次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20004
      }
    },
    scope: {
      countryNames: ['加拿大', '墨西哥', '美国']
    },
    editions: LEAGUES_CUP_RESULTS.map((result) => ({
      ...result,
      externalUrl: `https://en.wikipedia.org/wiki/${result.year}_Leagues_Cup`
    })),
    buildStandings: buildLeaguesCupStandings,
    expected: {
      editions: 6,
      standings: 20
    },
    completedMessage: 'Leagues Cup seed completed.'
  });
}

void runSeed(prisma, main);

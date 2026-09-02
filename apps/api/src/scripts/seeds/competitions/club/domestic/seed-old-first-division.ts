import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ENGLAND_FIRST_DIVISION_RESULTS } from '../../../../data/competition-results/club/domestic/old-first-division.js';
import { ENGLAND_FIRST_DIVISION_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/old-first-division.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰']),
    clubs: ENGLAND_FIRST_DIVISION_REQUIRED_CLUBS,
    competition: {
      code: 'ENGLAND_FIRST_DIVISION',
      primaryCountryName: '英格兰',
      create: {
        code: 'ENGLAND_FIRST_DIVISION',
        name: '英格兰足球甲级联赛（旧英甲）',
        englishName: 'Football League First Division',
        shortName: '旧英甲',
        alias: '英格兰足球甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_League_First_Division',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '英格兰 1888-89 至 1991-92 年间的顶级联赛，1992-93 起由英超接替。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-01T00:00:00.000Z'),
        dataRemark: '历史队名已映射到现有俱乐部实体；仅录入数据库已有俱乐部的名次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      },
      update: {
        name: '英格兰足球甲级联赛（旧英甲）',
        englishName: 'Football League First Division',
        shortName: '旧英甲',
        alias: '英格兰足球甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_League_First_Division',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '英格兰 1888-89 至 1991-92 年间的顶级联赛，1992-93 起由英超接替。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-01T00:00:00.000Z'),
        dataRemark: '历史队名已映射到现有俱乐部实体；仅录入数据库已有俱乐部的名次。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      }
    },
    scope: {
      countryNames: ['英格兰']
    },
    editions: ENGLAND_FIRST_DIVISION_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Old First Division seed completed.'
  });
}

void runSeed(prisma, main);

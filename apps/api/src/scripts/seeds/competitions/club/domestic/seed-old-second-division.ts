import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ENGLAND_SECOND_DIVISION_RESULTS } from '../../../../data/competition-results/club/domestic/old-second-division.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰']),
    competition: {
      code: 'ENGLAND_SECOND_DIVISION',
      primaryCountryName: '英格兰',
      create: {
        code: 'ENGLAND_SECOND_DIVISION',
        name: '英格兰足球乙级联赛（旧英乙）',
        englishName: 'Football League Second Division',
        shortName: '旧英乙',
        alias: '英格兰第二级别联赛、旧二级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_League_Second_Division',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description: '英格兰 1892-93 至 1991-92 年间的第二级别联赛，1992-93 起由英冠体系接替。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '1892-93 至 1991-92 已按最终积分榜前三名补录当前库内俱乐部；Darwen、Glossop North End 为库外球队，对应名次留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      },
      update: {
        name: '英格兰足球乙级联赛（旧英乙）',
        englishName: 'Football League Second Division',
        shortName: '旧英乙',
        alias: '英格兰第二级别联赛、旧二级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_League_Second_Division',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description: '英格兰 1892-93 至 1991-92 年间的第二级别联赛，1992-93 起由英冠体系接替。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '1892-93 至 1991-92 已按最终积分榜前三名补录当前库内俱乐部；Darwen、Glossop North End 为库外球队，对应名次留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      }
    },
    scope: {
      countryNames: ['英格兰']
    },
    editions: ENGLAND_SECOND_DIVISION_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Old Second Division seed completed.'
  });
}

void runSeed(prisma, main);

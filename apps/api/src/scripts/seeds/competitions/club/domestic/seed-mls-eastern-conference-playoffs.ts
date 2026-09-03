import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildMlsEasternConferencePlayoffsStandings,
  MLS_EASTERN_CONFERENCE_PLAYOFFS_REQUIRED_CLUBS,
  MLS_EASTERN_CONFERENCE_PLAYOFFS_RESULTS
} from '../../../../data/competition-results/club/domestic/mls-eastern-conference-playoffs.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['美国', '加拿大']),
    clubs: MLS_EASTERN_CONFERENCE_PLAYOFFS_REQUIRED_CLUBS,
    competition: {
      code: 'MLS_EASTERN_CONFERENCE_PLAYOFFS',
      primaryCountryName: '美国',
      create: {
        code: 'MLS_EASTERN_CONFERENCE_PLAYOFFS',
        name: '美国职业足球大联盟东区季后赛',
        englishName: 'MLS Eastern Conference Playoffs',
        shortName: 'MLS东区季后赛',
        alias: '美国职业足球大联盟东部联盟季后赛、MLS东区决赛、MLS东部决赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Eastern_Conference_(MLS)',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description: '美国职业足球大联盟东区季后赛分区决赛荣誉，系统按美国国内三级杯赛处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '已按 1996-1999、2003-2025 年 MLS 东区季后赛决赛录入冠亚军；2000-2002 无分区季后赛不建届次；1996 亚军坦帕湾叛变者因俱乐部未入库不创建 standings。',
        enabled: true,
        includeInStats: true,
        sortOrder: 3903
      },
      update: {
        name: '美国职业足球大联盟东区季后赛',
        englishName: 'MLS Eastern Conference Playoffs',
        shortName: 'MLS东区季后赛',
        alias: '美国职业足球大联盟东部联盟季后赛、MLS东区决赛、MLS东部决赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Eastern_Conference_(MLS)',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description: '美国职业足球大联盟东区季后赛分区决赛荣誉，系统按美国国内三级杯赛处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '已按 1996-1999、2003-2025 年 MLS 东区季后赛决赛录入冠亚军；2000-2002 无分区季后赛不建届次；1996 亚军坦帕湾叛变者因俱乐部未入库不创建 standings。',
        enabled: true,
        includeInStats: true,
        sortOrder: 3903
      }
    },
    scope: {
      countryNames: ['美国']
    },
    editions: MLS_EASTERN_CONFERENCE_PLAYOFFS_RESULTS,
    buildStandings: buildMlsEasternConferencePlayoffsStandings,
    expected: {
      editions: 27,
      standings: 53
    },
    allowPartialStandings: true,
    completedMessage: 'MLS Eastern Conference Playoffs seed completed.'
  });
}

void runSeed(prisma, main);

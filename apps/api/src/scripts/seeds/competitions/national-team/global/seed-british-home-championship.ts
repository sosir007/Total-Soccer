import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  BRITISH_HOME_CHAMPIONSHIP_RESULTS,
  REQUIRED_COUNTRIES,
  buildBritishHomeChampionshipStandings
} from '../../../../data/competition-results/national-team/global/british-home-championship.js';
import { CONFEDERATION_SEEDS } from '../../../../helpers/seed-data.js';

const prisma = new PrismaClient();

function getEditionUrl(season: string) {
  return `https://en.wikipedia.org/wiki/${season.replace('-', '%E2%80%93')}_British_Home_Championship`;
}

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    competition: {
      code: 'BRITISH_HOME_CHAMPIONSHIP',
      create: {
        code: 'BRITISH_HOME_CHAMPIONSHIP',
        name: '英国本土锦标赛',
        englishName: 'British Home Championship',
        shortName: '英国本土锦标',
        alias: 'British International Championship、Home International Championship',
        externalUrl: 'https://en.wikipedia.org/wiki/British_Home_Championship',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '英格兰、苏格兰、威尔士和爱尔兰/北爱尔兰参加的历史国家队赛事，1883-84 至 1983-84 年间举办。赛事仅作历史展示，不纳入国家荣誉统计和积分。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-24T00:00:00.000Z'),
        dataRemark:
          '完整录入 88 个正式完赛届次；排除两次世界大战停办、1945-46 非正式赛事和 1980-81 废弃赛事。',
        enabled: true,
        includeInStats: false,
        sortOrder: 73
      },
      update: {
        name: '英国本土锦标赛',
        englishName: 'British Home Championship',
        shortName: '英国本土锦标',
        alias: 'British International Championship、Home International Championship',
        externalUrl: 'https://en.wikipedia.org/wiki/British_Home_Championship',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '英格兰、苏格兰、威尔士和爱尔兰/北爱尔兰参加的历史国家队赛事，1883-84 至 1983-84 年间举办。赛事仅作历史展示，不纳入国家荣誉统计和积分。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-24T00:00:00.000Z'),
        dataRemark:
          '完整录入 88 个正式完赛届次；排除两次世界大战停办、1945-46 非正式赛事和 1980-81 废弃赛事。',
        enabled: true,
        includeInStats: false,
        sortOrder: 73
      }
    },
    editions: BRITISH_HOME_CHAMPIONSHIP_RESULTS.map((result) => ({
      ...result,
      standingMode: result.mode,
      externalUrl: getEditionUrl(result.season)
    })),
    buildStandings: buildBritishHomeChampionshipStandings,
    allowSharedStandings: true,
    expected: {
      editions: 88,
      standings: 352
    },
    completedMessage: 'British Home Championship seed completed.'
  });
}

void runSeed(prisma, main);

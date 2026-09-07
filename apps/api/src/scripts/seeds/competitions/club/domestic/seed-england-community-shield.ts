import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰', '威尔士']),
    competition: {
      code: 'ENGLAND_COMMUNITY_SHIELD',
      primaryCountryName: '英格兰',
      create: {
        code: 'ENGLAND_COMMUNITY_SHIELD',
        name: '英格兰社区盾杯',
        englishName: 'FA Community Shield',
        shortName: '社区盾杯',
        alias: '英格兰慈善盾、FA Charity Shield',
        externalUrl: 'https://en.wikipedia.org/wiki/FA_Community_Shield',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '英格兰赛季揭幕超级杯赛事，通常由顶级联赛冠军对阵足总杯冠军；前称 FA Charity Shield。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-07T00:00:00.000Z'),
        dataRemark:
          '1908 至 2026 已按当前库内俱乐部录入；早期职业联队、业余联队、世界杯队、FA XI 等非俱乐部对象不录入；1927 亚军 Corinthians 当前库内无该俱乐部，亚军荣誉留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      },
      update: {
        name: '英格兰社区盾杯',
        englishName: 'FA Community Shield',
        shortName: '社区盾杯',
        alias: '英格兰慈善盾、FA Charity Shield',
        externalUrl: 'https://en.wikipedia.org/wiki/FA_Community_Shield',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '英格兰赛季揭幕超级杯赛事，通常由顶级联赛冠军对阵足总杯冠军；前称 FA Charity Shield。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-07T00:00:00.000Z'),
        dataRemark:
          '1908 至 2026 已按当前库内俱乐部录入；早期职业联队、业余联队、世界杯队、FA XI 等非俱乐部对象不录入；1927 亚军 Corinthians 当前库内无该俱乐部，亚军荣誉留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      }
    },
    scope: {
      countryNames: ['英格兰', '威尔士']
    },
    editions: [],
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'England Community Shield seed completed.'
  });
}

void runSeed(prisma, main);

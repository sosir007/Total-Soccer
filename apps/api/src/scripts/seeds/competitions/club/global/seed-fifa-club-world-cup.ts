import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildClubWorldCupStandings,
  FIFA_CLUB_WORLD_CUP_REQUIRED_CLUBS,
  FIFA_CLUB_WORLD_CUP_RESULTS
} from '../../../../data/competition-results/club/global/fifa-club-world-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries([
      '阿根廷',
      '巴西',
      '哥伦比亚',
      '哥斯达黎加',
      '中国',
      '民主刚果',
      '埃及',
      '英格兰',
      '厄瓜多尔',
      '法国',
      '德国',
      '意大利',
      '日本',
      '韩国',
      '摩洛哥',
      '墨西哥',
      '新西兰',
      '卡塔尔',
      '沙特阿拉伯',
      '西班牙',
      '突尼斯',
      '阿联酋'
    ]),
    clubs: FIFA_CLUB_WORLD_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'FIFA_CLUB_WORLD_CUP',
      create: {
        code: 'FIFA_CLUB_WORLD_CUP',
        name: '国际足联俱乐部世界杯',
        alias: '世俱杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Club_World_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '一级',
        format: '杯赛',
        description:
          '国际足联主办的俱乐部世界冠军赛事；2001-2004 未举办，2025 起改为 32 队新赛制。',
        enabled: true,
        includeInStats: true,
        sortOrder: 0
      },
      update: {
        name: '国际足联俱乐部世界杯',
        alias: '世俱杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Club_World_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '一级',
        format: '杯赛',
        description:
          '国际足联主办的俱乐部世界冠军赛事；2001-2004 未举办，2025 起改为 32 队新赛制。',
        confederationId: null,
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 0
      }
    },
    editions: FIFA_CLUB_WORLD_CUP_RESULTS,
    buildStandings: buildClubWorldCupStandings,
    expected: {
      editions: 21,
      standings: 84
    },
    allowPartialStandings: true,
    completedMessage: 'FIFA Club World Cup seed completed.'
  });
}

void runSeed(prisma, main);

import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from './helpers/competition-seed.js';
import {
  FINAL_ROUND_TOP_FOUR_REMARK,
  THREE_TEAM_ROUND_ROBIN_TOP_THREE_REMARK,
  THREE_TEAM_TOP_THREE_REMARK
} from './helpers/competition-remarks.js';
import {
  buildCompetitionResultStandings,
  type TopFourCompetitionResult,
  type TopThreeCompetitionResult,
  withStandingMode
} from './helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from './helpers/seed-data.js';

const prisma = new PrismaClient();

const CAF_AWARDED_REMARK = '本届决赛原场上结果存在争议，当前按 CAF 判罚后的官方冠军口径录入。';

const AFRICA_CUP_RESULTS: Array<TopFourCompetitionResult | TopThreeCompetitionResult> = [
  {
    year: 1957,
    host: '苏丹',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: THREE_TEAM_TOP_THREE_REMARK,
    champion: '埃及',
    runnerUp: '埃塞俄比亚',
    thirdPlace: '苏丹'
  },
  {
    year: 1959,
    host: '阿拉伯联合共和国',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: THREE_TEAM_ROUND_ROBIN_TOP_THREE_REMARK,
    champion: '阿拉伯联合共和国',
    runnerUp: '苏丹',
    thirdPlace: '埃塞俄比亚'
  },
  {
    year: 1962,
    host: '埃塞俄比亚',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃塞俄比亚',
    runnerUp: '阿拉伯联合共和国',
    thirdPlace: '突尼斯',
    fourthPlace: '乌干达'
  },
  {
    year: 1963,
    host: '加纳',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '苏丹',
    thirdPlace: '阿拉伯联合共和国',
    fourthPlace: '埃塞俄比亚'
  },
  {
    year: 1965,
    host: '突尼斯',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '突尼斯',
    thirdPlace: '科特迪瓦',
    fourthPlace: '塞内加尔'
  },
  {
    year: 1968,
    host: '埃塞俄比亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '刚果金沙萨',
    runnerUp: '加纳',
    thirdPlace: '科特迪瓦',
    fourthPlace: '埃塞俄比亚'
  },
  {
    year: 1970,
    host: '苏丹',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏丹',
    runnerUp: '加纳',
    thirdPlace: '阿拉伯联合共和国',
    fourthPlace: '科特迪瓦'
  },
  {
    year: 1972,
    host: '喀麦隆',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '刚果',
    runnerUp: '马里',
    thirdPlace: '喀麦隆',
    fourthPlace: '扎伊尔'
  },
  {
    year: 1974,
    host: '埃及',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '扎伊尔',
    runnerUp: '赞比亚',
    thirdPlace: '埃及',
    fourthPlace: '刚果'
  },
  {
    year: 1976,
    host: '埃塞俄比亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: FINAL_ROUND_TOP_FOUR_REMARK,
    champion: '摩洛哥',
    runnerUp: '几内亚',
    thirdPlace: '尼日利亚',
    fourthPlace: '埃及'
  },
  {
    year: 1978,
    host: '加纳',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '乌干达',
    thirdPlace: '尼日利亚',
    fourthPlace: '突尼斯'
  },
  {
    year: 1980,
    host: '尼日利亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '阿尔及利亚',
    thirdPlace: '摩洛哥',
    fourthPlace: '埃及'
  },
  {
    year: 1982,
    host: '利比亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '利比亚',
    thirdPlace: '赞比亚',
    fourthPlace: '阿尔及利亚'
  },
  {
    year: 1984,
    host: '科特迪瓦',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '尼日利亚',
    thirdPlace: '阿尔及利亚',
    fourthPlace: '埃及'
  },
  {
    year: 1986,
    host: '埃及',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '喀麦隆',
    thirdPlace: '科特迪瓦',
    fourthPlace: '摩洛哥'
  },
  {
    year: 1988,
    host: '摩洛哥',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '尼日利亚',
    thirdPlace: '阿尔及利亚',
    fourthPlace: '摩洛哥'
  },
  {
    year: 1990,
    host: '阿尔及利亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿尔及利亚',
    runnerUp: '尼日利亚',
    thirdPlace: '赞比亚',
    fourthPlace: '塞内加尔'
  },
  {
    year: 1992,
    host: '塞内加尔',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科特迪瓦',
    runnerUp: '加纳',
    thirdPlace: '尼日利亚',
    fourthPlace: '喀麦隆'
  },
  {
    year: 1994,
    host: '突尼斯',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '赞比亚',
    thirdPlace: '科特迪瓦',
    fourthPlace: '马里'
  },
  {
    year: 1996,
    host: '南非',
    quantity: 15,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '南非',
    runnerUp: '突尼斯',
    thirdPlace: '赞比亚',
    fourthPlace: '加纳'
  },
  {
    year: 1998,
    host: '布基纳法索',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '南非',
    thirdPlace: '民主刚果',
    fourthPlace: '布基纳法索'
  },
  {
    year: 2000,
    host: '加纳 / 尼日利亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '尼日利亚',
    thirdPlace: '南非',
    fourthPlace: '突尼斯'
  },
  {
    year: 2002,
    host: '马里',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '塞内加尔',
    thirdPlace: '尼日利亚',
    fourthPlace: '马里'
  },
  {
    year: 2004,
    host: '突尼斯',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '突尼斯',
    runnerUp: '摩洛哥',
    thirdPlace: '尼日利亚',
    fourthPlace: '马里'
  },
  {
    year: 2006,
    host: '埃及',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '科特迪瓦',
    thirdPlace: '尼日利亚',
    fourthPlace: '塞内加尔'
  },
  {
    year: 2008,
    host: '加纳',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '喀麦隆',
    thirdPlace: '加纳',
    fourthPlace: '科特迪瓦'
  },
  {
    year: 2010,
    host: '安哥拉',
    quantity: 15,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '加纳',
    thirdPlace: '尼日利亚',
    fourthPlace: '阿尔及利亚'
  },
  {
    year: 2012,
    host: '赤道几内亚 / 加蓬',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '赞比亚',
    runnerUp: '科特迪瓦',
    thirdPlace: '马里',
    fourthPlace: '加纳'
  },
  {
    year: 2013,
    host: '南非',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '布基纳法索',
    thirdPlace: '马里',
    fourthPlace: '加纳'
  },
  {
    year: 2015,
    host: '赤道几内亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科特迪瓦',
    runnerUp: '加纳',
    thirdPlace: '民主刚果',
    fourthPlace: '赤道几内亚'
  },
  {
    year: 2017,
    host: '加蓬',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '埃及',
    thirdPlace: '布基纳法索',
    fourthPlace: '加纳'
  },
  {
    year: 2019,
    host: '埃及',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿尔及利亚',
    runnerUp: '塞内加尔',
    thirdPlace: '尼日利亚',
    fourthPlace: '突尼斯'
  },
  {
    year: 2021,
    host: '喀麦隆',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '塞内加尔',
    runnerUp: '埃及',
    thirdPlace: '喀麦隆',
    fourthPlace: '布基纳法索'
  },
  {
    year: 2023,
    host: '科特迪瓦',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科特迪瓦',
    runnerUp: '尼日利亚',
    thirdPlace: '南非',
    fourthPlace: '民主刚果'
  },
  {
    year: 2025,
    host: '摩洛哥',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: CAF_AWARDED_REMARK,
    champion: '摩洛哥',
    runnerUp: '塞内加尔',
    thirdPlace: '尼日利亚',
    fourthPlace: '埃及'
  }
];

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'AFRICA_CUP',
      primaryConfederationCode: 'CAF',
      create: {
        code: 'AFRICA_CUP',
        name: '非洲国家杯',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '非洲足联主办的男子国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 35
      },
      update: {
        name: '非洲国家杯',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 35
      }
    },
    scope: {
      confederationCodes: ['CAF']
    },
    historicalCountryNames: ['阿拉伯联合共和国', '刚果金沙萨', '扎伊尔'],
    editions: withStandingMode(AFRICA_CUP_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 35,
      standings: 138
    },
    completedMessage: 'Africa Cup seed completed.'
  });
}

void runSeed(prisma, main);

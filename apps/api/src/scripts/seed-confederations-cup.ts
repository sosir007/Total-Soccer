import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from './helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  type TopFourCompetitionResult
} from './helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from './helpers/seed-data.js';

const prisma = new PrismaClient();

const REQUIRED_COUNTRIES = pickSeedCountries([
  '喀麦隆',
  '科特迪瓦',
  '尼日利亚',
  '南非',
  '日本',
  '沙特阿拉伯',
  '澳大利亚',
  '墨西哥',
  '美国',
  '捷克',
  '丹麦',
  '法国',
  '德国',
  '意大利',
  '葡萄牙',
  '俄罗斯',
  '西班牙',
  '土耳其',
  '阿根廷',
  '巴西',
  '智利',
  '哥伦比亚',
  '乌拉圭'
]);

const KING_FAHD_CUP_REMARK = '本届为国际足联联合会杯前身法赫德国王杯。';

const CONFEDERATIONS_CUP_RESULTS: TopFourCompetitionResult[] = [
  {
    year: 1992,
    host: '沙特阿拉伯',
    quantity: 4,
    remark: KING_FAHD_CUP_REMARK,
    champion: '阿根廷',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '美国',
    fourthPlace: '科特迪瓦'
  },
  {
    year: 1995,
    host: '沙特阿拉伯',
    quantity: 6,
    remark: KING_FAHD_CUP_REMARK,
    champion: '丹麦',
    runnerUp: '阿根廷',
    thirdPlace: '墨西哥',
    fourthPlace: '尼日利亚'
  },
  {
    year: 1997,
    host: '沙特阿拉伯',
    quantity: 8,
    champion: '巴西',
    runnerUp: '澳大利亚',
    thirdPlace: '捷克',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1999,
    host: '墨西哥',
    quantity: 8,
    champion: '墨西哥',
    runnerUp: '巴西',
    thirdPlace: '美国',
    fourthPlace: '沙特阿拉伯'
  },
  {
    year: 2001,
    host: '日本 / 韩国',
    quantity: 8,
    champion: '法国',
    runnerUp: '日本',
    thirdPlace: '澳大利亚',
    fourthPlace: '巴西'
  },
  {
    year: 2003,
    host: '法国',
    quantity: 8,
    champion: '法国',
    runnerUp: '喀麦隆',
    thirdPlace: '土耳其',
    fourthPlace: '哥伦比亚'
  },
  {
    year: 2005,
    host: '德国',
    quantity: 8,
    champion: '巴西',
    runnerUp: '阿根廷',
    thirdPlace: '德国',
    fourthPlace: '墨西哥'
  },
  {
    year: 2009,
    host: '南非',
    quantity: 8,
    champion: '巴西',
    runnerUp: '美国',
    thirdPlace: '西班牙',
    fourthPlace: '南非'
  },
  {
    year: 2013,
    host: '巴西',
    quantity: 8,
    champion: '巴西',
    runnerUp: '西班牙',
    thirdPlace: '意大利',
    fourthPlace: '乌拉圭'
  },
  {
    year: 2017,
    host: '俄罗斯',
    quantity: 8,
    champion: '德国',
    runnerUp: '智利',
    thirdPlace: '葡萄牙',
    fourthPlace: '墨西哥'
  }
];

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: REQUIRED_COUNTRIES,
    competition: {
      code: 'FIFA_CONFEDERATIONS_CUP',
      create: {
        code: 'FIFA_CONFEDERATIONS_CUP',
        name: '国际足联联合会杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '二级',
        format: '杯赛',
        description: '国际足联主办的国家队洲际冠军邀请赛，前身为法赫德国王杯，2017 年后停办。',
        enabled: true,
        includeInStats: true,
        sortOrder: 10
      },
      update: {
        name: '国际足联联合会杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '二级',
        format: '杯赛',
        description: '国际足联主办的国家队洲际冠军邀请赛，前身为法赫德国王杯，2017 年后停办。',
        confederationId: null,
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 10
      }
    },
    editions: CONFEDERATIONS_CUP_RESULTS,
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 10,
      standings: 40
    },
    completedMessage: 'FIFA Confederations Cup seed completed.'
  });
}

void runSeed(prisma, main);

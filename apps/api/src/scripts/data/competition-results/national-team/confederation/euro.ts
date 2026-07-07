import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type SemiFinalistCompetitionResult
} from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const EURO_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_EURO',
  name: '欧洲足球锦标赛',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'confederation',
  sources: [
    {
      label: 'UEFA EURO history',
      url: 'https://www.uefa.com/euro/history/',
      remark: '用于确认欧洲杯官方历史赛事归属和历届赛事入口。'
    },
    {
      label: 'UEFA European Championship - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/UEFA_European_Championship',
      remark: '用于交叉核对历届主办地、冠军、亚军、三四名赛或四强口径、参赛队数量。'
    },
    {
      label: 'UEFA Euro 1984 - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/UEFA_Euro_1984',
      remark: '用于核对 1984 起取消三四名赛后的四强录入口径。'
    }
  ],
  lastVerifiedAt: '2026-07-07',
  notes: [
    '1960-1980 有三四名赛，按冠军、亚军、季军、殿军录入。',
    '1984 起取消三四名赛，按冠军、亚军、两个四强录入。',
    '2020 届次保留赛事年份 2020，主办地按泛欧口径录入。',
    '苏联、南斯拉夫、捷克斯洛伐克、西德等使用系统历史国家继承口径。'
  ]
};

export const EURO_RESULTS: Array<TopFourCompetitionResult | SemiFinalistCompetitionResult> = [
  {
    year: 1960,
    host: '法国',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏联',
    runnerUp: '南斯拉夫',
    thirdPlace: '捷克斯洛伐克',
    fourthPlace: '法国'
  },
  {
    year: 1964,
    host: '西班牙',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '苏联',
    thirdPlace: '匈牙利',
    fourthPlace: '丹麦'
  },
  {
    year: 1968,
    host: '意大利',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '意大利',
    runnerUp: '南斯拉夫',
    thirdPlace: '英格兰',
    fourthPlace: '苏联'
  },
  {
    year: 1972,
    host: '比利时',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西德',
    runnerUp: '苏联',
    thirdPlace: '比利时',
    fourthPlace: '匈牙利'
  },
  {
    year: 1976,
    host: '南斯拉夫',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '捷克斯洛伐克',
    runnerUp: '西德',
    thirdPlace: '荷兰',
    fourthPlace: '南斯拉夫'
  },
  {
    year: 1980,
    host: '意大利',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西德',
    runnerUp: '比利时',
    thirdPlace: '捷克斯洛伐克',
    fourthPlace: '意大利'
  },
  {
    year: 1984,
    host: '法国',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '法国',
    runnerUp: '西班牙',
    semiFinalists: ['丹麦', '葡萄牙']
  },
  {
    year: 1988,
    host: '西德',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '荷兰',
    runnerUp: '苏联',
    semiFinalists: ['意大利', '西德']
  },
  {
    year: 1992,
    host: '瑞典',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '丹麦',
    runnerUp: '德国',
    semiFinalists: ['荷兰', '瑞典']
  },
  {
    year: 1996,
    host: '英格兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '德国',
    runnerUp: '捷克',
    semiFinalists: ['英格兰', '法国']
  },
  {
    year: 2000,
    host: '比利时/荷兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '法国',
    runnerUp: '意大利',
    semiFinalists: ['荷兰', '葡萄牙']
  },
  {
    year: 2004,
    host: '葡萄牙',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '希腊',
    runnerUp: '葡萄牙',
    semiFinalists: ['捷克', '荷兰']
  },
  {
    year: 2008,
    host: '奥地利/瑞士',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '德国',
    semiFinalists: ['俄罗斯', '土耳其']
  },
  {
    year: 2012,
    host: '波兰/乌克兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '意大利',
    semiFinalists: ['德国', '葡萄牙']
  },
  {
    year: 2016,
    host: '法国',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '葡萄牙',
    runnerUp: '法国',
    semiFinalists: ['德国', '威尔士']
  },
  {
    year: 2020,
    host: '泛欧',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '意大利',
    runnerUp: '英格兰',
    semiFinalists: ['丹麦', '西班牙']
  },
  {
    year: 2024,
    host: '德国',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '英格兰',
    semiFinalists: ['法国', '荷兰']
  }
];

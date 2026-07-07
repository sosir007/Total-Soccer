import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type SemiFinalistCompetitionResult
} from '../../../../helpers/competition-results.js';
import { ROUND_ROBIN_TOP_FOUR_REMARK } from '../../../../helpers/competition-remarks.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ASIAN_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'AFC_ASIAN_CUP',
  name: '亚足联亚洲杯',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'confederation',
  sources: [
    {
      label: 'AFC Asian Cup - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/AFC_Asian_Cup',
      remark: '用于交叉核对历届主办地、冠军、亚军、季军/殿军或四强、参赛队数量。'
    },
    {
      label: 'AFC Asian Cup records and statistics - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/AFC_Asian_Cup_records_and_statistics',
      remark: '用于交叉核对球队历届前四名与无三四名赛后的四强口径。'
    },
    {
      label: 'AFC Asian Cup official competition page',
      url: 'https://www.the-afc.com/en/national/afc_asian_cup.html',
      remark: '用于确认赛事官方归属和当前赛事页面。'
    }
  ],
  lastVerifiedAt: '2026-07-07',
  notes: [
    '1956-1968 为单组循环赛，按最终前四排名录入冠亚季殿，并在届次备注中说明并非实际三四名赛。',
    '2019、2023 无三四名赛，按冠军、亚军、两个四强录入。',
    '台湾/中华台北按系统国家“中国台北”录入；高棉按“柬埔寨”录入；阿拉伯联合酋长国按“阿联酋”录入。',
    '南越作为历史国家录入，并通过历史继承统计到越南。'
  ]
};

export const ASIAN_CUP_RESULTS: Array<TopFourCompetitionResult | SemiFinalistCompetitionResult> = [
  {
    year: 1956,
    host: '中国香港',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '韩国',
    runnerUp: '以色列',
    thirdPlace: '中国香港',
    fourthPlace: '南越'
  },
  {
    year: 1960,
    host: '韩国',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '韩国',
    runnerUp: '以色列',
    thirdPlace: '中国台北',
    fourthPlace: '南越'
  },
  {
    year: 1964,
    host: '以色列',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '以色列',
    runnerUp: '印度',
    thirdPlace: '韩国',
    fourthPlace: '中国香港'
  },
  {
    year: 1968,
    host: '伊朗',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '伊朗',
    runnerUp: '缅甸',
    thirdPlace: '以色列',
    fourthPlace: '中国台北'
  },
  {
    year: 1972,
    host: '泰国',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '伊朗',
    runnerUp: '韩国',
    thirdPlace: '泰国',
    fourthPlace: '柬埔寨'
  },
  {
    year: 1976,
    host: '伊朗',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '伊朗',
    runnerUp: '科威特',
    thirdPlace: '中国',
    fourthPlace: '伊拉克'
  },
  {
    year: 1980,
    host: '科威特',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科威特',
    runnerUp: '韩国',
    thirdPlace: '伊朗',
    fourthPlace: '朝鲜'
  },
  {
    year: 1984,
    host: '新加坡',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '沙特阿拉伯',
    runnerUp: '中国',
    thirdPlace: '科威特',
    fourthPlace: '伊朗'
  },
  {
    year: 1988,
    host: '卡塔尔',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '沙特阿拉伯',
    runnerUp: '韩国',
    thirdPlace: '伊朗',
    fourthPlace: '中国'
  },
  {
    year: 1992,
    host: '日本',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '中国',
    fourthPlace: '阿联酋'
  },
  {
    year: 1996,
    host: '阿联酋',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '沙特阿拉伯',
    runnerUp: '阿联酋',
    thirdPlace: '伊朗',
    fourthPlace: '科威特'
  },
  {
    year: 2000,
    host: '黎巴嫩',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '韩国',
    fourthPlace: '中国'
  },
  {
    year: 2004,
    host: '中国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '中国',
    thirdPlace: '伊朗',
    fourthPlace: '巴林'
  },
  {
    year: 2007,
    host: '印度尼西亚/马来西亚/泰国/越南',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '伊拉克',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '韩国',
    fourthPlace: '日本'
  },
  {
    year: 2011,
    host: '卡塔尔',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '澳大利亚',
    thirdPlace: '韩国',
    fourthPlace: '乌兹别克斯坦'
  },
  {
    year: 2015,
    host: '澳大利亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '澳大利亚',
    runnerUp: '韩国',
    thirdPlace: '阿联酋',
    fourthPlace: '伊拉克'
  },
  {
    year: 2019,
    host: '阿联酋',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '卡塔尔',
    runnerUp: '日本',
    semiFinalists: ['伊朗', '阿联酋']
  },
  {
    year: 2023,
    host: '卡塔尔',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '卡塔尔',
    runnerUp: '约旦',
    semiFinalists: ['伊朗', '韩国']
  }
];

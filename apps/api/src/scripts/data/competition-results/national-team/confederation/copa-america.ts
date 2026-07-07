import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type TopThreeCompetitionResult,
  type SemiFinalistCompetitionResult
} from '../../../../helpers/competition-results.js';
import {
  ROUND_ROBIN_TOP_FOUR_REMARK,
  FINAL_ROUND_TOP_FOUR_REMARK
} from '../../../../helpers/competition-remarks.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const COPA_AMERICA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'COPA_AMERICA',
  name: '美洲杯',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'confederation',
  sources: [
    {
      label: 'Copa America - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica',
      remark: '用于交叉核对历届主办地、冠军、亚军、季军/殿军或四强、参赛队数量。'
    },
    {
      label: 'Copa America records and statistics - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica_records_and_statistics',
      remark: '用于交叉核对历届前四名、卫冕冠军成绩和特殊赛制年份。'
    },
    {
      label: '1975 Copa America - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/1975_Copa_Am%C3%A9rica',
      remark: '用于核对无固定主办地、半决赛负者不设三四名赛的特殊届次。'
    },
    {
      label: '1979 Copa America - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/1979_Copa_Am%C3%A9rica',
      remark: '用于核对无固定主办地、半决赛负者不设三四名赛的特殊届次。'
    },
    {
      label: '1983 Copa America - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/1983_Copa_Am%C3%A9rica',
      remark: '用于核对无固定主办地、半决赛负者不设三四名赛的特殊届次。'
    }
  ],
  lastVerifiedAt: '2026-07-07',
  notes: [
    '1916-1967 多数为循环赛最终排名，按前四排名录入冠亚季殿，并在届次备注中说明并非实际三四名赛。',
    '1925 只有 3 队，按联赛前三口径录入冠军、亚军、季军。',
    '1975、1979、1983 无固定主办地且半决赛负者不打三四名赛，按冠军、亚军、两个四强录入。',
    '1989、1991 为最终阶段循环赛排名，按冠亚季殿字段保存前四排名，并在届次备注中说明不是实际决赛/三四名赛。',
    '美洲杯赛事本体归属南美足联；墨西哥、美国、加拿大、洪都拉斯等受邀球队按实际 standings 归属到对应国家。'
  ]
};

export const COPA_AMERICA_RESULTS: Array<
  TopFourCompetitionResult | TopThreeCompetitionResult | SemiFinalistCompetitionResult
> = [
  {
    year: 1916,
    host: '阿根廷',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '智利'
  },
  {
    year: 1917,
    host: '乌拉圭',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '智利'
  },
  {
    year: 1919,
    host: '巴西',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '巴西',
    runnerUp: '乌拉圭',
    thirdPlace: '阿根廷',
    fourthPlace: '智利'
  },
  {
    year: 1920,
    host: '智利',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '智利'
  },
  {
    year: 1921,
    host: '阿根廷',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1922,
    host: '巴西',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '巴西',
    runnerUp: '巴拉圭',
    thirdPlace: '乌拉圭',
    fourthPlace: '阿根廷'
  },
  {
    year: 1923,
    host: '乌拉圭',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴拉圭',
    fourthPlace: '巴西'
  },
  {
    year: 1924,
    host: '乌拉圭',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1925,
    host: '阿根廷',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '本届只有 3 支球队参赛，按循环赛前三录入。',
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '巴拉圭'
  },
  {
    year: 1926,
    host: '智利',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '智利',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1927,
    host: '秘鲁',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '乌拉圭',
    thirdPlace: '秘鲁',
    fourthPlace: '玻利维亚'
  },
  {
    year: 1929,
    host: '阿根廷',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴拉圭',
    thirdPlace: '乌拉圭',
    fourthPlace: '秘鲁'
  },
  {
    year: 1935,
    host: '秘鲁',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '秘鲁',
    fourthPlace: '智利'
  },
  {
    year: 1937,
    host: '阿根廷',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1939,
    host: '秘鲁',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '秘鲁',
    runnerUp: '乌拉圭',
    thirdPlace: '巴拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1941,
    host: '智利',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '乌拉圭',
    thirdPlace: '智利',
    fourthPlace: '秘鲁'
  },
  {
    year: 1942,
    host: '乌拉圭',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1945,
    host: '智利',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '智利',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1946,
    host: '阿根廷',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '巴拉圭',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1947,
    host: '厄瓜多尔',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴拉圭',
    thirdPlace: '乌拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1949,
    host: '巴西',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '巴西',
    runnerUp: '巴拉圭',
    thirdPlace: '秘鲁',
    fourthPlace: '玻利维亚'
  },
  {
    year: 1953,
    host: '秘鲁',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '巴拉圭',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1955,
    host: '智利',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '智利',
    thirdPlace: '秘鲁',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1956,
    host: '乌拉圭',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '智利',
    thirdPlace: '阿根廷',
    fourthPlace: '巴西'
  },
  {
    year: 1957,
    host: '秘鲁',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '秘鲁'
  },
  {
    year: 1959,
    name: '1959年 阿根廷',
    host: '阿根廷',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '巴拉圭',
    fourthPlace: '秘鲁'
  },
  {
    year: 1959,
    name: '1959年 厄瓜多尔',
    host: '厄瓜多尔',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '厄瓜多尔'
  },
  {
    year: 1963,
    host: '玻利维亚',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '玻利维亚',
    runnerUp: '巴拉圭',
    thirdPlace: '阿根廷',
    fourthPlace: '巴西'
  },
  {
    year: 1967,
    host: '乌拉圭',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '智利',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1975,
    host: '主客场制',
    quantity: 10,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '秘鲁',
    runnerUp: '哥伦比亚',
    semiFinalists: ['巴西', '乌拉圭']
  },
  {
    year: 1979,
    host: '主客场制',
    quantity: 10,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '巴拉圭',
    runnerUp: '智利',
    semiFinalists: ['巴西', '秘鲁']
  },
  {
    year: 1983,
    host: '主客场制',
    quantity: 10,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '乌拉圭',
    runnerUp: '巴西',
    semiFinalists: ['巴拉圭', '秘鲁']
  },
  {
    year: 1987,
    host: '阿根廷',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '智利',
    thirdPlace: '哥伦比亚',
    fourthPlace: '阿根廷'
  },
  {
    year: 1989,
    host: '巴西',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: FINAL_ROUND_TOP_FOUR_REMARK,
    champion: '巴西',
    runnerUp: '乌拉圭',
    thirdPlace: '阿根廷',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1991,
    host: '智利',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: FINAL_ROUND_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '智利',
    fourthPlace: '哥伦比亚'
  },
  {
    year: 1993,
    host: '厄瓜多尔',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '墨西哥',
    thirdPlace: '哥伦比亚',
    fourthPlace: '厄瓜多尔'
  },
  {
    year: 1995,
    host: '乌拉圭',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '巴西',
    thirdPlace: '哥伦比亚',
    fourthPlace: '美国'
  },
  {
    year: 1997,
    host: '玻利维亚',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '玻利维亚',
    thirdPlace: '墨西哥',
    fourthPlace: '秘鲁'
  },
  {
    year: 1999,
    host: '巴拉圭',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '乌拉圭',
    thirdPlace: '墨西哥',
    fourthPlace: '智利'
  },
  {
    year: 2001,
    host: '哥伦比亚',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '哥伦比亚',
    runnerUp: '墨西哥',
    thirdPlace: '洪都拉斯',
    fourthPlace: '乌拉圭'
  },
  {
    year: 2004,
    host: '秘鲁',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '阿根廷',
    thirdPlace: '乌拉圭',
    fourthPlace: '哥伦比亚'
  },
  {
    year: 2007,
    host: '委内瑞拉',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '阿根廷',
    thirdPlace: '墨西哥',
    fourthPlace: '乌拉圭'
  },
  {
    year: 2011,
    host: '阿根廷',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '巴拉圭',
    thirdPlace: '秘鲁',
    fourthPlace: '委内瑞拉'
  },
  {
    year: 2015,
    host: '智利',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '智利',
    runnerUp: '阿根廷',
    thirdPlace: '秘鲁',
    fourthPlace: '巴拉圭'
  },
  {
    year: 2016,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '智利',
    runnerUp: '阿根廷',
    thirdPlace: '哥伦比亚',
    fourthPlace: '美国'
  },
  {
    year: 2019,
    host: '巴西',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '秘鲁',
    thirdPlace: '阿根廷',
    fourthPlace: '智利'
  },
  {
    year: 2021,
    host: '巴西',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '哥伦比亚',
    fourthPlace: '秘鲁'
  },
  {
    year: 2024,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '哥伦比亚',
    thirdPlace: '乌拉圭',
    fourthPlace: '加拿大'
  }
];

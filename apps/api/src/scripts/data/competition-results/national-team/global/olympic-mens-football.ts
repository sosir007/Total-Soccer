import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type DoubleThirdCompetitionResult
} from '../../../../helpers/competition-results.js';
import { pickSeedCountries, pickHistoricalCountries } from '../../../../helpers/seed-data.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const OLYMPIC_MENS_FOOTBALL_METADATA: CompetitionDataMetadata = {
  competitionCode: 'OLYMPIC_MENS_FOOTBALL',
  name: '奥运会男子足球赛',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'global',
  sources: [
    {
      label: 'Football at the Summer Olympics - Wikipedia men results table',
      url: 'https://en.wikipedia.org/wiki/Football_at_the_Summer_Olympics',
      remark: '用于交叉核对 1908-2024 男足正式结果、奖牌/第四名、主办地和参赛队数量。'
    },
    {
      label: 'Football at the 1972 Summer Olympics - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Football_at_the_1972_Summer_Olympics',
      remark: '用于核对 1972 苏联与东德并列铜牌口径。'
    },
    {
      label: '2024 Summer Olympics men tournament - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Football_at_the_2024_Summer_Olympics_%E2%80%93_Men%27s_tournament',
      remark: '用于核对最近一届奥运男足名次。'
    }
  ],
  lastVerifiedAt: '2026-07-07',
  notes: [
    '本 seed 从 1908 开始录入正式国家队/奥运代表队时代结果，不录入 1900、1904 俱乐部/混合代表队口径和 1932 未举办届次。',
    '1972 使用并列季军口径，苏联与东德均按季军录入，不录殿军。',
    '2020 届次保留年份 2020，并在届次备注中说明实际于 2021 年举办。',
    '英国奥运队独立统计，不归并英格兰；东德、德国联队继承到德国；苏联、西德、捷克斯洛伐克、南斯拉夫、阿拉伯联合共和国沿用系统历史国家继承口径。',
    '奥运荣誉分按 OLYMPIC_STAGE 年份阶段换算，不做频率/规模换算。'
  ]
};

export const REQUIRED_COUNTRIES = pickSeedCountries([
  '喀麦隆',
  '埃及',
  '加纳',
  '摩洛哥',
  '尼日利亚',
  '印度',
  '伊拉克',
  '日本',
  '韩国',
  '澳大利亚',
  '洪都拉斯',
  '墨西哥',
  '美国',
  '奥地利',
  '比利时',
  '保加利亚',
  '捷克',
  '丹麦',
  '芬兰',
  '法国',
  '德国',
  '匈牙利',
  '意大利',
  '荷兰',
  '挪威',
  '波兰',
  '葡萄牙',
  '俄罗斯',
  '西班牙',
  '瑞典',
  '瑞士',
  '塞尔维亚',
  '斯洛伐克',
  '英国',
  '阿根廷',
  '巴西',
  '智利',
  '巴拉圭',
  '乌拉圭'
]);

export const HISTORICAL_COUNTRIES = pickHistoricalCountries([
  '苏联',
  '西德',
  '捷克斯洛伐克',
  '南斯拉夫',
  '东德',
  '德国联队',
  '阿拉伯联合共和国'
]);

export const OLYMPIC_RESULTS: Array<TopFourCompetitionResult | DoubleThirdCompetitionResult> = [
  {
    year: 1908,
    host: '英国',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '首届规范国家代表队口径的奥运会男子足球赛。',
    champion: '英国',
    runnerUp: '丹麦',
    thirdPlace: '荷兰',
    fourthPlace: '瑞典'
  },
  {
    year: 1912,
    host: '瑞典',
    quantity: 11,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '英国',
    runnerUp: '丹麦',
    thirdPlace: '荷兰',
    fourthPlace: '芬兰'
  },
  {
    year: 1920,
    host: '比利时',
    quantity: 14,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届决赛因捷克斯洛伐克退赛产生争议，奖牌名次按后续附加赛结果录入。',
    champion: '比利时',
    runnerUp: '西班牙',
    thirdPlace: '荷兰',
    fourthPlace: '法国'
  },
  {
    year: 1924,
    host: '法国',
    quantity: 22,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '瑞士',
    thirdPlace: '瑞典',
    fourthPlace: '荷兰'
  },
  {
    year: 1928,
    host: '荷兰',
    quantity: 17,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '意大利',
    fourthPlace: '埃及'
  },
  {
    year: 1936,
    host: '德国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '意大利',
    runnerUp: '奥地利',
    thirdPlace: '挪威',
    fourthPlace: '波兰'
  },
  {
    year: 1948,
    host: '英国',
    quantity: 18,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '瑞典',
    runnerUp: '南斯拉夫',
    thirdPlace: '丹麦',
    fourthPlace: '英国'
  },
  {
    year: 1952,
    host: '芬兰',
    quantity: 25,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '匈牙利',
    runnerUp: '南斯拉夫',
    thirdPlace: '瑞典',
    fourthPlace: '西德'
  },
  {
    year: 1956,
    host: '澳大利亚',
    quantity: 11,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏联',
    runnerUp: '南斯拉夫',
    thirdPlace: '保加利亚',
    fourthPlace: '印度'
  },
  {
    year: 1960,
    host: '意大利',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '南斯拉夫',
    runnerUp: '丹麦',
    thirdPlace: '匈牙利',
    fourthPlace: '意大利'
  },
  {
    year: 1964,
    host: '日本',
    quantity: 14,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '匈牙利',
    runnerUp: '捷克斯洛伐克',
    thirdPlace: '德国联队',
    fourthPlace: '阿拉伯联合共和国'
  },
  {
    year: 1968,
    host: '墨西哥',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '匈牙利',
    runnerUp: '保加利亚',
    thirdPlace: '日本',
    fourthPlace: '墨西哥'
  },
  {
    year: 1972,
    host: '西德',
    quantity: 16,
    mode: CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE,
    remark: '本届三四名赛打平，苏联和东德并列铜牌；无殿军。',
    champion: '波兰',
    runnerUp: '匈牙利',
    thirdPlaces: ['苏联', '东德']
  },
  {
    year: 1976,
    host: '加拿大',
    quantity: 13,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '东德',
    runnerUp: '波兰',
    thirdPlace: '苏联',
    fourthPlace: '巴西'
  },
  {
    year: 1980,
    host: '苏联',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '捷克斯洛伐克',
    runnerUp: '东德',
    thirdPlace: '苏联',
    fourthPlace: '南斯拉夫'
  },
  {
    year: 1984,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '法国',
    runnerUp: '巴西',
    thirdPlace: '南斯拉夫',
    fourthPlace: '意大利'
  },
  {
    year: 1988,
    host: '韩国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏联',
    runnerUp: '巴西',
    thirdPlace: '西德',
    fourthPlace: '意大利'
  },
  {
    year: 1992,
    host: '西班牙',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '波兰',
    thirdPlace: '加纳',
    fourthPlace: '澳大利亚'
  },
  {
    year: 1996,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '葡萄牙'
  },
  {
    year: 2000,
    host: '澳大利亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '西班牙',
    thirdPlace: '智利',
    fourthPlace: '美国'
  },
  {
    year: 2004,
    host: '希腊',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '巴拉圭',
    thirdPlace: '意大利',
    fourthPlace: '伊拉克'
  },
  {
    year: 2008,
    host: '中国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '尼日利亚',
    thirdPlace: '巴西',
    fourthPlace: '比利时'
  },
  {
    year: 2012,
    host: '英国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '墨西哥',
    runnerUp: '巴西',
    thirdPlace: '韩国',
    fourthPlace: '日本'
  },
  {
    year: 2016,
    host: '巴西',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '德国',
    thirdPlace: '尼日利亚',
    fourthPlace: '洪都拉斯'
  },
  {
    year: 2020,
    host: '日本',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届因疫情延期至 2021 年举办，届次仍按 2020 年录入。',
    champion: '巴西',
    runnerUp: '西班牙',
    thirdPlace: '墨西哥',
    fourthPlace: '日本'
  },
  {
    year: 2024,
    host: '法国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '法国',
    thirdPlace: '摩洛哥',
    fourthPlace: '埃及'
  }
];

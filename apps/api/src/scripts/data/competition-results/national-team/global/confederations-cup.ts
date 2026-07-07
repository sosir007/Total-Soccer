import { type TopFourCompetitionResult } from '../../../../helpers/competition-results.js';
import { pickSeedCountries } from '../../../../helpers/seed-data.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const CONFEDERATIONS_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'FIFA_CONFEDERATIONS_CUP',
  name: '国际足联联合会杯',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'global',
  sources: [
    {
      label: 'FIFA Confederations Cup - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup',
      remark: '用于交叉核对历届主办地、冠军、亚军、季军/殿军、参赛队数量。'
    },
    {
      label: '1992 King Fahd Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/1992_King_Fahd_Cup',
      remark: '用于核对联合会杯前身法赫德国王杯特殊备注。'
    },
    {
      label: '1995 King Fahd Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/1995_King_Fahd_Cup',
      remark: '用于核对联合会杯前身法赫德国王杯特殊备注。'
    }
  ],
  lastVerifiedAt: '2026-07-07',
  notes: [
    '1992、1995 为法赫德国王杯，作为国际足联联合会杯前身录入，并在届次备注中说明。',
    '1997-2017 按联合会杯正式届次录入冠军、亚军、季军、殿军。',
    '本赛事已停办，seed 不包含 2017 之后未来届次。'
  ]
};

export const REQUIRED_COUNTRIES = pickSeedCountries([
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

export const KING_FAHD_CUP_REMARK = '本届为国际足联联合会杯前身法赫德国王杯。';

export const CONFEDERATIONS_CUP_RESULTS: TopFourCompetitionResult[] = [
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

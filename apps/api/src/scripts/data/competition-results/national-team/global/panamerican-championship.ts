import { CompetitionEditionStandingMode } from '@prisma/client';
import { type TopFourCompetitionResult } from '../../../../helpers/competition-results.js';
import { ROUND_ROBIN_TOP_FOUR_REMARK } from '../../../../helpers/competition-remarks.js';
import { pickSeedCountries } from '../../../../helpers/seed-data.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const PANAMERICAN_CHAMPIONSHIP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'PANAMERICAN_CHAMPIONSHIP',
  name: '泛美锦标赛',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'global',
  sources: [
    {
      label: 'Panamerican Championship - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/Panamerican_Championship',
      remark: '用于核对 1952、1956、1960 三届赛事的主办地、前四名和参赛队数量。'
    },
    {
      label: 'Panamerican Championship - RSSSF',
      url: 'https://www.rsssf.org/tablesp/panamchamp.html',
      remark: '用于交叉核对泛美锦标赛历史背景、赛制和各届最终积分榜。'
    }
  ],
  lastVerifiedAt: '2026-07-15',
  notes: [
    '本赛事是泛美足球联合会组织的正式成年国家队赛事，共举办三届，1960 年后停办。',
    '三届均按循环赛最终排名产生前四名，因此按冠亚季殿录入；并非实际三四名赛。'
  ]
};

export const REQUIRED_COUNTRIES = pickSeedCountries([
  '阿根廷',
  '巴西',
  '智利',
  '哥斯达黎加',
  '墨西哥',
  '秘鲁',
  '乌拉圭'
]);

export const PANAMERICAN_CHAMPIONSHIP_RESULTS: TopFourCompetitionResult[] = [
  {
    year: 1952,
    host: '智利',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '巴西',
    runnerUp: '智利',
    thirdPlace: '乌拉圭',
    fourthPlace: '秘鲁'
  },
  {
    year: 1956,
    host: '墨西哥',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '巴西',
    runnerUp: '阿根廷',
    thirdPlace: '哥斯达黎加',
    fourthPlace: '秘鲁'
  },
  {
    year: 1960,
    host: '哥斯达黎加',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_TOP_FOUR_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '墨西哥',
    fourthPlace: '哥斯达黎加'
  }
];

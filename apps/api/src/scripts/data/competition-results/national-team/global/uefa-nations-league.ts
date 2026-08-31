import { CompetitionEditionStandingMode } from '@prisma/client';
import { type TopFourCompetitionResult } from '../../../../helpers/competition-results.js';
import { pickSeedCountries } from '../../../../helpers/seed-data.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const UEFA_NATIONS_LEAGUE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_NATIONS_LEAGUE',
  name: '欧洲国家联赛',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'custom',
  sources: [
    {
      label: 'UEFA Nations League roll of honour',
      url: 'https://www.uefa.com/uefanationsleague/news/026e-1372acedf4a0-4cf2bf8d3c1b-1000--uefa-nations-league-roll-of-honour/',
      remark: '用于核对历届冠军和决赛结果。'
    },
    {
      label: 'UEFA Nations League 2024/25 results',
      url: 'https://www.uefa.com/uefanationsleague/news/028a-1a23b4c739a8-07fe752f503f-1000--2024-25-nations-league-all-the-results/',
      remark: '用于核对最近一届冠亚季殿军。'
    },
    {
      label: 'UEFA Nations League - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/UEFA_Nations_League',
      remark: '用于交叉核对历届决赛周主办地、四强名次和赛制。'
    }
  ],
  lastVerifiedAt: '2026-08-27',
  notes: [
    '欧足联官方成年国家队赛事，2018-19 起每两年一届，League A 决赛周产生冠军、亚军、季军和殿军。',
    '项目口径按国家队其他一级杯赛计分，录入冠亚季殿军，但规则只计算冠亚季军，殿军展示不计分。',
    '虽然赛事归属欧足联，因现实荣誉认知明显低于欧洲杯，本系统不按国家队洲际一级杯赛处理。'
  ]
};

export const REQUIRED_COUNTRIES = pickSeedCountries([
  '比利时',
  '克罗地亚',
  '英格兰',
  '法国',
  '德国',
  '意大利',
  '荷兰',
  '葡萄牙',
  '西班牙',
  '瑞士'
]);

export const UEFA_NATIONS_LEAGUE_RESULTS: TopFourCompetitionResult[] = [
  {
    year: 2019,
    season: '2018-19',
    host: '葡萄牙',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '葡萄牙',
    runnerUp: '荷兰',
    thirdPlace: '英格兰',
    fourthPlace: '瑞士',
    remark: '首届欧洲国家联赛决赛周，葡萄牙 1-0 荷兰夺冠。'
  },
  {
    year: 2021,
    season: '2020-21',
    host: '意大利',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '法国',
    runnerUp: '西班牙',
    thirdPlace: '意大利',
    fourthPlace: '比利时',
    remark: '2020-21 欧洲国家联赛决赛周，法国 2-1 西班牙夺冠。'
  },
  {
    year: 2023,
    season: '2022-23',
    host: '荷兰',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '克罗地亚',
    thirdPlace: '意大利',
    fourthPlace: '荷兰',
    remark: '2022-23 欧洲国家联赛决赛周，西班牙 0-0 克罗地亚，点球 5-4 夺冠。'
  },
  {
    year: 2025,
    season: '2024-25',
    host: '德国',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '葡萄牙',
    runnerUp: '西班牙',
    thirdPlace: '法国',
    fourthPlace: '德国',
    remark: '2024-25 欧洲国家联赛决赛周，葡萄牙 2-2 西班牙，点球 5-3 夺冠。'
  }
];

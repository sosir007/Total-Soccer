import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type DoubleRunnerUpCompetitionResult,
  type TopThreeCompetitionResult
} from '../../../../helpers/competition-results.js';
import { pickHistoricalCountries, pickSeedCountries } from '../../../../helpers/seed-data.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const CENTRAL_EUROPEAN_INTERNATIONAL_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CENTRAL_EUROPEAN_INTERNATIONAL_CUP',
  name: '中欧国际杯',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'custom',
  sources: [
    {
      label: 'Central European International Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Central_European_International_Cup',
      remark: '用于核对赛事沿革、参赛队范围和各届最终名次。'
    },
    {
      label: 'International Cup - RSSSF',
      url: 'https://www.rsssf.org/tablesd/drgero.html',
      remark: '用于交叉核对职业组五届完赛赛事的最终排名和 1936-37 届中止状态。'
    }
  ],
  lastVerifiedAt: '2026-08-27',
  notes: [
    '赛事全称 European International Cup，1927-1960 年间由中欧成年国家队参加；每届采用跨多年主客场循环赛制。',
    '只录职业国家队正赛的五届完赛赛事：1927-30、1931-32、1933-35、1948-53、1955-60；1936-37 届因奥地利并入德国及二战而中止，不建届次。',
    '不录入同期两届业余组赛事，参赛队并非完整的成年国家队职业组口径。',
    '1927-30 届奥地利与捷克斯洛伐克并列亚军，不设季军；两队均按亚军录入。',
    '捷克斯洛伐克使用系统历史国家继承口径。'
  ]
};

export const REQUIRED_COUNTRIES = pickSeedCountries([
  '奥地利',
  '捷克',
  '斯洛伐克',
  '匈牙利',
  '意大利'
]);

export const HISTORICAL_COUNTRIES = pickHistoricalCountries(['捷克斯洛伐克']);

export type CentralEuropeanInternationalCupResult =
  | TopThreeCompetitionResult
  | DoubleRunnerUpCompetitionResult;

export const CENTRAL_EUROPEAN_INTERNATIONAL_CUP_RESULTS: CentralEuropeanInternationalCupResult[] = [
  {
    year: 1927,
    season: '1927-30',
    host: '主客场',
    quantity: 5,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    champion: '意大利',
    runnerUps: ['奥地利', '捷克斯洛伐克'],
    remark: '最终积分榜：意大利冠军，奥地利与捷克斯洛伐克同积 10 分并列亚军，不设季军。'
  },
  {
    year: 1931,
    season: '1931-32',
    host: '主客场',
    quantity: 5,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    champion: '奥地利',
    runnerUp: '意大利',
    thirdPlace: '匈牙利'
  },
  {
    year: 1933,
    season: '1933-35',
    host: '主客场',
    quantity: 5,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    champion: '意大利',
    runnerUp: '奥地利',
    thirdPlace: '匈牙利'
  },
  {
    year: 1948,
    season: '1948-53',
    host: '主客场',
    quantity: 5,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    champion: '匈牙利',
    runnerUp: '捷克斯洛伐克',
    thirdPlace: '奥地利'
  },
  {
    year: 1955,
    season: '1955-60',
    host: '主客场',
    quantity: 6,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    champion: '捷克斯洛伐克',
    runnerUp: '匈牙利',
    thirdPlace: '奥地利'
  }
];

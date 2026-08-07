import { CompetitionEditionStandingMode } from '@prisma/client';
import { type FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import { pickSeedCountries } from '../../../../helpers/seed-data.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const FINALISSIMA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'FINALISSIMA',
  name: '南美洲-欧洲冠军杯',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'custom',
  sources: [
    {
      label: 'Finalissima history - UEFA',
      url: 'https://www.uefa.com/finalissima/news/02a0-1f77cae6dc71-ae12f907ba16-1000--finalissima-history-the-previous-three-editions/',
      remark: '用于核对 1985、1993、2022 三届历史冠军和亚军。'
    },
    {
      label: 'Finalissima rebirth - UEFA',
      url: 'https://www.uefa.com/news/0276-1548731584fb-9b0bc2c985e2-1000--football-s-finalissima-history-and-rebirth/',
      remark: '用于核对赛事从阿特米奥·弗兰基杯到 Finalissima 的沿革。'
    },
    {
      label: '2026 Finalissima cancelled - UEFA',
      url: 'https://www.uefa.com/news-media/news/02a3-2026c631d084-67fdd005037f-1000--2026-edition-of-finalissi/',
      remark: '用于核对 2026 届取消状态。'
    }
  ],
  lastVerifiedAt: '2026-08-05',
  notes: [
    '赛事为欧洲杯冠军与美洲杯冠军之间的国家队冠军赛，旧名阿特米奥·弗兰基杯，2022 年后以 Finalissima 名义重启。',
    '当前只建 1985、1993、2022 三届正式完赛届次；2026 届已取消，不建届次，仅在赛事备注中说明。',
    '赛事按国家队其他一级杯赛处理，只记录冠军和亚军。'
  ]
};

export const REQUIRED_COUNTRIES = pickSeedCountries(['法国', '乌拉圭', '阿根廷', '丹麦', '意大利']);

export const FINALISSIMA_RESULTS: FinalOnlyCompetitionResult[] = [
  {
    year: 1985,
    host: '法国巴黎王子公园球场',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '法国',
    runnerUp: '乌拉圭',
    remark: '首届阿特米奥·弗兰基杯，法国 2-0 乌拉圭。'
  },
  {
    year: 1993,
    host: '阿根廷马德普拉塔何塞·玛丽亚·米内利体育场',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '阿根廷',
    runnerUp: '丹麦',
    remark: '阿特米奥·弗兰基杯，阿根廷 1-1 丹麦，点球 5-4 夺冠。'
  },
  {
    year: 2022,
    host: '英格兰伦敦温布利球场',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '阿根廷',
    runnerUp: '意大利',
    remark: 'Finalissima 重启届，阿根廷 3-0 意大利。'
  }
];

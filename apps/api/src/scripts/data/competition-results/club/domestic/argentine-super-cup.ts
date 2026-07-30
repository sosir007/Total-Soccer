import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_SUPER_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_SUPER_CUP',
  name: '阿根廷超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa Argentina - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_Argentina',
      remark: '用于核对赛事基础资料、停办年份与历届冠亚军。'
    },
    {
      label: 'Supercopa Argentina official page',
      url: 'https://www.copaargentina.org/es/supercopa.html',
      remark: '用于核对赛事现行状态和官方赛事口径。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件只负责创建阿根廷超级杯赛事本体，库内俱乐部 standings 走 domestic competition patches。',
    '2020、2021 届未举行，不创建荣誉届次；2025 届暂无已完赛结果，暂不录入。',
    '阿根廷超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合阿根廷 0.75 系数后实际为冠军 0.75、亚军 0.375。'
  ]
};

export const ARGENTINE_SUPER_CUP_RESULTS: SeedEdition[] = [];

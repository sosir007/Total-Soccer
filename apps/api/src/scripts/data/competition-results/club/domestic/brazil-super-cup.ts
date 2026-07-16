import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_SUPER_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_SUPER_CUP',
  name: '巴西超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa do Brasil - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_do_Brasil',
      remark: '用于核对 1990、1991、2020+ 官方连续口径与历届冠亚军。'
    },
    {
      label: 'CBF Supercopa do Brasil',
      url: 'https://www.cbf.com.br/futebol-brasileiro/noticias/supercopa-masculino',
      remark: '用于核对赛事官方命名与现行赛事信息。'
    }
  ],
  lastVerifiedAt: '2026-07-16',
  notes: [
    '本文件只负责创建巴西超级杯赛事本体，历届冠亚军 standings 统一走 domestic competition patches。',
    '采用官方连续口径：1990、1991、2020+ 统一归入同一赛事；1992 和 2018 非官方赛事不录入。',
    '巴西超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合巴西 0.75 系数后实际为冠军 0.75、亚军 0.375。'
  ]
};

export const BRAZIL_SUPER_CUP_RESULTS: SeedEdition[] = [];

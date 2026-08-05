import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ITALY_SUPER_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ITALY_SUPER_CUP',
  name: '意大利超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercoppa Italiana - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercoppa_Italiana',
      remark: '用于核对 1988 至 2025-26 历届冠军、亚军和四队制变更。'
    },
    {
      label: 'Lega Serie A - Supercoppa Italiana albo d oro',
      url: 'https://www.legaseriea.it/supercoppa/albo',
      remark: '用于核对 Lega Serie A 官方荣誉榜口径。'
    }
  ],
  lastVerifiedAt: '2026-08-05',
  notes: [
    '本文件只负责创建意大利超级杯赛事本体，历届冠亚军 standings 走 domestic competition patches。',
    '1988 年起办，通常由意甲冠军与意大利杯冠军参加；2023 起一度改为四队制。',
    '四队制届次仍只录最终冠军和亚军，不录半决赛负方。',
    '意大利超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，按意大利国内三级杯赛计分。'
  ]
};

export const ITALY_SUPER_CUP_RESULTS: SeedEdition[] = [];

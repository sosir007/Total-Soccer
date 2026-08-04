import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ITALY_COPPA_ITALIA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ITALY_COPPA_ITALIA',
  name: '意大利杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Coppa Italia - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Coppa_Italia',
      remark: '用于核对赛事基础资料、英文名和现行状态。'
    },
    {
      label: 'Italy - List of Cup Finals - RSSSF',
      url: 'https://www.rsssf.org/tablesi/italcuphist.html',
      remark: '用于核对 1922 年以来意大利杯历届冠军和亚军。'
    }
  ],
  lastVerifiedAt: '2026-08-04',
  notes: [
    '本文件只负责创建意大利杯赛事本体，历届冠亚军 standings 统一走 domestic competition patches。',
    '1926-27 赛事未完成，不创建荣誉届次。',
    '意大利杯命中 CLUB_DOMESTIC_LEVEL_1_CUP。'
  ]
};

export const ITALY_COPPA_ITALIA_RESULTS: SeedEdition[] = [];

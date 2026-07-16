import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_CUP',
  name: '巴西杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Copa do Brasil - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_do_Brasil',
      remark: '用于核对赛事基础资料与当前赛制。'
    },
    {
      label: 'List of Copa do Brasil winners - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Copa_do_Brasil_winners',
      remark: '用于核对 1989-2025 历届冠军与亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-16',
  notes: [
    '本文件只负责创建巴西杯赛事本体，历届冠亚军 standings 统一走 domestic competition patches。',
    '巴西杯命中 CLUB_DOMESTIC_LEVEL_1_CUP，结合巴西 0.75 系数后实际为冠军 2.25、亚军 1.125。'
  ]
};

export const BRAZIL_CUP_RESULTS: SeedEdition[] = [];

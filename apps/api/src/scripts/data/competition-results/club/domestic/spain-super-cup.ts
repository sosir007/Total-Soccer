import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const SPAIN_SUPER_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_SUPER_CUP',
  name: '西班牙超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa de Espana - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_de_Espa%C3%B1a',
      remark: '用于核对赛事基础资料、历届冠亚军和特殊未举行届次。'
    },
    {
      label: 'Real Federacion Espanola de Futbol - Supercopa de Espana',
      url: 'https://rfef.es/es/noticias/una-supercopa-mas-y-ya-van-16-para-el-fc-barcelona',
      remark: '用于核对 RFEF 官方 1982-2026 历史冠军口径。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本文件只负责创建西班牙超级杯赛事本体，历届冠亚军 standings 走 domestic competition patches。',
    '只录 1982 年以来正式 Supercopa de Espana，不混入 1940-1953 的前身赛事。',
    '1986、1987 未举行，不创建荣誉届次；1984、1989 因双冠自动授予冠军，只录冠军不录亚军；2019 不单独创建届次。',
    '西班牙超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，按西班牙国内三级杯赛计分。'
  ]
};

export const SPAIN_SUPER_CUP_RESULTS: SeedEdition[] = [];

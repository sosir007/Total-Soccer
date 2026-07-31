import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const SPAIN_LA_LIGA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_LA_LIGA',
  name: '西班牙足球甲级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of Spanish football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Spanish_football_champions',
      remark: '用于核对西班牙甲级联赛历届冠军、亚军和季军。'
    },
    {
      label: 'Spain, Final tables 1928- - RSSSF',
      url: 'https://www.rsssf.org/tabless/spanhist.html',
      remark: '用于交叉核对西班牙甲级联赛历史赛制和各年代最终名次。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本文件只负责创建西班牙足球甲级联赛赛事本体，历届前三 standings 统一走 domestic competition patches。',
    '系统按西班牙国内一级联赛处理。'
  ]
};

export const SPAIN_LA_LIGA_RESULTS: SeedEdition[] = [];

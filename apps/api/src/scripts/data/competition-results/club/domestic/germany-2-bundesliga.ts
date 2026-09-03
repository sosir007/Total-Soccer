import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const GERMANY_2_BUNDESLIGA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'GERMANY_2_BUNDESLIGA',
  name: '德国足球乙级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: '2. Bundesliga - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2._Bundesliga',
      remark: '用于核对赛事基础资料、当前状态和分区赛季沿革。'
    },
    {
      label: 'West Germany - List of Second Level Champions - RSSSF',
      url: 'https://www.rsssf.org/tablesd/duit2champ.html',
      remark: '用于核对 1974-75 至 2025-26 历届冠军、亚军、第三名和分区赛季口径。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本文件只负责创建德国足球乙级联赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '1974-75 至 1980-81、1991-92 为南北分区赛季；本项目按分区届次拆分为北区/南区两条 edition，并按 championShare=2 分摊冠军分。',
    '当前仅按数据库已存在俱乐部录入对应 standings，库外球队名次留空。'
  ]
};

export const GERMANY_2_BUNDESLIGA_RESULTS: SeedEdition[] = [];

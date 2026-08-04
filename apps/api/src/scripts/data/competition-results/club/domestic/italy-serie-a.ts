import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ITALY_SERIE_A_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ITALY_SERIE_A',
  name: '意大利足球甲级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Italy - List of Champions - RSSSF',
      url: 'https://www.rsssf.org/tablesi/italchamp.html',
      remark: '用于核对 1898 年以来意大利顶级联赛及其前身官方冠军。'
    },
    {
      label: 'Italy - Serie A All-Time Final Placings - RSSSF',
      url: 'https://www.rsssf.org/tablesi/italplall.html',
      remark: '用于核对 1929-30 以来意甲最终前三名。'
    },
    {
      label: 'Serie A - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Serie_A',
      remark: '用于核对赛事基础资料、英文名和现行状态。'
    }
  ],
  lastVerifiedAt: '2026-08-04',
  notes: [
    '本文件只负责创建意大利足球甲级联赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '1898-1929 前身冠军纳入同一赛事口径；1926-27 冠军被撤销未授予，不生成冠军 standings。',
    '系统按意大利国内一级联赛处理。'
  ]
};

export const ITALY_SERIE_A_RESULTS: SeedEdition[] = [];

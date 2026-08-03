import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const SPAIN_SEGUNDA_DIVISION_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_SEGUNDA_DIVISION',
  name: '西班牙足球乙级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Segunda Division - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Segunda_Divisi%C3%B3n',
      remark: '用于核对赛事基础资料、当前赛事状态和近年冠军口径。'
    },
    {
      label: 'Spain - List of Second Division Champions - RSSSF',
      url: 'https://www.rsssf.org/tabless/span2champ.html',
      remark: '用于核对 1928-29 以来西班牙第二级别联赛冠军列表。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本文件只负责创建西班牙足球乙级联赛赛事本体，历届冠军 standings 走 domestic competition patches。',
    '系统按西班牙国内二级联赛处理；当前商业名 LaLiga Hypermotion 只作为赛事说明，不作为主名称。',
    '1949-50 至 1967-68 区域化赛制存在同赛季多冠军，补录时按 championShare 分摊冠军分。'
  ]
};

export const SPAIN_SEGUNDA_DIVISION_RESULTS: SeedEdition[] = [];

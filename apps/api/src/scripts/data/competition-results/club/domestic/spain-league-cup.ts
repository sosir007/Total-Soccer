import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const SPAIN_LEAGUE_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_LEAGUE_CUP',
  name: '西班牙联赛杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Copa de la Liga - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_de_la_Liga',
      remark: '用于核对赛事基础资料、1983-1986 历届冠军和亚军。'
    },
    {
      label: 'Spain - List of League Cup Finals - RSSSF',
      url: 'https://www.rsssf.org/tabless/spanleagcuphist.html',
      remark: '用于交叉核对西班牙联赛杯决赛年份、冠亚军和两回合赛果。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本文件只负责创建西班牙联赛杯赛事本体，历届冠亚军 standings 走 domestic competition patches。',
    '只录 1983-1986 年正式 Copa de la Liga，不混入其他前身或同名短期赛事。',
    '西班牙联赛杯命中 CLUB_DOMESTIC_LEVEL_2_CUP，按西班牙国内二级杯赛计分。'
  ]
};

export const SPAIN_LEAGUE_CUP_RESULTS: SeedEdition[] = [];

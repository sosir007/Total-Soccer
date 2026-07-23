import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const CAMPEONATO_PAULISTA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CAMPEONATO_PAULISTA',
  name: '保利斯塔锦标赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeonato Paulista - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Campeonato_Paulista',
      remark: '用于核对赛事基础资料、历史性质和现行状态。'
    },
    {
      label: 'Campeonato Paulista podium - RSSSF Brazil',
      url: 'https://www.rsssfbrasil.com/tablessz/sppodium.htm',
      remark: '用于核对历届四强结果。'
    }
  ],
  lastVerifiedAt: '2026-07-23',
  notes: [
    '本文件只负责创建保利斯塔锦标赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '保利斯塔锦标赛是巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。'
  ]
};

export const CAMPEONATO_PAULISTA_RESULTS: SeedEdition[] = [];

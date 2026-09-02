import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ENGLAND_PREMIER_LEAGUE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ENGLAND_PREMIER_LEAGUE',
  name: '英格兰足球超级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Premier League - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Premier_League',
      remark: '用于核对赛事基础资料、英文名、现行状态和创立背景。'
    },
    {
      label: 'List of Premier League seasons - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Premier_League_seasons',
      remark: '用于核对 1992-93 至 2024-25 各赛季最终前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-01',
  notes: [
    '本文件只负责创建英格兰足球超级联赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '英超自 1992-93 赛季起举办；旧英甲另行按历史赛事处理，不并入本文件。',
    '系统按英格兰国内一级联赛处理。'
  ]
};

export const ENGLAND_PREMIER_LEAGUE_RESULTS: SeedEdition[] = [];

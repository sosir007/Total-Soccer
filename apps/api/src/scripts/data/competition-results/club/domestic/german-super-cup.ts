import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const GERMAN_SUPER_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'GERMAN_SUPER_CUP',
  name: '德国超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Franz Beckenbauer Supercup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Franz_Beckenbauer_Supercup',
      remark: '用于核对 1987-2026 历届正式冠亚军、历史更名和非正式届次排除口径。'
    },
    {
      label: 'The history of the Franz Beckenbauer Supercup - Bundesliga',
      url: 'https://www.bundesliga.com/en/bundesliga/news/history-of-supercup-records-goals-all-matches-bayern-dortmund-leipzig-20635',
      remark: '用于核对 2010-2026 历届比分、点球和 2025-26 以后改名口径。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本文件只负责创建德国超级杯赛事本体，历届 standings 统一走 domestic competition patches。',
    '1987-1996 为 DFB-Supercup，2010-2024 为 DFL-Supercup，2025 起以 Franz Beckenbauer Supercup 名义举办；2008、2009 非正式届次不纳入。',
    '只按当前数据库已存在的俱乐部录入荣誉；库外历史俱乐部或暂缺俱乐部不补新实体。',
    '德国超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，按德国国内三级杯赛计分。'
  ]
};

export const GERMAN_SUPER_CUP_RESULTS: SeedEdition[] = [];

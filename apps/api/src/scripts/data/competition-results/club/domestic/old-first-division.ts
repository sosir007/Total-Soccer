import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ENGLAND_FIRST_DIVISION_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ENGLAND_FIRST_DIVISION',
  name: '英格兰足球甲级联赛（旧英甲）',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Football League First Division - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Football_League_First_Division',
      remark: '用于核对旧英甲赛事基础资料、英文名、停办状态和历史背景。'
    },
    {
      label: 'List of English football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_English_football_champions',
      remark: '用于核对 1888-89 至 1991-92 各赛季最终前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-01',
  notes: [
    '本文件只负责创建英格兰足球甲级联赛（旧英甲）赛事本体，历届 standings 统一走 domestic competition patches。',
    '旧英甲自 1888-89 赛季起举办，1991-92 赛季结束后由英超接替，不并入英超文件。',
    '历史队名在补录文件中统一映射到现有库内俱乐部实体。'
  ]
};

export const ENGLAND_FIRST_DIVISION_RESULTS: SeedEdition[] = [];

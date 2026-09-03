import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const GERMAN_LEAGUE_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'GERMAN_LEAGUE_CUP',
  name: '德国联赛杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'DFL-Ligapokal - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/DFL-Ligapokal',
      remark: '用于核对赛事基础资料、1972-73 前身和 1997-2007 DFL-Ligapokal 历届冠亚军。'
    },
    {
      label: 'DFL-Ligapokal honours - Sport-Histoire',
      url: 'https://www.sport-histoire.fr/en/Sport/Football/Honours/DFL-Ligapokal.php',
      remark: '用于交叉核对历届决赛比分和冠亚军。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本文件只负责创建德国联赛杯赛事本体，历届 standings 统一走 domestic competition patches。',
    '1972-73 DFB-Ligapokal 作为前身纳入同一德国联赛杯口径；1997-2007 为 DFL-Ligapokal，2008 后停办。',
    '只按当前数据库已存在的俱乐部录入荣誉，不主动新增俱乐部。',
    '德国联赛杯命中 CLUB_DOMESTIC_LEVEL_2_CUP，按德国国内二级杯赛计分。'
  ]
};

export const GERMAN_LEAGUE_CUP_RESULTS: SeedEdition[] = [];

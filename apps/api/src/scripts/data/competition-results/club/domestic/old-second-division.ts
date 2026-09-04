import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ENGLAND_SECOND_DIVISION_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ENGLAND_SECOND_DIVISION',
  name: '英格兰足球乙级联赛（旧英乙）',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Football League Second Division - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Football_League_Second_Division',
      remark: '用于核对旧英乙赛事基础资料、英文名、停办状态和历史背景。'
    },
    {
      label: 'England historical league tables - RSSSF',
      url: 'https://www.rsssf.org/engpaul/FLA/',
      remark: '用于逐季核对 1892-93 至 1991-92 的最终积分榜前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本文件只负责创建英格兰足球乙级联赛（旧英乙）赛事本体，历届 standings 后续统一走 domestic competition patches。',
    '旧英乙为 1892-93 至 1991-92 的英格兰第二级别联赛，1992-93 起由英格兰足球冠军联赛体系接替。',
    '旧英乙历届最终前三名已按当前库内俱乐部补录；库外球队不创建新俱乐部。'
  ]
};

export const ENGLAND_SECOND_DIVISION_RESULTS: SeedEdition[] = [];

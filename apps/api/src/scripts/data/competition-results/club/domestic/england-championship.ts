import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ENGLAND_CHAMPIONSHIP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ENGLAND_CHAMPIONSHIP',
  name: '英格兰足球冠军联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'EFL Championship - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/EFL_Championship',
      remark: '用于核对赛事基础资料、现行状态和历史沿革。'
    },
    {
      label: 'List of winners of the EFL Championship and predecessors - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_winners_of_the_EFL_Championship_and_predecessors',
      remark: '用于核对 1992-93 至 2024-25 英格兰第二级别联赛最终前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本文件只负责创建英格兰足球冠军联赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '本赛事按英格兰第二级别 1992 断点后的现行体系处理：1992-93 至 2003-04 为 Football League First Division，2004-05 起为 Football League Championship / EFL Championship。',
    '1992-93 至 2003-04 的 Football League First Division 是英超成立后的第二级联赛，不等同于顶级旧英甲。'
  ]
};

export const ENGLAND_CHAMPIONSHIP_RESULTS: SeedEdition[] = [];

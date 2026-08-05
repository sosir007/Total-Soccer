import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ITALY_SERIE_B_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ITALY_SERIE_B',
  name: '意大利足球乙级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of Serie B champions and promotions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Serie_B_champions_and_promotions',
      remark: '用于核对意大利第二级别联赛及前身赛事历届冠军、亚军、季军和其他升级球队。'
    },
    {
      label: 'Serie B - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Serie_B',
      remark: '用于核对赛事基础资料、英文名、当前状态和赛制沿革。'
    }
  ],
  lastVerifiedAt: '2026-08-05',
  notes: [
    '本文件只负责创建意大利足球乙级联赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '系统按意大利国内二级联赛处理；项目口径纳入 1922-1928 的第二级别前身赛事。',
    '补录数据只写入当前库内已有俱乐部，库外俱乐部不会由本赛事补录自动创建。'
  ]
};

export const ITALY_SERIE_B_RESULTS: SeedEdition[] = [];

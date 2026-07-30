import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_PRIMERA_NACIONAL_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_PRIMERA_NACIONAL',
  name: '阿根廷足球乙级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Primera Nacional - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Primera_Nacional',
      remark: '用于核对赛事基础资料、英文名、历史名称和 1986-87 以来冠军/亚军/季军表。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件只负责创建阿根廷足球乙级联赛赛事本体，库内俱乐部 standings 走 domestic competition patches。',
    '赛事前身为 Primera B Nacional，现名 Primera Nacional；系统按阿根廷国内二级联赛处理。',
    '阿根廷国内系数为 0.75，二级联赛冠军原始分 2，常规单冠实际冠军分为 1.5。'
  ]
};

export const ARGENTINE_PRIMERA_NACIONAL_RESULTS: SeedEdition[] = [];

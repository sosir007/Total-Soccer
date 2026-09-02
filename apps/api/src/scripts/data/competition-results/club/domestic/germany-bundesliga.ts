import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const GERMANY_BUNDESLIGA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'GERMANY_BUNDESLIGA',
  name: '德国足球甲级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Bundesliga - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Bundesliga',
      remark: '用于核对赛事基础资料、英文名、现行状态和 1963-64 创立背景。'
    },
    {
      label: 'List of German football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_German_football_champions',
      remark: '用于核对德甲成立以来德国顶级联赛冠军口径。'
    },
    {
      label: 'German champions in the Bundesliga - Bundesliga official',
      url: 'https://www.bundesliga.com/en/faq/10-things-on-the-bundesliga/german-champions-in-the-bundesliga-10554',
      remark: '用于交叉核对德甲历届冠军。'
    }
  ],
  lastVerifiedAt: '2026-09-02',
  notes: [
    '本文件只负责创建德国足球甲级联赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '德国足球锦标赛 1903-1963 不纳入本赛事，后续如需录入应单独建“德国足球锦标赛”。',
    '系统按德国国内一级联赛处理。'
  ]
};

export const GERMANY_BUNDESLIGA_RESULTS: SeedEdition[] = [];

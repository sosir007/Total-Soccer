import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_SERIE_B_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_SERIE_B',
  name: '巴西乙级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeonato Brasileiro Serie B - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Campeonato_Brasileiro_S%C3%A9rie_B',
      remark: '用于核对赛事基础资料、官方赛季范围与历届冠军列表。'
    },
    {
      label: 'Campeonato Brasileiro de Futebol - Serie B - Portuguese Wikipedia',
      url: 'https://pt.wikipedia.org/wiki/Campeonato_Brasileiro_de_Futebol_-_S%C3%A9rie_B',
      remark: '用于交叉核对近年积分榜前三、升级名额和赛事历史说明。'
    }
  ],
  lastVerifiedAt: '2026-07-15',
  notes: [
    '本文件只负责创建巴西乙级联赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '本轮按官方认可赛季口径录入，1973-1979、1986、1987、1993、2000 等未办或非官方赛季不纳入。'
  ]
};

export const BRAZIL_SERIE_B_RESULTS: SeedEdition[] = [];

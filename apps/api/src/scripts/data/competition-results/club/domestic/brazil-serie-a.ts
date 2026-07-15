import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_SERIE_A_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_SERIE_A',
  name: '巴西甲级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeonato Brasileiro Serie A - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Campeonato_Brasileiro_S%C3%A9rie_A',
      remark: '用于核对赛事基础资料、历史沿革和统一赛事口径。'
    },
    {
      label: 'List of Brazilian football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Brazilian_football_champions',
      remark: '用于按 CBF 官方承认的全国冠军口径整理 1937、1959-1968、1967-1970、1971+ 历届前三。'
    }
  ],
  lastVerifiedAt: '2026-07-15',
  notes: [
    '本文件只负责创建巴西甲级联赛赛事本体，历届前三 standings 统一走 domestic competition patches。',
    '系统口径按 CBF 官方承认的全国冠军体系整合，包含 1937、Taça Brasil、Roberto Gomes Pedrosa / Taça de Prata 与 1971 年后的 Campeonato Brasileiro。'
  ]
};

export const BRAZIL_SERIE_A_RESULTS: SeedEdition[] = [];

import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_INTERNATIONAL_SUPER_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_INTERNATIONAL_SUPER_CUP',
  name: '阿根廷国际超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa Internacional - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_Internacional',
      remark: '用于核对赛事基础资料、历届冠亚军与赛事命名。'
    },
    {
      label: 'AFA Supercopa Internacional 2024',
      url: 'https://www.afa.com.ar/441/posts/velez-derroto-2-0-a-estudiantes-y-se-quedo-con-la-supercopa-internacional',
      remark: '用于核对 2024 届冠军与亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件只负责创建阿根廷国际超级杯赛事本体，库内俱乐部 standings 走 domestic competition patches。',
    '“国际”来自赛事海外举办口径，不代表洲际或全球赛事；系统按阿根廷国内超级杯类赛事处理。',
    '赛事举办地和连续性曾调整，但 2024 届已完赛，系统按现行赛事维护。',
    '阿根廷国际超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合阿根廷 0.75 系数后实际为冠军 0.75、亚军 0.375。'
  ]
};

export const ARGENTINE_INTERNATIONAL_SUPER_CUP_RESULTS: SeedEdition[] = [];

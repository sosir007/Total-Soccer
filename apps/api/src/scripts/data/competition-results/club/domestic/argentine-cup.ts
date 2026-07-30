import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_CUP',
  name: '阿根廷杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Copa Argentina - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_Argentina',
      remark: '用于核对赛事基础资料、历史沿革、旧版与现代版历届冠亚军。'
    },
    {
      label: 'Copa Argentina official website',
      url: 'https://www.copaargentina.org/',
      remark: '用于核对赛事现行状态和官方赛事口径。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件只负责创建阿根廷杯赛事本体，库内俱乐部 standings 走 domestic competition patches。',
    '1969 年旧版阿根廷杯有正式冠军；1970 年赛事未完成，不创建荣誉届次。',
    '现代阿根廷杯自 2011-12 赛季重启；系统按阿根廷国内一级杯赛处理。',
    '阿根廷国内系数为 0.75，一级杯赛冠军原始分 3，常规实际冠军分为 2.25。'
  ]
};

export const ARGENTINE_CUP_RESULTS: SeedEdition[] = [];

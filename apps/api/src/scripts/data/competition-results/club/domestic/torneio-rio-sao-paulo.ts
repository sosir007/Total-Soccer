import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const TORNEIO_RIO_SAO_PAULO_METADATA: CompetitionDataMetadata = {
  competitionCode: 'TORNEIO_RIO_SAO_PAULO',
  name: '里约-圣保罗锦标赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Torneio Rio-São Paulo - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Torneio_Rio_%E2%80%93_S%C3%A3o_Paulo',
      remark: '用于核对赛事基础资料和停办状态。'
    },
    {
      label: 'Torneio Rio-São Paulo - List of Champions - RSSSF',
      url: 'https://www.rsssf.org/tablesr/riosplchamp.html',
      remark: '用于核对历届冠军和并列冠军。'
    }
  ],
  lastVerifiedAt: '2026-07-23',
  notes: [
    '本文件只负责创建里约-圣保罗锦标赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '里约-圣保罗锦标赛是巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。'
  ]
};

export const TORNEIO_RIO_SAO_PAULO_RESULTS: SeedEdition[] = [];

import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const SPAIN_COPA_DEL_REY_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_COPA_DEL_REY',
  name: '西班牙国王杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of Copa del Rey finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Copa_del_Rey_finals',
      remark: '用于核对历届西班牙国王杯决赛、同年平行决赛与历史队名。'
    },
    {
      label: 'Copa del Rey - RFEF',
      url: 'https://rfef.es/es/competiciones/copa-de-su-majestad-el-rey',
      remark: '用于核对赛事官方口径、历史沿革和现行状态。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本文件只负责创建西班牙国王杯赛事本体，历届冠亚军 standings 走 domestic competition patches。',
    '1904 年决赛未进行但冠军被授予 Athletic Bilbao；1910、1913 年存在平行官方决赛，按赛事原表分别录入。',
    '历史前身队名只在与当前库现有俱乐部存在明确继承关系时映射；其余旧队名留空不新建俱乐部。'
  ]
};

export const SPAIN_COPA_DEL_REY_RESULTS: SeedEdition[] = [];

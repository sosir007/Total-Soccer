import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_PRIMERA_DIVISION_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_PRIMERA_DIVISION',
  name: '阿根廷足球甲级联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeones de Primera Division - AFA',
      url: 'https://www.afa.com.ar/5292/pages/campeones-de-primera-division',
      remark: '用于核对阿根廷甲级联赛官方冠军口径和 1931 年以来职业时代冠军列表。'
    },
    {
      label: 'Argentina - List of Champions - RSSSF',
      url: 'https://www.rsssf.org/tablesa/argchamp.html',
      remark: '用于交叉核对阿根廷甲级联赛职业时代赛制沿革和冠军列表。'
    },
    {
      label: 'Argentine Primera Division - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Argentine_Primera_Divisi%C3%B3n',
      remark: '用于核对赛事基础资料、英文名和赛制变迁。'
    }
  ],
  lastVerifiedAt: '2026-07-29',
  notes: [
    '本文件只负责创建阿根廷足球甲级联赛赛事本体，职业时代冠军 standings 走 domestic competition patches。',
    '系统按阿根廷国内一级联赛处理；国内系数为 0.75，冠军原始分 8，常规单冠实际冠军分为 6。',
    '阿根廷甲级联赛存在 Metropolitano / Nacional、Apertura / Clausura 等同届多冠军赛制；实际计分通过 CompetitionEdition.championShare 分摊。'
  ]
};

export const ARGENTINE_PRIMERA_DIVISION_RESULTS: SeedEdition[] = [];

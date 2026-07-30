import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_PROFESSIONAL_LEAGUE_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
  name: '阿根廷职业联赛杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Copa de la Liga Profesional - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_de_la_Liga_Profesional',
      remark: '用于核对赛事基础资料、历届冠亚军与停办口径。'
    },
    {
      label: 'RSSSF Argentina Domestic Cup History',
      url: 'https://www.rsssf.org/tablesa/argcuphist.html',
      remark: '用于交叉核对阿根廷国内杯赛历史。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件只负责创建阿根廷职业联赛杯赛事本体，库内俱乐部 standings 走 domestic competition patches。',
    '2020 届以 Copa Diego Armando Maradona 名义举行；2021-2024 届为 Copa de la Liga Profesional。',
    '赛事在 2025 年起被 Apertura / Clausura 口径替代，系统按已停用赛事维护。',
    '阿根廷职业联赛杯命中 CLUB_DOMESTIC_LEVEL_2_CUP，结合阿根廷 0.75 系数后实际为冠军 1.5、亚军 0.75。'
  ]
};

export const ARGENTINE_PROFESSIONAL_LEAGUE_CUP_RESULTS: SeedEdition[] = [];

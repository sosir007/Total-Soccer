import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
  name: '阿根廷职业联赛冠军杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Trofeo de Campeones de la Liga Profesional - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Trofeo_de_Campeones_de_la_Liga_Profesional',
      remark: '用于核对赛事基础资料、历届冠亚军与现行口径。'
    },
    {
      label: 'LPF Trofeo de Campeones 2025',
      url: 'https://www.lpf.org.ar/notas/trofeo-de-campeones/2025/12/15/todo-sobre-el-trofeo-de-campeones-2/',
      remark: '用于核对 2025 届冠军与亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件只负责创建阿根廷职业联赛冠军杯赛事本体，库内俱乐部 standings 走 domestic competition patches。',
    '本赛事 2021-2024 届由职业联赛冠军对阵职业联赛杯冠军；2025 届起由 Apertura 与 Clausura 冠军对阵。',
    '2019 届前身 Trofeo de Campeones de la Superliga Argentina 暂不混入本赛事。',
    '阿根廷职业联赛冠军杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合阿根廷 0.75 系数后实际为冠军 0.75、亚军 0.375。'
  ]
};

export const ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY_RESULTS: SeedEdition[] = [];

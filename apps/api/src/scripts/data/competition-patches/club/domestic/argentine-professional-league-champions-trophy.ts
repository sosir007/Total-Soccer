import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY_PATCH_METADATA: CompetitionDataMetadata =
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
    name: '阿根廷职业联赛冠军杯',
    dataKind: 'competition-patches',
    target: 'club',
    scope: 'domestic',
    sources: [
      {
        label: 'Trofeo de Campeones de la Liga Profesional - Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Trofeo_de_Campeones_de_la_Liga_Profesional',
        remark: '用于核对 2021-2025 历届冠亚军。'
      },
      {
        label: 'LPF Trofeo de Campeones 2025',
        url: 'https://www.lpf.org.ar/notas/trofeo-de-campeones/2025/12/15/todo-sobre-el-trofeo-de-campeones-2/',
        remark: '用于核对 2025 届冠军与亚军。'
      }
    ],
    lastVerifiedAt: '2026-07-30',
    notes: [
      '本补录只写入当前数据库里已存在的阿根廷俱乐部 standings，缺失俱乐部对应名次先留空。',
      '本赛事 2021-2024 届由职业联赛冠军对阵职业联赛杯冠军；2025 届起由 Apertura 与 Clausura 冠军对阵。',
      '2019 届前身 Trofeo de Campeones de la Superliga Argentina 暂不混入本赛事。',
      '阿根廷职业联赛冠军杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合阿根廷 0.75 系数后实际为冠军 0.75、亚军 0.375。'
    ]
  };

export const ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
    name: '2021',
    year: 2021,
    season: '2021',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2021_Trofeo_de_Campeones_de_la_Liga_Profesional',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' }],
    remark:
      '亚军为科隆竞技，当前数据库暂无对应阿根廷俱乐部；库内“科隆”为德国俱乐部，不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2022_Trofeo_de_Campeones_de_la_Liga_Profesional',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '竞赛' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博卡青年' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2023_Trofeo_de_Campeones_de_la_Liga_Profesional',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '罗萨里奥中央' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2024_Trofeo_de_Campeones_de_la_Liga_Profesional',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '拉普拉塔大学生' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '萨斯菲尔德' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CHAMPIONS_TROPHY',
    name: '2025',
    year: 2025,
    season: '2025',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl:
      'https://www.lpf.org.ar/notas/trofeo-de-campeones/2025/12/15/todo-sobre-el-trofeo-de-campeones-2/',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '拉普拉塔大学生' }],
    remark: '亚军为普拉滕斯，当前数据库暂无对应俱乐部，暂不录 standings。'
  }
];

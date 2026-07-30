import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_PROFESSIONAL_LEAGUE_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
  name: '阿根廷职业联赛杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Copa de la Liga Profesional - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_de_la_Liga_Profesional',
      remark: '用于核对 2020-2024 历届冠亚军。'
    },
    {
      label: 'RSSSF Argentina Domestic Cup History',
      url: 'https://www.rsssf.org/tablesa/argcuphist.html',
      remark: '用于交叉核对阿根廷国内杯赛历史。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本补录只写入当前数据库里已存在的阿根廷俱乐部 standings，缺失俱乐部对应名次先留空。',
    '2020 届以 Copa Diego Armando Maradona 名义举行；2021-2024 届为 Copa de la Liga Profesional。',
    '赛事在 2025 年起被 Apertura / Clausura 口径替代，系统按已停用赛事维护。',
    '阿根廷职业联赛杯命中 CLUB_DOMESTIC_LEVEL_2_CUP，结合阿根廷 0.75 系数后实际为冠军 1.5、亚军 0.75。'
  ]
};

export const ARGENTINE_PROFESSIONAL_LEAGUE_CUP_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
    name: '2020',
    year: 2020,
    season: '2020',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2020_Copa_Diego_Armando_Maradona',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' }],
    remark:
      '本届赛事名为 Copa Diego Armando Maradona；亚军为班菲尔德，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
    name: '2021',
    year: 2021,
    season: '2021',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2021_Copa_de_la_Liga_Profesional',
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '竞赛' }],
    remark:
      '冠军为科隆竞技，当前数据库暂无对应阿根廷俱乐部；库内“科隆”为德国俱乐部，不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2022_Copa_de_la_Liga_Profesional',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' }],
    remark: '亚军为蒂格雷，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2023_Copa_de_la_Liga_Profesional',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '罗萨里奥中央' }],
    remark: '亚军为普拉滕斯，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_PROFESSIONAL_LEAGUE_CUP',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2024_Copa_de_la_Liga_Profesional',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '拉普拉塔大学生' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '萨斯菲尔德' }
    ]
  }
];

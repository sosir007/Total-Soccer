import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_SUPER_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_SUPER_CUP',
  name: '巴西超级杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa do Brasil - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_do_Brasil',
      remark: '用于核对 1990、1991、2020-2026 官方赛事冠亚军。'
    },
    {
      label: '2026 Supercopa do Brasil - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2026_Supercopa_do_Brasil',
      remark: '用于核对最新一届已完赛冠军与亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-16',
  notes: [
    '本补录只写入当前数据库里已存在的巴西俱乐部 standings。',
    '采用官方连续口径：1990、1991、2020+ 统一归入同一赛事；1992 和 2018 非官方赛事不录入。',
    '巴西超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合巴西 0.75 系数后实际为冠军 0.75、亚军 0.375。'
  ]
};

export const BRAZIL_SUPER_CUP_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '1990',
    year: 1990,
    season: '1990',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '两回合总比分口径。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '格雷米奥' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '瓦斯科达伽马' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '1991',
    year: 1991,
    season: '1991',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '2020',
    year: 2020,
    season: '2020',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '巴拉纳竞技' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '2021',
    year: 2021,
    season: '2021',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '帕尔梅拉斯' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '米内罗竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '帕尔梅拉斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '帕尔梅拉斯' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '2025',
    year: 2025,
    season: '2025',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博塔弗戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_SUPER_CUP',
    name: '2026',
    year: 2026,
    season: '2026',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  }
];

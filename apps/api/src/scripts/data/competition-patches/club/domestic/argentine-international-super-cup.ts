import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_INTERNATIONAL_SUPER_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_INTERNATIONAL_SUPER_CUP',
  name: '阿根廷国际超级杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa Internacional - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_Internacional',
      remark: '用于核对 2022-2024 历届冠亚军。'
    },
    {
      label: 'AFA Supercopa Internacional 2024',
      url: 'https://www.afa.com.ar/441/posts/velez-derroto-2-0-a-estudiantes-y-se-quedo-con-la-supercopa-internacional',
      remark: '用于核对 2024 届冠军与亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本补录只写入当前数据库里已存在的阿根廷俱乐部 standings。',
    '“国际”来自赛事海外举办口径，不代表洲际或全球赛事；系统按阿根廷国内超级杯类赛事处理。',
    '赛事举办地和连续性曾调整，但 2024 届已完赛，系统按现行赛事维护。',
    '阿根廷国际超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合阿根廷 0.75 系数后实际为冠军 0.75、亚军 0.375。'
  ]
};

export const ARGENTINE_INTERNATIONAL_SUPER_CUP_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'ARGENTINE_INTERNATIONAL_SUPER_CUP',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2022_Supercopa_Internacional',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '竞赛' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博卡青年' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_INTERNATIONAL_SUPER_CUP',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2023_Supercopa_Internacional',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '塔勒雷斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '河床竞技' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_INTERNATIONAL_SUPER_CUP',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2024_Supercopa_Internacional',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '萨斯菲尔德' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '拉普拉塔大学生' }
    ]
  }
];

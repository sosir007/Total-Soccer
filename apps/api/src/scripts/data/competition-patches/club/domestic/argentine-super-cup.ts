import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_SUPER_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_SUPER_CUP',
  name: '阿根廷超级杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa Argentina - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_Argentina',
      remark: '用于核对 2012-2024 历届冠亚军、2020 与 2021 停办口径。'
    },
    {
      label: '2024 Supercopa Argentina - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2024_Supercopa_Argentina',
      remark: '用于核对最新一届已完赛冠军与亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本补录只写入当前数据库里已存在的阿根廷俱乐部 standings，缺失俱乐部对应名次先留空。',
    '2020、2021 届未举行，不创建荣誉届次；2025 届暂无已完赛结果，暂不录入。',
    '阿根廷超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，结合阿根廷 0.75 系数后实际为冠军 0.75、亚军 0.375。'
  ]
};

export const ARGENTINE_SUPER_CUP_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2012',
    year: 2012,
    season: '2012',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2012_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '萨兰迪阿森纳' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博卡青年' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2013',
    year: 2013,
    season: '2013',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2013_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '萨斯菲尔德' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '萨兰迪阿森纳' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2014',
    year: 2014,
    season: '2014',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2014_Supercopa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '河床竞技' }],
    remark: '冠军为飓风，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2015',
    year: 2015,
    season: '2015',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2015_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '圣洛伦索' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博卡青年' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2016',
    year: 2016,
    season: '2016',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2016_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '拉努斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '河床竞技' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2017',
    year: 2017,
    season: '2017',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2017_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博卡青年' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2018',
    year: 2018,
    season: '2018',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2018_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '罗萨里奥中央' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2019',
    year: 2019,
    season: '2019',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2019_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '竞赛' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2022_Supercopa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' }],
    remark: '亚军为帕特罗纳图，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2023_Supercopa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '拉普拉塔大学生' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_SUPER_CUP',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2024_Supercopa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '萨斯菲尔德' }],
    remark: '亚军为科尔多瓦中央，当前数据库暂无对应俱乐部，暂不录 standings。'
  }
];

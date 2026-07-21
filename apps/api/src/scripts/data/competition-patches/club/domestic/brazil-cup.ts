import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_CUP',
  name: '巴西杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of Copa do Brasil winners - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Copa_do_Brasil_winners',
      remark: '用于核对 1989-2025 历届冠亚军。'
    },
    {
      label: '2025 Copa do Brasil - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2025_Copa_do_Brasil',
      remark: '用于核对最近一届已完赛冠军与亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-16',
  notes: [
    '本补录只写入当前数据库里已存在的巴西俱乐部 standings，缺失俱乐部对应名次先留空。',
    '巴西杯命中 CLUB_DOMESTIC_LEVEL_1_CUP，结合巴西 0.75 系数后实际为冠军 2.25、亚军 1.125。'
  ]
};

const RAW_BRAZIL_CUP_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1989',
    year: 1989,
    season: '1989',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '格雷米奥' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1990',
    year: 1990,
    season: '1990',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1991',
    year: 1991,
    season: '1991',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '格雷米奥' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1992',
    year: 1992,
    season: '1992',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '巴西国际' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗鲁米嫩塞' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1993',
    year: 1993,
    season: '1993',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '克鲁塞罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '格雷米奥' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1994',
    year: 1994,
    season: '1994',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '格雷米奥' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1995',
    year: 1995,
    season: '1995',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '格雷米奥' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1996',
    year: 1996,
    season: '1996',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '克鲁塞罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '帕尔梅拉斯' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1997',
    year: 1997,
    season: '1997',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '格雷米奥' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1998',
    year: 1998,
    season: '1998',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '帕尔梅拉斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '克鲁塞罗' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '1999',
    year: 1999,
    season: '1999',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博塔弗戈' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2000',
    year: 2000,
    season: '2000',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '克鲁塞罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2001',
    year: 2001,
    season: '2001',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '格雷米奥' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2002',
    year: 2002,
    season: '2002',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '科林蒂安' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2003',
    year: 2003,
    season: '2003',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '克鲁塞罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2004',
    year: 2004,
    season: '2004',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2005',
    year: 2005,
    season: '2005',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗鲁米嫩塞' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2006',
    year: 2006,
    season: '2006',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '瓦斯科达伽马' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2007',
    year: 2007,
    season: '2007',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗鲁米嫩塞' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2008',
    year: 2008,
    season: '2008',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '科林蒂安' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2009',
    year: 2009,
    season: '2009',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '巴西国际' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2010',
    year: 2010,
    season: '2010',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '桑托斯' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2011',
    year: 2011,
    season: '2011',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '瓦斯科达伽马' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2012',
    year: 2012,
    season: '2012',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '帕尔梅拉斯' }]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2013',
    year: 2013,
    season: '2013',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '巴拉纳竞技' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2014',
    year: 2014,
    season: '2014',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '米内罗竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '克鲁塞罗' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2015',
    year: 2015,
    season: '2015',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '帕尔梅拉斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2016',
    year: 2016,
    season: '2016',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '格雷米奥' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '米内罗竞技' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2017',
    year: 2017,
    season: '2017',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '克鲁塞罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2018',
    year: 2018,
    season: '2018',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '克鲁塞罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2019',
    year: 2019,
    season: '2019',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '巴拉纳竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '巴西国际' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2020',
    year: 2020,
    season: '2020',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '帕尔梅拉斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '格雷米奥' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2021',
    year: 2021,
    season: '2021',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '米内罗竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '巴拉纳竞技' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '米内罗竞技' }
    ]
  },
  {
    competitionCode: 'BRAZIL_CUP',
    name: '2025',
    year: 2025,
    season: '2025',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '瓦斯科达伽马' }
    ]
  }
];

export const BRAZIL_CUP_PATCHES: SeedCompetitionPatch[] = RAW_BRAZIL_CUP_PATCHES.map((patch) => ({
  ...patch,
  externalUrl: `https://en.wikipedia.org/wiki/${patch.year}_Copa_do_Brasil`
}));

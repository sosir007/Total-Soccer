import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type ItalySuperCupResult = {
  season: string;
  year: number;
  champion: string;
  runnerUp: string;
  score: string;
  remark?: string;
};

const COMPETITION_CODE = 'ITALY_SUPER_CUP';
const SUPER_CUP_URL = 'https://en.wikipedia.org/wiki/Supercoppa_Italiana';

export const ITALY_SUPER_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '意大利超级杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercoppa Italiana - Wikipedia',
      url: SUPER_CUP_URL,
      remark: '用于核对 1988 至 2025-26 历届决赛冠亚军、比分和 2023 后四队制。'
    },
    {
      label: 'Lega Serie A - Supercoppa Italiana albo d oro',
      url: 'https://www.legaseriea.it/supercoppa/albo',
      remark: '用于核对 Lega Serie A 官方荣誉榜口径。'
    }
  ],
  lastVerifiedAt: '2026-08-05',
  notes: [
    '本补录写入 1988 至 2025-26 已完赛意大利超级杯决赛冠亚军。',
    '2023、2024-25、2025-26 为四队制，本文件仍只录最终冠军和亚军，不录半决赛负方。',
    '2026-27 尚未决出冠军，暂不创建届次。',
    '当前历届冠亚军涉及俱乐部均已在数据库存在，无需新增缺失俱乐部。',
    '意大利超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，按意大利国内三级杯赛计分。'
  ]
};

const RAW_ITALY_SUPER_CUP_RESULTS: ItalySuperCupResult[] = [
  { season: '1988', year: 1988, champion: 'AC米兰', runnerUp: '桑普多利亚', score: '3-1' },
  { season: '1989', year: 1989, champion: '国际米兰', runnerUp: '桑普多利亚', score: '2-0' },
  { season: '1990', year: 1990, champion: '那不勒斯', runnerUp: '尤文图斯', score: '5-1' },
  { season: '1991', year: 1991, champion: '桑普多利亚', runnerUp: '罗马', score: '1-0' },
  { season: '1992', year: 1992, champion: 'AC米兰', runnerUp: '帕尔马', score: '2-1' },
  { season: '1993', year: 1993, champion: 'AC米兰', runnerUp: '都灵', score: '1-0' },
  {
    season: '1994',
    year: 1994,
    champion: 'AC米兰',
    runnerUp: '桑普多利亚',
    score: '1-1，点球 4-3'
  },
  { season: '1995', year: 1995, champion: '尤文图斯', runnerUp: '帕尔马', score: '1-0' },
  { season: '1996', year: 1996, champion: '佛罗伦萨', runnerUp: 'AC米兰', score: '2-1' },
  { season: '1997', year: 1997, champion: '尤文图斯', runnerUp: '维琴察', score: '3-0' },
  { season: '1998', year: 1998, champion: '拉齐奥', runnerUp: '尤文图斯', score: '2-1' },
  { season: '1999', year: 1999, champion: '帕尔马', runnerUp: 'AC米兰', score: '2-1' },
  { season: '2000', year: 2000, champion: '拉齐奥', runnerUp: '国际米兰', score: '4-3' },
  { season: '2001', year: 2001, champion: '罗马', runnerUp: '佛罗伦萨', score: '3-0' },
  { season: '2002', year: 2002, champion: '尤文图斯', runnerUp: '帕尔马', score: '2-1，加时' },
  { season: '2003', year: 2003, champion: '尤文图斯', runnerUp: 'AC米兰', score: '1-1，点球 5-3' },
  { season: '2004', year: 2004, champion: 'AC米兰', runnerUp: '拉齐奥', score: '3-0' },
  { season: '2005', year: 2005, champion: '国际米兰', runnerUp: '尤文图斯', score: '1-0，加时' },
  { season: '2006', year: 2006, champion: '国际米兰', runnerUp: '罗马', score: '4-3，加时' },
  { season: '2007', year: 2007, champion: '罗马', runnerUp: '国际米兰', score: '1-0' },
  { season: '2008', year: 2008, champion: '国际米兰', runnerUp: '罗马', score: '2-2，点球 6-5' },
  { season: '2009', year: 2009, champion: '拉齐奥', runnerUp: '国际米兰', score: '2-1' },
  { season: '2010', year: 2010, champion: '国际米兰', runnerUp: '罗马', score: '3-1' },
  { season: '2011', year: 2011, champion: 'AC米兰', runnerUp: '国际米兰', score: '2-1' },
  { season: '2012', year: 2012, champion: '尤文图斯', runnerUp: '那不勒斯', score: '4-2，加时' },
  { season: '2013', year: 2013, champion: '尤文图斯', runnerUp: '拉齐奥', score: '4-0' },
  {
    season: '2014',
    year: 2014,
    champion: '那不勒斯',
    runnerUp: '尤文图斯',
    score: '2-2，点球 6-5'
  },
  { season: '2015', year: 2015, champion: '尤文图斯', runnerUp: '拉齐奥', score: '2-0，加时' },
  { season: '2016', year: 2016, champion: 'AC米兰', runnerUp: '尤文图斯', score: '1-1，点球 4-3' },
  { season: '2017', year: 2017, champion: '拉齐奥', runnerUp: '尤文图斯', score: '3-2' },
  { season: '2018', year: 2018, champion: '尤文图斯', runnerUp: 'AC米兰', score: '1-0' },
  { season: '2019', year: 2019, champion: '拉齐奥', runnerUp: '尤文图斯', score: '3-1' },
  { season: '2020', year: 2020, champion: '尤文图斯', runnerUp: '那不勒斯', score: '2-0' },
  { season: '2021', year: 2021, champion: '国际米兰', runnerUp: '尤文图斯', score: '2-1，加时' },
  { season: '2022', year: 2022, champion: '国际米兰', runnerUp: 'AC米兰', score: '3-0' },
  {
    season: '2023',
    year: 2024,
    champion: '国际米兰',
    runnerUp: '那不勒斯',
    score: '1-0',
    remark: '四队制届次，只录决赛冠亚军。'
  },
  {
    season: '2024-25',
    year: 2025,
    champion: 'AC米兰',
    runnerUp: '国际米兰',
    score: '3-2',
    remark: '四队制届次，只录决赛冠亚军。'
  },
  {
    season: '2025-26',
    year: 2026,
    champion: '那不勒斯',
    runnerUp: '博洛尼亚',
    score: '2-0',
    remark: '四队制届次，只录决赛冠亚军。'
  }
];

function buildStandings(result: ItalySuperCupResult): SeedStanding[] {
  return [
    {
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: result.champion
    },
    {
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: result.runnerUp
    }
  ];
}

export const ITALY_SUPER_CUP_PATCHES: SeedCompetitionPatch[] = RAW_ITALY_SUPER_CUP_RESULTS.map(
  (result) => ({
    competitionCode: COMPETITION_CODE,
    name: result.season,
    year: result.year,
    season: result.season,
    externalUrl: SUPER_CUP_URL,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(result),
    remark: result.remark ?? `决赛${result.champion} ${result.score} ${result.runnerUp}。`
  })
);

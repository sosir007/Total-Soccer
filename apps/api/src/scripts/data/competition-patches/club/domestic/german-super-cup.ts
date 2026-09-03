import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type GermanSuperCupResult = {
  season: string;
  year: number;
  champion: string;
  runnerUp?: string;
  score: string;
  remark?: string;
};

const COMPETITION_CODE = 'GERMAN_SUPER_CUP';
const SOURCE_URL = 'https://en.wikipedia.org/wiki/Franz_Beckenbauer_Supercup';

export const GERMAN_SUPER_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '德国超级杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Franz Beckenbauer Supercup - Wikipedia',
      url: SOURCE_URL,
      remark: '用于核对 1987-2026 历届正式冠亚军、历史更名和非正式届次排除口径。'
    },
    {
      label: 'The history of the Franz Beckenbauer Supercup - Bundesliga',
      url: 'https://www.bundesliga.com/en/bundesliga/news/history-of-supercup-records-goals-all-matches-bayern-dortmund-leipzig-20635',
      remark: '用于核对 2010-2026 历届比分、点球和 2025-26 以后改名口径。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本补录写入 1987-1996、2010-2026 已完赛德国超级杯决赛冠亚军。',
    '2008、2009 属于非正式超级杯，不纳入本赛事。',
    '1992 年亚军汉诺威 96 已按库内“汉诺威96”录入。',
    '德国超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，按德国国内三级杯赛计分。'
  ]
};

const RAW_GERMAN_SUPER_CUP_RESULTS: GermanSuperCupResult[] = [
  { season: '1987', year: 1987, champion: '拜仁慕尼黑', runnerUp: '汉堡', score: '2-1' },
  { season: '1988', year: 1988, champion: '云达不莱梅', runnerUp: '法兰克福', score: '2-0' },
  { season: '1989', year: 1989, champion: '多特蒙德', runnerUp: '拜仁慕尼黑', score: '4-3' },
  { season: '1990', year: 1990, champion: '拜仁慕尼黑', runnerUp: '凯泽斯劳滕', score: '4-1' },
  { season: '1991', year: 1991, champion: '凯泽斯劳滕', runnerUp: '云达不莱梅', score: '3-1' },
  {
    season: '1992',
    year: 1992,
    champion: '斯图加特',
    runnerUp: '汉诺威96',
    score: '3-1'
  },
  {
    season: '1993',
    year: 1993,
    champion: '云达不莱梅',
    runnerUp: '勒沃库森',
    score: '2-2，加时，点球 7-6'
  },
  {
    season: '1994',
    year: 1994,
    champion: '云达不莱梅',
    runnerUp: '拜仁慕尼黑',
    score: '3-1，加时'
  },
  { season: '1995', year: 1995, champion: '多特蒙德', runnerUp: '门兴格拉德巴赫', score: '1-0' },
  {
    season: '1996',
    year: 1996,
    champion: '多特蒙德',
    runnerUp: '凯泽斯劳滕',
    score: '1-1，加时，点球 4-3'
  },
  { season: '2010', year: 2010, champion: '拜仁慕尼黑', runnerUp: '沙尔克04', score: '2-0' },
  {
    season: '2011',
    year: 2011,
    champion: '沙尔克04',
    runnerUp: '多特蒙德',
    score: '0-0，点球 4-3'
  },
  { season: '2012', year: 2012, champion: '多特蒙德', runnerUp: '拜仁慕尼黑', score: '2-1' },
  { season: '2013', year: 2013, champion: '拜仁慕尼黑', runnerUp: '多特蒙德', score: '4-2' },
  { season: '2014', year: 2014, champion: '多特蒙德', runnerUp: '拜仁慕尼黑', score: '2-0' },
  {
    season: '2015',
    year: 2015,
    champion: '沃尔夫斯堡',
    runnerUp: '拜仁慕尼黑',
    score: '1-1，点球 5-4'
  },
  { season: '2016', year: 2016, champion: '拜仁慕尼黑', runnerUp: '多特蒙德', score: '2-0' },
  {
    season: '2017',
    year: 2017,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    score: '2-2，点球 5-4'
  },
  { season: '2018', year: 2018, champion: '拜仁慕尼黑', runnerUp: '法兰克福', score: '5-0' },
  { season: '2019', year: 2019, champion: '多特蒙德', runnerUp: '拜仁慕尼黑', score: '2-0' },
  { season: '2020', year: 2020, champion: '拜仁慕尼黑', runnerUp: '多特蒙德', score: '3-2' },
  { season: '2021', year: 2021, champion: '拜仁慕尼黑', runnerUp: '多特蒙德', score: '3-1' },
  { season: '2022', year: 2022, champion: '拜仁慕尼黑', runnerUp: 'RB莱比锡', score: '5-3' },
  { season: '2023', year: 2023, champion: 'RB莱比锡', runnerUp: '拜仁慕尼黑', score: '3-0' },
  {
    season: '2024',
    year: 2024,
    champion: '勒沃库森',
    runnerUp: '斯图加特',
    score: '2-2，点球 4-3'
  },
  { season: '2025', year: 2025, champion: '拜仁慕尼黑', runnerUp: '斯图加特', score: '2-1' },
  { season: '2026', year: 2026, champion: '拜仁慕尼黑', runnerUp: '多特蒙德', score: '2-1' }
];

function buildStandings(row: GermanSuperCupResult): SeedStanding[] {
  const standings: SeedStanding[] = [
    {
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: row.champion
    }
  ];

  if (row.runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: row.runnerUp
    });
  }

  return standings;
}

function buildRemark(row: GermanSuperCupResult) {
  const remarks: string[] = [
    row.remark ?? `决赛${row.champion} ${row.score}${row.runnerUp ? ` ${row.runnerUp}` : ''}。`
  ];

  return remarks.join(' ');
}

export const GERMAN_SUPER_CUP_PATCHES: SeedCompetitionPatch[] = RAW_GERMAN_SUPER_CUP_RESULTS.map(
  (result) => ({
    competitionCode: COMPETITION_CODE,
    name: result.season,
    year: result.year,
    season: result.season,
    externalUrl: SOURCE_URL,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(result),
    remark: buildRemark(result)
  })
);

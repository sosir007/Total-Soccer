import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type GermanLeagueCupResult = {
  season: string;
  year: number;
  champion: string;
  runnerUp: string;
  score: string;
  remark?: string;
};

const COMPETITION_CODE = 'GERMAN_LEAGUE_CUP';
const SOURCE_URL = 'https://en.wikipedia.org/wiki/DFL-Ligapokal';

export const GERMAN_LEAGUE_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '德国联赛杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'DFL-Ligapokal - Wikipedia',
      url: SOURCE_URL,
      remark: '用于核对赛事基础资料、1972-73 前身和 1997-2007 DFL-Ligapokal 历届冠亚军。'
    },
    {
      label: 'DFL-Ligapokal honours - Sport-Histoire',
      url: 'https://www.sport-histoire.fr/en/Sport/Football/Honours/DFL-Ligapokal.php',
      remark: '用于交叉核对历届决赛比分和冠亚军。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本补录写入 1972-73、1997-2007 德国联赛杯决赛冠亚军。',
    '1972-73 DFB-Ligapokal 作为前身纳入同一德国联赛杯口径；1997-2007 为 DFL-Ligapokal，2008 后停办。',
    '当前历届冠亚军涉及俱乐部均已在数据库存在，无需新增缺失俱乐部。',
    '德国联赛杯命中 CLUB_DOMESTIC_LEVEL_2_CUP，按德国国内二级杯赛计分。'
  ]
};

const RAW_GERMAN_LEAGUE_CUP_RESULTS: GermanLeagueCupResult[] = [
  {
    season: '1972-73',
    year: 1973,
    champion: '汉堡',
    runnerUp: '门兴格拉德巴赫',
    score: '4-0',
    remark: 'DFB-Ligapokal 前身届次，决赛汉堡 4-0 门兴格拉德巴赫。'
  },
  { season: '1997', year: 1997, champion: '拜仁慕尼黑', runnerUp: '斯图加特', score: '2-0' },
  { season: '1998', year: 1998, champion: '拜仁慕尼黑', runnerUp: '斯图加特', score: '4-0' },
  {
    season: '1999',
    year: 1999,
    champion: '拜仁慕尼黑',
    runnerUp: '云达不莱梅',
    score: '2-1'
  },
  { season: '2000', year: 2000, champion: '拜仁慕尼黑', runnerUp: '柏林赫塔', score: '5-1' },
  { season: '2001', year: 2001, champion: '柏林赫塔', runnerUp: '沙尔克04', score: '4-1' },
  { season: '2002', year: 2002, champion: '柏林赫塔', runnerUp: '沙尔克04', score: '4-1' },
  { season: '2003', year: 2003, champion: '汉堡', runnerUp: '多特蒙德', score: '4-2' },
  {
    season: '2004',
    year: 2004,
    champion: '拜仁慕尼黑',
    runnerUp: '云达不莱梅',
    score: '3-2'
  },
  { season: '2005', year: 2005, champion: '沙尔克04', runnerUp: '斯图加特', score: '1-0' },
  {
    season: '2006',
    year: 2006,
    champion: '云达不莱梅',
    runnerUp: '拜仁慕尼黑',
    score: '2-0'
  },
  { season: '2007', year: 2007, champion: '拜仁慕尼黑', runnerUp: '沙尔克04', score: '1-0' }
];

function buildStandings(result: GermanLeagueCupResult): SeedStanding[] {
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

export const GERMAN_LEAGUE_CUP_PATCHES: SeedCompetitionPatch[] = RAW_GERMAN_LEAGUE_CUP_RESULTS.map(
  (result) => ({
    competitionCode: COMPETITION_CODE,
    name: result.season,
    year: result.year,
    season: result.season,
    externalUrl: SOURCE_URL,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(result),
    remark: result.remark ?? `决赛${result.champion} ${result.score} ${result.runnerUp}。`
  })
);

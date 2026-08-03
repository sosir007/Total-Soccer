import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type SpainLeagueCupResult = {
  season: string;
  champion: string;
  runnerUp: string;
};

export const SPAIN_LEAGUE_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_LEAGUE_CUP',
  name: '西班牙联赛杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Copa de la Liga - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_de_la_Liga',
      remark: '用于核对 1983-1986 历届冠军、亚军和赛事停办口径。'
    },
    {
      label: 'Spain - List of League Cup Finals - RSSSF',
      url: 'https://www.rsssf.org/tabless/spanleagcuphist.html',
      remark: '用于交叉核对西班牙联赛杯决赛年份、冠亚军和两回合赛果。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本补录只写入当前数据库里已存在的西班牙俱乐部 standings。',
    '只录 1983-1986 年正式 Copa de la Liga，按最终冠军和亚军录入，不录其他晋级名次。',
    '西班牙联赛杯命中 CLUB_DOMESTIC_LEVEL_2_CUP，按西班牙国内二级杯赛计分。'
  ]
};

const LEAGUE_CUP_URL = 'https://en.wikipedia.org/wiki/Copa_de_la_Liga';

const RAW_SPAIN_LEAGUE_CUP_RESULTS: SpainLeagueCupResult[] = [
  { season: '1983', champion: '巴塞罗那', runnerUp: '皇家马德里' },
  { season: '1984', champion: '巴拉多利德', runnerUp: '马德里竞技' },
  { season: '1985', champion: '皇家马德里', runnerUp: '马德里竞技' },
  { season: '1986', champion: '巴塞罗那', runnerUp: '皇家贝蒂斯' }
];

function buildStandings(result: SpainLeagueCupResult) {
  const standings: SeedStanding[] = [
    {
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: result.champion
    },
    {
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: result.runnerUp
    }
  ];

  return standings;
}

export const SPAIN_LEAGUE_CUP_PATCHES: SeedCompetitionPatch[] = RAW_SPAIN_LEAGUE_CUP_RESULTS.map(
  (result) => ({
    competitionCode: 'SPAIN_LEAGUE_CUP',
    name: result.season,
    year: Number(result.season),
    season: result.season,
    externalUrl: LEAGUE_CUP_URL,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(result)
  })
);

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type NaslCosmosResult = {
  year: number;
  placement: SeedStanding['placement'];
  opponent: string;
  score: string;
  externalUrl: string;
  remark: string;
};

type NaslCosmosSeedResult = NaslCosmosResult & SeedEdition;

export const NORTH_AMERICAN_SOCCER_LEAGUE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'NORTH_AMERICAN_SOCCER_LEAGUE_1968_1984',
  name: '北美足球联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'North American Soccer League (1968-1984) - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/North_American_Soccer_League_(1968%E2%80%9384)',
      remark: '用于核对旧 NASL 的赛事基础资料、举办年份和历史性质。'
    },
    {
      label: 'NASL Yearly Results',
      url: 'https://www.nasl.com/yearly-results',
      remark: '用于核对旧 NASL 历年冠军结果。'
    },
    {
      label: 'New York Cosmos History',
      url: 'https://www.nycosmos.com/history/',
      remark: '用于核对纽约宇宙 1972、1977、1978、1980、1982 冠军节点。'
    }
  ],
  lastVerifiedAt: '2026-07-21',
  notes: [
    '旧北美足球联赛 1968-1984 是美国/加拿大跨境职业联赛，但非中北美足联洲际赛事；系统按美国国内历史一级联赛处理。',
    '本轮只录入纽约宇宙已确认相关名次：1972、1977、1978、1980、1982 冠军，1981 亚军。',
    '其他球队和完整历届冠亚季军暂不录入。'
  ]
};

export const NORTH_AMERICAN_SOCCER_LEAGUE_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '20029882',
    name: '纽约宇宙',
    alias: 'New York Cosmos',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    externalUrl: 'https://en.wikipedia.org/wiki/New_York_Cosmos_(1971%E2%80%931985)',
    remark:
      '跨大西洋挑战杯：1980、1983、1984 优胜，1981、1982 亚军；该赛事为历史邀请赛，不计入荣誉分。',
    exists: false,
    forceProfileFields: true,
    forceExists: true
  }
];

export const NORTH_AMERICAN_SOCCER_LEAGUE_RESULTS: NaslCosmosSeedResult[] = [
  {
    year: 1972,
    placement: CompetitionStandingPlacement.CHAMPION,
    opponent: '圣路易斯明星',
    score: '2-1',
    externalUrl:
      'https://www.nasl.com/news/2015/08/18/previo-campeones-cosmos-capturan-su-primer-ttulo-en-1972',
    remark: '纽约宇宙 2-1 圣路易斯明星，获得旧 NASL 首个冠军。'
  },
  {
    year: 1977,
    placement: CompetitionStandingPlacement.CHAMPION,
    opponent: '西雅图海湾人',
    score: '2-1',
    externalUrl:
      'https://www.nasl.com/news/2016/09/01/nasl-retro-pel-se-despide-a-lo-grande-con-trofeo-del-soccer-bowl',
    remark: 'Soccer Bowl 1977，纽约宇宙 2-1 西雅图海湾人。'
  },
  {
    year: 1978,
    placement: CompetitionStandingPlacement.CHAMPION,
    opponent: '坦帕湾暴徒',
    score: '3-1',
    externalUrl:
      'https://www.nasl.com/news/2015/08/27/nasl-retro-cosmos-vencen-a-los-rowdies-para-el-campeonato-1978',
    remark: 'Soccer Bowl 1978，纽约宇宙 3-1 坦帕湾暴徒。'
  },
  {
    year: 1980,
    placement: CompetitionStandingPlacement.CHAMPION,
    opponent: '劳德代尔堡前锋',
    score: '3-0',
    externalUrl:
      'https://www.nasl.com/news/2016/09/22/nasl-retro-cosmos-strikers-juegan-final-de-1980',
    remark: 'Soccer Bowl 1980，纽约宇宙 3-0 劳德代尔堡前锋。'
  },
  {
    year: 1981,
    placement: CompetitionStandingPlacement.RUNNER_UP,
    opponent: '芝加哥刺',
    score: '0-0，点球 1-2',
    externalUrl:
      'https://www.nasl.com/news/2015/09/24/nasl-retro-chicago-sting-vencen-a-new-york-cosmos-para-ganar-soccer-bowl-81',
    remark: 'Soccer Bowl 1981，纽约宇宙 0-0 芝加哥刺，点球 1-2 获亚军。'
  },
  {
    year: 1982,
    placement: CompetitionStandingPlacement.CHAMPION,
    opponent: '西雅图海湾人',
    score: '1-0',
    externalUrl:
      'https://www.nasl.com/news/2015/09/17/nasl-retro-cosmos-derrotan-sounders-por-titulo-1982',
    remark: 'Soccer Bowl 1982，纽约宇宙 1-0 西雅图海湾人。'
  }
].map((result) => ({
  ...result,
  name: `${result.year}年`,
  season: String(result.year),
  host: null,
  quantity: 1,
  standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE
}));

export function buildNorthAmericanSoccerLeagueStandings(result: NaslCosmosResult): SeedStanding[] {
  return [
    {
      placement: result.placement,
      clubName: '纽约宇宙',
      remark: `${result.opponent}，${result.score}`
    }
  ];
}

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type UsOpenCupResult = SeedEdition & {
  champion?: string;
  runnerUp?: string;
  sourceChampion: string;
  sourceRunnerUp: string;
  score: string;
  note?: string;
};

type RawUsOpenCupResult = {
  year: number;
  champion?: string;
  runnerUp?: string;
  sourceChampion?: string;
  sourceRunnerUp?: string;
  score: string;
  note?: string;
};

export const US_OPEN_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'US_OPEN_CUP',
  name: '美国公开杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'U.S. Open Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/U.S._Open_Cup',
      remark: '用于核对美国公开杯赛事基础资料、历史沿革和现行状态。'
    },
    {
      label: 'USA - List of US Open Cup Finals - RSSSF',
      url: 'https://www.rsssf.org/tablesu/usacuphist.html',
      remark: '用于核对 1996-2025 年美国公开杯决赛冠军、亚军和比分。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '美国公开杯为美国全国性公开淘汰杯赛，系统按美国国内一级杯赛处理。',
    '本轮整理 1996-2025 年现代 MLS 时期结果；2020、2021 因疫情取消，不创建届次。',
    '只录当前数据库已有俱乐部；库外决赛队保留在届次备注中，不新增俱乐部。',
    '美国国内系数使用其他国家默认 0.5，命中 CLUB_DOMESTIC_LEVEL_1_CUP 后冠军实际 1.5 分、亚军实际 0.75 分。'
  ]
};

export const US_OPEN_CUP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1913',
    name: '华盛顿联',
    englishName: 'D.C. United',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1905',
    name: '达拉斯FC',
    englishName: 'FC Dallas',
    shortName: '达拉斯',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    forceName: true
  },
  {
    uid: '108893',
    name: '芝加哥火焰',
    englishName: 'Chicago Fire',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1904',
    name: '哥伦布机员',
    englishName: 'Columbus Crew',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1903',
    name: '科罗拉多急流',
    englishName: 'Colorado Rapids',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1907',
    name: '洛杉矶银河',
    englishName: 'LA Galaxy',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1909',
    name: '新英格兰革命',
    englishName: 'New England Revolution',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72000160',
    name: '纽约红牛',
    englishName: 'New York Red Bulls',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72023746',
    name: '堪萨斯城体育',
    englishName: 'Sporting Kansas City',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72014006',
    name: '西雅图海湾人',
    englishName: 'Seattle Sounders FC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '980543',
    name: '皇家盐湖城',
    englishName: 'Real Salt Lake',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72019000',
    name: '费城联合',
    englishName: 'Philadelphia Union',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72000112',
    name: '休斯敦迪纳摩',
    englishName: 'Houston Dynamo',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '72047296',
    name: '亚特兰大联',
    englishName: 'Atlanta United FC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '20030048',
    name: '明尼苏达联',
    englishName: 'Minnesota United FC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72014193',
    name: '奥兰多城',
    englishName: 'Orlando City SC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72049313',
    name: '洛杉矶FC',
    englishName: 'Los Angeles FC',
    shortName: '洛杉矶',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72052048',
    name: '迈阿密国际',
    englishName: 'Inter Miami CF',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '20046403',
    name: '纳什维尔SC',
    englishName: 'Nashville SC',
    shortName: '纳什维尔',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72053036',
    name: '奥斯汀FC',
    englishName: 'Austin FC',
    shortName: '奥斯汀',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const RAW_RESULTS: RawUsOpenCupResult[] = [
  { year: 1996, champion: '华盛顿联', sourceRunnerUp: '罗切斯特犀牛', score: '3-0' },
  { year: 1997, champion: '达拉斯FC', runnerUp: '华盛顿联', score: '0-0', note: '点球 5-3' },
  { year: 1998, champion: '芝加哥火焰', runnerUp: '哥伦布机员', score: '2-1' },
  { year: 1999, runnerUp: '科罗拉多急流', sourceChampion: '罗切斯特犀牛', score: '2-0' },
  { year: 2000, champion: '芝加哥火焰', sourceRunnerUp: '迈阿密融合', score: '2-1' },
  { year: 2001, champion: '洛杉矶银河', runnerUp: '新英格兰革命', score: '2-1' },
  { year: 2002, champion: '哥伦布机员', runnerUp: '洛杉矶银河', score: '1-0' },
  { year: 2003, champion: '芝加哥火焰', runnerUp: '纽约红牛', score: '1-0' },
  { year: 2004, champion: '堪萨斯城体育', runnerUp: '芝加哥火焰', score: '1-0' },
  { year: 2005, champion: '洛杉矶银河', runnerUp: '达拉斯FC', score: '1-0' },
  { year: 2006, champion: '芝加哥火焰', runnerUp: '洛杉矶银河', score: '3-1' },
  { year: 2007, champion: '新英格兰革命', runnerUp: '达拉斯FC', score: '3-2' },
  { year: 2008, champion: '华盛顿联', sourceRunnerUp: '查尔斯顿炮台', score: '2-1' },
  { year: 2009, champion: '西雅图海湾人', runnerUp: '华盛顿联', score: '2-1' },
  { year: 2010, champion: '西雅图海湾人', runnerUp: '哥伦布机员', score: '2-1' },
  { year: 2011, champion: '西雅图海湾人', runnerUp: '芝加哥火焰', score: '2-0' },
  {
    year: 2012,
    champion: '堪萨斯城体育',
    runnerUp: '西雅图海湾人',
    score: '1-1',
    note: '点球 3-2'
  },
  { year: 2013, champion: '华盛顿联', runnerUp: '皇家盐湖城', score: '1-0' },
  { year: 2014, champion: '西雅图海湾人', runnerUp: '费城联合', score: '3-1' },
  { year: 2015, champion: '堪萨斯城体育', runnerUp: '费城联合', score: '1-1', note: '点球 7-6' },
  { year: 2016, champion: '达拉斯FC', runnerUp: '新英格兰革命', score: '4-2' },
  { year: 2017, champion: '堪萨斯城体育', runnerUp: '纽约红牛', score: '2-1' },
  { year: 2018, champion: '休斯敦迪纳摩', runnerUp: '费城联合', score: '3-0' },
  { year: 2019, champion: '亚特兰大联', runnerUp: '明尼苏达联', score: '2-1' },
  { year: 2022, champion: '奥兰多城', sourceRunnerUp: '萨克拉门托共和', score: '3-0' },
  { year: 2023, champion: '休斯敦迪纳摩', runnerUp: '迈阿密国际', score: '2-1' },
  { year: 2024, champion: '洛杉矶FC', runnerUp: '堪萨斯城体育', score: '3-1', note: '加时' },
  { year: 2025, champion: '纳什维尔SC', runnerUp: '奥斯汀FC', score: '2-1' }
];

export const US_OPEN_CUP_RESULTS: UsOpenCupResult[] = RAW_RESULTS.map((result) => {
  const sourceChampion = result.sourceChampion ?? result.champion;
  const sourceRunnerUp = result.sourceRunnerUp ?? result.runnerUp;
  const recordedTeams = [result.champion, result.runnerUp].filter(Boolean);
  const missingTeams = [
    sourceChampion !== result.champion ? sourceChampion : null,
    sourceRunnerUp !== result.runnerUp ? sourceRunnerUp : null
  ].filter(Boolean);

  return {
    ...result,
    sourceChampion: sourceChampion ?? '未知冠军',
    sourceRunnerUp: sourceRunnerUp ?? '未知亚军',
    name: `${result.year}年`,
    season: `${result.year}`,
    host: '美国公开杯决赛',
    quantity: recordedTeams.length,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: [
      `决赛${sourceChampion ?? result.champion} ${result.score} ${sourceRunnerUp ?? result.runnerUp}。`,
      result.note ?? null,
      missingTeams.length ? `未录入当前库缺失俱乐部：${missingTeams.join('、')}。` : null
    ]
      .filter(Boolean)
      .join(' ')
  };
});

export function buildUsOpenCupStandings(result: UsOpenCupResult): SeedStanding[] {
  return [
    ...(result.champion
      ? [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion }]
      : []),
    ...(result.runnerUp
      ? [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }]
      : [])
  ];
}

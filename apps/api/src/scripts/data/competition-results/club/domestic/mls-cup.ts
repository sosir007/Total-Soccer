import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type MlsCupResult = FinalOnlyCompetitionResult & {
  name: string;
  season: string;
};

type RawMlsCupResult = Pick<MlsCupResult, 'year' | 'champion' | 'runnerUp'> & {
  score: string;
  note?: string;
};

export const MLS_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'MLS_CUP',
  name: '美国职业足球大联盟杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'MLS Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/MLS_Cup',
      remark: '用于核对 MLS Cup 赛事基础资料、历史沿革和现行状态。'
    },
    {
      label: 'List of MLS Cup finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_MLS_Cup_finals',
      remark: '用于核对 1996-2025 年历届决赛冠军、亚军和比分。'
    },
    {
      label: 'MLS official website',
      url: 'https://www.mlssoccer.com/',
      remark: '用于核对 MLS 官方赛事口径和近年结果。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    'MLS Cup 是美国职业足球大联盟季后赛总决赛，系统按美国国内一级联赛总冠军处理。',
    '每届只录 MLS Cup 决赛冠军和亚军，不录常规赛、分区名次、季军、殿军或四强。',
    '美国国内系数使用其他国家默认 0.5，命中 CLUB_DOMESTIC_LEVEL_1_LEAGUE 后冠军实际 4 分、亚军实际 1.6 分。',
    'Kansas City Wizards 历史记录统一归并到堪萨斯城体育；Dallas Burn / FC Dallas 统一使用达拉斯FC。'
  ]
};

export const MLS_CUP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1913',
    name: '华盛顿联',
    englishName: 'D.C. United',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1907',
    name: '洛杉矶银河',
    englishName: 'LA Galaxy',
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
    uid: '108893',
    name: '芝加哥火焰',
    englishName: 'Chicago Fire',
    countryName: '美国',
    confederationCode: 'CONCACAF'
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
    uid: '1910',
    name: '圣何塞地震',
    englishName: 'San Jose Earthquakes',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
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
    uid: '72000112',
    name: '休斯敦迪纳摩',
    englishName: 'Houston Dynamo',
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
    uid: '72000160',
    name: '纽约红牛',
    englishName: 'New York Red Bulls',
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
    uid: '1905',
    name: '达拉斯FC',
    englishName: 'FC Dallas',
    shortName: '达拉斯',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    forceName: true
  },
  {
    uid: '975489',
    name: '波特兰伐木者',
    englishName: 'Portland Timbers',
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
    uid: '72000789',
    name: '多伦多FC',
    englishName: 'Toronto FC',
    shortName: '多伦多',
    countryName: '加拿大',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
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
    uid: '72041885',
    name: '纽约城FC',
    englishName: 'New York City FC',
    shortName: '纽约城',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    forceName: true
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
    uid: '72019000',
    name: '费城联合',
    englishName: 'Philadelphia Union',
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
    uid: '4400014',
    name: '温哥华白浪',
    englishName: 'Vancouver Whitecaps FC',
    countryName: '加拿大',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const RAW_RESULTS: RawMlsCupResult[] = [
  { year: 1996, champion: '华盛顿联', runnerUp: '洛杉矶银河', score: '3-2', note: '加时' },
  { year: 1997, champion: '华盛顿联', runnerUp: '科罗拉多急流', score: '2-1' },
  { year: 1998, champion: '芝加哥火焰', runnerUp: '华盛顿联', score: '2-0' },
  { year: 1999, champion: '华盛顿联', runnerUp: '洛杉矶银河', score: '2-0' },
  { year: 2000, champion: '堪萨斯城体育', runnerUp: '芝加哥火焰', score: '1-0' },
  { year: 2001, champion: '圣何塞地震', runnerUp: '洛杉矶银河', score: '2-1', note: '加时' },
  { year: 2002, champion: '洛杉矶银河', runnerUp: '新英格兰革命', score: '1-0', note: '加时' },
  { year: 2003, champion: '圣何塞地震', runnerUp: '芝加哥火焰', score: '4-2' },
  { year: 2004, champion: '华盛顿联', runnerUp: '堪萨斯城体育', score: '3-2' },
  { year: 2005, champion: '洛杉矶银河', runnerUp: '新英格兰革命', score: '1-0', note: '加时' },
  {
    year: 2006,
    champion: '休斯敦迪纳摩',
    runnerUp: '新英格兰革命',
    score: '1-1',
    note: '点球 4-3'
  },
  { year: 2007, champion: '休斯敦迪纳摩', runnerUp: '新英格兰革命', score: '2-1' },
  { year: 2008, champion: '哥伦布机员', runnerUp: '纽约红牛', score: '3-1' },
  { year: 2009, champion: '皇家盐湖城', runnerUp: '洛杉矶银河', score: '1-1', note: '点球 5-4' },
  { year: 2010, champion: '科罗拉多急流', runnerUp: '达拉斯FC', score: '2-1', note: '加时' },
  { year: 2011, champion: '洛杉矶银河', runnerUp: '休斯敦迪纳摩', score: '1-0' },
  { year: 2012, champion: '洛杉矶银河', runnerUp: '休斯敦迪纳摩', score: '3-1' },
  { year: 2013, champion: '堪萨斯城体育', runnerUp: '皇家盐湖城', score: '1-1', note: '点球 7-6' },
  { year: 2014, champion: '洛杉矶银河', runnerUp: '新英格兰革命', score: '2-1', note: '加时' },
  { year: 2015, champion: '波特兰伐木者', runnerUp: '哥伦布机员', score: '2-1' },
  { year: 2016, champion: '西雅图海湾人', runnerUp: '多伦多FC', score: '0-0', note: '点球 5-4' },
  { year: 2017, champion: '多伦多FC', runnerUp: '西雅图海湾人', score: '2-0' },
  { year: 2018, champion: '亚特兰大联', runnerUp: '波特兰伐木者', score: '2-0' },
  { year: 2019, champion: '西雅图海湾人', runnerUp: '多伦多FC', score: '3-1' },
  { year: 2020, champion: '哥伦布机员', runnerUp: '西雅图海湾人', score: '3-0' },
  { year: 2021, champion: '纽约城FC', runnerUp: '波特兰伐木者', score: '1-1', note: '点球 4-2' },
  { year: 2022, champion: '洛杉矶FC', runnerUp: '费城联合', score: '3-3', note: '点球 3-0' },
  { year: 2023, champion: '哥伦布机员', runnerUp: '洛杉矶FC', score: '2-1' },
  { year: 2024, champion: '洛杉矶银河', runnerUp: '纽约红牛', score: '2-1' },
  { year: 2025, champion: '迈阿密国际', runnerUp: '温哥华白浪', score: '3-1' }
];

export const MLS_CUP_RESULTS: MlsCupResult[] = RAW_RESULTS.map((result) => ({
  ...result,
  name: `${result.year}年`,
  season: String(result.year),
  host: '决赛',
  quantity: 2,
  mode: CompetitionEditionStandingMode.FINAL_ONLY,
  standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
  remark: `MLS Cup 决赛：${result.champion} ${result.score} ${result.runnerUp}${result.note ? `，${result.note}` : ''}。`
}));

export function buildMlsCupStandings(result: MlsCupResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type MlsConferencePlayoffsResult = SeedEdition & {
  champion: string;
  runnerUp: string;
};

type RawMlsConferencePlayoffsResult = {
  year: number;
  champion: string;
  runnerUp: string;
};

export const MLS_WESTERN_CONFERENCE_PLAYOFFS_METADATA: CompetitionDataMetadata = {
  competitionCode: 'MLS_WESTERN_CONFERENCE_PLAYOFFS',
  name: '美国职业足球大联盟西区季后赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Western Conference (MLS) - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Western_Conference_(MLS)',
      remark: '用于核对 MLS 西区季后赛冠军、亚军和 2000-2002 年无分区季后赛口径。'
    },
    {
      label: 'MLS Cup playoffs - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/MLS_Cup_playoffs',
      remark: '用于核对 MLS Cup Playoffs 分区决赛阶段和赛事口径。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '美国职业足球大联盟西区季后赛按分区决赛冠亚军录入，系统按美国国内三级杯赛处理。',
    '2000、2001、2002 年 MLS Cup Playoffs 无分区季后赛，不创建届次。',
    '美国国内系数使用其他国家默认 0.5，命中 CLUB_DOMESTIC_LEVEL_3_CUP 后冠军实际 0.5 分、亚军实际 0.25 分。'
  ]
};

export const MLS_WESTERN_CONFERENCE_PLAYOFFS_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1907',
    name: '洛杉矶银河',
    englishName: 'LA Galaxy',
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
    uid: '1905',
    name: '达拉斯FC',
    englishName: 'FC Dallas',
    shortName: '达拉斯',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    forceName: true
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
    uid: '72000112',
    name: '休斯敦迪纳摩',
    englishName: 'Houston Dynamo',
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
    uid: '72049313',
    name: '洛杉矶FC',
    englishName: 'Los Angeles FC',
    shortName: '洛杉矶',
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
    uid: '72053036',
    name: '奥斯汀FC',
    englishName: 'Austin FC',
    shortName: '奥斯汀',
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
  },
  {
    uid: '-',
    name: '圣地亚哥FC',
    englishName: 'San Diego FC',
    shortName: '圣地亚哥',
    alias: '圣迭戈FC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const RAW_RESULTS: RawMlsConferencePlayoffsResult[] = [
  { year: 1996, champion: '洛杉矶银河', runnerUp: '堪萨斯城体育' },
  { year: 1997, champion: '科罗拉多急流', runnerUp: '达拉斯FC' },
  { year: 1998, champion: '芝加哥火焰', runnerUp: '洛杉矶银河' },
  { year: 1999, champion: '洛杉矶银河', runnerUp: '达拉斯FC' },
  { year: 2003, champion: '圣何塞地震', runnerUp: '堪萨斯城体育' },
  { year: 2004, champion: '堪萨斯城体育', runnerUp: '洛杉矶银河' },
  { year: 2005, champion: '洛杉矶银河', runnerUp: '科罗拉多急流' },
  { year: 2006, champion: '休斯敦迪纳摩', runnerUp: '科罗拉多急流' },
  { year: 2007, champion: '休斯敦迪纳摩', runnerUp: '堪萨斯城体育' },
  { year: 2008, champion: '纽约红牛', runnerUp: '皇家盐湖城' },
  { year: 2009, champion: '洛杉矶银河', runnerUp: '休斯敦迪纳摩' },
  { year: 2010, champion: '达拉斯FC', runnerUp: '洛杉矶银河' },
  { year: 2011, champion: '洛杉矶银河', runnerUp: '皇家盐湖城' },
  { year: 2012, champion: '洛杉矶银河', runnerUp: '西雅图海湾人' },
  { year: 2013, champion: '皇家盐湖城', runnerUp: '波特兰伐木者' },
  { year: 2014, champion: '洛杉矶银河', runnerUp: '西雅图海湾人' },
  { year: 2015, champion: '波特兰伐木者', runnerUp: '达拉斯FC' },
  { year: 2016, champion: '西雅图海湾人', runnerUp: '科罗拉多急流' },
  { year: 2017, champion: '西雅图海湾人', runnerUp: '休斯敦迪纳摩' },
  { year: 2018, champion: '波特兰伐木者', runnerUp: '堪萨斯城体育' },
  { year: 2019, champion: '西雅图海湾人', runnerUp: '洛杉矶FC' },
  { year: 2020, champion: '西雅图海湾人', runnerUp: '明尼苏达联' },
  { year: 2021, champion: '波特兰伐木者', runnerUp: '皇家盐湖城' },
  { year: 2022, champion: '洛杉矶FC', runnerUp: '奥斯汀FC' },
  { year: 2023, champion: '洛杉矶FC', runnerUp: '休斯敦迪纳摩' },
  { year: 2024, champion: '洛杉矶银河', runnerUp: '西雅图海湾人' },
  { year: 2025, champion: '温哥华白浪', runnerUp: '圣地亚哥FC' }
];

export const MLS_WESTERN_CONFERENCE_PLAYOFFS_RESULTS: MlsConferencePlayoffsResult[] =
  RAW_RESULTS.map((result) => ({
    ...result,
    name: `${result.year}年`,
    season: String(result.year),
    host: 'MLS西区季后赛',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: `MLS 西区季后赛决赛：冠军 ${result.champion}，亚军 ${result.runnerUp}。`
  }));

export function buildMlsWesternConferencePlayoffsStandings(
  result: MlsConferencePlayoffsResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type MlsConferencePlayoffsResult = SeedEdition & {
  champion: string;
  runnerUp?: string | null;
  skippedRunnerUp?: string;
};

type RawMlsConferencePlayoffsResult = {
  year: number;
  champion: string;
  runnerUp?: string | null;
  skippedRunnerUp?: string;
};

export const MLS_EASTERN_CONFERENCE_PLAYOFFS_METADATA: CompetitionDataMetadata = {
  competitionCode: 'MLS_EASTERN_CONFERENCE_PLAYOFFS',
  name: '美国职业足球大联盟东区季后赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Eastern Conference (MLS) - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Eastern_Conference_(MLS)',
      remark: '用于核对 MLS 东区季后赛冠军、亚军和 2000-2002 年无分区季后赛口径。'
    },
    {
      label: 'MLS Cup playoffs - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/MLS_Cup_playoffs',
      remark: '用于核对 MLS Cup Playoffs 分区决赛阶段和赛事口径。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '美国职业足球大联盟东区季后赛按分区决赛冠亚军录入，系统按美国国内三级杯赛处理。',
    '2000、2001、2002 年 MLS Cup Playoffs 无分区季后赛，不创建届次。',
    '1996 年亚军坦帕湾叛变者因俱乐部未入库，本轮不创建对应 standings。',
    '美国国内系数使用其他国家默认 0.5，命中 CLUB_DOMESTIC_LEVEL_3_CUP 后冠军实际 0.5 分、亚军实际 0.25 分。'
  ]
};

export const MLS_EASTERN_CONFERENCE_PLAYOFFS_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1913',
    name: '华盛顿联',
    englishName: 'D.C. United',
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
    uid: '108893',
    name: '芝加哥火焰',
    englishName: 'Chicago Fire',
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
    uid: '980543',
    name: '皇家盐湖城',
    englishName: 'Real Salt Lake',
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
    uid: '72023746',
    name: '堪萨斯城体育',
    englishName: 'Sporting Kansas City',
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
    uid: '72000789',
    name: '多伦多FC',
    englishName: 'Toronto FC',
    shortName: '多伦多',
    countryName: '加拿大',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '2000152066',
    name: '蒙特利尔CF',
    englishName: 'CF Montréal',
    shortName: '蒙特利尔',
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
    uid: '72019000',
    name: '费城联合',
    englishName: 'Philadelphia Union',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '20041327',
    name: '辛辛那提FC',
    englishName: 'FC Cincinnati',
    shortName: '辛辛那提',
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
    uid: '72052048',
    name: '迈阿密国际',
    englishName: 'Inter Miami CF',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const RAW_RESULTS: RawMlsConferencePlayoffsResult[] = [
  { year: 1996, champion: '华盛顿联', skippedRunnerUp: '坦帕湾叛变者' },
  { year: 1997, champion: '华盛顿联', runnerUp: '哥伦布机员' },
  { year: 1998, champion: '华盛顿联', runnerUp: '哥伦布机员' },
  { year: 1999, champion: '华盛顿联', runnerUp: '哥伦布机员' },
  { year: 2003, champion: '芝加哥火焰', runnerUp: '新英格兰革命' },
  { year: 2004, champion: '华盛顿联', runnerUp: '新英格兰革命' },
  { year: 2005, champion: '新英格兰革命', runnerUp: '芝加哥火焰' },
  { year: 2006, champion: '新英格兰革命', runnerUp: '华盛顿联' },
  { year: 2007, champion: '新英格兰革命', runnerUp: '芝加哥火焰' },
  { year: 2008, champion: '哥伦布机员', runnerUp: '芝加哥火焰' },
  { year: 2009, champion: '皇家盐湖城', runnerUp: '芝加哥火焰' },
  { year: 2010, champion: '科罗拉多急流', runnerUp: '圣何塞地震' },
  { year: 2011, champion: '休斯敦迪纳摩', runnerUp: '堪萨斯城体育' },
  { year: 2012, champion: '休斯敦迪纳摩', runnerUp: '华盛顿联' },
  { year: 2013, champion: '堪萨斯城体育', runnerUp: '休斯敦迪纳摩' },
  { year: 2014, champion: '新英格兰革命', runnerUp: '纽约红牛' },
  { year: 2015, champion: '哥伦布机员', runnerUp: '纽约红牛' },
  { year: 2016, champion: '多伦多FC', runnerUp: '蒙特利尔CF' },
  { year: 2017, champion: '多伦多FC', runnerUp: '哥伦布机员' },
  { year: 2018, champion: '亚特兰大联', runnerUp: '纽约红牛' },
  { year: 2019, champion: '多伦多FC', runnerUp: '亚特兰大联' },
  { year: 2020, champion: '哥伦布机员', runnerUp: '新英格兰革命' },
  { year: 2021, champion: '纽约城FC', runnerUp: '费城联合' },
  { year: 2022, champion: '费城联合', runnerUp: '纽约城FC' },
  { year: 2023, champion: '哥伦布机员', runnerUp: '辛辛那提FC' },
  { year: 2024, champion: '纽约红牛', runnerUp: '奥兰多城' },
  { year: 2025, champion: '迈阿密国际', runnerUp: '纽约城FC' }
];

export const MLS_EASTERN_CONFERENCE_PLAYOFFS_RESULTS: MlsConferencePlayoffsResult[] =
  RAW_RESULTS.map((result) => ({
    ...result,
    name: `${result.year}年`,
    season: String(result.year),
    host: 'MLS东区季后赛',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: buildResultRemark(result)
  }));

function buildResultRemark(result: RawMlsConferencePlayoffsResult) {
  const runnerUpText = result.runnerUp
    ? `亚军 ${result.runnerUp}`
    : `亚军 ${result.skippedRunnerUp}（俱乐部当前未入库，本轮不创建 standings）`;

  return `MLS 东区季后赛决赛：冠军 ${result.champion}，${runnerUpText}。`;
}

export function buildMlsEasternConferencePlayoffsStandings(
  result: MlsConferencePlayoffsResult
): SeedStanding[] {
  const standings: SeedStanding[] = [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion }
  ];

  if (result.runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: result.runnerUp
    });
  }

  return standings;
}

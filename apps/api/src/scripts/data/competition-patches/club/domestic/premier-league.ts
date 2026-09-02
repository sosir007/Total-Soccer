import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ENGLAND_PREMIER_LEAGUE';

type RawPremierLeagueRow = {
  season: string;
  year: number;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
};

function buildWikipediaSeasonUrl(title: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, '_')}`;
}

function formatWikiSeasonLabel(season: string) {
  return season.replace(/-/g, '–');
}

export const ENGLAND_PREMIER_LEAGUE_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '英格兰足球超级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Premier League - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Premier_League',
      remark: '用于核对赛事基础资料、英文名、现行状态和创立背景。'
    },
    {
      label: 'List of Premier League seasons - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Premier_League_seasons',
      remark: '用于核对 1992-93 至 2024-25 各赛季最终前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-01',
  notes: [
    '本补录只写入当前数据库里已存在的英格兰俱乐部 standings，缺失俱乐部对应名次留空。',
    'Blackburn Rovers 对应库内俱乐部“布莱克本流浪者”，简称已补为“布莱克本”。',
    '英超 1992-93 至 2024-25 赛季按 League Top Three 口径录入冠军、亚军和季军。',
    '英格兰国内一级联赛命中 CLUB_DOMESTIC_LEVEL_1_LEAGUE。'
  ]
};

export const ENGLAND_PREMIER_LEAGUE_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '680',
    name: '曼联',
    englishName: 'Manchester United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '603',
    name: '阿斯顿维拉',
    englishName: 'Aston Villa',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '691',
    name: '诺维奇城',
    englishName: 'Norwich City',
    shortName: '诺维奇',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '612',
    name: '布莱克本流浪者',
    englishName: 'Blackburn Rovers',
    shortName: '布莱克本',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '688',
    name: '纽卡斯尔联',
    englishName: 'Newcastle United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '692',
    name: '诺丁汉森林',
    englishName: 'Nottingham Forest',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '602',
    name: '阿森纳',
    englishName: 'Arsenal',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '676',
    name: '利物浦',
    englishName: 'Liverpool',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '671',
    name: '利兹联',
    englishName: 'Leeds United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '630',
    name: '切尔西',
    englishName: 'Chelsea',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '679',
    name: '曼城',
    englishName: 'Manchester City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '673',
    name: '莱斯特城',
    englishName: 'Leicester City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '728',
    name: '托特纳姆热刺',
    englishName: 'Tottenham Hotspur',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const RAW_PREMIER_LEAGUE_ROWS: RawPremierLeagueRow[] = [
  {
    season: '1992-93',
    year: 1993,
    champion: '曼联',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '诺维奇城'
  },
  {
    season: '1993-94',
    year: 1994,
    champion: '曼联',
    runnerUp: '布莱克本流浪者',
    thirdPlace: '纽卡斯尔联'
  },
  {
    season: '1994-95',
    year: 1995,
    champion: '布莱克本流浪者',
    runnerUp: '曼联',
    thirdPlace: '诺丁汉森林'
  },
  { season: '1995-96', year: 1996, champion: '曼联', runnerUp: '纽卡斯尔联', thirdPlace: '利物浦' },
  { season: '1996-97', year: 1997, champion: '曼联', runnerUp: '纽卡斯尔联', thirdPlace: '阿森纳' },
  { season: '1997-98', year: 1998, champion: '阿森纳', runnerUp: '曼联', thirdPlace: '利物浦' },
  { season: '1998-99', year: 1999, champion: '曼联', runnerUp: '阿森纳', thirdPlace: '切尔西' },
  { season: '1999-2000', year: 2000, champion: '曼联', runnerUp: '阿森纳', thirdPlace: '利兹联' },
  { season: '2000-01', year: 2001, champion: '曼联', runnerUp: '阿森纳', thirdPlace: '利物浦' },
  { season: '2001-02', year: 2002, champion: '阿森纳', runnerUp: '利物浦', thirdPlace: '曼联' },
  { season: '2002-03', year: 2003, champion: '曼联', runnerUp: '阿森纳', thirdPlace: '纽卡斯尔联' },
  { season: '2003-04', year: 2004, champion: '阿森纳', runnerUp: '切尔西', thirdPlace: '曼联' },
  { season: '2004-05', year: 2005, champion: '切尔西', runnerUp: '阿森纳', thirdPlace: '曼联' },
  { season: '2005-06', year: 2006, champion: '切尔西', runnerUp: '曼联', thirdPlace: '利物浦' },
  { season: '2006-07', year: 2007, champion: '曼联', runnerUp: '切尔西', thirdPlace: '利物浦' },
  { season: '2007-08', year: 2008, champion: '曼联', runnerUp: '切尔西', thirdPlace: '阿森纳' },
  { season: '2008-09', year: 2009, champion: '曼联', runnerUp: '利物浦', thirdPlace: '切尔西' },
  { season: '2009-10', year: 2010, champion: '切尔西', runnerUp: '曼联', thirdPlace: '阿森纳' },
  { season: '2010-11', year: 2011, champion: '曼联', runnerUp: '切尔西', thirdPlace: '阿森纳' },
  { season: '2011-12', year: 2012, champion: '曼城', runnerUp: '曼联', thirdPlace: '阿森纳' },
  { season: '2012-13', year: 2013, champion: '曼联', runnerUp: '曼城', thirdPlace: '切尔西' },
  { season: '2013-14', year: 2014, champion: '曼城', runnerUp: '利物浦', thirdPlace: '切尔西' },
  { season: '2014-15', year: 2015, champion: '切尔西', runnerUp: '曼城', thirdPlace: '阿森纳' },
  {
    season: '2015-16',
    year: 2016,
    champion: '莱斯特城',
    runnerUp: '阿森纳',
    thirdPlace: '托特纳姆热刺'
  },
  {
    season: '2016-17',
    year: 2017,
    champion: '切尔西',
    runnerUp: '托特纳姆热刺',
    thirdPlace: '曼城'
  },
  { season: '2017-18', year: 2018, champion: '曼城', runnerUp: '曼联', thirdPlace: '托特纳姆热刺' },
  { season: '2018-19', year: 2019, champion: '曼城', runnerUp: '利物浦', thirdPlace: '切尔西' },
  { season: '2019-20', year: 2020, champion: '利物浦', runnerUp: '曼城', thirdPlace: '曼联' },
  { season: '2020-21', year: 2021, champion: '曼城', runnerUp: '曼联', thirdPlace: '利物浦' },
  { season: '2021-22', year: 2022, champion: '曼城', runnerUp: '利物浦', thirdPlace: '切尔西' },
  { season: '2022-23', year: 2023, champion: '曼城', runnerUp: '阿森纳', thirdPlace: '曼联' },
  { season: '2023-24', year: 2024, champion: '曼城', runnerUp: '阿森纳', thirdPlace: '利物浦' },
  { season: '2024-25', year: 2025, champion: '利物浦', runnerUp: '阿森纳', thirdPlace: '曼城' }
];

export const ENGLAND_PREMIER_LEAGUE_PATCHES: SeedCompetitionPatch[] = RAW_PREMIER_LEAGUE_ROWS.map(
  (row) => ({
    competitionCode: COMPETITION_CODE,
    name: row.season,
    year: row.year,
    season: row.season,
    externalUrl: buildWikipediaSeasonUrl(`${formatWikiSeasonLabel(row.season)} FA Premier League`),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: row.champion },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: row.runnerUp },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: row.thirdPlace }
    ]
  })
);

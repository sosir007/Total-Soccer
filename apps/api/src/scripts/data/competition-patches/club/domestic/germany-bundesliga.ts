import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'GERMANY_BUNDESLIGA';

type RawBundesligaRow = {
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

export const GERMANY_BUNDESLIGA_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '德国足球甲级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Bundesliga - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Bundesliga',
      remark: '用于核对赛事基础资料、英文名、现行状态和 1963-64 创立背景。'
    },
    {
      label: 'List of German football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_German_football_champions',
      remark: '用于核对德甲成立以来德国顶级联赛冠军口径。'
    },
    {
      label: 'German champions in the Bundesliga - Bundesliga official',
      url: 'https://www.bundesliga.com/en/faq/10-things-on-the-bundesliga/german-champions-in-the-bundesliga-10554',
      remark: '用于交叉核对德甲历届冠军。'
    },
    {
      label: 'Bundesliga history - Fomelabo',
      url: 'https://fomelabo.com/en/history/bundes',
      remark: '用于核对 1963-64 至 2025-26 各赛季最终前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-02',
  notes: [
    '本补录只写入当前数据库已存在的德国俱乐部 standings，库外球队对应名次直接过滤，不创建新俱乐部。',
    '德国足球锦标赛 1903-1963 不纳入本赛事，后续如需录入应单独建“德国足球锦标赛”。',
    '德甲 1963-64 至 2025-26 赛季按 League Top Three 口径录入冠军、亚军和季军。',
    '德国国内一级联赛命中 CLUB_DOMESTIC_LEVEL_1_LEAGUE，德国国内系数为 1。'
  ]
};

export const GERMANY_BUNDESLIGA_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '916',
    name: '科隆',
    englishName: 'Cologne',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '933',
    name: '杜伊斯堡',
    englishName: 'MSV Duisburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '912',
    name: '法兰克福',
    englishName: 'Eintracht Frankfurt',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '948',
    name: '云达不莱梅',
    englishName: 'Werder Bremen',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '907',
    name: '多特蒙德',
    englishName: 'Borussia Dortmund',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '955',
    name: '慕尼黑1860',
    englishName: 'TSV 1860 Munich',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '915',
    name: '拜仁慕尼黑',
    englishName: 'Bayern Munich',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2237',
    name: '布伦瑞克',
    englishName: 'Eintracht Braunschweig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '931',
    name: '卡尔斯鲁厄',
    englishName: 'Karlsruher SC',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '899',
    name: '纽伦堡',
    englishName: 'Nurnberg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '946',
    name: '圣保利',
    englishName: 'FC St. Pauli',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '905',
    name: '波鸿',
    englishName: 'VfL Bochum',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '918',
    name: '美因茨05',
    englishName: 'Mainz 05',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2238',
    name: '奥格斯堡',
    englishName: 'FC Augsburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '121182',
    name: '柏林联合',
    englishName: 'Union Berlin',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '932',
    name: '奥芬巴赫踢球者',
    englishName: 'Kickers Offenbach',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '121198',
    name: '帕德博恩',
    englishName: 'SC Paderborn',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '908',
    name: '门兴格拉德巴赫',
    englishName: 'Borussia Monchengladbach',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '900',
    name: '亚琛',
    englishName: 'Alemannia Aachen',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2247',
    name: '柏林赫塔',
    englishName: 'Hertha Berlin',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '927',
    name: '汉诺威96',
    englishName: 'Hannover 96',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '920',
    name: '沙尔克04',
    englishName: 'Schalke 04',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '921',
    name: '杜塞尔多夫',
    englishName: 'Fortuna Dusseldorf',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '947',
    name: '汉堡',
    englishName: 'Hamburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '960',
    name: '斯图加特',
    englishName: 'Stuttgart',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '945',
    name: '凯泽斯劳滕',
    englishName: 'Kaiserslautern',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '902',
    name: '乌丁根05',
    englishName: 'KFC Uerdingen 05',
    alias: '乌尔丁根05',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '901',
    name: '勒沃库森',
    englishName: 'Bayer Leverkusen',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '944',
    name: '弗赖堡',
    englishName: 'Freiburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '961',
    name: '沃尔夫斯堡',
    englishName: 'Wolfsburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '91013388',
    name: 'RB莱比锡',
    englishName: 'RB Leipzig',
    alias: '莱比锡红牛',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '879226',
    name: '霍芬海姆',
    englishName: 'TSG Hoffenheim',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const RAW_BUNDESLIGA_ROWS: RawBundesligaRow[] = [
  { season: '1963-64', year: 1964, champion: '科隆', runnerUp: '杜伊斯堡', thirdPlace: '法兰克福' },
  {
    season: '1964-65',
    year: 1965,
    champion: '云达不莱梅',
    runnerUp: '科隆',
    thirdPlace: '多特蒙德'
  },
  {
    season: '1965-66',
    year: 1966,
    champion: '慕尼黑1860',
    runnerUp: '多特蒙德',
    thirdPlace: '拜仁慕尼黑'
  },
  {
    season: '1966-67',
    year: 1967,
    champion: '布伦瑞克',
    runnerUp: '慕尼黑1860',
    thirdPlace: '多特蒙德'
  },
  {
    season: '1967-68',
    year: 1968,
    champion: '纽伦堡',
    runnerUp: '云达不莱梅',
    thirdPlace: '门兴格拉德巴赫'
  },
  {
    season: '1968-69',
    year: 1969,
    champion: '拜仁慕尼黑',
    runnerUp: '亚琛',
    thirdPlace: '门兴格拉德巴赫'
  },
  {
    season: '1969-70',
    year: 1970,
    champion: '门兴格拉德巴赫',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '柏林赫塔'
  },
  {
    season: '1970-71',
    year: 1971,
    champion: '门兴格拉德巴赫',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '柏林赫塔'
  },
  {
    season: '1971-72',
    year: 1972,
    champion: '拜仁慕尼黑',
    runnerUp: '沙尔克04',
    thirdPlace: '门兴格拉德巴赫'
  },
  {
    season: '1972-73',
    year: 1973,
    champion: '拜仁慕尼黑',
    runnerUp: '科隆',
    thirdPlace: '杜塞尔多夫'
  },
  {
    season: '1973-74',
    year: 1974,
    champion: '拜仁慕尼黑',
    runnerUp: '门兴格拉德巴赫',
    thirdPlace: '杜塞尔多夫'
  },
  {
    season: '1974-75',
    year: 1975,
    champion: '门兴格拉德巴赫',
    runnerUp: '柏林赫塔',
    thirdPlace: '法兰克福'
  },
  {
    season: '1975-76',
    year: 1976,
    champion: '门兴格拉德巴赫',
    runnerUp: '汉堡',
    thirdPlace: '拜仁慕尼黑'
  },
  {
    season: '1976-77',
    year: 1977,
    champion: '门兴格拉德巴赫',
    runnerUp: '沙尔克04',
    thirdPlace: '布伦瑞克'
  },
  {
    season: '1977-78',
    year: 1978,
    champion: '科隆',
    runnerUp: '门兴格拉德巴赫',
    thirdPlace: '柏林赫塔'
  },
  {
    season: '1978-79',
    year: 1979,
    champion: '汉堡',
    runnerUp: '斯图加特',
    thirdPlace: '凯泽斯劳滕'
  },
  {
    season: '1979-80',
    year: 1980,
    champion: '拜仁慕尼黑',
    runnerUp: '汉堡',
    thirdPlace: '斯图加特'
  },
  {
    season: '1980-81',
    year: 1981,
    champion: '拜仁慕尼黑',
    runnerUp: '汉堡',
    thirdPlace: '斯图加特'
  },
  { season: '1981-82', year: 1982, champion: '汉堡', runnerUp: '科隆', thirdPlace: '拜仁慕尼黑' },
  {
    season: '1982-83',
    year: 1983,
    champion: '汉堡',
    runnerUp: '云达不莱梅',
    thirdPlace: '斯图加特'
  },
  {
    season: '1983-84',
    year: 1984,
    champion: '斯图加特',
    runnerUp: '汉堡',
    thirdPlace: '门兴格拉德巴赫'
  },
  {
    season: '1984-85',
    year: 1985,
    champion: '拜仁慕尼黑',
    runnerUp: '云达不莱梅',
    thirdPlace: '科隆'
  },
  {
    season: '1985-86',
    year: 1986,
    champion: '拜仁慕尼黑',
    runnerUp: '云达不莱梅',
    thirdPlace: '乌丁根05'
  },
  {
    season: '1986-87',
    year: 1987,
    champion: '拜仁慕尼黑',
    runnerUp: '汉堡',
    thirdPlace: '门兴格拉德巴赫'
  },
  {
    season: '1987-88',
    year: 1988,
    champion: '云达不莱梅',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '科隆'
  },
  {
    season: '1988-89',
    year: 1989,
    champion: '拜仁慕尼黑',
    runnerUp: '科隆',
    thirdPlace: '云达不莱梅'
  },
  {
    season: '1989-90',
    year: 1990,
    champion: '拜仁慕尼黑',
    runnerUp: '科隆',
    thirdPlace: '法兰克福'
  },
  {
    season: '1990-91',
    year: 1991,
    champion: '凯泽斯劳滕',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '云达不莱梅'
  },
  {
    season: '1991-92',
    year: 1992,
    champion: '斯图加特',
    runnerUp: '多特蒙德',
    thirdPlace: '法兰克福'
  },
  {
    season: '1992-93',
    year: 1993,
    champion: '云达不莱梅',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '法兰克福'
  },
  {
    season: '1993-94',
    year: 1994,
    champion: '拜仁慕尼黑',
    runnerUp: '凯泽斯劳滕',
    thirdPlace: '勒沃库森'
  },
  {
    season: '1994-95',
    year: 1995,
    champion: '多特蒙德',
    runnerUp: '云达不莱梅',
    thirdPlace: '弗赖堡'
  },
  {
    season: '1995-96',
    year: 1996,
    champion: '多特蒙德',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '沙尔克04'
  },
  {
    season: '1996-97',
    year: 1997,
    champion: '拜仁慕尼黑',
    runnerUp: '勒沃库森',
    thirdPlace: '多特蒙德'
  },
  {
    season: '1997-98',
    year: 1998,
    champion: '凯泽斯劳滕',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '勒沃库森'
  },
  {
    season: '1998-99',
    year: 1999,
    champion: '拜仁慕尼黑',
    runnerUp: '勒沃库森',
    thirdPlace: '柏林赫塔'
  },
  {
    season: '1999-00',
    year: 2000,
    champion: '拜仁慕尼黑',
    runnerUp: '勒沃库森',
    thirdPlace: '汉堡'
  },
  {
    season: '2000-01',
    year: 2001,
    champion: '拜仁慕尼黑',
    runnerUp: '沙尔克04',
    thirdPlace: '多特蒙德'
  },
  {
    season: '2001-02',
    year: 2002,
    champion: '多特蒙德',
    runnerUp: '勒沃库森',
    thirdPlace: '拜仁慕尼黑'
  },
  {
    season: '2002-03',
    year: 2003,
    champion: '拜仁慕尼黑',
    runnerUp: '斯图加特',
    thirdPlace: '多特蒙德'
  },
  {
    season: '2003-04',
    year: 2004,
    champion: '云达不莱梅',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '勒沃库森'
  },
  {
    season: '2004-05',
    year: 2005,
    champion: '拜仁慕尼黑',
    runnerUp: '沙尔克04',
    thirdPlace: '云达不莱梅'
  },
  {
    season: '2005-06',
    year: 2006,
    champion: '拜仁慕尼黑',
    runnerUp: '云达不莱梅',
    thirdPlace: '汉堡'
  },
  {
    season: '2006-07',
    year: 2007,
    champion: '斯图加特',
    runnerUp: '沙尔克04',
    thirdPlace: '云达不莱梅'
  },
  {
    season: '2007-08',
    year: 2008,
    champion: '拜仁慕尼黑',
    runnerUp: '云达不莱梅',
    thirdPlace: '沙尔克04'
  },
  {
    season: '2008-09',
    year: 2009,
    champion: '沃尔夫斯堡',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '斯图加特'
  },
  {
    season: '2009-10',
    year: 2010,
    champion: '拜仁慕尼黑',
    runnerUp: '沙尔克04',
    thirdPlace: '云达不莱梅'
  },
  {
    season: '2010-11',
    year: 2011,
    champion: '多特蒙德',
    runnerUp: '勒沃库森',
    thirdPlace: '拜仁慕尼黑'
  },
  {
    season: '2011-12',
    year: 2012,
    champion: '多特蒙德',
    runnerUp: '拜仁慕尼黑',
    thirdPlace: '沙尔克04'
  },
  {
    season: '2012-13',
    year: 2013,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: '勒沃库森'
  },
  {
    season: '2013-14',
    year: 2014,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: '沙尔克04'
  },
  {
    season: '2014-15',
    year: 2015,
    champion: '拜仁慕尼黑',
    runnerUp: '沃尔夫斯堡',
    thirdPlace: '门兴格拉德巴赫'
  },
  {
    season: '2015-16',
    year: 2016,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: '勒沃库森'
  },
  {
    season: '2016-17',
    year: 2017,
    champion: '拜仁慕尼黑',
    runnerUp: 'RB莱比锡',
    thirdPlace: '多特蒙德'
  },
  {
    season: '2017-18',
    year: 2018,
    champion: '拜仁慕尼黑',
    runnerUp: '沙尔克04',
    thirdPlace: '霍芬海姆'
  },
  {
    season: '2018-19',
    year: 2019,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: 'RB莱比锡'
  },
  {
    season: '2019-20',
    year: 2020,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: 'RB莱比锡'
  },
  {
    season: '2020-21',
    year: 2021,
    champion: '拜仁慕尼黑',
    runnerUp: 'RB莱比锡',
    thirdPlace: '多特蒙德'
  },
  {
    season: '2021-22',
    year: 2022,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: '勒沃库森'
  },
  {
    season: '2022-23',
    year: 2023,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: 'RB莱比锡'
  },
  {
    season: '2023-24',
    year: 2024,
    champion: '勒沃库森',
    runnerUp: '斯图加特',
    thirdPlace: '拜仁慕尼黑'
  },
  {
    season: '2024-25',
    year: 2025,
    champion: '拜仁慕尼黑',
    runnerUp: '勒沃库森',
    thirdPlace: '法兰克福'
  },
  {
    season: '2025-26',
    year: 2026,
    champion: '拜仁慕尼黑',
    runnerUp: '多特蒙德',
    thirdPlace: 'RB莱比锡'
  }
];

export const GERMANY_BUNDESLIGA_PATCHES: SeedCompetitionPatch[] = RAW_BUNDESLIGA_ROWS.map(
  (row) => ({
    competitionCode: COMPETITION_CODE,
    name: row.season,
    year: row.year,
    season: row.season,
    externalUrl: buildWikipediaSeasonUrl(`${formatWikiSeasonLabel(row.season)} Bundesliga`),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: row.champion },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: row.runnerUp },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: row.thirdPlace }
    ]
  })
);

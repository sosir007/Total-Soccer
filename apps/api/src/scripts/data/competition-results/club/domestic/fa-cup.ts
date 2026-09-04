import type { SeedClub, SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const SOURCE_URL = 'https://www.rsssf.org/tablese/engcuphist.html';

export type RawFaCupRow = {
  season: string;
  year: number;
  champion: string;
  runnerUp: string;
  remark?: string;
};

function buildWikipediaSeasonUrl(title: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, '_')}`;
}

function formatWikiSeasonLabel(season: string) {
  return season.replace(/-/g, '–');
}

export const ENGLAND_FA_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ENGLAND_FA_CUP',
  name: '英格兰足总杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'England - FA Challenge Cup Finals 1946-now - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对 1881-82 至 2025-26 决赛冠亚军和战后历届球队。'
    },
    {
      label: 'FA Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/FA_Cup',
      remark: '用于核对赛事基础资料、历史沿革和现行状态。'
    },
    {
      label: '2025 Emirates FA Cup Final report - The FA',
      url: 'https://www.thefa.com/news/2025/may/17/emirates-fa-cup-final-crystal-palace-manchester-city-report-20251705',
      remark: '用于核对 2024-25 届足总杯决赛冠军和亚军。'
    },
    {
      label: '2026 Emirates FA Cup Final report - The FA',
      url: 'https://www.thefa.com/news/2026/may/16/emirates-fa-cup-final-chelsea-v-manchester-city-report-20261605',
      remark: '用于核对 2025-26 届足总杯决赛冠军和亚军。'
    }
  ],
  lastVerifiedAt: '2026-09-04',
  notes: [
    '本文件先录入 1881-82 至 2025-26 届次；1871-72 至 1880-81 因双方均为库外旧队，暂不建届次。',
    '本文件只按当前数据库里已有俱乐部录入荣誉；若冠军或亚军暂未映射到库内实体，则该名次留空。',
    '赛事本体 seed 不直接写 standings，历届冠亚军统一走 domestic competition patches。'
  ]
};

export const ENGLAND_FA_CUP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '645',
    name: '德比郡',
    englishName: 'Derby County',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '628',
    name: '查尔顿竞技',
    englishName: 'Charlton Athletic',
    shortName: '查尔顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '622',
    name: '伯恩利',
    englishName: 'Burnley',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '680',
    name: '曼联',
    englishName: 'Manchester United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '613',
    name: '布莱克浦',
    englishName: 'Blackpool',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '740',
    name: '狼队',
    englishName: 'Wolverhampton Wanderers',
    alias: '伍尔弗汉普顿流浪者',
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
    uid: '688',
    name: '纽卡斯尔联',
    englishName: 'Newcastle United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '614',
    name: '博尔顿',
    englishName: 'Bolton Wanderers',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '734',
    name: '西布朗维奇',
    englishName: 'West Bromwich Albion',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '700',
    name: '普雷斯顿',
    englishName: 'Preston North End',
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
    uid: '609',
    name: '伯明翰城',
    englishName: 'Birmingham City',
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
    uid: '692',
    name: '诺丁汉森林',
    englishName: 'Nottingham Forest',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '677',
    name: '卢顿镇',
    englishName: 'Luton Town',
    shortName: '卢顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '728',
    name: '托特纳姆热刺',
    englishName: 'Tottenham Hotspur',
    shortName: '热刺',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '708',
    name: '谢菲尔德联',
    englishName: 'Sheffield United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '735',
    name: '西汉姆联',
    englishName: 'West Ham United',
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
    uid: '650',
    name: '埃弗顿',
    englishName: 'Everton',
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
    uid: '713',
    name: '南安普顿',
    englishName: 'Southampton',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '667',
    name: '伊普斯维奇',
    englishName: 'Ipswich Town',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '701',
    name: '女王公园巡游者',
    englishName: 'Queens Park Rangers',
    shortName: 'QPR',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '5110769',
    name: 'AFC温布尔登',
    englishName: 'Wimbledon',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '642',
    name: '水晶宫',
    englishName: 'Crystal Palace',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '732',
    name: '沃特福德',
    englishName: 'Watford',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '685',
    name: '米德尔斯堡',
    englishName: 'Middlesbrough',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '686',
    name: '米尔沃尔',
    englishName: 'Millwall',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '625',
    name: '卡迪夫城',
    englishName: 'Cardiff City',
    countryName: '威尔士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '721',
    name: '斯托克城',
    englishName: 'Stoke City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '737',
    name: '维冈竞技',
    englishName: 'Wigan Athletic',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '665',
    name: '赫尔城',
    englishName: 'Hull City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '654',
    name: '富勒姆',
    englishName: 'Fulham',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '618',
    name: '布莱顿',
    englishName: 'Brighton & Hove Albion',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '600',
    name: '伯恩茅斯',
    englishName: 'Bournemouth',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '617',
    name: '布伦特福德',
    englishName: 'Brentford',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '699',
    name: '朴茨茅斯',
    englishName: 'Portsmouth',
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
    uid: '709',
    name: '谢菲尔德星期三',
    englishName: 'Sheffield Wednesday',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const RAW_FA_CUP_ROWS: RawFaCupRow[] = [
  { season: '1881-82', year: 1882, champion: 'Old Etonians', runnerUp: 'Blackburn Rovers' },
  { season: '1883-84', year: 1884, champion: 'Blackburn Rovers', runnerUp: "Queen's Park" },
  { season: '1884-85', year: 1885, champion: 'Blackburn Rovers', runnerUp: "Queen's Park" },
  { season: '1885-86', year: 1886, champion: 'Blackburn Rovers', runnerUp: 'West Bromwich Albion' },
  { season: '1886-87', year: 1887, champion: 'Aston Villa', runnerUp: 'West Bromwich Albion' },
  {
    season: '1887-88',
    year: 1888,
    champion: 'West Bromwich Albion',
    runnerUp: 'Preston North End'
  },
  {
    season: '1888-89',
    year: 1889,
    champion: 'Preston North End',
    runnerUp: 'Wolverhampton Wanderers'
  },
  { season: '1889-90', year: 1890, champion: 'Blackburn Rovers', runnerUp: 'The Wednesday' },
  { season: '1890-91', year: 1891, champion: 'Blackburn Rovers', runnerUp: 'Notts County' },
  { season: '1891-92', year: 1892, champion: 'West Bromwich Albion', runnerUp: 'Aston Villa' },
  { season: '1892-93', year: 1893, champion: 'Wolverhampton Wanderers', runnerUp: 'Everton' },
  { season: '1893-94', year: 1894, champion: 'Notts County', runnerUp: 'Bolton Wanderers' },
  { season: '1894-95', year: 1895, champion: 'Aston Villa', runnerUp: 'West Bromwich Albion' },
  { season: '1895-96', year: 1896, champion: 'The Wednesday', runnerUp: 'Wolverhampton Wanderers' },
  { season: '1896-97', year: 1897, champion: 'Aston Villa', runnerUp: 'Everton' },
  { season: '1897-98', year: 1898, champion: 'Nottingham Forest', runnerUp: 'Derby County' },
  { season: '1898-99', year: 1899, champion: 'Sheffield United', runnerUp: 'Derby County' },
  { season: '1899-1900', year: 1900, champion: 'Bury', runnerUp: 'Southampton' },
  { season: '1900-01', year: 1901, champion: 'Tottenham Hotspur', runnerUp: 'Sheffield United' },
  { season: '1901-02', year: 1902, champion: 'Sheffield United', runnerUp: 'Southampton' },
  { season: '1902-03', year: 1903, champion: 'Bury', runnerUp: 'Derby County' },
  { season: '1903-04', year: 1904, champion: 'Manchester City', runnerUp: 'Bolton Wanderers' },
  { season: '1904-05', year: 1905, champion: 'Aston Villa', runnerUp: 'Newcastle United' },
  { season: '1905-06', year: 1906, champion: 'Everton', runnerUp: 'Newcastle United' },
  { season: '1906-07', year: 1907, champion: 'The Wednesday', runnerUp: 'Everton' },
  {
    season: '1907-08',
    year: 1908,
    champion: 'Wolverhampton Wanderers',
    runnerUp: 'Newcastle United'
  },
  { season: '1908-09', year: 1909, champion: 'Manchester United', runnerUp: 'Bristol City' },
  { season: '1909-10', year: 1910, champion: 'Newcastle United', runnerUp: 'Barnsley' },
  { season: '1910-11', year: 1911, champion: 'Bradford City', runnerUp: 'Newcastle United' },
  { season: '1911-12', year: 1912, champion: 'Barnsley', runnerUp: 'West Bromwich Albion' },
  { season: '1912-13', year: 1913, champion: 'Aston Villa', runnerUp: 'Sunderland' },
  { season: '1913-14', year: 1914, champion: 'Burnley', runnerUp: 'Liverpool' },
  { season: '1914-15', year: 1915, champion: 'Sheffield United', runnerUp: 'Chelsea' },
  { season: '1919-20', year: 1920, champion: 'Aston Villa', runnerUp: 'Huddersfield Town' },
  {
    season: '1920-21',
    year: 1921,
    champion: 'Tottenham Hotspur',
    runnerUp: 'Wolverhampton Wanderers'
  },
  { season: '1921-22', year: 1922, champion: 'Huddersfield Town', runnerUp: 'Preston North End' },
  { season: '1922-23', year: 1923, champion: 'Bolton Wanderers', runnerUp: 'West Ham United' },
  { season: '1923-24', year: 1924, champion: 'Newcastle United', runnerUp: 'Aston Villa' },
  { season: '1924-25', year: 1925, champion: 'Sheffield United', runnerUp: 'Cardiff City' },
  { season: '1925-26', year: 1926, champion: 'Bolton Wanderers', runnerUp: 'Manchester City' },
  { season: '1926-27', year: 1927, champion: 'Cardiff City', runnerUp: 'Arsenal' },
  { season: '1927-28', year: 1928, champion: 'Blackburn Rovers', runnerUp: 'Huddersfield Town' },
  { season: '1928-29', year: 1929, champion: 'Bolton Wanderers', runnerUp: 'Portsmouth' },
  { season: '1929-30', year: 1930, champion: 'Arsenal', runnerUp: 'Huddersfield Town' },
  { season: '1930-31', year: 1931, champion: 'West Bromwich Albion', runnerUp: 'Birmingham' },
  { season: '1931-32', year: 1932, champion: 'Newcastle United', runnerUp: 'Arsenal' },
  { season: '1932-33', year: 1933, champion: 'Everton', runnerUp: 'Manchester City' },
  { season: '1933-34', year: 1934, champion: 'Manchester City', runnerUp: 'Portsmouth' },
  {
    season: '1934-35',
    year: 1935,
    champion: 'Sheffield Wednesday',
    runnerUp: 'West Bromwich Albion'
  },
  { season: '1935-36', year: 1936, champion: 'Arsenal', runnerUp: 'Sheffield United' },
  { season: '1936-37', year: 1937, champion: 'Sunderland', runnerUp: 'Preston North End' },
  { season: '1937-38', year: 1938, champion: 'Preston North End', runnerUp: 'Huddersfield Town' },
  { season: '1938-39', year: 1939, champion: 'Portsmouth', runnerUp: 'Wolverhampton Wanderers' },
  { season: '1945-46', year: 1946, champion: 'Derby County', runnerUp: 'Charlton Athletic' },
  { season: '1946-47', year: 1947, champion: 'Charlton Athletic', runnerUp: 'Burnley' },
  { season: '1947-48', year: 1948, champion: 'Manchester United', runnerUp: 'Blackpool' },
  {
    season: '1948-49',
    year: 1949,
    champion: 'Wolverhampton Wanderers',
    runnerUp: 'Leicester City'
  },
  { season: '1949-50', year: 1950, champion: 'Arsenal', runnerUp: 'Liverpool' },
  { season: '1950-51', year: 1951, champion: 'Newcastle United', runnerUp: 'Blackpool' },
  { season: '1951-52', year: 1952, champion: 'Newcastle United', runnerUp: 'Arsenal' },
  { season: '1952-53', year: 1953, champion: 'Blackpool', runnerUp: 'Bolton Wanderers' },
  {
    season: '1953-54',
    year: 1954,
    champion: 'West Bromwich Albion',
    runnerUp: 'Preston North End'
  },
  { season: '1954-55', year: 1955, champion: 'Newcastle United', runnerUp: 'Manchester City' },
  { season: '1955-56', year: 1956, champion: 'Manchester City', runnerUp: 'Birmingham City' },
  { season: '1956-57', year: 1957, champion: 'Aston Villa', runnerUp: 'Manchester United' },
  { season: '1957-58', year: 1958, champion: 'Bolton Wanderers', runnerUp: 'Manchester United' },
  { season: '1958-59', year: 1959, champion: 'Nottingham Forest', runnerUp: 'Luton Town' },
  {
    season: '1959-60',
    year: 1960,
    champion: 'Wolverhampton Wanderers',
    runnerUp: 'Blackburn Rovers'
  },
  {
    season: '1960-61',
    year: 1961,
    champion: 'Tottenham Hotspur',
    runnerUp: 'Leicester City'
  },
  { season: '1961-62', year: 1962, champion: 'Tottenham Hotspur', runnerUp: 'Burnley' },
  { season: '1962-63', year: 1963, champion: 'Manchester United', runnerUp: 'Leicester City' },
  { season: '1963-64', year: 1964, champion: 'West Ham United', runnerUp: 'Preston North End' },
  { season: '1964-65', year: 1965, champion: 'Liverpool', runnerUp: 'Leeds United' },
  { season: '1965-66', year: 1966, champion: 'Everton', runnerUp: 'Sheffield Wednesday' },
  { season: '1966-67', year: 1967, champion: 'Tottenham Hotspur', runnerUp: 'Chelsea' },
  { season: '1967-68', year: 1968, champion: 'West Bromwich Albion', runnerUp: 'Everton' },
  { season: '1968-69', year: 1969, champion: 'Manchester City', runnerUp: 'Leicester City' },
  { season: '1969-70', year: 1970, champion: 'Chelsea', runnerUp: 'Leeds United' },
  { season: '1970-71', year: 1971, champion: 'Arsenal', runnerUp: 'Liverpool' },
  { season: '1971-72', year: 1972, champion: 'Leeds United', runnerUp: 'Arsenal' },
  { season: '1972-73', year: 1973, champion: 'Sunderland', runnerUp: 'Leeds United' },
  { season: '1973-74', year: 1974, champion: 'Liverpool', runnerUp: 'Newcastle United' },
  { season: '1974-75', year: 1975, champion: 'West Ham United', runnerUp: 'Fulham' },
  { season: '1975-76', year: 1976, champion: 'Southampton', runnerUp: 'Manchester United' },
  { season: '1976-77', year: 1977, champion: 'Manchester United', runnerUp: 'Liverpool' },
  { season: '1977-78', year: 1978, champion: 'Ipswich Town', runnerUp: 'Arsenal' },
  { season: '1978-79', year: 1979, champion: 'Arsenal', runnerUp: 'Manchester United' },
  { season: '1979-80', year: 1980, champion: 'West Ham United', runnerUp: 'Arsenal' },
  {
    season: '1980-81',
    year: 1981,
    champion: 'Tottenham Hotspur',
    runnerUp: 'Manchester City'
  },
  {
    season: '1981-82',
    year: 1982,
    champion: 'Tottenham Hotspur',
    runnerUp: 'Queens Park Rangers'
  },
  {
    season: '1982-83',
    year: 1983,
    champion: 'Manchester United',
    runnerUp: 'Brighton & Hove Albion'
  },
  { season: '1983-84', year: 1984, champion: 'Everton', runnerUp: 'Watford' },
  { season: '1984-85', year: 1985, champion: 'Manchester United', runnerUp: 'Everton' },
  { season: '1985-86', year: 1986, champion: 'Liverpool', runnerUp: 'Everton' },
  {
    season: '1986-87',
    year: 1987,
    champion: 'Coventry City',
    runnerUp: 'Tottenham Hotspur'
  },
  { season: '1987-88', year: 1988, champion: 'Wimbledon', runnerUp: 'Liverpool' },
  { season: '1988-89', year: 1989, champion: 'Liverpool', runnerUp: 'Everton' },
  { season: '1989-90', year: 1990, champion: 'Manchester United', runnerUp: 'Crystal Palace' },
  { season: '1990-91', year: 1991, champion: 'Tottenham Hotspur', runnerUp: 'Nottingham Forest' },
  { season: '1991-92', year: 1992, champion: 'Liverpool', runnerUp: 'Sunderland' },
  {
    season: '1992-93',
    year: 1993,
    champion: 'Arsenal',
    runnerUp: 'Sheffield Wednesday'
  },
  { season: '1993-94', year: 1994, champion: 'Manchester United', runnerUp: 'Chelsea' },
  { season: '1994-95', year: 1995, champion: 'Everton', runnerUp: 'Manchester United' },
  { season: '1995-96', year: 1996, champion: 'Manchester United', runnerUp: 'Liverpool' },
  { season: '1996-97', year: 1997, champion: 'Chelsea', runnerUp: 'Middlesbrough' },
  { season: '1997-98', year: 1998, champion: 'Arsenal', runnerUp: 'Newcastle United' },
  { season: '1998-99', year: 1999, champion: 'Manchester United', runnerUp: 'Newcastle United' },
  { season: '1999-2000', year: 2000, champion: 'Chelsea', runnerUp: 'Aston Villa' },
  { season: '2000-01', year: 2001, champion: 'Liverpool', runnerUp: 'Arsenal' },
  { season: '2001-02', year: 2002, champion: 'Arsenal', runnerUp: 'Chelsea' },
  { season: '2002-03', year: 2003, champion: 'Arsenal', runnerUp: 'Southampton' },
  { season: '2003-04', year: 2004, champion: 'Manchester United', runnerUp: 'Millwall' },
  { season: '2004-05', year: 2005, champion: 'Arsenal', runnerUp: 'Manchester United' },
  { season: '2005-06', year: 2006, champion: 'Liverpool', runnerUp: 'West Ham United' },
  { season: '2006-07', year: 2007, champion: 'Chelsea', runnerUp: 'Manchester United' },
  { season: '2007-08', year: 2008, champion: 'Portsmouth', runnerUp: 'Cardiff City' },
  { season: '2008-09', year: 2009, champion: 'Chelsea', runnerUp: 'Everton' },
  { season: '2009-10', year: 2010, champion: 'Chelsea', runnerUp: 'Portsmouth' },
  { season: '2010-11', year: 2011, champion: 'Manchester City', runnerUp: 'Stoke City' },
  { season: '2011-12', year: 2012, champion: 'Chelsea', runnerUp: 'Liverpool' },
  { season: '2012-13', year: 2013, champion: 'Wigan Athletic', runnerUp: 'Manchester City' },
  { season: '2013-14', year: 2014, champion: 'Arsenal', runnerUp: 'Hull City' },
  { season: '2014-15', year: 2015, champion: 'Arsenal', runnerUp: 'Aston Villa' },
  {
    season: '2015-16',
    year: 2016,
    champion: 'Manchester United',
    runnerUp: 'Crystal Palace'
  },
  { season: '2016-17', year: 2017, champion: 'Arsenal', runnerUp: 'Chelsea' },
  { season: '2017-18', year: 2018, champion: 'Chelsea', runnerUp: 'Manchester United' },
  { season: '2018-19', year: 2019, champion: 'Manchester City', runnerUp: 'Watford' },
  { season: '2019-20', year: 2020, champion: 'Arsenal', runnerUp: 'Chelsea' },
  { season: '2020-21', year: 2021, champion: 'Leicester City', runnerUp: 'Chelsea' },
  { season: '2021-22', year: 2022, champion: 'Liverpool', runnerUp: 'Chelsea' },
  {
    season: '2022-23',
    year: 2023,
    champion: 'Manchester City',
    runnerUp: 'Manchester United'
  },
  {
    season: '2023-24',
    year: 2024,
    champion: 'Manchester United',
    runnerUp: 'Manchester City'
  },
  { season: '2024-25', year: 2025, champion: 'Crystal Palace', runnerUp: 'Manchester City' },
  { season: '2025-26', year: 2026, champion: 'Manchester City', runnerUp: 'Chelsea' }
];

export const ENGLAND_FA_CUP_RESULTS: SeedEdition[] = RAW_FA_CUP_ROWS.map((row) => ({
  name: row.season,
  year: row.year,
  season: row.season,
  quantity: 1,
  externalUrl: buildWikipediaSeasonUrl(`${formatWikiSeasonLabel(row.season)} FA Cup`),
  remark: row.remark ?? null
}));

export const ENGLAND_FA_CUP_RAW_ROWS = RAW_FA_CUP_ROWS;

import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const SOURCE_URL = 'https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/statistik/bisherige-sieger';

type RawDfbPokalRow = {
  season: string;
  year: number;
  champion: string;
  runnerUp: string;
};

export const DFB_POKAL_METADATA: CompetitionDataMetadata = {
  competitionCode: 'DFB_POKAL',
  name: '德国足协杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Bisherige Sieger des DFB-Pokals der Männer - DFB',
      url: SOURCE_URL,
      remark: '用于核对 1934-35 至 2025-26 历届冠亚军和历史前身口径。'
    },
    {
      label: 'List of DFB-Pokal finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_DFB-Pokal_finals',
      remark: '用于交叉核对历届决赛名单。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '德国足协杯为德国全国性国内杯赛，1934-35 赛季开始；1934-43 早期历史通常与 Tschammer-Pokal 一并统计。',
    '本文件只负责创建德国足协杯赛事本体，历届 standings 统一走 domestic competition patches。',
    '只按当前数据库已存在的俱乐部录入荣誉，库外历史俱乐部留空。'
  ]
};

export const RAW_DFB_POKAL_ROWS: RawDfbPokalRow[] = [
  { season: '1934-35', year: 1935, champion: '1. FC Nürnberg', runnerUp: 'FC Schalke 04' },
  { season: '1935-36', year: 1936, champion: 'VfB Leipzig', runnerUp: 'FC Schalke 04' },
  { season: '1936-37', year: 1937, champion: 'FC Schalke 04', runnerUp: 'Fortuna Düsseldorf' },
  { season: '1937-38', year: 1938, champion: 'Rapid Wien', runnerUp: 'FSV Frankfurt' },
  { season: '1938-39', year: 1939, champion: '1. FC Nürnberg', runnerUp: 'SV Waldhof Mannheim' },
  { season: '1939-40', year: 1940, champion: 'Dresdner SC', runnerUp: '1. FC Nürnberg' },
  { season: '1940-41', year: 1941, champion: 'Dresdner SC', runnerUp: 'FC Schalke 04' },
  { season: '1941-42', year: 1942, champion: 'TSV 1860 München', runnerUp: 'FC Schalke 04' },
  { season: '1942-43', year: 1943, champion: 'Vienna Wien', runnerUp: 'LSV Hamburg' },
  { season: '1952-53', year: 1953, champion: 'Rot-Weiss Essen', runnerUp: 'Alemannia Aachen' },
  { season: '1953-54', year: 1954, champion: 'VfB Stuttgart', runnerUp: '1. FC Köln' },
  { season: '1954-55', year: 1955, champion: 'Karlsruher SC', runnerUp: 'FC Schalke 04' },
  { season: '1955-56', year: 1956, champion: 'Karlsruher SC', runnerUp: 'Hamburger SV' },
  { season: '1956-57', year: 1957, champion: 'FC Bayern München', runnerUp: 'Fortuna Düsseldorf' },
  { season: '1957-58', year: 1958, champion: 'VfB Stuttgart', runnerUp: 'Fortuna Düsseldorf' },
  {
    season: '1958-59',
    year: 1959,
    champion: 'Schwarz-Weiß Essen',
    runnerUp: 'Borussia Neunkirchen'
  },
  {
    season: '1959-60',
    year: 1960,
    champion: 'Borussia Mönchengladbach',
    runnerUp: 'Karlsruher SC'
  },
  { season: '1960-61', year: 1961, champion: 'SV Werder Bremen', runnerUp: '1. FC Kaiserslautern' },
  { season: '1961-62', year: 1962, champion: '1. FC Nürnberg', runnerUp: 'Fortuna Düsseldorf' },
  { season: '1962-63', year: 1963, champion: 'Hamburger SV', runnerUp: 'BV 09 Borussia Dortmund' },
  { season: '1963-64', year: 1964, champion: 'TSV 1860 München', runnerUp: 'Eintracht Frankfurt' },
  { season: '1964-65', year: 1965, champion: 'Borussia Dortmund', runnerUp: 'Alemannia Aachen' },
  { season: '1965-66', year: 1966, champion: 'FC Bayern München', runnerUp: 'MSV Duisburg' },
  { season: '1966-67', year: 1967, champion: 'FC Bayern München', runnerUp: 'Hamburger SV' },
  { season: '1967-68', year: 1968, champion: '1. FC Köln', runnerUp: 'VfL Bochum' },
  { season: '1968-69', year: 1969, champion: 'FC Bayern München', runnerUp: 'FC Schalke 04' },
  { season: '1969-70', year: 1970, champion: 'Kickers Offenbach', runnerUp: '1. FC Köln' },
  { season: '1970-71', year: 1971, champion: 'FC Bayern München', runnerUp: '1. FC Köln' },
  { season: '1971-72', year: 1972, champion: 'FC Schalke 04', runnerUp: '1. FC Kaiserslautern' },
  { season: '1972-73', year: 1973, champion: 'Borussia Mönchengladbach', runnerUp: '1. FC Köln' },
  { season: '1973-74', year: 1974, champion: 'Eintracht Frankfurt', runnerUp: 'Hamburger SV' },
  { season: '1974-75', year: 1975, champion: 'Eintracht Frankfurt', runnerUp: 'MSV Duisburg' },
  { season: '1975-76', year: 1976, champion: 'Hamburger SV', runnerUp: '1. FC Kaiserslautern' },
  { season: '1976-77', year: 1977, champion: '1. FC Köln', runnerUp: 'Hertha BSC Berlin' },
  { season: '1977-78', year: 1978, champion: '1. FC Köln', runnerUp: 'Fortuna Düsseldorf' },
  { season: '1978-79', year: 1979, champion: 'Fortuna Düsseldorf', runnerUp: 'Hertha BSC Berlin' },
  { season: '1979-80', year: 1980, champion: 'Fortuna Düsseldorf', runnerUp: '1. FC Köln' },
  {
    season: '1980-81',
    year: 1981,
    champion: 'Eintracht Frankfurt',
    runnerUp: '1. FC Kaiserslautern'
  },
  { season: '1981-82', year: 1982, champion: 'FC Bayern München', runnerUp: '1. FC Nürnberg' },
  { season: '1982-83', year: 1983, champion: '1. FC Köln', runnerUp: 'Fortuna Köln' },
  {
    season: '1983-84',
    year: 1984,
    champion: 'FC Bayern München',
    runnerUp: 'Borussia Mönchengladbach'
  },
  { season: '1984-85', year: 1985, champion: 'Bayer 05 Uerdingen', runnerUp: 'FC Bayern München' },
  { season: '1985-86', year: 1986, champion: 'FC Bayern München', runnerUp: 'VfB Stuttgart' },
  { season: '1986-87', year: 1987, champion: 'Hamburger SV', runnerUp: 'Stuttgarter Kickers' },
  { season: '1987-88', year: 1988, champion: 'Eintracht Frankfurt', runnerUp: 'VfL Bochum' },
  { season: '1988-89', year: 1989, champion: 'Borussia Dortmund', runnerUp: 'SV Werder Bremen' },
  { season: '1989-90', year: 1990, champion: '1. FC Kaiserslautern', runnerUp: 'SV Werder Bremen' },
  { season: '1990-91', year: 1991, champion: 'SV Werder Bremen', runnerUp: '1. FC Köln' },
  {
    season: '1991-92',
    year: 1992,
    champion: 'Hannoverscher SV 96',
    runnerUp: 'Borussia Mönchengladbach'
  },
  {
    season: '1992-93',
    year: 1993,
    champion: 'Bayer 04 Leverkusen',
    runnerUp: 'Hertha BSC Berlin Amateure'
  },
  { season: '1993-94', year: 1994, champion: 'SV Werder Bremen', runnerUp: 'Rot-Weiss Essen' },
  {
    season: '1994-95',
    year: 1995,
    champion: 'Borussia Mönchengladbach',
    runnerUp: 'VfL Wolfsburg'
  },
  { season: '1995-96', year: 1996, champion: '1. FC Kaiserslautern', runnerUp: 'Karlsruher SC' },
  { season: '1996-97', year: 1997, champion: 'VfB Stuttgart', runnerUp: 'FC Energie Cottbus' },
  { season: '1997-98', year: 1998, champion: 'FC Bayern München', runnerUp: 'MSV Duisburg' },
  { season: '1998-99', year: 1999, champion: 'SV Werder Bremen', runnerUp: 'FC Bayern München' },
  { season: '1999-2000', year: 2000, champion: 'FC Bayern München', runnerUp: 'SV Werder Bremen' },
  { season: '2000-01', year: 2001, champion: 'FC Schalke 04', runnerUp: '1. FC Union Berlin' },
  { season: '2001-02', year: 2002, champion: 'FC Schalke 04', runnerUp: 'Bayer Leverkusen' },
  {
    season: '2002-03',
    year: 2003,
    champion: 'FC Bayern München',
    runnerUp: '1. FC Kaiserslautern'
  },
  { season: '2003-04', year: 2004, champion: 'SV Werder Bremen', runnerUp: 'Alemannia Aachen' },
  { season: '2004-05', year: 2005, champion: 'FC Bayern München', runnerUp: 'FC Schalke 04' },
  { season: '2005-06', year: 2006, champion: 'Bayern München', runnerUp: 'Eintracht Frankfurt' },
  { season: '2006-07', year: 2007, champion: '1. FC Nürnberg', runnerUp: 'VfB Stuttgart' },
  { season: '2007-08', year: 2008, champion: 'FC Bayern München', runnerUp: 'Borussia Dortmund' },
  { season: '2008-09', year: 2009, champion: 'Werder Bremen', runnerUp: 'Bayer Leverkusen' },
  { season: '2009-10', year: 2010, champion: 'FC Bayern München', runnerUp: 'Werder Bremen' },
  { season: '2010-11', year: 2011, champion: 'FC Schalke 04', runnerUp: 'MSV Duisburg' },
  { season: '2011-12', year: 2012, champion: 'Borussia Dortmund', runnerUp: 'Bayern München' },
  { season: '2012-13', year: 2013, champion: 'Bayern München', runnerUp: 'VfB Stuttgart' },
  { season: '2013-14', year: 2014, champion: 'Bayern München', runnerUp: 'Borussia Dortmund' },
  { season: '2014-15', year: 2015, champion: 'VfL Wolfsburg', runnerUp: 'Borussia Dortmund' },
  { season: '2015-16', year: 2016, champion: 'FC Bayern München', runnerUp: 'Borussia Dortmund' },
  { season: '2016-17', year: 2017, champion: 'Borussia Dortmund', runnerUp: 'Eintracht Frankfurt' },
  { season: '2017-18', year: 2018, champion: 'Eintracht Frankfurt', runnerUp: 'FC Bayern München' },
  { season: '2018-19', year: 2019, champion: 'FC Bayern München', runnerUp: 'RB Leipzig' },
  { season: '2019-20', year: 2020, champion: 'FC Bayern München', runnerUp: 'Bayer Leverkusen' },
  { season: '2020-21', year: 2021, champion: 'Borussia Dortmund', runnerUp: 'RB Leipzig' },
  { season: '2021-22', year: 2022, champion: 'RB Leipzig', runnerUp: 'SC Freiburg' },
  { season: '2022-23', year: 2023, champion: 'RB Leipzig', runnerUp: 'Eintracht Frankfurt' },
  { season: '2023-24', year: 2024, champion: 'Bayer Leverkusen', runnerUp: '1. FC Kaiserslautern' },
  { season: '2024-25', year: 2025, champion: 'VfB Stuttgart', runnerUp: 'Arminia Bielefeld' },
  { season: '2025-26', year: 2026, champion: 'FC Bayern München', runnerUp: 'VfB Stuttgart' }
];

export const DFB_POKAL_RESULTS: SeedEdition[] = RAW_DFB_POKAL_ROWS.map((row) => ({
  name: row.season,
  year: row.year,
  season: row.season,
  quantity: 1,
  externalUrl: SOURCE_URL
}));

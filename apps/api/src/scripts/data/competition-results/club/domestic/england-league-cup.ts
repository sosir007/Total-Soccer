import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const SOURCE_URL = 'https://www.rsssf.org/tablese/engleagcuphist.html';

export type RawEnglandLeagueCupRow = {
  season: string;
  year: number;
  champion: string;
  runnerUp: string;
  remark?: string;
};

export const ENGLAND_LEAGUE_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ENGLAND_LEAGUE_CUP',
  name: '英格兰联赛杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'England - Football League Cup Finals - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对 1960-61 至 2025-26 历届决赛冠亚军。'
    },
    {
      label: 'EFL Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/EFL_Cup',
      remark: '用于核对赛事基础资料、历史沿革和现行状态。'
    },
    {
      label: 'List of EFL Cup finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_EFL_Cup_finals',
      remark: '用于交叉核对历届决赛名单。'
    }
  ],
  lastVerifiedAt: '2026-09-04',
  notes: [
    '英格兰联赛杯自 1960-61 赛季开始，早期决赛为两回合制，1966-67 起通常为单场决赛。',
    '本文件只负责创建英格兰联赛杯赛事本体，历届 standings 统一走 domestic competition patches。',
    '只按当前数据库已存在的俱乐部录入冠军、亚军，不主动新增缺失俱乐部。',
    '英格兰联赛杯命中 CLUB_DOMESTIC_LEVEL_2_CUP，按英格兰国内二级杯赛计分。'
  ]
};

const RAW_ENGLAND_LEAGUE_CUP_ROWS: RawEnglandLeagueCupRow[] = [
  { season: '1960-61', year: 1961, champion: 'Aston Villa', runnerUp: 'Rotherham United' },
  { season: '1961-62', year: 1962, champion: 'Norwich City', runnerUp: 'Rochdale' },
  { season: '1962-63', year: 1963, champion: 'Birmingham City', runnerUp: 'Aston Villa' },
  { season: '1963-64', year: 1964, champion: 'Leicester City', runnerUp: 'Stoke City' },
  { season: '1964-65', year: 1965, champion: 'Chelsea', runnerUp: 'Leicester City' },
  {
    season: '1965-66',
    year: 1966,
    champion: 'West Bromwich Albion',
    runnerUp: 'West Ham United'
  },
  {
    season: '1966-67',
    year: 1967,
    champion: "Queen's Park Rangers",
    runnerUp: 'West Bromwich Albion'
  },
  { season: '1967-68', year: 1968, champion: 'Leeds United', runnerUp: 'Arsenal' },
  { season: '1968-69', year: 1969, champion: 'Swindon Town', runnerUp: 'Arsenal' },
  {
    season: '1969-70',
    year: 1970,
    champion: 'Manchester City',
    runnerUp: 'West Bromwich Albion'
  },
  { season: '1970-71', year: 1971, champion: 'Tottenham Hotspur', runnerUp: 'Aston Villa' },
  { season: '1971-72', year: 1972, champion: 'Stoke City', runnerUp: 'Chelsea' },
  { season: '1972-73', year: 1973, champion: 'Tottenham Hotspur', runnerUp: 'Norwich City' },
  {
    season: '1973-74',
    year: 1974,
    champion: 'Wolverhampton Wanderers',
    runnerUp: 'Manchester City'
  },
  { season: '1974-75', year: 1975, champion: 'Aston Villa', runnerUp: 'Norwich City' },
  {
    season: '1975-76',
    year: 1976,
    champion: 'Manchester City',
    runnerUp: 'Newcastle United'
  },
  { season: '1976-77', year: 1977, champion: 'Aston Villa', runnerUp: 'Everton' },
  { season: '1977-78', year: 1978, champion: 'Nottingham Forest', runnerUp: 'Liverpool' },
  {
    season: '1978-79',
    year: 1979,
    champion: 'Nottingham Forest',
    runnerUp: 'Southampton'
  },
  {
    season: '1979-80',
    year: 1980,
    champion: 'Wolverhampton Wanderers',
    runnerUp: 'Nottingham Forest'
  },
  { season: '1980-81', year: 1981, champion: 'Liverpool', runnerUp: 'West Ham United' },
  { season: '1981-82', year: 1982, champion: 'Liverpool', runnerUp: 'Tottenham Hotspur' },
  { season: '1982-83', year: 1983, champion: 'Liverpool', runnerUp: 'Manchester United' },
  { season: '1983-84', year: 1984, champion: 'Liverpool', runnerUp: 'Everton' },
  { season: '1984-85', year: 1985, champion: 'Norwich City', runnerUp: 'Sunderland' },
  {
    season: '1985-86',
    year: 1986,
    champion: 'Oxford United',
    runnerUp: "Queen's Park Rangers"
  },
  { season: '1986-87', year: 1987, champion: 'Arsenal', runnerUp: 'Liverpool' },
  { season: '1987-88', year: 1988, champion: 'Luton Town', runnerUp: 'Arsenal' },
  { season: '1988-89', year: 1989, champion: 'Nottingham Forest', runnerUp: 'Luton Town' },
  {
    season: '1989-90',
    year: 1990,
    champion: 'Nottingham Forest',
    runnerUp: 'Oldham Athletic'
  },
  {
    season: '1990-91',
    year: 1991,
    champion: 'Sheffield Wednesday',
    runnerUp: 'Manchester United'
  },
  {
    season: '1991-92',
    year: 1992,
    champion: 'Manchester United',
    runnerUp: 'Nottingham Forest'
  },
  {
    season: '1992-93',
    year: 1993,
    champion: 'Arsenal',
    runnerUp: 'Sheffield Wednesday'
  },
  { season: '1993-94', year: 1994, champion: 'Aston Villa', runnerUp: 'Manchester United' },
  { season: '1994-95', year: 1995, champion: 'Liverpool', runnerUp: 'Bolton Wanderers' },
  { season: '1995-96', year: 1996, champion: 'Aston Villa', runnerUp: 'Leeds United' },
  { season: '1996-97', year: 1997, champion: 'Leicester City', runnerUp: 'Middlesbrough' },
  { season: '1997-98', year: 1998, champion: 'Chelsea', runnerUp: 'Middlesbrough' },
  {
    season: '1998-99',
    year: 1999,
    champion: 'Tottenham Hotspur',
    runnerUp: 'Leicester City'
  },
  { season: '1999-00', year: 2000, champion: 'Leicester City', runnerUp: 'Tranmere Rovers' },
  { season: '2000-01', year: 2001, champion: 'Liverpool', runnerUp: 'Birmingham City' },
  {
    season: '2001-02',
    year: 2002,
    champion: 'Blackburn Rovers',
    runnerUp: 'Tottenham Hotspur'
  },
  { season: '2002-03', year: 2003, champion: 'Liverpool', runnerUp: 'Manchester United' },
  { season: '2003-04', year: 2004, champion: 'Middlesbrough', runnerUp: 'Bolton Wanderers' },
  { season: '2004-05', year: 2005, champion: 'Chelsea', runnerUp: 'Liverpool' },
  { season: '2005-06', year: 2006, champion: 'Manchester United', runnerUp: 'Wigan Athletic' },
  { season: '2006-07', year: 2007, champion: 'Chelsea', runnerUp: 'Arsenal' },
  { season: '2007-08', year: 2008, champion: 'Tottenham Hotspur', runnerUp: 'Chelsea' },
  {
    season: '2008-09',
    year: 2009,
    champion: 'Manchester United',
    runnerUp: 'Tottenham Hotspur'
  },
  { season: '2009-10', year: 2010, champion: 'Manchester United', runnerUp: 'Aston Villa' },
  { season: '2010-11', year: 2011, champion: 'Birmingham City', runnerUp: 'Arsenal' },
  { season: '2011-12', year: 2012, champion: 'Liverpool', runnerUp: 'Cardiff City' },
  { season: '2012-13', year: 2013, champion: 'Swansea City', runnerUp: 'Bradford City' },
  { season: '2013-14', year: 2014, champion: 'Manchester City', runnerUp: 'Sunderland' },
  { season: '2014-15', year: 2015, champion: 'Chelsea', runnerUp: 'Tottenham Hotspur' },
  { season: '2015-16', year: 2016, champion: 'Manchester City', runnerUp: 'Liverpool' },
  { season: '2016-17', year: 2017, champion: 'Manchester United', runnerUp: 'Southampton' },
  { season: '2017-18', year: 2018, champion: 'Manchester City', runnerUp: 'Arsenal' },
  { season: '2018-19', year: 2019, champion: 'Manchester City', runnerUp: 'Chelsea' },
  { season: '2019-20', year: 2020, champion: 'Manchester City', runnerUp: 'Aston Villa' },
  {
    season: '2020-21',
    year: 2021,
    champion: 'Manchester City',
    runnerUp: 'Tottenham Hotspur'
  },
  { season: '2021-22', year: 2022, champion: 'Liverpool', runnerUp: 'Chelsea' },
  {
    season: '2022-23',
    year: 2023,
    champion: 'Manchester United',
    runnerUp: 'Newcastle United'
  },
  { season: '2023-24', year: 2024, champion: 'Liverpool', runnerUp: 'Chelsea' },
  { season: '2024-25', year: 2025, champion: 'Newcastle United', runnerUp: 'Liverpool' },
  { season: '2025-26', year: 2026, champion: 'Manchester City', runnerUp: 'Arsenal' }
];

export const ENGLAND_LEAGUE_CUP_RESULTS: SeedEdition[] = RAW_ENGLAND_LEAGUE_CUP_ROWS.map((row) => ({
  name: row.season,
  year: row.year,
  season: row.season,
  quantity: 1,
  externalUrl: SOURCE_URL,
  remark: row.remark ?? null
}));

export const ENGLAND_LEAGUE_CUP_RAW_ROWS = RAW_ENGLAND_LEAGUE_CUP_ROWS;

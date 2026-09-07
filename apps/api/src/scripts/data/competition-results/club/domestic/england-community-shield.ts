import { CompetitionEditionStandingMode } from '@prisma/client';
import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const SOURCE_URL = 'https://www.rsssf.org/tablese/engsupcuphist.html';

export type RawEnglandCommunityShieldRow = {
  year: number;
  champion: string;
  runnerUp?: string;
  shared?: boolean;
  remark?: string;
};

export const ENGLAND_COMMUNITY_SHIELD_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ENGLAND_COMMUNITY_SHIELD',
  name: '英格兰社区盾杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'England - List of FA Charity/Community Shield Matches - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对 1908 至 2026 历届正式 FA Charity Shield / FA Community Shield。'
    },
    {
      label: 'List of FA Community Shield matches - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_FA_Community_Shield_matches',
      remark: '用于交叉核对历届决赛名单、点球决胜和共享盾牌年份。'
    },
    {
      label: 'The FA Community Shield history',
      url: 'https://www.thefa.com/competitions/the-fa-community-shield/more/history',
      remark: '用于核对赛事沿革和现行官方口径。'
    }
  ],
  lastVerifiedAt: '2026-09-07',
  notes: [
    '英格兰社区盾杯正式前身 FA Charity Shield 自 1908 年开始；1898-1907 Sheriff of London Charity Shield 不并入本赛事。',
    '本文件只负责创建赛事和届次本体，历届 standings 统一走 domestic competition patches。',
    '早期职业联队、业余联队、世界杯队、FA XI 等非俱乐部对象只保留届次备注，不录入俱乐部荣誉。',
    '平局共享盾牌年份使用 championShare=2 分摊冠军荣誉，不另造亚军。',
    '英格兰社区盾杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，按英格兰国内三级杯赛计分。'
  ]
};

export const RAW_ENGLAND_COMMUNITY_SHIELD_ROWS: RawEnglandCommunityShieldRow[] = [
  { year: 1908, champion: 'Manchester United', runnerUp: "Queen's Park Rangers" },
  { year: 1909, champion: 'Newcastle United', runnerUp: 'Northampton Town' },
  { year: 1910, champion: 'Brighton & Hove Albion', runnerUp: 'Aston Villa' },
  { year: 1911, champion: 'Manchester United', runnerUp: 'Swindon Town' },
  { year: 1912, champion: 'Blackburn Rovers', runnerUp: "Queen's Park Rangers" },
  {
    year: 1913,
    champion: 'Professionals',
    runnerUp: 'Amateurs',
    remark: '非俱乐部对阵：Professionals 对 Amateurs，不录入俱乐部荣誉。'
  },
  { year: 1920, champion: 'West Bromwich Albion', runnerUp: 'Tottenham Hotspur' },
  { year: 1921, champion: 'Tottenham Hotspur', runnerUp: 'Burnley' },
  { year: 1922, champion: 'Huddersfield Town', runnerUp: 'Liverpool' },
  {
    year: 1923,
    champion: 'Professionals',
    runnerUp: 'Amateurs',
    remark: '非俱乐部对阵：Professionals 对 Amateurs，不录入俱乐部荣誉。'
  },
  {
    year: 1924,
    champion: 'Professionals',
    runnerUp: 'Amateurs',
    remark: '非俱乐部对阵：Professionals 对 Amateurs，不录入俱乐部荣誉。'
  },
  {
    year: 1925,
    champion: 'Amateurs',
    runnerUp: 'Professionals',
    remark: '非俱乐部对阵：Amateurs 对 Professionals，不录入俱乐部荣誉。'
  },
  {
    year: 1926,
    champion: 'Amateurs',
    runnerUp: 'Professionals',
    remark: '非俱乐部对阵：Amateurs 对 Professionals，不录入俱乐部荣誉。'
  },
  {
    year: 1927,
    champion: 'Cardiff City',
    runnerUp: 'Corinthians',
    remark:
      '亚军 Corinthians 为英格兰业余俱乐部，不是巴西科林蒂安；当前库内无该俱乐部，亚军荣誉留空。'
  },
  { year: 1928, champion: 'Everton', runnerUp: 'Blackburn Rovers' },
  {
    year: 1929,
    champion: 'Professionals',
    runnerUp: 'Amateurs',
    remark: '非俱乐部对阵：Professionals 对 Amateurs，不录入俱乐部荣誉。'
  },
  { year: 1930, champion: 'Arsenal', runnerUp: 'Sheffield Wednesday' },
  { year: 1931, champion: 'Arsenal', runnerUp: 'West Bromwich Albion' },
  { year: 1932, champion: 'Everton', runnerUp: 'Newcastle United' },
  { year: 1933, champion: 'Arsenal', runnerUp: 'Everton' },
  { year: 1934, champion: 'Arsenal', runnerUp: 'Manchester City' },
  { year: 1935, champion: 'Sheffield Wednesday', runnerUp: 'Arsenal' },
  { year: 1936, champion: 'Sunderland', runnerUp: 'Arsenal' },
  { year: 1937, champion: 'Manchester City', runnerUp: 'Sunderland' },
  { year: 1938, champion: 'Arsenal', runnerUp: 'Preston North End' },
  { year: 1948, champion: 'Arsenal', runnerUp: 'Manchester United' },
  {
    year: 1949,
    champion: 'Portsmouth',
    runnerUp: 'Wolverhampton Wanderers',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  {
    year: 1950,
    champion: 'World Cup Team',
    runnerUp: 'Canadian Touring Team',
    remark: '非俱乐部对阵：England World Cup Team 对 FA Canadian Touring Team，不录入俱乐部荣誉。'
  },
  { year: 1951, champion: 'Tottenham Hotspur', runnerUp: 'Newcastle United' },
  { year: 1952, champion: 'Manchester United', runnerUp: 'Newcastle United' },
  { year: 1953, champion: 'Arsenal', runnerUp: 'Blackpool' },
  {
    year: 1954,
    champion: 'Wolverhampton Wanderers',
    runnerUp: 'West Bromwich Albion',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  { year: 1955, champion: 'Chelsea', runnerUp: 'Newcastle United' },
  { year: 1956, champion: 'Manchester United', runnerUp: 'Manchester City' },
  { year: 1957, champion: 'Manchester United', runnerUp: 'Aston Villa' },
  { year: 1958, champion: 'Bolton Wanderers', runnerUp: 'Wolverhampton Wanderers' },
  { year: 1959, champion: 'Wolverhampton Wanderers', runnerUp: 'Nottingham Forest' },
  {
    year: 1960,
    champion: 'Burnley',
    runnerUp: 'Wolverhampton Wanderers',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  {
    year: 1961,
    champion: 'Tottenham Hotspur',
    runnerUp: 'FA XI',
    remark: '亚军 FA XI 为临时选拔队，不录入俱乐部荣誉。'
  },
  { year: 1962, champion: 'Tottenham Hotspur', runnerUp: 'Ipswich Town' },
  { year: 1963, champion: 'Everton', runnerUp: 'Manchester United' },
  {
    year: 1964,
    champion: 'Liverpool',
    runnerUp: 'West Ham United',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  {
    year: 1965,
    champion: 'Manchester United',
    runnerUp: 'Liverpool',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  { year: 1966, champion: 'Liverpool', runnerUp: 'Everton' },
  {
    year: 1967,
    champion: 'Manchester United',
    runnerUp: 'Tottenham Hotspur',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  { year: 1968, champion: 'Manchester City', runnerUp: 'West Bromwich Albion' },
  { year: 1969, champion: 'Leeds United', runnerUp: 'Manchester City' },
  { year: 1970, champion: 'Everton', runnerUp: 'Chelsea' },
  { year: 1971, champion: 'Leicester City', runnerUp: 'Liverpool' },
  { year: 1972, champion: 'Manchester City', runnerUp: 'Aston Villa' },
  { year: 1973, champion: 'Burnley', runnerUp: 'Manchester City' },
  { year: 1974, champion: 'Liverpool', runnerUp: 'Leeds United' },
  { year: 1975, champion: 'Derby County', runnerUp: 'West Ham United' },
  { year: 1976, champion: 'Liverpool', runnerUp: 'Southampton' },
  {
    year: 1977,
    champion: 'Liverpool',
    runnerUp: 'Manchester United',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  { year: 1978, champion: 'Nottingham Forest', runnerUp: 'Ipswich Town' },
  { year: 1979, champion: 'Liverpool', runnerUp: 'Arsenal' },
  { year: 1980, champion: 'Liverpool', runnerUp: 'West Ham United' },
  {
    year: 1981,
    champion: 'Aston Villa',
    runnerUp: 'Tottenham Hotspur',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  { year: 1982, champion: 'Liverpool', runnerUp: 'Tottenham Hotspur' },
  { year: 1983, champion: 'Manchester United', runnerUp: 'Liverpool' },
  { year: 1984, champion: 'Everton', runnerUp: 'Liverpool' },
  { year: 1985, champion: 'Everton', runnerUp: 'Manchester United' },
  {
    year: 1986,
    champion: 'Everton',
    runnerUp: 'Liverpool',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  { year: 1987, champion: 'Everton', runnerUp: 'Coventry City' },
  { year: 1988, champion: 'Liverpool', runnerUp: 'Wimbledon' },
  { year: 1989, champion: 'Liverpool', runnerUp: 'Arsenal' },
  {
    year: 1990,
    champion: 'Liverpool',
    runnerUp: 'Manchester United',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  {
    year: 1991,
    champion: 'Arsenal',
    runnerUp: 'Tottenham Hotspur',
    shared: true,
    remark: '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。'
  },
  { year: 1992, champion: 'Leeds United', runnerUp: 'Liverpool' },
  { year: 1993, champion: 'Manchester United', runnerUp: 'Arsenal' },
  { year: 1994, champion: 'Manchester United', runnerUp: 'Blackburn Rovers' },
  { year: 1995, champion: 'Everton', runnerUp: 'Blackburn Rovers' },
  { year: 1996, champion: 'Manchester United', runnerUp: 'Newcastle United' },
  { year: 1997, champion: 'Manchester United', runnerUp: 'Chelsea' },
  { year: 1998, champion: 'Arsenal', runnerUp: 'Manchester United' },
  { year: 1999, champion: 'Arsenal', runnerUp: 'Manchester United' },
  { year: 2000, champion: 'Chelsea', runnerUp: 'Manchester United' },
  { year: 2001, champion: 'Liverpool', runnerUp: 'Manchester United' },
  { year: 2002, champion: 'Arsenal', runnerUp: 'Liverpool' },
  { year: 2003, champion: 'Manchester United', runnerUp: 'Arsenal' },
  { year: 2004, champion: 'Arsenal', runnerUp: 'Manchester United' },
  { year: 2005, champion: 'Chelsea', runnerUp: 'Arsenal' },
  { year: 2006, champion: 'Liverpool', runnerUp: 'Chelsea' },
  { year: 2007, champion: 'Manchester United', runnerUp: 'Chelsea' },
  { year: 2008, champion: 'Manchester United', runnerUp: 'Portsmouth' },
  { year: 2009, champion: 'Chelsea', runnerUp: 'Manchester United' },
  { year: 2010, champion: 'Manchester United', runnerUp: 'Chelsea' },
  { year: 2011, champion: 'Manchester United', runnerUp: 'Manchester City' },
  { year: 2012, champion: 'Manchester City', runnerUp: 'Chelsea' },
  { year: 2013, champion: 'Manchester United', runnerUp: 'Wigan Athletic' },
  { year: 2014, champion: 'Arsenal', runnerUp: 'Manchester City' },
  { year: 2015, champion: 'Arsenal', runnerUp: 'Chelsea' },
  { year: 2016, champion: 'Manchester United', runnerUp: 'Leicester City' },
  { year: 2017, champion: 'Arsenal', runnerUp: 'Chelsea' },
  { year: 2018, champion: 'Manchester City', runnerUp: 'Chelsea' },
  { year: 2019, champion: 'Manchester City', runnerUp: 'Liverpool' },
  { year: 2020, champion: 'Arsenal', runnerUp: 'Liverpool' },
  { year: 2021, champion: 'Leicester City', runnerUp: 'Manchester City' },
  { year: 2022, champion: 'Liverpool', runnerUp: 'Manchester City' },
  { year: 2023, champion: 'Arsenal', runnerUp: 'Manchester City' },
  { year: 2024, champion: 'Manchester City', runnerUp: 'Manchester United' },
  { year: 2025, champion: 'Crystal Palace', runnerUp: 'Liverpool' },
  { year: 2026, champion: 'Arsenal', runnerUp: 'Manchester City' }
];

function buildEditionRemark(row: RawEnglandCommunityShieldRow) {
  if (row.remark) {
    return row.remark;
  }

  if (row.shared) {
    return '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。';
  }

  return null;
}

export const ENGLAND_COMMUNITY_SHIELD_RESULTS: SeedEdition[] =
  RAW_ENGLAND_COMMUNITY_SHIELD_ROWS.map((row) => ({
    name: String(row.year),
    year: row.year,
    season: String(row.year),
    quantity: 1,
    externalUrl: SOURCE_URL,
    championGroupKey: row.shared ? String(row.year) : null,
    championShare: row.shared ? 2 : null,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: buildEditionRemark(row)
  }));

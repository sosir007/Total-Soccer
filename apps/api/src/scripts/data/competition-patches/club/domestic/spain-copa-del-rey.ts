import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CopaDelReyRawResult = {
  season: string;
  champion: string;
  runnerUp: string;
  remark?: string;
};

export const SPAIN_COPA_DEL_REY_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_COPA_DEL_REY',
  name: '西班牙国王杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of Copa del Rey finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Copa_del_Rey_finals',
      remark: '用于核对历届冠亚军、同年平行决赛与历史队名映射。'
    },
    {
      label: 'Copa del Rey - RFEF',
      url: 'https://rfef.es/es/competiciones/copa-de-su-majestad-el-rey',
      remark: '用于核对赛事官方口径与特殊届次备注。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本补录只写入当前数据库里能映射到现有俱乐部的国王杯 standings，缺失俱乐部对应名次先留空。',
    'Club Ciclista de San Sebastián 按皇家社会历史前身口径映射；Racing Club de Irún 按皇家伊伦联历史前身口径映射。',
    '1910、1913 的平行决赛按原始赛事名分别录入；1904 决赛未进行，但冠军仍按官方授予结果保留。'
  ]
};

const COPA_DEL_REY_FINALS_URL = 'https://en.wikipedia.org/wiki/List_of_Copa_del_Rey_finals';

const CLUB_NAME_MAP: Record<string, string> = {
  'Athletic Bilbao': '毕尔巴鄂竞技',
  'Atlético Bilbao': '毕尔巴鄂竞技',
  'Madrid FC': '皇家马德里',
  Madrid: '皇家马德里',
  'Real Madrid': '皇家马德里',
  Barcelona: '巴塞罗那',
  'FC Barcelona': '巴塞罗那',
  'Club Ciclista de San Sebastián': '皇家社会',
  'Real Sociedad': '皇家社会',
  'Racing Club de Irún': '皇家伊伦联',
  'Racing de Irún': '皇家伊伦联',
  'Real Unión': '皇家伊伦联',
  Arenas: '阿雷纳斯',
  Valencia: '瓦伦西亚',
  Sevilla: '塞维利亚',
  'Celta Vigo': '维戈塞尔塔',
  'Atlético Madrid': '马德里竞技',
  'Real Betis': '皇家贝蒂斯',
  'Real Madrid CF': '皇家马德里',
  'RCD Español': '西班牙人',
  'CD Español': '西班牙人',
  Español: '西班牙人',
  Espanyol: '西班牙人',
  'Deportivo La Coruña': '拉科鲁尼亚',
  'Real Mallorca': '皇家马略卡',
  Mallorca: '皇家马略卡',
  Zaragoza: '萨拉戈萨',
  'Sporting Gijón': '希洪竞技',
  'Las Palmas': '拉斯帕尔马斯',
  Osasuna: '奥萨苏纳',
  Getafe: '赫塔费',
  Valladolid: '巴拉多利德',
  Alavés: '阿拉维斯',
  Elche: '埃尔切',
  Castellón: '卡斯特利翁',
  Granada: '格拉纳达'
};

const RAW_COPA_DEL_REY_RESULTS: CopaDelReyRawResult[] = [
  { season: '1903', champion: 'Athletic Bilbao', runnerUp: 'Madrid FC' },
  {
    season: '1904',
    champion: 'Athletic Bilbao',
    runnerUp: 'Español de Madrid',
    remark: '决赛未进行，冠军按官方授予结果保留。'
  },
  { season: '1905', champion: 'Madrid FC', runnerUp: 'Athletic Bilbao' },
  { season: '1906', champion: 'Madrid FC', runnerUp: 'Athletic Bilbao' },
  { season: '1907', champion: 'Madrid FC', runnerUp: 'Bizcaya' },
  { season: '1908', champion: 'Madrid FC', runnerUp: 'Real Vigo Sporting' },
  {
    season: '1909',
    champion: 'Club Ciclista de San Sebastián',
    runnerUp: 'Español de Madrid',
    remark: 'Club Ciclista de San Sebastián 按皇家社会历史前身口径映射。'
  },
  {
    season: '1910 UECF',
    champion: 'Athletic Bilbao',
    runnerUp: 'Vasconia SC',
    remark: '同年平行官方决赛之一。'
  },
  {
    season: '1910 FECF',
    champion: 'Barcelona',
    runnerUp: 'Español de Madrid',
    remark: '同年平行官方决赛之一。'
  },
  { season: '1911', champion: 'Athletic Bilbao', runnerUp: 'CD Español' },
  { season: '1912', champion: 'Barcelona', runnerUp: 'Gimnástica' },
  {
    season: '1913 UECF',
    champion: 'Barcelona',
    runnerUp: 'Real Sociedad',
    remark: '同年平行官方决赛之一。'
  },
  {
    season: '1913 FECF',
    champion: 'Racing Club de Irún',
    runnerUp: 'Athletic Bilbao',
    remark: '同年平行官方决赛之一。'
  },
  { season: '1914', champion: 'Athletic Bilbao', runnerUp: 'Espanya' },
  { season: '1915', champion: 'Athletic Bilbao', runnerUp: 'CD Español' },
  { season: '1916', champion: 'Athletic Bilbao', runnerUp: 'Madrid FC' },
  { season: '1917', champion: 'Madrid FC', runnerUp: 'Arenas' },
  { season: '1918', champion: 'Real Unión', runnerUp: 'Madrid FC' },
  { season: '1919', champion: 'Arenas', runnerUp: 'Barcelona' },
  { season: '1920', champion: 'Barcelona', runnerUp: 'Athletic Bilbao' },
  { season: '1921', champion: 'Athletic Bilbao', runnerUp: 'Atlético Madrid' },
  { season: '1922', champion: 'Barcelona', runnerUp: 'Real Unión' },
  { season: '1923', champion: 'Athletic Bilbao', runnerUp: 'CD Europa' },
  { season: '1924', champion: 'Real Unión', runnerUp: 'Real Madrid' },
  { season: '1925', champion: 'Barcelona', runnerUp: 'Arenas' },
  { season: '1926', champion: 'Barcelona', runnerUp: 'Atlético Madrid' },
  { season: '1927', champion: 'Real Unión', runnerUp: 'Arenas' },
  { season: '1928', champion: 'Barcelona', runnerUp: 'Real Sociedad' },
  { season: '1928-29', champion: 'Español', runnerUp: 'Real Madrid' },
  { season: '1930', champion: 'Athletic Bilbao', runnerUp: 'Real Madrid' },
  { season: '1931', champion: 'Athletic Bilbao', runnerUp: 'Real Betis' },
  { season: '1932', champion: 'Athletic Bilbao', runnerUp: 'Barcelona' },
  { season: '1933', champion: 'Athletic Bilbao', runnerUp: 'Real Madrid' },
  { season: '1934', champion: 'Madrid', runnerUp: 'Valencia' },
  { season: '1935', champion: 'Sevilla', runnerUp: 'Sabadell' },
  { season: '1936', champion: 'Madrid', runnerUp: 'Barcelona' },
  { season: '1939', champion: 'Sevilla', runnerUp: 'Racing de Ferrol' },
  { season: '1940', champion: 'Español', runnerUp: 'Madrid' },
  { season: '1941', champion: 'Valencia', runnerUp: 'Español' },
  { season: '1942', champion: 'Barcelona', runnerUp: 'Atlético Bilbao' },
  { season: '1943', champion: 'Atlético Bilbao', runnerUp: 'Real Madrid' },
  { season: '1944', champion: 'Atlético Bilbao', runnerUp: 'Valencia' },
  { season: '1944-45', champion: 'Atlético Bilbao', runnerUp: 'Valencia' },
  { season: '1946', champion: 'Real Madrid', runnerUp: 'Valencia' },
  { season: '1947', champion: 'Real Madrid', runnerUp: 'Español' },
  { season: '1947-48', champion: 'Sevilla', runnerUp: 'Celta Vigo' },
  { season: '1948-49', champion: 'Valencia', runnerUp: 'Atlético Bilbao' },
  { season: '1949-50', champion: 'Atlético Bilbao', runnerUp: 'Valladolid' },
  { season: '1951', champion: 'Barcelona', runnerUp: 'Real Sociedad' },
  { season: '1952', champion: 'Barcelona', runnerUp: 'Valencia' },
  { season: '1952-53', champion: 'Barcelona', runnerUp: 'Athletic Bilbao' },
  { season: '1954', champion: 'Valencia', runnerUp: 'Barcelona' },
  { season: '1955', champion: 'Athletic Bilbao', runnerUp: 'Sevilla' },
  { season: '1956', champion: 'Athletic Bilbao', runnerUp: 'Atlético Madrid' },
  { season: '1957', champion: 'Barcelona', runnerUp: 'Español' },
  { season: '1958', champion: 'Athletic Bilbao', runnerUp: 'Real Madrid' },
  { season: '1958-59', champion: 'Barcelona', runnerUp: 'Granada' },
  { season: '1959-60', champion: 'Atlético Madrid', runnerUp: 'Real Madrid' },
  { season: '1960-61', champion: 'Atlético Madrid', runnerUp: 'Real Madrid' },
  { season: '1961-62', champion: 'Real Madrid', runnerUp: 'Sevilla' },
  { season: '1962-63', champion: 'Barcelona', runnerUp: 'Zaragoza' },
  { season: '1963-64', champion: 'Zaragoza', runnerUp: 'Atlético Madrid' },
  { season: '1964-65', champion: 'Atlético Madrid', runnerUp: 'Zaragoza' },
  { season: '1965-66', champion: 'Zaragoza', runnerUp: 'Athletic Bilbao' },
  { season: '1966-67', champion: 'Valencia', runnerUp: 'Athletic Bilbao' },
  { season: '1967-68', champion: 'Barcelona', runnerUp: 'Real Madrid' },
  { season: '1969', champion: 'Atlético Bilbao', runnerUp: 'Elche' },
  { season: '1969-70', champion: 'Real Madrid', runnerUp: 'Valencia' },
  { season: '1970-71', champion: 'Barcelona', runnerUp: 'Valencia' },
  { season: '1971-72', champion: 'Atlético Madrid', runnerUp: 'Valencia' },
  { season: '1972-73', champion: 'Athletic Bilbao', runnerUp: 'Castellón' },
  { season: '1973-74', champion: 'Real Madrid', runnerUp: 'Barcelona' },
  { season: '1974-75', champion: 'Real Madrid', runnerUp: 'Atlético Madrid' },
  { season: '1975-76', champion: 'Atlético Madrid', runnerUp: 'Zaragoza' },
  { season: '1976-77', champion: 'Real Betis', runnerUp: 'Athletic Bilbao' },
  { season: '1977-78', champion: 'Barcelona', runnerUp: 'Las Palmas' },
  { season: '1978-79', champion: 'Valencia', runnerUp: 'Real Madrid' },
  { season: '1979-80', champion: 'Real Madrid', runnerUp: 'Castilla' },
  { season: '1980-81', champion: 'Barcelona', runnerUp: 'Sporting Gijón' },
  { season: '1981-82', champion: 'Real Madrid', runnerUp: 'Sporting Gijón' },
  { season: '1982-83', champion: 'Barcelona', runnerUp: 'Real Madrid' },
  { season: '1983-84', champion: 'Athletic Bilbao', runnerUp: 'Barcelona' },
  { season: '1984-85', champion: 'Atlético Madrid', runnerUp: 'Athletic Bilbao' },
  { season: '1985-86', champion: 'Zaragoza', runnerUp: 'Barcelona' },
  { season: '1986-87', champion: 'Real Sociedad', runnerUp: 'Atlético Madrid' },
  { season: '1987-88', champion: 'Barcelona', runnerUp: 'Real Sociedad' },
  { season: '1988-89', champion: 'Real Madrid', runnerUp: 'Valladolid' },
  { season: '1989-90', champion: 'Barcelona', runnerUp: 'Real Madrid' },
  { season: '1990-91', champion: 'Atlético Madrid', runnerUp: 'Mallorca' },
  { season: '1991-92', champion: 'Atlético Madrid', runnerUp: 'Real Madrid' },
  { season: '1992-93', champion: 'Real Madrid', runnerUp: 'Zaragoza' },
  { season: '1993-94', champion: 'Zaragoza', runnerUp: 'Celta Vigo' },
  { season: '1994-95', champion: 'Deportivo La Coruña', runnerUp: 'Valencia' },
  { season: '1995-96', champion: 'Atlético Madrid', runnerUp: 'Barcelona' },
  { season: '1996-97', champion: 'Barcelona', runnerUp: 'Real Betis' },
  { season: '1997-98', champion: 'Barcelona', runnerUp: 'Mallorca' },
  { season: '1998-99', champion: 'Valencia', runnerUp: 'Atlético Madrid' },
  { season: '1999-2000', champion: 'Espanyol', runnerUp: 'Atlético Madrid' },
  { season: '2000-01', champion: 'Zaragoza', runnerUp: 'Celta Vigo' },
  { season: '2001-02', champion: 'Deportivo La Coruña', runnerUp: 'Real Madrid' },
  { season: '2002-03', champion: 'Mallorca', runnerUp: 'Recreativo' },
  { season: '2003-04', champion: 'Zaragoza', runnerUp: 'Real Madrid' },
  { season: '2004-05', champion: 'Real Betis', runnerUp: 'Osasuna' },
  { season: '2005-06', champion: 'Espanyol', runnerUp: 'Zaragoza' },
  { season: '2006-07', champion: 'Sevilla', runnerUp: 'Getafe' },
  { season: '2007-08', champion: 'Valencia', runnerUp: 'Getafe' },
  { season: '2008-09', champion: 'Barcelona', runnerUp: 'Athletic Bilbao' },
  { season: '2009-10', champion: 'Sevilla', runnerUp: 'Atlético Madrid' },
  { season: '2010-11', champion: 'Real Madrid', runnerUp: 'Barcelona' },
  { season: '2011-12', champion: 'Barcelona', runnerUp: 'Athletic Bilbao' },
  { season: '2012-13', champion: 'Atlético Madrid', runnerUp: 'Real Madrid' },
  { season: '2013-14', champion: 'Real Madrid', runnerUp: 'Barcelona' },
  { season: '2014-15', champion: 'Barcelona', runnerUp: 'Athletic Bilbao' },
  { season: '2015-16', champion: 'Barcelona', runnerUp: 'Sevilla' },
  { season: '2016-17', champion: 'Barcelona', runnerUp: 'Alavés' },
  { season: '2017-18', champion: 'Barcelona', runnerUp: 'Sevilla' },
  { season: '2018-19', champion: 'Valencia', runnerUp: 'Barcelona' },
  { season: '2019-20', champion: 'Real Sociedad', runnerUp: 'Athletic Bilbao' },
  { season: '2020-21', champion: 'Barcelona', runnerUp: 'Athletic Bilbao' },
  { season: '2021-22', champion: 'Real Betis', runnerUp: 'Valencia' },
  { season: '2022-23', champion: 'Real Madrid', runnerUp: 'Osasuna' },
  { season: '2023-24', champion: 'Athletic Bilbao', runnerUp: 'Mallorca' },
  { season: '2024-25', champion: 'Barcelona', runnerUp: 'Real Madrid' },
  { season: '2025-26', champion: 'Real Sociedad', runnerUp: 'Atlético Madrid' }
];

function resolveEditionYear(season: string) {
  const rangeMatch = season.match(/^(\d{4})-(\d{2})$/);

  if (rangeMatch) {
    return Number(`${rangeMatch[1].slice(0, 2)}${rangeMatch[2]}`);
  }

  const longRangeMatch = season.match(/^(\d{4})-(\d{4})$/);

  if (longRangeMatch) {
    return Number(longRangeMatch[2]);
  }

  return Number(season.slice(0, 4));
}

function resolveClubName(sourceName: string) {
  return CLUB_NAME_MAP[sourceName] ?? null;
}

function buildRemark(entry: CopaDelReyRawResult) {
  const remarks = [entry.remark].filter(Boolean) as string[];
  const missing = [entry.champion, entry.runnerUp].filter(
    (sourceName) => !resolveClubName(sourceName)
  );

  if (missing.length) {
    remarks.push(`未录入对应俱乐部：${missing.join('、')}。`);
  }

  return remarks.length ? remarks.join(' ') : null;
}

function buildStandings(entry: CopaDelReyRawResult) {
  const standings = [];
  const champion = resolveClubName(entry.champion);
  const runnerUp = resolveClubName(entry.runnerUp);

  if (champion) {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: champion
    });
  }

  if (runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: runnerUp
    });
  }

  return standings;
}

export const SPAIN_COPA_DEL_REY_PATCHES: SeedCompetitionPatch[] = RAW_COPA_DEL_REY_RESULTS.map(
  (entry) => ({
    competitionCode: 'SPAIN_COPA_DEL_REY',
    name: entry.season,
    year: resolveEditionYear(entry.season),
    season: entry.season,
    externalUrl: COPA_DEL_REY_FINALS_URL,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(entry),
    remark: buildRemark(entry)
  })
);

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const SPAIN_LA_LIGA_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_LA_LIGA',
  name: '西班牙足球甲级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of Spanish football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Spanish_football_champions',
      remark: '用于核对西班牙甲级联赛历届冠军、亚军和季军。'
    },
    {
      label: 'Spain, Final tables 1928- - RSSSF',
      url: 'https://www.rsssf.org/tabless/spanhist.html',
      remark: '用于交叉核对西班牙甲级联赛历史赛制和各年代最终名次。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本补录只写入当前数据库里已存在或本文件补齐的西班牙俱乐部 standings，缺失俱乐部对应名次先留空。',
    '历史队名统一映射到现有俱乐部实体：Madrid FC -> 皇家马德里，Atlético Aviación -> 马德里竞技，Racing Santander -> 桑坦德竞技。',
    'Arenas、Real Unión、Real Betis、Deportivo La Coruña、Girona 等历史/现实体也一并按当前库内俱乐部名称录入。'
  ]
};

export const SPAIN_LA_LIGA_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1736',
    name: '皇家马德里',
    englishName: 'Real Madrid',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1708',
    name: '巴塞罗那',
    englishName: 'Barcelona',
    shortName: '巴萨',
    alias: 'FC Barcelona',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1687',
    name: '马德里竞技',
    englishName: 'Atlético Madrid',
    alias: 'Atlético Aviación',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1664',
    name: '毕尔巴鄂竞技',
    englishName: 'Athletic Bilbao',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1775',
    name: '瓦伦西亚',
    englishName: 'Valencia',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1742',
    name: '皇家社会',
    englishName: 'Real Sociedad',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1728',
    name: '桑坦德竞技',
    englishName: 'Racing Santander',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '102029',
    name: '阿雷纳斯',
    englishName: 'Arenas Club de Getxo',
    alias: '格乔',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1725',
    name: '西班牙人',
    englishName: 'Espanyol',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1733',
    name: '皇家贝蒂斯',
    englishName: 'Real Betis',
    shortName: '贝蒂斯',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1741',
    name: '皇家奥维耶多',
    englishName: 'Real Oviedo',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1759',
    name: '塞维利亚',
    englishName: 'Sevilla',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1746',
    name: '皇家伊伦联',
    englishName: 'Real Unión',
    alias: '皇家联合',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1705',
    name: '拉科鲁尼亚',
    englishName: 'Deportivo La Coruña',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1772',
    name: '拉斯帕尔马斯',
    englishName: 'Las Palmas',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1749',
    name: '萨拉戈萨',
    englishName: 'Real Zaragoza',
    shortName: '萨拉戈萨',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1744',
    name: '希洪竞技',
    englishName: 'Sporting Gijón',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1726',
    name: '马略卡',
    englishName: 'Mallorca',
    alias: '皇家马略卡',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1777',
    name: '比利亚雷亚尔',
    englishName: 'Villarreal',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '814089',
    name: '赫罗纳',
    englishName: 'Girona',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1714',
    name: '格拉纳达',
    englishName: 'Granada',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const CLUB_NAME_MAP: Record<string, string> = {
  Barcelona: '巴塞罗那',
  'Madrid FC': '皇家马德里',
  'Real Madrid': '皇家马德里',
  'Athletic Bilbao': '毕尔巴鄂竞技',
  'Racing Santander': '桑坦德竞技',
  'Real Sociedad': '皇家社会',
  Arenas: '阿雷纳斯',
  Espanyol: '西班牙人',
  'Real Betis': '皇家贝蒂斯',
  Oviedo: '皇家奥维耶多',
  Sevilla: '塞维利亚',
  'Atlético Aviación': '马德里竞技',
  'Atlético Madrid': '马德里竞技',
  Valencia: '瓦伦西亚',
  'Deportivo La Coruña': '拉科鲁尼亚',
  'Las Palmas': '拉斯帕尔马斯',
  Zaragoza: '萨拉戈萨',
  'Sporting Gijón': '希洪竞技',
  Mallorca: '马略卡',
  Villarreal: '比利亚雷亚尔',
  Girona: '赫罗纳',
  Granada: '格拉纳达'
};

const RAW_LA_LIGA_RESULTS = [
  ['1929', 'Barcelona', 'Madrid FC', 'Athletic Bilbao'],
  ['1929-30', 'Athletic Bilbao', 'Barcelona', 'Arenas'],
  ['1930-31', 'Athletic Bilbao', 'Racing Santander', 'Real Sociedad'],
  ['1931-32', 'Madrid FC', 'Athletic Bilbao', 'Barcelona'],
  ['1932-33', 'Madrid FC', 'Athletic Bilbao', 'Espanyol'],
  ['1933-34', 'Athletic Bilbao', 'Madrid FC', 'Racing Santander'],
  ['1934-35', 'Real Betis', 'Madrid FC', 'Oviedo'],
  ['1935-36', 'Athletic Bilbao', 'Madrid FC', 'Oviedo'],
  ['1939-40', 'Atlético Aviación', 'Sevilla', 'Athletic Bilbao'],
  ['1940-41', 'Atlético Aviación', 'Athletic Bilbao', 'Valencia'],
  ['1941-42', 'Valencia', 'Real Madrid', 'Atlético Aviación'],
  ['1942-43', 'Athletic Bilbao', 'Sevilla', 'Barcelona'],
  ['1943-44', 'Valencia', 'Atlético Aviación', 'Sevilla'],
  ['1944-45', 'Barcelona', 'Real Madrid', 'Atlético Aviación'],
  ['1945-46', 'Sevilla', 'Barcelona', 'Athletic Bilbao'],
  ['1946-47', 'Valencia', 'Athletic Bilbao', 'Atlético Aviación'],
  ['1947-48', 'Barcelona', 'Valencia', 'Atlético Madrid'],
  ['1948-49', 'Barcelona', 'Valencia', 'Real Madrid'],
  ['1949-50', 'Atlético Madrid', 'Deportivo La Coruña', 'Valencia'],
  ['1950-51', 'Atlético Madrid', 'Sevilla', 'Valencia'],
  ['1951-52', 'Barcelona', 'Athletic Bilbao', 'Real Madrid'],
  ['1952-53', 'Barcelona', 'Valencia', 'Real Madrid'],
  ['1953-54', 'Real Madrid', 'Barcelona', 'Valencia'],
  ['1954-55', 'Real Madrid', 'Barcelona', 'Athletic Bilbao'],
  ['1955-56', 'Athletic Bilbao', 'Barcelona', 'Real Madrid'],
  ['1956-57', 'Real Madrid', 'Sevilla', 'Barcelona'],
  ['1957-58', 'Real Madrid', 'Atlético Madrid', 'Barcelona'],
  ['1958-59', 'Barcelona', 'Real Madrid', 'Athletic Bilbao'],
  ['1959-60', 'Barcelona', 'Real Madrid', 'Athletic Bilbao'],
  ['1960-61', 'Real Madrid', 'Atlético Madrid', 'Zaragoza'],
  ['1961-62', 'Real Madrid', 'Barcelona', 'Atlético Madrid'],
  ['1962-63', 'Real Madrid', 'Atlético Madrid', 'Oviedo'],
  ['1963-64', 'Real Madrid', 'Barcelona', 'Real Betis'],
  ['1964-65', 'Real Madrid', 'Atlético Madrid', 'Zaragoza'],
  ['1965-66', 'Atlético Madrid', 'Real Madrid', 'Barcelona'],
  ['1966-67', 'Real Madrid', 'Barcelona', 'Espanyol'],
  ['1967-68', 'Real Madrid', 'Barcelona', 'Las Palmas'],
  ['1968-69', 'Real Madrid', 'Las Palmas', 'Barcelona'],
  ['1969-70', 'Atlético Madrid', 'Athletic Bilbao', 'Sevilla'],
  ['1970-71', 'Valencia', 'Barcelona', 'Atlético Madrid'],
  ['1971-72', 'Real Madrid', 'Valencia', 'Barcelona'],
  ['1972-73', 'Atlético Madrid', 'Barcelona', 'Espanyol'],
  ['1973-74', 'Barcelona', 'Atlético Madrid', 'Zaragoza'],
  ['1974-75', 'Real Madrid', 'Zaragoza', 'Barcelona'],
  ['1975-76', 'Real Madrid', 'Barcelona', 'Atlético Madrid'],
  ['1976-77', 'Atlético Madrid', 'Barcelona', 'Athletic Bilbao'],
  ['1977-78', 'Real Madrid', 'Barcelona', 'Athletic Bilbao'],
  ['1978-79', 'Real Madrid', 'Sporting Gijón', 'Atlético Madrid'],
  ['1979-80', 'Real Madrid', 'Real Sociedad', 'Sporting Gijón'],
  ['1980-81', 'Real Sociedad', 'Real Madrid', 'Atlético Madrid'],
  ['1981-82', 'Real Sociedad', 'Barcelona', 'Real Madrid'],
  ['1982-83', 'Athletic Bilbao', 'Real Madrid', 'Atlético Madrid'],
  ['1983-84', 'Athletic Bilbao', 'Real Madrid', 'Barcelona'],
  ['1984-85', 'Barcelona', 'Atlético Madrid', 'Athletic Bilbao'],
  ['1985-86', 'Real Madrid', 'Barcelona', 'Athletic Bilbao'],
  ['1986-87', 'Real Madrid', 'Barcelona', 'Espanyol'],
  ['1987-88', 'Real Madrid', 'Real Sociedad', 'Atlético Madrid'],
  ['1988-89', 'Real Madrid', 'Barcelona', 'Valencia'],
  ['1989-90', 'Real Madrid', 'Valencia', 'Barcelona'],
  ['1990-91', 'Barcelona', 'Atlético Madrid', 'Real Madrid'],
  ['1991-92', 'Barcelona', 'Real Madrid', 'Atlético Madrid'],
  ['1992-93', 'Barcelona', 'Real Madrid', 'Deportivo La Coruña'],
  ['1993-94', 'Barcelona', 'Deportivo La Coruña', 'Zaragoza'],
  ['1994-95', 'Real Madrid', 'Deportivo La Coruña', 'Real Betis'],
  ['1995-96', 'Atlético Madrid', 'Valencia', 'Barcelona'],
  ['1996-97', 'Real Madrid', 'Barcelona', 'Deportivo La Coruña'],
  ['1997-98', 'Barcelona', 'Athletic Bilbao', 'Real Sociedad'],
  ['1998-99', 'Barcelona', 'Real Madrid', 'Mallorca'],
  ['1999-2000', 'Deportivo La Coruña', 'Barcelona', 'Valencia'],
  ['2000-01', 'Real Madrid', 'Deportivo La Coruña', 'Mallorca'],
  ['2001-02', 'Valencia', 'Deportivo La Coruña', 'Real Madrid'],
  ['2002-03', 'Real Madrid', 'Real Sociedad', 'Deportivo La Coruña'],
  ['2003-04', 'Valencia', 'Barcelona', 'Deportivo La Coruña'],
  ['2004-05', 'Barcelona', 'Real Madrid', 'Villarreal'],
  ['2005-06', 'Barcelona', 'Real Madrid', 'Valencia'],
  ['2006-07', 'Real Madrid', 'Barcelona', 'Sevilla'],
  ['2007-08', 'Real Madrid', 'Villarreal', 'Barcelona'],
  ['2008-09', 'Barcelona', 'Real Madrid', 'Sevilla'],
  ['2009-10', 'Barcelona', 'Real Madrid', 'Valencia'],
  ['2010-11', 'Barcelona', 'Real Madrid', 'Valencia'],
  ['2011-12', 'Real Madrid', 'Barcelona', 'Valencia'],
  ['2012-13', 'Barcelona', 'Real Madrid', 'Atlético Madrid'],
  ['2013-14', 'Atlético Madrid', 'Barcelona', 'Real Madrid'],
  ['2014-15', 'Barcelona', 'Real Madrid', 'Atlético Madrid'],
  ['2015-16', 'Barcelona', 'Real Madrid', 'Atlético Madrid'],
  ['2016-17', 'Real Madrid', 'Barcelona', 'Atlético Madrid'],
  ['2017-18', 'Barcelona', 'Atlético Madrid', 'Real Madrid'],
  ['2018-19', 'Barcelona', 'Atlético Madrid', 'Real Madrid'],
  ['2019-20', 'Real Madrid', 'Barcelona', 'Atlético Madrid'],
  ['2020-21', 'Atlético Madrid', 'Real Madrid', 'Barcelona'],
  ['2021-22', 'Real Madrid', 'Barcelona', 'Atlético Madrid'],
  ['2022-23', 'Barcelona', 'Real Madrid', 'Atlético Madrid'],
  ['2023-24', 'Real Madrid', 'Barcelona', 'Girona'],
  ['2024-25', 'Barcelona', 'Real Madrid', 'Atlético Madrid'],
  ['2025-26', 'Barcelona', 'Real Madrid', 'Villarreal']
] as const;

function normalizeSeasonLabel(value: string) {
  return value.replace(/[–—]/g, '-').trim();
}

function resolveSeasonYear(value: string) {
  const normalized = normalizeSeasonLabel(value);
  const match = normalized.match(/^(\d{4})-(\d{2}|\d{4})$/);

  if (match) {
    const startYear = Number(match[1]);
    const endYearPart = match[2];
    const endYear =
      endYearPart.length === 2
        ? Math.floor(startYear / 100) * 100 + Number(endYearPart)
        : Number(endYearPart);

    return endYear < startYear ? endYear + 100 : endYear;
  }

  return Number(normalized);
}

function normalizeClubName(name: string) {
  return CLUB_NAME_MAP[name] ?? name;
}

export const SPAIN_LA_LIGA_PATCHES: SeedCompetitionPatch[] = RAW_LA_LIGA_RESULTS.map(
  ([season, champion, runnerUp, thirdPlace]) => {
    const normalizedSeason = normalizeSeasonLabel(season);

    return {
      competitionCode: 'SPAIN_LA_LIGA',
      name: normalizedSeason,
      year: resolveSeasonYear(normalizedSeason),
      season: normalizedSeason,
      standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      standings: [
        {
          placement: CompetitionStandingPlacement.CHAMPION,
          standingOrder: 1,
          clubName: normalizeClubName(champion)
        },
        {
          placement: CompetitionStandingPlacement.RUNNER_UP,
          standingOrder: 2,
          clubName: normalizeClubName(runnerUp)
        },
        {
          placement: CompetitionStandingPlacement.THIRD_PLACE,
          standingOrder: 3,
          clubName: normalizeClubName(thirdPlace)
        }
      ]
    };
  }
);

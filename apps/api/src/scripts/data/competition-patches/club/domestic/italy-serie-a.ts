import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ITALY_SERIE_A';
const CHAMPIONS_SOURCE_URL = 'https://www.rsssf.org/tablesi/italchamp.html';
const FINAL_PLACINGS_SOURCE_URL = 'https://www.rsssf.org/tablesi/italplall.html';
const EARLY_FINAL_PLACINGS_SOURCE_URL =
  'https://www.magliarossonera.it/statistiche/competitions/competitionsSerieA.php';

export const ITALY_SERIE_A_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '意大利足球甲级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Italy - List of Champions - RSSSF',
      url: CHAMPIONS_SOURCE_URL,
      remark: '用于核对 1898-1929 前身冠军与未授予冠军赛季。'
    },
    {
      label: 'Italy - Serie A All-Time Final Placings - RSSSF',
      url: FINAL_PLACINGS_SOURCE_URL,
      remark: '用于核对 1929-30 以来意甲最终前三名。'
    },
    {
      label: 'Statistiche Serie A ante girone unico - Maglia Rossonera',
      url: EARLY_FINAL_PLACINGS_SOURCE_URL,
      remark: '用于交叉核对 1898-1928/29 早期意大利顶级联赛可确认的冠亚季。'
    },
    {
      label: 'List of Italian football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Italian_football_champions',
      remark: '用于交叉核对意大利顶级联赛冠军口径和 Calciopoli 调整。'
    }
  ],
  lastVerifiedAt: '2026-08-05',
  notes: [
    '本补录按当前项目口径纳入 1898-1928/29 意大利顶级联赛前身。',
    '本补录只写入当前数据库已存在的意大利俱乐部 standings，库外球队对应名次直接过滤，不创建新俱乐部。',
    '1898-1928/29 前身已补可确认的冠亚季；无法确认或没有明确全国季军口径的名次留空。',
    '1926-27 冠军被撤销未授予，仅记录可确认的亚军和季军。',
    '1921-22 CCI / FIGC 两个官方冠军按 championShare=2 分摊冠军分。',
    '1903、1904 部分 AC 米兰资料列 Milan 为第三名，但 RSSSF 逐场赛程、FIGC 赛制说明和 Wikipedia 冠军表均未明确官方全国季军，项目口径留空。',
    '1929-30 之后按 RSSSF 最终名次累计表派生冠军、亚军、季军；2004-05 因 Calciopoli 冠军未授予，仅录入调整后的亚军和季军。'
  ]
};

export const ITALY_SERIE_A_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1135',
    name: '国际米兰',
    englishName: 'Inter Milan',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1099',
    name: 'AC米兰',
    englishName: 'AC Milan',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1139',
    name: '尤文图斯',
    englishName: 'Juventus',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1150',
    name: '那不勒斯',
    englishName: 'Napoli',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1100',
    name: '罗马',
    englishName: 'Roma',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1129',
    name: '佛罗伦萨',
    englishName: 'Fiorentina',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1140',
    name: '拉齐奥',
    englishName: 'Lazio',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1156',
    name: '帕尔马',
    englishName: 'Parma',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1167',
    name: '桑普多利亚',
    englishName: 'Sampdoria',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1174',
    name: '都灵',
    englishName: 'Torino',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1106',
    name: '亚特兰大',
    englishName: 'Atalanta',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2201',
    name: '维罗纳',
    englishName: 'Hellas Verona',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2206',
    name: '利沃诺',
    englishName: 'Livorno',
    alias: '里窝那',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1147',
    name: '摩德纳',
    englishName: 'Modena',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1178',
    name: '乌迪内斯',
    englishName: 'Udinese',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1166',
    name: '维琴察',
    englishName: 'L.R. Vicenza',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1157',
    name: '佩鲁贾',
    englishName: 'Perugia',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1132',
    name: '热那亚',
    englishName: 'Genoa',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1111',
    name: '博洛尼亚',
    englishName: 'Bologna',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2218',
    name: '普罗韦尔切利',
    englishName: 'Pro Vercelli',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1154',
    name: '帕多瓦',
    englishName: 'Padova',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1179',
    name: '威尼斯',
    englishName: 'Venezia',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1114',
    name: '卡利亚里',
    englishName: 'Cagliari',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const INCLUDED_SERIE_A_CLUB_NAMES = new Set(ITALY_SERIE_A_REQUIRED_CLUBS.map((club) => club.name));

const CLUB_NAME_MAP: Record<string, string> = {
  'AC Padova/Padova Calcio': '帕多瓦',
  'AC Perugia': '佩鲁贾',
  'AC/ACF Florenz': '佛罗伦萨',
  'AC/FC Parma': '帕尔马',
  'AC/FC Turin/Torino Calcio': '都灵',
  'AC/Lanerossi Vicenza Calcio': '维琴察',
  'AC/SSC Neapel': '那不勒斯',
  'AFC/AC Venedig': '威尼斯',
  'AGC/FC Bologna': '博洛尼亚',
  Alessandria: '亚历山德里亚',
  'AS Rom': '罗马',
  'Ambrosiana/Inter Mailand': '国际米兰',
  'Atalanta Bergamo': '亚特兰大',
  Bologna: '博洛尼亚',
  'CC/C&FC/FC Genua 1893': '热那亚',
  'FC Internazionale': '国际米兰',
  'FC/AC Mailand': 'AC米兰',
  'Genoa 1893': '热那亚',
  'Hellas Verona': '维罗纳',
  'Juventus FC': '尤文图斯',
  'Juventus Turin': '尤文图斯',
  Lazio: '拉齐奥',
  'Lazio Rom': '拉齐奥',
  Livorno: '利沃诺',
  'Milan AC': 'AC米兰',
  'Modena Calcio/FBC/FC Modena': '摩德纳',
  Pisa: '比萨',
  'Pro Vercelli': '普罗韦尔切利',
  'Sampdoria Genua': '桑普多利亚',
  Torino: '都灵',
  'Udinese AC/Calcio': '乌迪内斯',
  'US Cagliari/Cagliari Calcio': '卡利亚里',
  'US/AS Livorno': '利沃诺',
  Venezia: '威尼斯',
  Vicenza: '维琴察'
};

const RAW_PRE_SERIE_A_STANDINGS = `
1898	Genoa 1893
1899	Genoa 1893
1900	Genoa 1893		Juventus FC
1901	Milan AC	Genoa 1893	Juventus FC
1902	Genoa 1893	Milan AC
1903	Genoa 1893	Juventus FC
1904	Genoa 1893	Juventus FC
1905	Juventus FC	Genoa 1893
1906	Milan AC	Juventus FC	Genoa 1893
1907	Milan AC	Torino
1908	Pro Vercelli
1909	Pro Vercelli		Genoa 1893
1909-10	FC Internazionale	Pro Vercelli	Juventus FC
1910-11	Pro Vercelli	Vicenza
1911-12	Pro Vercelli	Venezia
1912-13	Pro Vercelli	Lazio
1913-14	Casale	Lazio
1914-15	Genoa 1893	Torino
1919-20	FC Internazionale	Livorno
1920-21	Pro Vercelli	Pisa
1921-22 CCI	Pro Vercelli			1921-22	1921-22
1921-22 FIGC	Novese			1921-22	1921-22
1922-23	Genoa 1893	Lazio
1923-24	Genoa 1893
1924-25	Bologna
1925-26	Juventus FC
1926-27		Bologna	Juventus FC
1927-28	Torino	Genoa 1893	Alessandria
1928-29	Bologna	Torino
`;

const RAW_SERIE_A_TOP_THREE = `
1929-30	Ambrosiana/Inter Mailand	CC/C&FC/FC Genua 1893	Juventus Turin
1930-31	Juventus Turin	AS Rom	AGC/FC Bologna
1931-32	Juventus Turin	AGC/FC Bologna	AS Rom
1932-33	Juventus Turin	Ambrosiana/Inter Mailand	AGC/FC Bologna
1933-34	Juventus Turin	Ambrosiana/Inter Mailand	AC/SSC Neapel
1934-35	Juventus Turin	Ambrosiana/Inter Mailand	AC/ACF Florenz
1935-36	AGC/FC Bologna	AS Rom	AC/FC Turin/Torino Calcio
1936-37	AGC/FC Bologna	Lazio Rom	AC/FC Turin/Torino Calcio
1937-38	Ambrosiana/Inter Mailand	Juventus Turin	FC/AC Mailand
1938-39	AGC/FC Bologna	AC/FC Turin/Torino Calcio	Ambrosiana/Inter Mailand
1939-40	Ambrosiana/Inter Mailand	AGC/FC Bologna	Juventus Turin
1940-41	AGC/FC Bologna	Ambrosiana/Inter Mailand	FC/AC Mailand
1941-42	AS Rom	AC/FC Turin/Torino Calcio	AFC/AC Venedig
1942-43	AC/FC Turin/Torino Calcio	US/AS Livorno	Juventus Turin
1945-46	AC/FC Turin/Torino Calcio	Juventus Turin	FC/AC Mailand
1946-47	AC/FC Turin/Torino Calcio	Juventus Turin	Modena Calcio/FBC/FC Modena
1947-48	AC/FC Turin/Torino Calcio	FC/AC Mailand	Juventus Turin
1948-49	AC/FC Turin/Torino Calcio	Ambrosiana/Inter Mailand	FC/AC Mailand
1949-50	Juventus Turin	FC/AC Mailand	Ambrosiana/Inter Mailand
1950-51	FC/AC Mailand	Ambrosiana/Inter Mailand	Juventus Turin
1951-52	Juventus Turin	FC/AC Mailand	Ambrosiana/Inter Mailand
1952-53	Ambrosiana/Inter Mailand	Juventus Turin	FC/AC Mailand
1953-54	Ambrosiana/Inter Mailand	Juventus Turin	FC/AC Mailand
1954-55	FC/AC Mailand	Udinese AC/Calcio	AS Rom
1955-56	AC/ACF Florenz	FC/AC Mailand	Ambrosiana/Inter Mailand
1956-57	FC/AC Mailand	AC/ACF Florenz	Lazio Rom
1957-58	Juventus Turin	AC/ACF Florenz	AC Padova/Padova Calcio
1958-59	FC/AC Mailand	AC/ACF Florenz	Ambrosiana/Inter Mailand
1959-60	Juventus Turin	AC/ACF Florenz	FC/AC Mailand
1960-61	Juventus Turin	FC/AC Mailand	Ambrosiana/Inter Mailand
1961-62	FC/AC Mailand	Ambrosiana/Inter Mailand	AC/ACF Florenz
1962-63	Ambrosiana/Inter Mailand	Juventus Turin	FC/AC Mailand
1963-64	AGC/FC Bologna	Ambrosiana/Inter Mailand	FC/AC Mailand
1964-65	Ambrosiana/Inter Mailand	FC/AC Mailand	AC/FC Turin/Torino Calcio
1965-66	Ambrosiana/Inter Mailand	AGC/FC Bologna	AC/SSC Neapel
1966-67	Juventus Turin	Ambrosiana/Inter Mailand	AGC/FC Bologna
1967-68	FC/AC Mailand	AC/SSC Neapel	Juventus Turin
1968-69	AC/ACF Florenz	US Cagliari/Cagliari Calcio	FC/AC Mailand
1969-70	US Cagliari/Cagliari Calcio	Ambrosiana/Inter Mailand	Juventus Turin
1970-71	Ambrosiana/Inter Mailand	FC/AC Mailand	AC/SSC Neapel
1971-72	Juventus Turin	FC/AC Mailand	AC/FC Turin/Torino Calcio
1972-73	Juventus Turin	FC/AC Mailand	Lazio Rom
1973-74	Lazio Rom	Juventus Turin	AC/SSC Neapel
1974-75	Juventus Turin	AC/SSC Neapel	AS Rom
1975-76	AC/FC Turin/Torino Calcio	Juventus Turin	FC/AC Mailand
1976-77	Juventus Turin	AC/FC Turin/Torino Calcio	AC/ACF Florenz
1977-78	Juventus Turin	AC/Lanerossi Vicenza Calcio	AC/FC Turin/Torino Calcio
1978-79	FC/AC Mailand	AC Perugia	Juventus Turin
1979-80	Ambrosiana/Inter Mailand	Juventus Turin	FC/AC Mailand
1980-81	Juventus Turin	AS Rom	AC/SSC Neapel
1981-82	Juventus Turin	AC/ACF Florenz	AS Rom
1982-83	AS Rom	Juventus Turin	Ambrosiana/Inter Mailand
1983-84	Juventus Turin	AS Rom	AC/ACF Florenz
1984-85	Hellas Verona	AC/FC Turin/Torino Calcio	Ambrosiana/Inter Mailand
1985-86	Juventus Turin	AS Rom	AC/SSC Neapel
1986-87	AC/SSC Neapel	Juventus Turin	Ambrosiana/Inter Mailand
1987-88	FC/AC Mailand	AC/SSC Neapel	AS Rom
1988-89	Ambrosiana/Inter Mailand	AC/SSC Neapel	FC/AC Mailand
1989-90	AC/SSC Neapel	FC/AC Mailand	Ambrosiana/Inter Mailand
1990-91	Sampdoria Genua	FC/AC Mailand	Ambrosiana/Inter Mailand
1991-92	FC/AC Mailand	Juventus Turin	AC/FC Turin/Torino Calcio
1992-93	FC/AC Mailand	Ambrosiana/Inter Mailand	AC/FC Parma
1993-94	FC/AC Mailand	Juventus Turin	Sampdoria Genua
1994-95	Juventus Turin	Lazio Rom	AC/FC Parma
1995-96	FC/AC Mailand	Juventus Turin	Lazio Rom
1996-97	Juventus Turin	AC/FC Parma	Ambrosiana/Inter Mailand
1997-98	Juventus Turin	Ambrosiana/Inter Mailand	Udinese AC/Calcio
1998-99	FC/AC Mailand	Lazio Rom	AC/ACF Florenz
1999-00	Lazio Rom	Juventus Turin	FC/AC Mailand
2000-01	AS Rom	Juventus Turin	Lazio Rom
2001-02	Juventus Turin	AS Rom	Ambrosiana/Inter Mailand
2002-03	Juventus Turin	Ambrosiana/Inter Mailand	FC/AC Mailand
2003-04	FC/AC Mailand	AS Rom	Juventus Turin
2004-05		FC/AC Mailand	Ambrosiana/Inter Mailand
2005-06	Ambrosiana/Inter Mailand	AS Rom	FC/AC Mailand
2006-07	Ambrosiana/Inter Mailand	AS Rom	Lazio Rom
2007-08	Ambrosiana/Inter Mailand	AS Rom	Juventus Turin
2008-09	Ambrosiana/Inter Mailand	Juventus Turin	FC/AC Mailand
2009-10	Ambrosiana/Inter Mailand	AS Rom	FC/AC Mailand
2010-11	FC/AC Mailand	Ambrosiana/Inter Mailand	AC/SSC Neapel
2011-12	Juventus Turin	FC/AC Mailand	Udinese AC/Calcio
2012-13	Juventus Turin	AC/SSC Neapel	FC/AC Mailand
2013-14	Juventus Turin	AS Rom	AC/SSC Neapel
2014-15	Juventus Turin	AS Rom	Lazio Rom
2015-16	Juventus Turin	AC/SSC Neapel	AS Rom
2016-17	Juventus Turin	AS Rom	AC/SSC Neapel
2017-18	Juventus Turin	AC/SSC Neapel	AS Rom
2018-19	Juventus Turin	AC/SSC Neapel	Atalanta Bergamo
2019-20	Juventus Turin	Ambrosiana/Inter Mailand	Atalanta Bergamo
2020-21	Ambrosiana/Inter Mailand	FC/AC Mailand	Atalanta Bergamo
2021-22	FC/AC Mailand	Ambrosiana/Inter Mailand	AC/SSC Neapel
2022-23	AC/SSC Neapel	Lazio Rom	Ambrosiana/Inter Mailand
2023-24	Ambrosiana/Inter Mailand	FC/AC Mailand	Juventus Turin
2024-25	AC/SSC Neapel	Ambrosiana/Inter Mailand	Atalanta Bergamo
2025-26	Ambrosiana/Inter Mailand	AC/SSC Neapel	AS Rom
`;

function normalizeClubName(rawName: string) {
  const name = rawName.trim();
  if (!name) return null;

  const clubName = CLUB_NAME_MAP[name] ?? name;
  return INCLUDED_SERIE_A_CLUB_NAMES.has(clubName) ? clubName : null;
}

function resolveSeasonYear(season: string) {
  const match = season.match(/^(\d{4})(?:-(\d{2}|\d{4}))?/);
  if (!match) return Number(season);

  const startYear = Number(match[1]);
  const endYearPart = match[2];
  if (!endYearPart) return startYear;

  const endYear =
    endYearPart.length === 2
      ? Math.floor(startYear / 100) * 100 + Number(endYearPart)
      : Number(endYearPart);

  return endYear < startYear ? endYear + 100 : endYear;
}

function buildStanding(
  placement: CompetitionStandingPlacement,
  standingOrder: number,
  rawClubName: string | undefined,
  remark: string
): SeedCompetitionPatch['standings'][number] | null {
  if (!rawClubName?.trim()) return null;

  const clubName = normalizeClubName(rawClubName);
  if (!clubName) return null;

  return {
    placement,
    standingOrder,
    clubName,
    remark
  };
}

const PRE_SERIE_A_PATCHES: SeedCompetitionPatch[] = RAW_PRE_SERIE_A_STANDINGS.trim()
  .split('\n')
  .map((line) => {
    const [name, champion, runnerUp, thirdPlace, rawSeason, championGroupKey] = line.split('\t');
    const season = rawSeason?.trim() || name.trim();
    const share = champion?.trim() && championGroupKey?.trim() ? 2 : null;
    const remarkParts = ['1898-1928/29 意大利顶级联赛前身，系统按意大利国内一级联赛计分。'];

    if (!champion?.trim()) {
      remarkParts.push('本届冠军被撤销未授予，仅记录可确认名次。');
    }

    if (share) {
      remarkParts.push(`同届官方冠军 ${share} 个，本冠军按 1/${share} 分摊冠军分。`);
    }

    const remark = remarkParts.join('');

    return {
      competitionCode: COMPETITION_CODE,
      name: name.trim(),
      year: resolveSeasonYear(season),
      season,
      externalUrl: EARLY_FINAL_PLACINGS_SOURCE_URL,
      championGroupKey: championGroupKey?.trim() || null,
      championShare: share,
      standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      remark,
      standings: [
        buildStanding(CompetitionStandingPlacement.CHAMPION, 1, champion, remark),
        buildStanding(CompetitionStandingPlacement.RUNNER_UP, 2, runnerUp, remark),
        buildStanding(CompetitionStandingPlacement.THIRD_PLACE, 3, thirdPlace, remark)
      ].filter((standing): standing is SeedCompetitionPatch['standings'][number] =>
        Boolean(standing)
      )
    };
  });

const SERIE_A_TOP_THREE_PATCHES: SeedCompetitionPatch[] = RAW_SERIE_A_TOP_THREE.trim()
  .split('\n')
  .map((line) => {
    const [season, champion, runnerUp, thirdPlace] = line.split('\t');
    const baseRemark = '意甲最终前三名，系统按意大利国内一级联赛计分。';
    const remark =
      season === '2004-05'
        ? '2004-05 因 Calciopoli 冠军未授予，仅录入官方调整后的亚军和季军。'
        : baseRemark;

    return {
      competitionCode: COMPETITION_CODE,
      name: season,
      year: resolveSeasonYear(season),
      season,
      externalUrl: FINAL_PLACINGS_SOURCE_URL,
      standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      remark,
      standings: [
        buildStanding(CompetitionStandingPlacement.CHAMPION, 1, champion, remark),
        buildStanding(CompetitionStandingPlacement.RUNNER_UP, 2, runnerUp, remark),
        buildStanding(CompetitionStandingPlacement.THIRD_PLACE, 3, thirdPlace, remark)
      ].filter((standing): standing is SeedCompetitionPatch['standings'][number] =>
        Boolean(standing)
      )
    };
  });

export const ITALY_SERIE_A_PATCHES: SeedCompetitionPatch[] = [
  ...PRE_SERIE_A_PATCHES,
  ...SERIE_A_TOP_THREE_PATCHES
];

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ITALY_COPPA_ITALIA';
const SOURCE_URL = 'https://www.rsssf.org/tablesi/italcuphist.html';

export const ITALY_COPPA_ITALIA_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '意大利杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Italy - List of Cup Finals - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对意大利杯历届冠军、亚军和 1967-68 至 1970-71 决赛组口径。'
    },
    {
      label: 'Coppa Italia - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Coppa_Italia',
      remark: '用于交叉核对赛事基础资料和最近届次。'
    }
  ],
  lastVerifiedAt: '2026-08-04',
  notes: [
    '本补录按意大利杯历届冠军和亚军口径录入，缺失 finalist 俱乐部以隐藏俱乐部补齐。',
    '1926-27 赛事未完成，不创建荣誉届次。',
    '1967-68 至 1970-71 为四队决赛组赛制，本补录按最终冠军和第二名录入，并在届次备注中标明。'
  ]
};

export const ITALY_COPPA_ITALIA_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1139',
    name: '尤文图斯',
    englishName: 'Juventus',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1135',
    name: '国际米兰',
    englishName: 'Inter Milan',
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
    uid: '1099',
    name: 'AC米兰',
    englishName: 'AC Milan',
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
    uid: '1150',
    name: '那不勒斯',
    englishName: 'Napoli',
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
    uid: '1106',
    name: '亚特兰大',
    englishName: 'Atalanta',
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
    uid: '1111',
    name: '博洛尼亚',
    englishName: 'Bologna',
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
    uid: '1114',
    name: '卡利亚里',
    englishName: 'Cagliari',
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
    uid: '1179',
    name: '威尼斯',
    englishName: 'Venezia',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1102',
    name: '亚历山德里亚',
    englishName: 'Alessandria',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1131',
    name: '福贾',
    englishName: 'Foggia',
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
    uid: '-',
    name: '巴勒莫',
    englishName: 'Palermo',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '-',
    name: '安科纳',
    englishName: 'Ancona',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '-',
    name: '卡坦扎罗',
    englishName: 'Catanzaro',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '-',
    name: '诺瓦拉',
    englishName: 'Novara',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '-',
    name: '斯帕尔',
    englishName: 'SPAL',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '-',
    name: '瓦多',
    englishName: 'Vado',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '-',
    name: '瓦雷泽',
    englishName: 'Varese',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const CLUB_NAME_MAP: Record<string, string> = {
  Alessandria: '亚历山德里亚',
  Ancona: '安科纳',
  Atalanta: '亚特兰大',
  Bologna: '博洛尼亚',
  Cagliari: '卡利亚里',
  Catanzaro: '卡坦扎罗',
  Fiorentina: '佛罗伦萨',
  Foggia: '福贾',
  Genoa: '热那亚',
  Inter: '国际米兰',
  Juventus: '尤文图斯',
  Lazio: '拉齐奥',
  Milan: 'AC米兰',
  Napoli: '那不勒斯',
  Novara: '诺瓦拉',
  Padova: '帕多瓦',
  Palermo: '巴勒莫',
  Parma: '帕尔马',
  Roma: '罗马',
  Sampdoria: '桑普多利亚',
  Spal: '斯帕尔',
  Torino: '都灵',
  Udinese: '乌迪内斯',
  Vado: '瓦多',
  Varese: '瓦雷泽',
  Venezia: '威尼斯',
  Verona: '维罗纳',
  Vicenza: '维琴察'
};

const RAW_COPPA_ITALIA_RESULTS = `
1922	Vado	Udinese
1935-36	Torino	Alessandria
1936-37	Genoa	Roma
1937-38	Juventus	Torino
1938-39	Inter	Novara
1939-40	Fiorentina	Genoa
1940-41	Venezia	Roma
1941-42	Juventus	Milan
1942-43	Torino	Venezia
1958	Lazio	Fiorentina
1958-59	Juventus	Inter
1959-60	Juventus	Fiorentina
1960-61	Fiorentina	Lazio
1961-62	Napoli	Spal
1962-63	Atalanta	Torino
1963-64	Roma	Torino
1964-65	Juventus	Inter
1965-66	Fiorentina	Catanzaro
1966-67	Milan	Padova
1967-68	Torino	Milan	决赛组：Torino 9 分、Milan 7 分、Inter 4 分、Bologna 4 分。
1968-69	Roma	Cagliari	决赛组：Roma 9 分、Cagliari 6 分、Foggia 5 分、Torino 4 分。
1969-70	Bologna	Torino	决赛组：Bologna 9 分、Torino 8 分、Cagliari 5 分、Varese 2 分。
1970-71	Torino	Milan	决赛组：Torino 和 Milan 同积 7 分，Torino 通过加赛点球夺冠。
1971-72	Milan	Napoli
1972-73	Milan	Juventus
1973-74	Bologna	Palermo
1974-75	Fiorentina	Milan
1975-76	Napoli	Verona
1976-77	Milan	Inter
1977-78	Inter	Napoli
1978-79	Juventus	Palermo
1979-80	Roma	Torino
1980-81	Roma	Torino
1981-82	Inter	Torino
1982-83	Juventus	Verona
1983-84	Roma	Verona
1984-85	Sampdoria	Milan
1985-86	Roma	Sampdoria
1986-87	Napoli	Atalanta
1987-88	Sampdoria	Torino
1988-89	Sampdoria	Napoli
1989-90	Juventus	Milan
1990-91	Roma	Sampdoria
1991-92	Parma	Juventus
1992-93	Torino	Roma
1993-94	Sampdoria	Ancona
1994-95	Juventus	Parma
1995-96	Fiorentina	Atalanta
1996-97	Vicenza	Napoli
1997-98	Lazio	Milan
1998-99	Parma	Fiorentina
1999-00	Lazio	Inter
2000-01	Fiorentina	Parma
2001-02	Parma	Juventus
2002-03	Milan	Roma
2003-04	Lazio	Juventus
2004-05	Inter	Roma
2005-06	Inter	Roma
2006-07	Roma	Inter
2007-08	Roma	Inter
2008-09	Lazio	Sampdoria
2009-10	Inter	Roma
2010-11	Inter	Palermo
2011-12	Napoli	Juventus
2012-13	Lazio	Roma
2013-14	Napoli	Fiorentina
2014-15	Juventus	Lazio
2015-16	Juventus	Milan
2016-17	Juventus	Lazio
2017-18	Juventus	Milan
2018-19	Lazio	Atalanta
2019-20	Napoli	Juventus
2020-21	Juventus	Atalanta
2021-22	Inter	Juventus
2022-23	Inter	Fiorentina
2023-24	Juventus	Atalanta
2024-25	Bologna	Milan
2025-26	Inter	Lazio
`;

function resolveSeasonYear(season: string) {
  const match = season.match(/^(\d{4})(?:-(\d{2}|\d{4}))?$/);
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

function normalizeClubName(rawName: string) {
  const name = rawName.trim();
  return CLUB_NAME_MAP[name] ?? name;
}

export const ITALY_COPPA_ITALIA_PATCHES: SeedCompetitionPatch[] = RAW_COPPA_ITALIA_RESULTS.trim()
  .split('\n')
  .map((line) => {
    const [season, champion, runnerUp, remark] = line.split('\t');
    const normalizedSeason = season.trim();

    return {
      competitionCode: COMPETITION_CODE,
      name: normalizedSeason,
      year: resolveSeasonYear(normalizedSeason),
      season: normalizedSeason,
      externalUrl: SOURCE_URL,
      standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
      remark: remark?.trim() || null,
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
        }
      ]
    };
  });

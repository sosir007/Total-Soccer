import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ITALY_SERIE_B';

type RawStandingRow = {
  season: string;
  champions: string[];
  runnerUp?: string | null;
  thirdPlace?: string | null;
  remark?: string | null;
};

function buildWikipediaSeasonUrl(title: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, '_')}`;
}

function formatWikiSeasonLabel(season: string) {
  return season.replace(/-/g, '–');
}

function getSerieBWikiCompetitionName(row: RawStandingRow) {
  if (row.remark?.includes('Seconda Divisione')) {
    return 'Seconda Divisione';
  }

  if (row.remark?.includes('Prima Divisione')) {
    return 'Prima Divisione';
  }

  return 'Serie B';
}

export const ITALY_SERIE_B_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '意大利足球乙级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of Serie B champions and promotions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Serie_B_champions_and_promotions',
      remark: '用于核对意大利第二级别联赛及前身赛事历届冠军、亚军、季军和其他升级球队。'
    },
    {
      label: 'Serie B - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Serie_B',
      remark: '用于交叉核对 Serie B 基础资料、当前状态和 2025-26 最新届次。'
    }
  ],
  lastVerifiedAt: '2026-08-05',
  notes: [
    '本补录只写入当前数据库已存在的意大利俱乐部 standings，库外球队对应名次直接过滤，不创建新俱乐部。',
    '1922-1928 前身赛事纳入同一赛事口径；只录入明确的冠军、亚军、季军，其他升级球队不计入 standings。',
    '1937-38 Modena 与 Novara 均获冠军，按 championShare=2 分摊冠军分。',
    '意乙命中 CLUB_DOMESTIC_LEVEL_2_LEAGUE，结合意大利 1.0 系数后实际为冠军 2、亚军 0.8、季军 0.5。'
  ]
};

const EXISTING_SERIE_B_CLUB_NAMES = new Set([
  'AC米兰',
  '乌迪内斯',
  '亚历山德里亚',
  '亚特兰大',
  '佛罗伦萨',
  '佩鲁贾',
  '克雷莫纳',
  '利沃诺',
  '博洛尼亚',
  '卡利亚里',
  '卡坦扎罗',
  '国际米兰',
  '威尼斯',
  '安科纳',
  '尤文图斯',
  '巴勒莫',
  '巴里',
  '帕多瓦',
  '帕尔马',
  '拉齐奥',
  '摩德纳',
  '斯帕尔',
  '普罗韦尔切利',
  '桑普多利亚',
  '比萨',
  '热那亚',
  '瓦雷泽',
  '福贾',
  '科莫',
  '维琴察',
  '维罗纳',
  '罗马',
  '诺瓦拉',
  '那不勒斯',
  '都灵'
]);

const CLUB_NAME_MAP: Record<string, string> = {
  Alessandria: '亚历山德里亚',
  Ancona: '安科纳',
  Atalanta: '亚特兰大',
  Bari: '巴里',
  Bologna: '博洛尼亚',
  Cagliari: '卡利亚里',
  Catanzaro: '卡坦扎罗',
  Como: '科莫',
  Cremonese: '克雷莫纳',
  Fiorentina: '佛罗伦萨',
  Foggia: '福贾',
  Genoa: '热那亚',
  'Genova 1893': '热那亚',
  'Hellas Verona': '维罗纳',
  Juventus: '尤文图斯',
  Lazio: '拉齐奥',
  'Lanerossi Vicenza': '维琴察',
  Livorno: '利沃诺',
  Milan: 'AC米兰',
  Modena: '摩德纳',
  Napoli: '那不勒斯',
  Novara: '诺瓦拉',
  Padova: '帕多瓦',
  Palermo: '巴勒莫',
  Parma: '帕尔马',
  Perugia: '佩鲁贾',
  Pisa: '比萨',
  'Pro Vercelli': '普罗韦尔切利',
  Roma: '罗马',
  Sampdoria: '桑普多利亚',
  SPAL: '斯帕尔',
  Torino: '都灵',
  Udinese: '乌迪内斯',
  Varese: '瓦雷泽',
  Venezia: '威尼斯',
  Verona: '维罗纳',
  Vicenza: '维琴察'
};

const RAW_SERIE_B_ROWS: RawStandingRow[] = [
  {
    season: '1924-25',
    champions: ['Udinese'],
    remark: 'Seconda Divisione 前身赛事。'
  },
  {
    season: '1926-27',
    champions: ['Novara'],
    remark: 'Prima Divisione 前身赛事。'
  },
  {
    season: '1927-28',
    champions: ['Atalanta'],
    remark: 'Prima Divisione 前身赛事。'
  },
  { season: '1929-30', champions: ['Casale'], runnerUp: 'Legnano', thirdPlace: 'La Dominante' },
  { season: '1930-31', champions: ['Fiorentina'], runnerUp: 'Bari', thirdPlace: 'Palermo' },
  { season: '1931-32', champions: ['Palermo'], runnerUp: 'Padova', thirdPlace: 'Hellas Verona' },
  { season: '1932-33', champions: ['Livorno'], runnerUp: 'Brescia', thirdPlace: 'Modena' },
  { season: '1933-34', champions: ['Sampierdarenese'], runnerUp: 'Bari', thirdPlace: 'Modena' },
  { season: '1934-35', champions: ['Genova 1893'], runnerUp: 'Bari' },
  { season: '1935-36', champions: ['Lucchese'], runnerUp: 'Novara', thirdPlace: 'Livorno' },
  { season: '1936-37', champions: ['Livorno'], runnerUp: 'Atalanta', thirdPlace: 'Modena' },
  {
    season: '1937-38',
    champions: ['Modena', 'Novara'],
    thirdPlace: 'Alessandria',
    remark: 'Modena 与 Novara 均获冠军，本届冠军按 1/2 分摊。'
  },
  { season: '1938-39', champions: ['Fiorentina'], runnerUp: 'Venezia', thirdPlace: 'Atalanta' },
  { season: '1939-40', champions: ['Atalanta'], runnerUp: 'Livorno', thirdPlace: 'Lucchese' },
  { season: '1940-41', champions: ['Liguria'], runnerUp: 'Modena', thirdPlace: 'Brescia' },
  { season: '1941-42', champions: ['Bari'], runnerUp: 'Vicenza', thirdPlace: 'Pescara' },
  { season: '1942-43', champions: ['Modena'], runnerUp: 'Brescia', thirdPlace: 'Napoli' },
  {
    season: '1945-46',
    champions: ['Alessandria'],
    runnerUp: 'Pro Patria',
    thirdPlace: 'Vigevano',
    remark: '战后 Serie B-C Alta Italia / 南部 Serie A-B 特殊赛季。'
  },
  {
    season: '1946-47',
    champions: ['Pro Patria', 'Lucchese', 'Salernitana'],
    remark: '三组赛制，按北部/中部/南部冠军记录。'
  },
  { season: '1947-48', champions: ['Novara'], runnerUp: 'Padova', thirdPlace: 'Palermo' },
  { season: '1948-49', champions: ['Como'], runnerUp: 'Venezia', thirdPlace: 'Vicenza' },
  { season: '1949-50', champions: ['Napoli'], runnerUp: 'Udinese', thirdPlace: 'Legnano' },
  { season: '1950-51', champions: ['SPAL'], runnerUp: 'Legnano', thirdPlace: 'Modena' },
  { season: '1951-52', champions: ['Roma'], runnerUp: 'Brescia', thirdPlace: 'Messina' },
  { season: '1952-53', champions: ['Genoa'], runnerUp: 'Legnano', thirdPlace: 'Catania' },
  { season: '1953-54', champions: ['Catania'], runnerUp: 'Pro Patria', thirdPlace: 'Cagliari' },
  { season: '1954-55', champions: ['Lanerossi Vicenza'], runnerUp: 'Padova', thirdPlace: 'Modena' },
  { season: '1955-56', champions: ['Udinese'], runnerUp: 'Palermo', thirdPlace: 'Como' },
  {
    season: '1956-57',
    champions: ['Hellas Verona'],
    runnerUp: 'Alessandria',
    thirdPlace: 'Brescia'
  },
  { season: '1957-58', champions: ['Triestina'], runnerUp: 'Bari', thirdPlace: 'Venezia' },
  { season: '1958-59', champions: ['Atalanta'], runnerUp: 'Palermo', thirdPlace: 'Lecco' },
  { season: '1959-60', champions: ['Torino'], runnerUp: 'Lecco', thirdPlace: 'Catania' },
  { season: '1960-61', champions: ['Venezia'], runnerUp: 'Ozo Mantova', thirdPlace: 'Palermo' },
  { season: '1961-62', champions: ['Genoa'], runnerUp: 'Napoli', thirdPlace: 'Modena' },
  { season: '1962-63', champions: ['Messina'], runnerUp: 'Bari', thirdPlace: 'Lazio' },
  { season: '1963-64', champions: ['Varese'], runnerUp: 'Cagliari', thirdPlace: 'Foggia' },
  { season: '1964-65', champions: ['Brescia'], runnerUp: 'Napoli', thirdPlace: 'SPAL' },
  { season: '1965-66', champions: ['Venezia'], runnerUp: 'Lecco', thirdPlace: 'Mantova' },
  { season: '1966-67', champions: ['Sampdoria'], runnerUp: 'Varese', thirdPlace: 'Catanzaro' },
  { season: '1967-68', champions: ['Palermo'], runnerUp: 'Hellas Verona', thirdPlace: 'Pisa' },
  { season: '1968-69', champions: ['Lazio'], runnerUp: 'Brescia', thirdPlace: 'Bari' },
  { season: '1969-70', champions: ['Varese'], runnerUp: 'Foggia', thirdPlace: 'Catania' },
  { season: '1970-71', champions: ['Mantova'], runnerUp: 'Atalanta', thirdPlace: 'Catanzaro' },
  { season: '1971-72', champions: ['Ternana'], runnerUp: 'Lazio', thirdPlace: 'Palermo' },
  { season: '1972-73', champions: ['Genoa'], runnerUp: 'Cesena', thirdPlace: 'Foggia' },
  { season: '1973-74', champions: ['Varese'], runnerUp: 'Ascoli', thirdPlace: 'Ternana' },
  { season: '1974-75', champions: ['Perugia'], runnerUp: 'Como', thirdPlace: 'Hellas Verona' },
  { season: '1975-76', champions: ['Genoa'], runnerUp: 'Catanzaro', thirdPlace: 'Foggia' },
  {
    season: '1976-77',
    champions: ['Lanerossi Vicenza'],
    runnerUp: 'Atalanta',
    thirdPlace: 'Pescara'
  },
  { season: '1977-78', champions: ['Ascoli'], runnerUp: 'Catanzaro', thirdPlace: 'Avellino' },
  { season: '1978-79', champions: ['Udinese'], runnerUp: 'Cagliari', thirdPlace: 'Pescara' },
  { season: '1979-80', champions: ['Como'], runnerUp: 'Pistoiese', thirdPlace: 'Brescia' },
  { season: '1980-81', champions: ['Milan'], runnerUp: 'Genoa', thirdPlace: 'Cesena' },
  { season: '1981-82', champions: ['Hellas Verona'], runnerUp: 'Pisa', thirdPlace: 'Sampdoria' },
  { season: '1982-83', champions: ['Milan'], runnerUp: 'Lazio', thirdPlace: 'Catania' },
  { season: '1983-84', champions: ['Atalanta'], runnerUp: 'Como', thirdPlace: 'Cremonese' },
  { season: '1984-85', champions: ['Pisa'], runnerUp: 'Lecce', thirdPlace: 'Bari' },
  {
    season: '1985-86',
    champions: ['Ascoli'],
    runnerUp: 'Brescia',
    thirdPlace: 'Lanerossi Vicenza'
  },
  { season: '1986-87', champions: ['Pescara'], runnerUp: 'Pisa', thirdPlace: 'Cesena' },
  {
    season: '1987-88',
    champions: ['Bologna'],
    runnerUp: 'Lecce',
    thirdPlace: 'Lazio'
  },
  {
    season: '1988-89',
    champions: ['Genoa'],
    runnerUp: 'Bari',
    thirdPlace: 'Udinese'
  },
  {
    season: '1989-90',
    champions: ['Torino'],
    runnerUp: 'Pisa',
    thirdPlace: 'Cagliari'
  },
  {
    season: '1990-91',
    champions: ['Foggia'],
    runnerUp: 'Hellas Verona',
    thirdPlace: 'Cremonese'
  },
  {
    season: '1991-92',
    champions: ['Brescia'],
    runnerUp: 'Pescara',
    thirdPlace: 'Ancona'
  },
  {
    season: '1992-93',
    champions: ['Reggiana'],
    runnerUp: 'Cremonese',
    thirdPlace: 'Piacenza'
  },
  {
    season: '1993-94',
    champions: ['Fiorentina'],
    runnerUp: 'Bari',
    thirdPlace: 'Brescia'
  },
  {
    season: '1994-95',
    champions: ['Piacenza'],
    runnerUp: 'Udinese',
    thirdPlace: 'Vicenza'
  },
  {
    season: '1995-96',
    champions: ['Bologna'],
    runnerUp: 'Hellas Verona',
    thirdPlace: 'Perugia'
  },
  {
    season: '1996-97',
    champions: ['Brescia'],
    runnerUp: 'Empoli',
    thirdPlace: 'Lecce'
  },
  {
    season: '1997-98',
    champions: ['Salernitana'],
    runnerUp: 'Venezia',
    thirdPlace: 'Cagliari'
  },
  {
    season: '1998-99',
    champions: ['Hellas Verona'],
    runnerUp: 'Torino',
    thirdPlace: 'Reggina'
  },
  {
    season: '1999-2000',
    champions: ['Vicenza'],
    runnerUp: 'Atalanta',
    thirdPlace: 'Brescia'
  },
  {
    season: '2000-01',
    champions: ['Torino'],
    runnerUp: 'Piacenza',
    thirdPlace: 'Chievo'
  },
  {
    season: '2001-02',
    champions: ['Como'],
    runnerUp: 'Modena',
    thirdPlace: 'Reggina'
  },
  {
    season: '2002-03',
    champions: ['Siena'],
    runnerUp: 'Sampdoria',
    thirdPlace: 'Lecce'
  },
  {
    season: '2003-04',
    champions: ['Palermo'],
    runnerUp: 'Cagliari',
    thirdPlace: 'Livorno',
    remark: '因 Serie A 从 18 队扩至 20 队，本赛季共有六队升级。'
  },
  {
    season: '2004-05',
    champions: ['Empoli'],
    runnerUp: 'Torino',
    thirdPlace: 'Perugia'
  },
  { season: '2005-06', champions: ['Atalanta'], runnerUp: 'Catania', thirdPlace: 'Torino' },
  { season: '2006-07', champions: ['Juventus'], runnerUp: 'Napoli', thirdPlace: 'Genoa' },
  { season: '2007-08', champions: ['Chievo'], runnerUp: 'Bologna', thirdPlace: 'Lecce' },
  { season: '2008-09', champions: ['Bari'], runnerUp: 'Parma', thirdPlace: 'Livorno' },
  { season: '2009-10', champions: ['Lecce'], runnerUp: 'Cesena', thirdPlace: 'Brescia' },
  { season: '2010-11', champions: ['Atalanta'], runnerUp: 'Siena', thirdPlace: 'Novara' },
  {
    season: '2011-12',
    champions: ['Pescara'],
    runnerUp: 'Torino',
    thirdPlace: 'Sassuolo'
  },
  { season: '2012-13', champions: ['Sassuolo'], runnerUp: 'Hellas Verona', thirdPlace: 'Livorno' },
  {
    season: '2013-14',
    champions: ['Palermo'],
    runnerUp: 'Empoli',
    thirdPlace: 'Latina'
  },
  {
    season: '2014-15',
    champions: ['Carpi'],
    runnerUp: 'Frosinone',
    thirdPlace: 'Vicenza'
  },
  { season: '2015-16', champions: ['Cagliari'], runnerUp: 'Crotone', thirdPlace: 'Trapani' },
  {
    season: '2016-17',
    champions: ['SPAL'],
    runnerUp: 'Hellas Verona',
    thirdPlace: 'Frosinone'
  },
  { season: '2017-18', champions: ['Empoli'], runnerUp: 'Parma', thirdPlace: 'Frosinone' },
  {
    season: '2018-19',
    champions: ['Brescia'],
    runnerUp: 'Lecce',
    thirdPlace: 'Benevento'
  },
  { season: '2019-20', champions: ['Benevento'], runnerUp: 'Crotone', thirdPlace: 'Spezia' },
  {
    season: '2020-21',
    champions: ['Empoli'],
    runnerUp: 'Salernitana',
    thirdPlace: 'Monza'
  },
  {
    season: '2021-22',
    champions: ['Lecce'],
    runnerUp: 'Cremonese',
    thirdPlace: 'Pisa'
  },
  {
    season: '2022-23',
    champions: ['Frosinone'],
    runnerUp: 'Genoa',
    thirdPlace: 'Bari'
  },
  { season: '2023-24', champions: ['Parma'], runnerUp: 'Como', thirdPlace: 'Venezia' },
  {
    season: '2024-25',
    champions: ['Sassuolo'],
    runnerUp: 'Pisa',
    thirdPlace: 'Spezia'
  },
  { season: '2025-26', champions: ['Venezia'], runnerUp: 'Frosinone', thirdPlace: 'Monza' }
];

function normalizeSeasonLabel(value: string) {
  return value.replace(/[–—]/g, '-').trim();
}

function resolveSeasonYear(value: string) {
  const normalized = normalizeSeasonLabel(value);
  const match = normalized.match(/^(\d{4})(?:-(\d{2}|\d{4}))?$/);

  if (!match) {
    return Number(normalized);
  }

  const startYear = Number(match[1]);
  const endPart = match[2];

  if (!endPart) {
    return startYear;
  }

  const endYear =
    endPart.length === 2 ? Math.floor(startYear / 100) * 100 + Number(endPart) : Number(endPart);

  return endYear < startYear ? endYear + 100 : endYear;
}

function normalizeClubName(rawName: string) {
  const mappedName = CLUB_NAME_MAP[rawName.trim()] ?? rawName.trim();
  return EXISTING_SERIE_B_CLUB_NAMES.has(mappedName) ? mappedName : null;
}

function normalizeClubNames(rawNames: string[] | undefined) {
  if (!rawNames) return [];

  return rawNames
    .map(normalizeClubName)
    .filter((clubName): clubName is string => Boolean(clubName));
}

export const ITALY_SERIE_B_PATCHES: SeedCompetitionPatch[] = RAW_SERIE_B_ROWS.flatMap((row) => {
  const season = normalizeSeasonLabel(row.season);
  const champions = normalizeClubNames(row.champions);
  const standings: SeedCompetitionPatch['standings'] = [];

  champions.forEach((clubName, index) => {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      standingOrder: index + 1,
      clubName
    });
  });

  const runnerUp = row.runnerUp ? normalizeClubName(row.runnerUp) : null;
  if (runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      standingOrder: 1,
      clubName: runnerUp
    });
  }

  const thirdPlaceClubs = row.thirdPlace ? normalizeClubNames([row.thirdPlace]) : [];

  thirdPlaceClubs.forEach((clubName, index) => {
    standings.push({
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      standingOrder: index + 1,
      clubName
    });
  });

  return [
    {
      competitionCode: COMPETITION_CODE,
      name: season,
      year: resolveSeasonYear(season),
      season,
      externalUrl: buildWikipediaSeasonUrl(
        `${formatWikiSeasonLabel(season)} ${getSerieBWikiCompetitionName(row)}`
      ),
      standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      championShare: row.champions.length > 1 && champions.length > 0 ? row.champions.length : null,
      championGroupKey: row.champions.length > 1 && champions.length > 0 ? season : null,
      remark: row.remark ?? null,
      standings
    }
  ];
});

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type {
  SeedCountry,
  SeedEdition,
  SeedStanding
} from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRITISH_HOME_CHAMPIONSHIP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRITISH_HOME_CHAMPIONSHIP',
  name: '英国本土锦标赛',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'custom',
  sources: [
    {
      label: 'British Home Championship - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/British_Home_Championship',
      remark: '用于核对赛事沿革、参赛队范围和历届最终排名。'
    }
  ],
  lastVerifiedAt: '2026-09-24',
  notes: [
    '赛事由英格兰、苏格兰、威尔士和爱尔兰/北爱尔兰参加，1883-84 至 1983-84 年间举办，1980-81 届因北爱尔兰局势未完成。',
    '完整录入 88 个正式完赛届次；排除两次世界大战期间停办、1945-46 非正式 Victory Home Championship 和 1980-81 废弃赛事。',
    '并列名次按同一名次保存，保留共享冠军及共享亚军、季军的历史事实。',
    '赛事仅用于历史展示，includeInStats=false，不纳入国家荣誉统计和荣誉积分。'
  ]
};

export const REQUIRED_COUNTRIES: SeedCountry[] = [
  { uid: '765', name: '英格兰', confederationCode: 'UEFA' },
  { uid: '793', name: '苏格兰', confederationCode: 'UEFA' },
  { uid: '801', name: '威尔士', confederationCode: 'UEFA' },
  { uid: '789', name: '爱尔兰', confederationCode: 'UEFA' },
  { uid: '785', name: '北爱尔兰', confederationCode: 'UEFA' }
];

type BritishHomeChampionshipRow = readonly [
  season: string,
  champions: string,
  runnerUps: string,
  thirdPlaces: string,
  fourthPlaces: string
];

export type BritishHomeChampionshipResult = SeedEdition & {
  season: string;
  year: number;
  champions: string[];
  runnerUps: string[];
  thirdPlaces: string[];
  fourthPlaces: string[];
  mode: CompetitionEditionStandingMode;
};

function splitTeams(value: string) {
  return value ? value.split(',') : [];
}

const ROWS: BritishHomeChampionshipRow[] = [
  ['1883-84', '苏格兰', '英格兰', '威尔士', '爱尔兰'],
  ['1884-85', '苏格兰', '英格兰', '威尔士', '爱尔兰'],
  ['1885-86', '苏格兰,英格兰', '威尔士', '爱尔兰', ''],
  ['1886-87', '苏格兰', '英格兰', '爱尔兰', '威尔士'],
  ['1887-88', '英格兰', '苏格兰', '威尔士', '爱尔兰'],
  ['1888-89', '苏格兰', '英格兰', '威尔士', '爱尔兰'],
  ['1889-90', '英格兰,苏格兰', '威尔士', '爱尔兰', ''],
  ['1890-91', '英格兰', '苏格兰', '爱尔兰', '威尔士'],
  ['1891-92', '英格兰', '苏格兰', '爱尔兰,威尔士', ''],
  ['1892-93', '英格兰', '苏格兰', '爱尔兰', '威尔士'],
  ['1893-94', '苏格兰', '英格兰', '威尔士', '爱尔兰'],
  ['1894-95', '英格兰', '威尔士,苏格兰', '爱尔兰', ''],
  ['1895-96', '苏格兰', '英格兰', '威尔士', '爱尔兰'],
  ['1896-97', '苏格兰', '英格兰', '爱尔兰', '威尔士'],
  ['1897-98', '英格兰', '苏格兰', '爱尔兰', '威尔士'],
  ['1898-99', '英格兰', '苏格兰', '爱尔兰', '威尔士'],
  ['1899-1900', '苏格兰', '威尔士,英格兰', '爱尔兰', ''],
  ['1900-01', '英格兰', '苏格兰', '威尔士', '爱尔兰'],
  ['1901-02', '苏格兰', '英格兰', '爱尔兰', '威尔士'],
  ['1902-03', '英格兰,爱尔兰,苏格兰', '威尔士', '', ''],
  ['1903-04', '英格兰', '爱尔兰', '苏格兰,威尔士', ''],
  ['1904-05', '英格兰', '威尔士', '苏格兰,爱尔兰', ''],
  ['1905-06', '英格兰,苏格兰', '威尔士', '爱尔兰', ''],
  ['1906-07', '威尔士', '英格兰', '苏格兰', '爱尔兰'],
  ['1907-08', '英格兰,苏格兰', '爱尔兰', '威尔士', ''],
  ['1908-09', '英格兰', '威尔士', '苏格兰', '爱尔兰'],
  ['1909-10', '苏格兰', '英格兰,爱尔兰', '威尔士', ''],
  ['1910-11', '英格兰', '苏格兰', '威尔士', '爱尔兰'],
  ['1911-12', '英格兰,苏格兰', '爱尔兰', '威尔士', ''],
  ['1912-13', '英格兰', '苏格兰,威尔士', '爱尔兰', ''],
  ['1913-14', '爱尔兰', '苏格兰', '英格兰', '威尔士'],
  ['1919-20', '威尔士', '苏格兰,英格兰', '爱尔兰', ''],
  ['1920-21', '苏格兰', '威尔士,英格兰', '爱尔兰', ''],
  ['1921-22', '苏格兰', '威尔士,英格兰', '爱尔兰', ''],
  ['1922-23', '苏格兰', '英格兰', '爱尔兰', '威尔士'],
  ['1923-24', '威尔士', '苏格兰', '爱尔兰', '英格兰'],
  ['1924-25', '苏格兰', '英格兰', '威尔士,爱尔兰', ''],
  ['1925-26', '苏格兰', '爱尔兰', '威尔士', '英格兰'],
  ['1926-27', '苏格兰,英格兰', '威尔士,爱尔兰', '', ''],
  ['1927-28', '威尔士', '爱尔兰', '苏格兰', '英格兰'],
  ['1928-29', '苏格兰', '英格兰', '威尔士,爱尔兰', ''],
  ['1929-30', '英格兰', '苏格兰', '爱尔兰', '威尔士'],
  ['1930-31', '英格兰,苏格兰', '威尔士', '爱尔兰', ''],
  ['1931-32', '英格兰', '苏格兰', '爱尔兰', '威尔士'],
  ['1932-33', '威尔士', '苏格兰', '英格兰', '爱尔兰'],
  ['1933-34', '威尔士', '英格兰', '爱尔兰', '苏格兰'],
  ['1934-35', '英格兰,苏格兰', '威尔士,爱尔兰', '', ''],
  ['1935-36', '苏格兰', '威尔士,英格兰', '爱尔兰', ''],
  ['1936-37', '威尔士', '苏格兰', '英格兰', '爱尔兰'],
  ['1937-38', '英格兰', '苏格兰,爱尔兰', '威尔士', ''],
  ['1938-39', '英格兰,威尔士,苏格兰', '爱尔兰', '', ''],
  ['1946-47', '英格兰', '爱尔兰', '苏格兰,威尔士', ''],
  ['1947-48', '英格兰', '威尔士', '爱尔兰', '苏格兰'],
  ['1948-49', '苏格兰', '英格兰', '威尔士', '爱尔兰'],
  ['1949-50', '英格兰', '苏格兰', '威尔士,爱尔兰', ''],
  ['1950-51', '苏格兰', '英格兰', '威尔士', '爱尔兰'],
  ['1951-52', '威尔士,英格兰', '苏格兰', '爱尔兰', ''],
  ['1952-53', '苏格兰,英格兰', '威尔士,爱尔兰', '', ''],
  ['1953-54', '英格兰', '苏格兰', '爱尔兰', '威尔士'],
  ['1954-55', '英格兰', '苏格兰', '威尔士', '爱尔兰'],
  ['1955-56', '英格兰,苏格兰,威尔士,爱尔兰', '', '', ''],
  ['1956-57', '英格兰', '苏格兰', '威尔士,北爱尔兰', ''],
  ['1957-58', '英格兰,北爱尔兰', '苏格兰,威尔士', '', ''],
  ['1958-59', '北爱尔兰,英格兰', '苏格兰', '威尔士', ''],
  ['1959-60', '苏格兰,英格兰,威尔士', '北爱尔兰', '', ''],
  ['1960-61', '英格兰', '威尔士', '苏格兰', '北爱尔兰'],
  ['1961-62', '苏格兰', '威尔士', '英格兰', '北爱尔兰'],
  ['1962-63', '苏格兰', '英格兰', '威尔士', '北爱尔兰'],
  ['1963-64', '英格兰,苏格兰,北爱尔兰', '威尔士', '', ''],
  ['1964-65', '英格兰', '威尔士', '苏格兰', '北爱尔兰'],
  ['1965-66', '英格兰', '北爱尔兰', '苏格兰', '威尔士'],
  ['1966-67', '苏格兰', '英格兰', '威尔士', '北爱尔兰'],
  ['1967-68', '英格兰', '苏格兰', '威尔士,北爱尔兰', ''],
  ['1968-69', '英格兰', '苏格兰', '北爱尔兰', '威尔士'],
  ['1969-70', '英格兰,威尔士,苏格兰', '北爱尔兰', '', ''],
  ['1970-71', '英格兰', '北爱尔兰', '威尔士', '苏格兰'],
  ['1971-72', '苏格兰,英格兰', '北爱尔兰', '威尔士', ''],
  ['1972-73', '英格兰', '北爱尔兰', '苏格兰', '威尔士'],
  ['1973-74', '苏格兰,英格兰', '威尔士,北爱尔兰', '', ''],
  ['1974-75', '英格兰', '苏格兰', '北爱尔兰', '威尔士'],
  ['1975-76', '苏格兰', '英格兰', '威尔士', '北爱尔兰'],
  ['1976-77', '苏格兰', '威尔士', '英格兰', '北爱尔兰'],
  ['1977-78', '英格兰', '威尔士', '苏格兰', '北爱尔兰'],
  ['1978-79', '英格兰', '威尔士', '苏格兰', '北爱尔兰'],
  ['1979-80', '北爱尔兰', '英格兰', '威尔士', '苏格兰'],
  ['1981-82', '英格兰', '苏格兰', '威尔士', '北爱尔兰'],
  ['1982-83', '英格兰', '苏格兰', '北爱尔兰', '威尔士'],
  ['1983-84', '北爱尔兰', '威尔士', '英格兰', '苏格兰']
];

export const BRITISH_HOME_CHAMPIONSHIP_RESULTS: BritishHomeChampionshipResult[] = ROWS.map(
  ([season, champions, runnerUps, thirdPlaces, fourthPlaces]) => {
    const championNames = splitTeams(champions);
    return {
      year: Number(season.slice(0, 4)),
      season,
      host: '英国本土',
      quantity: 4,
      mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      champions: championNames,
      runnerUps: splitTeams(runnerUps),
      thirdPlaces: splitTeams(thirdPlaces),
      fourthPlaces: splitTeams(fourthPlaces),
      championGroupKey: championNames.length > 1 ? season : null,
      championShare: championNames.length > 1 ? championNames.length : null
    };
  }
);

export function buildBritishHomeChampionshipStandings(
  result: BritishHomeChampionshipResult
): SeedStanding[] {
  return [
    ...result.champions.map((countryName, standingOrder) => ({
      placement: CompetitionStandingPlacement.CHAMPION,
      countryName,
      standingOrder: result.champions.length > 1 ? standingOrder + 1 : undefined
    })),
    ...result.runnerUps.map((countryName, standingOrder) => ({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      countryName,
      standingOrder: result.runnerUps.length > 1 ? standingOrder + 1 : undefined
    })),
    ...result.thirdPlaces.map((countryName, standingOrder) => ({
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      countryName,
      standingOrder: result.thirdPlaces.length > 1 ? standingOrder + 1 : undefined
    })),
    ...result.fourthPlaces.map((countryName, standingOrder) => ({
      placement: CompetitionStandingPlacement.FOURTH_PLACE,
      countryName,
      standingOrder: result.fourthPlaces.length > 1 ? standingOrder + 1 : undefined
    }))
  ];
}

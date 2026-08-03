import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type InterCitiesFairsCupResult = FinalOnlyCompetitionResult & {
  season: string;
  score: string;
};

type RawInterCitiesFairsCupResult = Pick<
  InterCitiesFairsCupResult,
  'season' | 'year' | 'champion' | 'runnerUp' | 'score'
> & {
  year: number;
  note?: string;
};

export const INTER_CITIES_FAIRS_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'INTER_CITIES_FAIRS_CUP',
  name: '国际城市博览会杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Inter-Cities Fairs Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Inter-Cities_Fairs_Cup',
      remark: '用于核对国际城市博览会杯赛事沿革、历届冠军、亚军和比分。'
    }
  ],
  lastVerifiedAt: '2026-08-03',
  notes: [
    '本文件录入 1955-58 至 1970-71 国际城市博览会杯决赛冠亚军。',
    '该赛事是欧洲联盟杯创办前的重要欧洲俱乐部杯赛，但不是欧足联官方承认的欧联前身届次，单独建赛事。',
    '只落库当前数据库已有俱乐部的冠军和亚军；伦敦联队、伯明翰城、费伦茨瓦罗斯、乌伊佩斯特暂不创建俱乐部。',
    '1955-58 届 Wikipedia 记为 Barcelona XI，本次按巴塞罗那俱乐部代表队口径落到巴塞罗那。'
  ]
};

export const INTER_CITIES_FAIRS_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1708', name: '巴塞罗那', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1100', name: '罗马', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1775', name: '瓦伦西亚', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '432', name: '萨格勒布迪纳摩', countryName: '克罗地亚', confederationCode: 'UEFA' },
  { uid: '1749', name: '萨拉戈萨', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1139', name: '尤文图斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '671', name: '利兹联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '688', name: '纽卡斯尔联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '602', name: '阿森纳', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '256', name: '安德莱赫特', countryName: '比利时', confederationCode: 'UEFA' }
];

export const INTER_CITIES_FAIRS_CUP_MISSING_FINALISTS = [
  { name: '伦敦联队', englishName: 'London XI', note: '城市代表队，不是普通俱乐部。' },
  { name: '伯明翰城', englishName: 'Birmingham City' },
  { name: '费伦茨瓦罗斯', englishName: 'Ferencvaros' },
  { name: '乌伊佩斯特', englishName: 'Ujpest' }
];

const SEEDED_CLUB_NAMES = new Set(INTER_CITIES_FAIRS_CUP_REQUIRED_CLUBS.map((club) => club.name));

const RAW_INTER_CITIES_FAIRS_CUP_RESULTS: RawInterCitiesFairsCupResult[] = [
  {
    season: '1955-58',
    year: 1958,
    champion: '巴塞罗那',
    runnerUp: '伦敦联队',
    score: '8-2',
    note: 'Wikipedia 记为 Barcelona XI；本次按巴塞罗那代表队口径落到巴塞罗那。'
  },
  { season: '1958-60', year: 1960, champion: '巴塞罗那', runnerUp: '伯明翰城', score: '4-1' },
  { season: '1960-61', year: 1961, champion: '罗马', runnerUp: '伯明翰城', score: '4-2' },
  { season: '1961-62', year: 1962, champion: '瓦伦西亚', runnerUp: '巴塞罗那', score: '7-3' },
  {
    season: '1962-63',
    year: 1963,
    champion: '瓦伦西亚',
    runnerUp: '萨格勒布迪纳摩',
    score: '4-1'
  },
  { season: '1963-64', year: 1964, champion: '萨拉戈萨', runnerUp: '瓦伦西亚', score: '2-1' },
  {
    season: '1964-65',
    year: 1965,
    champion: '费伦茨瓦罗斯',
    runnerUp: '尤文图斯',
    score: '1-0'
  },
  { season: '1965-66', year: 1966, champion: '巴塞罗那', runnerUp: '萨拉戈萨', score: '4-3' },
  {
    season: '1966-67',
    year: 1967,
    champion: '萨格勒布迪纳摩',
    runnerUp: '利兹联',
    score: '2-0'
  },
  {
    season: '1967-68',
    year: 1968,
    champion: '利兹联',
    runnerUp: '费伦茨瓦罗斯',
    score: '1-0'
  },
  {
    season: '1968-69',
    year: 1969,
    champion: '纽卡斯尔联',
    runnerUp: '乌伊佩斯特',
    score: '6-2'
  },
  { season: '1969-70', year: 1970, champion: '阿森纳', runnerUp: '安德莱赫特', score: '4-3' },
  {
    season: '1970-71',
    year: 1971,
    champion: '利兹联',
    runnerUp: '尤文图斯',
    score: '3-3',
    note: '利兹联凭客场进球夺冠。'
  }
];

export const INTER_CITIES_FAIRS_CUP_RESULTS: InterCitiesFairsCupResult[] =
  RAW_INTER_CITIES_FAIRS_CUP_RESULTS.map((result) => ({
    ...result,
    name: `${result.season}赛季`,
    host: '欧洲城市博览会杯决赛',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: `${result.season} 届决赛${result.champion} ${result.score} ${result.runnerUp}${
      result.note ? `，${result.note}` : ''
    }。`
  }));

export function buildInterCitiesFairsCupStandings(
  result: InterCitiesFairsCupResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ].filter((standing) => standing.clubName && SEEDED_CLUB_NAMES.has(standing.clubName));
}

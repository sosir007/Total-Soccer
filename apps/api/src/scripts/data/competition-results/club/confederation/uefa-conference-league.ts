import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type UefaConferenceLeagueResult = FinalOnlyCompetitionResult & {
  season: string;
  name: string;
};

type RawUefaConferenceLeagueResult = Pick<
  UefaConferenceLeagueResult,
  'season' | 'year' | 'champion' | 'runnerUp' | 'host'
> & {
  year: number;
  score: string;
  note?: string;
};

export const UEFA_CONFERENCE_LEAGUE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_CONFERENCE_LEAGUE',
  name: '欧足联协会联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'UEFA Conference League',
      url: 'https://www.uefa.com/uefaconferenceleague/',
      remark: '用于核对赛事现行名称、官方性质和当前赛季。'
    },
    {
      label: 'UEFA Conference League - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/UEFA_Conference_League',
      remark: '用于核对赛事沿革、级别和更名口径。'
    },
    {
      label: 'List of UEFA Conference League finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_UEFA_Conference_League_finals',
      remark: '用于核对历届决赛冠军、亚军、比分和举办地。'
    }
  ],
  lastVerifiedAt: '2026-09-14',
  notes: [
    '本文件录入 2021-22 至 2025-26 欧足联协会联赛决赛冠亚军。',
    '2021-22 至 2023-24 使用 UEFA Europa Conference League 名称，2024-25 起更名为 UEFA Conference League；全部归入同一赛事。',
    '赛事为欧足联现行第三级俱乐部洲际杯赛，命中 CLUB_CONTINENTAL_LEVEL_3_CUP。',
    '使用赛季口径保存 edition.name 和 season，同时用决赛年份保存 year。',
    '只录最终冠军和亚军，不录四强、季军、殿军；2026-27 赛季进行中，不创建未完成届次。'
  ]
};

export const UEFA_CONFERENCE_LEAGUE_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1100', name: '罗马', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1013', name: '费耶诺德', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '735', name: '西汉姆联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1129', name: '佛罗伦萨', countryName: '意大利', confederationCode: 'UEFA' },
  {
    uid: '981',
    name: '奥林匹亚科斯',
    englishName: 'Olympiacos',
    countryName: '希腊',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '630', name: '切尔西', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1733', name: '皇家贝蒂斯', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '642', name: '水晶宫', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1729', name: '巴列卡诺', countryName: '西班牙', confederationCode: 'UEFA' }
];

const RAW_RESULTS: RawUefaConferenceLeagueResult[] = [
  {
    season: '2021-22',
    year: 2022,
    champion: '罗马',
    runnerUp: '费耶诺德',
    score: '1-0',
    host: '阿尔巴尼亚地拉那国家竞技场'
  },
  {
    season: '2022-23',
    year: 2023,
    champion: '西汉姆联',
    runnerUp: '佛罗伦萨',
    score: '2-1',
    host: '捷克布拉格福尔图纳竞技场'
  },
  {
    season: '2023-24',
    year: 2024,
    champion: '奥林匹亚科斯',
    runnerUp: '佛罗伦萨',
    score: '1-0',
    note: '加时',
    host: '希腊雅典圣索菲亚体育场'
  },
  {
    season: '2024-25',
    year: 2025,
    champion: '切尔西',
    runnerUp: '皇家贝蒂斯',
    score: '4-1',
    host: '波兰弗罗茨瓦夫市立体育场'
  },
  {
    season: '2025-26',
    year: 2026,
    champion: '水晶宫',
    runnerUp: '巴列卡诺',
    score: '1-0',
    host: '德国莱比锡红牛竞技场'
  }
];

export const UEFA_CONFERENCE_LEAGUE_RESULTS: UefaConferenceLeagueResult[] = RAW_RESULTS.map(
  (result) => ({
    ...result,
    name: `${result.season}赛季`,
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: `决赛${result.champion} ${result.score} ${result.runnerUp}${
      result.note ? `，${result.note}` : ''
    }。`
  })
);

export function buildUefaConferenceLeagueStandings(
  result: UefaConferenceLeagueResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}

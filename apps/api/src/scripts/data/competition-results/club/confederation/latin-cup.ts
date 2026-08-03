import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import type { TopFourCompetitionResult } from '../../../../helpers/competition-results.js';

type LatinCupResult = TopFourCompetitionResult & {
  score: string;
  thirdPlaceScore: string;
  note?: string;
};

export const LATIN_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'LATIN_CUP',
  name: '拉丁杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'custom',
  sources: [
    {
      label: 'Latin Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Latin_Cup',
      remark: '用于核对拉丁杯赛事沿革、届次和四强结果。'
    },
    {
      label: 'Latin Cup finals - RSSSF',
      url: 'https://www.rsssf.org/tablesl/latin.html',
      remark: '用于核对 1949-1957 各届四强、三四名赛和决赛比分。'
    }
  ],
  lastVerifiedAt: '2026-08-03',
  notes: [
    '本文件录入 1949 至 1957 年拉丁杯四强结果，1954 年未举办。',
    '赛事由法国、意大利、西班牙、葡萄牙四国联赛冠军参加；按俱乐部其他一级杯赛处理，不按洲际杯赛计分。',
    '只录当前数据库已有俱乐部的荣誉；Belenenses 未入库，1955 年第四名不创建俱乐部和荣誉。'
  ]
};

export const LATIN_CUP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1708',
    name: '巴塞罗那',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1489',
    name: '葡萄牙体育',
    countryName: '葡萄牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1174',
    name: '都灵',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2047',
    name: '兰斯',
    englishName: 'Stade de Reims',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '851',
    name: '波尔多',
    englishName: 'Bordeaux',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1687',
    name: '马德里竞技',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1140',
    name: '拉齐奥',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1099',
    name: 'AC米兰',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '858',
    name: '里尔',
    englishName: 'Lille OSC',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    name: '尼斯',
    englishName: 'OGC Nice',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1139',
    name: '尤文图斯',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1775',
    name: '瓦伦西亚',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1736',
    name: '皇家马德里',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1664',
    name: '毕尔巴鄂竞技',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1487',
    name: '本菲卡',
    countryName: '葡萄牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '828',
    name: '圣埃蒂安',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const SEEDED_CLUB_NAMES = new Set(LATIN_CUP_REQUIRED_CLUBS.map((club) => club.name));

const RAW_LATIN_CUP_RESULTS: LatinCupResult[] = [
  {
    year: 1949,
    champion: '巴塞罗那',
    runnerUp: '葡萄牙体育',
    thirdPlace: '都灵',
    fourthPlace: '兰斯',
    host: '马德里',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '2-1',
    thirdPlaceScore: '5-3',
    remark: '决赛巴塞罗那 2-1 葡萄牙体育，三四名赛都灵 5-3 兰斯。'
  },
  {
    year: 1950,
    champion: '本菲卡',
    runnerUp: '波尔多',
    thirdPlace: '马德里竞技',
    fourthPlace: '拉齐奥',
    host: '里斯本',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '2-1（重赛）',
    thirdPlaceScore: '2-1',
    note: '首回合决赛 3-3，重赛本菲卡 2-1 波尔多。',
    remark: '决赛首回合 3-3，重赛本菲卡 2-1 波尔多；三四名赛马德里竞技 2-1 拉齐奥。'
  },
  {
    year: 1951,
    champion: 'AC米兰',
    runnerUp: '里尔',
    thirdPlace: '马德里竞技',
    fourthPlace: '葡萄牙体育',
    host: '米兰',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '5-0',
    thirdPlaceScore: '3-1',
    note: '半决赛里尔与葡萄牙体育打了重赛。',
    remark: '决赛AC米兰 5-0 里尔，三四名赛马德里竞技 3-1 葡萄牙体育。'
  },
  {
    year: 1952,
    champion: '巴塞罗那',
    runnerUp: '尼斯',
    thirdPlace: '尤文图斯',
    fourthPlace: '葡萄牙体育',
    host: '尼斯',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '1-0',
    thirdPlaceScore: '3-2',
    remark: '决赛巴塞罗那 1-0 尼斯，三四名赛尤文图斯 3-2 葡萄牙体育。'
  },
  {
    year: 1953,
    champion: '兰斯',
    runnerUp: '瓦伦西亚',
    thirdPlace: '葡萄牙体育',
    fourthPlace: 'AC米兰',
    host: '巴黎',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '3-0',
    thirdPlaceScore: '4-1',
    remark: '决赛兰斯 3-0 瓦伦西亚，三四名赛葡萄牙体育 4-1 AC米兰。'
  },
  {
    year: 1955,
    champion: '皇家马德里',
    runnerUp: '兰斯',
    thirdPlace: 'AC米兰',
    fourthPlace: 'Belenenses',
    host: '巴黎',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '2-0',
    thirdPlaceScore: '3-1',
    remark: '决赛皇家马德里 2-0 兰斯，三四名赛AC米兰 3-1 Belenenses。'
  },
  {
    year: 1956,
    champion: 'AC米兰',
    runnerUp: '毕尔巴鄂竞技',
    thirdPlace: '本菲卡',
    fourthPlace: '尼斯',
    host: '米兰',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '3-1',
    thirdPlaceScore: '2-1',
    remark: '决赛AC米兰 3-1 毕尔巴鄂竞技，三四名赛本菲卡 2-1 尼斯。'
  },
  {
    year: 1957,
    champion: '皇家马德里',
    runnerUp: '本菲卡',
    thirdPlace: 'AC米兰',
    fourthPlace: '圣埃蒂安',
    host: '马德里',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    score: '1-0',
    thirdPlaceScore: '4-3',
    remark: '决赛皇家马德里 1-0 本菲卡，三四名赛AC米兰 4-3 圣埃蒂安。'
  }
];

export const LATIN_CUP_RESULTS: LatinCupResult[] = RAW_LATIN_CUP_RESULTS.map((result) => ({
  ...result,
  name: `${result.year}年`,
  host: result.host,
  quantity: 4,
  mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
  remark: result.remark
}));

export function buildLatinCupStandings(result: LatinCupResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp },
    { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: result.thirdPlace },
    { placement: CompetitionStandingPlacement.FOURTH_PLACE, clubName: result.fourthPlace }
  ].filter((standing) => standing.clubName && SEEDED_CLUB_NAMES.has(standing.clubName));
}

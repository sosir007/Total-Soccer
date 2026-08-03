import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type UefaSuperCupResult = FinalOnlyCompetitionResult & {
  score: string;
};

type RawUefaSuperCupResult = [number, string, string, string, string?];

export const UEFA_SUPER_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_SUPER_CUP',
  name: '欧洲超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'UEFA Super Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/UEFA_Super_Cup',
      remark: '用于核对欧洲超级杯赛事沿革、历届冠军、亚军和比分。'
    },
    {
      label: 'List of UEFA Super Cup matches - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_UEFA_Super_Cup_matches',
      remark: '用于核对历届决赛比分、点球和举办口径。'
    }
  ],
  lastVerifiedAt: '2026-08-03',
  notes: [
    '本文件录入 1973 至 2025 欧洲超级杯决赛冠亚军。',
    '1972 年 Ajax 对 Rangers 的非 UEFA 官方版本不纳入本赛事。',
    '只录最终冠军和亚军，不录三四名。'
  ]
};

export const UEFA_SUPER_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { name: '阿贾克斯', countryName: '荷兰', confederationCode: 'UEFA' },
  { name: 'AC米兰', countryName: '意大利', confederationCode: 'UEFA' },
  {
    uid: '1885',
    name: '基辅迪纳摩',
    englishName: 'Dynamo Kyiv',
    countryName: '乌克兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { name: '拜仁慕尼黑', countryName: '德国', confederationCode: 'UEFA' },
  { name: '安德莱赫特', countryName: '比利时', confederationCode: 'UEFA' },
  { name: '利物浦', countryName: '英格兰', confederationCode: 'UEFA' },
  { name: '汉堡', countryName: '德国', confederationCode: 'UEFA' },
  { name: '诺丁汉森林', countryName: '英格兰', confederationCode: 'UEFA' },
  { name: '巴塞罗那', countryName: '西班牙', confederationCode: 'UEFA' },
  { name: '瓦伦西亚', countryName: '西班牙', confederationCode: 'UEFA' },
  {
    uid: '1536',
    name: '阿伯丁',
    englishName: 'Aberdeen',
    countryName: '苏格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { name: '阿斯顿维拉', countryName: '英格兰', confederationCode: 'UEFA' },
  { name: '尤文图斯', countryName: '意大利', confederationCode: 'UEFA' },
  {
    uid: '1513',
    name: '布加勒斯特星',
    englishName: 'Steaua Bucuresti',
    countryName: '罗马尼亚',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { name: '波尔图', countryName: '葡萄牙', confederationCode: 'UEFA' },
  {
    uid: '232',
    name: '梅赫伦',
    englishName: 'KV Mechelen',
    countryName: '比利时',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { name: '埃因霍温', countryName: '荷兰', confederationCode: 'UEFA' },
  { name: '桑普多利亚', countryName: '意大利', confederationCode: 'UEFA' },
  { name: '曼联', countryName: '英格兰', confederationCode: 'UEFA' },
  { name: '贝尔格莱德红星', countryName: '塞尔维亚', confederationCode: 'UEFA' },
  { name: '罗马', countryName: '意大利', confederationCode: 'UEFA' },
  { name: '费耶诺德', countryName: '荷兰', confederationCode: 'UEFA' },
  { name: '国际米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { name: '阿森纳', countryName: '英格兰', confederationCode: 'UEFA' },
  { name: '萨拉戈萨', countryName: '西班牙', confederationCode: 'UEFA' },
  { name: '巴黎圣日耳曼', countryName: '法国', confederationCode: 'UEFA' },
  { name: '多特蒙德', countryName: '德国', confederationCode: 'UEFA' },
  { name: '切尔西', countryName: '英格兰', confederationCode: 'UEFA' },
  { name: '皇家马德里', countryName: '西班牙', confederationCode: 'UEFA' },
  { name: '拉齐奥', countryName: '意大利', confederationCode: 'UEFA' },
  { name: '帕尔马', countryName: '意大利', confederationCode: 'UEFA' },
  { name: '加拉塔萨雷', countryName: '土耳其', confederationCode: 'UEFA' },
  { name: '莫斯科中央陆军', countryName: '俄罗斯', confederationCode: 'UEFA' },
  { name: '塞维利亚', countryName: '西班牙', confederationCode: 'UEFA' },
  { name: '圣彼得堡泽尼特', countryName: '俄罗斯', confederationCode: 'UEFA' },
  { name: '顿涅茨克矿工', countryName: '乌克兰', confederationCode: 'UEFA' },
  { name: '云达不莱梅', countryName: '德国', confederationCode: 'UEFA' },
  { name: '马德里竞技', countryName: '西班牙', confederationCode: 'UEFA' },
  { name: '亚特兰大', countryName: '意大利', confederationCode: 'UEFA' },
  { name: '比利亚雷亚尔', countryName: '西班牙', confederationCode: 'UEFA' },
  { name: '法兰克福', countryName: '德国', confederationCode: 'UEFA' },
  { name: '曼城', countryName: '英格兰', confederationCode: 'UEFA' },
  { name: '托特纳姆热刺', countryName: '英格兰', confederationCode: 'UEFA' }
];

const RAW_RESULTS: RawUefaSuperCupResult[] = [
  [1973, '阿贾克斯', 'AC米兰', '6-1'],
  [1975, '基辅迪纳摩', '拜仁慕尼黑', '3-0'],
  [1976, '安德莱赫特', '拜仁慕尼黑', '5-3'],
  [1977, '利物浦', '汉堡', '7-1'],
  [1978, '安德莱赫特', '利物浦', '4-3'],
  [1979, '诺丁汉森林', '巴塞罗那', '2-1'],
  [1980, '瓦伦西亚', '诺丁汉森林', '2-2', '瓦伦西亚凭客场进球夺冠。'],
  [1982, '阿斯顿维拉', '巴塞罗那', '3-1', '加时赛。'],
  [1983, '阿伯丁', '汉堡', '2-0'],
  [1984, '尤文图斯', '利物浦', '2-0'],
  [1986, '布加勒斯特星', '基辅迪纳摩', '1-0'],
  [1987, '波尔图', '阿贾克斯', '2-0'],
  [1988, '梅赫伦', '埃因霍温', '3-1'],
  [1989, 'AC米兰', '巴塞罗那', '2-1'],
  [1990, 'AC米兰', '桑普多利亚', '3-1'],
  [1991, '曼联', '贝尔格莱德红星', '1-0'],
  [1992, '巴塞罗那', '云达不莱梅', '3-2'],
  [1993, '帕尔马', 'AC米兰', '2-1', '加时赛。'],
  [1994, 'AC米兰', '阿森纳', '2-0'],
  [1995, '阿贾克斯', '萨拉戈萨', '5-1'],
  [1996, '尤文图斯', '巴黎圣日耳曼', '9-2'],
  [1997, '巴塞罗那', '多特蒙德', '3-1'],
  [1998, '切尔西', '皇家马德里', '1-0'],
  [1999, '拉齐奥', '曼联', '1-0'],
  [2000, '加拉塔萨雷', '皇家马德里', '2-1', '金球制胜。'],
  [2001, '利物浦', '拜仁慕尼黑', '3-2'],
  [2002, '皇家马德里', '费耶诺德', '3-1'],
  [2003, 'AC米兰', '波尔图', '1-0'],
  [2004, '瓦伦西亚', '波尔图', '2-1'],
  [2005, '利物浦', '莫斯科中央陆军', '3-1', '加时赛。'],
  [2006, '塞维利亚', '巴塞罗那', '3-0'],
  [2007, 'AC米兰', '塞维利亚', '3-1'],
  [2008, '圣彼得堡泽尼特', '曼联', '2-1'],
  [2009, '巴塞罗那', '顿涅茨克矿工', '1-0', '加时赛。'],
  [2010, '马德里竞技', '国际米兰', '2-0'],
  [2011, '巴塞罗那', '波尔图', '2-0'],
  [2012, '马德里竞技', '切尔西', '4-1'],
  [2013, '拜仁慕尼黑', '切尔西', '2-2', '点球 5-4。'],
  [2014, '皇家马德里', '塞维利亚', '2-0'],
  [2015, '巴塞罗那', '塞维利亚', '5-4', '加时赛。'],
  [2016, '皇家马德里', '塞维利亚', '3-2', '加时赛。'],
  [2017, '皇家马德里', '曼联', '2-1'],
  [2018, '马德里竞技', '皇家马德里', '4-2', '加时赛。'],
  [2019, '利物浦', '切尔西', '2-2', '点球 5-4。'],
  [2020, '拜仁慕尼黑', '塞维利亚', '2-1', '加时赛。'],
  [2021, '切尔西', '比利亚雷亚尔', '1-1', '点球 6-5。'],
  [2022, '皇家马德里', '法兰克福', '2-0'],
  [2023, '曼城', '塞维利亚', '1-1', '点球 5-4。'],
  [2024, '皇家马德里', '亚特兰大', '2-0'],
  [2025, '巴黎圣日耳曼', '托特纳姆热刺', '2-2', '点球 4-3。']
];

function isSingleLegYear(year: number) {
  return year >= 1998 || year === 1984 || year === 1986 || year === 1991;
}

export const UEFA_SUPER_CUP_RESULTS: UefaSuperCupResult[] = RAW_RESULTS.map(
  ([year, champion, runnerUp, score, note]) => ({
    year,
    champion,
    runnerUp,
    host: isSingleLegYear(year) ? '单场决赛' : '主客场两回合',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    score,
    name: `${year}年`,
    remark: `${year} 届决赛${champion} ${score} ${runnerUp}${note ? `，${note}` : ''}。`
  })
);

export function buildUefaSuperCupStandings(result: UefaSuperCupResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}

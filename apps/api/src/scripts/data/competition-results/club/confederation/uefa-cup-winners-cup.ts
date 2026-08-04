import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type UefaCupWinnersCupResult = FinalOnlyCompetitionResult & {
  season: string;
  name: string;
};

type RawUefaCupWinnersCupResult = Pick<
  UefaCupWinnersCupResult,
  'season' | 'year' | 'champion' | 'runnerUp'
> & {
  year: number;
  score: string;
  note?: string;
};

export const UEFA_CUP_WINNERS_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_CUP_WINNERS_CUP',
  name: '欧洲优胜者杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: "UEFA Cup Winners' Cup - Wikipedia",
      url: 'https://en.wikipedia.org/wiki/UEFA_Cup_Winners%27_Cup',
      remark: '用于核对赛事历史沿革、举办时间和停办口径。'
    },
    {
      label: "List of UEFA Cup Winners' Cup finals - Wikipedia",
      url: 'https://en.wikipedia.org/wiki/List_of_UEFA_Cup_Winners%27_Cup_finals',
      remark: '用于核对历届决赛冠军、亚军和比分。'
    }
  ],
  lastVerifiedAt: '2026-08-04',
  notes: [
    '本文件录入 1960-61 至 1998-99 欧洲优胜者杯决赛冠亚军。',
    '该赛事为欧足联历史上的欧洲俱乐部杯赛，由各协会国内杯赛冠军参加，1998-99 赛季后停办。',
    '使用赛季口径保存 edition.name 和 season，同时用决赛年份保存 year。',
    '只录最终冠军和亚军，不录四强、季军、殿军。'
  ]
};

export const UEFA_CUP_WINNERS_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1129', name: '佛罗伦萨', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1570', name: '格拉斯哥流浪者', countryName: '苏格兰', confederationCode: 'UEFA' },
  { uid: '1687', name: '马德里竞技', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '728', name: '托特纳姆热刺', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1489', name: '葡萄牙体育', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '1060', name: 'MTK布达佩斯', countryName: '匈牙利', confederationCode: 'UEFA' },
  { uid: '735', name: '西汉姆联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '955', name: '慕尼黑1860', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '907', name: '多特蒙德', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '676', name: '利物浦', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '915', name: '拜仁慕尼黑', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1099', name: 'AC米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '947', name: '汉堡', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1622', name: '布拉迪斯拉发', countryName: '斯洛伐克', confederationCode: 'UEFA' },
  { uid: '1708', name: '巴塞罗那', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '679', name: '曼城', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1452', name: '扎布热矿工', countryName: '波兰', confederationCode: 'UEFA' },
  { uid: '630', name: '切尔西', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1736', name: '皇家马德里', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1520', name: '莫斯科迪纳摩', countryName: '俄罗斯', confederationCode: 'UEFA' },
  { uid: '671', name: '利兹联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '2233', name: '马格德堡', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1885', name: '基辅迪纳摩', countryName: '乌克兰', confederationCode: 'UEFA' },
  { uid: '1055', name: '费伦茨瓦罗斯', countryName: '匈牙利', confederationCode: 'UEFA' },
  { uid: '256', name: '安德莱赫特', countryName: '比利时', confederationCode: 'UEFA' },
  { uid: '152', name: '奥地利维也纳', countryName: '奥地利', confederationCode: 'UEFA' },
  { uid: '921', name: '杜塞尔多夫', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1775', name: '瓦伦西亚', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '602', name: '阿森纳', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '892', name: '第比利斯迪纳摩', countryName: '格鲁吉亚', confederationCode: 'UEFA' },
  { uid: '942', name: '卡尔蔡司耶拿', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '250', name: '标准列日', countryName: '比利时', confederationCode: 'UEFA' },
  { uid: '1536', name: '阿伯丁', countryName: '苏格兰', confederationCode: 'UEFA' },
  { uid: '1139', name: '尤文图斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1478', name: '波尔图', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '650', name: '埃弗顿', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '155', name: '维也纳快速', countryName: '奥地利', confederationCode: 'UEFA' },
  { uid: '992', name: '阿贾克斯', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '3600077', name: '莱比锡火车头', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '232', name: '梅赫伦', countryName: '比利时', confederationCode: 'UEFA' },
  { uid: '1167', name: '桑普多利亚', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '680', name: '曼联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '948', name: '云达不莱梅', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '826', name: '摩纳哥', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '1156', name: '帕尔马', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '262', name: '安特卫普', countryName: '比利时', confederationCode: 'UEFA' },
  { uid: '1749', name: '萨拉戈萨', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '868', name: '巴黎圣日耳曼', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '960', name: '斯图加特', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1140', name: '拉齐奥', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1726', name: '皇家马略卡', countryName: '西班牙', confederationCode: 'UEFA' }
];

const RAW_RESULTS: RawUefaCupWinnersCupResult[] = [
  { season: '1960-61', year: 1961, champion: '佛罗伦萨', runnerUp: '格拉斯哥流浪者', score: '4-1' },
  {
    season: '1961-62',
    year: 1962,
    champion: '马德里竞技',
    runnerUp: '佛罗伦萨',
    score: '4-1',
    note: '重赛后'
  },
  { season: '1962-63', year: 1963, champion: '托特纳姆热刺', runnerUp: '马德里竞技', score: '5-1' },
  {
    season: '1963-64',
    year: 1964,
    champion: '葡萄牙体育',
    runnerUp: 'MTK布达佩斯',
    score: '1-0',
    note: '重赛后'
  },
  { season: '1964-65', year: 1965, champion: '西汉姆联', runnerUp: '慕尼黑1860', score: '2-0' },
  { season: '1965-66', year: 1966, champion: '多特蒙德', runnerUp: '利物浦', score: '2-1' },
  {
    season: '1966-67',
    year: 1967,
    champion: '拜仁慕尼黑',
    runnerUp: '格拉斯哥流浪者',
    score: '1-0'
  },
  { season: '1967-68', year: 1968, champion: 'AC米兰', runnerUp: '汉堡', score: '2-0' },
  { season: '1968-69', year: 1969, champion: '布拉迪斯拉发', runnerUp: '巴塞罗那', score: '3-2' },
  { season: '1969-70', year: 1970, champion: '曼城', runnerUp: '扎布热矿工', score: '2-1' },
  {
    season: '1970-71',
    year: 1971,
    champion: '切尔西',
    runnerUp: '皇家马德里',
    score: '2-1',
    note: '重赛后'
  },
  {
    season: '1971-72',
    year: 1972,
    champion: '格拉斯哥流浪者',
    runnerUp: '莫斯科迪纳摩',
    score: '3-2'
  },
  { season: '1972-73', year: 1973, champion: 'AC米兰', runnerUp: '利兹联', score: '1-0' },
  { season: '1973-74', year: 1974, champion: '马格德堡', runnerUp: 'AC米兰', score: '2-0' },
  { season: '1974-75', year: 1975, champion: '基辅迪纳摩', runnerUp: '费伦茨瓦罗斯', score: '3-0' },
  { season: '1975-76', year: 1976, champion: '安德莱赫特', runnerUp: '西汉姆联', score: '4-2' },
  { season: '1976-77', year: 1977, champion: '汉堡', runnerUp: '安德莱赫特', score: '2-0' },
  { season: '1977-78', year: 1978, champion: '安德莱赫特', runnerUp: '奥地利维也纳', score: '4-0' },
  { season: '1978-79', year: 1979, champion: '巴塞罗那', runnerUp: '杜塞尔多夫', score: '4-3' },
  {
    season: '1979-80',
    year: 1980,
    champion: '瓦伦西亚',
    runnerUp: '阿森纳',
    score: '0-0',
    note: '点球 5-4'
  },
  {
    season: '1980-81',
    year: 1981,
    champion: '第比利斯迪纳摩',
    runnerUp: '卡尔蔡司耶拿',
    score: '2-1'
  },
  { season: '1981-82', year: 1982, champion: '巴塞罗那', runnerUp: '标准列日', score: '2-1' },
  { season: '1982-83', year: 1983, champion: '阿伯丁', runnerUp: '皇家马德里', score: '2-1' },
  { season: '1983-84', year: 1984, champion: '尤文图斯', runnerUp: '波尔图', score: '2-1' },
  { season: '1984-85', year: 1985, champion: '埃弗顿', runnerUp: '维也纳快速', score: '3-1' },
  { season: '1985-86', year: 1986, champion: '基辅迪纳摩', runnerUp: '马德里竞技', score: '3-0' },
  { season: '1986-87', year: 1987, champion: '阿贾克斯', runnerUp: '莱比锡火车头', score: '1-0' },
  { season: '1987-88', year: 1988, champion: '梅赫伦', runnerUp: '阿贾克斯', score: '1-0' },
  { season: '1988-89', year: 1989, champion: '巴塞罗那', runnerUp: '桑普多利亚', score: '2-0' },
  { season: '1989-90', year: 1990, champion: '桑普多利亚', runnerUp: '安德莱赫特', score: '2-0' },
  { season: '1990-91', year: 1991, champion: '曼联', runnerUp: '巴塞罗那', score: '2-1' },
  { season: '1991-92', year: 1992, champion: '云达不莱梅', runnerUp: '摩纳哥', score: '2-0' },
  { season: '1992-93', year: 1993, champion: '帕尔马', runnerUp: '安特卫普', score: '3-1' },
  { season: '1993-94', year: 1994, champion: '阿森纳', runnerUp: '帕尔马', score: '1-0' },
  { season: '1994-95', year: 1995, champion: '萨拉戈萨', runnerUp: '阿森纳', score: '2-1' },
  { season: '1995-96', year: 1996, champion: '巴黎圣日耳曼', runnerUp: '维也纳快速', score: '1-0' },
  { season: '1996-97', year: 1997, champion: '巴塞罗那', runnerUp: '巴黎圣日耳曼', score: '1-0' },
  { season: '1997-98', year: 1998, champion: '切尔西', runnerUp: '斯图加特', score: '1-0' },
  { season: '1998-99', year: 1999, champion: '拉齐奥', runnerUp: '皇家马略卡', score: '2-1' }
];

export const UEFA_CUP_WINNERS_CUP_RESULTS: UefaCupWinnersCupResult[] = RAW_RESULTS.map(
  (result) => ({
    ...result,
    name: `${result.season}赛季`,
    host: '决赛',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: `决赛${result.champion} ${result.score} ${result.runnerUp}${result.note ? `，${result.note}` : ''}。`
  })
);

export function buildUefaCupWinnersCupStandings(result: UefaCupWinnersCupResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}

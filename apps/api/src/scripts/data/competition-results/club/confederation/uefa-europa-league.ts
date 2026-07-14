import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type EuropaLeagueResult = FinalOnlyCompetitionResult & {
  season: string;
  name: string;
};

type RawEuropaLeagueResult = Pick<
  EuropaLeagueResult,
  'season' | 'year' | 'champion' | 'runnerUp'
> & {
  year: number;
  score: string;
  note?: string;
};

export const UEFA_EUROPA_LEAGUE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_EUROPA_LEAGUE',
  name: '欧足联欧洲联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'UEFA Europa League - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/UEFA_Europa_League',
      remark: '用于核对欧洲联盟杯/欧足联欧洲联赛历史沿革和赛事口径。'
    },
    {
      label: 'List of UEFA Cup and Europa League finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_UEFA_Cup_and_Europa_League_finals',
      remark: '用于核对历届决赛冠军、亚军和比分。'
    },
    {
      label: '2026 UEFA Europa League final - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2026_UEFA_Europa_League_final',
      remark: '用于核对 2025-26 决赛阿斯顿维拉 3-0 弗赖堡。'
    }
  ],
  lastVerifiedAt: '2026-07-14',
  notes: [
    '本文件录入 1971-72 至 2025-26 欧洲联盟杯/欧足联欧洲联赛决赛冠亚军。',
    '不包含城市博览会杯；该赛事不是欧足联官方承认的欧洲联盟杯前身届次。',
    '使用赛季口径保存 edition.name 和 season，同时用决赛年份保存 year。',
    '只录最终冠军和亚军，不录四强、季军、殿军。'
  ]
};

const CLUBS: SeedClub[] = [
  { uid: '728', name: '托特纳姆热刺', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '740', name: '狼队', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '676', name: '利物浦', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '908', name: '门兴格拉德巴赫', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1013', name: '费耶诺德', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '1009', name: '特温特', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '186', name: '布鲁日', countryName: '比利时', confederationCode: 'UEFA' },
  { uid: '1139', name: '尤文图斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1664', name: '毕尔巴鄂竞技', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1028', name: '埃因霍温', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '876', name: '巴斯蒂亚', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '1955', name: '贝尔格莱德红星', countryName: '塞尔维亚', confederationCode: 'UEFA' },
  { uid: '912', name: '法兰克福', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '667', name: '伊普斯维奇', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '991', name: '阿尔克马尔', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '1803', name: 'IFK哥德堡', countryName: '瑞典', confederationCode: 'UEFA' },
  { uid: '947', name: '汉堡', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '256', name: '安德莱赫特', countryName: '比利时', confederationCode: 'UEFA' },
  { uid: '1487', name: '本菲卡', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '1736', name: '皇家马德里', countryName: '西班牙', confederationCode: 'UEFA' },
  {
    uid: '1062',
    name: '白堡',
    alias: '维迪奥顿',
    countryName: '匈牙利',
    confederationCode: 'UEFA'
  },
  { uid: '916', name: '科隆', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1556', name: '邓迪联', countryName: '苏格兰', confederationCode: 'UEFA' },
  { uid: '901', name: '勒沃库森', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1725', name: '西班牙人', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1150', name: '那不勒斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '960', name: '斯图加特', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1129', name: '佛罗伦萨', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1135', name: '国际米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1100', name: '罗马', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '992', name: '阿贾克斯', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '1174', name: '都灵', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '907', name: '多特蒙德', countryName: '德国', confederationCode: 'UEFA' },
  {
    uid: '16046867',
    name: '奥地利萨尔茨堡',
    countryName: '奥地利',
    confederationCode: 'UEFA'
  },
  { uid: '1156', name: '帕尔马', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '915', name: '拜仁慕尼黑', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '851', name: '波尔多', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '920', name: '沙尔克04', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1140', name: '拉齐奥', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '866', name: '马赛', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '1871', name: '加拉塔萨雷', countryName: '土耳其', confederationCode: 'UEFA' },
  { uid: '602', name: '阿森纳', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1688', name: '阿拉维斯', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1478', name: '波尔图', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '1569', name: '凯尔特人', countryName: '苏格兰', confederationCode: 'UEFA' },
  { uid: '1775', name: '瓦伦西亚', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1518', name: '莫斯科中央陆军', countryName: '俄罗斯', confederationCode: 'UEFA' },
  { uid: '1489', name: '葡萄牙体育', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '1759', name: '塞维利亚', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '685', name: '米德尔斯堡', countryName: '英格兰', confederationCode: 'UEFA' },
  {
    uid: '1301108',
    name: '圣彼得堡泽尼特',
    countryName: '俄罗斯',
    confederationCode: 'UEFA'
  },
  { uid: '1570', name: '格拉斯哥流浪者', countryName: '苏格兰', confederationCode: 'UEFA' },
  { uid: '1895', name: '顿涅茨克矿工', countryName: '乌克兰', confederationCode: 'UEFA' },
  { uid: '948', name: '云达不莱梅', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1687', name: '马德里竞技', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '654', name: '富勒姆', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1488', name: '布拉加', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '630', name: '切尔西', countryName: '英格兰', confederationCode: 'UEFA' },
  {
    uid: '1886',
    name: '第聂伯罗',
    countryName: '乌克兰',
    confederationCode: 'UEFA',
    exists: false,
    visibleInCatalog: false
  },
  { uid: '680', name: '曼联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1777', name: '比利亚雷亚尔', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1106', name: '亚特兰大', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '603', name: '阿斯顿维拉', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '944', name: '弗赖堡', countryName: '德国', confederationCode: 'UEFA' }
];

const HIDDEN_CATALOG_CLUBS = new Set([
  '门兴格拉德巴赫',
  '布鲁日',
  '毕尔巴鄂竞技',
  '巴斯蒂亚',
  '伊普斯维奇',
  '阿尔克马尔',
  'IFK哥德堡',
  '白堡',
  '科隆',
  '邓迪联',
  '奥地利萨尔茨堡',
  '瓦伦西亚',
  '圣彼得堡泽尼特',
  '顿涅茨克矿工',
  '布拉加',
  '比利亚雷亚尔'
]);

export const UEFA_EUROPA_LEAGUE_REQUIRED_CLUBS: SeedClub[] = CLUBS.map((club) => ({
  ...club,
  visibleInCatalog: HIDDEN_CATALOG_CLUBS.has(club.name) ? false : club.visibleInCatalog
}));

const SINGLE_FINAL_HOSTS: Record<number, string> = {
  1998: '法国巴黎王子公园球场',
  1999: '俄罗斯莫斯科卢日尼基体育场',
  2000: '丹麦哥本哈根帕肯球场',
  2001: '德国多特蒙德威斯特法伦球场',
  2002: '荷兰鹿特丹费耶诺德球场',
  2003: '西班牙塞维利亚奥林匹克体育场',
  2004: '瑞典哥德堡新乌利维球场',
  2005: '葡萄牙里斯本何塞·阿尔瓦拉德球场',
  2006: '荷兰埃因霍温飞利浦球场',
  2007: '苏格兰格拉斯哥汉普顿公园球场',
  2008: '英格兰曼彻斯特城市球场',
  2009: '土耳其伊斯坦布尔萨拉焦卢球场',
  2010: '德国汉堡北方银行竞技场',
  2011: '爱尔兰都柏林英杰华球场',
  2012: '罗马尼亚布加勒斯特国家竞技场',
  2013: '荷兰阿姆斯特丹阿姆斯特丹竞技场',
  2014: '意大利都灵尤文图斯竞技场',
  2015: '波兰华沙国家体育场',
  2016: '瑞士巴塞尔圣雅各布公园球场',
  2017: '瑞典索尔纳友谊竞技场',
  2018: '法国里昂奥林匹克公园球场',
  2019: '阿塞拜疆巴库奥林匹克体育场',
  2020: '德国科隆莱茵能源体育场',
  2021: '波兰格但斯克能源体育场',
  2022: '西班牙塞维利亚拉蒙·桑切斯·皮斯胡安球场',
  2023: '匈牙利布达佩斯普斯卡什竞技场',
  2024: '爱尔兰都柏林英杰华球场',
  2025: '西班牙毕尔巴鄂圣马梅斯球场',
  2026: '土耳其伊斯坦布尔贝西克塔斯体育场'
};

const RAW_RESULTS: RawEuropaLeagueResult[] = [
  { season: '1971-72', year: 1972, champion: '托特纳姆热刺', runnerUp: '狼队', score: '3-2' },
  { season: '1972-73', year: 1973, champion: '利物浦', runnerUp: '门兴格拉德巴赫', score: '3-2' },
  { season: '1973-74', year: 1974, champion: '费耶诺德', runnerUp: '托特纳姆热刺', score: '4-2' },
  { season: '1974-75', year: 1975, champion: '门兴格拉德巴赫', runnerUp: '特温特', score: '5-1' },
  { season: '1975-76', year: 1976, champion: '利物浦', runnerUp: '布鲁日', score: '4-3' },
  {
    season: '1976-77',
    year: 1977,
    champion: '尤文图斯',
    runnerUp: '毕尔巴鄂竞技',
    score: '2-2',
    note: '客场进球'
  },
  { season: '1977-78', year: 1978, champion: '埃因霍温', runnerUp: '巴斯蒂亚', score: '3-0' },
  {
    season: '1978-79',
    year: 1979,
    champion: '门兴格拉德巴赫',
    runnerUp: '贝尔格莱德红星',
    score: '2-1'
  },
  {
    season: '1979-80',
    year: 1980,
    champion: '法兰克福',
    runnerUp: '门兴格拉德巴赫',
    score: '3-3',
    note: '客场进球'
  },
  { season: '1980-81', year: 1981, champion: '伊普斯维奇', runnerUp: '阿尔克马尔', score: '5-4' },
  { season: '1981-82', year: 1982, champion: 'IFK哥德堡', runnerUp: '汉堡', score: '4-0' },
  { season: '1982-83', year: 1983, champion: '安德莱赫特', runnerUp: '本菲卡', score: '2-1' },
  {
    season: '1983-84',
    year: 1984,
    champion: '托特纳姆热刺',
    runnerUp: '安德莱赫特',
    score: '2-2',
    note: '点球 4-3'
  },
  { season: '1984-85', year: 1985, champion: '皇家马德里', runnerUp: '白堡', score: '3-1' },
  { season: '1985-86', year: 1986, champion: '皇家马德里', runnerUp: '科隆', score: '5-3' },
  { season: '1986-87', year: 1987, champion: 'IFK哥德堡', runnerUp: '邓迪联', score: '2-1' },
  {
    season: '1987-88',
    year: 1988,
    champion: '勒沃库森',
    runnerUp: '西班牙人',
    score: '3-3',
    note: '点球 3-2'
  },
  { season: '1988-89', year: 1989, champion: '那不勒斯', runnerUp: '斯图加特', score: '5-4' },
  { season: '1989-90', year: 1990, champion: '尤文图斯', runnerUp: '佛罗伦萨', score: '3-1' },
  { season: '1990-91', year: 1991, champion: '国际米兰', runnerUp: '罗马', score: '2-1' },
  {
    season: '1991-92',
    year: 1992,
    champion: '阿贾克斯',
    runnerUp: '都灵',
    score: '2-2',
    note: '客场进球'
  },
  { season: '1992-93', year: 1993, champion: '尤文图斯', runnerUp: '多特蒙德', score: '6-1' },
  {
    season: '1993-94',
    year: 1994,
    champion: '国际米兰',
    runnerUp: '奥地利萨尔茨堡',
    score: '2-0'
  },
  { season: '1994-95', year: 1995, champion: '帕尔马', runnerUp: '尤文图斯', score: '2-1' },
  { season: '1995-96', year: 1996, champion: '拜仁慕尼黑', runnerUp: '波尔多', score: '5-1' },
  {
    season: '1996-97',
    year: 1997,
    champion: '沙尔克04',
    runnerUp: '国际米兰',
    score: '1-1',
    note: '点球 4-1'
  },
  { season: '1997-98', year: 1998, champion: '国际米兰', runnerUp: '拉齐奥', score: '3-0' },
  { season: '1998-99', year: 1999, champion: '帕尔马', runnerUp: '马赛', score: '3-0' },
  {
    season: '1999-00',
    year: 2000,
    champion: '加拉塔萨雷',
    runnerUp: '阿森纳',
    score: '0-0',
    note: '点球 4-1'
  },
  {
    season: '2000-01',
    year: 2001,
    champion: '利物浦',
    runnerUp: '阿拉维斯',
    score: '5-4',
    note: '加时金球'
  },
  { season: '2001-02', year: 2002, champion: '费耶诺德', runnerUp: '多特蒙德', score: '3-2' },
  {
    season: '2002-03',
    year: 2003,
    champion: '波尔图',
    runnerUp: '凯尔特人',
    score: '3-2',
    note: '加时'
  },
  { season: '2003-04', year: 2004, champion: '瓦伦西亚', runnerUp: '马赛', score: '2-0' },
  {
    season: '2004-05',
    year: 2005,
    champion: '莫斯科中央陆军',
    runnerUp: '葡萄牙体育',
    score: '3-1'
  },
  { season: '2005-06', year: 2006, champion: '塞维利亚', runnerUp: '米德尔斯堡', score: '4-0' },
  {
    season: '2006-07',
    year: 2007,
    champion: '塞维利亚',
    runnerUp: '西班牙人',
    score: '2-2',
    note: '点球 3-1'
  },
  {
    season: '2007-08',
    year: 2008,
    champion: '圣彼得堡泽尼特',
    runnerUp: '格拉斯哥流浪者',
    score: '2-0'
  },
  {
    season: '2008-09',
    year: 2009,
    champion: '顿涅茨克矿工',
    runnerUp: '云达不莱梅',
    score: '2-1',
    note: '加时'
  },
  {
    season: '2009-10',
    year: 2010,
    champion: '马德里竞技',
    runnerUp: '富勒姆',
    score: '2-1',
    note: '加时'
  },
  { season: '2010-11', year: 2011, champion: '波尔图', runnerUp: '布拉加', score: '1-0' },
  {
    season: '2011-12',
    year: 2012,
    champion: '马德里竞技',
    runnerUp: '毕尔巴鄂竞技',
    score: '3-0'
  },
  { season: '2012-13', year: 2013, champion: '切尔西', runnerUp: '本菲卡', score: '2-1' },
  {
    season: '2013-14',
    year: 2014,
    champion: '塞维利亚',
    runnerUp: '本菲卡',
    score: '0-0',
    note: '点球 4-2'
  },
  { season: '2014-15', year: 2015, champion: '塞维利亚', runnerUp: '第聂伯罗', score: '3-2' },
  { season: '2015-16', year: 2016, champion: '塞维利亚', runnerUp: '利物浦', score: '3-1' },
  { season: '2016-17', year: 2017, champion: '曼联', runnerUp: '阿贾克斯', score: '2-0' },
  { season: '2017-18', year: 2018, champion: '马德里竞技', runnerUp: '马赛', score: '3-0' },
  { season: '2018-19', year: 2019, champion: '切尔西', runnerUp: '阿森纳', score: '4-1' },
  { season: '2019-20', year: 2020, champion: '塞维利亚', runnerUp: '国际米兰', score: '3-2' },
  {
    season: '2020-21',
    year: 2021,
    champion: '比利亚雷亚尔',
    runnerUp: '曼联',
    score: '1-1',
    note: '点球 11-10'
  },
  {
    season: '2021-22',
    year: 2022,
    champion: '法兰克福',
    runnerUp: '格拉斯哥流浪者',
    score: '1-1',
    note: '点球 5-4'
  },
  {
    season: '2022-23',
    year: 2023,
    champion: '塞维利亚',
    runnerUp: '罗马',
    score: '1-1',
    note: '点球 4-1'
  },
  { season: '2023-24', year: 2024, champion: '亚特兰大', runnerUp: '勒沃库森', score: '3-0' },
  { season: '2024-25', year: 2025, champion: '托特纳姆热刺', runnerUp: '曼联', score: '1-0' },
  { season: '2025-26', year: 2026, champion: '阿斯顿维拉', runnerUp: '弗赖堡', score: '3-0' }
];

export const UEFA_EUROPA_LEAGUE_RESULTS: EuropaLeagueResult[] = RAW_RESULTS.map((result) => ({
  ...result,
  name: `${result.season}赛季`,
  host: result.year <= 1997 ? '主客场两回合' : SINGLE_FINAL_HOSTS[result.year],
  quantity: 2,
  mode: CompetitionEditionStandingMode.FINAL_ONLY,
  remark: `${result.year <= 1997 ? '两回合决赛总比分' : '决赛'}${result.champion} ${
    result.score
  } ${result.runnerUp}${result.note ? `，${result.note}` : ''}。`
}));

export function buildUefaEuropaLeagueStandings(result: EuropaLeagueResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}

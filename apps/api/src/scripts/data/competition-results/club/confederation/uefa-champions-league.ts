import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type ChampionsLeagueResult = FinalOnlyCompetitionResult & {
  season: string;
  name: string;
};

type RawChampionsLeagueResult = Pick<
  ChampionsLeagueResult,
  'season' | 'year' | 'champion' | 'runnerUp'
> & {
  year: number;
  score: string;
  note?: string;
};

export const UEFA_CHAMPIONS_LEAGUE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_CHAMPIONS_LEAGUE',
  name: '欧洲冠军联赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'UEFA Champions League - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/UEFA_Champions_League',
      remark: '用于核对欧洲冠军杯/欧冠历史沿革和赛事口径。'
    },
    {
      label: 'List of European Cup and UEFA Champions League finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals',
      remark: '用于核对历届决赛冠军、亚军、比分和举办地。'
    },
    {
      label: '2026 UEFA Champions League final live report - The Guardian',
      url: 'https://www.theguardian.com/football/live/2026/may/30/paris-saint-germain-arsenal-champions-league-final-live-psg-score-updates',
      remark: '用于核对 2025-26 决赛巴黎圣日耳曼点球击败阿森纳。'
    }
  ],
  lastVerifiedAt: '2026-07-10',
  notes: [
    '本文件录入 1955-56 至 2025-26 欧洲冠军杯/欧洲冠军联赛决赛冠亚军。',
    '使用赛季口径保存 edition.name 和 season，同时用决赛年份保存 year。',
    '只录最终冠军和亚军，不录四强、季军、殿军。'
  ]
};

export const UEFA_CHAMPIONS_LEAGUE_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1736', name: '皇家马德里', countryName: '西班牙', confederationCode: 'UEFA' },
  {
    uid: '2047',
    name: '兰斯',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '1129', name: '佛罗伦萨', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1099', name: 'AC米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '912', name: '法兰克福', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1487', name: '本菲卡', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '1708', name: '巴塞罗那', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1135', name: '国际米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1952', name: '贝尔格莱德游击', countryName: '塞尔维亚', confederationCode: 'UEFA' },
  { uid: '1569', name: '凯尔特人', countryName: '苏格兰', confederationCode: 'UEFA' },
  { uid: '680', name: '曼联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '992', name: '阿贾克斯', countryName: '荷兰', confederationCode: 'UEFA' },
  {
    uid: '983',
    name: '帕纳辛奈科斯',
    countryName: '希腊',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '1013', name: '费耶诺德', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '1139', name: '尤文图斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1687', name: '马德里竞技', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '915', name: '拜仁慕尼黑', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '671', name: '利兹联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '828', name: '圣埃蒂安', countryName: '法国', confederationCode: 'UEFA' },
  {
    uid: '908',
    name: '门兴格拉德巴赫',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '676', name: '利物浦', countryName: '英格兰', confederationCode: 'UEFA' },
  {
    uid: '186',
    name: '布鲁日',
    countryName: '比利时',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '692', name: '诺丁汉森林', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1816', name: '马尔默', countryName: '瑞典', confederationCode: 'UEFA' },
  { uid: '947', name: '汉堡', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '603', name: '阿斯顿维拉', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1100', name: '罗马', countryName: '意大利', confederationCode: 'UEFA' },
  {
    uid: '1513',
    name: '布加勒斯特星',
    countryName: '罗马尼亚',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '1478', name: '波尔图', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '1028', name: '埃因霍温', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '1955', name: '贝尔格莱德红星', countryName: '塞尔维亚', confederationCode: 'UEFA' },
  { uid: '866', name: '马赛', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '1167', name: '桑普多利亚', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '907', name: '多特蒙德', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '901', name: '勒沃库森', countryName: '德国', confederationCode: 'UEFA' },
  {
    uid: '826',
    name: '摩纳哥',
    countryName: '法国',
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
  { uid: '630', name: '切尔西', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '679', name: '曼城', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '728', name: '托特纳姆热刺', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '868', name: '巴黎圣日耳曼', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '602', name: '阿森纳', countryName: '英格兰', confederationCode: 'UEFA' }
];

const UCL_HOSTS: Record<number, string> = {
  1956: '法国巴黎王子公园球场',
  1957: '西班牙马德里圣地亚哥伯纳乌球场',
  1958: '比利时布鲁塞尔海瑟尔球场',
  1959: '西德斯图加特内卡体育场',
  1960: '苏格兰格拉斯哥汉普顿公园球场',
  1961: '瑞士伯尔尼万克多夫球场',
  1962: '荷兰阿姆斯特丹奥林匹克体育场',
  1963: '英格兰伦敦温布利球场',
  1964: '奥地利维也纳普拉特球场',
  1965: '意大利米兰圣西罗球场',
  1966: '比利时布鲁塞尔海瑟尔球场',
  1967: '葡萄牙里斯本国家体育场',
  1968: '英格兰伦敦温布利球场',
  1969: '西班牙马德里圣地亚哥伯纳乌球场',
  1970: '意大利米兰圣西罗球场',
  1971: '英格兰伦敦温布利球场',
  1972: '荷兰鹿特丹费耶诺德球场',
  1973: '南斯拉夫贝尔格莱德红星体育场',
  1974: '比利时布鲁塞尔海瑟尔球场',
  1975: '法国巴黎王子公园球场',
  1976: '苏格兰格拉斯哥汉普顿公园球场',
  1977: '意大利罗马奥林匹克体育场',
  1978: '英格兰伦敦温布利球场',
  1979: '西德慕尼黑奥林匹克体育场',
  1980: '西班牙马德里圣地亚哥伯纳乌球场',
  1981: '法国巴黎王子公园球场',
  1982: '荷兰鹿特丹费耶诺德球场',
  1983: '希腊雅典奥林匹克体育场',
  1984: '意大利罗马奥林匹克体育场',
  1985: '比利时布鲁塞尔海瑟尔球场',
  1986: '西班牙塞维利亚拉蒙-桑切斯-皮斯胡安球场',
  1987: '奥地利维也纳普拉特球场',
  1988: '西德斯图加特内卡体育场',
  1989: '西班牙巴塞罗那诺坎普球场',
  1990: '奥地利维也纳普拉特球场',
  1991: '意大利巴里圣尼古拉球场',
  1992: '英格兰伦敦温布利球场',
  1993: '德国慕尼黑奥林匹克体育场',
  1994: '希腊雅典奥林匹克体育场',
  1995: '奥地利维也纳恩斯特-哈佩尔球场',
  1996: '意大利罗马奥林匹克体育场',
  1997: '德国慕尼黑奥林匹克体育场',
  1998: '荷兰阿姆斯特丹竞技场',
  1999: '西班牙巴塞罗那诺坎普球场',
  2000: '法国圣但尼法兰西体育场',
  2001: '意大利米兰圣西罗球场',
  2002: '苏格兰格拉斯哥汉普顿公园球场',
  2003: '英格兰曼彻斯特老特拉福德球场',
  2004: '德国盖尔森基兴傲赴沙尔克竞技场',
  2005: '土耳其伊斯坦布尔阿塔图尔克奥林匹克体育场',
  2006: '法国圣但尼法兰西体育场',
  2007: '希腊雅典奥林匹克体育场',
  2008: '俄罗斯莫斯科卢日尼基体育场',
  2009: '意大利罗马奥林匹克体育场',
  2010: '西班牙马德里圣地亚哥伯纳乌球场',
  2011: '英格兰伦敦温布利球场',
  2012: '德国慕尼黑安联球场',
  2013: '英格兰伦敦温布利球场',
  2014: '葡萄牙里斯本光明球场',
  2015: '德国柏林奥林匹克体育场',
  2016: '意大利米兰圣西罗球场',
  2017: '威尔士卡迪夫千禧球场',
  2018: '乌克兰基辅奥林匹克国家综合体育场',
  2019: '西班牙马德里大都会球场',
  2020: '葡萄牙里斯本光明球场',
  2021: '葡萄牙波尔图巨龙球场',
  2022: '法国圣但尼法兰西体育场',
  2023: '土耳其伊斯坦布尔阿塔图尔克奥林匹克体育场',
  2024: '英格兰伦敦温布利球场',
  2025: '德国慕尼黑安联球场',
  2026: '匈牙利布达佩斯普斯卡什竞技场'
};

const UCL_RESULTS: RawChampionsLeagueResult[] = [
  { season: '1955-56', year: 1956, champion: '皇家马德里', runnerUp: '兰斯', score: '4-3' },
  { season: '1956-57', year: 1957, champion: '皇家马德里', runnerUp: '佛罗伦萨', score: '2-0' },
  {
    season: '1957-58',
    year: 1958,
    champion: '皇家马德里',
    runnerUp: 'AC米兰',
    score: '3-2',
    note: '加时'
  },
  { season: '1958-59', year: 1959, champion: '皇家马德里', runnerUp: '兰斯', score: '2-0' },
  { season: '1959-60', year: 1960, champion: '皇家马德里', runnerUp: '法兰克福', score: '7-3' },
  { season: '1960-61', year: 1961, champion: '本菲卡', runnerUp: '巴塞罗那', score: '3-2' },
  { season: '1961-62', year: 1962, champion: '本菲卡', runnerUp: '皇家马德里', score: '5-3' },
  { season: '1962-63', year: 1963, champion: 'AC米兰', runnerUp: '本菲卡', score: '2-1' },
  { season: '1963-64', year: 1964, champion: '国际米兰', runnerUp: '皇家马德里', score: '3-1' },
  { season: '1964-65', year: 1965, champion: '国际米兰', runnerUp: '本菲卡', score: '1-0' },
  {
    season: '1965-66',
    year: 1966,
    champion: '皇家马德里',
    runnerUp: '贝尔格莱德游击',
    score: '2-1'
  },
  { season: '1966-67', year: 1967, champion: '凯尔特人', runnerUp: '国际米兰', score: '2-1' },
  {
    season: '1967-68',
    year: 1968,
    champion: '曼联',
    runnerUp: '本菲卡',
    score: '4-1',
    note: '加时'
  },
  { season: '1968-69', year: 1969, champion: 'AC米兰', runnerUp: '阿贾克斯', score: '4-1' },
  {
    season: '1969-70',
    year: 1970,
    champion: '费耶诺德',
    runnerUp: '凯尔特人',
    score: '2-1',
    note: '加时'
  },
  { season: '1970-71', year: 1971, champion: '阿贾克斯', runnerUp: '帕纳辛奈科斯', score: '2-0' },
  { season: '1971-72', year: 1972, champion: '阿贾克斯', runnerUp: '国际米兰', score: '2-0' },
  { season: '1972-73', year: 1973, champion: '阿贾克斯', runnerUp: '尤文图斯', score: '1-0' },
  {
    season: '1973-74',
    year: 1974,
    champion: '拜仁慕尼黑',
    runnerUp: '马德里竞技',
    score: '4-0',
    note: '重赛'
  },
  { season: '1974-75', year: 1975, champion: '拜仁慕尼黑', runnerUp: '利兹联', score: '2-0' },
  { season: '1975-76', year: 1976, champion: '拜仁慕尼黑', runnerUp: '圣埃蒂安', score: '1-0' },
  { season: '1976-77', year: 1977, champion: '利物浦', runnerUp: '门兴格拉德巴赫', score: '3-1' },
  { season: '1977-78', year: 1978, champion: '利物浦', runnerUp: '布鲁日', score: '1-0' },
  { season: '1978-79', year: 1979, champion: '诺丁汉森林', runnerUp: '马尔默', score: '1-0' },
  { season: '1979-80', year: 1980, champion: '诺丁汉森林', runnerUp: '汉堡', score: '1-0' },
  { season: '1980-81', year: 1981, champion: '利物浦', runnerUp: '皇家马德里', score: '1-0' },
  { season: '1981-82', year: 1982, champion: '阿斯顿维拉', runnerUp: '拜仁慕尼黑', score: '1-0' },
  { season: '1982-83', year: 1983, champion: '汉堡', runnerUp: '尤文图斯', score: '1-0' },
  {
    season: '1983-84',
    year: 1984,
    champion: '利物浦',
    runnerUp: '罗马',
    score: '1-1',
    note: '点球 4-2'
  },
  { season: '1984-85', year: 1985, champion: '尤文图斯', runnerUp: '利物浦', score: '1-0' },
  {
    season: '1985-86',
    year: 1986,
    champion: '布加勒斯特星',
    runnerUp: '巴塞罗那',
    score: '0-0',
    note: '点球 2-0'
  },
  { season: '1986-87', year: 1987, champion: '波尔图', runnerUp: '拜仁慕尼黑', score: '2-1' },
  {
    season: '1987-88',
    year: 1988,
    champion: '埃因霍温',
    runnerUp: '本菲卡',
    score: '0-0',
    note: '点球 6-5'
  },
  { season: '1988-89', year: 1989, champion: 'AC米兰', runnerUp: '布加勒斯特星', score: '4-0' },
  { season: '1989-90', year: 1990, champion: 'AC米兰', runnerUp: '本菲卡', score: '1-0' },
  {
    season: '1990-91',
    year: 1991,
    champion: '贝尔格莱德红星',
    runnerUp: '马赛',
    score: '0-0',
    note: '点球 5-3'
  },
  {
    season: '1991-92',
    year: 1992,
    champion: '巴塞罗那',
    runnerUp: '桑普多利亚',
    score: '1-0',
    note: '加时'
  },
  { season: '1992-93', year: 1993, champion: '马赛', runnerUp: 'AC米兰', score: '1-0' },
  { season: '1993-94', year: 1994, champion: 'AC米兰', runnerUp: '巴塞罗那', score: '4-0' },
  { season: '1994-95', year: 1995, champion: '阿贾克斯', runnerUp: 'AC米兰', score: '1-0' },
  {
    season: '1995-96',
    year: 1996,
    champion: '尤文图斯',
    runnerUp: '阿贾克斯',
    score: '1-1',
    note: '点球 4-2'
  },
  { season: '1996-97', year: 1997, champion: '多特蒙德', runnerUp: '尤文图斯', score: '3-1' },
  { season: '1997-98', year: 1998, champion: '皇家马德里', runnerUp: '尤文图斯', score: '1-0' },
  { season: '1998-99', year: 1999, champion: '曼联', runnerUp: '拜仁慕尼黑', score: '2-1' },
  { season: '1999-00', year: 2000, champion: '皇家马德里', runnerUp: '瓦伦西亚', score: '3-0' },
  {
    season: '2000-01',
    year: 2001,
    champion: '拜仁慕尼黑',
    runnerUp: '瓦伦西亚',
    score: '1-1',
    note: '点球 5-4'
  },
  { season: '2001-02', year: 2002, champion: '皇家马德里', runnerUp: '勒沃库森', score: '2-1' },
  {
    season: '2002-03',
    year: 2003,
    champion: 'AC米兰',
    runnerUp: '尤文图斯',
    score: '0-0',
    note: '点球 3-2'
  },
  { season: '2003-04', year: 2004, champion: '波尔图', runnerUp: '摩纳哥', score: '3-0' },
  {
    season: '2004-05',
    year: 2005,
    champion: '利物浦',
    runnerUp: 'AC米兰',
    score: '3-3',
    note: '点球 3-2'
  },
  { season: '2005-06', year: 2006, champion: '巴塞罗那', runnerUp: '阿森纳', score: '2-1' },
  { season: '2006-07', year: 2007, champion: 'AC米兰', runnerUp: '利物浦', score: '2-1' },
  {
    season: '2007-08',
    year: 2008,
    champion: '曼联',
    runnerUp: '切尔西',
    score: '1-1',
    note: '点球 6-5'
  },
  { season: '2008-09', year: 2009, champion: '巴塞罗那', runnerUp: '曼联', score: '2-0' },
  { season: '2009-10', year: 2010, champion: '国际米兰', runnerUp: '拜仁慕尼黑', score: '2-0' },
  { season: '2010-11', year: 2011, champion: '巴塞罗那', runnerUp: '曼联', score: '3-1' },
  {
    season: '2011-12',
    year: 2012,
    champion: '切尔西',
    runnerUp: '拜仁慕尼黑',
    score: '1-1',
    note: '点球 4-3'
  },
  { season: '2012-13', year: 2013, champion: '拜仁慕尼黑', runnerUp: '多特蒙德', score: '2-1' },
  {
    season: '2013-14',
    year: 2014,
    champion: '皇家马德里',
    runnerUp: '马德里竞技',
    score: '4-1',
    note: '加时'
  },
  { season: '2014-15', year: 2015, champion: '巴塞罗那', runnerUp: '尤文图斯', score: '3-1' },
  {
    season: '2015-16',
    year: 2016,
    champion: '皇家马德里',
    runnerUp: '马德里竞技',
    score: '1-1',
    note: '点球 5-3'
  },
  { season: '2016-17', year: 2017, champion: '皇家马德里', runnerUp: '尤文图斯', score: '4-1' },
  { season: '2017-18', year: 2018, champion: '皇家马德里', runnerUp: '利物浦', score: '3-1' },
  { season: '2018-19', year: 2019, champion: '利物浦', runnerUp: '托特纳姆热刺', score: '2-0' },
  { season: '2019-20', year: 2020, champion: '拜仁慕尼黑', runnerUp: '巴黎圣日耳曼', score: '1-0' },
  { season: '2020-21', year: 2021, champion: '切尔西', runnerUp: '曼城', score: '1-0' },
  { season: '2021-22', year: 2022, champion: '皇家马德里', runnerUp: '利物浦', score: '1-0' },
  { season: '2022-23', year: 2023, champion: '曼城', runnerUp: '国际米兰', score: '1-0' },
  { season: '2023-24', year: 2024, champion: '皇家马德里', runnerUp: '多特蒙德', score: '2-0' },
  { season: '2024-25', year: 2025, champion: '巴黎圣日耳曼', runnerUp: '国际米兰', score: '5-0' },
  {
    season: '2025-26',
    year: 2026,
    champion: '巴黎圣日耳曼',
    runnerUp: '阿森纳',
    score: '1-1',
    note: '点球 4-3'
  }
];

export const UEFA_CHAMPIONS_LEAGUE_RESULTS: ChampionsLeagueResult[] = UCL_RESULTS.map((result) => ({
  ...result,
  name: `${result.season}赛季`,
  host: UCL_HOSTS[result.year],
  quantity: 2,
  mode: CompetitionEditionStandingMode.FINAL_ONLY,
  remark: `决赛${result.champion} ${result.score} ${result.runnerUp}${
    result.note ? `，${result.note}` : ''
  }。`
}));

export function buildUefaChampionsLeagueStandings(result: ChampionsLeagueResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}

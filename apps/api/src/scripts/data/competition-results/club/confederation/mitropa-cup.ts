import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type MitropaCupResult = {
  name: string;
  year: number;
  champion: string;
  runnerUp?: string;
  score: string;
  note?: string;
};

export const MITROPA_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'MITROPA_CUP',
  name: '米特罗帕杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'custom',
  sources: [
    {
      label: 'Mitropa Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Mitropa_Cup',
      remark: '用于核对赛事沿革、停办状态和历届冠军、亚军。'
    },
    {
      label: 'Mitropa Cup - RSSSF',
      url: 'https://www.rsssf.org/tablesm/mit.html',
      remark: '用于核对 1927-1992 年各届决赛、冠军和亚军；1960 为国家汇总口径，不纳入俱乐部结果。'
    },
    {
      label: 'Mitropa Cup Winners - C.F. Classics',
      url: 'https://www.cfclassics.co/cups/europe/mitropacup/winners/mitropa-cup-winners.htm',
      remark: '用于交叉核对 1970s-1990s 后期届次冠亚军。'
    }
  ],
  lastVerifiedAt: '2026-08-27',
  notes: [
    '米特罗帕杯创办于 1927 年，是中欧俱乐部跨国杯赛；战前地位较高，战后尤其 1980 年代含金量下降。',
    '项目统一按俱乐部其他二级杯赛处理，只记录最终冠军和亚军，不按欧足联洲际赛事计分。',
    '1940 年赛事未完成、1960 年为国家汇总排名、1979 年未举办，均不创建俱乐部届次。',
    '1932 年 Bologna by default，RSSSF 未列亚军，本系统只记录博洛尼亚冠军。',
    '本文件只录入当前数据库已有俱乐部的 standings；库外冠军或亚军对应位置留空，后续用户补 UID 后再补。'
  ]
};

export const MITROPA_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '476', name: '布拉格斯巴达', englishName: 'Sparta Prague', countryName: '捷克' },
  { uid: '155', name: '维也纳快速', englishName: 'Rapid Vienna', countryName: '奥地利' },
  { uid: '1055', name: '费伦茨瓦罗斯', englishName: 'Ferencváros', countryName: '匈牙利' },
  { uid: '1064', name: '新佩斯', englishName: 'Újpest', countryName: '匈牙利' },
  { uid: '1111', name: '博洛尼亚', englishName: 'Bologna', countryName: '意大利' },
  { uid: '152', name: '奥地利维也纳', englishName: 'Austria Vienna', countryName: '奥地利' },
  { uid: '1135', name: '国际米兰', englishName: 'Inter Milan', countryName: '意大利' },
  { uid: '1140', name: '拉齐奥', englishName: 'Lazio', countryName: '意大利' },
  { uid: '1060', name: 'MTK布达佩斯', englishName: 'MTK Budapest', countryName: '匈牙利' },
  {
    uid: '1955',
    name: '贝尔格莱德红星',
    englishName: 'Red Star Belgrade',
    countryName: '塞尔维亚'
  },
  { uid: '1129', name: '佛罗伦萨', englishName: 'Fiorentina', countryName: '意大利' },
  { uid: '1622', name: '布拉迪斯拉发', englishName: 'Slovan Bratislava', countryName: '斯洛伐克' },
  {
    uid: '16046867',
    name: '奥地利萨尔茨堡',
    englishName: 'Austria Salzburg',
    countryName: '奥地利'
  },
  {
    uid: '1300163',
    name: '莫斯塔尔维列兹',
    englishName: 'Velez Mostar',
    countryName: '波斯尼亚和黑塞哥维那'
  },
  {
    uid: '1952',
    name: '贝尔格莱德游击',
    englishName: 'Partizan Belgrade',
    countryName: '塞尔维亚'
  },
  { uid: '1178', name: '乌迪内斯', englishName: 'Udinese', countryName: '意大利' },
  { uid: '1099', name: 'AC米兰', englishName: 'AC Milan', countryName: '意大利' },
  { uid: '1106', name: '亚特兰大', englishName: 'Atalanta', countryName: '意大利' },
  { uid: '2215', name: '比萨', englishName: 'Pisa', countryName: '意大利' },
  { uid: '1110', name: '巴里', englishName: 'Bari', countryName: '意大利' },
  { uid: '1132', name: '热那亚', englishName: 'Genoa', countryName: '意大利' },
  { uid: '1174', name: '都灵', englishName: 'Torino', countryName: '意大利' }
].map((club) => ({
  ...club,
  confederationCode: 'UEFA',
  visibleInCatalog: false
}));

const SEEDED_CLUB_NAMES = new Set(MITROPA_CUP_REQUIRED_CLUBS.map((club) => club.name));

const RAW_MITROPA_CUP_RESULTS: MitropaCupResult[] = [
  {
    name: '1927',
    year: 1927,
    champion: '布拉格斯巴达',
    score: '总比分 7-4',
    runnerUp: '维也纳快速'
  },
  {
    name: '1928',
    year: 1928,
    champion: '费伦茨瓦罗斯',
    score: '总比分 10-6',
    runnerUp: '维也纳快速'
  },
  { name: '1929', year: 1929, champion: '新佩斯', score: '总比分 7-3', runnerUp: '布拉格斯拉维亚' },
  {
    name: '1930',
    year: 1930,
    champion: '维也纳快速',
    score: '总比分 4-3',
    runnerUp: '布拉格斯巴达'
  },
  { name: '1931', year: 1931, champion: '维也纳第一', score: '总比分 5-3', runnerUp: '维也纳竞技' },
  {
    name: '1932',
    year: 1932,
    champion: '博洛尼亚',
    score: '默认获胜',
    note: 'RSSSF 标注 AGC Bologna by default，未列亚军。'
  },
  { name: '1933', year: 1933, champion: '奥地利维也纳', score: '总比分 4-3', runnerUp: '国际米兰' },
  {
    name: '1934',
    year: 1934,
    champion: '博洛尼亚',
    score: '总比分 7-4',
    runnerUp: '维也纳阿德米拉'
  },
  {
    name: '1935',
    year: 1935,
    champion: '布拉格斯巴达',
    score: '总比分 4-2',
    runnerUp: '费伦茨瓦罗斯'
  },
  {
    name: '1936',
    year: 1936,
    champion: '奥地利维也纳',
    score: '总比分 1-0',
    runnerUp: '布拉格斯巴达'
  },
  { name: '1937', year: 1937, champion: '费伦茨瓦罗斯', score: '总比分 9-6', runnerUp: '拉齐奥' },
  {
    name: '1938',
    year: 1938,
    champion: '布拉格斯拉维亚',
    score: '总比分 4-2',
    runnerUp: '费伦茨瓦罗斯'
  },
  { name: '1939', year: 1939, champion: '新佩斯', score: '总比分 6-3', runnerUp: '费伦茨瓦罗斯' },
  { name: '1951', year: 1951, champion: '维也纳快速', score: '3-2', runnerUp: '维也纳阿德米拉' },
  {
    name: '1955',
    year: 1955,
    champion: 'MTK布达佩斯',
    score: '总比分 8-1',
    runnerUp: '布拉格杜克拉'
  },
  { name: '1956', year: 1956, champion: '瓦萨斯', score: '重赛 9-2', runnerUp: '维也纳快速' },
  { name: '1957', year: 1957, champion: '瓦萨斯', score: '总比分 5-2', runnerUp: '伏伊伏丁那' },
  {
    name: '1958',
    year: 1958,
    champion: '贝尔格莱德红星',
    score: '总比分 7-3',
    runnerUp: '鲁达赫维兹达布尔诺'
  },
  {
    name: '1959',
    year: 1959,
    champion: '布达佩斯洪维德',
    score: '总比分 6-5',
    runnerUp: 'MTK布达佩斯'
  },
  { name: '1961', year: 1961, champion: '博洛尼亚', score: '总比分 5-2', runnerUp: '尼特拉斯洛万' },
  { name: '1962', year: 1962, champion: '瓦萨斯', score: '总比分 6-3', runnerUp: '博洛尼亚' },
  { name: '1963', year: 1963, champion: 'MTK布达佩斯', score: '总比分 3-2', runnerUp: '瓦萨斯' },
  {
    name: '1964',
    year: 1964,
    champion: '布拉格斯巴达',
    score: '总比分 2-0',
    runnerUp: '布拉迪斯拉发'
  },
  { name: '1965', year: 1965, champion: '瓦萨斯', score: '1-0', runnerUp: '佛罗伦萨' },
  { name: '1966', year: 1966, champion: '佛罗伦萨', score: '1-0', runnerUp: '特伦钦统一' },
  { name: '1967', year: 1967, champion: '特尔纳瓦斯巴达', score: '总比分 5-4', runnerUp: '新佩斯' },
  {
    name: '1968',
    year: 1968,
    champion: '贝尔格莱德红星',
    score: '总比分 4-2',
    runnerUp: '特尔纳瓦斯巴达'
  },
  {
    name: '1969',
    year: 1969,
    champion: '布拉迪斯拉发国际',
    score: '总比分 4-1',
    runnerUp: '特普利采'
  },
  {
    name: '1970',
    year: 1970,
    champion: '瓦萨斯',
    score: '总比分 5-3',
    runnerUp: '布拉迪斯拉发国际'
  },
  { name: '1971', year: 1971, champion: '切利克泽尼察', score: '3-1', runnerUp: '奥地利萨尔茨堡' },
  { name: '1972', year: 1972, champion: '切利克泽尼察', score: '总比分 1-0', runnerUp: '佛罗伦萨' },
  {
    name: '1973',
    year: 1973,
    champion: '陶陶巴尼奥',
    score: '总比分 4-2',
    runnerUp: '切利克泽尼察'
  },
  { name: '1974', year: 1974, champion: '陶陶巴尼奥', score: '总比分 5-2', runnerUp: '日利纳' },
  {
    name: '1975',
    year: 1975,
    champion: '瓦克因斯布鲁克',
    score: '总比分 5-2',
    runnerUp: '布达佩斯洪维德'
  },
  {
    name: '1976',
    year: 1976,
    champion: '瓦克因斯布鲁克',
    score: '3-1',
    runnerUp: '莫斯塔尔维列兹'
  },
  { name: '1977', year: 1977, champion: '伏伊伏丁那', score: '小组赛制', runnerUp: '瓦萨斯' },
  {
    name: '1978',
    year: 1978,
    champion: '贝尔格莱德游击',
    score: '1-0',
    runnerUp: '布达佩斯洪维德'
  },
  {
    name: '1979-80',
    year: 1980,
    champion: '乌迪内斯',
    score: '小组赛制',
    runnerUp: '切利克泽尼察'
  },
  {
    name: '1980-81',
    year: 1981,
    champion: '塔特兰普雷绍夫',
    score: '小组赛制',
    runnerUp: '切佩尔'
  },
  { name: '1981-82', year: 1982, champion: 'AC米兰', score: '小组赛制', runnerUp: '维特科维采' },
  { name: '1982-83', year: 1983, champion: '瓦萨斯', score: '小组赛制', runnerUp: '日利纳' },
  {
    name: '1983-84',
    year: 1984,
    champion: '艾森施塔特',
    score: '小组赛制',
    runnerUp: '普里什蒂纳'
  },
  {
    name: '1984-85',
    year: 1985,
    champion: '伊斯克拉布戈伊诺',
    score: '小组赛制',
    runnerUp: '亚特兰大'
  },
  { name: '1985-86', year: 1986, champion: '比萨', score: '2-0', runnerUp: '德布勒森' },
  { name: '1986-87', year: 1987, champion: '阿斯科利', score: '1-0', runnerUp: '布拉格波希米亚人' },
  { name: '1987-88', year: 1988, champion: '比萨', score: '3-0', runnerUp: '瓦茨伊佐' },
  {
    name: '1988-89',
    year: 1989,
    champion: '俄斯特拉发巴尼克',
    score: '总比分 4-2',
    runnerUp: '博洛尼亚'
  },
  { name: '1990', year: 1990, champion: '巴里', score: '1-0', runnerUp: '热那亚' },
  { name: '1991', year: 1991, champion: '都灵', score: '2-1', runnerUp: '比萨' },
  {
    name: '1992',
    year: 1992,
    champion: '巴尼亚卢卡战士',
    score: '小组赛制',
    runnerUp: '布达佩斯铁路工人'
  }
];

function buildStanding(
  placement: CompetitionStandingPlacement,
  standingOrder: number,
  clubName?: string
): SeedStanding | null {
  if (!clubName || !SEEDED_CLUB_NAMES.has(clubName)) return null;

  return {
    placement,
    standingOrder,
    clubName
  };
}

export const MITROPA_CUP_RESULTS = RAW_MITROPA_CUP_RESULTS.map((result) => ({
  name: result.name,
  year: result.year,
  season: result.name,
  host: '中欧',
  quantity: 2,
  mode: CompetitionEditionStandingMode.FINAL_ONLY,
  standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
  externalUrl: `https://en.wikipedia.org/wiki/${result.name.replace('-', '%E2%80%93')}_Mitropa_Cup`,
  remark:
    result.note ??
    `米特罗帕杯${result.name}届，${result.champion}${result.score ? `，${result.score}` : ''}。`,
  champion: result.champion,
  runnerUp: result.runnerUp
}));

export function buildMitropaCupStandings(result: (typeof MITROPA_CUP_RESULTS)[number]) {
  return [
    buildStanding(CompetitionStandingPlacement.CHAMPION, 1, result.champion),
    buildStanding(CompetitionStandingPlacement.RUNNER_UP, 2, result.runnerUp)
  ].filter((standing): standing is SeedStanding => Boolean(standing));
}

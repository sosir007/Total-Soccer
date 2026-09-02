import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ENGLAND_FIRST_DIVISION';

type RawOldFirstDivisionRow = {
  season: string;
  year: number;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
};

function buildWikipediaSeasonUrl(title: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, '_')}`;
}

function formatWikiSeasonLabel(season: string) {
  return season.replace(/-/g, '–');
}

export const ENGLAND_FIRST_DIVISION_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '英格兰足球甲级联赛（旧英甲）',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Football League First Division - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Football_League_First_Division',
      remark: '用于核对旧英甲的赛事基础资料、英文名、停办状态和历史背景。'
    },
    {
      label: 'List of English football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_English_football_champions',
      remark: '用于核对 1888-89 至 1991-92 各赛季最终前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-01',
  notes: [
    '历史队名统一映射到现有俱乐部实体；本补录只写入数据库里已存在的俱乐部 standings。',
    '旧英甲自 1888-89 赛季起举办，1991-92 赛季结束后由英超接替，不并入英超文件。',
    '本文件不录入库外球队；如果以后补齐历史实体，可再回填对应名次。'
  ]
};

export const ENGLAND_FIRST_DIVISION_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '700', name: '普雷斯顿', visibleInCatalog: false },
  { uid: '603', name: '阿斯顿维拉', visibleInCatalog: false },
  { uid: '740', name: '狼队', visibleInCatalog: false },
  { uid: '650', name: '埃弗顿', visibleInCatalog: false },
  { uid: '612', name: '布莱克本流浪者', shortName: '布莱克本', visibleInCatalog: false },
  { uid: '693', name: '诺茨郡', visibleInCatalog: false },
  { uid: '722', name: '桑德兰', visibleInCatalog: false },
  { uid: '614', name: '博尔顿', visibleInCatalog: false },
  { uid: '645', name: '德比郡', visibleInCatalog: false },
  { uid: '708', name: '谢菲尔德联', visibleInCatalog: false },
  { uid: '676', name: '利物浦', visibleInCatalog: false },
  { uid: '688', name: '纽卡斯尔联', visibleInCatalog: false },
  { uid: '709', name: '谢菲尔德星期三', visibleInCatalog: false },
  { uid: '679', name: '曼城', visibleInCatalog: false },
  { uid: '680', name: '曼联', visibleInCatalog: false },
  { uid: '619', name: '布里斯托尔城', visibleInCatalog: false },
  { uid: '685', name: '米德尔斯堡', visibleInCatalog: false },
  { uid: '694', name: '奥尔德姆竞技', shortName: '奥尔德姆', visibleInCatalog: false },
  { uid: '734', name: '西布朗维奇', visibleInCatalog: false },
  { uid: '622', name: '伯恩利', visibleInCatalog: false },
  { uid: '630', name: '切尔西', visibleInCatalog: false },
  { uid: '728', name: '托特纳姆热刺', visibleInCatalog: false },
  { uid: '664', name: '哈德斯菲尔德', visibleInCatalog: false },
  { uid: '625', name: '卡迪夫城', visibleInCatalog: false },
  { uid: '673', name: '莱斯特城', visibleInCatalog: false },
  { uid: '602', name: '阿森纳', visibleInCatalog: false },
  { uid: '628', name: '查尔顿竞技', shortName: '查尔顿', visibleInCatalog: false },
  { uid: '699', name: '朴茨茅斯', visibleInCatalog: false },
  { uid: '691', name: '诺维奇城', shortName: '诺维奇', visibleInCatalog: false },
  { uid: '701', name: '女王公园巡游者', visibleInCatalog: false },
  { uid: '713', name: '南安普顿', visibleInCatalog: false },
  { uid: '667', name: '伊普斯维奇', visibleInCatalog: false },
  { uid: '692', name: '诺丁汉森林', visibleInCatalog: false },
  { uid: '732', name: '沃特福德', visibleInCatalog: false },
  { uid: '642', name: '水晶宫', visibleInCatalog: false },
  { uid: '671', name: '利兹联', visibleInCatalog: false },
  { uid: '613', name: '布莱克浦', visibleInCatalog: false },
  { uid: '609', name: '伯明翰城', visibleInCatalog: false },
  { uid: '735', name: '西汉姆联', visibleInCatalog: false }
];

const RAW_OLD_FIRST_DIVISION_ROWS: RawOldFirstDivisionRow[] = [
  {
    season: '1888-89',
    year: 1889,
    champion: '普雷斯顿',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '狼队'
  },
  {
    season: '1889-90',
    year: 1890,
    champion: '普雷斯顿',
    runnerUp: '埃弗顿',
    thirdPlace: '布莱克本流浪者'
  },
  { season: '1890-91', year: 1891, champion: '埃弗顿', runnerUp: '普雷斯顿', thirdPlace: '诺茨郡' },
  { season: '1891-92', year: 1892, champion: '桑德兰', runnerUp: '普雷斯顿', thirdPlace: '博尔顿' },
  { season: '1892-93', year: 1893, champion: '桑德兰', runnerUp: '普雷斯顿', thirdPlace: '埃弗顿' },
  {
    season: '1893-94',
    year: 1894,
    champion: '阿斯顿维拉',
    runnerUp: '桑德兰',
    thirdPlace: '德比郡'
  },
  {
    season: '1894-95',
    year: 1895,
    champion: '桑德兰',
    runnerUp: '埃弗顿',
    thirdPlace: '阿斯顿维拉'
  },
  {
    season: '1895-96',
    year: 1896,
    champion: '阿斯顿维拉',
    runnerUp: '德比郡',
    thirdPlace: '埃弗顿'
  },
  {
    season: '1896-97',
    year: 1897,
    champion: '阿斯顿维拉',
    runnerUp: '谢菲尔德联',
    thirdPlace: '德比郡'
  },
  { season: '1897-98', year: 1898, champion: '谢菲尔德联', runnerUp: '桑德兰', thirdPlace: '狼队' },
  {
    season: '1898-99',
    year: 1899,
    champion: '阿斯顿维拉',
    runnerUp: '利物浦',
    thirdPlace: '伯恩利'
  },
  {
    season: '1899-1900',
    year: 1900,
    champion: '阿斯顿维拉',
    runnerUp: '谢菲尔德联',
    thirdPlace: '桑德兰'
  },
  { season: '1900-01', year: 1901, champion: '利物浦', runnerUp: '桑德兰', thirdPlace: '诺茨郡' },
  {
    season: '1901-02',
    year: 1902,
    champion: '桑德兰',
    runnerUp: '埃弗顿',
    thirdPlace: '纽卡斯尔联'
  },
  {
    season: '1902-03',
    year: 1903,
    champion: '谢菲尔德星期三',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '桑德兰'
  },
  {
    season: '1903-04',
    year: 1904,
    champion: '谢菲尔德星期三',
    runnerUp: '曼城',
    thirdPlace: '埃弗顿'
  },
  { season: '1904-05', year: 1905, champion: '纽卡斯尔联', runnerUp: '埃弗顿', thirdPlace: '曼城' },
  {
    season: '1905-06',
    year: 1906,
    champion: '利物浦',
    runnerUp: '普雷斯顿',
    thirdPlace: '谢菲尔德星期三'
  },
  {
    season: '1906-07',
    year: 1907,
    champion: '纽卡斯尔联',
    runnerUp: '布里斯托尔城',
    thirdPlace: '埃弗顿'
  },
  { season: '1907-08', year: 1908, champion: '曼联', runnerUp: '阿斯顿维拉', thirdPlace: '曼城' },
  {
    season: '1908-09',
    year: 1909,
    champion: '纽卡斯尔联',
    runnerUp: '埃弗顿',
    thirdPlace: '桑德兰'
  },
  {
    season: '1909-10',
    year: 1910,
    champion: '阿斯顿维拉',
    runnerUp: '利物浦',
    thirdPlace: '布莱克本流浪者'
  },
  { season: '1910-11', year: 1911, champion: '曼联', runnerUp: '阿斯顿维拉', thirdPlace: '桑德兰' },
  {
    season: '1911-12',
    year: 1912,
    champion: '布莱克本流浪者',
    runnerUp: '埃弗顿',
    thirdPlace: '纽卡斯尔联'
  },
  {
    season: '1912-13',
    year: 1913,
    champion: '桑德兰',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '谢菲尔德星期三'
  },
  {
    season: '1913-14',
    year: 1914,
    champion: '布莱克本流浪者',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '米德尔斯堡'
  },
  {
    season: '1914-15',
    year: 1915,
    champion: '埃弗顿',
    runnerUp: '奥尔德姆竞技',
    thirdPlace: '布莱克本流浪者'
  },
  {
    season: '1919-20',
    year: 1920,
    champion: '西布朗维奇',
    runnerUp: '伯恩利',
    thirdPlace: '切尔西'
  },
  { season: '1920-21', year: 1921, champion: '伯恩利', runnerUp: '曼城', thirdPlace: '博尔顿' },
  {
    season: '1921-22',
    year: 1922,
    champion: '利物浦',
    runnerUp: '托特纳姆热刺',
    thirdPlace: '伯恩利'
  },
  {
    season: '1922-23',
    year: 1923,
    champion: '利物浦',
    runnerUp: '桑德兰',
    thirdPlace: '哈德斯菲尔德'
  },
  {
    season: '1923-24',
    year: 1924,
    champion: '哈德斯菲尔德',
    runnerUp: '卡迪夫城',
    thirdPlace: '桑德兰'
  },
  {
    season: '1924-25',
    year: 1925,
    champion: '哈德斯菲尔德',
    runnerUp: '西布朗维奇',
    thirdPlace: '博尔顿'
  },
  {
    season: '1925-26',
    year: 1926,
    champion: '阿森纳',
    runnerUp: '桑德兰',
    thirdPlace: '哈德斯菲尔德'
  },
  {
    season: '1926-27',
    year: 1927,
    champion: '纽卡斯尔联',
    runnerUp: '哈德斯菲尔德',
    thirdPlace: '桑德兰'
  },
  {
    season: '1927-28',
    year: 1928,
    champion: '埃弗顿',
    runnerUp: '哈德斯菲尔德',
    thirdPlace: '莱斯特城'
  },
  {
    season: '1928-29',
    year: 1929,
    champion: '谢菲尔德星期三',
    runnerUp: '莱斯特城',
    thirdPlace: '阿斯顿维拉'
  },
  {
    season: '1929-30',
    year: 1930,
    champion: '谢菲尔德星期三',
    runnerUp: '德比郡',
    thirdPlace: '曼城'
  },
  {
    season: '1930-31',
    year: 1931,
    champion: '阿森纳',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '谢菲尔德星期三'
  },
  {
    season: '1931-32',
    year: 1932,
    champion: '埃弗顿',
    runnerUp: '阿森纳',
    thirdPlace: '谢菲尔德星期三'
  },
  {
    season: '1932-33',
    year: 1933,
    champion: '阿森纳',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '谢菲尔德星期三'
  },
  {
    season: '1933-34',
    year: 1934,
    champion: '阿森纳',
    runnerUp: '哈德斯菲尔德',
    thirdPlace: '托特纳姆热刺'
  },
  {
    season: '1934-35',
    year: 1935,
    champion: '阿森纳',
    runnerUp: '桑德兰',
    thirdPlace: '谢菲尔德星期三'
  },
  {
    season: '1935-36',
    year: 1936,
    champion: '桑德兰',
    runnerUp: '德比郡',
    thirdPlace: '哈德斯菲尔德'
  },
  { season: '1936-37', year: 1937, champion: '曼城', runnerUp: '查尔顿竞技', thirdPlace: '阿森纳' },
  { season: '1937-38', year: 1938, champion: '阿森纳', runnerUp: '狼队', thirdPlace: '普雷斯顿' },
  { season: '1938-39', year: 1939, champion: '埃弗顿', runnerUp: '狼队', thirdPlace: '查尔顿竞技' },
  { season: '1946-47', year: 1947, champion: '利物浦', runnerUp: '曼联', thirdPlace: '狼队' },
  { season: '1947-48', year: 1948, champion: '阿森纳', runnerUp: '曼联', thirdPlace: '伯恩利' },
  { season: '1948-49', year: 1949, champion: '朴茨茅斯', runnerUp: '曼联', thirdPlace: '德比郡' },
  { season: '1949-50', year: 1950, champion: '朴茨茅斯', runnerUp: '狼队', thirdPlace: '桑德兰' },
  {
    season: '1950-51',
    year: 1951,
    champion: '托特纳姆热刺',
    runnerUp: '曼联',
    thirdPlace: '布莱克浦'
  },
  {
    season: '1951-52',
    year: 1952,
    champion: '曼联',
    runnerUp: '托特纳姆热刺',
    thirdPlace: '阿森纳'
  },
  { season: '1952-53', year: 1953, champion: '阿森纳', runnerUp: '普雷斯顿', thirdPlace: '狼队' },
  {
    season: '1953-54',
    year: 1954,
    champion: '狼队',
    runnerUp: '西布朗维奇',
    thirdPlace: '哈德斯菲尔德'
  },
  { season: '1954-55', year: 1955, champion: '切尔西', runnerUp: '狼队', thirdPlace: '朴茨茅斯' },
  { season: '1955-56', year: 1956, champion: '曼联', runnerUp: '布莱克浦', thirdPlace: '狼队' },
  {
    season: '1956-57',
    year: 1957,
    champion: '曼联',
    runnerUp: '托特纳姆热刺',
    thirdPlace: '普雷斯顿'
  },
  {
    season: '1957-58',
    year: 1958,
    champion: '狼队',
    runnerUp: '普雷斯顿',
    thirdPlace: '托特纳姆热刺'
  },
  { season: '1958-59', year: 1959, champion: '狼队', runnerUp: '曼联', thirdPlace: '阿森纳' },
  {
    season: '1959-60',
    year: 1960,
    champion: '伯恩利',
    runnerUp: '狼队',
    thirdPlace: '托特纳姆热刺'
  },
  {
    season: '1960-61',
    year: 1961,
    champion: '托特纳姆热刺',
    runnerUp: '谢菲尔德星期三',
    thirdPlace: '狼队'
  },
  {
    season: '1961-62',
    year: 1962,
    champion: '伊普斯维奇',
    runnerUp: '伯恩利',
    thirdPlace: '托特纳姆热刺'
  },
  {
    season: '1962-63',
    year: 1963,
    champion: '埃弗顿',
    runnerUp: '托特纳姆热刺',
    thirdPlace: '伯恩利'
  },
  { season: '1963-64', year: 1964, champion: '利物浦', runnerUp: '曼联', thirdPlace: '埃弗顿' },
  { season: '1964-65', year: 1965, champion: '曼联', runnerUp: '利兹联', thirdPlace: '切尔西' },
  { season: '1965-66', year: 1966, champion: '利物浦', runnerUp: '利兹联', thirdPlace: '伯恩利' },
  {
    season: '1966-67',
    year: 1967,
    champion: '曼联',
    runnerUp: '诺丁汉森林',
    thirdPlace: '托特纳姆热刺'
  },
  { season: '1967-68', year: 1968, champion: '曼城', runnerUp: '曼联', thirdPlace: '利物浦' },
  { season: '1968-69', year: 1969, champion: '利兹联', runnerUp: '利物浦', thirdPlace: '埃弗顿' },
  { season: '1969-70', year: 1970, champion: '埃弗顿', runnerUp: '利兹联', thirdPlace: '切尔西' },
  {
    season: '1970-71',
    year: 1971,
    champion: '阿森纳',
    runnerUp: '利兹联',
    thirdPlace: '托特纳姆热刺'
  },
  { season: '1971-72', year: 1972, champion: '德比郡', runnerUp: '利兹联', thirdPlace: '利物浦' },
  { season: '1972-73', year: 1973, champion: '利物浦', runnerUp: '阿森纳', thirdPlace: '利兹联' },
  { season: '1973-74', year: 1974, champion: '利兹联', runnerUp: '利物浦', thirdPlace: '德比郡' },
  {
    season: '1974-75',
    year: 1975,
    champion: '德比郡',
    runnerUp: '利物浦',
    thirdPlace: '伊普斯维奇'
  },
  {
    season: '1975-76',
    year: 1976,
    champion: '利物浦',
    runnerUp: '女王公园巡游者',
    thirdPlace: '曼联'
  },
  { season: '1976-77', year: 1977, champion: '利物浦', runnerUp: '曼城', thirdPlace: '伊普斯维奇' },
  {
    season: '1977-78',
    year: 1978,
    champion: '诺丁汉森林',
    runnerUp: '利物浦',
    thirdPlace: '埃弗顿'
  },
  {
    season: '1978-79',
    year: 1979,
    champion: '利物浦',
    runnerUp: '诺丁汉森林',
    thirdPlace: '西布朗维奇'
  },
  { season: '1979-80', year: 1980, champion: '利物浦', runnerUp: '曼联', thirdPlace: '伊普斯维奇' },
  {
    season: '1980-81',
    year: 1981,
    champion: '阿斯顿维拉',
    runnerUp: '伊普斯维奇',
    thirdPlace: '阿森纳'
  },
  { season: '1981-82', year: 1982, champion: '利物浦', runnerUp: '伊普斯维奇', thirdPlace: '曼联' },
  { season: '1982-83', year: 1983, champion: '利物浦', runnerUp: '沃特福德', thirdPlace: '曼联' },
  {
    season: '1983-84',
    year: 1984,
    champion: '利物浦',
    runnerUp: '南安普顿',
    thirdPlace: '诺丁汉森林'
  },
  {
    season: '1984-85',
    year: 1985,
    champion: '埃弗顿',
    runnerUp: '利物浦',
    thirdPlace: '托特纳姆热刺'
  },
  { season: '1985-86', year: 1986, champion: '利物浦', runnerUp: '埃弗顿', thirdPlace: '西汉姆联' },
  {
    season: '1986-87',
    year: 1987,
    champion: '埃弗顿',
    runnerUp: '利物浦',
    thirdPlace: '托特纳姆热刺'
  },
  { season: '1987-88', year: 1988, champion: '利物浦', runnerUp: '曼联', thirdPlace: '诺丁汉森林' },
  {
    season: '1988-89',
    year: 1989,
    champion: '阿森纳',
    runnerUp: '利物浦',
    thirdPlace: '诺丁汉森林'
  },
  {
    season: '1989-90',
    year: 1990,
    champion: '利物浦',
    runnerUp: '阿斯顿维拉',
    thirdPlace: '托特纳姆热刺'
  },
  { season: '1990-91', year: 1991, champion: '阿森纳', runnerUp: '利物浦', thirdPlace: '水晶宫' },
  {
    season: '1991-92',
    year: 1992,
    champion: '利兹联',
    runnerUp: '曼联',
    thirdPlace: '谢菲尔德星期三'
  }
];

function buildTopThreeClubStandings(input: {
  champion: string;
  runnerUp: string;
  thirdPlace: string;
}) {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: input.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: input.runnerUp },
    { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: input.thirdPlace }
  ];
}

export const ENGLAND_FIRST_DIVISION_PATCHES: SeedCompetitionPatch[] =
  RAW_OLD_FIRST_DIVISION_ROWS.map((row) => ({
    competitionCode: COMPETITION_CODE,
    name: row.season,
    year: row.year,
    season: row.season,
    externalUrl: buildWikipediaSeasonUrl(`${formatWikiSeasonLabel(row.season)} Football League`),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: buildTopThreeClubStandings({
      champion: row.champion,
      runnerUp: row.runnerUp,
      thirdPlace: row.thirdPlace
    })
  }));

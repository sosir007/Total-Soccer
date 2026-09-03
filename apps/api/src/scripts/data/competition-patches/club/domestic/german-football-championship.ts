import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type {
  SeedClub,
  SeedCompetitionPatch,
  SeedStanding
} from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'GERMAN_FOOTBALL_CHAMPIONSHIP';
const SOURCE_URL = 'https://en.wikipedia.org/wiki/List_of_German_football_champions';

type GermanFootballChampionshipRow = {
  year: number;
  champion?: string;
  runnerUp?: string;
  remark?: string;
};

export const GERMAN_FOOTBALL_CHAMPIONSHIP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '德国足球锦标赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of German football champions - Wikipedia',
      url: SOURCE_URL,
      remark: '用于核对 1903-1963 德国全国冠军决赛阶段的冠亚军、停赛年份和无冠军年份。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本补录只写入当前数据库已存在的俱乐部 standings，库外历史球队对应名次直接过滤，不创建新俱乐部。',
    '本赛事为德甲成立前德国全国冠军决赛阶段，不并入德国足球甲级联赛。',
    '1904、1922 为无冠军年份；1915-1919、1945-1947 为停赛年份；均不生成荣誉 standings。',
    '东德足球冠军不纳入本赛事，后续如需录入应单独建东德足球高级联赛或对应赛事。',
    'VfB Leipzig 按历史延续口径映射到库内“莱比锡火车头”；FV Saarbrücken / 1. FC Saarbrücken 映射到库内“萨尔布吕肯”。',
    '系统按德国国内一级联赛处理，但每届 standingMode 用 FINAL_ONLY，只录可确认决赛冠亚军。'
  ]
};

export const GERMAN_FOOTBALL_CHAMPIONSHIP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '3600077',
    name: '莱比锡火车头',
    englishName: '1. FC Lokomotive Leipzig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '899',
    name: '纽伦堡',
    englishName: 'Nurnberg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '947',
    name: '汉堡',
    englishName: 'Hamburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2247',
    name: '柏林赫塔',
    englishName: 'Hertha Berlin',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '927',
    name: '汉诺威96',
    englishName: 'Hannover 96',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '931',
    name: '卡尔斯鲁厄',
    englishName: 'Karlsruher SC',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '932',
    name: '奥芬巴赫踢球者',
    englishName: 'Kickers Offenbach',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '955',
    name: '慕尼黑1860',
    englishName: 'TSV 1860 Munich',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '915',
    name: '拜仁慕尼黑',
    englishName: 'Bayern Munich',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '912',
    name: '法兰克福',
    englishName: 'Eintracht Frankfurt',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '921',
    name: '杜塞尔多夫',
    englishName: 'Fortuna Dusseldorf',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '920',
    name: '沙尔克04',
    englishName: 'Schalke 04',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '960',
    name: '斯图加特',
    englishName: 'Stuttgart',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '155',
    name: '维也纳快速',
    englishName: 'Rapid Vienna',
    countryName: '奥地利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '949',
    name: '萨尔布吕肯',
    englishName: 'Saarbrucken',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '945',
    name: '凯泽斯劳滕',
    englishName: 'Kaiserslautern',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '907',
    name: '多特蒙德',
    englishName: 'Borussia Dortmund',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '935',
    name: '普鲁士明斯特',
    englishName: 'Preussen Munster',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '916',
    name: '科隆',
    englishName: 'Cologne',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const RAW_GERMAN_FOOTBALL_CHAMPIONSHIP_ROWS: GermanFootballChampionshipRow[] = [
  { year: 1903, champion: '莱比锡火车头' },
  { year: 1906, champion: '莱比锡火车头' },
  {
    year: 1909,
    champion: '卡尔斯鲁厄',
    remark: '冠军 Phönix Karlsruhe 按历史前身口径映射到库内“卡尔斯鲁厄”。'
  },
  { year: 1911, runnerUp: '莱比锡火车头' },
  { year: 1913, champion: '莱比锡火车头' },
  { year: 1914, runnerUp: '莱比锡火车头' },
  { year: 1920, champion: '纽伦堡' },
  { year: 1921, champion: '纽伦堡' },
  { year: 1923, champion: '汉堡' },
  { year: 1924, champion: '纽伦堡', runnerUp: '汉堡' },
  { year: 1925, champion: '纽伦堡' },
  { year: 1926, runnerUp: '柏林赫塔' },
  { year: 1927, champion: '纽伦堡', runnerUp: '柏林赫塔' },
  { year: 1928, champion: '汉堡', runnerUp: '柏林赫塔' },
  { year: 1929, runnerUp: '柏林赫塔' },
  { year: 1930, champion: '柏林赫塔' },
  { year: 1931, champion: '柏林赫塔', runnerUp: '慕尼黑1860' },
  { year: 1932, champion: '拜仁慕尼黑', runnerUp: '法兰克福' },
  { year: 1933, champion: '杜塞尔多夫', runnerUp: '沙尔克04' },
  { year: 1934, champion: '沙尔克04', runnerUp: '纽伦堡' },
  { year: 1935, champion: '沙尔克04', runnerUp: '斯图加特' },
  { year: 1936, champion: '纽伦堡', runnerUp: '杜塞尔多夫' },
  { year: 1937, champion: '沙尔克04', runnerUp: '纽伦堡' },
  { year: 1938, champion: '汉诺威96', runnerUp: '沙尔克04' },
  { year: 1939, champion: '沙尔克04' },
  { year: 1940, champion: '沙尔克04' },
  {
    year: 1941,
    champion: '维也纳快速',
    runnerUp: '沙尔克04',
    remark: '维也纳快速为奥地利俱乐部，因当时奥地利被并入德国而参加德国锦标赛。'
  },
  { year: 1942, champion: '沙尔克04' },
  { year: 1943, runnerUp: '萨尔布吕肯' },
  { year: 1948, champion: '纽伦堡', runnerUp: '凯泽斯劳滕' },
  { year: 1949, runnerUp: '多特蒙德' },
  { year: 1950, champion: '斯图加特', runnerUp: '奥芬巴赫踢球者' },
  { year: 1951, champion: '凯泽斯劳滕', runnerUp: '普鲁士明斯特' },
  { year: 1952, champion: '斯图加特', runnerUp: '萨尔布吕肯' },
  { year: 1953, champion: '凯泽斯劳滕', runnerUp: '斯图加特' },
  { year: 1954, champion: '汉诺威96', runnerUp: '凯泽斯劳滕' },
  { year: 1955, runnerUp: '凯泽斯劳滕' },
  { year: 1956, champion: '多特蒙德', runnerUp: '卡尔斯鲁厄' },
  { year: 1957, champion: '多特蒙德', runnerUp: '汉堡' },
  { year: 1958, champion: '沙尔克04', runnerUp: '汉堡' },
  { year: 1959, champion: '法兰克福', runnerUp: '奥芬巴赫踢球者' },
  { year: 1960, champion: '汉堡', runnerUp: '科隆' },
  { year: 1961, champion: '纽伦堡', runnerUp: '多特蒙德' },
  { year: 1962, champion: '科隆', runnerUp: '纽伦堡' },
  { year: 1963, champion: '多特蒙德', runnerUp: '科隆' }
];

function buildStandings(row: GermanFootballChampionshipRow) {
  const standings: SeedStanding[] = [];

  if (row.champion) {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: row.champion
    });
  }

  if (row.runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: row.runnerUp
    });
  }

  return standings;
}

export const GERMAN_FOOTBALL_CHAMPIONSHIP_PATCHES: SeedCompetitionPatch[] =
  RAW_GERMAN_FOOTBALL_CHAMPIONSHIP_ROWS.map((row) => ({
    competitionCode: COMPETITION_CODE,
    name: String(row.year),
    year: row.year,
    season: String(row.year),
    externalUrl: SOURCE_URL,
    remark: row.remark,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(row)
  }));

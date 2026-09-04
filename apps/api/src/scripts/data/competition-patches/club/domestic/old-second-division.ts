import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ENGLAND_SECOND_DIVISION';

function buildWikipediaSeasonUrl(title: string) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, '_')}`;
}

function formatWikiSeasonLabel(season: string) {
  return season.replace(/-/g, '–');
}

export const ENGLAND_SECOND_DIVISION_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '英格兰足球乙级联赛（旧英乙）',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Football League Second Division - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Football_League_Second_Division',
      remark: '用于核对旧英乙赛事基础资料、英文名、停办状态和历史背景。'
    },
    {
      label: 'England historical league tables - RSSSF',
      url: 'https://www.rsssf.org/engpaul/FLA/',
      remark: '用于逐季核对 1892-93 至 1991-92 的最终积分榜前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '旧英乙为 1892-93 至 1991-92 的英格兰第二级别联赛，1992-93 起由英格兰足球冠军联赛体系接替。',
    '本补录只写入当前数据库已存在的俱乐部 standings，库外球队自动过滤，不创建新俱乐部。',
    'Newton Heath 按历史名称映射到库内曼联；Wimbledon 按当前项目实体映射到 AFC温布尔登。',
    '早期赛季若前三里有库外球队，则仅保留可映射的库内俱乐部名次。'
  ]
};

export const ENGLAND_SECOND_DIVISION_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: COMPETITION_CODE,
    name: '1892-93',
    year: 1893,
    season: '1892-93',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1892-93')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '谢菲尔德联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1893-94',
    year: 1894,
    season: '1893-94',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1893-94')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '利物浦' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '诺茨郡' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1894-95',
    year: 1895,
    season: '1894-95',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1894-95')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伯里' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '诺茨郡' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '曼联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1895-96',
    year: 1896,
    season: '1895-96',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1895-96')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '利物浦' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '格林斯比镇' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1896-97',
    year: 1897,
    season: '1896-97',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1896-97')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '诺茨郡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '曼联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '格林斯比镇' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1897-98',
    year: 1898,
    season: '1897-98',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1897-98')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伯恩利' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '纽卡斯尔联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '曼城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1898-99',
    year: 1899,
    season: '1898-99',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1898-99')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '莱斯特城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1899-1900',
    year: 1900,
    season: '1899-1900',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1899-1900')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '谢菲尔德星期三' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博尔顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯明翰城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1900-01',
    year: 1901,
    season: '1900-01',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1900-01')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '格林斯比镇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯恩利' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1901-02',
    year: 1902,
    season: '1901-02',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1901-02')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '西布朗维奇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '米德尔斯堡' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '普雷斯顿' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1902-03',
    year: 1903,
    season: '1902-03',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1902-03')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '阿森纳' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1903-04',
    year: 1904,
    season: '1903-04',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1903-04')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '普雷斯顿' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '阿森纳' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '曼联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1904-05',
    year: 1905,
    season: '1904-05',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1904-05')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '利物浦' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博尔顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '曼联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1905-06',
    year: 1906,
    season: '1905-06',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1905-06')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '布里斯托尔城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '曼联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '切尔西' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1906-07',
    year: 1907,
    season: '1906-07',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1906-07')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '诺丁汉森林' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '切尔西' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '莱斯特城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1907-08',
    year: 1908,
    season: '1907-08',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1907-08')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '布拉德福德城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '莱斯特城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '奥尔德姆竞技' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1908-09',
    year: 1909,
    season: '1908-09',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1908-09')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '博尔顿' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '托特纳姆热刺' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '西布朗维奇' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1909-10',
    year: 1910,
    season: '1909-10',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1909-10')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '奥尔德姆竞技' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '赫尔城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1910-11',
    year: 1911,
    season: '1910-11',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1910-11')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '西布朗维奇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博尔顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '切尔西' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1911-12',
    year: 1912,
    season: '1911-12',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1911-12')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '德比郡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '切尔西' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯恩利' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1912-13',
    year: 1913,
    season: '1912-13',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1912-13')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '普雷斯顿' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯恩利' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯明翰城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1913-14',
    year: 1914,
    season: '1913-14',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1913-14')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '诺茨郡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '布拉德福德公园大道' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '阿森纳' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1914-15',
    year: 1915,
    season: '1914-15',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1914-15')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '德比郡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '普雷斯顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '巴恩斯利' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1919-20',
    year: 1920,
    season: '1919-20',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1919-20')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '托特纳姆热刺' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '哈德斯菲尔德' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯明翰城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1920-21',
    year: 1921,
    season: '1920-21',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1920-21')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '卡迪夫城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '布里斯托尔城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1921-22',
    year: 1922,
    season: '1921-22',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1921-22')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '诺丁汉森林' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '斯托克城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '巴恩斯利' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1922-23',
    year: 1923,
    season: '1922-23',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1922-23')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '诺茨郡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '西汉姆联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '莱斯特城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1923-24',
    year: 1924,
    season: '1923-24',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1923-24')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '利兹联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯里' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '德比郡' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1924-25',
    year: 1925,
    season: '1924-25',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1924-25')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '莱斯特城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '曼联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '德比郡' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1925-26',
    year: 1926,
    season: '1925-26',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1925-26')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '谢菲尔德星期三' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '德比郡' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '切尔西' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1926-27',
    year: 1927,
    season: '1926-27',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1926-27')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '米德尔斯堡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '朴茨茅斯' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '曼城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1927-28',
    year: 1928,
    season: '1927-28',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1927-28')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '利兹联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '切尔西' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1928-29',
    year: 1929,
    season: '1928-29',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1928-29')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '米德尔斯堡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '格林斯比镇' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '布拉德福德公园大道' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1929-30',
    year: 1930,
    season: '1929-30',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1929-30')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '布莱克浦' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '切尔西' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '奥尔德姆竞技' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1930-31',
    year: 1931,
    season: '1930-31',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1930-31')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '埃弗顿' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '西布朗维奇' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '托特纳姆热刺' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1931-32',
    year: 1932,
    season: '1931-32',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1931-32')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '狼队' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '利兹联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '斯托克城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1932-33',
    year: 1933,
    season: '1932-33',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1932-33')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '斯托克城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '托特纳姆热刺' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '富勒姆' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1933-34',
    year: 1934,
    season: '1933-34',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1933-34')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '格林斯比镇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '普雷斯顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '博尔顿' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1934-35',
    year: 1935,
    season: '1934-35',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1934-35')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '布伦特福德' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '博尔顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '西汉姆联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1935-36',
    year: 1936,
    season: '1935-36',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1935-36')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '查尔顿竞技' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '谢菲尔德联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1936-37',
    year: 1937,
    season: '1936-37',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1936-37')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '莱斯特城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '布莱克浦' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯里' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1937-38',
    year: 1938,
    season: '1937-38',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1937-38')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '阿斯顿维拉' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '曼联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '谢菲尔德联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1938-39',
    year: 1939,
    season: '1938-39',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1938-39')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '布莱克本流浪者' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '谢菲尔德联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '谢菲尔德星期三' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1946-47',
    year: 1947,
    season: '1946-47',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1946-47')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯恩利' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯明翰城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1947-48',
    year: 1948,
    season: '1947-48',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1947-48')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '纽卡斯尔联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '南安普顿' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1948-49',
    year: 1949,
    season: '1948-49',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1948-49')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '富勒姆' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '西布朗维奇' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '南安普顿' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1949-50',
    year: 1950,
    season: '1949-50',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1949-50')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '托特纳姆热刺' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '谢菲尔德星期三' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '谢菲尔德联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1950-51',
    year: 1951,
    season: '1950-51',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1950-51')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '普雷斯顿' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '卡迪夫城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1951-52',
    year: 1952,
    season: '1951-52',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1951-52')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '谢菲尔德星期三' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '卡迪夫城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯明翰城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1952-53',
    year: 1953,
    season: '1952-53',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1952-53')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '谢菲尔德联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '哈德斯菲尔德' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '卢顿镇' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1953-54',
    year: 1954,
    season: '1953-54',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1953-54')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '莱斯特城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '埃弗顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '布莱克本流浪者' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1954-55',
    year: 1955,
    season: '1954-55',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1954-55')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '卢顿镇' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '罗瑟汉姆' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1955-56',
    year: 1956,
    season: '1955-56',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1955-56')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '谢菲尔德星期三' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '利兹联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '利物浦' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1956-57',
    year: 1957,
    season: '1956-57',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1956-57')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '莱斯特城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '诺丁汉森林' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '利物浦' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1957-58',
    year: 1958,
    season: '1957-58',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1957-58')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '西汉姆联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '布莱克本流浪者' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '查尔顿竞技' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1958-59',
    year: 1959,
    season: '1958-59',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1958-59')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '谢菲尔德星期三' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '富勒姆' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '谢菲尔德联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1959-60',
    year: 1960,
    season: '1959-60',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1959-60')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '阿斯顿维拉' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '卡迪夫城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '利物浦' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1960-61',
    year: 1961,
    season: '1960-61',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1960-61')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伊普斯维奇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '谢菲尔德联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '利物浦' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1961-62',
    year: 1962,
    season: '1961-62',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1961-62')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '利物浦' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '莱顿东方' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '桑德兰' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1962-63',
    year: 1963,
    season: '1962-63',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1962-63')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '斯托克城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '切尔西' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '桑德兰' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1963-64',
    year: 1964,
    season: '1963-64',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1963-64')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '利兹联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '桑德兰' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '普雷斯顿' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1964-65',
    year: 1965,
    season: '1964-65',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1964-65')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '纽卡斯尔联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '北安普顿镇' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '博尔顿' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1965-66',
    year: 1966,
    season: '1965-66',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1965-66')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '南安普顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '考文垂' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1966-67',
    year: 1967,
    season: '1966-67',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1966-67')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '考文垂' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '狼队' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '卡莱尔联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1967-68',
    year: 1968,
    season: '1967-68',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1967-68')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伊普斯维奇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '女王公园巡游者' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '布莱克浦' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1968-69',
    year: 1969,
    season: '1968-69',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1968-69')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '德比郡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '水晶宫' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '查尔顿竞技' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1969-70',
    year: 1970,
    season: '1969-70',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1969-70')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '哈德斯菲尔德' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '布莱克浦' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '莱斯特城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1970-71',
    year: 1971,
    season: '1970-71',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1970-71')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '莱斯特城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '谢菲尔德联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '卡迪夫城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1971-72',
    year: 1972,
    season: '1971-72',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1971-72')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '诺维奇城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '米尔沃尔' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1972-73',
    year: 1973,
    season: '1972-73',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1972-73')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伯恩利' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '女王公园巡游者' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '阿斯顿维拉' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1973-74',
    year: 1974,
    season: '1973-74',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1973-74')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '米德尔斯堡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '卢顿镇' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '卡莱尔联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1974-75',
    year: 1975,
    season: '1974-75',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1974-75')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '曼联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '阿斯顿维拉' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '诺维奇城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1975-76',
    year: 1976,
    season: '1975-76',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1975-76')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '桑德兰' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '布里斯托尔城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '西布朗维奇' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1976-77',
    year: 1977,
    season: '1976-77',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1976-77')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '狼队' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '切尔西' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '诺丁汉森林' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1977-78',
    year: 1978,
    season: '1977-78',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1977-78')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '博尔顿' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '南安普顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '托特纳姆热刺' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1978-79',
    year: 1979,
    season: '1978-79',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1978-79')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '水晶宫' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '布莱顿' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '斯托克城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1979-80',
    year: 1980,
    season: '1979-80',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1979-80')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '莱斯特城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '桑德兰' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '伯明翰城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1980-81',
    year: 1981,
    season: '1980-81',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1980-81')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '西汉姆联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '诺茨郡' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '斯旺西城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1981-82',
    year: 1982,
    season: '1981-82',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1981-82')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '卢顿镇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '沃特福德' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '诺维奇城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1982-83',
    year: 1983,
    season: '1982-83',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1982-83')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '女王公园巡游者' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '狼队' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '莱斯特城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1983-84',
    year: 1984,
    season: '1983-84',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1983-84')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '切尔西' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '谢菲尔德星期三' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '纽卡斯尔联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1984-85',
    year: 1985,
    season: '1984-85',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1984-85')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '牛津联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '伯明翰城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '曼城' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1985-86',
    year: 1986,
    season: '1985-86',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1985-86')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '诺维奇城' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '查尔顿竞技' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: 'AFC温布尔登' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1986-87',
    year: 1987,
    season: '1986-87',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1986-87')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '德比郡' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '朴茨茅斯' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '奥尔德姆竞技' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1987-88',
    year: 1988,
    season: '1987-88',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1987-88')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '米尔沃尔' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '阿斯顿维拉' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '米德尔斯堡' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1988-89',
    year: 1989,
    season: '1988-89',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1988-89')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '切尔西' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '曼城' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '水晶宫' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1989-90',
    year: 1990,
    season: '1989-90',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1989-90')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '利兹联' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '谢菲尔德联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '纽卡斯尔联' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1990-91',
    year: 1991,
    season: '1990-91',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1990-91')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '奥尔德姆竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '西汉姆联' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '谢菲尔德星期三' }
    ]
  },
  {
    competitionCode: COMPETITION_CODE,
    name: '1991-92',
    year: 1992,
    season: '1991-92',
    externalUrl: buildWikipediaSeasonUrl(
      `${formatWikiSeasonLabel('1991-92')} Football League Second Division`
    ),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '伊普斯维奇' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '米德尔斯堡' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: '德比郡' }
    ]
  }
];

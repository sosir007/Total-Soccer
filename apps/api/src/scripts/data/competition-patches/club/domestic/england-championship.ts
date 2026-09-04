import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ENGLAND_CHAMPIONSHIP';

type RawChampionshipRow = {
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

function getWikiSeasonTitle(row: RawChampionshipRow) {
  const label = formatWikiSeasonLabel(row.season);

  if (row.year <= 2004) {
    return `${label} Football League First Division`;
  }

  if (row.year <= 2016) {
    return `${label} Football League Championship`;
  }

  return `${label} EFL Championship`;
}

export const ENGLAND_CHAMPIONSHIP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '英格兰足球冠军联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'EFL Championship - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/EFL_Championship',
      remark: '用于核对赛事基础资料、现行状态和历史沿革。'
    },
    {
      label: 'List of winners of the EFL Championship and predecessors - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_winners_of_the_EFL_Championship_and_predecessors',
      remark: '用于核对 1992-93 至 2024-25 英格兰第二级别联赛最终前三名。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本补录只写入当前数据库已存在的俱乐部 standings，不创建新俱乐部。',
    '1992-93 至 2003-04 为 Football League First Division，但这是英超成立后的第二级联赛，不等同于顶级旧英甲。',
    '2004-05 起为 Football League Championship / EFL Championship。',
    '按最终联赛前三名录入冠军、亚军、季军，不把升级附加赛冠军当作季军。'
  ]
};

export const ENGLAND_CHAMPIONSHIP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '688',
    name: '纽卡斯尔联',
    englishName: 'Newcastle United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '735',
    name: '西汉姆联',
    englishName: 'West Ham United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '699',
    name: '朴茨茅斯',
    englishName: 'Portsmouth',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '642',
    name: '水晶宫',
    englishName: 'Crystal Palace',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '692',
    name: '诺丁汉森林',
    englishName: 'Nottingham Forest',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '673',
    name: '莱斯特城',
    englishName: 'Leicester City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '685',
    name: '米德尔斯堡',
    englishName: 'Middlesbrough',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '702',
    name: '雷丁',
    englishName: 'Reading',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '614',
    name: '博尔顿',
    englishName: 'Bolton Wanderers',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '722',
    name: '桑德兰',
    englishName: 'Sunderland AFC',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '645',
    name: '德比郡',
    englishName: 'Derby County',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '606',
    name: '巴恩斯利',
    englishName: 'Barnsley',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '740',
    name: '狼队',
    englishName: 'Wolverhampton Wanderers',
    alias: '伍尔弗汉普顿流浪者',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '616',
    name: '布拉德福德城',
    englishName: 'Bradford City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '667',
    name: '伊普斯维奇',
    englishName: 'Ipswich Town',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '628',
    name: '查尔顿竞技',
    englishName: 'Charlton Athletic',
    shortName: '查尔顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '679',
    name: '曼城',
    englishName: 'Manchester City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '654',
    name: '富勒姆',
    englishName: 'Fulham',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '612',
    name: '布莱克本流浪者',
    englishName: 'Blackburn Rovers',
    shortName: '布莱克本',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '734',
    name: '西布朗维奇',
    englishName: 'West Bromwich Albion',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '708',
    name: '谢菲尔德联',
    englishName: 'Sheffield United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '691',
    name: '诺维奇城',
    englishName: 'Norwich City',
    shortName: '诺维奇',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '737',
    name: '维冈竞技',
    englishName: 'Wigan Athletic',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '732',
    name: '沃特福德',
    englishName: 'Watford',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '609',
    name: '伯明翰城',
    englishName: 'Birmingham City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '721',
    name: '斯托克城',
    englishName: 'Stoke City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '665',
    name: '赫尔城',
    englishName: 'Hull City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '701',
    name: '女王公园巡游者',
    englishName: 'Queens Park Rangers',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '724',
    name: '斯旺西城',
    englishName: 'Swansea City',
    shortName: '斯旺西',
    countryName: '威尔士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '713',
    name: '南安普顿',
    englishName: 'Southampton',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '625',
    name: '卡迪夫城',
    englishName: 'Cardiff City',
    countryName: '威尔士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '622',
    name: '伯恩利',
    englishName: 'Burnley',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '600',
    name: '伯恩茅斯',
    englishName: 'Bournemouth',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '618',
    name: '布莱顿',
    englishName: 'Brighton & Hove Albion',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '671',
    name: '利兹联',
    englishName: 'Leeds United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '617',
    name: '布伦特福德',
    englishName: 'Brentford',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '664',
    name: '哈德斯菲尔德',
    englishName: 'Huddersfield Town',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '677',
    name: '卢顿镇',
    englishName: 'Luton Town',
    shortName: '卢顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const RAW_CHAMPIONSHIP_ROWS: RawChampionshipRow[] = [
  {
    season: '1992-93',
    year: 1993,
    champion: '纽卡斯尔联',
    runnerUp: '西汉姆联',
    thirdPlace: '朴茨茅斯'
  },
  {
    season: '1993-94',
    year: 1994,
    champion: '水晶宫',
    runnerUp: '诺丁汉森林',
    thirdPlace: '米尔沃尔'
  },
  { season: '1994-95', year: 1995, champion: '米德尔斯堡', runnerUp: '雷丁', thirdPlace: '博尔顿' },
  { season: '1995-96', year: 1996, champion: '桑德兰', runnerUp: '德比郡', thirdPlace: '水晶宫' },
  { season: '1996-97', year: 1997, champion: '博尔顿', runnerUp: '巴恩斯利', thirdPlace: '狼队' },
  {
    season: '1997-98',
    year: 1998,
    champion: '诺丁汉森林',
    runnerUp: '米德尔斯堡',
    thirdPlace: '桑德兰'
  },
  {
    season: '1998-99',
    year: 1999,
    champion: '桑德兰',
    runnerUp: '布拉德福德城',
    thirdPlace: '伊普斯维奇'
  },
  {
    season: '1999-2000',
    year: 2000,
    champion: '查尔顿竞技',
    runnerUp: '曼城',
    thirdPlace: '伊普斯维奇'
  },
  {
    season: '2000-01',
    year: 2001,
    champion: '富勒姆',
    runnerUp: '布莱克本流浪者',
    thirdPlace: '博尔顿'
  },
  { season: '2001-02', year: 2002, champion: '曼城', runnerUp: '西布朗维奇', thirdPlace: '狼队' },
  {
    season: '2002-03',
    year: 2003,
    champion: '朴茨茅斯',
    runnerUp: '莱斯特城',
    thirdPlace: '谢菲尔德联'
  },
  {
    season: '2003-04',
    year: 2004,
    champion: '诺维奇城',
    runnerUp: '西布朗维奇',
    thirdPlace: '桑德兰'
  },
  {
    season: '2004-05',
    year: 2005,
    champion: '桑德兰',
    runnerUp: '维冈竞技',
    thirdPlace: '伊普斯维奇'
  },
  {
    season: '2005-06',
    year: 2006,
    champion: '雷丁',
    runnerUp: '谢菲尔德联',
    thirdPlace: '沃特福德'
  },
  { season: '2006-07', year: 2007, champion: '桑德兰', runnerUp: '伯明翰城', thirdPlace: '德比郡' },
  {
    season: '2007-08',
    year: 2008,
    champion: '西布朗维奇',
    runnerUp: '斯托克城',
    thirdPlace: '赫尔城'
  },
  {
    season: '2008-09',
    year: 2009,
    champion: '狼队',
    runnerUp: '伯明翰城',
    thirdPlace: '谢菲尔德联'
  },
  {
    season: '2009-10',
    year: 2010,
    champion: '纽卡斯尔联',
    runnerUp: '西布朗维奇',
    thirdPlace: '诺丁汉森林'
  },
  {
    season: '2010-11',
    year: 2011,
    champion: '女王公园巡游者',
    runnerUp: '诺维奇城',
    thirdPlace: '斯旺西城'
  },
  { season: '2011-12', year: 2012, champion: '雷丁', runnerUp: '南安普顿', thirdPlace: '西汉姆联' },
  {
    season: '2012-13',
    year: 2013,
    champion: '卡迪夫城',
    runnerUp: '赫尔城',
    thirdPlace: '沃特福德'
  },
  { season: '2013-14', year: 2014, champion: '莱斯特城', runnerUp: '伯恩利', thirdPlace: '德比郡' },
  {
    season: '2014-15',
    year: 2015,
    champion: '伯恩茅斯',
    runnerUp: '沃特福德',
    thirdPlace: '诺维奇城'
  },
  {
    season: '2015-16',
    year: 2016,
    champion: '伯恩利',
    runnerUp: '米德尔斯堡',
    thirdPlace: '布莱顿'
  },
  { season: '2016-17', year: 2017, champion: '纽卡斯尔联', runnerUp: '布莱顿', thirdPlace: '雷丁' },
  { season: '2017-18', year: 2018, champion: '狼队', runnerUp: '卡迪夫城', thirdPlace: '富勒姆' },
  {
    season: '2018-19',
    year: 2019,
    champion: '诺维奇城',
    runnerUp: '谢菲尔德联',
    thirdPlace: '利兹联'
  },
  {
    season: '2019-20',
    year: 2020,
    champion: '利兹联',
    runnerUp: '西布朗维奇',
    thirdPlace: '布伦特福德'
  },
  {
    season: '2020-21',
    year: 2021,
    champion: '诺维奇城',
    runnerUp: '沃特福德',
    thirdPlace: '布伦特福德'
  },
  {
    season: '2021-22',
    year: 2022,
    champion: '富勒姆',
    runnerUp: '伯恩茅斯',
    thirdPlace: '哈德斯菲尔德'
  },
  {
    season: '2022-23',
    year: 2023,
    champion: '伯恩利',
    runnerUp: '谢菲尔德联',
    thirdPlace: '卢顿镇'
  },
  {
    season: '2023-24',
    year: 2024,
    champion: '莱斯特城',
    runnerUp: '伊普斯维奇',
    thirdPlace: '利兹联'
  },
  {
    season: '2024-25',
    year: 2025,
    champion: '利兹联',
    runnerUp: '伯恩利',
    thirdPlace: '谢菲尔德联'
  }
];

export const ENGLAND_CHAMPIONSHIP_PATCHES: SeedCompetitionPatch[] = RAW_CHAMPIONSHIP_ROWS.map(
  (row) => ({
    competitionCode: COMPETITION_CODE,
    name: row.season,
    year: row.year,
    season: row.season,
    externalUrl: buildWikipediaSeasonUrl(getWikiSeasonTitle(row)),
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: row.champion },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: row.runnerUp },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: row.thirdPlace }
    ]
  })
);

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type MlsSupportersShieldResult = SeedEdition & {
  champion: string | null;
  runnerUp?: string | null;
  thirdPlace?: string | null;
  skippedChampion?: string;
  skippedRunnerUp?: string;
  skippedThirdPlace?: string;
};

type RawMlsSupportersShieldResult = {
  year: number;
  champion: string | null;
  runnerUp?: string | null;
  thirdPlace?: string | null;
  skippedChampion?: string;
  skippedRunnerUp?: string;
  skippedThirdPlace?: string;
  points?: number;
};

export const MLS_SUPPORTERS_SHIELD_METADATA: CompetitionDataMetadata = {
  competitionCode: 'MLS_SUPPORTERS_SHIELD',
  name: '美国大联盟支持者盾',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supporters Shield - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supporters%27_Shield',
      remark: '用于核对支持者盾的赛事性质、历史沿革和历届获奖者。'
    },
    {
      label: 'Supporters Shield Foundation - The Winners',
      url: 'https://supportersshield.org/the-winners/',
      remark: '用于核对支持者盾官方获奖者列表。'
    },
    {
      label: 'Philadelphia Union win 2025 Supporters Shield - MLSSoccer.com',
      url: 'https://www.mlssoccer.com/news/philadelphia-union-win-2025-supporters-shield',
      remark: '用于核对 2025 年费城联合获得支持者盾。'
    },
    {
      label: 'The MLS Pulse standings archive',
      url: 'https://themlspulse.com/standings',
      remark: '用于核对 2003-2025 年 MLS 常规赛总榜排名。'
    },
    {
      label: 'RSSSF USA season archive',
      url: 'https://www.rsssf.org/usadave/mls.html',
      remark: '用于核对 1996-2002 年 MLS 常规赛分区表和总榜口径。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '支持者盾授予 MLS 常规赛总体战绩最佳球队，系统按美国国内二级联赛处理。',
    '本轮按支持者盾冠军、亚军、季军录入；库外俱乐部对应名次跳过，不补录替代球队。',
    '1996、1997、2001、2007 等年涉及的部分库外俱乐部当前未入库，对应名次按现有俱乐部保留，其余跳过。',
    '美国国内系数使用其他国家默认 0.5，命中 CLUB_DOMESTIC_LEVEL_2_LEAGUE 后冠军实际 1 分。'
  ]
};

export const MLS_SUPPORTERS_SHIELD_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1913',
    name: '华盛顿联',
    englishName: 'D.C. United',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1907',
    name: '洛杉矶银河',
    englishName: 'LA Galaxy',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '72023746',
    name: '堪萨斯城体育',
    englishName: 'Sporting Kansas City',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '108893',
    name: '芝加哥火焰',
    englishName: 'Chicago Fire',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1904',
    name: '哥伦布机员',
    englishName: 'Columbus Crew',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1910',
    name: '圣何塞地震',
    englishName: 'San Jose Earthquakes',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72000160',
    name: '纽约红牛',
    englishName: 'New York Red Bulls',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72014006',
    name: '西雅图海湾人',
    englishName: 'Seattle Sounders FC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1905',
    name: '达拉斯FC',
    englishName: 'FC Dallas',
    shortName: '达拉斯',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    forceName: true
  },
  {
    uid: '72000789',
    name: '多伦多FC',
    englishName: 'Toronto FC',
    shortName: '多伦多',
    countryName: '加拿大',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72049313',
    name: '洛杉矶FC',
    englishName: 'Los Angeles FC',
    shortName: '洛杉矶',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72019000',
    name: '费城联合',
    englishName: 'Philadelphia Union',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1909',
    name: '新英格兰革命',
    englishName: 'New England Revolution',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '20041327',
    name: '辛辛那提FC',
    englishName: 'FC Cincinnati',
    shortName: '辛辛那提',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72052048',
    name: '迈阿密国际',
    englishName: 'Inter Miami CF',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72000112',
    name: '休斯敦迪纳摩',
    englishName: 'Houston Dynamo',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '980543',
    name: '皇家盐湖城',
    englishName: 'Real Salt Lake',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '975489',
    name: '波特兰伐木者',
    englishName: 'Portland Timbers',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '4400014',
    name: '温哥华白浪',
    englishName: 'Vancouver Whitecaps FC',
    countryName: '加拿大',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1903',
    name: '科罗拉多急流',
    englishName: 'Colorado Rapids',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72041885',
    name: '纽约城FC',
    englishName: 'New York City FC',
    shortName: '纽约城',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    forceName: true
  },
  {
    uid: '72047296',
    name: '亚特兰大联',
    englishName: 'Atlanta United FC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '2000152066',
    name: '蒙特利尔CF',
    englishName: 'CF Montréal',
    shortName: '蒙特利尔',
    countryName: '加拿大',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '72014193',
    name: '奥兰多城',
    englishName: 'Orlando City SC',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const RAW_RESULTS: RawMlsSupportersShieldResult[] = [
  {
    year: 1996,
    champion: null,
    runnerUp: '洛杉矶银河',
    thirdPlace: '华盛顿联',
    skippedChampion: '坦帕湾叛变者',
    points: 58
  },
  {
    year: 1997,
    champion: '华盛顿联',
    runnerUp: '堪萨斯城体育',
    skippedThirdPlace: '坦帕湾叛变者',
    points: 55
  },
  {
    year: 1998,
    champion: '洛杉矶银河',
    runnerUp: '华盛顿联',
    thirdPlace: '芝加哥火焰',
    points: 68
  },
  {
    year: 1999,
    champion: '华盛顿联',
    runnerUp: '洛杉矶银河',
    thirdPlace: '达拉斯FC',
    points: 57
  },
  {
    year: 2000,
    champion: '堪萨斯城体育',
    runnerUp: '芝加哥火焰',
    thirdPlace: '纽约红牛',
    points: 57
  },
  {
    year: 2001,
    champion: null,
    runnerUp: '芝加哥火焰',
    thirdPlace: '洛杉矶银河',
    skippedChampion: '迈阿密融合',
    points: 53
  },
  {
    year: 2002,
    champion: '洛杉矶银河',
    runnerUp: '圣何塞地震',
    thirdPlace: '达拉斯FC',
    points: 51
  },
  {
    year: 2003,
    champion: '芝加哥火焰',
    runnerUp: '圣何塞地震',
    thirdPlace: '新英格兰革命',
    points: 53
  },
  {
    year: 2004,
    champion: '哥伦布机员',
    runnerUp: '堪萨斯城体育',
    thirdPlace: '洛杉矶银河',
    points: 49
  },
  {
    year: 2005,
    champion: '圣何塞地震',
    runnerUp: '新英格兰革命',
    thirdPlace: '华盛顿联',
    points: 64
  },
  {
    year: 2006,
    champion: '华盛顿联',
    runnerUp: '达拉斯FC',
    thirdPlace: '新英格兰革命',
    points: 55
  },
  {
    year: 2007,
    champion: '华盛顿联',
    skippedRunnerUp: 'Chivas USA',
    thirdPlace: '休斯敦迪纳摩',
    points: 55
  },
  {
    year: 2008,
    champion: '哥伦布机员',
    runnerUp: '休斯敦迪纳摩',
    thirdPlace: '芝加哥火焰',
    points: 57
  },
  {
    year: 2009,
    champion: '哥伦布机员',
    runnerUp: '洛杉矶银河',
    thirdPlace: '休斯敦迪纳摩',
    points: 49
  },
  {
    year: 2010,
    champion: '洛杉矶银河',
    runnerUp: '皇家盐湖城',
    thirdPlace: '纽约红牛',
    points: 59
  },
  {
    year: 2011,
    champion: '洛杉矶银河',
    runnerUp: '西雅图海湾人',
    thirdPlace: '皇家盐湖城',
    points: 67
  },
  {
    year: 2012,
    champion: '圣何塞地震',
    runnerUp: '堪萨斯城体育',
    thirdPlace: '华盛顿联',
    points: 66
  },
  {
    year: 2013,
    champion: '纽约红牛',
    runnerUp: '堪萨斯城体育',
    thirdPlace: '波特兰伐木者',
    points: 59
  },
  {
    year: 2014,
    champion: '西雅图海湾人',
    runnerUp: '洛杉矶银河',
    thirdPlace: '华盛顿联',
    points: 64
  },
  {
    year: 2015,
    champion: '纽约红牛',
    runnerUp: '达拉斯FC',
    thirdPlace: '温哥华白浪',
    points: 60
  },
  {
    year: 2016,
    champion: '达拉斯FC',
    runnerUp: '科罗拉多急流',
    thirdPlace: '纽约红牛',
    points: 60
  },
  {
    year: 2017,
    champion: '多伦多FC',
    runnerUp: '纽约城FC',
    thirdPlace: '芝加哥火焰',
    points: 69
  },
  {
    year: 2018,
    champion: '纽约红牛',
    runnerUp: '亚特兰大联',
    thirdPlace: '堪萨斯城体育',
    points: 71
  },
  {
    year: 2019,
    champion: '洛杉矶FC',
    runnerUp: '纽约城FC',
    thirdPlace: '亚特兰大联',
    points: 72
  },
  {
    year: 2020,
    champion: '费城联合',
    runnerUp: '多伦多FC',
    thirdPlace: '哥伦布机员',
    points: 47
  },
  {
    year: 2021,
    champion: '新英格兰革命',
    runnerUp: '科罗拉多急流',
    thirdPlace: '西雅图海湾人',
    points: 73
  },
  {
    year: 2022,
    champion: '洛杉矶FC',
    runnerUp: '费城联合',
    thirdPlace: '蒙特利尔CF',
    points: 67
  },
  {
    year: 2023,
    champion: '辛辛那提FC',
    runnerUp: '奥兰多城',
    thirdPlace: '哥伦布机员',
    points: 69
  },
  {
    year: 2024,
    champion: '迈阿密国际',
    runnerUp: '哥伦布机员',
    thirdPlace: '洛杉矶FC',
    points: 74
  },
  {
    year: 2025,
    champion: '费城联合',
    runnerUp: '辛辛那提FC',
    thirdPlace: '迈阿密国际',
    points: 66
  }
];

export const MLS_SUPPORTERS_SHIELD_RESULTS: MlsSupportersShieldResult[] = RAW_RESULTS.map(
  (result) => {
    return {
      ...result,
      name: `${result.year}年`,
      season: String(result.year),
      host: 'MLS常规赛',
      quantity: 1,
      mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      remark: buildResultRemark(result)
    };
  }
);

function buildResultRemark(result: RawMlsSupportersShieldResult) {
  const championText = formatPlacementText('冠军', result.champion, result.skippedChampion);
  const runnerUpText = formatPlacementText('亚军', result.runnerUp, result.skippedRunnerUp);
  const thirdPlaceText = formatPlacementText('季军', result.thirdPlace, result.skippedThirdPlace);
  const pointsText = result.points ? `；支持者盾冠军 ${result.points} 分` : '';

  return `MLS 常规赛总榜前三：${[championText, runnerUpText, thirdPlaceText].join('，')}${pointsText}。`;
}

function formatPlacementText(label: string, clubName?: string | null, skippedClub?: string) {
  if (clubName) {
    return `${label} ${clubName}`;
  }

  return `${label} ${skippedClub}（俱乐部当前未入库，本轮不创建 standings）`;
}

export function buildMlsSupportersShieldStandings(
  result: MlsSupportersShieldResult
): SeedStanding[] {
  const standings: SeedStanding[] = [];

  if (result.champion) {
    standings.push({ placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion });
  }

  if (result.runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: result.runnerUp
    });
  }

  if (result.thirdPlace) {
    standings.push({
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      clubName: result.thirdPlace
    });
  }

  return standings;
}

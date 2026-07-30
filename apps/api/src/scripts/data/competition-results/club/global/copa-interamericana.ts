import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CopaInteramericanaResult = SeedEdition & {
  champion?: string;
  runnerUp?: string;
  rawChampion: string;
  rawRunnerUp: string;
};

type RawCopaInteramericanaResult = {
  year: number;
  champion?: string;
  runnerUp?: string;
  rawChampion: string;
  rawRunnerUp: string;
};

export const COPA_INTERAMERICANA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'COPA_INTERAMERICANA',
  name: '美洲洲际杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'global',
  sources: [
    {
      label: 'Copa Interamericana - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_Interamericana',
      remark: '用于核对赛事基础资料、实际举办年份和历届决赛对阵。'
    },
    {
      label: 'Copa Interamericana - RSSSF',
      url: 'https://www.rsssf.org/tablesi/intam.html',
      remark: '用于交叉核对历届冠军、亚军和部分跨年举办口径。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件按 Wikipedia 决赛表的实际举办年份录入 1969 至 1998 共 18 届美洲洲际杯。',
    '赛事为南美解放者杯冠军与中北美冠军杯冠军之间的跨足联俱乐部赛事，按俱乐部国际四级杯赛处理。',
    '只录入冠军和亚军；应用户要求，standings 只保留本数据库已存在的俱乐部，不自动创建缺失参赛队。',
    'shortName 留空，后续以数据库人工维护为准。'
  ]
};

export const COPA_INTERAMERICANA_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '85',
    name: '拉普拉塔大学生',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL'
  },
  { uid: '1921', name: '乌拉圭国民', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '1254', name: '蓝十字', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '89', name: '独立竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1253', name: '墨西哥美洲', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '102924',
    name: '亚松森奥林匹亚',
    countryName: '巴拉圭',
    confederationCode: 'CONMEBOL'
  },
  { uid: '78', name: '阿根廷青年人', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '94', name: '河床竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '1200885',
    name: '阿拉胡埃拉人',
    countryName: '哥斯达黎加',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '427',
    name: '国民竞技',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL'
  },
  { uid: '399', name: '科洛科洛', countryName: '智利', confederationCode: 'CONMEBOL' },
  { uid: '136007', name: '普埃布拉', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '403', name: '天主教大学', countryName: '智利', confederationCode: 'CONMEBOL' },
  {
    uid: '102367',
    name: '萨普里萨',
    countryName: '哥斯达黎加',
    confederationCode: 'CONCACAF'
  },
  { uid: '98', name: '萨斯菲尔德', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1913', name: '华盛顿联', countryName: '美国', confederationCode: 'CONCACAF' },
  {
    uid: '339',
    name: '瓦斯科达伽马',
    countryName: '巴西',
    confederationCode: 'CONMEBOL'
  }
];

const RAW_COPA_INTERAMERICANA_RESULTS: RawCopaInteramericanaResult[] = [
  {
    year: 1969,
    champion: '拉普拉塔大学生',
    rawChampion: 'Estudiantes',
    rawRunnerUp: 'Deportivo Toluca'
  },
  {
    year: 1971,
    champion: '乌拉圭国民',
    runnerUp: '蓝十字',
    rawChampion: 'Nacional',
    rawRunnerUp: 'Cruz Azul'
  },
  {
    year: 1973,
    champion: '独立竞技',
    rawChampion: 'Independiente',
    rawRunnerUp: 'Olimpia (Honduras)'
  },
  {
    year: 1974,
    champion: '独立竞技',
    rawChampion: 'Independiente',
    rawRunnerUp: 'Municipal'
  },
  {
    year: 1976,
    champion: '独立竞技',
    rawChampion: 'Independiente',
    rawRunnerUp: 'Atletico Espanol'
  },
  {
    year: 1978,
    champion: '墨西哥美洲',
    runnerUp: '博卡青年',
    rawChampion: 'America',
    rawRunnerUp: 'Boca Juniors'
  },
  {
    year: 1979,
    champion: '亚松森奥林匹亚',
    rawChampion: 'Olimpia (Paraguay)',
    rawRunnerUp: 'FAS'
  },
  {
    year: 1981,
    runnerUp: '乌拉圭国民',
    rawChampion: 'UNAM',
    rawRunnerUp: 'Nacional'
  },
  {
    year: 1986,
    champion: '阿根廷青年人',
    rawChampion: 'Argentinos Juniors',
    rawRunnerUp: 'Defence Force'
  },
  {
    year: 1987,
    champion: '河床竞技',
    runnerUp: '阿拉胡埃拉人',
    rawChampion: 'River Plate',
    rawRunnerUp: 'Alajuelense'
  },
  {
    year: 1989,
    champion: '乌拉圭国民',
    rawChampion: 'Nacional',
    rawRunnerUp: 'Olimpia (Honduras)'
  },
  {
    year: 1990,
    champion: '国民竞技',
    rawChampion: 'Atletico Nacional',
    rawRunnerUp: 'UNAM'
  },
  {
    year: 1991,
    champion: '墨西哥美洲',
    runnerUp: '亚松森奥林匹亚',
    rawChampion: 'America',
    rawRunnerUp: 'Olimpia (Paraguay)'
  },
  {
    year: 1992,
    champion: '科洛科洛',
    runnerUp: '普埃布拉',
    rawChampion: 'Colo-Colo',
    rawRunnerUp: 'Puebla'
  },
  {
    year: 1994,
    champion: '天主教大学',
    runnerUp: '萨普里萨',
    rawChampion: 'Universidad Catolica',
    rawRunnerUp: 'Saprissa'
  },
  {
    year: 1996,
    champion: '萨斯菲尔德',
    rawChampion: 'Velez Sarsfield',
    rawRunnerUp: 'Cartagines'
  },
  {
    year: 1997,
    champion: '国民竞技',
    runnerUp: '萨普里萨',
    rawChampion: 'Atletico Nacional',
    rawRunnerUp: 'Saprissa'
  },
  {
    year: 1998,
    champion: '华盛顿联',
    runnerUp: '瓦斯科达伽马',
    rawChampion: 'D.C. United',
    rawRunnerUp: 'Vasco da Gama'
  }
];

export const COPA_INTERAMERICANA_RESULTS: CopaInteramericanaResult[] =
  RAW_COPA_INTERAMERICANA_RESULTS.map((result) => ({
    ...result,
    name: `${result.year}年`,
    season: String(result.year),
    host: '美洲洲际杯决赛',
    quantity: 2,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: `${result.rawChampion} 击败 ${result.rawRunnerUp} 夺冠。`
  }));

export function buildCopaInteramericanaStandings(result: CopaInteramericanaResult): SeedStanding[] {
  const standings: SeedStanding[] = [];

  if (result.champion) {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: result.champion,
      remark: result.rawChampion
    });
  }

  if (result.runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: result.runnerUp,
      remark: result.rawRunnerUp
    });
  }

  return standings;
}

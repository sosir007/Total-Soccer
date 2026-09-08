import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CampeonesCupResult = FinalOnlyCompetitionResult & {
  score: string;
};

export const CAMPEONES_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CAMPEONES_CUP',
  name: '冠军杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'custom',
  sources: [
    {
      label: 'Campeones Cup - MLS official preview',
      url: 'https://www.mlssoccer.com/competitions/campeones-cup/news/campeones-cup-everything-to-know-about-la-galaxy-vs-toluca-fc-2025',
      remark: '用于核对赛事定位、参赛资格、历届结果及 2020 年停办情况。'
    },
    {
      label: 'Campeones Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Campeones_Cup',
      remark: '用于交叉核对赛事沿革与历届决赛结果。'
    }
  ],
  lastVerifiedAt: '2026-09-08',
  notes: [
    '赛事由 MLS 与 Liga MX 共同组织，参赛双方分别为上届 MLS Cup 冠军和 Liga MX Campeón de Campeones 冠军。',
    '赛事为单场年度跨联赛冠军对抗赛，不属于 CONCACAF 面向全大洲的洲际俱乐部赛事。',
    '本系统按俱乐部其他二级杯赛处理，只记录冠军和亚军；冠军基础分 1 分，亚军基础分 0.5 分。',
    '2018、2019、2021 至 2025 年有有效届次，2020 年因 COVID-19 疫情未举办。'
  ]
};

export const CAMPEONES_CUP_REQUIRED_CLUBS: SeedClub[] = [
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
    uid: '104360',
    name: '新莱昂自治大学老虎',
    englishName: 'Tigres UANL',
    alias: '墨西哥老虎',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
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
    uid: '1253',
    name: '墨西哥美洲',
    englishName: 'Club América',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1904',
    name: '哥伦布机员',
    englishName: 'Columbus Crew',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1254',
    name: '蓝十字',
    englishName: 'Cruz Azul',
    countryName: '墨西哥',
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
    visibleInCatalog: false
  },
  {
    uid: '1256',
    name: '阿特拉斯',
    englishName: 'Atlas FC',
    countryName: '墨西哥',
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
    uid: '102355',
    name: '托卢卡体育',
    englishName: 'Deportivo Toluca F.C.',
    shortName: '托卢卡',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1907',
    name: '洛杉矶银河',
    englishName: 'LA Galaxy',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const SEEDED_CLUB_NAMES = new Set(CAMPEONES_CUP_REQUIRED_CLUBS.map((club) => club.name));

export const CAMPEONES_CUP_RESULTS: CampeonesCupResult[] = [
  {
    name: '2018年',
    year: 2018,
    champion: '新莱昂自治大学老虎',
    runnerUp: '多伦多FC',
    host: '多伦多',
    score: '3-1',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛新莱昂自治大学老虎 3-1 多伦多FC。'
  },
  {
    name: '2019年',
    year: 2019,
    champion: '亚特兰大联',
    runnerUp: '墨西哥美洲',
    host: '亚特兰大',
    score: '3-2',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛亚特兰大联 3-2 墨西哥美洲。'
  },
  {
    name: '2021年',
    year: 2021,
    champion: '哥伦布机员',
    runnerUp: '蓝十字',
    host: '哥伦布',
    score: '2-0',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛哥伦布机员 2-0 蓝十字。'
  },
  {
    name: '2022年',
    year: 2022,
    champion: '纽约城FC',
    runnerUp: '阿特拉斯',
    host: '纽约',
    score: '2-0',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛纽约城FC 2-0 阿特拉斯。'
  },
  {
    name: '2023年',
    year: 2023,
    champion: '新莱昂自治大学老虎',
    runnerUp: '洛杉矶FC',
    host: '洛杉矶',
    score: '0-0（点球4-2）',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛 0-0，新莱昂自治大学老虎点球 4-2 获胜。'
  },
  {
    name: '2024年',
    year: 2024,
    champion: '墨西哥美洲',
    runnerUp: '哥伦布机员',
    host: '哥伦布',
    score: '1-1（点球5-4）',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛 1-1，墨西哥美洲点球 5-4 获胜。'
  },
  {
    name: '2025年',
    year: 2025,
    champion: '托卢卡体育',
    runnerUp: '洛杉矶银河',
    host: '卡森',
    score: '3-2',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛托卢卡体育 3-2 洛杉矶银河。'
  }
].map((result) => ({
  ...result,
  externalUrl: 'https://en.wikipedia.org/wiki/Campeones_Cup'
}));

export function buildCampeonesCupStandings(result: CampeonesCupResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ].filter((standing) => SEEDED_CLUB_NAMES.has(standing.clubName));
}

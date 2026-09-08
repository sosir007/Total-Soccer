import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type LeaguesCupResult = SeedEdition & {
  year: number;
  champion: string;
  runnerUp: string;
  thirdPlace?: string;
  fourthPlace?: string;
  score: string;
  thirdPlaceScore?: string;
};

export const LEAGUES_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'LEAGUES_CUP',
  name: '北美联赛杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'custom',
  sources: [
    {
      label: 'Leagues Cup - Official Website',
      url: 'https://www.leaguescup.com/about/',
      remark: '用于核对赛事官方定位、参赛范围、现行赛制和中北美冠军杯资格。'
    },
    {
      label: 'Leagues Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Leagues_Cup',
      remark: '用于核对赛事沿革、历届冠亚军、三四名赛和未举办届次。'
    }
  ],
  lastVerifiedAt: '2026-09-08',
  notes: [
    '赛事由 MLS 与 Liga MX 俱乐部参加，属于北美跨联赛杯赛；本系统按俱乐部其他一级杯赛处理，不按中北美足联洲际赛事计分。',
    '2019、2021 只录入冠亚军；2023 起录入冠亚季殿军，但俱乐部其他一级杯赛规则只计算冠亚军分值。',
    '2020 因新冠疫情取消，2022 仅举办 Leagues Cup Showcase 且没有赛事冠军，均不创建正式届次。'
  ]
};

export const LEAGUES_CUP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1254',
    name: '蓝十字',
    englishName: 'Cruz Azul',
    countryName: '墨西哥',
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
    uid: '1259',
    name: '莱昂',
    englishName: 'Club León',
    countryName: '墨西哥',
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
    uid: '72052048',
    name: '迈阿密国际',
    englishName: 'Inter Miami CF',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '20046403',
    name: '纳什维尔SC',
    englishName: 'Nashville SC',
    shortName: '纳什维尔',
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
    uid: '1257',
    name: '蒙特雷',
    englishName: 'CF Monterrey',
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
    uid: '72049313',
    name: '洛杉矶FC',
    englishName: 'Los Angeles FC',
    shortName: '洛杉矶',
    countryName: '美国',
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
    uid: '1907',
    name: '洛杉矶银河',
    englishName: 'LA Galaxy',
    countryName: '美国',
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
    uid: '1253',
    name: '墨西哥美洲',
    englishName: 'Club América',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const SEEDED_CLUB_NAMES = new Set(LEAGUES_CUP_REQUIRED_CLUBS.map((club) => club.name));

export const LEAGUES_CUP_RESULTS: LeaguesCupResult[] = [
  {
    name: '2019年',
    year: 2019,
    champion: '蓝十字',
    runnerUp: '新莱昂自治大学老虎',
    score: '2-1',
    quantity: 8,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛蓝十字 2-1 新莱昂自治大学老虎。'
  },
  {
    name: '2021年',
    year: 2021,
    champion: '莱昂',
    runnerUp: '西雅图海湾人',
    score: '3-2',
    quantity: 8,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '决赛莱昂 3-2 西雅图海湾人。'
  },
  {
    name: '2023年',
    year: 2023,
    champion: '迈阿密国际',
    runnerUp: '纳什维尔SC',
    thirdPlace: '费城联合',
    fourthPlace: '蒙特雷',
    score: '1-1（点球10-9）',
    thirdPlaceScore: '3-0',
    quantity: 47,
    standingMode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '决赛迈阿密国际 1-1 纳什维尔SC，点球 10-9；三四名赛费城联合 3-0 蒙特雷。'
  },
  {
    name: '2024年',
    year: 2024,
    champion: '哥伦布机员',
    runnerUp: '洛杉矶FC',
    thirdPlace: '科罗拉多急流',
    fourthPlace: '费城联合',
    score: '3-1',
    thirdPlaceScore: '2-2（点球3-1）',
    quantity: 47,
    standingMode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '决赛哥伦布机员 3-1 洛杉矶FC；三四名赛科罗拉多急流 2-2 费城联合，点球 3-1。'
  },
  {
    name: '2025年',
    year: 2025,
    champion: '西雅图海湾人',
    runnerUp: '迈阿密国际',
    thirdPlace: '洛杉矶银河',
    fourthPlace: '奥兰多城',
    score: '3-0',
    thirdPlaceScore: '2-1',
    quantity: 36,
    standingMode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '决赛西雅图海湾人 3-0 迈阿密国际；三四名赛洛杉矶银河 2-1 奥兰多城。'
  },
  {
    name: '2026年',
    year: 2026,
    champion: '托卢卡体育',
    runnerUp: '蒙特雷',
    thirdPlace: '莱昂',
    fourthPlace: '墨西哥美洲',
    score: '2-0',
    thirdPlaceScore: '1-0',
    quantity: 36,
    standingMode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '决赛托卢卡体育 2-0 蒙特雷；三四名赛莱昂 1-0 墨西哥美洲。'
  }
];

export function buildLeaguesCupStandings(result: LeaguesCupResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp },
    { placement: CompetitionStandingPlacement.THIRD_PLACE, clubName: result.thirdPlace },
    { placement: CompetitionStandingPlacement.FOURTH_PLACE, clubName: result.fourthPlace }
  ].filter((standing) => standing.clubName && SEEDED_CLUB_NAMES.has(standing.clubName));
}

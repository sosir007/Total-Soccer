import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type AngloItalianLeagueCupResult = FinalOnlyCompetitionResult & {
  score: string;
};

const ANGLO_ITALIAN_LEAGUE_CUP_RSSSF_URL = 'https://www.rsssf.org/tablesa/angloitleagcup.html';

function getAngloItalianLeagueCupEditionUrl(year: number) {
  if (year === 1969) {
    return 'https://en.wikipedia.org/wiki/1969_Anglo-Italian_League_Cup';
  }

  return ANGLO_ITALIAN_LEAGUE_CUP_RSSSF_URL;
}

export const ANGLO_ITALIAN_LEAGUE_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ANGLO_ITALIAN_LEAGUE_CUP',
  name: '英意联赛杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'custom',
  sources: [
    {
      label: 'Anglo-Italian League Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Anglo-Italian_League_Cup',
      remark: '用于核对赛事沿革、参赛资格和停办状态。'
    },
    {
      label: 'Anglo-Italian League Cup - RSSSF',
      url: 'https://www.rsssf.org/tablesa/angloitleagcup.html',
      remark: '用于核对 1969-1976 各届冠亚军和两回合比分。'
    }
  ],
  lastVerifiedAt: '2026-08-10',
  notes: [
    '该赛事为意大利杯冠军与英格兰联赛杯冠军（1969-1971）或英格兰足总杯冠军（1975-1976）之间的两回合对抗赛。',
    '1972-1974 未举办，1976 后停办。',
    '赛事按俱乐部其他二级杯赛处理，只记录冠军和亚军。',
    '截至 2026-08-10，1969-1976 各届冠亚军已按当前口径完整录入。'
  ]
};

export const ANGLO_ITALIAN_LEAGUE_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1100', name: '罗马', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1111', name: '博洛尼亚', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '679', name: '曼城', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '728', name: '托特纳姆热刺', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1174', name: '都灵', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1129', name: '佛罗伦萨', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '735', name: '西汉姆联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1150', name: '那不勒斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '713', name: '南安普顿', countryName: '英格兰', confederationCode: 'UEFA' },
  {
    uid: '725',
    name: '斯温登镇',
    englishName: 'Swindon Town',
    shortName: '斯温登镇',
    countryName: '英格兰',
    confederationCode: 'UEFA'
  }
].map((club) => ({
  ...club,
  visibleInCatalog: false
}));

const SEEDED_CLUB_NAMES = new Set(ANGLO_ITALIAN_LEAGUE_CUP_REQUIRED_CLUBS.map((club) => club.name));

const RAW_ANGLO_ITALIAN_LEAGUE_CUP_RESULTS: AngloItalianLeagueCupResult[] = [
  {
    year: 1969,
    host: '主客场两回合',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '斯温登镇',
    runnerUp: '罗马',
    score: '5-2',
    remark: '两回合罗马 2-1 斯温登镇、斯温登镇 4-0 罗马，斯温登镇总比分 5-2 夺冠。'
  },
  {
    year: 1970,
    host: '主客场两回合',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '博洛尼亚',
    runnerUp: '曼城',
    score: '3-2',
    remark: '两回合博洛尼亚 1-0 曼城、曼城 2-2 博洛尼亚，博洛尼亚总比分 3-2 夺冠。'
  },
  {
    year: 1971,
    host: '主客场两回合',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '托特纳姆热刺',
    runnerUp: '都灵',
    score: '3-0',
    remark: '两回合都灵 0-1 托特纳姆热刺、托特纳姆热刺 2-0 都灵，托特纳姆热刺总比分 3-0 夺冠。'
  },
  {
    year: 1975,
    host: '主客场两回合',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '佛罗伦萨',
    runnerUp: '西汉姆联',
    score: '2-0',
    remark: '两回合佛罗伦萨 1-0 西汉姆联、西汉姆联 0-1 佛罗伦萨，佛罗伦萨总比分 2-0 夺冠。'
  },
  {
    year: 1976,
    host: '主客场两回合',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '那不勒斯',
    runnerUp: '南安普顿',
    score: '4-1',
    remark: '两回合南安普顿 1-0 那不勒斯、那不勒斯 4-0 南安普顿，那不勒斯总比分 4-1 夺冠。'
  }
];

export const ANGLO_ITALIAN_LEAGUE_CUP_RESULTS: AngloItalianLeagueCupResult[] =
  RAW_ANGLO_ITALIAN_LEAGUE_CUP_RESULTS.map((result) => {
    if (typeof result.year !== 'number') {
      throw new Error('Anglo-Italian League Cup result must include year.');
    }

    const missingTeams = [result.champion, result.runnerUp].filter(
      (clubName) => !SEEDED_CLUB_NAMES.has(clubName)
    );

    return {
      ...result,
      name: `${result.year}年`,
      externalUrl: getAngloItalianLeagueCupEditionUrl(result.year),
      remark: [
        result.remark,
        missingTeams.length ? `未录入当前库缺失俱乐部：${missingTeams.join('、')}。` : null
      ]
        .filter(Boolean)
        .join(' ')
    };
  });

export function buildAngloItalianLeagueCupStandings(
  result: AngloItalianLeagueCupResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ].filter((standing) => standing.clubName && SEEDED_CLUB_NAMES.has(standing.clubName));
}

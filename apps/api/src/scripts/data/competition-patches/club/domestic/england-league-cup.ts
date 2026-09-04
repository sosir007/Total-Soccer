import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import { ENGLAND_LEAGUE_CUP_RAW_ROWS } from '../../../competition-results/club/domestic/england-league-cup.js';

const COMPETITION_CODE = 'ENGLAND_LEAGUE_CUP';
const SOURCE_URL = 'https://www.rsssf.org/tablese/engleagcuphist.html';

type RawEnglandLeagueCupRow = (typeof ENGLAND_LEAGUE_CUP_RAW_ROWS)[number];

export const ENGLAND_LEAGUE_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '英格兰联赛杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'England - Football League Cup Finals - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对 1960-61 至 2025-26 历届决赛冠亚军。'
    },
    {
      label: 'List of EFL Cup finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_EFL_Cup_finals',
      remark: '用于交叉核对历届决赛名单。'
    }
  ],
  lastVerifiedAt: '2026-09-04',
  notes: [
    '本补录写入 1960-61 至 2025-26 英格兰联赛杯决赛冠亚军。',
    '只录入当前数据库已有俱乐部的冠军、亚军，不创建缺失俱乐部。',
    '允许部分名次落库：若某届仅有一方在库内，则只录入该方并在备注中说明。'
  ]
};

export const ENGLAND_LEAGUE_CUP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '603',
    name: '阿斯顿维拉',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '704',
    name: '罗瑟汉姆',
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
    uid: '703',
    name: '罗奇代尔',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '609',
    name: '伯明翰城',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '673',
    name: '莱斯特城',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '721',
    name: '斯托克城',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '630',
    name: '切尔西',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '734',
    name: '西布朗维奇',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '735',
    name: '西汉姆联',
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
    uid: '671',
    name: '利兹联',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '602',
    name: '阿森纳',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '725',
    name: '斯温登镇',
    englishName: 'Swindon Town',
    shortName: '斯温登镇',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '679',
    name: '曼城',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '728',
    name: '托特纳姆热刺',
    shortName: '热刺',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '740',
    name: '狼队',
    alias: '伍尔弗汉普顿流浪者',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '688',
    name: '纽卡斯尔联',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '650',
    name: '埃弗顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '692',
    name: '诺丁汉森林',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '676',
    name: '利物浦',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '713',
    name: '南安普顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '680',
    name: '曼联',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '722',
    name: '桑德兰',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '695',
    name: '牛津联',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '677',
    name: '卢顿镇',
    shortName: '卢顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '694',
    name: '奥尔德姆竞技',
    shortName: '奥尔德姆',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '709',
    name: '谢菲尔德星期三',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '614',
    name: '博尔顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '685',
    name: '米德尔斯堡',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '612',
    name: '布莱克本流浪者',
    shortName: '布莱克本',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '737',
    name: '维冈竞技',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '625',
    name: '卡迪夫城',
    countryName: '威尔士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '724',
    name: '斯旺西城',
    shortName: '斯旺西',
    countryName: '威尔士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '616',
    name: '布拉德福德城',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const CLUB_NAME_MAP: Record<string, string> = {
  'Aston Villa': '阿斯顿维拉',
  'Rotherham United': '罗瑟汉姆',
  'Norwich City': '诺维奇城',
  Rochdale: '罗奇代尔',
  'Birmingham City': '伯明翰城',
  'Leicester City': '莱斯特城',
  'Stoke City': '斯托克城',
  Chelsea: '切尔西',
  'West Bromwich Albion': '西布朗维奇',
  'West Ham United': '西汉姆联',
  "Queen's Park Rangers": '女王公园巡游者',
  'Queens Park Rangers': '女王公园巡游者',
  'Leeds United': '利兹联',
  Arsenal: '阿森纳',
  'Swindon Town': '斯温登镇',
  'Manchester City': '曼城',
  'Tottenham Hotspur': '托特纳姆热刺',
  'Wolverhampton Wanderers': '狼队',
  'Newcastle United': '纽卡斯尔联',
  Everton: '埃弗顿',
  'Nottingham Forest': '诺丁汉森林',
  Liverpool: '利物浦',
  Southampton: '南安普顿',
  'Manchester United': '曼联',
  Sunderland: '桑德兰',
  'Oxford United': '牛津联',
  'Luton Town': '卢顿镇',
  'Oldham Athletic': '奥尔德姆竞技',
  'Sheffield Wednesday': '谢菲尔德星期三',
  'Bolton Wanderers': '博尔顿',
  Middlesbrough: '米德尔斯堡',
  'Blackburn Rovers': '布莱克本流浪者',
  'Wigan Athletic': '维冈竞技',
  'Cardiff City': '卡迪夫城',
  'Swansea City': '斯旺西城',
  'Bradford City': '布拉德福德城'
};

function resolveClubName(sourceName: string) {
  return CLUB_NAME_MAP[sourceName] ?? null;
}

function buildStandings(row: RawEnglandLeagueCupRow) {
  const standings: SeedCompetitionPatch['standings'] = [];
  const champion = resolveClubName(row.champion);
  const runnerUp = resolveClubName(row.runnerUp);

  if (champion) {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: champion
    });
  }

  if (runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: runnerUp
    });
  }

  return standings;
}

function buildRemark(row: RawEnglandLeagueCupRow) {
  const remarks: string[] = [];

  if (row.remark) {
    remarks.push(row.remark);
  }

  if (!resolveClubName(row.champion)) {
    remarks.push(`冠军为 ${row.champion}，当前数据库暂无对应俱乐部，暂不录 standings。`);
  }

  if (!resolveClubName(row.runnerUp)) {
    remarks.push(`亚军为 ${row.runnerUp}，当前数据库暂无对应俱乐部，暂不录 standings。`);
  }

  return remarks.length ? remarks.join('；') : undefined;
}

export const ENGLAND_LEAGUE_CUP_PATCHES: SeedCompetitionPatch[] = ENGLAND_LEAGUE_CUP_RAW_ROWS.map(
  (row) => ({
    competitionCode: COMPETITION_CODE,
    name: row.season,
    year: row.year,
    season: row.season,
    quantity: 1,
    externalUrl: SOURCE_URL,
    remark: buildRemark(row),
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(row)
  })
);

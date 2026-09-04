import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import { ENGLAND_FA_CUP_RAW_ROWS } from '../../../competition-results/club/domestic/fa-cup.js';

const COMPETITION_CODE = 'ENGLAND_FA_CUP';
const SOURCE_URL = 'https://www.rsssf.org/tablese/engcuphist.html';

export const ENGLAND_FA_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '英格兰足总杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'England - FA Challenge Cup Finals 1946-now - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对 1881-82 至 2025-26 决赛冠亚军和战后历届球队。'
    },
    {
      label: 'List of FA Cup finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_FA_Cup_finals',
      remark: '用于交叉核对战后足总杯决赛结果。'
    }
  ],
  lastVerifiedAt: '2026-09-04',
  notes: [
    '本补录先写入 1881-82 至 2025-26 届次；1871-72 至 1880-81 因双方均为库外旧队，暂不建届次。',
    '只录入当前数据库已有俱乐部的冠军、亚军，不创建缺失俱乐部。',
    '允许部分名次落库：若某届仅有一方在库内，则只录入该方并在备注中说明。'
  ]
};

const CLUB_NAME_MAP: Record<string, string> = {
  'Derby County': '德比郡',
  'Charlton Athletic': '查尔顿竞技',
  Burnley: '伯恩利',
  'Manchester United': '曼联',
  Blackpool: '布莱克浦',
  'Wolverhampton Wanderers': '狼队',
  'Leicester City': '莱斯特城',
  Arsenal: '阿森纳',
  Liverpool: '利物浦',
  'Newcastle United': '纽卡斯尔联',
  'Bolton Wanderers': '博尔顿',
  'West Bromwich Albion': '西布朗维奇',
  'Preston North End': '普雷斯顿',
  'Manchester City': '曼城',
  'Birmingham City': '伯明翰城',
  'Aston Villa': '阿斯顿维拉',
  'Nottingham Forest': '诺丁汉森林',
  'Luton Town': '卢顿镇',
  'Tottenham Hotspur': '托特纳姆热刺',
  'West Ham United': '西汉姆联',
  'Leeds United': '利兹联',
  'The Wednesday': '谢菲尔德星期三',
  'Sheffield United': '谢菲尔德联',
  Sunderland: '桑德兰',
  Everton: '埃弗顿',
  'Sheffield Wednesday': '谢菲尔德星期三',
  Chelsea: '切尔西',
  Fulham: '富勒姆',
  Southampton: '南安普顿',
  'Bristol City': '布里斯托尔城',
  Barnsley: '巴恩斯利',
  Bury: '伯里',
  'Notts County': '诺茨郡',
  'Bradford City': '布拉德福德城',
  'Huddersfield Town': '哈德斯菲尔德',
  'Ipswich Town': '伊普斯维奇',
  'Queens Park Rangers': '女王公园巡游者',
  Wimbledon: 'AFC温布尔登',
  'Crystal Palace': '水晶宫',
  Watford: '沃特福德',
  Middlesbrough: '米德尔斯堡',
  Millwall: '米尔沃尔',
  Portsmouth: '朴茨茅斯',
  'Cardiff City': '卡迪夫城',
  'Stoke City': '斯托克城',
  'Wigan Athletic': '维冈竞技',
  'Hull City': '赫尔城',
  'Blackburn Rovers': '布莱克本流浪者',
  'Coventry City': '考文垂',
  'Brighton & Hove Albion': '布莱顿',
  Bournemouth: '伯恩茅斯',
  Brentford: '布伦特福德',
  Birmingham: '伯明翰城'
};

function resolveClubName(sourceName: string) {
  return CLUB_NAME_MAP[sourceName] ?? null;
}

function buildStandings(row: (typeof ENGLAND_FA_CUP_RAW_ROWS)[number]) {
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

function buildRemark(row: (typeof ENGLAND_FA_CUP_RAW_ROWS)[number]) {
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

export const ENGLAND_FA_CUP_PATCHES: SeedCompetitionPatch[] = ENGLAND_FA_CUP_RAW_ROWS.map(
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

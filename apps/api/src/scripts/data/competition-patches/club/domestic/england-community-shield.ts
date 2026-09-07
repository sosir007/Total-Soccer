import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type {
  SeedClub,
  SeedCompetitionPatch,
  SeedStanding
} from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import { RAW_ENGLAND_COMMUNITY_SHIELD_ROWS } from '../../../competition-results/club/domestic/england-community-shield.js';

const COMPETITION_CODE = 'ENGLAND_COMMUNITY_SHIELD';
const SOURCE_URL = 'https://www.rsssf.org/tablese/engsupcuphist.html';

type RawEnglandCommunityShieldRow = (typeof RAW_ENGLAND_COMMUNITY_SHIELD_ROWS)[number];

export const ENGLAND_COMMUNITY_SHIELD_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '英格兰社区盾杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'England - List of FA Charity/Community Shield Matches - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对 1908 至 2026 历届正式 FA Charity Shield / FA Community Shield。'
    },
    {
      label: 'List of FA Community Shield matches - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_FA_Community_Shield_matches',
      remark: '用于交叉核对共享盾牌年份、点球决胜和 2025 届结果。'
    },
    {
      label: 'Arsenal 3-0 Manchester City: 2026 FA Community Shield - The FA',
      url: 'https://www.thefa.com/news/2026/aug/16/fa-community-shield-2026-report-16082026',
      remark: '用于核对 2026 届社区盾杯结果。'
    }
  ],
  lastVerifiedAt: '2026-09-07',
  notes: [
    '本补录写入 1908 至 2026 英格兰社区盾杯库内俱乐部荣誉。',
    '只录入当前数据库已有俱乐部，不创建缺失俱乐部；1927 亚军 Corinthians 不是巴西科林蒂安，当前留空。',
    '职业联队、业余联队、世界杯队、FA XI 等非俱乐部对象不录入俱乐部荣誉。',
    '共享盾牌年份录两个冠军并设置 championShare=2，不录亚军。'
  ]
};

export const ENGLAND_COMMUNITY_SHIELD_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '680', name: '曼彻斯特联', shortName: '曼联', alias: '曼联', visibleInCatalog: false },
  { uid: '701', name: '女王公园巡游者', visibleInCatalog: false },
  { uid: '688', name: '纽卡斯尔联', visibleInCatalog: false },
  { uid: '689', name: '北安普顿镇', shortName: '北安普顿', visibleInCatalog: false },
  { uid: '618', name: '布莱顿', visibleInCatalog: false },
  { uid: '603', name: '阿斯顿维拉', visibleInCatalog: false },
  { uid: '725', name: '斯温登镇', shortName: '斯温登镇', visibleInCatalog: false },
  { uid: '612', name: '布莱克本流浪者', shortName: '布莱克本', visibleInCatalog: false },
  { uid: '734', name: '西布朗维奇', visibleInCatalog: false },
  { uid: '728', name: '托特纳姆热刺', shortName: '热刺', visibleInCatalog: false },
  { uid: '622', name: '伯恩利', visibleInCatalog: false },
  { uid: '664', name: '哈德斯菲尔德', visibleInCatalog: false },
  { uid: '676', name: '利物浦', visibleInCatalog: false },
  { uid: '625', name: '卡迪夫城', visibleInCatalog: false },
  { uid: '650', name: '埃弗顿', visibleInCatalog: false },
  { uid: '602', name: '阿森纳', visibleInCatalog: false },
  { uid: '709', name: '谢菲尔德星期三', visibleInCatalog: false },
  { uid: '679', name: '曼彻斯特城', shortName: '曼城', alias: '曼城', visibleInCatalog: false },
  { uid: '722', name: '桑德兰', visibleInCatalog: false },
  { uid: '700', name: '普雷斯顿', visibleInCatalog: false },
  { uid: '699', name: '朴茨茅斯', visibleInCatalog: false },
  {
    uid: '740',
    name: '伍尔弗汉普顿流浪者',
    shortName: '狼队',
    alias: '狼队',
    visibleInCatalog: false
  },
  { uid: '613', name: '布莱克浦', visibleInCatalog: false },
  { uid: '630', name: '切尔西', visibleInCatalog: false },
  { uid: '614', name: '博尔顿', visibleInCatalog: false },
  { uid: '692', name: '诺丁汉森林', visibleInCatalog: false },
  { uid: '667', name: '伊普斯维奇', visibleInCatalog: false },
  { uid: '735', name: '西汉姆联', visibleInCatalog: false },
  { uid: '673', name: '莱斯特城', visibleInCatalog: false },
  { uid: '645', name: '德比郡', visibleInCatalog: false },
  { uid: '671', name: '利兹联', visibleInCatalog: false },
  { uid: '713', name: '南安普顿', visibleInCatalog: false },
  { uid: '639', name: '考文垂', visibleInCatalog: false },
  { uid: '5110769', name: 'AFC温布尔登', visibleInCatalog: false },
  { uid: '737', name: '维冈竞技', visibleInCatalog: false },
  { uid: '642', name: '水晶宫', visibleInCatalog: false }
];

const CLUB_NAME_BY_SOURCE_NAME = new Map<string, string>([
  ['Manchester United', '曼彻斯特联'],
  ["Queen's Park Rangers", '女王公园巡游者'],
  ['Newcastle United', '纽卡斯尔联'],
  ['Northampton Town', '北安普顿镇'],
  ['Brighton & Hove Albion', '布莱顿'],
  ['Aston Villa', '阿斯顿维拉'],
  ['Swindon Town', '斯温登镇'],
  ['Blackburn Rovers', '布莱克本流浪者'],
  ['West Bromwich Albion', '西布朗维奇'],
  ['Tottenham Hotspur', '托特纳姆热刺'],
  ['Burnley', '伯恩利'],
  ['Huddersfield Town', '哈德斯菲尔德'],
  ['Liverpool', '利物浦'],
  ['Cardiff City', '卡迪夫城'],
  ['Everton', '埃弗顿'],
  ['Arsenal', '阿森纳'],
  ['Sheffield Wednesday', '谢菲尔德星期三'],
  ['Manchester City', '曼彻斯特城'],
  ['Sunderland', '桑德兰'],
  ['Preston North End', '普雷斯顿'],
  ['Portsmouth', '朴茨茅斯'],
  ['Wolverhampton Wanderers', '伍尔弗汉普顿流浪者'],
  ['Blackpool', '布莱克浦'],
  ['Chelsea', '切尔西'],
  ['Bolton Wanderers', '博尔顿'],
  ['Nottingham Forest', '诺丁汉森林'],
  ['Ipswich Town', '伊普斯维奇'],
  ['West Ham United', '西汉姆联'],
  ['Leicester City', '莱斯特城'],
  ['Derby County', '德比郡'],
  ['Leeds United', '利兹联'],
  ['Southampton', '南安普顿'],
  ['Coventry City', '考文垂'],
  ['Wimbledon', 'AFC温布尔登'],
  ['Wigan Athletic', '维冈竞技'],
  ['Crystal Palace', '水晶宫']
]);

function toClubName(sourceName: string) {
  return CLUB_NAME_BY_SOURCE_NAME.get(sourceName);
}

function buildStandings(row: RawEnglandCommunityShieldRow): SeedStanding[] {
  const championName = toClubName(row.champion);
  const runnerUpName = row.runnerUp ? toClubName(row.runnerUp) : undefined;

  if (row.shared) {
    return [championName, runnerUpName]
      .filter((clubName): clubName is string => Boolean(clubName))
      .map((clubName, index) => ({
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: index + 1,
        clubName
      }));
  }

  const standings: SeedStanding[] = [];

  if (championName) {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      standingOrder: 1,
      clubName: championName
    });
  }

  if (runnerUpName) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      standingOrder: 1,
      clubName: runnerUpName
    });
  }

  return standings;
}

function buildRemark(row: RawEnglandCommunityShieldRow) {
  if (row.remark) {
    return row.remark;
  }

  if (row.shared) {
    return '双方战平后共享盾牌，两个俱乐部均按冠军分摊录入。';
  }

  return null;
}

export const ENGLAND_COMMUNITY_SHIELD_PATCHES: SeedCompetitionPatch[] =
  RAW_ENGLAND_COMMUNITY_SHIELD_ROWS.reduce<SeedCompetitionPatch[]>((patches, row) => {
    const standings = buildStandings(row);

    if (!standings.length) {
      return patches;
    }

    patches.push({
      competitionCode: COMPETITION_CODE,
      name: String(row.year),
      year: row.year,
      season: String(row.year),
      quantity: 1,
      externalUrl: SOURCE_URL,
      championGroupKey: row.shared ? String(row.year) : null,
      championShare: row.shared ? 2 : null,
      standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
      remark: buildRemark(row),
      standings
    });

    return patches;
  }, []);

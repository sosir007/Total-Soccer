import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import { GERMANY_BUNDESLIGA_REQUIRED_CLUBS } from './germany-bundesliga.js';
import { RAW_DFB_POKAL_ROWS } from '../../../competition-results/club/domestic/dfb-pokal.js';

const COMPETITION_CODE = 'DFB_POKAL';
const SOURCE_URL = 'https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/statistik/bisherige-sieger';

type RawDfbPokalRow = (typeof RAW_DFB_POKAL_ROWS)[number];

export const DFB_POKAL_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '德国足协杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Bisherige Sieger des DFB-Pokals der Männer - DFB',
      url: SOURCE_URL,
      remark: '用于核对 1934-35 至 2025-26 历届冠亚军和历史前身口径。'
    },
    {
      label: 'List of DFB-Pokal finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_DFB-Pokal_finals',
      remark: '用于交叉核对历届决赛名单。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本补录只写入当前数据库已存在的俱乐部 standings，库外历史俱乐部对应名次直接过滤，不创建新俱乐部。',
    '1934-43 早期历史与 Tschammer-Pokal 一并统计，1943-52 无赛事，1952-53 起恢复为 DFB-Pokal。',
    '只按当前数据库已存在的德国 / 奥地利俱乐部录入荣誉。'
  ]
};

export const DFB_POKAL_REQUIRED_CLUBS: SeedClub[] = [
  ...GERMANY_BUNDESLIGA_REQUIRED_CLUBS,
  {
    uid: '3600077',
    name: '莱比锡火车头',
    englishName: '1. FC Lokomotive Leipzig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '155',
    name: '维也纳快速',
    englishName: 'Rapid Vienna',
    countryName: '奥地利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

const CLUB_NAME_MAP: Record<string, string> = {
  '1. FC Nürnberg': '纽伦堡',
  'FC Schalke 04': '沙尔克04',
  'Schalke 04': '沙尔克04',
  'VfB Leipzig': '莱比锡火车头',
  'Fortuna Düsseldorf': '杜塞尔多夫',
  'Rapid Wien': '维也纳快速',
  'VfB Stuttgart': '斯图加特',
  '1. FC Köln': '科隆',
  'Hamburger SV': '汉堡',
  'SV Werder Bremen': '云达不莱梅',
  'Werder Bremen': '云达不莱梅',
  'Borussia Mönchengladbach': '门兴格拉德巴赫',
  'Borussia Dortmund': '多特蒙德',
  'BV 09 Borussia Dortmund': '多特蒙德',
  'Bayer 05 Uerdingen': '乌丁根05',
  'Bayer 04 Leverkusen': '勒沃库森',
  'Bayer Leverkusen': '勒沃库森',
  'FC Bayern München': '拜仁慕尼黑',
  'Bayern München': '拜仁慕尼黑',
  'FC Bayern Munich': '拜仁慕尼黑',
  'TSV 1860 München': '慕尼黑1860',
  '1. FC Kaiserslautern': '凯泽斯劳滕',
  'Karlsruher SC': '卡尔斯鲁厄',
  'Alemannia Aachen': '亚琛',
  'MSV Duisburg': '杜伊斯堡',
  'Eintracht Frankfurt': '法兰克福',
  'VfL Bochum': '波鸿',
  'Kickers Offenbach': '奥芬巴赫踢球者',
  'Hertha BSC Berlin': '柏林赫塔',
  'Hertha BSC Berlin Amateure': '柏林赫塔',
  '1. FC Union Berlin': '柏林联合',
  'Hannoverscher SV 96': '汉诺威96',
  'Hannover 96': '汉诺威96',
  'VfL Wolfsburg': '沃尔夫斯堡',
  'RB Leipzig': 'RB莱比锡',
  'SC Freiburg': '弗赖堡'
};

function resolveClubName(sourceName: string) {
  return CLUB_NAME_MAP[sourceName] ?? null;
}

function buildStandings(row: RawDfbPokalRow) {
  const standings: SeedCompetitionPatch['standings'] = [];
  const { champion, runnerUp } = row;
  const resolvedChampion = resolveClubName(champion);
  const resolvedRunnerUp = resolveClubName(runnerUp);

  if (resolvedChampion) {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: resolvedChampion
    });
  }

  if (resolvedRunnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: resolvedRunnerUp
    });
  }

  return standings;
}

function buildRemark(row: RawDfbPokalRow) {
  const { champion, runnerUp } = row;
  const resolvedChampion = resolveClubName(champion);
  const resolvedRunnerUp = resolveClubName(runnerUp);
  const remarks: string[] = [];

  if (!resolvedChampion && !resolvedRunnerUp) {
    remarks.push(
      `冠军为 ${champion}、亚军为 ${runnerUp}，当前数据库暂无对应俱乐部，暂不录 standings。`
    );
  } else if (!resolvedChampion) {
    remarks.push(`冠军为 ${champion}，当前数据库暂无对应俱乐部，暂不录 standings。`);
  } else if (!resolvedRunnerUp) {
    remarks.push(`亚军为 ${runnerUp}，当前数据库暂无对应俱乐部，暂不录 standings。`);
  }

  return remarks.length ? remarks.join('；') : undefined;
}

export const DFB_POKAL_PATCHES: SeedCompetitionPatch[] = RAW_DFB_POKAL_ROWS.map((row) => ({
  competitionCode: COMPETITION_CODE,
  name: row.season,
  year: row.year,
  season: row.season,
  externalUrl: SOURCE_URL,
  remark: buildRemark(row),
  standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
  standings: buildStandings(row)
}));

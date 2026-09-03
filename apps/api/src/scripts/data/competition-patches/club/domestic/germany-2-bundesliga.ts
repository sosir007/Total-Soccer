import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'GERMANY_2_BUNDESLIGA';
const SOURCE_URL = 'https://www.rsssf.org/tablesd/duit2champ.html';

type Raw2BundesligaRow = {
  season: string;
  year: number;
  group?: '北区' | '南区';
  champion?: string | null;
  runnerUp?: string | null;
  thirdPlace?: string | null;
  remark?: string | null;
};

export const GERMANY_2_BUNDESLIGA_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '德国足球乙级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: '2. Bundesliga - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2._Bundesliga',
      remark: '用于核对赛事基础资料、分区赛制和现行状态。'
    },
    {
      label: 'West Germany - List of Second Level Champions - RSSSF',
      url: SOURCE_URL,
      remark: '用于核对 1974-75 至 2025-26 历届冠军、亚军、第三名及分区赛季口径。'
    }
  ],
  lastVerifiedAt: '2026-09-03',
  notes: [
    '本补录只写入当前数据库已存在的俱乐部 standings，库外球队对应名次直接过滤，不创建新俱乐部。',
    '1974-75 至 1980-81、1991-92 为南北分区赛季；本文件按北区 / 南区拆分为独立 edition，并通过 championShare=2 分摊冠军分。',
    '1981-82 之后为单赛季口径；promotion table 中的 runner-up / third-place 仅在能映射到库内俱乐部时写入。'
  ]
};

const EXISTING_2_BUNDESLIGA_CLUB_NAMES = new Set([
  '汉诺威96',
  '布伦瑞克',
  '萨尔布吕肯',
  '汉堡',
  '卡尔斯鲁厄',
  '沙尔克04',
  '圣保利',
  '慕尼黑1860',
  '纽伦堡',
  '斯图加特',
  '弗赖堡',
  '科隆',
  '门兴格拉德巴赫',
  '多特蒙德',
  '勒沃库森',
  '云达不莱梅',
  '沃尔夫斯堡',
  '波鸿',
  '美因茨05',
  '奥格斯堡',
  '柏林联合',
  '奥芬巴赫踢球者',
  '帕德博恩',
  '柏林赫塔',
  '凯泽斯劳滕',
  '乌丁根05',
  '莱比锡火车头',
  '达姆施塔特',
  '普鲁士明斯特',
  '杜塞尔多夫',
  '法兰克福',
  '杜伊斯堡',
  '霍芬海姆',
  '马格德堡',
  'RB莱比锡'
]);

const CLUB_NAME_MAP: Record<string, string> = {
  'Hannoverscher SV 96': '汉诺威96',
  'Hannover 96': '汉诺威96',
  'Braunschweiger TSV Eintracht': '布伦瑞克',
  'Eintracht Braunschweig': '布伦瑞克',
  '1. FC Saarbrücken': '萨尔布吕肯',
  'FC Saarbrücken': '萨尔布吕肯',
  'Hamburger SV': '汉堡',
  'Karlsruher SC': '卡尔斯鲁厄',
  'FC Schalke 04': '沙尔克04',
  'Schalke 04': '沙尔克04',
  'FC St. Pauli': '圣保利',
  'TSV 1860 München': '慕尼黑1860',
  '1. FC Nürnberg': '纽伦堡',
  '1.FC Nürnberg': '纽伦堡',
  'VfB Stuttgart': '斯图加特',
  'SC Freiburg': '弗赖堡',
  '1. FC Köln': '科隆',
  '1.FC Köln': '科隆',
  'Borussia Mönchengladbach': '门兴格拉德巴赫',
  'Borussia Dortmund': '多特蒙德',
  'BV 09 Borussia Dortmund': '多特蒙德',
  'TSV Bayer 04 Leverkusen': '勒沃库森',
  'Bayer 04 Leverkusen': '勒沃库森',
  'SV Werder Bremen': '云达不莱梅',
  'Werder Bremen': '云达不莱梅',
  'VfL Wolfsburg': '沃尔夫斯堡',
  'VfL Bochum': '波鸿',
  'FSV Mainz 05': '美因茨05',
  'FC Augsburg': '奥格斯堡',
  '1. FC Union Berlin': '柏林联合',
  'Offenbacher FC Kickers': '奥芬巴赫踢球者',
  'Kickers Offenbach': '奥芬巴赫踢球者',
  'SC Paderborn 07': '帕德博恩',
  'Hertha BSC': '柏林赫塔',
  'Hertha BSC Berlin': '柏林赫塔',
  '1. FC Kaiserslautern': '凯泽斯劳滕',
  'FC 08 Homburg': 'FC Homburg',
  'FC Homburg/Saar': 'FC Homburg',
  'FC Bayer 05 Uerdingen': '乌丁根05',
  'Bayer 05 Uerdingen': '乌丁根05',
  'KFC Uerdingen 05': '乌丁根05',
  '1. FC Lokomotive Leipzig': '莱比锡火车头',
  'VfB Leipzig': '莱比锡火车头',
  'SV Darmstadt 98': '达姆施塔特',
  'Darmstadt 98': '达姆施塔特',
  'Preußen Münster': '普鲁士明斯特',
  'Preussen Munster': '普鲁士明斯特',
  'Fortuna Düsseldorf': '杜塞尔多夫',
  'Fortuna Dusseldorf': '杜塞尔多夫',
  'Eintracht Frankfurt': '法兰克福',
  'MSV Duisburg': '杜伊斯堡',
  'TSG Hoffenheim': '霍芬海姆',
  '1. FC Magdeburg': '马格德堡',
  'RB Leipzig': 'RB莱比锡'
};

function normalizeClubName(rawName: string | null | undefined) {
  if (!rawName) return null;
  const mappedName = CLUB_NAME_MAP[rawName.trim()] ?? rawName.trim();
  return EXISTING_2_BUNDESLIGA_CLUB_NAMES.has(mappedName) ? mappedName : null;
}

const RAW_2_BUNDESLIGA_ROWS: Raw2BundesligaRow[] = [
  {
    season: '1974-75',
    year: 1975,
    group: '北区',
    champion: 'Hannoverscher SV 96',
    remark: '北区冠军。'
  },
  { season: '1974-75', year: 1975, group: '南区', champion: 'Karlsruher SC', remark: '南区冠军。' },
  {
    season: '1975-76',
    year: 1976,
    group: '北区',
    champion: 'Tennis Borussia Berlin',
    remark: '北区冠军。'
  },
  {
    season: '1975-76',
    year: 1976,
    group: '南区',
    champion: '1. FC Saarbrücken',
    remark: '南区冠军。'
  },
  { season: '1976-77', year: 1977, group: '北区', champion: 'FC St. Pauli', remark: '北区冠军。' },
  { season: '1976-77', year: 1977, group: '南区', champion: 'VfB Stuttgart', remark: '南区冠军。' },
  {
    season: '1977-78',
    year: 1978,
    group: '北区',
    champion: 'Arminia Bielefeld',
    remark: '北区冠军。'
  },
  {
    season: '1977-78',
    year: 1978,
    group: '南区',
    champion: 'SV Darmstadt 98',
    remark: '南区冠军。'
  },
  {
    season: '1978-79',
    year: 1979,
    group: '北区',
    champion: 'TSV Bayer 04 Leverkusen',
    remark: '北区冠军。'
  },
  {
    season: '1978-79',
    year: 1979,
    group: '南区',
    champion: 'TSV 1860 München',
    remark: '南区冠军。'
  },
  {
    season: '1979-80',
    year: 1980,
    group: '北区',
    champion: 'Arminia Bielefeld',
    remark: '北区冠军。'
  },
  {
    season: '1979-80',
    year: 1980,
    group: '南区',
    champion: '1. FC Nürnberg',
    remark: '南区冠军。'
  },
  {
    season: '1980-81',
    year: 1981,
    group: '北区',
    champion: 'SV Werder Bremen',
    remark: '北区冠军。'
  },
  {
    season: '1980-81',
    year: 1981,
    group: '南区',
    champion: 'SV Darmstadt 98',
    remark: '南区冠军。'
  },
  {
    season: '1981-82',
    year: 1982,
    champion: 'FC Schalke 04',
    runnerUp: 'Hertha BSC',
    thirdPlace: 'Offenbacher FC Kickers',
    remark: '单赛季口径，按联赛前三录入。'
  },
  {
    season: '1982-83',
    year: 1983,
    champion: 'SV Waldhof Mannheim',
    runnerUp: 'Offenbacher FC Kickers',
    thirdPlace: 'FC Bayer 05 Uerdingen',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1983-84',
    year: 1984,
    champion: 'Karlsruher SC',
    runnerUp: 'FC Schalke 04',
    remark: 'promotion table 记录冠亚军。'
  },
  {
    season: '1984-85',
    year: 1985,
    champion: '1. FC Nürnberg',
    runnerUp: 'Hannoverscher SV 96',
    thirdPlace: '1. FC Saarbrücken',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1985-86',
    year: 1986,
    champion: 'FC Homburg/Saar',
    runnerUp: 'Blau-Weiß 90 Berlin',
    remark: 'promotion table 记录冠亚军。'
  },
  {
    season: '1986-87',
    year: 1987,
    champion: 'Hannoverscher SV 96',
    runnerUp: 'Karlsruher SC',
    remark: 'promotion table 记录冠亚军。'
  },
  {
    season: '1987-88',
    year: 1988,
    champion: 'Stuttgarter Kickers',
    runnerUp: 'FC St. Pauli',
    remark: 'promotion table 记录冠亚军。'
  },
  {
    season: '1988-89',
    year: 1989,
    champion: 'Fortuna Düsseldorf',
    runnerUp: 'FC Homburg/Saar',
    remark: 'promotion table 记录冠亚军。'
  },
  {
    season: '1989-90',
    year: 1990,
    champion: 'Hertha BSC',
    runnerUp: 'Wattenscheid 09',
    thirdPlace: 'FC Bayer 05 Uerdingen',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1990-91',
    year: 1991,
    champion: 'FC Schalke 04',
    runnerUp: 'MSV Duisburg',
    thirdPlace: 'Stuttgarter Kickers',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1991-92',
    year: 1992,
    group: '北区',
    champion: 'FC Bayer 05 Uerdingen',
    remark: '北区冠军。'
  },
  {
    season: '1991-92',
    year: 1992,
    group: '南区',
    champion: '1. FC Saarbrücken',
    remark: '南区冠军。'
  },
  {
    season: '1992-93',
    year: 1993,
    champion: 'SC Freiburg',
    runnerUp: 'MSV Duisburg',
    thirdPlace: 'VfB Leipzig',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1993-94',
    year: 1994,
    champion: 'VfL Bochum',
    runnerUp: 'FC Bayer 05 Uerdingen',
    thirdPlace: 'TSV 1860 München',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1994-95',
    year: 1995,
    champion: 'FC Hansa Rostock',
    runnerUp: 'FC St. Pauli',
    thirdPlace: 'Fortuna Düsseldorf',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1995-96',
    year: 1996,
    champion: 'VfL Bochum',
    runnerUp: 'Arminia Bielefeld',
    thirdPlace: 'MSV Duisburg',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1996-97',
    year: 1997,
    champion: '1. FC Kaiserslautern',
    runnerUp: 'VfL Wolfsburg',
    thirdPlace: 'Hertha BSC',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1997-98',
    year: 1998,
    champion: 'Eintracht Frankfurt',
    runnerUp: 'SC Freiburg',
    thirdPlace: '1. FC Nürnberg',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1998-99',
    year: 1999,
    champion: 'Arminia Bielefeld',
    runnerUp: 'SpVgg. Unterhaching',
    thirdPlace: 'SSV Ulm 1846',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '1999-00',
    year: 2000,
    champion: '1. FC Köln',
    runnerUp: 'VfL Bochum',
    thirdPlace: 'FC Energie Cottbus',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2000-01',
    year: 2001,
    champion: '1. FC Nürnberg',
    runnerUp: 'Borussia Mönchengladbach',
    thirdPlace: 'FC St. Pauli',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2001-02',
    year: 2002,
    champion: 'Hannoverscher SV 96',
    runnerUp: 'Arminia Bielefeld',
    thirdPlace: 'VfL Bochum',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2002-03',
    year: 2003,
    champion: 'SC Freiburg',
    runnerUp: '1. FC Köln',
    thirdPlace: 'Eintracht Frankfurt',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2003-04',
    year: 2004,
    champion: '1. FC Nürnberg',
    runnerUp: 'Arminia Bielefeld',
    thirdPlace: 'FSV Mainz 05',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2004-05',
    year: 2005,
    champion: '1. FC Köln',
    runnerUp: 'MSV Duisburg',
    thirdPlace: 'Eintracht Frankfurt',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2005-06',
    year: 2006,
    champion: 'VfL Bochum',
    runnerUp: 'TSV Alemannia Aachen',
    thirdPlace: 'FC Energie Cottbus',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2006-07',
    year: 2007,
    champion: 'Karlsruher SC',
    runnerUp: 'FC Hansa Rostock',
    thirdPlace: 'MSV Duisburg',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2007-08',
    year: 2008,
    champion: 'Borussia Mönchengladbach',
    runnerUp: 'TSG Hoffenheim',
    thirdPlace: '1. FC Köln',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2008-09',
    year: 2009,
    champion: 'SC Freiburg',
    runnerUp: 'FSV Mainz 05',
    thirdPlace: '1. FC Nürnberg',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2009-10',
    year: 2010,
    champion: '1. FC Kaiserslautern',
    runnerUp: 'FC St. Pauli',
    thirdPlace: 'FC Augsburg',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2010-11',
    year: 2011,
    champion: 'Hertha BSC',
    runnerUp: 'FC Augsburg',
    thirdPlace: 'VfL Bochum',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2011-12',
    year: 2012,
    champion: 'SpVgg Greuther Fürth',
    runnerUp: 'Eintracht Frankfurt',
    thirdPlace: 'Fortuna Düsseldorf',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2012-13',
    year: 2013,
    champion: 'Hertha BSC',
    runnerUp: 'Braunschweiger TSV Eintracht',
    thirdPlace: '1. FC Kaiserslautern',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2013-14',
    year: 2014,
    champion: '1. FC Köln',
    runnerUp: 'SC Paderborn 07',
    thirdPlace: 'SpVgg Greuther Fürth',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2014-15',
    year: 2015,
    champion: 'FC Ingolstadt 04',
    runnerUp: 'SV Darmstadt 98',
    thirdPlace: 'Karlsruher SC',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2015-16',
    year: 2016,
    champion: 'SC Freiburg',
    runnerUp: 'RB Leipzig',
    thirdPlace: '1. FC Nürnberg',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2016-17',
    year: 2017,
    champion: 'VfB Stuttgart',
    runnerUp: 'Hannoverscher SV 96',
    thirdPlace: 'Braunschweiger TSV Eintracht',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2017-18',
    year: 2018,
    champion: 'Fortuna Düsseldorf',
    runnerUp: '1. FC Nürnberg',
    thirdPlace: 'Holstein Kiel',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2018-19',
    year: 2019,
    champion: '1. FC Köln',
    runnerUp: 'SC Paderborn 07',
    thirdPlace: '1. FC Union Berlin',
    remark: '1. FC Union Berlin 通过 playoff 晋级。'
  },
  {
    season: '2019-20',
    year: 2020,
    champion: 'DSC Arminia Bielefeld',
    runnerUp: 'VfB Stuttgart',
    thirdPlace: '1. FC Heidenheim',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2020-21',
    year: 2021,
    champion: 'VfL Bochum',
    runnerUp: 'SpVgg Greuther Fürth',
    thirdPlace: 'Holstein Kiel',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2021-22',
    year: 2022,
    champion: 'FC Schalke 04',
    runnerUp: 'SV Werder Bremen',
    thirdPlace: 'Hamburger SV',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2022-23',
    year: 2023,
    champion: '1. FC Heidenheim',
    runnerUp: 'SV Darmstadt 98',
    thirdPlace: 'Hamburger SV',
    remark: 'promotion table 记录冠亚军与 playoff 晋级席位。'
  },
  {
    season: '2023-24',
    year: 2024,
    champion: 'FC St. Pauli',
    runnerUp: 'Holstein Kiel',
    thirdPlace: 'Fortuna Düsseldorf',
    remark: '2008-09 起第三名参加升降级附加赛；本系统仍按联赛第三名录入。'
  },
  {
    season: '2024-25',
    year: 2025,
    champion: '1. FC Köln',
    runnerUp: 'Hamburger SV',
    remark: 'promotion table 仅列出已确认晋级球队。'
  },
  {
    season: '2025-26',
    year: 2026,
    champion: 'FC Schalke 04',
    runnerUp: 'SV Elversberg',
    thirdPlace: 'SC Paderborn 07',
    remark: 'SC Paderborn 07 通过 playoff 晋级。'
  }
];

export const GERMANY_2_BUNDESLIGA_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '927',
    name: '汉诺威96',
    englishName: 'Hannover 96',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2237',
    name: '布伦瑞克',
    englishName: 'Eintracht Braunschweig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '949',
    name: '萨尔布吕肯',
    englishName: 'Saarbrucken',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '947',
    name: '汉堡',
    englishName: 'Hamburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '931',
    name: '卡尔斯鲁厄',
    englishName: 'Karlsruher SC',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '920',
    name: '沙尔克04',
    englishName: 'Schalke 04',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '946',
    name: '圣保利',
    englishName: 'FC St. Pauli',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '955',
    name: '慕尼黑1860',
    englishName: 'TSV 1860 Munich',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '899',
    name: '纽伦堡',
    englishName: 'Nurnberg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '960',
    name: '斯图加特',
    englishName: 'Stuttgart',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '944',
    name: '弗赖堡',
    englishName: 'Freiburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '916',
    name: '科隆',
    englishName: 'Cologne',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '908',
    name: '门兴格拉德巴赫',
    englishName: 'Borussia Monchengladbach',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '907',
    name: '多特蒙德',
    englishName: 'Borussia Dortmund',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '901',
    name: '勒沃库森',
    englishName: 'Bayer Leverkusen',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '948',
    name: '云达不莱梅',
    englishName: 'Werder Bremen',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '961',
    name: '沃尔夫斯堡',
    englishName: 'Wolfsburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '905',
    name: '波鸿',
    englishName: 'VfL Bochum',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '918',
    name: '美因茨05',
    englishName: 'Mainz 05',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2238',
    name: '奥格斯堡',
    englishName: 'FC Augsburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '121182',
    name: '柏林联合',
    englishName: 'Union Berlin',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '932',
    name: '奥芬巴赫踢球者',
    englishName: 'Kickers Offenbach',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '121198',
    name: '帕德博恩',
    englishName: 'SC Paderborn',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2247',
    name: '柏林赫塔',
    englishName: 'Hertha Berlin',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '945',
    name: '凯泽斯劳滕',
    englishName: 'Kaiserslautern',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '902',
    name: '乌丁根05',
    englishName: 'KFC Uerdingen 05',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '3600077',
    name: '莱比锡火车头',
    englishName: '1. FC Lokomotive Leipzig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '108997',
    name: '达姆施塔特',
    englishName: 'Darmstadt',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '935',
    name: '普鲁士明斯特',
    englishName: 'Preussen Munster',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '921',
    name: '杜塞尔多夫',
    englishName: 'Fortuna Dusseldorf',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '912',
    name: '法兰克福',
    englishName: 'Eintracht Frankfurt',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '933',
    name: '杜伊斯堡',
    englishName: 'MSV Duisburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '879226',
    name: '霍芬海姆',
    englishName: 'TSG Hoffenheim',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2233',
    name: '马格德堡',
    englishName: '1. FC Magdeburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '91013388',
    name: 'RB莱比锡',
    englishName: 'RB Leipzig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

function buildPatchRow(row: Raw2BundesligaRow): SeedCompetitionPatch | null {
  const resolvedStandings: SeedCompetitionPatch['standings'] = [];
  const champion = normalizeClubName(row.champion);
  const runnerUp = normalizeClubName(row.runnerUp);
  const thirdPlace = normalizeClubName(row.thirdPlace);

  if (champion) {
    resolvedStandings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      standingOrder: 1,
      clubName: champion
    });
  }

  if (runnerUp) {
    resolvedStandings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      standingOrder: 1,
      clubName: runnerUp
    });
  }

  if (thirdPlace) {
    resolvedStandings.push({
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      standingOrder: 1,
      clubName: thirdPlace
    });
  }

  if (resolvedStandings.length === 0) {
    return null;
  }

  const editionName = row.group ? `${row.season} ${row.group}` : row.season;
  const championShare = row.group ? 2 : null;

  return {
    competitionCode: COMPETITION_CODE,
    name: editionName,
    year: row.year,
    season: row.season,
    championGroupKey: row.group ? row.season : null,
    championShare,
    externalUrl: SOURCE_URL,
    standingMode:
      row.group || (!row.runnerUp && !row.thirdPlace)
        ? CompetitionEditionStandingMode.FINAL_ONLY
        : CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: resolvedStandings,
    remark:
      row.group && row.remark
        ? `${row.remark} 同赛季南北分区冠军按 1/2 分摊冠军分。`
        : (row.remark ?? null)
  };
}

export const GERMANY_2_BUNDESLIGA_PATCHES: SeedCompetitionPatch[] = RAW_2_BUNDESLIGA_ROWS.flatMap(
  (row) => {
    const patch = buildPatchRow(row);
    return patch ? [patch] : [];
  }
);

import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type ConcacafChampionsCupResult = SeedEdition & {
  champion?: string;
  runnerUp?: string;
  sourceChampion?: string;
  sourceRunnerUp?: string;
  sourceChampions?: string[];
};

type RawConcacafChampionsCupResult = {
  season: string;
  year: number;
  champion?: string;
  runnerUp?: string;
  sourceChampion?: string;
  sourceRunnerUp?: string;
  sourceChampions?: string[];
  note?: string;
};

export const CONCACAF_CHAMPIONS_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CONCACAF_CHAMPIONS_CUP',
  name: '中北美洲及加勒比海冠军杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'CONCACAF Champions Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/CONCACAF_Champions_Cup',
      remark: '用于核对赛事历史沿革、现行名称和顶级俱乐部洲际赛事口径。'
    },
    {
      label: 'List of CONCACAF Champions Cup and Champions League finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_CONCACAF_Champions%27_Cup_and_Champions_League_finals',
      remark: '用于核对 1962 至 2026 年历届冠军、亚军和特殊届次。'
    }
  ],
  lastVerifiedAt: '2026-09-07',
  notes: [
    '本文件录入 1962 至 2026 年中北美洲及加勒比海冠军杯 / 中北美冠军联赛历届冠军和亚军。',
    '1964、1965 未授予冠军，1966、2001 未举办，不建届次。',
    '1978 决赛三角赛取消，瓜达拉哈拉大学、通信、国防军被宣布为并列冠军；当前三队均未入库，本轮只保留届次备注。',
    '只录入数据库已有俱乐部的 standings；库外俱乐部保留 sourceChampion/sourceRunnerUp 备注，后续补 UID 后再补。'
  ]
};

export const CONCACAF_CHAMPIONS_CUP_REQUIRED_CLUBS: SeedClub[] = [
  {
    uid: '1255',
    name: '瓜达拉哈拉',
    englishName: 'Guadalajara',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '1254',
    name: '蓝十字',
    englishName: 'Cruz Azul',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1200885',
    name: '阿拉胡埃拉人',
    englishName: 'Alajuelense',
    countryName: '哥斯达黎加',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1253',
    name: '墨西哥美洲',
    englishName: 'Club América',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '1260',
    name: '墨西哥美洲狮',
    englishName: 'Pumas UNAM',
    shortName: '美洲狮',
    alias: '国立自治大学美洲狮',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '102356',
    name: '亚特兰特',
    englishName: 'Atlante',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '102367',
    name: '萨普里萨',
    englishName: 'Saprissa',
    countryName: '哥斯达黎加',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '136007',
    name: '普埃布拉',
    englishName: 'Puebla',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF'
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
    uid: '1258',
    name: '内卡萨',
    englishName: 'Necaxa',
    countryName: '墨西哥',
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
    uid: '1913',
    name: '华盛顿联',
    englishName: 'D.C. United',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '116204',
    name: '帕丘卡',
    englishName: 'Pachuca',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '2000152066',
    name: '蒙特利尔CF',
    englishName: 'CF Montréal',
    shortName: '蒙特利尔',
    formerName: '蒙特利尔冲击',
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
    visibleInCatalog: false,
    forceUid: true
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
    uid: '1257',
    name: '蒙特雷',
    englishName: 'CF Monterrey',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
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
    uid: '72049313',
    name: '洛杉矶FC',
    englishName: 'Los Angeles FC',
    shortName: '洛杉矶',
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
    uid: '1904',
    name: '哥伦布机员',
    englishName: 'Columbus Crew',
    countryName: '美国',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '4400014',
    name: '温哥华白浪',
    englishName: 'Vancouver Whitecaps FC',
    countryName: '加拿大',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  }
];

const RAW_CONCACAF_CHAMPIONS_CUP_RESULTS: RawConcacafChampionsCupResult[] = [
  {
    season: '1962',
    year: 1962,
    champion: '瓜达拉哈拉',
    sourceRunnerUp: 'Comunicaciones'
  },
  {
    season: '1963',
    year: 1963,
    sourceChampion: 'Racing Club Haïtien',
    runnerUp: '瓜达拉哈拉'
  },
  { season: '1967', year: 1967, sourceChampion: 'Alianza', sourceRunnerUp: 'Jong Colombia' },
  { season: '1968', year: 1968, sourceChampion: 'Toluca' },
  { season: '1969', year: 1969, champion: '蓝十字', sourceRunnerUp: 'Comunicaciones' },
  { season: '1970', year: 1970, champion: '蓝十字' },
  { season: '1971', year: 1971, champion: '蓝十字', runnerUp: '阿拉胡埃拉人' },
  { season: '1972', year: 1972, sourceChampion: 'Olimpia', sourceRunnerUp: 'Robinhood' },
  { season: '1973', year: 1973, sourceChampion: 'Transvaal' },
  { season: '1974', year: 1974, sourceChampion: 'Municipal', sourceRunnerUp: 'Transvaal' },
  { season: '1975', year: 1975, sourceChampion: 'Atlético Español', sourceRunnerUp: 'Transvaal' },
  { season: '1976', year: 1976, sourceChampion: 'Águila', sourceRunnerUp: 'Robinhood' },
  { season: '1977', year: 1977, champion: '墨西哥美洲', sourceRunnerUp: 'Robinhood' },
  {
    season: '1978',
    year: 1978,
    sourceChampions: ['Leones Negros UdeG', 'Comunicaciones', 'Defence Force'],
    note: '决赛三角赛取消，瓜达拉哈拉大学、通信、国防军被宣布为并列冠军；三队当前均未入库，本轮不创建 standings。'
  },
  { season: '1979', year: 1979, sourceChampion: 'FAS', sourceRunnerUp: 'Jong Colombia' },
  { season: '1980', year: 1980, champion: '墨西哥美洲狮', sourceRunnerUp: 'UNAH' },
  { season: '1981', year: 1981, sourceChampion: 'Transvaal', sourceRunnerUp: 'Atlético Marte' },
  { season: '1982', year: 1982, champion: '墨西哥美洲狮', sourceRunnerUp: 'Robinhood' },
  { season: '1983', year: 1983, champion: '亚特兰特', sourceRunnerUp: 'Robinhood' },
  { season: '1984', year: 1984, sourceChampion: 'Violette' },
  { season: '1985', year: 1985, sourceChampion: 'Defence Force', sourceRunnerUp: 'Olimpia' },
  { season: '1986', year: 1986, champion: '阿拉胡埃拉人', sourceRunnerUp: 'Transvaal' },
  { season: '1987', year: 1987, champion: '墨西哥美洲', sourceRunnerUp: 'Defence Force' },
  { season: '1988', year: 1988, sourceChampion: 'Olimpia', sourceRunnerUp: 'Defence Force' },
  { season: '1989', year: 1989, champion: '墨西哥美洲狮', sourceRunnerUp: 'Pinar del Río' },
  { season: '1990', year: 1990, champion: '墨西哥美洲', sourceRunnerUp: 'Pinar del Río' },
  { season: '1991', year: 1991, champion: '普埃布拉', sourceRunnerUp: 'Police' },
  { season: '1992', year: 1992, champion: '墨西哥美洲', runnerUp: '阿拉胡埃拉人' },
  { season: '1993', year: 1993, champion: '萨普里萨', runnerUp: '莱昂' },
  { season: '1994', year: 1994, sourceChampion: 'Cartaginés', runnerUp: '亚特兰特' },
  { season: '1995', year: 1995, champion: '萨普里萨', sourceRunnerUp: 'Municipal' },
  { season: '1996', year: 1996, champion: '蓝十字', runnerUp: '内卡萨' },
  { season: '1997', year: 1997, champion: '蓝十字', runnerUp: '洛杉矶银河' },
  { season: '1998', year: 1998, champion: '华盛顿联', sourceRunnerUp: 'Toluca' },
  { season: '1999', year: 1999, champion: '内卡萨', runnerUp: '阿拉胡埃拉人' },
  { season: '2000', year: 2000, champion: '洛杉矶银河', sourceRunnerUp: 'Olimpia' },
  { season: '2002', year: 2002, champion: '帕丘卡', sourceRunnerUp: 'Monarcas Morelia' },
  { season: '2003', year: 2003, sourceChampion: 'Toluca', sourceRunnerUp: 'Monarcas Morelia' },
  { season: '2004', year: 2004, champion: '阿拉胡埃拉人', runnerUp: '萨普里萨' },
  { season: '2005', year: 2005, champion: '萨普里萨', runnerUp: '墨西哥美洲狮' },
  { season: '2006', year: 2006, champion: '墨西哥美洲', sourceRunnerUp: 'Toluca' },
  { season: '2007', year: 2007, champion: '帕丘卡', runnerUp: '瓜达拉哈拉' },
  { season: '2008', year: 2008, champion: '帕丘卡', runnerUp: '萨普里萨' },
  { season: '2008-09', year: 2009, champion: '亚特兰特', runnerUp: '蓝十字' },
  { season: '2009-10', year: 2010, champion: '帕丘卡', runnerUp: '蓝十字' },
  { season: '2010-11', year: 2011, champion: '蒙特雷', runnerUp: '皇家盐湖城' },
  { season: '2011-12', year: 2012, champion: '蒙特雷', sourceRunnerUp: 'Santos Laguna' },
  { season: '2012-13', year: 2013, champion: '蒙特雷', sourceRunnerUp: 'Santos Laguna' },
  { season: '2013-14', year: 2014, champion: '蓝十字', sourceRunnerUp: 'Toluca' },
  { season: '2014-15', year: 2015, champion: '墨西哥美洲', runnerUp: '蒙特利尔CF' },
  { season: '2015-16', year: 2016, champion: '墨西哥美洲', runnerUp: '新莱昂自治大学老虎' },
  { season: '2016-17', year: 2017, champion: '帕丘卡', runnerUp: '新莱昂自治大学老虎' },
  { season: '2018', year: 2018, champion: '瓜达拉哈拉', runnerUp: '多伦多FC' },
  { season: '2019', year: 2019, champion: '蒙特雷', runnerUp: '新莱昂自治大学老虎' },
  { season: '2020', year: 2020, champion: '新莱昂自治大学老虎', runnerUp: '洛杉矶FC' },
  { season: '2021', year: 2021, champion: '蒙特雷', runnerUp: '墨西哥美洲' },
  { season: '2022', year: 2022, champion: '西雅图海湾人', runnerUp: '墨西哥美洲狮' },
  { season: '2023', year: 2023, champion: '莱昂', runnerUp: '洛杉矶FC' },
  { season: '2024', year: 2024, champion: '帕丘卡', runnerUp: '哥伦布机员' },
  { season: '2025', year: 2025, champion: '蓝十字', runnerUp: '温哥华白浪' },
  { season: '2026', year: 2026, sourceChampion: 'Toluca', runnerUp: '新莱昂自治大学老虎' }
];

function buildRemark(result: RawConcacafChampionsCupResult) {
  if (result.note) {
    return result.note;
  }

  const sourceChampion = result.sourceChampion ?? result.champion;
  const sourceRunnerUp = result.sourceRunnerUp ?? result.runnerUp;
  const missingParts = [
    result.sourceChampion ? `冠军 ${result.sourceChampion} 当前未入库` : null,
    result.sourceRunnerUp ? `亚军 ${result.sourceRunnerUp} 当前未入库` : null
  ].filter(Boolean);

  if (missingParts.length) {
    return `${sourceChampion ? `冠军 ${sourceChampion}` : '冠军未确认'}${
      sourceRunnerUp ? `，亚军 ${sourceRunnerUp}` : ''
    }；${missingParts.join('，')}，本轮不创建对应 standings。`;
  }

  if (!sourceRunnerUp) {
    return `${sourceChampion} 被宣布为冠军，本届无明确亚军 standings。`;
  }

  return `决赛 / 最终对阵：${sourceChampion} 对 ${sourceRunnerUp}。`;
}

export const CONCACAF_CHAMPIONS_CUP_RESULTS: ConcacafChampionsCupResult[] =
  RAW_CONCACAF_CHAMPIONS_CUP_RESULTS.map((result) => ({
    ...result,
    name: result.season,
    quantity: result.sourceChampions?.length ?? 2,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: buildRemark(result)
  }));

export function buildConcacafChampionsCupStandings(
  result: ConcacafChampionsCupResult
): SeedStanding[] {
  const standings: SeedStanding[] = [];

  if (result.champion) {
    standings.push({
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: result.champion
    });
  }

  if (result.runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: result.runnerUp
    });
  }

  return standings;
}

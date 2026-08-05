import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type RawStandingRow = {
  season: string;
  champions: string[];
  runnerUp?: string | null;
  thirdPlace?: string | null;
  remark?: string | null;
};

export const SPAIN_SEGUNDA_DIVISION_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_SEGUNDA_DIVISION',
  name: '西班牙足球乙级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Segunda División - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Segunda_Divisi%C3%B3n',
      remark: '用于核对 1929-2019 赛季表里的冠军、亚军和第三名/其他升级队。'
    },
    {
      label: 'Spain 2020-24 season tables - RSSSF',
      url: 'https://www.rsssf.org/tabless/',
      remark: '用于核对 2020-21 至 2023-24 的第二级别最终积分榜前三。'
    }
  ],
  lastVerifiedAt: '2026-08-03',
  notes: [
    '1929-2019 以维基赛季表为主；1949-50 至 1967-68 为南北组赛制，按双冠军录入并分摊冠军分。',
    '2019-20 以后按单季最终积分榜前三录入；缺失季军的赛季先保留冠亚军。',
    '本补录只写入当前数据库里已存在的西班牙俱乐部 standings，缺失俱乐部对应名次先留空。'
  ]
};

const CLUB_NAME_MAP: Record<string, string> = {
  'AD Almería': '阿尔梅里亚',
  Alavés: '阿拉维斯',
  Albacete: '阿尔巴塞特',
  Alcoyano: '阿尔科亚诺',
  Almeria: '阿尔梅里亚',
  Almería: '阿尔梅里亚',
  'Atlético Madrid': '马德里竞技',
  'Atlético Madrid B': '马德里竞技B队',
  'Atlético Tetuán': '阿特莱蒂科·泰图安',
  'Atlético de Madrid': '马德里竞技',
  Betis: '皇家贝蒂斯',
  'Bilbao Athletic': '毕尔巴鄂竞技B队',
  'Burgos (I)': '布尔戈斯',
  'CD Leganés': '莱加内斯',
  Castellón: '卡斯特利翁',
  Castilla: '皇家马德里卡斯蒂利亚',
  'Celta Vigo': '维戈塞尔塔',
  Compostela: '孔波斯特拉',
  'Cultural Leonesa': '莱昂文化',
  Cádiz: '加的斯',
  Córdoba: '科尔多瓦',
  'Deportivo La Coruña': '拉科鲁尼亚',
  'Deportivo La Coruña (not promoted)': '拉科鲁尼亚',
  Eibar: '埃瓦尔',
  Elche: '埃尔切',
  Espanyol: '西班牙人',
  Extremadura: '埃斯特雷马杜拉',
  Getafe: '赫塔费',
  Gimnàstic: '塔拉戈纳竞技',
  Girona: '赫罗纳',
  'Girona FC': '赫罗纳',
  Granada: '格拉纳达',
  'Granada CF': '格拉纳达',
  Huesca: '韦斯卡',
  Hércules: '赫拉克勒斯',
  'Iberia SC': '伊比利亚SC',
  Jaén: '哈恩',
  'Las Palmas': '拉斯帕尔马斯',
  Leganés: '莱加内斯',
  Levante: '莱万特',
  'Levante UD': '莱万特',
  'Levante UD (Valencia)': '莱万特',
  Lleida: '莱里达',
  Logroñés: '洛格罗尼奥',
  Mallorca: '皇家马略卡',
  Murcia: '穆尔西亚',
  Málaga: '马拉加',
  Mérida: '梅里达',
  Numancia: '努曼西亚',
  Osasuna: '奥萨苏纳',
  Oviedo: '皇家奥维耶多',
  Pontevedra: '蓬特韦德拉',
  'RCD Espanyol (Barcelona)': '西班牙人',
  'RCD Mallorca (Palma de M.)': '皇家马略卡',
  'Racing Santander': '桑坦德竞技',
  'Racing de Santander': '桑坦德竞技',
  'Rayo Vallecano': '巴列卡诺',
  'Real Burgos': '皇家布尔戈斯',
  'Real Sociedad': '皇家社会',
  'Real Valladolid': '巴拉多利德',
  Recreativo: '韦尔瓦竞技',
  'SD Eibar': '埃瓦尔',
  Sabadell: '萨瓦德尔',
  Salamanca: '萨拉曼卡',
  Sevilla: '塞维利亚',
  'Sevilla FC': '塞维利亚',
  'Sporting Gijón': '希洪竞技',
  'Sporting de Gijón': '希洪竞技',
  Tenerife: '特内里费',
  'UD Almería': '阿尔梅里亚',
  'UD Las Palmas': '拉斯帕尔马斯',
  Valencia: '瓦伦西亚',
  Valladolid: '巴拉多利德',
  Villarreal: '比利亚雷亚尔',
  Xerez: '赫雷斯',
  Zaragoza: '萨拉戈萨'
};

const INCLUDED_SEGUNDA_CLUB_NAMES = new Set([
  '阿拉维斯',
  '马德里竞技',
  '巴列卡诺',
  '卡斯特利翁',
  '维戈塞尔塔',
  '埃尔切',
  '西班牙人',
  '赫塔费',
  '格拉纳达',
  '赫罗纳',
  '拉斯帕尔马斯',
  '皇家马略卡',
  '奥萨苏纳',
  '皇家奥维耶多',
  '皇家社会',
  '皇家贝蒂斯',
  '拉科鲁尼亚',
  '巴拉多利德',
  '塞维利亚',
  '希洪竞技',
  '特内里费',
  '瓦伦西亚',
  '比利亚雷亚尔',
  '萨拉戈萨'
]);

const RAW_SEGUNDA_DIVISION_ROWS: RawStandingRow[] = [
  {
    season: '1929',
    champions: ['Sevilla'],
    runnerUp: 'Iberia SC'
  },
  {
    season: '1929-30',
    champions: ['Alavés'],
    runnerUp: 'Sporting Gijón'
  },
  {
    season: '1930-31',
    champions: ['Valencia'],
    runnerUp: 'Sevilla'
  },
  {
    season: '1931-32',
    champions: ['Betis'],
    runnerUp: 'Oviedo'
  },
  {
    season: '1932-33',
    champions: ['Oviedo'],
    runnerUp: 'Atlético Madrid'
  },
  {
    season: '1933-34',
    champions: ['Sevilla'],
    runnerUp: 'Atlético Madrid'
  },
  {
    season: '1934-35',
    champions: ['Hércules'],
    runnerUp: 'Osasuna'
  },
  {
    season: '1935-36',
    champions: ['Celta Vigo'],
    runnerUp: 'Zaragoza'
  },
  {
    season: '1939-40',
    champions: ['Murcia'],
    runnerUp: 'Deportivo La Coruña'
  },
  {
    season: '1940-41',
    champions: ['Granada'],
    runnerUp: 'Real Sociedad',
    thirdPlace: 'Castellón'
  },
  {
    season: '1941-42',
    champions: ['Betis'],
    runnerUp: 'Zaragoza'
  },
  {
    season: '1942-43',
    champions: ['Sabadell'],
    runnerUp: 'Real Sociedad'
  },
  {
    season: '1943-44',
    champions: ['Sporting Gijón'],
    runnerUp: 'Murcia'
  },
  {
    season: '1944-45',
    champions: ['Alcoyano'],
    runnerUp: 'Hércules',
    thirdPlace: 'Celta Vigo'
  },
  {
    season: '1945-46',
    champions: ['Sabadell'],
    runnerUp: 'Deportivo La Coruña'
  },
  {
    season: '1946-47',
    champions: ['Alcoyano'],
    runnerUp: 'Gimnàstic',
    thirdPlace: 'Real Sociedad'
  },
  {
    season: '1947-48',
    champions: ['Valladolid'],
    runnerUp: 'Deportivo La Coruña'
  },
  {
    season: '1948-49',
    champions: ['Real Sociedad'],
    runnerUp: 'Málaga'
  },
  {
    season: '1949-50',
    champions: ['Racing Santander', 'Alcoyano'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1950-51',
    champions: ['Sporting Gijón', 'Atlético Tetuán'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1951-52',
    champions: ['Oviedo', 'Málaga'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1952-53',
    champions: ['Osasuna', 'Jaén'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1953-54',
    champions: ['Alavés', 'Las Palmas'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1954-55',
    champions: ['Cultural Leonesa', 'Murcia'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1955-56',
    champions: ['Osasuna', 'Jaén'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1956-57',
    champions: ['Sporting Gijón', 'Granada'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1957-58',
    champions: ['Oviedo', 'Betis'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1958-59',
    champions: ['Elche', 'Valladolid'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1959-60',
    champions: ['Racing Santander', 'Mallorca'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1960-61',
    champions: ['Osasuna', 'Tenerife'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1961-62',
    champions: ['Deportivo La Coruña', 'Córdoba'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1962-63',
    champions: ['Pontevedra', 'Murcia'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1963-64',
    champions: ['Deportivo La Coruña', 'Las Palmas'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1964-65',
    champions: ['Pontevedra', 'Mallorca'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1965-66',
    champions: ['Deportivo La Coruña', 'Hércules'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1966-67',
    champions: ['Real Sociedad', 'Málaga'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1967-68',
    champions: ['Deportivo La Coruña', 'Granada'],
    remark: '分南北组双冠军，冠军分按 1/2 分摊。'
  },
  {
    season: '1968-69',
    champions: ['Sevilla'],
    runnerUp: 'Celta Vigo',
    thirdPlace: 'Mallorca'
  },
  {
    season: '1969-70',
    champions: ['Sporting Gijón'],
    runnerUp: 'Málaga',
    thirdPlace: 'Espanyol'
  },
  {
    season: '1970-71',
    champions: ['Betis'],
    runnerUp: 'Burgos (I)',
    thirdPlace: 'Deportivo La Coruña'
  },
  {
    season: '1971-72',
    champions: ['Oviedo'],
    runnerUp: 'Castellón',
    thirdPlace: 'Zaragoza'
  },
  {
    season: '1972-73',
    champions: ['Murcia'],
    runnerUp: 'Elche',
    thirdPlace: 'Racing Santander'
  },
  {
    season: '1973-74',
    champions: ['Betis'],
    runnerUp: 'Hércules',
    thirdPlace: 'Salamanca'
  },
  {
    season: '1974-75',
    champions: ['Oviedo'],
    runnerUp: 'Racing Santander',
    thirdPlace: 'Sevilla'
  },
  {
    season: '1975-76',
    champions: ['Burgos (I)'],
    runnerUp: 'Celta Vigo',
    thirdPlace: 'Málaga'
  },
  {
    season: '1976-77',
    champions: ['Sporting Gijón'],
    runnerUp: 'Cádiz',
    thirdPlace: 'Rayo Vallecano'
  },
  {
    season: '1977-78',
    champions: ['Zaragoza'],
    runnerUp: 'Recreativo',
    thirdPlace: 'Celta Vigo'
  },
  {
    season: '1978-79',
    champions: ['AD Almería'],
    runnerUp: 'Málaga',
    thirdPlace: 'Betis'
  },
  {
    season: '1979-80',
    champions: ['Murcia'],
    runnerUp: 'Valladolid',
    thirdPlace: 'Osasuna'
  },
  {
    season: '1980-81',
    champions: ['Castellón'],
    runnerUp: 'Cádiz',
    thirdPlace: 'Racing Santander'
  },
  {
    season: '1981-82',
    champions: ['Celta Vigo'],
    runnerUp: 'Salamanca',
    thirdPlace: 'Málaga'
  },
  {
    season: '1982-83',
    champions: ['Murcia'],
    runnerUp: 'Cádiz',
    thirdPlace: 'Mallorca'
  },
  {
    season: '1983-84',
    champions: ['Castilla'],
    runnerUp: 'Bilbao Athletic',
    thirdPlace: 'Hércules'
  },
  {
    season: '1984-85',
    champions: ['Las Palmas'],
    runnerUp: 'Cádiz',
    thirdPlace: 'Celta Vigo'
  },
  {
    season: '1985-86',
    champions: ['Murcia'],
    runnerUp: 'Sabadell',
    thirdPlace: 'Mallorca'
  },
  {
    season: '1986-87',
    champions: ['Valencia'],
    runnerUp: 'Logroñés',
    thirdPlace: 'Celta Vigo'
  },
  {
    season: '1987-88',
    champions: ['Málaga'],
    runnerUp: 'Elche',
    thirdPlace: 'Oviedo'
  },
  {
    season: '1988-89',
    champions: ['Castellón'],
    runnerUp: 'Rayo Vallecano',
    thirdPlace: 'Mallorca'
  },
  {
    season: '1989-90',
    champions: ['Real Burgos'],
    runnerUp: 'Betis',
    thirdPlace: 'Espanyol'
  },
  {
    season: '1990-91',
    champions: ['Albacete'],
    runnerUp: 'Deportivo La Coruña'
  },
  {
    season: '1991-92',
    champions: ['Celta Vigo'],
    runnerUp: 'Rayo Vallecano'
  },
  {
    season: '1992-93',
    champions: ['Lleida'],
    runnerUp: 'Valladolid',
    thirdPlace: 'Racing Santander'
  },
  {
    season: '1993-94',
    champions: ['Espanyol'],
    runnerUp: 'Betis',
    thirdPlace: 'Compostela'
  },
  {
    season: '1994-95',
    champions: ['Mérida'],
    runnerUp: 'Rayo Vallecano',
    thirdPlace: 'Salamanca'
  },
  {
    season: '1995-96',
    champions: ['Hércules'],
    runnerUp: 'Logroñés',
    thirdPlace: 'Extremadura'
  },
  {
    season: '1996-97',
    champions: ['Mérida'],
    runnerUp: 'Salamanca',
    thirdPlace: 'Mallorca'
  },
  {
    season: '1997-98',
    champions: ['Alavés'],
    runnerUp: 'Extremadura',
    thirdPlace: 'Villarreal'
  },
  {
    season: '1998-99',
    champions: ['Málaga'],
    runnerUp: 'Atlético Madrid B',
    thirdPlace: 'Numancia'
  },
  {
    season: '1999-2000',
    champions: ['Las Palmas'],
    runnerUp: 'Osasuna',
    thirdPlace: 'Villarreal'
  },
  {
    season: '2000-01',
    champions: ['Sevilla'],
    runnerUp: 'Betis',
    thirdPlace: 'Tenerife'
  },
  {
    season: '2001-02',
    champions: ['Atlético Madrid'],
    runnerUp: 'Racing Santander',
    thirdPlace: 'Recreativo'
  },
  {
    season: '2002-03',
    champions: ['Murcia'],
    runnerUp: 'Zaragoza',
    thirdPlace: 'Albacete'
  },
  {
    season: '2003-04',
    champions: ['Levante'],
    runnerUp: 'Numancia',
    thirdPlace: 'Getafe'
  },
  {
    season: '2004-05',
    champions: ['Cádiz'],
    runnerUp: 'Celta Vigo',
    thirdPlace: 'Alavés'
  },
  {
    season: '2005-06',
    champions: ['Recreativo'],
    runnerUp: 'Gimnàstic',
    thirdPlace: 'Levante'
  },
  {
    season: '2006-07',
    champions: ['Valladolid'],
    runnerUp: 'Almería',
    thirdPlace: 'Murcia'
  },
  {
    season: '2007-08',
    champions: ['Numancia'],
    runnerUp: 'Málaga',
    thirdPlace: 'Sporting Gijón'
  },
  {
    season: '2008-09',
    champions: ['Xerez'],
    runnerUp: 'Zaragoza',
    thirdPlace: 'Tenerife'
  },
  {
    season: '2009-10',
    champions: ['Real Sociedad'],
    runnerUp: 'Hércules',
    thirdPlace: 'Levante'
  },
  {
    season: '2010-11',
    champions: ['Betis'],
    runnerUp: 'Rayo Vallecano',
    thirdPlace: 'Granada'
  },
  {
    season: '2011-12',
    champions: ['Deportivo La Coruña'],
    runnerUp: 'Celta Vigo',
    thirdPlace: 'Valladolid'
  },
  {
    season: '2012-13',
    champions: ['Elche'],
    runnerUp: 'Villarreal',
    thirdPlace: 'Almeria'
  },
  {
    season: '2013-14',
    champions: ['Eibar'],
    runnerUp: 'Deportivo La Coruña',
    thirdPlace: 'Córdoba'
  },
  {
    season: '2014-15',
    champions: ['Betis'],
    runnerUp: 'Sporting Gijón',
    thirdPlace: 'Las Palmas'
  },
  {
    season: '2015-16',
    champions: ['Alavés'],
    runnerUp: 'Leganés',
    thirdPlace: 'Osasuna'
  },
  {
    season: '2016-17',
    champions: ['Levante'],
    runnerUp: 'Girona',
    thirdPlace: 'Getafe'
  },
  {
    season: '2017-18',
    champions: ['Rayo Vallecano'],
    runnerUp: 'Huesca',
    thirdPlace: 'Valladolid'
  },
  {
    season: '2018-19',
    champions: ['Osasuna'],
    runnerUp: 'Granada',
    thirdPlace: 'Mallorca'
  },
  {
    season: '2019-20',
    champions: ['Huesca'],
    runnerUp: 'Cádiz'
  },
  {
    season: '2020-21',
    champions: ['RCD Espanyol (Barcelona)'],
    runnerUp: 'RCD Mallorca (Palma de M.)',
    thirdPlace: 'CD Leganés'
  },
  {
    season: '2021-22',
    champions: ['UD Almería'],
    runnerUp: 'Real Valladolid',
    thirdPlace: 'SD Eibar'
  },
  {
    season: '2022-23',
    champions: ['Granada CF'],
    runnerUp: 'UD Las Palmas',
    thirdPlace: 'Levante UD (Valencia)'
  },
  {
    season: '2023-24',
    champions: ['CD Leganés'],
    runnerUp: 'Real Valladolid',
    thirdPlace: 'SD Eibar'
  }
];

function normalizeSeasonLabel(value: string) {
  return value.replace(/[–—]/g, '-').trim();
}

function resolveSeasonYear(value: string) {
  const normalized = normalizeSeasonLabel(value);
  const match = normalized.match(/^(\d{4})(?:-(\d{2}|\d{4}))?$/);

  if (!match) {
    return Number(normalized);
  }

  const startYear = Number(match[1]);
  const endPart = match[2];

  if (!endPart) {
    return startYear;
  }

  const endYear =
    endPart.length === 2 ? Math.floor(startYear / 100) * 100 + Number(endPart) : Number(endPart);

  return endYear < startYear ? endYear + 100 : endYear;
}

function normalizeClubName(name: string) {
  return CLUB_NAME_MAP[name] ?? name;
}

function buildStanding(
  placement: CompetitionStandingPlacement,
  standingOrder: number,
  rawClubName: string | null | undefined
): SeedCompetitionPatch['standings'][number] | null {
  if (!rawClubName) return null;

  const clubName = normalizeClubName(rawClubName);
  if (!INCLUDED_SEGUNDA_CLUB_NAMES.has(clubName)) return null;

  return {
    placement,
    standingOrder,
    clubName
  };
}

export const SPAIN_SEGUNDA_DIVISION_REQUIRED_CLUBS: SeedClub[] = [];

export const SPAIN_SEGUNDA_DIVISION_PATCHES: SeedCompetitionPatch[] = RAW_SEGUNDA_DIVISION_ROWS.map(
  (row) => {
    const season = normalizeSeasonLabel(row.season);
    const standings: SeedCompetitionPatch['standings'] = [
      ...row.champions.map((clubName, index) =>
        buildStanding(CompetitionStandingPlacement.CHAMPION, index + 1, clubName)
      ),
      buildStanding(CompetitionStandingPlacement.RUNNER_UP, 1, row.runnerUp),
      buildStanding(CompetitionStandingPlacement.THIRD_PLACE, 1, row.thirdPlace)
    ].filter((standing): standing is SeedCompetitionPatch['standings'][number] =>
      Boolean(standing)
    );

    return {
      competitionCode: 'SPAIN_SEGUNDA_DIVISION',
      name: season,
      year: resolveSeasonYear(season),
      season,
      standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
      championShare: row.champions.length > 1 ? row.champions.length : null,
      championGroupKey: row.champions.length > 1 ? season : null,
      remark: row.remark ?? null,
      standings
    };
  }
);

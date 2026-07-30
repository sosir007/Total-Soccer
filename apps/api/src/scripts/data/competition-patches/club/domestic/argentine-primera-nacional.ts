import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ARGENTINE_PRIMERA_NACIONAL';
const SOURCE_URL = 'https://en.wikipedia.org/wiki/Primera_Nacional';

export const ARGENTINE_PRIMERA_NACIONAL_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '阿根廷足球乙级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Primera Nacional - Wikipedia',
      url: SOURCE_URL,
      remark: '用于核对 1986-87 以来冠军、亚军和季军表。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本补录只写入当前数据库已存在的阿根廷俱乐部 standings，库外球队对应名次先留空。',
    '2014 赛季无冠军，2019-20 赛季中断/取消冠军，均不写入冠军 standing。',
    '阿乙命中 CLUB_DOMESTIC_LEVEL_2_LEAGUE，结合阿根廷 0.75 系数后实际为冠军 1.5、亚军 0.6、季军 0.375。'
  ]
};

const CLUB_NAME_MAP: Record<string, string> = {
  'Argentinos Juniors': '阿根廷青年人',
  Arsenal: '萨兰迪阿森纳',
  'Defensa y Justicia': '国防与司法',
  'Estudiantes (LP)': '拉普拉塔大学生',
  Independiente: '独立竞技',
  Lanus: '拉努斯',
  Lanús: '拉努斯',
  'River Plate': '河床竞技',
  'Rosario Central': '罗萨里奥中央',
  'Talleres (C)': '塔勒雷斯',
  'Talleres (Córdoba)': '塔勒雷斯'
};

type RawStandingRow = {
  season: string;
  year: number;
  champion?: string | null;
  runnerUp?: string | null;
  thirdPlace?: string | null;
};

const RAW_PRIMERA_NACIONAL_STANDINGS: RawStandingRow[] = [
  {
    season: '1986-87',
    year: 1987,
    champion: 'Deportivo Armenio',
    runnerUp: 'Banfield',
    thirdPlace: 'Belgrano'
  },
  {
    season: '1987-88',
    year: 1988,
    champion: 'Deportivo Mandiyú',
    runnerUp: 'Quilmes',
    thirdPlace: 'Cipolletti'
  },
  {
    season: '1988-89',
    year: 1989,
    champion: 'Chaco For Ever',
    runnerUp: 'Lanús',
    thirdPlace: 'Unión (SF)'
  },
  { season: '1989-90', year: 1990, champion: 'Huracán', runnerUp: 'Lanús', thirdPlace: 'Quilmes' },
  {
    season: '1990-91',
    year: 1991,
    champion: 'Quilmes',
    runnerUp: 'Belgrano',
    thirdPlace: 'San Martín (T)'
  },
  {
    season: '1991-92',
    year: 1992,
    champion: 'Lanús',
    runnerUp: 'Almirante Brown',
    thirdPlace: 'Colón'
  },
  { season: '1992-93', year: 1993, champion: 'Banfield', runnerUp: 'Colón', thirdPlace: null },
  {
    season: '1993-94',
    year: 1994,
    champion: 'Gimnasia y Tiro',
    runnerUp: 'Tiro Federal',
    thirdPlace: 'Instituto'
  },
  {
    season: '1994-95',
    year: 1995,
    champion: 'Estudiantes (LP)',
    runnerUp: 'Atlético de Rafaela',
    thirdPlace: 'Colón'
  },
  {
    season: '1995-96',
    year: 1996,
    champion: 'Huracán Corrientes',
    runnerUp: 'Talleres (C)',
    thirdPlace: 'Instituto'
  },
  {
    season: '1996-97',
    year: 1997,
    champion: 'Argentinos Juniors',
    runnerUp: 'Talleres (C)',
    thirdPlace: 'Chaco For Ever'
  },
  {
    season: '1997-98',
    year: 1998,
    champion: 'Talleres (C)',
    runnerUp: 'Belgrano',
    thirdPlace: null
  },
  {
    season: '1998-99',
    year: 1999,
    champion: 'Instituto',
    runnerUp: 'Chacarita Juniors',
    thirdPlace: null
  },
  {
    season: '1999-00',
    year: 2000,
    champion: 'Huracán',
    runnerUp: 'Los Andes',
    thirdPlace: 'Quilmes'
  },
  { season: '2000-01', year: 2001, champion: 'Banfield', runnerUp: 'Quilmes', thirdPlace: null },
  {
    season: '2001-02',
    year: 2002,
    champion: 'Olimpo',
    runnerUp: 'Quilmes',
    thirdPlace: 'San Martín (M)'
  },
  {
    season: '2002-03',
    year: 2003,
    champion: 'Atlético de Rafaela',
    runnerUp: 'Argentinos Juniors',
    thirdPlace: 'Quilmes'
  },
  {
    season: '2003-04',
    year: 2004,
    champion: 'Instituto',
    runnerUp: 'Almagro',
    thirdPlace: 'Huracán (TA)'
  },
  {
    season: '2004-05',
    year: 2005,
    champion: 'Tiro Federal',
    runnerUp: 'Gimnasia (J)',
    thirdPlace: 'Huracán'
  },
  {
    season: '2005-06',
    year: 2006,
    champion: 'Godoy Cruz',
    runnerUp: 'Nueva Chicago',
    thirdPlace: 'Belgrano'
  },
  {
    season: '2006-07',
    year: 2007,
    champion: 'Olimpo',
    runnerUp: 'San Martín (SJ)',
    thirdPlace: 'Huracán'
  },
  {
    season: '2007-08',
    year: 2008,
    champion: 'San Martín (T)',
    runnerUp: 'Godoy Cruz',
    thirdPlace: 'Unión'
  },
  {
    season: '2008-09',
    year: 2009,
    champion: 'Atlético Tucumán',
    runnerUp: 'Chacarita Juniors',
    thirdPlace: 'Belgrano'
  },
  {
    season: '2009-10',
    year: 2010,
    champion: 'Olimpo',
    runnerUp: 'Quilmes',
    thirdPlace: 'Atlético de Rafaela'
  },
  {
    season: '2010-11',
    year: 2011,
    champion: 'Atlético de Rafaela',
    runnerUp: 'Unión (SF)',
    thirdPlace: 'San Martín (SJ)'
  },
  {
    season: '2011-12',
    year: 2012,
    champion: 'River Plate',
    runnerUp: 'Quilmes',
    thirdPlace: 'Instituto'
  },
  {
    season: '2012-13',
    year: 2013,
    champion: 'Rosario Central',
    runnerUp: 'Gimnasia y Esgrima (LP)',
    thirdPlace: 'Olimpo'
  },
  {
    season: '2013-14',
    year: 2014,
    champion: 'Banfield',
    runnerUp: 'Defensa y Justicia',
    thirdPlace: 'Independiente'
  },
  {
    season: '2015',
    year: 2015,
    champion: 'Atlético Tucumán',
    runnerUp: 'Patronato',
    thirdPlace: 'Ferro Carril Oeste'
  },
  {
    season: '2016',
    year: 2016,
    champion: 'Talleres (C)',
    runnerUp: 'Chacarita Juniors',
    thirdPlace: 'Gimnasia y Esgrima (J)'
  },
  {
    season: '2016-17',
    year: 2017,
    champion: 'Argentinos Juniors',
    runnerUp: 'Chacarita Juniors',
    thirdPlace: 'Guillermo Brown'
  },
  {
    season: '2017-18',
    year: 2018,
    champion: 'Aldosivi',
    runnerUp: 'Almagro',
    thirdPlace: 'San Martín (T)'
  },
  {
    season: '2018-19',
    year: 2019,
    champion: 'Arsenal',
    runnerUp: 'Sarmiento (J)',
    thirdPlace: 'Nueva Chicago'
  },
  {
    season: '2020',
    year: 2020,
    champion: 'Sarmiento (J)',
    runnerUp: 'Estudiantes (RC)',
    thirdPlace: null
  },
  { season: '2021', year: 2021, champion: 'Tigre', runnerUp: 'Barracas Central', thirdPlace: null },
  { season: '2022', year: 2022, champion: 'Belgrano', runnerUp: 'Instituto', thirdPlace: null },
  {
    season: '2023',
    year: 2023,
    champion: 'Independiente Rivadavia',
    runnerUp: 'Almirante Brown',
    thirdPlace: null
  },
  {
    season: '2024',
    year: 2024,
    champion: 'Aldosivi',
    runnerUp: 'San Martín (T)',
    thirdPlace: null
  },
  {
    season: '2025',
    year: 2025,
    champion: 'Gimnasia y Esgrima (M)',
    runnerUp: 'Deportivo Madryn',
    thirdPlace: null
  }
];

function buildRemark(row: RawStandingRow) {
  return `阿根廷第二级别联赛 ${row.season} 赛季名次，系统按俱乐部国内二级联赛计分。`;
}

function toStanding(
  row: RawStandingRow,
  placement: CompetitionStandingPlacement,
  standingOrder: number,
  rawClubName?: string | null
): SeedCompetitionPatch['standings'][number] | null {
  if (!rawClubName) return null;

  const clubName = CLUB_NAME_MAP[rawClubName];
  if (!clubName) return null;

  return {
    placement,
    standingOrder,
    clubName,
    remark: buildRemark(row)
  };
}

export const ARGENTINE_PRIMERA_NACIONAL_PATCHES: SeedCompetitionPatch[] =
  RAW_PRIMERA_NACIONAL_STANDINGS.flatMap((row) => {
    const standings = [
      toStanding(row, CompetitionStandingPlacement.CHAMPION, 1, row.champion),
      toStanding(row, CompetitionStandingPlacement.RUNNER_UP, 2, row.runnerUp),
      toStanding(row, CompetitionStandingPlacement.THIRD_PLACE, 3, row.thirdPlace)
    ].filter((standing): standing is SeedCompetitionPatch['standings'][number] =>
      Boolean(standing)
    );

    if (!standings.length) return [];

    return [
      {
        competitionCode: COMPETITION_CODE,
        name: row.season,
        year: row.year,
        season: row.season,
        externalUrl: SOURCE_URL,
        quantity: null,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        remark: buildRemark(row),
        standings
      }
    ];
  });

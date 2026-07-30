import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import { ARGENTINE_PRIMERA_DIVISION_EXTRA_STANDINGS } from './argentine-primera-division-standings.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

const COMPETITION_CODE = 'ARGENTINE_PRIMERA_DIVISION';
const SOURCE_URL = 'https://www.afa.com.ar/5292/pages/campeones-de-primera-division';

export const ARGENTINE_PRIMERA_DIVISION_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: COMPETITION_CODE,
  name: '阿根廷足球甲级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeones de Primera Division - AFA',
      url: SOURCE_URL,
      remark: '用于核对阿根廷甲级联赛职业时代官方冠军列表。'
    },
    {
      label: 'Argentina - List of Champions - RSSSF',
      url: 'https://www.rsssf.org/tablesa/argchamp.html',
      remark: '用于交叉核对阿根廷甲级联赛职业时代赛制沿革和冠军列表。'
    }
  ],
  lastVerifiedAt: '2026-07-29',
  notes: [
    '本补录只写入当前数据库已存在的阿根廷俱乐部冠军 standings，库外球队对应冠军留空。',
    '原始行保留 AFA 职业时代 1931 年以来全部冠军，用于计算同届冠军数量；实际导出的 patches 只包含能映射到库内俱乐部的冠军。',
    'Metropolitano / Nacional、Apertura / Clausura、2012/13 过渡赛制和 2025 三冠军赛制按 CompetitionEdition.championShare 分摊冠军分。',
    '阿根廷国内一级联赛命中 CLUB_DOMESTIC_LEVEL_1_LEAGUE，结合阿根廷 0.75 系数后常规单冠实际为冠军 6、亚军 2.4、季军 1.5。'
  ]
};

const CLUB_NAME_MAP: Record<string, string> = {
  'Argentinos Juniors': '阿根廷青年人',
  'Arsenal F.C.': '萨兰迪阿森纳',
  'Boca Juniors': '博卡青年',
  Estudiantes: '拉普拉塔大学生',
  'Estudiantes de La Plata': '拉普拉塔大学生',
  Independiente: '独立竞技',
  Lanus: '拉努斯',
  Lanús: '拉努斯',
  'Newells Old Boys': '纽维尔老男孩',
  'Newell´s Old Boys': '纽维尔老男孩',
  'Racing Club': '竞赛',
  'River Plate': '河床竞技',
  'Rosario Central': '罗萨里奥中央',
  'San Lorenzo de Almagro': '圣洛伦索',
  'Talleres (Córdoba)': '塔勒雷斯',
  'Talleres de Córdoba': '塔勒雷斯',
  'Vélez Sarsfield': '萨斯菲尔德',
  'Vélez Sársfield': '萨斯菲尔德'
};

const RAW_AFA_PROFESSIONAL_CHAMPIONS = `
1931 (Liga Argentina de Football)\tBoca Juniors
1932 (Liga Argentina de Football)\tRiver Plate
1933 (Liga Argentina de Football)\tSan Lorenzo de Almagro
1934 (Liga Argentina de Football)\tBoca Juniors
1935\tBoca Juniors
1936 (Copa de Honor)\tSan Lorenzo de Almagro
1936 (Copa Campeonato)\tRiver Plate
1936 (Copa de Oro)\tRiver Plate
1937\tRiver Plate
1938\tIndependiente
1939\tIndependiente
1940\tBoca Juniors
1941\tRiver Plate
1942\tRiver Plate
1943\tBoca Juniors
1944\tBoca Juniors
1945\tRiver Plate
1946\tSan Lorenzo de Almagro
1947\tRiver Plate
1948\tIndependiente
1949\tRacing Club
1950\tRacing Club
1951\tRacing Club
1952\tRiver Plate
1953\tRiver Plate
1954\tBoca Juniors
1955\tRiver Plate
1956\tRiver Plate
1957\tRiver Plate
1958\tRacing Club
1959\tSan Lorenzo de Almagro
1960\tIndependiente
1961\tRacing Club
1962\tBoca Juniors
1963\tIndependiente
1964\tBoca Juniors
1965\tBoca Juniors
1966\tRacing Club
1967 (Metropolitano)\tEstudiantes de La Plata
1967 (Nacional)\tIndependiente
1968 (Metropolitano)\tSan Lorenzo de Almagro
1968 (Nacional)\tVélez Sarsfield
1969 (Metropolitano)\tChacarita Juniors
1969 (Nacional)\tBoca Juniors
1970 (Metropolitano)\tIndependiente
1970 (Nacional)\tBoca Juniors
1971 (Metropolitano)\tIndependiente
1971 (Nacional)\tRosario Central
1972 (Metropolitano)\tSan Lorenzo de Almagro
1972 (Nacional)\tSan Lorenzo de Almagro
1973 (Metropolitano)\tHuracán
1973 (Nacional)\tRosario Central
1974 (Metropolitano)\tNewell´s Old Boys
1974 (Nacional)\tSan Lorenzo de Almagro
1975 (Metropolitano)\tRiver Plate
1975 (Nacional)\tRiver Plate
1976 (Metropolitano)\tBoca Juniors
1976 (Nacional)\tBoca Juniors
1977 (Metropolitano)\tRiver Plate
1977 (Nacional)\tIndependiente
1978 (Metropolitano)\tQuilmes
1978 (Nacional)\tIndependiente
1979 (Metropolitano)\tRiver Plate
1979 (Nacional)\tRiver Plate
1980 (Metropolitano)\tRiver Plate
1980 (Nacional)\tRosario Central
1981 (Metropolitano)\tBoca Juniors
1981 (Nacional)\tRiver Plate
1982 (Metropolitano)\tEstudiantes de La Plata
1982 (Nacional)\tFerro Carril Oeste
1983 (Metropolitano)\tIndependiente
1983 (Nacional)\tEstudiantes de La Plata
1984 (Metropolitano)\tArgentinos Juniors
1984 (Nacional)\tFerro Carril Oeste
1985 (Nacional)\tArgentinos Juniors
1985/86\tRiver Plate
1986/87\tRosario Central
1987/88\tNewell´s Old Boys
1988/89\tIndependiente
1989/90\tRiver Plate
1990/91\tNewell´s Old Boys
1991 (Apertura)\tRiver Plate
1992 (Clausura)\tNewell´s Old Boys
1992 (Apertura)\tBoca Juniors
1993 (Clausura)\tVélez Sarsfield
1993 (Apertura)\tRiver Plate
1994 (Clausura)\tIndependiente
1994 (Apertura)\tRiver Plate
1995 (Clausura)\tSan Lorenzo de Almagro
1995 (Apertura)\tVélez Sarsfield
1996 (Clausura)\tVélez Sarsfield
1996 (Apertura)\tRiver Plate
1997 (Clausura)\tRiver Plate
1997 (Apertura)\tRiver Plate
1998 (Clausura)\tVélez Sarsfield
1998 (Apertura)\tBoca Juniors
1999 (Clausura)\tBoca Juniors
1999 (Apertura)\tRiver Plate
2000 (Clausura)\tRiver Plate
2000 (Apertura)\tBoca Juniors
2001 (Clausura)\tSan Lorenzo de Almagro
2001 (Apertura)\tRacing Club
2002 (Clausura)\tRiver Plate
2002 (Apertura)\tIndependiente
2003 (Clausura)\tRiver Plate
2003 (Apertura)\tBoca Juniors
2004 (Clausura)\tRiver Plate
2004 (Apertura)\tNewell´s Old Boys
2005 (Clausura)\tVélez Sarsfield
2005 (Apertura)\tBoca Juniors
2006 (Clausura)\tBoca Juniors
2006 (Apertura)\tEstudiantes de La Plata
2007 (Clausura)\tSan Lorenzo de Almagro
2007 (Apertura)\tLanús
2008 (Clausura)\tRiver Plate
2008 (Apertura)\tBoca Juniors
2009 (Clausura)\tVélez Sársfield
2009 (Apertura)\tBánfield
2010 (Clausura)\tArgentinos Juniors
2010 (Apertura)\tEstudiantes de La Plata
2011 (Clausura)\tVélez Sársfield
2011 (Apertura)\tBoca Juniors
2012 (Clausura)\tArsenal F.C.
2012 (Torneo Inicial)\tVélez Sarsfield
2013 (Torneo Final)\tNewells Old Boys
2013 (Campeón de Primera División 2012/13)\tVélez Sarsfield
2013 (Torno Inicial)\tSan Lorenzo de Almagro
2014 (Torneo Final)\tRiver Plate
2014 (Torneo Inicial)\tRacing Club
2015 (Campeonato de Primera División)\tBoca Juniors
2016 (Campeonato de Primera División)\tLanús
2017 (Campeón de Primera División 2016/17 )\tBoca Juniors
Superliga 2018\tBoca Juniors
Superliga 2019\tRacing Club
Superliga 2019/2020\tBoca Juniors
Torneo Socios de la Liga Profesional 2021\tRiver Plate
Torneo Binance 2022\tBoca Juniors
Liga Profesional 2023\tRiver Plate
Torneo Betano 2024\tVélez Sarsfield
Torneo Betano Apertura 2025\tPlatense
Liga Profesional Campeón Tabla Anual 2025\tRosario Central
Torneo Betano Clausura 2025\tEstudiantes
Torneo MercadoLibre Apertura 2026\tBelgrano (Córdoba)
`;

type RawChampion = {
  name: string;
  year: number;
  champion: string;
  clubName: string | null;
  championGroupKey: string | null;
  season: string;
};

function normalizeEditionName(name: string) {
  return name.replace('Torno Inicial', 'Torneo Inicial').replace(/\s+\)/g, ')');
}

function resolveEditionYear(name: string) {
  const seasonMatch = name.match(/^(\d{4})\/(\d{2})$/);

  if (seasonMatch) {
    const startYear = Number(seasonMatch[1]);
    const endYearSuffix = Number(seasonMatch[2]);
    const century = Math.floor(startYear / 100) * 100;
    const endYear = century + endYearSuffix;

    return endYear < startYear ? endYear + 100 : endYear;
  }

  if (name.includes('2019/2020')) return 2020;

  const match = name.match(/\d{4}/);
  if (!match) {
    throw new Error(`Argentine Primera Division: cannot resolve year from ${name}.`);
  }

  return Number(match[0]);
}

function resolveChampionGroupKey(name: string, year: number) {
  if (year === 1936 && name.includes('Copa')) return '1936';
  if (year >= 1967 && year <= 1984 && /\((Metropolitano|Nacional)\)/.test(name)) {
    return `${year}`;
  }
  if (year >= 1991 && year <= 2011 && name.includes('(Apertura)')) {
    return `${year}-${String(year + 1).slice(-2)}`;
  }
  if (year >= 1992 && year <= 2012 && name.includes('(Clausura)')) {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
  if (year === 2012 && name.includes('Torneo Inicial')) return '2012-13';
  if (year === 2013 && name.includes('Torneo Final')) return '2012-13';
  if (year === 2013 && name.includes('2012/13')) return '2012-13';
  if (year === 2013 && name.includes('Torneo Inicial')) return '2013-14';
  if (year === 2014 && name.includes('Torneo Final')) return '2013-14';
  if (year === 2014 && name.includes('Torneo Inicial')) return '2014';
  if (year === 2025) return '2025';

  return null;
}

function normalizeYearSpan(value: string) {
  return value.replace(/\b(\d{4})\/(\d{2,4})\b/g, (_, startYear: string, endYear: string) => {
    return `${startYear}-${endYear.slice(-2)}`;
  });
}

function resolveSeasonLabel(name: string, year: number) {
  const normalized = name.replace(/\s+\)/g, ')').trim();
  const parentheticalMatch = normalized.match(/^(\d{4})(?:\/\d{2,4})?\s*\(([^)]+)\)$/);

  if (parentheticalMatch) {
    const baseYear = parentheticalMatch[1];
    const label = parentheticalMatch[2].trim();

    if (label === 'Metropolitano' || label === 'Nacional') {
      return `${baseYear} ${label}`;
    }

    if (label === 'Apertura' || label === 'Clausura') {
      return `${baseYear} ${label}`;
    }

    if (label === 'Liga Argentina de Football') {
      return `${baseYear} LAF`;
    }

    if (label === 'Copa de Honor' || label === 'Copa Campeonato' || label === 'Copa de Oro') {
      return `${baseYear} ${label}`;
    }

    if (label === 'Torneo Inicial') {
      return `${baseYear} Inicial`;
    }

    if (label === 'Torneo Final') {
      return `${baseYear} Final`;
    }

    if (label.includes('Campeón de Primera División')) {
      const seasonMatch = label.match(/\b(\d{4}\/\d{2,4})\b/);
      if (seasonMatch) {
        return normalizeYearSpan(seasonMatch[1]);
      }

      return String(year);
    }

    if (label.includes('Campeonato de Primera División')) {
      return String(year);
    }

    if (/\d{4}\/\d{2,4}/.test(label)) {
      return normalizeYearSpan(label);
    }

    return String(year);
  }

  if (/^Superliga \d{4}\/\d{4}$/.test(normalized)) {
    const season = normalized.replace(/^Superliga\s+/, '');
    return season.replace(/\/(\d{2})(\d{2})$/, '-$2');
  }

  if (normalized === 'Superliga 2018') {
    return '2017-18';
  }

  if (normalized === 'Superliga 2019') {
    return '2018-19';
  }

  if (
    /^Liga Profesional \d{4}$/.test(normalized) ||
    /^Torneo Socios de la Liga Profesional \d{4}$/.test(normalized) ||
    /^Torneo Binance \d{4}$/.test(normalized) ||
    /^Torneo Betano \d{4}$/.test(normalized)
  ) {
    return String(year);
  }

  if (/^Torneo Betano Apertura \d{4}$/.test(normalized)) {
    return `${year} Apertura`;
  }

  if (/^Torneo Betano Clausura \d{4}$/.test(normalized)) {
    return `${year} Clausura`;
  }

  if (/^Liga Profesional Campeón Tabla Anual \d{4}$/.test(normalized)) {
    return `${year} Liga`;
  }

  if (/^Torneo MercadoLibre Apertura \d{4}$/.test(normalized)) {
    return `${year} Apertura`;
  }

  return normalizeYearSpan(normalized)
    .replace(/\s*\(([^)]+)\)/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim();
}

const RAW_CHAMPIONS: RawChampion[] = RAW_AFA_PROFESSIONAL_CHAMPIONS.trim()
  .split('\n')
  .map((line) => {
    const [rawName, champion] = line.split('\t');
    const name = normalizeEditionName(rawName.trim());
    const year = resolveEditionYear(name);

    return {
      name,
      year,
      champion: champion.trim(),
      clubName: CLUB_NAME_MAP[champion.trim()] ?? null,
      championGroupKey: resolveChampionGroupKey(name, year),
      season: resolveSeasonLabel(name, year)
    };
  });

const CHAMPION_SHARE_BY_GROUP = RAW_CHAMPIONS.reduce((map, champion) => {
  if (!champion.championGroupKey) return map;
  map.set(champion.championGroupKey, (map.get(champion.championGroupKey) ?? 0) + 1);
  return map;
}, new Map<string, number>());

function buildRemark(champion: RawChampion, championShare: number | null) {
  const parts = ['阿根廷职业时代顶级联赛冠军，系统按俱乐部国内一级联赛计分。'];

  if (championShare && championShare > 1) {
    parts.push(`同届官方冠军 ${championShare} 个，本冠军按 1/${championShare} 分摊冠军分。`);
  }

  if (!champion.clubName) {
    parts.push(`AFA 原始冠军：${champion.champion}。`);
  }

  return parts.join('');
}

export const ARGENTINE_PRIMERA_DIVISION_PATCHES: SeedCompetitionPatch[] = RAW_CHAMPIONS.flatMap(
  (champion) => {
    const championShare = champion.championGroupKey
      ? (CHAMPION_SHARE_BY_GROUP.get(champion.championGroupKey) ?? 1)
      : 1;
    const extraStanding = ARGENTINE_PRIMERA_DIVISION_EXTRA_STANDINGS[champion.season] ?? null;
    const standings: SeedCompetitionPatch['standings'] = [];

    if (champion.clubName) {
      standings.push({
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: champion.clubName,
        remark: buildRemark(champion, championShare)
      });
    }

    if (extraStanding?.runnerUp) {
      standings.push({
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 2,
        clubName: extraStanding.runnerUp,
        remark: buildRemark(champion, championShare)
      });
    }

    if (extraStanding?.thirdPlace) {
      standings.push({
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 3,
        clubName: extraStanding.thirdPlace,
        remark: buildRemark(champion, championShare)
      });
    }

    if (!standings.length) return [];

    return [
      {
        competitionCode: COMPETITION_CODE,
        name: champion.name,
        year: champion.year,
        season: champion.season,
        externalUrl: SOURCE_URL,
        quantity: null,
        championGroupKey: championShare > 1 ? champion.championGroupKey : null,
        championShare: championShare > 1 ? championShare : null,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        remark: buildRemark(champion, championShare),
        standings
      }
    ];
  }
);

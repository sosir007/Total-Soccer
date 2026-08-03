import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type SpainSuperCupResult = {
  season: string;
  champion: string;
  runnerUp?: string;
  remark?: string;
};

export const SPAIN_SUPER_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SPAIN_SUPER_CUP',
  name: '西班牙超级杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Supercopa de Espana - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_de_Espa%C3%B1a',
      remark: '用于核对 1982-2026 历届冠军、亚军、1986/1987 未举行与四队制变更。'
    },
    {
      label: 'Real Federacion Espanola de Futbol - Supercopa de Espana',
      url: 'https://rfef.es/es/noticias/una-supercopa-mas-y-ya-van-16-para-el-fc-barcelona',
      remark: '用于核对 RFEF 官方历史冠军口径。'
    }
  ],
  lastVerifiedAt: '2026-07-31',
  notes: [
    '本补录只写入当前数据库里已存在的西班牙俱乐部 standings。',
    '1986、1987 未举行，不创建荣誉届次；1984、1989 因同赛季联赛和国王杯双冠自动授予冠军，只录冠军；2019 不单独创建届次。',
    '2020 年起改为四队制，本文件仍只录最终冠军和亚军，不录半决赛负方。',
    '西班牙超级杯命中 CLUB_DOMESTIC_LEVEL_3_CUP，按西班牙国内三级杯赛计分。'
  ]
};

const SUPER_CUP_URL = 'https://en.wikipedia.org/wiki/Supercopa_de_Espa%C3%B1a';

const RAW_SPAIN_SUPER_CUP_RESULTS: SpainSuperCupResult[] = [
  { season: '1982', champion: '皇家社会', runnerUp: '皇家马德里' },
  { season: '1983', champion: '巴塞罗那', runnerUp: '毕尔巴鄂竞技' },
  { season: '1984', champion: '毕尔巴鄂竞技', remark: '联赛和国王杯双冠，自动授予冠军。' },
  { season: '1985', champion: '马德里竞技', runnerUp: '巴塞罗那' },
  { season: '1988', champion: '皇家马德里', runnerUp: '巴塞罗那' },
  { season: '1989', champion: '皇家马德里', remark: '联赛和国王杯双冠，自动授予冠军。' },
  { season: '1990', champion: '皇家马德里', runnerUp: '巴塞罗那' },
  { season: '1991', champion: '巴塞罗那', runnerUp: '马德里竞技' },
  { season: '1992', champion: '巴塞罗那', runnerUp: '马德里竞技' },
  { season: '1993', champion: '皇家马德里', runnerUp: '巴塞罗那' },
  { season: '1994', champion: '巴塞罗那', runnerUp: '萨拉戈萨' },
  { season: '1995', champion: '拉科鲁尼亚', runnerUp: '皇家马德里' },
  { season: '1996', champion: '巴塞罗那', runnerUp: '马德里竞技' },
  { season: '1997', champion: '皇家马德里', runnerUp: '巴塞罗那' },
  { season: '1998', champion: '皇家马略卡', runnerUp: '巴塞罗那' },
  { season: '1999', champion: '瓦伦西亚', runnerUp: '巴塞罗那' },
  { season: '2000', champion: '拉科鲁尼亚', runnerUp: '西班牙人' },
  { season: '2001', champion: '皇家马德里', runnerUp: '萨拉戈萨' },
  { season: '2002', champion: '拉科鲁尼亚', runnerUp: '瓦伦西亚' },
  { season: '2003', champion: '皇家马德里', runnerUp: '皇家马略卡' },
  { season: '2004', champion: '萨拉戈萨', runnerUp: '瓦伦西亚' },
  { season: '2005', champion: '巴塞罗那', runnerUp: '皇家贝蒂斯' },
  { season: '2006', champion: '巴塞罗那', runnerUp: '西班牙人' },
  { season: '2007', champion: '塞维利亚', runnerUp: '皇家马德里' },
  { season: '2008', champion: '皇家马德里', runnerUp: '瓦伦西亚' },
  { season: '2009', champion: '巴塞罗那', runnerUp: '毕尔巴鄂竞技' },
  { season: '2010', champion: '巴塞罗那', runnerUp: '塞维利亚' },
  { season: '2011', champion: '巴塞罗那', runnerUp: '皇家马德里' },
  { season: '2012', champion: '皇家马德里', runnerUp: '巴塞罗那' },
  { season: '2013', champion: '巴塞罗那', runnerUp: '马德里竞技' },
  { season: '2014', champion: '马德里竞技', runnerUp: '皇家马德里' },
  { season: '2015', champion: '毕尔巴鄂竞技', runnerUp: '巴塞罗那' },
  { season: '2016', champion: '巴塞罗那', runnerUp: '塞维利亚' },
  { season: '2017', champion: '皇家马德里', runnerUp: '巴塞罗那' },
  { season: '2018', champion: '巴塞罗那', runnerUp: '塞维利亚' },
  { season: '2020', champion: '皇家马德里', runnerUp: '马德里竞技' },
  { season: '2021', champion: '毕尔巴鄂竞技', runnerUp: '巴塞罗那' },
  { season: '2022', champion: '皇家马德里', runnerUp: '毕尔巴鄂竞技' },
  { season: '2023', champion: '巴塞罗那', runnerUp: '皇家马德里' },
  { season: '2024', champion: '皇家马德里', runnerUp: '巴塞罗那' },
  { season: '2025', champion: '巴塞罗那', runnerUp: '皇家马德里' },
  { season: '2026', champion: '巴塞罗那', runnerUp: '皇家马德里' }
];

function buildStandings(result: SpainSuperCupResult) {
  const standings: SeedStanding[] = [
    {
      placement: CompetitionStandingPlacement.CHAMPION,
      clubName: result.champion
    }
  ];

  if (result.runnerUp) {
    standings.push({
      placement: CompetitionStandingPlacement.RUNNER_UP,
      clubName: result.runnerUp
    });
  }

  return standings;
}

export const SPAIN_SUPER_CUP_PATCHES: SeedCompetitionPatch[] = RAW_SPAIN_SUPER_CUP_RESULTS.map(
  (result) => ({
    competitionCode: 'SPAIN_SUPER_CUP',
    name: result.season,
    year: Number(result.season),
    season: result.season,
    externalUrl: SUPER_CUP_URL,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    standings: buildStandings(result),
    remark: result.remark ?? null
  })
);

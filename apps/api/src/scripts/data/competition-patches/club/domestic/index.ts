import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';

export const CLUB_DOMESTIC_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CLUB_DOMESTIC_PATCH_INDEX',
  name: '俱乐部国内赛事部分荣誉补录索引',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [],
  notes: [
    '俱乐部资料可在此作为通用补录数据维护；赛事 standings 仍按对应赛事文件归档。',
    'seed 只为新俱乐部写入初始资料，不覆盖页面后续编辑的名称、别名或展示状态。'
  ]
};

export const CLUB_DOMESTIC_PATCH_CLUBS: SeedClub[] = [
  {
    uid: '876',
    name: '巴斯蒂亚',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1062',
    name: '白堡',
    alias: '维迪奥顿',
    countryName: '匈牙利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '16046867',
    name: '奥地利萨尔茨堡',
    countryName: '奥地利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

export const CLUB_DOMESTIC_PATCHES: SeedCompetitionPatch[] = [];

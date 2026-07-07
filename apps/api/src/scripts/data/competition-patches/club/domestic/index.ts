import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';

export const CLUB_DOMESTIC_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CLUB_DOMESTIC_PATCH_INDEX',
  name: '俱乐部国内赛事部分荣誉补录索引',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [],
  notes: ['默认索引暂未接入真实俱乐部补录数据；新增赛事补录时按赛事文件导入。']
};

export const CLUB_DOMESTIC_PATCH_CLUBS: SeedClub[] = [];

export const CLUB_DOMESTIC_PATCHES: SeedCompetitionPatch[] = [];

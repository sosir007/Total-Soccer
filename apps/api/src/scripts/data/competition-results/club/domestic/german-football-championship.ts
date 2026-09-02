import type { SeedEdition } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const GERMAN_FOOTBALL_CHAMPIONSHIP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'GERMAN_FOOTBALL_CHAMPIONSHIP',
  name: '德国足球锦标赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'List of German football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_German_football_champions',
      remark: '用于核对 1903-1963 德国全国冠军决赛阶段的冠亚军、停赛年份和无冠军年份。'
    }
  ],
  lastVerifiedAt: '2026-09-02',
  notes: [
    '本文件只负责创建德国足球锦标赛赛事本体，历届 standings 统一走 domestic competition patches。',
    '本赛事为德甲成立前德国全国冠军决赛阶段，不并入德国足球甲级联赛。',
    '1904、1922 为无冠军年份；1915-1919、1945-1947 为停赛年份；均不生成荣誉 standings。',
    '东德足球冠军不纳入本赛事，后续如需录入应单独建东德足球高级联赛或对应赛事。',
    '系统按德国国内一级联赛处理，但每届只按可确认决赛冠亚军录入。'
  ]
};

export const GERMAN_FOOTBALL_CHAMPIONSHIP_RESULTS: SeedEdition[] = [];

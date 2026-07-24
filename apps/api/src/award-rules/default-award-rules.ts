import { AwardScopeType } from '@prisma/client';

export interface AwardRuleDefaultDefinition {
  code: string;
  name: string;
  scopeType: AwardScopeType;
  category: string;
  placement?: string;
  rank?: number;
  baseScore: number;
  coefficient: number;
  topAward: boolean;
  enabled: boolean;
  sortOrder: number;
  remark?: string;
}

type RankedCategoryOptions = {
  codePrefix: string;
  namePrefix: string;
  scopeType: AwardScopeType;
  category: string;
  baseScore: number;
  sortOrder: number;
  topAwardFirst?: boolean;
  remark?: string;
};

const RANKS = [
  { label: '第一名', rank: 1, coefficient: 1 },
  { label: '第二名', rank: 2, coefficient: 0.5 },
  { label: '第三名', rank: 3, coefficient: 0.3 }
];

function rankedCategory({
  codePrefix,
  namePrefix,
  scopeType,
  category,
  baseScore,
  sortOrder,
  topAwardFirst = false,
  remark
}: RankedCategoryOptions): AwardRuleDefaultDefinition[] {
  return [
    {
      code: `${codePrefix}_WINNER`,
      name: `${namePrefix}获奖`,
      scopeType,
      category,
      baseScore,
      coefficient: 1,
      topAward: topAwardFirst,
      enabled: true,
      sortOrder,
      remark
    },
    ...RANKS.map((rank, index) => ({
      code: `${codePrefix}_RANK_${rank.rank}`,
      name: `${namePrefix}${rank.label}`,
      scopeType,
      category,
      rank: rank.rank,
      baseScore,
      coefficient: rank.coefficient,
      topAward: topAwardFirst && rank.rank === 1,
      enabled: true,
      sortOrder: sortOrder + index + 1,
      remark
    }))
  ];
}

function selectionRule({
  code,
  name,
  scopeType,
  category,
  baseScore,
  sortOrder,
  remark
}: {
  code: string;
  name: string;
  scopeType: AwardScopeType;
  category: string;
  baseScore: number;
  sortOrder: number;
  remark?: string;
}): AwardRuleDefaultDefinition {
  return {
    code,
    name,
    scopeType,
    category,
    baseScore,
    coefficient: 1,
    topAward: false,
    enabled: true,
    sortOrder,
    remark
  };
}

export const DEFAULT_AWARD_RULES: AwardRuleDefaultDefinition[] = [
  ...rankedCategory({
    codePrefix: 'WORLD_ANNUAL_LEVEL_1_OVERALL',
    namePrefix: '国际一级综合奖',
    scopeType: AwardScopeType.WORLD,
    category: '国际一级综合奖',
    baseScore: 6,
    sortOrder: 1000,
    topAwardFirst: true,
    remark: '金球奖、世界足球先生、The Best 等国际年度顶级综合奖。'
  }),
  selectionRule({
    code: 'WORLD_ANNUAL_LEVEL_2_XI_SELECTED',
    name: '国际二级阵容奖入选',
    scopeType: AwardScopeType.WORLD,
    category: '国际二级阵容奖',
    baseScore: 6,
    sortOrder: 1010,
    remark: 'FIFPRO World 11、FIFA 年度最佳阵容等。'
  }),
  ...rankedCategory({
    codePrefix: 'WORLD_ANNUAL_LEVEL_2_GOALKEEPER',
    namePrefix: '国际二级门将专项奖',
    scopeType: AwardScopeType.WORLD,
    category: '国际二级门将专项奖',
    baseScore: 6,
    sortOrder: 1020,
    remark: '与同年国际最佳阵容重叠时，重算阶段专项奖折半。'
  }),
  ...rankedCategory({
    codePrefix: 'WORLD_ANNUAL_LEVEL_3_SUPPLEMENT',
    namePrefix: '国际三级补充奖',
    scopeType: AwardScopeType.WORLD,
    category: '国际三级补充奖',
    baseScore: 3,
    sortOrder: 1030
  }),

  ...rankedCategory({
    codePrefix: 'WORLD_CUP_LEVEL_1_OVERALL',
    namePrefix: '世界杯一级综合奖',
    scopeType: AwardScopeType.WORLD,
    category: '世界杯一级综合奖',
    baseScore: 6,
    sortOrder: 2000
  }),
  selectionRule({
    code: 'WORLD_CUP_LEVEL_2_XI_SELECTED',
    name: '世界杯二级阵容奖入选',
    scopeType: AwardScopeType.WORLD,
    category: '世界杯二级阵容奖',
    baseScore: 6,
    sortOrder: 2010
  }),
  ...rankedCategory({
    codePrefix: 'WORLD_CUP_LEVEL_2_SPECIALTY',
    namePrefix: '世界杯二级专项奖',
    scopeType: AwardScopeType.WORLD,
    category: '世界杯二级专项奖',
    baseScore: 6,
    sortOrder: 2020,
    remark: '金靴、银靴、铜靴等。与同届世界杯最佳阵容重叠时，重算阶段专项奖折半。'
  }),
  ...rankedCategory({
    codePrefix: 'WORLD_CUP_LEVEL_2_GOALKEEPER',
    namePrefix: '世界杯二级门将专项奖',
    scopeType: AwardScopeType.WORLD,
    category: '世界杯二级门将专项奖',
    baseScore: 6,
    sortOrder: 2030,
    remark: '金手套 / 雅辛奖。与同届世界杯最佳阵容重叠时，重算阶段专项奖折半。'
  }),
  ...rankedCategory({
    codePrefix: 'WORLD_CUP_LEVEL_3_SUPPLEMENT',
    namePrefix: '世界杯三级补充奖',
    scopeType: AwardScopeType.WORLD,
    category: '世界杯三级补充奖',
    baseScore: 3,
    sortOrder: 2040
  }),

  ...rankedCategory({
    codePrefix: 'CONFEDERATION_CUP_LEVEL_1_OVERALL',
    namePrefix: '洲际杯一级综合奖',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际杯一级综合奖',
    baseScore: 5,
    sortOrder: 3000
  }),
  selectionRule({
    code: 'CONFEDERATION_CUP_LEVEL_2_XI_SELECTED',
    name: '洲际杯二级阵容奖入选',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际杯二级阵容奖',
    baseScore: 5,
    sortOrder: 3010
  }),
  ...rankedCategory({
    codePrefix: 'CONFEDERATION_CUP_LEVEL_2_SPECIALTY',
    namePrefix: '洲际杯二级专项奖',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际杯二级专项奖',
    baseScore: 5,
    sortOrder: 3020,
    remark: '最佳射手、最佳门将等。与同届赛事最佳阵容重叠时，重算阶段专项奖折半。'
  }),
  ...rankedCategory({
    codePrefix: 'CONFEDERATION_CUP_LEVEL_3_SUPPLEMENT',
    namePrefix: '洲际杯三级补充奖',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际杯三级补充奖',
    baseScore: 2.5,
    sortOrder: 3030
  }),

  ...rankedCategory({
    codePrefix: 'CLUB_GLOBAL_LEVEL_1_OVERALL',
    namePrefix: '俱乐部国际赛事一级综合奖',
    scopeType: AwardScopeType.CLUB,
    category: '俱乐部国际赛事一级综合奖',
    baseScore: 4,
    sortOrder: 3500
  }),
  selectionRule({
    code: 'CLUB_GLOBAL_LEVEL_2_XI_SELECTED',
    name: '俱乐部国际赛事二级阵容奖入选',
    scopeType: AwardScopeType.CLUB,
    category: '俱乐部国际赛事二级阵容奖',
    baseScore: 4,
    sortOrder: 3510
  }),
  ...rankedCategory({
    codePrefix: 'CLUB_GLOBAL_LEVEL_2_SPECIALTY',
    namePrefix: '俱乐部国际赛事二级专项奖',
    scopeType: AwardScopeType.CLUB,
    category: '俱乐部国际赛事二级专项奖',
    baseScore: 4,
    sortOrder: 3520
  }),
  ...rankedCategory({
    codePrefix: 'CLUB_GLOBAL_LEVEL_3_SPECIALTY',
    namePrefix: '俱乐部国际赛事三级专项奖',
    scopeType: AwardScopeType.CLUB,
    category: '俱乐部国际赛事三级专项奖',
    baseScore: 2,
    sortOrder: 3530
  }),
  ...rankedCategory({
    codePrefix: 'CLUB_GLOBAL_LEVEL_3_SUPPLEMENT',
    namePrefix: '俱乐部国际赛事三级补充奖',
    scopeType: AwardScopeType.CLUB,
    category: '俱乐部国际赛事三级补充奖',
    baseScore: 2,
    sortOrder: 3540
  }),

  ...rankedCategory({
    codePrefix: 'CONFEDERATION_ANNUAL_LEVEL_1_OVERALL',
    namePrefix: '洲际一级综合奖',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际一级综合奖',
    baseScore: 4,
    sortOrder: 4000
  }),
  selectionRule({
    code: 'CONFEDERATION_ANNUAL_LEVEL_2_XI_SELECTED',
    name: '洲际二级阵容奖入选',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际二级阵容奖',
    baseScore: 4,
    sortOrder: 4010
  }),
  ...rankedCategory({
    codePrefix: 'CONFEDERATION_ANNUAL_LEVEL_2_GOALKEEPER',
    namePrefix: '洲际二级门将专项奖',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际二级门将专项奖',
    baseScore: 4,
    sortOrder: 4020
  }),
  ...rankedCategory({
    codePrefix: 'CONFEDERATION_ANNUAL_LEVEL_3_SUPPLEMENT',
    namePrefix: '洲际三级补充奖',
    scopeType: AwardScopeType.CONFEDERATION,
    category: '洲际三级补充奖',
    baseScore: 2,
    sortOrder: 4030
  }),

  ...rankedCategory({
    codePrefix: 'CLUB_CONTINENTAL_LEVEL_1_OVERALL',
    namePrefix: '洲联一级综合奖',
    scopeType: AwardScopeType.CLUB,
    category: '洲联一级综合奖',
    baseScore: 4,
    sortOrder: 5000
  }),
  selectionRule({
    code: 'CLUB_CONTINENTAL_LEVEL_2_XI_SELECTED',
    name: '洲联二级阵容奖入选',
    scopeType: AwardScopeType.CLUB,
    category: '洲联二级阵容奖',
    baseScore: 4,
    sortOrder: 5010
  }),
  ...rankedCategory({
    codePrefix: 'CLUB_CONTINENTAL_LEVEL_2_SPECIALTY',
    namePrefix: '洲联二级专项奖',
    scopeType: AwardScopeType.CLUB,
    category: '洲联二级专项奖',
    baseScore: 4,
    sortOrder: 5020
  }),
  ...rankedCategory({
    codePrefix: 'CLUB_CONTINENTAL_LEVEL_3_SUPPLEMENT',
    namePrefix: '洲联三级补充奖',
    scopeType: AwardScopeType.CLUB,
    category: '洲联三级补充奖',
    baseScore: 2,
    sortOrder: 5030
  }),

  ...rankedCategory({
    codePrefix: 'LEAGUE_TOP_LEVEL_1_OVERALL',
    namePrefix: '国联一级综合奖',
    scopeType: AwardScopeType.LEAGUE,
    category: '国联一级综合奖',
    baseScore: 3,
    sortOrder: 6000
  }),
  selectionRule({
    code: 'LEAGUE_TOP_LEVEL_2_XI_SELECTED',
    name: '国联二级阵容奖入选',
    scopeType: AwardScopeType.LEAGUE,
    category: '国联二级阵容奖',
    baseScore: 2,
    sortOrder: 6010
  }),
  ...rankedCategory({
    codePrefix: 'LEAGUE_TOP_LEVEL_2_SPECIALTY',
    namePrefix: '国联二级专项奖',
    scopeType: AwardScopeType.LEAGUE,
    category: '国联二级专项奖',
    baseScore: 2,
    sortOrder: 6020
  }),
  ...rankedCategory({
    codePrefix: 'LEAGUE_TOP_LEVEL_3_SUPPLEMENT',
    namePrefix: '国联三级补充奖',
    scopeType: AwardScopeType.LEAGUE,
    category: '国联三级补充奖',
    baseScore: 1,
    sortOrder: 6030
  }),

  ...rankedCategory({
    codePrefix: 'COUNTRY_ANNUAL_LEVEL_1_OVERALL',
    namePrefix: '国家一级综合奖',
    scopeType: AwardScopeType.COUNTRY,
    category: '国家一级综合奖',
    baseScore: 2,
    sortOrder: 7000
  }),

  ...rankedCategory({
    codePrefix: 'LEAGUE_SECOND_LEVEL_1_OVERALL',
    namePrefix: '二级国联一级综合奖',
    scopeType: AwardScopeType.LEAGUE,
    category: '二级国联一级综合奖',
    baseScore: 1,
    sortOrder: 8000
  }),
  selectionRule({
    code: 'LEAGUE_SECOND_LEVEL_2_XI_SELECTED',
    name: '二级国联二级阵容奖入选',
    scopeType: AwardScopeType.LEAGUE,
    category: '二级国联二级阵容奖',
    baseScore: 1,
    sortOrder: 8010
  }),
  ...rankedCategory({
    codePrefix: 'LEAGUE_SECOND_LEVEL_2_SPECIALTY',
    namePrefix: '二级国联二级专项奖',
    scopeType: AwardScopeType.LEAGUE,
    category: '二级国联二级专项奖',
    baseScore: 1,
    sortOrder: 8020
  }),
  ...rankedCategory({
    codePrefix: 'LEAGUE_SECOND_LEVEL_3_SUPPLEMENT',
    namePrefix: '二级国联三级补充奖',
    scopeType: AwardScopeType.LEAGUE,
    category: '二级国联三级补充奖',
    baseScore: 0.5,
    sortOrder: 8030
  }),

  ...rankedCategory({
    codePrefix: 'DOMESTIC_CUP_LEVEL_1',
    namePrefix: '国杯一级奖',
    scopeType: AwardScopeType.CLUB,
    category: '国杯一级奖',
    baseScore: 1,
    sortOrder: 9000
  }),
  selectionRule({
    code: 'MEDIA_EXTRA_WHITELIST_SELECTED',
    name: '附加分白名单奖项',
    scopeType: AwardScopeType.MEDIA,
    category: '附加分',
    baseScore: 1,
    sortOrder: 10000,
    remark: '只用于白名单内的权威补充奖。'
  })
];

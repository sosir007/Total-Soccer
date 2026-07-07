import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type SemiFinalistCompetitionResult
} from '../../../../helpers/competition-results.js';
import { TWO_LEG_SEMI_FINALIST_REMARK } from '../../../../helpers/competition-remarks.js';

export const OCEANIA_CUP_REMARK = '本届为大洋洲国家杯前身 Oceania Cup，按实际名次录入。';
export const FINAL_ROUND_REMARK =
  '本届为最终阶段循环赛排名，前两名另进行两回合决赛；季军、殿军按最终阶段排名录入。';
export const WORLD_CUP_QUALIFIER_REMARK =
  '本届同时作为世界杯预选赛阶段，按最终循环赛排名录入冠亚季殿。';

export const OFC_NATIONS_CUP_RESULTS: Array<
  TopFourCompetitionResult | SemiFinalistCompetitionResult
> = [
  {
    year: 1973,
    host: '新西兰',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: OCEANIA_CUP_REMARK,
    champion: '新西兰',
    runnerUp: '塔希提',
    thirdPlace: '新喀里多尼亚',
    fourthPlace: '新赫布里底'
  },
  {
    year: 1980,
    host: '新喀里多尼亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: OCEANIA_CUP_REMARK,
    champion: '澳大利亚',
    runnerUp: '塔希提',
    thirdPlace: '新喀里多尼亚',
    fourthPlace: '斐济'
  },
  {
    year: 1996,
    host: '主客场',
    quantity: 4,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    remark: TWO_LEG_SEMI_FINALIST_REMARK,
    champion: '澳大利亚',
    runnerUp: '塔希提',
    semiFinalists: ['新西兰', '所罗门群岛']
  },
  {
    year: 1998,
    host: '澳大利亚',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '新西兰',
    runnerUp: '澳大利亚',
    thirdPlace: '斐济',
    fourthPlace: '塔希提'
  },
  {
    year: 2000,
    host: '塔希提',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '澳大利亚',
    runnerUp: '新西兰',
    thirdPlace: '所罗门群岛',
    fourthPlace: '瓦努阿图'
  },
  {
    year: 2002,
    host: '新西兰',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '新西兰',
    runnerUp: '澳大利亚',
    thirdPlace: '塔希提',
    fourthPlace: '瓦努阿图'
  },
  {
    year: 2004,
    host: '澳大利亚',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: FINAL_ROUND_REMARK,
    champion: '澳大利亚',
    runnerUp: '所罗门群岛',
    thirdPlace: '新西兰',
    fourthPlace: '斐济'
  },
  {
    year: 2008,
    host: '主客场',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: WORLD_CUP_QUALIFIER_REMARK,
    champion: '新西兰',
    runnerUp: '新喀里多尼亚',
    thirdPlace: '斐济',
    fourthPlace: '瓦努阿图'
  },
  {
    year: 2012,
    host: '所罗门群岛',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '塔希提',
    runnerUp: '新喀里多尼亚',
    thirdPlace: '新西兰',
    fourthPlace: '所罗门群岛'
  },
  {
    year: 2016,
    host: '巴布亚新几内亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '新西兰',
    runnerUp: '巴布亚新几内亚',
    semiFinalists: ['新喀里多尼亚', '所罗门群岛']
  },
  {
    year: 2024,
    host: '瓦努阿图',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '新西兰',
    runnerUp: '瓦努阿图',
    thirdPlace: '塔希提',
    fourthPlace: '斐济'
  }
];

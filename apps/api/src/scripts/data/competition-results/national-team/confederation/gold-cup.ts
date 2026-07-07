import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type TopThreeCompetitionResult,
  type SemiFinalistCompetitionResult
} from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const GOLD_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CONCACAF_GOLD_CUP',
  name: '中北美及加勒比海金杯赛',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'confederation',
  sources: [
    {
      label: 'Concacaf Gold Cup official site',
      url: 'https://www.concacaf.com/gold-cup/',
      remark: '用于确认金杯赛官方赛事归属和当前官方赛事页面。'
    },
    {
      label: 'CONCACAF Gold Cup - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/CONCACAF_Gold_Cup',
      remark: '用于交叉核对历届主办地、冠军、亚军、三四名赛或四强、参赛队数量。'
    },
    {
      label: 'CONCACAF Gold Cup records and statistics - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/CONCACAF_Gold_Cup_records_and_statistics',
      remark: '用于交叉核对球队历届表现和前身赛事统计。'
    },
    {
      label: '2025 CONCACAF Gold Cup final - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2025_CONCACAF_Gold_Cup_final',
      remark: '用于核对最近一届决赛结果。'
    }
  ],
  lastVerifiedAt: '2026-07-07',
  notes: [
    '1963-1989 为金杯赛前身 CONCACAF Championship，按系统同一赛事口径录入，并在届次备注中说明。',
    '1973、1977、1981、1985、1989 同时作为世界杯预选赛最终阶段，其中 1985 只录前三。',
    '2000、2005、2007、2009、2011、2013、2017、2019、2021、2023、2025 无三四名赛，按冠军、亚军、两个四强录入。',
    '2015 有三四名赛，按冠军、亚军、季军、殿军录入。',
    '荷属安的列斯作为历史/特殊国家保留独立录入口径；受邀球队按实际 standings 归属到对应国家。'
  ]
};

export const PREDECESSOR_REMARK =
  '本届为中北美及加勒比海金杯赛前身 CONCACAF Championship，按最终排名录入冠亚季殿。';
export const WORLD_CUP_QUALIFIER_REMARK =
  '本届为中北美及加勒比海金杯赛前身 CONCACAF Championship，同时作为世界杯预选赛最终阶段，按最终排名录入冠亚季殿。';
export const WORLD_CUP_QUALIFIER_TOP_THREE_REMARK =
  '本届为中北美及加勒比海金杯赛前身 CONCACAF Championship，同时作为世界杯预选赛最终阶段，最终阶段只有前三名，按前三录入。';
export const SHARED_THIRD_REMARK = '本届无三四名赛，哥斯达黎加和牙买加并列第三，按两个四强录入。';

export const GOLD_CUP_RESULTS: Array<
  TopFourCompetitionResult | TopThreeCompetitionResult | SemiFinalistCompetitionResult
> = [
  {
    year: 1963,
    host: '萨尔瓦多',
    quantity: 9,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: PREDECESSOR_REMARK,
    champion: '哥斯达黎加',
    runnerUp: '萨尔瓦多',
    thirdPlace: '荷属安的列斯',
    fourthPlace: '洪都拉斯'
  },
  {
    year: 1965,
    host: '危地马拉',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: PREDECESSOR_REMARK,
    champion: '墨西哥',
    runnerUp: '危地马拉',
    thirdPlace: '哥斯达黎加',
    fourthPlace: '萨尔瓦多'
  },
  {
    year: 1967,
    host: '洪都拉斯',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: PREDECESSOR_REMARK,
    champion: '危地马拉',
    runnerUp: '墨西哥',
    thirdPlace: '洪都拉斯',
    fourthPlace: '特立尼达和多巴哥'
  },
  {
    year: 1969,
    host: '哥斯达黎加',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: PREDECESSOR_REMARK,
    champion: '哥斯达黎加',
    runnerUp: '危地马拉',
    thirdPlace: '荷属安的列斯',
    fourthPlace: '墨西哥'
  },
  {
    year: 1971,
    host: '特立尼达和多巴哥',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: PREDECESSOR_REMARK,
    champion: '墨西哥',
    runnerUp: '海地',
    thirdPlace: '哥斯达黎加',
    fourthPlace: '古巴'
  },
  {
    year: 1973,
    host: '海地',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: WORLD_CUP_QUALIFIER_REMARK,
    champion: '海地',
    runnerUp: '特立尼达和多巴哥',
    thirdPlace: '墨西哥',
    fourthPlace: '洪都拉斯'
  },
  {
    year: 1977,
    host: '墨西哥',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: WORLD_CUP_QUALIFIER_REMARK,
    champion: '墨西哥',
    runnerUp: '海地',
    thirdPlace: '萨尔瓦多',
    fourthPlace: '加拿大'
  },
  {
    year: 1981,
    host: '洪都拉斯',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: WORLD_CUP_QUALIFIER_REMARK,
    champion: '洪都拉斯',
    runnerUp: '萨尔瓦多',
    thirdPlace: '墨西哥',
    fourthPlace: '加拿大'
  },
  {
    year: 1985,
    host: '北美',
    quantity: 9,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: WORLD_CUP_QUALIFIER_TOP_THREE_REMARK,
    champion: '加拿大',
    runnerUp: '洪都拉斯',
    thirdPlace: '哥斯达黎加'
  },
  {
    year: 1989,
    host: '北美',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: WORLD_CUP_QUALIFIER_REMARK,
    champion: '哥斯达黎加',
    runnerUp: '美国',
    thirdPlace: '特立尼达和多巴哥',
    fourthPlace: '危地马拉'
  },
  {
    year: 1991,
    host: '美国',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '美国',
    runnerUp: '洪都拉斯',
    thirdPlace: '墨西哥',
    fourthPlace: '哥斯达黎加'
  },
  {
    year: 1993,
    host: '美国 / 墨西哥',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    remark: SHARED_THIRD_REMARK,
    champion: '墨西哥',
    runnerUp: '美国',
    semiFinalists: ['哥斯达黎加', '牙买加']
  },
  {
    year: 1996,
    host: '美国',
    quantity: 9,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '墨西哥',
    runnerUp: '巴西',
    thirdPlace: '美国',
    fourthPlace: '危地马拉'
  },
  {
    year: 1998,
    host: '美国',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '墨西哥',
    runnerUp: '美国',
    thirdPlace: '巴西',
    fourthPlace: '牙买加'
  },
  {
    year: 2000,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '加拿大',
    runnerUp: '哥伦比亚',
    semiFinalists: ['特立尼达和多巴哥', '秘鲁']
  },
  {
    year: 2002,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '美国',
    runnerUp: '哥斯达黎加',
    thirdPlace: '加拿大',
    fourthPlace: '韩国'
  },
  {
    year: 2003,
    host: '美国 / 墨西哥',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '墨西哥',
    runnerUp: '巴西',
    thirdPlace: '美国',
    fourthPlace: '哥斯达黎加'
  },
  {
    year: 2005,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '美国',
    runnerUp: '巴拿马',
    semiFinalists: ['洪都拉斯', '哥伦比亚']
  },
  {
    year: 2007,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '美国',
    runnerUp: '墨西哥',
    semiFinalists: ['加拿大', '瓜德罗普']
  },
  {
    year: 2009,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '墨西哥',
    runnerUp: '美国',
    semiFinalists: ['哥斯达黎加', '洪都拉斯']
  },
  {
    year: 2011,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '墨西哥',
    runnerUp: '美国',
    semiFinalists: ['巴拿马', '洪都拉斯']
  },
  {
    year: 2013,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '美国',
    runnerUp: '巴拿马',
    semiFinalists: ['墨西哥', '洪都拉斯']
  },
  {
    year: 2015,
    host: '美国 / 加拿大',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '墨西哥',
    runnerUp: '牙买加',
    thirdPlace: '巴拿马',
    fourthPlace: '美国'
  },
  {
    year: 2017,
    host: '美国',
    quantity: 12,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '美国',
    runnerUp: '牙买加',
    semiFinalists: ['墨西哥', '哥斯达黎加']
  },
  {
    year: 2019,
    host: '美国 / 哥斯达黎加 / 牙买加',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '墨西哥',
    runnerUp: '美国',
    semiFinalists: ['海地', '牙买加']
  },
  {
    year: 2021,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '美国',
    runnerUp: '墨西哥',
    semiFinalists: ['卡塔尔', '加拿大']
  },
  {
    year: 2023,
    host: '美国 / 加拿大',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '墨西哥',
    runnerUp: '巴拿马',
    semiFinalists: ['美国', '牙买加']
  },
  {
    year: 2025,
    host: '美国 / 加拿大',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '墨西哥',
    runnerUp: '美国',
    semiFinalists: ['危地马拉', '洪都拉斯']
  }
];

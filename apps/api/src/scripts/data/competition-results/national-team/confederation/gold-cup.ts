import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type TopThreeCompetitionResult,
  type SemiFinalistCompetitionResult
} from '../../../../helpers/competition-results.js';

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

import { CompetitionEditionStandingMode } from '@prisma/client';
import {
  type TopFourCompetitionResult,
  type TopThreeCompetitionResult
} from '../../../../helpers/competition-results.js';
import {
  FINAL_ROUND_TOP_FOUR_REMARK,
  THREE_TEAM_TOP_THREE_REMARK,
  THREE_TEAM_ROUND_ROBIN_TOP_THREE_REMARK
} from '../../../../helpers/competition-remarks.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const AFRICA_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'AFRICA_CUP',
  name: '非洲国家杯',
  dataKind: 'competition-results',
  target: 'national-team',
  scope: 'confederation',
  sources: [
    {
      label: 'CAF Africa Cup of Nations',
      url: 'https://www.cafonline.com/africa-cup-of-nations/',
      remark: '用于确认非洲国家杯官方赛事归属和当前官方赛事页面。'
    },
    {
      label: 'Africa Cup of Nations - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/Africa_Cup_of_Nations',
      remark: '用于交叉核对历届主办地、冠军、亚军、季军/殿军、参赛队数量。'
    },
    {
      label: 'Africa Cup of Nations records and statistics - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Africa_Cup_of_Nations_records_and_statistics',
      remark: '用于交叉核对历届前四名和球队汇总统计。'
    },
    {
      label: '2025 Africa Cup of Nations - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2025_Africa_Cup_of_Nations',
      remark: '用于核对 2025 届官方判罚口径和争议备注。'
    }
  ],
  lastVerifiedAt: '2026-07-07',
  notes: [
    '1957 为 3 队/特殊淘汰赛口径，只录冠军、亚军、季军。',
    '1959 为 3 队循环赛，按最终前三排名录入。',
    '1976 为最终阶段循环赛，按前四排名录入冠亚季殿，并在届次备注中说明不是实际决赛/三四名赛。',
    '阿拉伯联合共和国继承到埃及；扎伊尔、刚果金沙萨继承到民主刚果。',
    '2025 按当前 CAF 判罚后的官方冠军口径录入；若后续 CAS 或 CAF 再变更，需要单独修正该届数据和备注。'
  ]
};

export const CAF_AWARDED_REMARK =
  '本届决赛原场上结果存在争议，当前按 CAF 判罚后的官方冠军口径录入。';

export const AFRICA_CUP_RESULTS: Array<TopFourCompetitionResult | TopThreeCompetitionResult> = [
  {
    year: 1957,
    host: '苏丹',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: THREE_TEAM_TOP_THREE_REMARK,
    champion: '埃及',
    runnerUp: '埃塞俄比亚',
    thirdPlace: '苏丹'
  },
  {
    year: 1959,
    host: '阿拉伯联合共和国',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: THREE_TEAM_ROUND_ROBIN_TOP_THREE_REMARK,
    champion: '阿拉伯联合共和国',
    runnerUp: '苏丹',
    thirdPlace: '埃塞俄比亚'
  },
  {
    year: 1962,
    host: '埃塞俄比亚',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃塞俄比亚',
    runnerUp: '阿拉伯联合共和国',
    thirdPlace: '突尼斯',
    fourthPlace: '乌干达'
  },
  {
    year: 1963,
    host: '加纳',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '苏丹',
    thirdPlace: '阿拉伯联合共和国',
    fourthPlace: '埃塞俄比亚'
  },
  {
    year: 1965,
    host: '突尼斯',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '突尼斯',
    thirdPlace: '科特迪瓦',
    fourthPlace: '塞内加尔'
  },
  {
    year: 1968,
    host: '埃塞俄比亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '刚果金沙萨',
    runnerUp: '加纳',
    thirdPlace: '科特迪瓦',
    fourthPlace: '埃塞俄比亚'
  },
  {
    year: 1970,
    host: '苏丹',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏丹',
    runnerUp: '加纳',
    thirdPlace: '阿拉伯联合共和国',
    fourthPlace: '科特迪瓦'
  },
  {
    year: 1972,
    host: '喀麦隆',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '刚果',
    runnerUp: '马里',
    thirdPlace: '喀麦隆',
    fourthPlace: '扎伊尔'
  },
  {
    year: 1974,
    host: '埃及',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '扎伊尔',
    runnerUp: '赞比亚',
    thirdPlace: '埃及',
    fourthPlace: '刚果'
  },
  {
    year: 1976,
    host: '埃塞俄比亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: FINAL_ROUND_TOP_FOUR_REMARK,
    champion: '摩洛哥',
    runnerUp: '几内亚',
    thirdPlace: '尼日利亚',
    fourthPlace: '埃及'
  },
  {
    year: 1978,
    host: '加纳',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '乌干达',
    thirdPlace: '尼日利亚',
    fourthPlace: '突尼斯'
  },
  {
    year: 1980,
    host: '尼日利亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '阿尔及利亚',
    thirdPlace: '摩洛哥',
    fourthPlace: '埃及'
  },
  {
    year: 1982,
    host: '利比亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '加纳',
    runnerUp: '利比亚',
    thirdPlace: '赞比亚',
    fourthPlace: '阿尔及利亚'
  },
  {
    year: 1984,
    host: '科特迪瓦',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '尼日利亚',
    thirdPlace: '阿尔及利亚',
    fourthPlace: '埃及'
  },
  {
    year: 1986,
    host: '埃及',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '喀麦隆',
    thirdPlace: '科特迪瓦',
    fourthPlace: '摩洛哥'
  },
  {
    year: 1988,
    host: '摩洛哥',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '尼日利亚',
    thirdPlace: '阿尔及利亚',
    fourthPlace: '摩洛哥'
  },
  {
    year: 1990,
    host: '阿尔及利亚',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿尔及利亚',
    runnerUp: '尼日利亚',
    thirdPlace: '赞比亚',
    fourthPlace: '塞内加尔'
  },
  {
    year: 1992,
    host: '塞内加尔',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科特迪瓦',
    runnerUp: '加纳',
    thirdPlace: '尼日利亚',
    fourthPlace: '喀麦隆'
  },
  {
    year: 1994,
    host: '突尼斯',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '赞比亚',
    thirdPlace: '科特迪瓦',
    fourthPlace: '马里'
  },
  {
    year: 1996,
    host: '南非',
    quantity: 15,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '南非',
    runnerUp: '突尼斯',
    thirdPlace: '赞比亚',
    fourthPlace: '加纳'
  },
  {
    year: 1998,
    host: '布基纳法索',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '南非',
    thirdPlace: '民主刚果',
    fourthPlace: '布基纳法索'
  },
  {
    year: 2000,
    host: '加纳 / 尼日利亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '尼日利亚',
    thirdPlace: '南非',
    fourthPlace: '突尼斯'
  },
  {
    year: 2002,
    host: '马里',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '塞内加尔',
    thirdPlace: '尼日利亚',
    fourthPlace: '马里'
  },
  {
    year: 2004,
    host: '突尼斯',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '突尼斯',
    runnerUp: '摩洛哥',
    thirdPlace: '尼日利亚',
    fourthPlace: '马里'
  },
  {
    year: 2006,
    host: '埃及',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '科特迪瓦',
    thirdPlace: '尼日利亚',
    fourthPlace: '塞内加尔'
  },
  {
    year: 2008,
    host: '加纳',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '喀麦隆',
    thirdPlace: '加纳',
    fourthPlace: '科特迪瓦'
  },
  {
    year: 2010,
    host: '安哥拉',
    quantity: 15,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '埃及',
    runnerUp: '加纳',
    thirdPlace: '尼日利亚',
    fourthPlace: '阿尔及利亚'
  },
  {
    year: 2012,
    host: '赤道几内亚 / 加蓬',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '赞比亚',
    runnerUp: '科特迪瓦',
    thirdPlace: '马里',
    fourthPlace: '加纳'
  },
  {
    year: 2013,
    host: '南非',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '布基纳法索',
    thirdPlace: '马里',
    fourthPlace: '加纳'
  },
  {
    year: 2015,
    host: '赤道几内亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科特迪瓦',
    runnerUp: '加纳',
    thirdPlace: '民主刚果',
    fourthPlace: '赤道几内亚'
  },
  {
    year: 2017,
    host: '加蓬',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '埃及',
    thirdPlace: '布基纳法索',
    fourthPlace: '加纳'
  },
  {
    year: 2019,
    host: '埃及',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿尔及利亚',
    runnerUp: '塞内加尔',
    thirdPlace: '尼日利亚',
    fourthPlace: '突尼斯'
  },
  {
    year: 2021,
    host: '喀麦隆',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '塞内加尔',
    runnerUp: '埃及',
    thirdPlace: '喀麦隆',
    fourthPlace: '布基纳法索'
  },
  {
    year: 2023,
    host: '科特迪瓦',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科特迪瓦',
    runnerUp: '尼日利亚',
    thirdPlace: '南非',
    fourthPlace: '民主刚果'
  },
  {
    year: 2025,
    host: '摩洛哥',
    quantity: 24,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: CAF_AWARDED_REMARK,
    champion: '摩洛哥',
    runnerUp: '塞内加尔',
    thirdPlace: '尼日利亚',
    fourthPlace: '埃及'
  }
];

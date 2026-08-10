import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CupOfTheAlpsResult = FinalOnlyCompetitionResult & {
  score: string;
  note?: string;
};

export const CUP_OF_THE_ALPS_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CUP_OF_THE_ALPS',
  name: '阿尔卑斯杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'custom',
  sources: [
    {
      label: 'Cup of the Alps - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Cup_of_the_Alps',
      remark: '用于核对赛事沿革和停办状态。'
    },
    {
      label: 'Cup of the Alps - RSSSF',
      url: 'https://www.rsssf.org/tablesa/alpencup.html',
      remark: '用于核对 1962-1987 俱乐部参赛阶段的历届冠亚军。'
    }
  ],
  lastVerifiedAt: '2026-08-10',
  notes: [
    'RSSSF 说明 1960、1961 为联赛代表队赛事，1962 起俱乐部参赛；本文件只录入 1962-1987 俱乐部阶段。',
    '1965、1986 未举办；赛事 1987 年后停办。',
    '赛事按俱乐部其他二级杯赛处理，只记录冠军和亚军。',
    '截至 2026-08-10，1962-1987 俱乐部阶段冠亚军已按当前口径完整录入。'
  ]
};

export const CUP_OF_THE_ALPS_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1132', name: '热那亚', countryName: '意大利', confederationCode: 'UEFA' },
  {
    uid: '852',
    name: '格勒诺布尔',
    englishName: 'Grenoble',
    countryName: '法国',
    confederationCode: 'UEFA'
  },
  { uid: '1139', name: '尤文图斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1106', name: '亚特兰大', countryName: '意大利', confederationCode: 'UEFA' },
  {
    uid: '2193',
    name: '卡塔尼亚',
    englishName: 'Catania',
    countryName: '意大利',
    confederationCode: 'UEFA'
  },
  { uid: '1150', name: '那不勒斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '912', name: '法兰克福', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '955', name: '慕尼黑1860', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '920', name: '沙尔克04', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '1849', name: '巴塞尔', countryName: '瑞士', confederationCode: 'UEFA' },
  { uid: '1111', name: '博洛尼亚', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1129', name: '佛罗伦萨', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1140', name: '拉齐奥', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '860', name: '尼姆', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '851', name: '波尔多', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '1858', name: '塞尔维特', countryName: '瑞士', confederationCode: 'UEFA' },
  {
    uid: '1856',
    name: '洛桑体育',
    englishName: 'Lausanne-Sport',
    countryName: '瑞士',
    confederationCode: 'UEFA'
  },
  {
    uid: '1847',
    name: '伯尔尼年轻人',
    englishName: 'Young Boys',
    countryName: '瑞士',
    confederationCode: 'UEFA'
  },
  { uid: '2047', name: '兰斯', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '876', name: '巴斯蒂亚', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '826', name: '摩纳哥', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '844', name: '梅斯', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '2009', name: '索肖', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '846', name: '南特', countryName: '法国', confederationCode: 'UEFA' },
  {
    uid: '1857',
    name: '纳沙泰尔萨马克斯',
    englishName: 'Neuchâtel Xamax',
    shortName: '纳沙泰尔',
    countryName: '瑞士',
    confederationCode: 'UEFA'
  },
  { uid: '824', name: '欧塞尔', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '1855', name: '草蜢', countryName: '瑞士', confederationCode: 'UEFA' }
].map((club) => ({
  ...club,
  visibleInCatalog: false
}));

const SEEDED_CLUB_NAMES = new Set(CUP_OF_THE_ALPS_REQUIRED_CLUBS.map((club) => club.name));

const RAW_CUP_OF_THE_ALPS_RESULTS: CupOfTheAlpsResult[] = [
  {
    year: 1962,
    host: '意大利热那亚',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '热那亚',
    runnerUp: '格勒诺布尔',
    score: '1-0',
    remark: '决赛热那亚 1-0 格勒诺布尔。'
  },
  {
    year: 1963,
    host: '瑞士日内瓦',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '尤文图斯',
    runnerUp: '亚特兰大',
    score: '3-2',
    remark: '决赛尤文图斯 3-2 亚特兰大。'
  },
  {
    year: 1964,
    host: '瑞士伯尔尼',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '热那亚',
    runnerUp: '卡塔尼亚',
    score: '2-0',
    remark: '决赛热那亚 2-0 卡塔尼亚。'
  },
  {
    year: 1966,
    host: '小组赛制',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '那不勒斯',
    runnerUp: '尤文图斯',
    score: '-',
    remark: 'RSSSF 标注为小组赛制，最终那不勒斯冠军、尤文图斯亚军。'
  },
  {
    year: 1967,
    host: '小组赛制',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '法兰克福',
    runnerUp: '慕尼黑1860',
    score: '-',
    remark: 'RSSSF 标注为小组赛制，最终法兰克福冠军、慕尼黑1860亚军。'
  },
  {
    year: 1968,
    host: '瑞士巴塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '沙尔克04',
    runnerUp: '巴塞尔',
    score: '3-1',
    remark: '决赛沙尔克04 3-1 巴塞尔，加时。'
  },
  {
    year: 1969,
    host: '瑞士巴塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '巴塞尔',
    runnerUp: '博洛尼亚',
    score: '3-1',
    remark: '决赛巴塞尔 3-1 博洛尼亚。'
  },
  {
    year: 1970,
    host: '瑞士巴塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '巴塞尔',
    runnerUp: '佛罗伦萨',
    score: '3-2',
    remark: '决赛巴塞尔 3-2 佛罗伦萨。'
  },
  {
    year: 1971,
    host: '瑞士巴塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '拉齐奥',
    runnerUp: '巴塞尔',
    score: '3-1',
    remark: '决赛拉齐奥 3-1 巴塞尔。'
  },
  {
    year: 1972,
    host: '法国尼姆',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '尼姆',
    runnerUp: '波尔多',
    score: '7-2',
    remark: '决赛尼姆 7-2 波尔多。'
  },
  {
    year: 1973,
    host: '瑞士日内瓦',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '塞尔维特',
    runnerUp: '洛桑体育',
    score: '1-0',
    remark: '决赛塞尔维特 1-0 洛桑体育。'
  },
  {
    year: 1974,
    host: '瑞士巴塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '伯尔尼年轻人',
    runnerUp: '巴塞尔',
    score: '2-1',
    remark: '决赛伯尔尼年轻人 2-1 巴塞尔。'
  },
  {
    year: 1975,
    host: '瑞士日内瓦',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '塞尔维特',
    runnerUp: '巴塞尔',
    score: '3-0',
    remark: '决赛塞尔维特 3-0 巴塞尔。'
  },
  {
    year: 1976,
    host: '瑞士日内瓦',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '塞尔维特',
    runnerUp: '尼姆',
    score: '2-1',
    remark: '决赛塞尔维特 2-1 尼姆。'
  },
  {
    year: 1977,
    host: '法国兰斯',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '兰斯',
    runnerUp: '巴斯蒂亚',
    score: '3-1',
    remark: '决赛兰斯 3-1 巴斯蒂亚。'
  },
  {
    year: 1978,
    host: '瑞士日内瓦',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '塞尔维特',
    runnerUp: '洛桑体育',
    score: '4-0',
    remark: '决赛塞尔维特 4-0 洛桑体育。'
  },
  {
    year: 1979,
    host: '法国梅斯',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '摩纳哥',
    runnerUp: '梅斯',
    score: '3-1',
    remark: '决赛摩纳哥 3-1 梅斯。'
  },
  {
    year: 1980,
    host: '法国波尔多',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '波尔多',
    runnerUp: '尼姆',
    score: '3-0',
    remark: '决赛波尔多 3-0 尼姆。'
  },
  {
    year: 1981,
    host: '瑞士巴塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '巴塞尔',
    runnerUp: '索肖',
    score: '2-2，点球 5-3',
    remark: '决赛巴塞尔 2-2 索肖，加时后点球 5-3。'
  },
  {
    year: 1982,
    host: '瑞士纳沙泰尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '南特',
    runnerUp: '纳沙泰尔萨马克斯',
    score: '1-0',
    remark: '决赛南特 1-0 纳沙泰尔萨马克斯。'
  },
  {
    year: 1983,
    host: '摩纳哥',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '摩纳哥',
    runnerUp: '欧塞尔',
    score: '2-1',
    remark: '决赛摩纳哥 2-1 欧塞尔。'
  },
  {
    year: 1984,
    host: '瑞士苏黎世',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '摩纳哥',
    runnerUp: '草蜢',
    score: '2-0',
    remark: '1984 届决赛于 1985-05-22 进行，摩纳哥 2-0 草蜢。'
  },
  {
    year: 1985,
    host: '法国欧塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '欧塞尔',
    runnerUp: '摩纳哥',
    score: '1-0',
    remark: '1985 届决赛于 1986-01-05 进行，欧塞尔 1-0 摩纳哥。'
  },
  {
    year: 1987,
    host: '法国欧塞尔',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '欧塞尔',
    runnerUp: '草蜢',
    score: '3-1',
    remark: '决赛欧塞尔 3-1 草蜢。'
  }
];

export const CUP_OF_THE_ALPS_RESULTS: CupOfTheAlpsResult[] = RAW_CUP_OF_THE_ALPS_RESULTS.map(
  (result) => {
    const missingTeams = [result.champion, result.runnerUp].filter(
      (clubName) => !SEEDED_CLUB_NAMES.has(clubName)
    );

    return {
      ...result,
      name: `${result.year}年`,
      remark: [
        result.remark,
        missingTeams.length ? `未录入当前库缺失俱乐部：${missingTeams.join('、')}。` : null
      ]
        .filter(Boolean)
        .join(' ')
    };
  }
);

export function buildCupOfTheAlpsStandings(result: CupOfTheAlpsResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ].filter((standing) => standing.clubName && SEEDED_CLUB_NAMES.has(standing.clubName));
}

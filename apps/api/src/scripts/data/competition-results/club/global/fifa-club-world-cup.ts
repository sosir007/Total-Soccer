import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type ClubWorldCupResult = SeedEdition & {
  mode?: CompetitionEditionStandingMode;
  champion?: string;
  runnerUp?: string;
  thirdPlace?: string;
  fourthPlace?: string;
  semiFinalists?: [string?, string?];
};

const CLUB_WORLD_CUP_REFERENCE_CLUBS = [
  'AC米兰',
  '博卡青年',
  '切尔西',
  '利物浦',
  '国际米兰',
  '曼联',
  '圣保罗',
  '内卡萨',
  '萨普里萨',
  '开罗国民',
  '墨西哥美洲',
  '大阪钢巴',
  '亚特兰特',
  '沙希尔星',
  '基多大学',
  '桑托斯',
  '柏太阳神',
  '马赞姆贝',
  '城南FC',
  '萨德',
  '拜仁慕尼黑',
  '卡萨布兰卡拉贾',
  '米内罗竞技',
  '蓝十字',
  '皇家马德里',
  '巴塞罗那',
  '阿布扎比半岛',
  '阿尔艾因',
  '河床竞技',
  '格雷米奥',
  '弗拉门戈',
  '帕尔梅拉斯',
  '新莱昂自治大学老虎',
  '曼城',
  '巴黎圣日耳曼',
  '科林蒂安',
  '瓦斯科达伽马',
  '吉达联合',
  '巴西国际',
  '浦和红钻',
  '帕丘卡',
  '拉普拉塔大学生',
  '浦项制铁',
  '蒙特雷',
  '广州队',
  '圣洛伦索',
  '奥克兰城',
  '广岛三箭',
  '鹿岛鹿角',
  '国民竞技',
  '利雅得新月',
  '弗鲁米嫩塞'
] as const;

const HIDDEN_CATALOG_CLUBS = new Set([
  '科林蒂安',
  '瓦斯科达伽马',
  '吉达联合',
  '巴西国际',
  '浦和红钻',
  '帕丘卡',
  '拉普拉塔大学生',
  '浦项制铁',
  '蒙特雷',
  '广州队',
  '圣洛伦索',
  '奥克兰城',
  '广岛三箭',
  '鹿岛鹿角',
  '国民竞技',
  '利雅得新月',
  '弗鲁米嫩塞',
  '内卡萨',
  '萨普里萨',
  '开罗国民',
  '沙希尔星',
  '基多大学',
  '马赞姆贝',
  '城南FC',
  '萨德',
  '阿布扎比半岛',
  '卡萨布兰卡拉贾',
  '阿尔艾因'
]);

export const FIFA_CLUB_WORLD_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'FIFA_CLUB_WORLD_CUP',
  name: '国际足联俱乐部世界杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'global',
  sources: [
    {
      label: 'FIFA Club World Cup - Wikipedia results table',
      url: 'https://en.wikipedia.org/wiki/FIFA_Club_World_Cup',
      remark: '用于核对 2000、2005-2023、2025 届次冠军、亚军、季军/殿军或四强。'
    },
    {
      label: '2025 FIFA Club World Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2025_FIFA_Club_World_Cup',
      remark: '用于核对 2025 新赛制、参赛数量、决赛和四强口径。'
    }
  ],
  lastVerifiedAt: '2026-07-09',
  notes: [
    '2001-2004 未举办，不录入。',
    '2024 国际足联洲际杯不并入世俱杯。',
    '2000、2005-2023 按冠军、亚军、季军、殿军录入。',
    '2025 新世俱杯无三四名赛，按冠军、亚军、两个四强录入。'
  ]
};

export const FIFA_CLUB_WORLD_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1099', name: 'AC米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '630', name: '切尔西', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '676', name: '利物浦', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1135', name: '国际米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '680', name: '曼联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '1258',
    name: '内卡萨',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '102367',
    name: '萨普里萨',
    countryName: '哥斯达黎加',
    confederationCode: 'CONCACAF'
  },
  {
    uid: '106756',
    name: '开罗国民',
    countryName: '埃及',
    confederationCode: 'CAF'
  },
  { uid: '1253', name: '墨西哥美洲', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '1186', name: '大阪钢巴', countryName: '日本', confederationCode: 'AFC' },
  { uid: '102356', name: '亚特兰特', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  {
    uid: '131255',
    name: '沙希尔星',
    countryName: '突尼斯',
    confederationCode: 'CAF'
  },
  {
    uid: '5270338',
    name: '基多大学',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL'
  },
  { uid: '335', name: '桑托斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1190', name: '柏太阳神', countryName: '日本', confederationCode: 'AFC' },
  {
    uid: '5341691',
    name: '马赞姆贝',
    countryName: '民主刚果',
    confederationCode: 'CAF'
  },
  {
    uid: '200373',
    name: '城南FC',
    countryName: '韩国',
    confederationCode: 'AFC',
    formerName: '城南一和天马'
  },
  {
    uid: '102853',
    name: '萨德',
    countryName: '卡塔尔',
    confederationCode: 'AFC'
  },
  { uid: '915', name: '拜仁慕尼黑', countryName: '德国', confederationCode: 'UEFA' },
  {
    uid: '1201011',
    name: '卡萨布兰卡拉贾',
    countryName: '摩洛哥',
    confederationCode: 'CAF'
  },
  { uid: '314', name: '米内罗竞技', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1254', name: '蓝十字', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '1736', name: '皇家马德里', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1708', name: '巴塞罗那', countryName: '西班牙', confederationCode: 'UEFA' },
  {
    uid: '135450',
    name: '阿布扎比半岛',
    countryName: '阿联酋',
    confederationCode: 'AFC'
  },
  {
    uid: '950376',
    name: '阿尔艾因',
    countryName: '阿联酋',
    confederationCode: 'AFC'
  },
  { uid: '93', name: '河床竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '324', name: '格雷米奥', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '329', name: '帕尔梅拉斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '1260',
    name: '新莱昂自治大学老虎',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    alias: '老虎大学'
  },
  { uid: '679', name: '曼城', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '868', name: '巴黎圣日耳曼', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '316', name: '科林蒂安', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '339', name: '瓦斯科达伽马', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '106063', name: '吉达联合', countryName: '沙特阿拉伯', confederationCode: 'AFC' },
  { uid: '326', name: '巴西国际', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1195', name: '浦和红钻', countryName: '日本', confederationCode: 'AFC' },
  { uid: '116204', name: '帕丘卡', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '85', name: '拉普拉塔大学生', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '106818', name: '浦项制铁', countryName: '韩国', confederationCode: 'AFC' },
  { uid: '1257', name: '蒙特雷', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  {
    uid: '409',
    name: '广州队',
    countryName: '中国',
    confederationCode: 'AFC',
    formerName: '广州恒大',
    remark: '曾用名：广州恒大'
  },
  { uid: '96', name: '圣洛伦索', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1301557', name: '奥克兰城', countryName: '新西兰', confederationCode: 'OFC' },
  { uid: '1193', name: '广岛三箭', countryName: '日本', confederationCode: 'AFC' },
  { uid: '1189', name: '鹿岛鹿角', countryName: '日本', confederationCode: 'AFC' },
  { uid: '427', name: '国民竞技', countryName: '哥伦比亚', confederationCode: 'CONMEBOL' },
  { uid: '102852', name: '利雅得新月', countryName: '沙特阿拉伯', confederationCode: 'AFC' },
  { uid: '323', name: '弗鲁米嫩塞', countryName: '巴西', confederationCode: 'CONMEBOL' }
].map((club) => ({
  ...club,
  visibleInCatalog: HIDDEN_CATALOG_CLUBS.has(club.name) ? false : undefined
}));

export const FIFA_CLUB_WORLD_CUP_RESULTS: ClubWorldCupResult[] = [
  {
    year: 2000,
    host: '巴西',
    quantity: 8,
    champion: '科林蒂安',
    runnerUp: '瓦斯科达伽马',
    thirdPlace: '内卡萨',
    fourthPlace: '皇家马德里'
  },
  {
    year: 2005,
    host: '日本',
    quantity: 6,
    champion: '圣保罗',
    runnerUp: '利物浦',
    thirdPlace: '萨普里萨',
    fourthPlace: '吉达联合'
  },
  {
    year: 2006,
    host: '日本',
    quantity: 6,
    champion: '巴西国际',
    runnerUp: '巴塞罗那',
    thirdPlace: '开罗国民',
    fourthPlace: '墨西哥美洲'
  },
  {
    year: 2007,
    host: '日本',
    quantity: 7,
    champion: 'AC米兰',
    runnerUp: '博卡青年',
    thirdPlace: '浦和红钻',
    fourthPlace: '沙希尔星'
  },
  {
    year: 2008,
    host: '日本',
    quantity: 7,
    champion: '曼联',
    runnerUp: '基多大学',
    thirdPlace: '大阪钢巴',
    fourthPlace: '帕丘卡'
  },
  {
    year: 2009,
    host: '阿联酋',
    quantity: 7,
    champion: '巴塞罗那',
    runnerUp: '拉普拉塔大学生',
    thirdPlace: '浦项制铁',
    fourthPlace: '亚特兰特'
  },
  {
    year: 2010,
    host: '阿联酋',
    quantity: 7,
    champion: '国际米兰',
    runnerUp: '马赞姆贝',
    thirdPlace: '巴西国际',
    fourthPlace: '城南FC'
  },
  {
    year: 2011,
    host: '日本',
    quantity: 7,
    champion: '巴塞罗那',
    runnerUp: '桑托斯',
    thirdPlace: '萨德',
    fourthPlace: '柏太阳神'
  },
  {
    year: 2012,
    host: '日本',
    quantity: 7,
    champion: '科林蒂安',
    runnerUp: '切尔西',
    thirdPlace: '蒙特雷',
    fourthPlace: '开罗国民'
  },
  {
    year: 2013,
    host: '摩洛哥',
    quantity: 7,
    champion: '拜仁慕尼黑',
    runnerUp: '卡萨布兰卡拉贾',
    thirdPlace: '米内罗竞技',
    fourthPlace: '广州队'
  },
  {
    year: 2014,
    host: '摩洛哥',
    quantity: 7,
    champion: '皇家马德里',
    runnerUp: '圣洛伦索',
    thirdPlace: '奥克兰城',
    fourthPlace: '蓝十字'
  },
  {
    year: 2015,
    host: '日本',
    quantity: 7,
    champion: '巴塞罗那',
    runnerUp: '河床竞技',
    thirdPlace: '广岛三箭',
    fourthPlace: '广州队'
  },
  {
    year: 2016,
    host: '日本',
    quantity: 7,
    champion: '皇家马德里',
    runnerUp: '鹿岛鹿角',
    thirdPlace: '国民竞技',
    fourthPlace: '墨西哥美洲'
  },
  {
    year: 2017,
    host: '阿联酋',
    quantity: 7,
    champion: '皇家马德里',
    runnerUp: '格雷米奥',
    thirdPlace: '帕丘卡',
    fourthPlace: '阿布扎比半岛'
  },
  {
    year: 2018,
    host: '阿联酋',
    quantity: 7,
    champion: '皇家马德里',
    runnerUp: '阿尔艾因',
    thirdPlace: '河床竞技',
    fourthPlace: '鹿岛鹿角'
  },
  {
    year: 2019,
    host: '卡塔尔',
    quantity: 7,
    champion: '利物浦',
    runnerUp: '弗拉门戈',
    thirdPlace: '蒙特雷',
    fourthPlace: '利雅得新月'
  },
  {
    year: 2020,
    host: '卡塔尔',
    quantity: 6,
    remark: '2020 届实际于 2021 年举办。',
    champion: '拜仁慕尼黑',
    runnerUp: '新莱昂自治大学老虎',
    thirdPlace: '开罗国民',
    fourthPlace: '帕尔梅拉斯'
  },
  {
    year: 2021,
    host: '阿联酋',
    quantity: 7,
    champion: '切尔西',
    runnerUp: '帕尔梅拉斯',
    thirdPlace: '开罗国民',
    fourthPlace: '利雅得新月'
  },
  {
    year: 2022,
    host: '摩洛哥',
    quantity: 7,
    remark: '2022 届实际于 2023 年举办。',
    champion: '皇家马德里',
    runnerUp: '利雅得新月',
    thirdPlace: '弗拉门戈',
    fourthPlace: '开罗国民'
  },
  {
    year: 2023,
    host: '沙特阿拉伯',
    quantity: 7,
    champion: '曼城',
    runnerUp: '弗鲁米嫩塞',
    thirdPlace: '开罗国民',
    fourthPlace: '浦和红钻'
  },
  {
    year: 2025,
    host: '美国',
    quantity: 32,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    standingMode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '切尔西',
    runnerUp: '巴黎圣日耳曼',
    semiFinalists: ['皇家马德里', '弗鲁米嫩塞']
  }
];

export function buildClubWorldCupStandings(result: ClubWorldCupResult): SeedStanding[] {
  const rows: SeedStanding[] = [];
  const add = (
    placement: CompetitionStandingPlacement,
    clubName: string | undefined,
    standingOrder = 0
  ) => {
    if (!clubName) {
      return;
    }

    if (!CLUB_WORLD_CUP_REFERENCE_CLUBS.includes(clubName as never)) {
      return;
    }

    rows.push({ placement, clubName, standingOrder });
  };

  add(CompetitionStandingPlacement.CHAMPION, result.champion);
  add(CompetitionStandingPlacement.RUNNER_UP, result.runnerUp);
  add(CompetitionStandingPlacement.THIRD_PLACE, result.thirdPlace);
  add(CompetitionStandingPlacement.FOURTH_PLACE, result.fourthPlace);
  result.semiFinalists?.forEach((clubName, index) => {
    add(CompetitionStandingPlacement.SEMI_FINALIST, clubName, index + 1);
  });

  return rows;
}

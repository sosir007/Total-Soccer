import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const CAF_CONFEDERATION = { uid: '1', code: 'CAF', name: '非足联', sortOrder: 10 };

const REQUIRED_COUNTRIES = [
  { uid: '5', name: '阿尔及利亚' },
  { uid: '9', name: '布基纳法索' },
  { uid: '11', name: '喀麦隆' },
  { uid: '16', name: '埃及' },
  { uid: '17', name: '赤道几内亚' },
  { uid: '18', name: '埃塞俄比亚' },
  { uid: '21', name: '加纳' },
  { uid: '22', name: '几内亚' },
  { uid: '24', name: '科特迪瓦' },
  { uid: '28', name: '利比亚' },
  { uid: '31', name: '马里' },
  { uid: '34', name: '摩洛哥' },
  { uid: '38', name: '尼日利亚' },
  { uid: '41', name: '塞内加尔' },
  { uid: '45', name: '南非' },
  { uid: '46', name: '苏丹' },
  { uid: '49', name: '刚果' },
  { uid: '51', name: '突尼斯' },
  { uid: '52', name: '乌干达' },
  { uid: '53', name: '民主刚果' },
  { uid: '54', name: '赞比亚' }
];

const HISTORICAL_COUNTRIES = [
  { uid: '-', name: '阿拉伯联合共和国', successorNames: ['埃及'], redirectName: '埃及' },
  { uid: '-', name: '刚果金沙萨', successorNames: ['民主刚果'], redirectName: '民主刚果' },
  { uid: '-', name: '扎伊尔', successorNames: ['民主刚果'], redirectName: '民主刚果' }
];

const THREE_TEAM_REMARK = '本届只有 3 支球队完成比赛，按前三名录入；无第四名。';
const ROUND_ROBIN_REMARK = '本届为 3 队循环赛最终排名，按前三名录入；无第四名。';
const FINAL_ROUND_REMARK =
  '本届为最终阶段循环赛排名，按前四排名录入冠亚季殿；并非实际决赛或三四名赛。';
const CAF_AWARDED_REMARK = '本届决赛原场上结果存在争议，当前按 CAF 判罚后的官方冠军口径录入。';

type BaseAfricaCupResult = {
  year: number;
  host: string;
  quantity: number;
  remark?: string;
};

type TopFourAfricaCupResult = BaseAfricaCupResult & {
  mode: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

type TopThreeAfricaCupResult = BaseAfricaCupResult & {
  mode: typeof CompetitionEditionStandingMode.LEAGUE_TOP_THREE;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
};

const AFRICA_CUP_RESULTS: Array<TopFourAfricaCupResult | TopThreeAfricaCupResult> = [
  {
    year: 1957,
    host: '苏丹',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: THREE_TEAM_REMARK,
    champion: '埃及',
    runnerUp: '埃塞俄比亚',
    thirdPlace: '苏丹'
  },
  {
    year: 1959,
    host: '阿拉伯联合共和国',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: ROUND_ROBIN_REMARK,
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
    remark: FINAL_ROUND_REMARK,
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

async function main() {
  const countries = new Map<string, { id: string; name: string }>();
  const confederation = await prisma.confederation.upsert({
    where: { uid: CAF_CONFEDERATION.uid },
    create: CAF_CONFEDERATION,
    update: {
      code: CAF_CONFEDERATION.code,
      name: CAF_CONFEDERATION.name,
      sortOrder: CAF_CONFEDERATION.sortOrder
    },
    select: { id: true, name: true }
  });

  for (const countryData of REQUIRED_COUNTRIES) {
    const country = await upsertCountry({
      ...countryData,
      confederationId: confederation.id,
      confederationName: confederation.name,
      isHistorical: false,
      visibleInCatalogForNew: false
    });
    countries.set(country.name, country);
  }

  for (const item of HISTORICAL_COUNTRIES) {
    const country = await upsertCountry({
      uid: item.uid,
      name: item.name,
      confederationId: confederation.id,
      confederationName: confederation.name,
      isHistorical: true,
      visibleInCatalogForNew: false,
      detailRedirectCountryId: item.redirectName ? countries.get(item.redirectName)?.id : null
    });
    countries.set(country.name, country);
  }

  for (const item of HISTORICAL_COUNTRIES) {
    const historical = countries.get(item.name);

    if (!historical) {
      continue;
    }

    await prisma.countrySuccessor.deleteMany({
      where: { historicalCountryId: historical.id }
    });

    for (const successorName of item.successorNames) {
      const successor = countries.get(successorName);

      if (!successor) {
        continue;
      }

      await prisma.countrySuccessor.create({
        data: {
          historicalCountryId: historical.id,
          successorCountryId: successor.id
        }
      });
    }
  }

  const africaCup = await prisma.competition.upsert({
    where: { code: 'AFRICA_CUP' },
    create: {
      code: 'AFRICA_CUP',
      name: '非洲国家杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      description: '非洲足联主办的男子国家队最高级别洲际杯赛。',
      confederationId: confederation.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 35
    },
    update: {
      name: '非洲国家杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      confederationId: confederation.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 35
    },
    select: { id: true }
  });

  await prisma.competitionScopeConfederation.deleteMany({
    where: {
      competitionId: africaCup.id,
      confederationId: { not: confederation.id }
    }
  });

  await prisma.competitionScopeConfederation.upsert({
    where: {
      competitionId_confederationId: {
        competitionId: africaCup.id,
        confederationId: confederation.id
      }
    },
    create: {
      competitionId: africaCup.id,
      confederationId: confederation.id
    },
    update: {}
  });

  for (const result of AFRICA_CUP_RESULTS) {
    const editionName = `${result.year}年`;
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: africaCup.id,
          name: editionName
        }
      },
      create: {
        competitionId: africaCup.id,
        name: editionName,
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: result.mode,
        remark: result.remark ?? null
      },
      update: {
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: result.mode,
        remark: result.remark ?? null
      },
      select: { id: true }
    });

    await prisma.competitionStanding.deleteMany({
      where: { editionId: edition.id }
    });

    await prisma.competitionStanding.createMany({
      data: buildStandings(result).flatMap(({ placement, countryName }) => {
        const country = countries.get(countryName);

        if (!country) {
          console.warn(`Skip ${editionName} ${countryName}: country not found.`);
          return [];
        }

        return [
          {
            editionId: edition.id,
            placement,
            countryId: country.id
          }
        ];
      })
    });
  }

  console.log('Africa Cup seed completed.');
}

function buildStandings(result: TopFourAfricaCupResult | TopThreeAfricaCupResult) {
  const standings: Array<{
    placement: CompetitionStandingPlacement;
    countryName: string;
  }> = [
    { placement: CompetitionStandingPlacement.CHAMPION, countryName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, countryName: result.runnerUp },
    { placement: CompetitionStandingPlacement.THIRD_PLACE, countryName: result.thirdPlace }
  ];

  if (result.mode === CompetitionEditionStandingMode.THIRD_PLACE_MATCH) {
    standings.push({
      placement: CompetitionStandingPlacement.FOURTH_PLACE,
      countryName: result.fourthPlace
    });
  }

  return standings;
}

async function upsertCountry(input: {
  uid: string;
  name: string;
  confederationId: string | null;
  confederationName: string | null;
  isHistorical: boolean;
  visibleInCatalogForNew: boolean;
  detailRedirectCountryId?: string | null;
}) {
  const existing = await findExistingCountry(input.uid, input.name);
  const uidSort = toUidSort(input.uid);

  if (existing) {
    return prisma.country.update({
      where: { id: existing.id },
      data: {
        uid: existing.uid === '-' && input.uid !== '-' ? input.uid : existing.uid,
        uidSort: existing.uid === '-' && input.uid !== '-' ? uidSort : existing.uidSort,
        federationId: existing.federationId ?? input.confederationId,
        federation: existing.federation ?? input.confederationName,
        isHistorical: input.isHistorical,
        visibleInCatalog: input.isHistorical ? false : existing.visibleInCatalog,
        detailRedirectCountryId: input.detailRedirectCountryId ?? null
      },
      select: { id: true, name: true }
    });
  }

  return prisma.country.create({
    data: {
      importKey: `seed:country:${input.uid === '-' ? input.name : input.uid}`,
      uid: input.uid,
      uidSort,
      name: input.name,
      federationId: input.confederationId,
      federation: input.confederationName,
      visibleInCatalog: input.visibleInCatalogForNew,
      isHistorical: input.isHistorical,
      detailRedirectCountryId: input.detailRedirectCountryId ?? null
    },
    select: { id: true, name: true }
  });
}

async function findExistingCountry(uid: string, name: string) {
  if (uid !== '-') {
    const byUid = await prisma.country.findFirst({
      where: { uid },
      select: {
        id: true,
        uid: true,
        uidSort: true,
        federationId: true,
        federation: true,
        visibleInCatalog: true
      }
    });

    if (byUid) {
      return byUid;
    }
  }

  return prisma.country.findFirst({
    where: { name },
    select: {
      id: true,
      uid: true,
      uidSort: true,
      federationId: true,
      federation: true,
      visibleInCatalog: true
    }
  });
}

function toUidSort(uid: string) {
  return /^\d+$/.test(uid) ? Number(uid) : null;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

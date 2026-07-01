import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const AFC_CONFEDERATION = { uid: '2', code: 'AFC', name: '亚足联', sortOrder: 20 };

const REQUIRED_COUNTRIES = [
  { uid: '107', name: '巴林' },
  { uid: '110', name: '中国' },
  { uid: '111', name: '中国香港' },
  { uid: '112', name: '印度' },
  { uid: '114', name: '伊朗' },
  { uid: '115', name: '伊拉克' },
  { uid: '116', name: '日本' },
  { uid: '117', name: '约旦' },
  { uid: '118', name: '柬埔寨' },
  { uid: '120', name: '科威特' },
  { uid: '127', name: '缅甸' },
  { uid: '129', name: '朝鲜' },
  { uid: '132', name: '卡塔尔' },
  { uid: '133', name: '沙特阿拉伯' },
  { uid: '135', name: '韩国' },
  { uid: '138', name: '中国台北' },
  { uid: '140', name: '泰国' },
  { uid: '143', name: '阿联酋' },
  { uid: '144', name: '乌兹别克斯坦' },
  { uid: '145', name: '越南' },
  { uid: '775', name: '以色列' },
  { uid: '1435', name: '澳大利亚' }
];

const HISTORICAL_COUNTRIES = [
  { uid: '-', name: '南越', successorNames: ['越南'], redirectName: '越南' }
];

type TopFourAsianCupResult = {
  year: number;
  host: string;
  quantity: number;
  mode: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  remark?: string;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

type SemiFinalistAsianCupResult = {
  year: number;
  host: string;
  quantity: number;
  mode: typeof CompetitionEditionStandingMode.SEMI_FINALISTS;
  champion: string;
  runnerUp: string;
  semiFinalists: [string, string];
};

const ASIAN_CUP_RESULTS: Array<TopFourAsianCupResult | SemiFinalistAsianCupResult> = [
  {
    year: 1956,
    host: '中国香港',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届为循环赛最终排名，按前四排名录入冠亚季殿；并非实际三四名赛。',
    champion: '韩国',
    runnerUp: '以色列',
    thirdPlace: '中国香港',
    fourthPlace: '南越'
  },
  {
    year: 1960,
    host: '韩国',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届为循环赛最终排名，按前四排名录入冠亚季殿；并非实际三四名赛。',
    champion: '韩国',
    runnerUp: '以色列',
    thirdPlace: '中国台北',
    fourthPlace: '南越'
  },
  {
    year: 1964,
    host: '以色列',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届为循环赛最终排名，按前四排名录入冠亚季殿；并非实际三四名赛。',
    champion: '以色列',
    runnerUp: '印度',
    thirdPlace: '韩国',
    fourthPlace: '中国香港'
  },
  {
    year: 1968,
    host: '伊朗',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届为循环赛最终排名，按前四排名录入冠亚季殿；并非实际三四名赛。',
    champion: '伊朗',
    runnerUp: '缅甸',
    thirdPlace: '以色列',
    fourthPlace: '中国台北'
  },
  {
    year: 1972,
    host: '泰国',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '伊朗',
    runnerUp: '韩国',
    thirdPlace: '泰国',
    fourthPlace: '柬埔寨'
  },
  {
    year: 1976,
    host: '伊朗',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '伊朗',
    runnerUp: '科威特',
    thirdPlace: '中国',
    fourthPlace: '伊拉克'
  },
  {
    year: 1980,
    host: '科威特',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '科威特',
    runnerUp: '韩国',
    thirdPlace: '伊朗',
    fourthPlace: '朝鲜'
  },
  {
    year: 1984,
    host: '新加坡',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '沙特阿拉伯',
    runnerUp: '中国',
    thirdPlace: '科威特',
    fourthPlace: '伊朗'
  },
  {
    year: 1988,
    host: '卡塔尔',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '沙特阿拉伯',
    runnerUp: '韩国',
    thirdPlace: '伊朗',
    fourthPlace: '中国'
  },
  {
    year: 1992,
    host: '日本',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '中国',
    fourthPlace: '阿联酋'
  },
  {
    year: 1996,
    host: '阿联酋',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '沙特阿拉伯',
    runnerUp: '阿联酋',
    thirdPlace: '伊朗',
    fourthPlace: '科威特'
  },
  {
    year: 2000,
    host: '黎巴嫩',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '韩国',
    fourthPlace: '中国'
  },
  {
    year: 2004,
    host: '中国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '中国',
    thirdPlace: '伊朗',
    fourthPlace: '巴林'
  },
  {
    year: 2007,
    host: '印度尼西亚/马来西亚/泰国/越南',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '伊拉克',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '韩国',
    fourthPlace: '日本'
  },
  {
    year: 2011,
    host: '卡塔尔',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '日本',
    runnerUp: '澳大利亚',
    thirdPlace: '韩国',
    fourthPlace: '乌兹别克斯坦'
  },
  {
    year: 2015,
    host: '澳大利亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '澳大利亚',
    runnerUp: '韩国',
    thirdPlace: '阿联酋',
    fourthPlace: '伊拉克'
  },
  {
    year: 2019,
    host: '阿联酋',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '卡塔尔',
    runnerUp: '日本',
    semiFinalists: ['伊朗', '阿联酋']
  },
  {
    year: 2023,
    host: '卡塔尔',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '卡塔尔',
    runnerUp: '约旦',
    semiFinalists: ['伊朗', '韩国']
  }
];

async function main() {
  const countries = new Map<string, { id: string; name: string }>();
  const confederation = await prisma.confederation.upsert({
    where: { uid: AFC_CONFEDERATION.uid },
    create: AFC_CONFEDERATION,
    update: {
      code: AFC_CONFEDERATION.code,
      name: AFC_CONFEDERATION.name,
      sortOrder: AFC_CONFEDERATION.sortOrder
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

  const asianCup = await prisma.competition.upsert({
    where: { code: 'AFC_ASIAN_CUP' },
    create: {
      code: 'AFC_ASIAN_CUP',
      name: '亚足联亚洲杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      description: '亚足联国家队最高级别洲际杯赛。',
      confederationId: confederation.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 30
    },
    update: {
      name: '亚足联亚洲杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      confederationId: confederation.id,
      enabled: true,
      includeInStats: true
    },
    select: { id: true }
  });

  await prisma.competitionScopeConfederation.upsert({
    where: {
      competitionId_confederationId: {
        competitionId: asianCup.id,
        confederationId: confederation.id
      }
    },
    create: {
      competitionId: asianCup.id,
      confederationId: confederation.id
    },
    update: {}
  });

  for (const result of ASIAN_CUP_RESULTS) {
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: asianCup.id,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId: asianCup.id,
        name: `${result.year}年`,
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: result.mode,
        remark: 'remark' in result ? (result.remark ?? null) : null
      },
      update: {
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: result.mode,
        remark: 'remark' in result ? (result.remark ?? null) : null
      },
      select: { id: true }
    });

    await prisma.competitionStanding.deleteMany({
      where: { editionId: edition.id }
    });

    await prisma.competitionStanding.createMany({
      data: buildStandings(result).flatMap(({ placement, countryName, standingOrder }) => {
        const country = countries.get(countryName);

        if (!country) {
          console.warn(`Skip ${result.year} ${countryName}: country not found.`);
          return [];
        }

        return [
          {
            editionId: edition.id,
            placement,
            countryId: country.id,
            standingOrder
          }
        ];
      })
    });
  }

  console.log('Asian Cup seed completed.');
}

function buildStandings(result: TopFourAsianCupResult | SemiFinalistAsianCupResult) {
  const standings: Array<{
    placement: CompetitionStandingPlacement;
    countryName: string;
    standingOrder?: number;
  }> = [
    { placement: CompetitionStandingPlacement.CHAMPION, countryName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, countryName: result.runnerUp }
  ];

  if (result.mode === CompetitionEditionStandingMode.THIRD_PLACE_MATCH) {
    standings.push(
      { placement: CompetitionStandingPlacement.THIRD_PLACE, countryName: result.thirdPlace },
      { placement: CompetitionStandingPlacement.FOURTH_PLACE, countryName: result.fourthPlace }
    );
  } else {
    standings.push(
      {
        placement: CompetitionStandingPlacement.SEMI_FINALIST,
        countryName: result.semiFinalists[0],
        standingOrder: 1
      },
      {
        placement: CompetitionStandingPlacement.SEMI_FINALIST,
        countryName: result.semiFinalists[1],
        standingOrder: 2
      }
    );
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

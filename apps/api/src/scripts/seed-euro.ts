import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const UEFA_CONFEDERATION = { uid: '3', code: 'UEFA', name: '欧足联', sortOrder: 30 };

const REQUIRED_COUNTRIES = [
  { uid: '757', name: '比利时' },
  { uid: '763', name: '捷克' },
  { uid: '764', name: '丹麦' },
  { uid: '765', name: '英格兰' },
  { uid: '769', name: '法国' },
  { uid: '771', name: '德国' },
  { uid: '772', name: '希腊' },
  { uid: '773', name: '匈牙利' },
  { uid: '776', name: '意大利' },
  { uid: '784', name: '荷兰' },
  { uid: '788', name: '葡萄牙' },
  { uid: '791', name: '俄罗斯' },
  { uid: '796', name: '西班牙' },
  { uid: '797', name: '瑞典' },
  { uid: '799', name: '土耳其' },
  { uid: '801', name: '威尔士' },
  { uid: '802', name: '塞尔维亚' }
];

const HISTORICAL_COUNTRIES = [
  { uid: '583', name: '苏联', successorNames: ['俄罗斯'], redirectName: '俄罗斯' },
  { uid: '584', name: '西德', successorNames: ['德国'], redirectName: '德国' },
  { uid: '585', name: '捷克斯洛伐克', successorNames: ['捷克', '斯洛伐克'] },
  { uid: '586', name: '南斯拉夫', successorNames: ['塞尔维亚'] }
];

type ThirdPlaceEuroResult = {
  year: number;
  host: string;
  quantity: number;
  mode: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

type SemiFinalistEuroResult = {
  year: number;
  host: string;
  quantity: number;
  mode: typeof CompetitionEditionStandingMode.SEMI_FINALISTS;
  champion: string;
  runnerUp: string;
  semiFinalists: [string, string];
};

const EURO_RESULTS: Array<ThirdPlaceEuroResult | SemiFinalistEuroResult> = [
  {
    year: 1960,
    host: '法国',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏联',
    runnerUp: '南斯拉夫',
    thirdPlace: '捷克斯洛伐克',
    fourthPlace: '法国'
  },
  {
    year: 1964,
    host: '西班牙',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '苏联',
    thirdPlace: '匈牙利',
    fourthPlace: '丹麦'
  },
  {
    year: 1968,
    host: '意大利',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '意大利',
    runnerUp: '南斯拉夫',
    thirdPlace: '英格兰',
    fourthPlace: '苏联'
  },
  {
    year: 1972,
    host: '比利时',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西德',
    runnerUp: '苏联',
    thirdPlace: '比利时',
    fourthPlace: '匈牙利'
  },
  {
    year: 1976,
    host: '南斯拉夫',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '捷克斯洛伐克',
    runnerUp: '西德',
    thirdPlace: '荷兰',
    fourthPlace: '南斯拉夫'
  },
  {
    year: 1980,
    host: '意大利',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西德',
    runnerUp: '比利时',
    thirdPlace: '捷克斯洛伐克',
    fourthPlace: '意大利'
  },
  {
    year: 1984,
    host: '法国',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '法国',
    runnerUp: '西班牙',
    semiFinalists: ['丹麦', '葡萄牙']
  },
  {
    year: 1988,
    host: '西德',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '荷兰',
    runnerUp: '苏联',
    semiFinalists: ['意大利', '西德']
  },
  {
    year: 1992,
    host: '瑞典',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '丹麦',
    runnerUp: '德国',
    semiFinalists: ['荷兰', '瑞典']
  },
  {
    year: 1996,
    host: '英格兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '德国',
    runnerUp: '捷克',
    semiFinalists: ['英格兰', '法国']
  },
  {
    year: 2000,
    host: '比利时/荷兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '法国',
    runnerUp: '意大利',
    semiFinalists: ['荷兰', '葡萄牙']
  },
  {
    year: 2004,
    host: '葡萄牙',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '希腊',
    runnerUp: '葡萄牙',
    semiFinalists: ['捷克', '荷兰']
  },
  {
    year: 2008,
    host: '奥地利/瑞士',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '德国',
    semiFinalists: ['俄罗斯', '土耳其']
  },
  {
    year: 2012,
    host: '波兰/乌克兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '意大利',
    semiFinalists: ['德国', '葡萄牙']
  },
  {
    year: 2016,
    host: '法国',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '葡萄牙',
    runnerUp: '法国',
    semiFinalists: ['德国', '威尔士']
  },
  {
    year: 2020,
    host: '泛欧',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '意大利',
    runnerUp: '英格兰',
    semiFinalists: ['丹麦', '西班牙']
  },
  {
    year: 2024,
    host: '德国',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '英格兰',
    semiFinalists: ['法国', '荷兰']
  }
];

async function main() {
  const countries = new Map<string, { id: string; name: string }>();
  const confederation = await prisma.confederation.upsert({
    where: { uid: UEFA_CONFEDERATION.uid },
    create: UEFA_CONFEDERATION,
    update: {
      code: UEFA_CONFEDERATION.code,
      name: UEFA_CONFEDERATION.name,
      sortOrder: UEFA_CONFEDERATION.sortOrder
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

  const euro = await prisma.competition.upsert({
    where: { code: 'UEFA_EURO' },
    create: {
      code: 'UEFA_EURO',
      name: '欧洲足球锦标赛',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      description: '欧足联国家队最高级别洲际杯赛。',
      confederationId: confederation.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 20
    },
    update: {
      name: '欧洲足球锦标赛',
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
        competitionId: euro.id,
        confederationId: confederation.id
      }
    },
    create: {
      competitionId: euro.id,
      confederationId: confederation.id
    },
    update: {}
  });

  for (const result of EURO_RESULTS) {
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: euro.id,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId: euro.id,
        name: `${result.year}年`,
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: result.mode
      },
      update: {
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: result.mode
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

  console.log('Euro seed completed.');
}

function buildStandings(result: ThirdPlaceEuroResult | SemiFinalistEuroResult) {
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

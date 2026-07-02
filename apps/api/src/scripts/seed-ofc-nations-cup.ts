import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const CONFEDERATIONS = [
  { uid: '2', code: 'AFC', name: '亚足联', sortOrder: 20 },
  { uid: '5', code: 'OFC', name: '大洋足联', sortOrder: 50 }
];

const REQUIRED_COUNTRIES = [
  { uid: '1435', name: '澳大利亚', confederationCode: 'AFC' },
  { uid: '1437', name: '斐济', confederationCode: 'OFC' },
  { uid: '1438', name: '新西兰', confederationCode: 'OFC' },
  { uid: '1439', name: '巴布亚新几内亚', confederationCode: 'OFC' },
  { uid: '1440', name: '所罗门群岛', confederationCode: 'OFC' },
  { uid: '1441', name: '塔希提', confederationCode: 'OFC' },
  { uid: '1443', name: '瓦努阿图', confederationCode: 'OFC' },
  { uid: '-', name: '新喀里多尼亚', confederationCode: 'OFC', visibleInCatalogForNew: false }
];

const HISTORICAL_COUNTRIES = [
  { uid: '-', name: '新赫布里底', successorNames: ['瓦努阿图'], redirectName: '瓦努阿图' }
];

const OCEANIA_CUP_REMARK = '本届为大洋洲国家杯前身 Oceania Cup，按实际名次录入。';
const TWO_LEG_REMARK = '本届采用主客场两回合淘汰赛，无三四名赛，按两个四强录入。';
const FINAL_ROUND_REMARK =
  '本届为最终阶段循环赛排名，前两名另进行两回合决赛；季军、殿军按最终阶段排名录入。';
const WORLD_CUP_QUALIFIER_REMARK = '本届同时作为世界杯预选赛阶段，按最终循环赛排名录入冠亚季殿。';

type BaseOfcNationsCupResult = {
  year: number;
  host: string;
  quantity: number;
  remark?: string;
};

type TopFourOfcNationsCupResult = BaseOfcNationsCupResult & {
  mode: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

type SemiFinalistOfcNationsCupResult = BaseOfcNationsCupResult & {
  mode: typeof CompetitionEditionStandingMode.SEMI_FINALISTS;
  champion: string;
  runnerUp: string;
  semiFinalists: [string, string];
};

const OFC_NATIONS_CUP_RESULTS: Array<TopFourOfcNationsCupResult | SemiFinalistOfcNationsCupResult> =
  [
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
      remark: TWO_LEG_REMARK,
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

async function main() {
  const confederations = new Map<string, { id: string; name: string }>();
  const countries = new Map<string, { id: string; name: string }>();

  for (const confederationData of CONFEDERATIONS) {
    const confederation = await prisma.confederation.upsert({
      where: { uid: confederationData.uid },
      create: confederationData,
      update: {
        code: confederationData.code,
        name: confederationData.name,
        sortOrder: confederationData.sortOrder
      },
      select: { id: true, name: true }
    });
    confederations.set(confederationData.code, confederation);
  }

  const ofc = confederations.get('OFC');

  if (!ofc) {
    throw new Error('OFC confederation not found.');
  }

  for (const countryData of REQUIRED_COUNTRIES) {
    const confederation = confederations.get(countryData.confederationCode);

    if (!confederation) {
      throw new Error(`${countryData.confederationCode} confederation not found.`);
    }

    const country = await upsertCountry({
      uid: countryData.uid,
      name: countryData.name,
      confederationId: confederation.id,
      confederationName: confederation.name,
      isHistorical: false,
      visibleInCatalogForNew: countryData.visibleInCatalogForNew ?? false
    });
    countries.set(country.name, country);
  }

  for (const item of HISTORICAL_COUNTRIES) {
    const country = await upsertCountry({
      uid: item.uid,
      name: item.name,
      confederationId: ofc.id,
      confederationName: ofc.name,
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

  const ofcNationsCup = await prisma.competition.upsert({
    where: { code: 'OFC_NATIONS_CUP' },
    create: {
      code: 'OFC_NATIONS_CUP',
      name: '大洋洲国家杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      description: '大洋洲足联主办的男子国家队最高级别洲际杯赛。',
      confederationId: ofc.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 50
    },
    update: {
      name: '大洋洲国家杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      confederationId: ofc.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 50
    },
    select: { id: true }
  });

  await prisma.competitionScopeConfederation.deleteMany({
    where: {
      competitionId: ofcNationsCup.id,
      confederationId: { not: ofc.id }
    }
  });

  await prisma.competitionScopeConfederation.upsert({
    where: {
      competitionId_confederationId: {
        competitionId: ofcNationsCup.id,
        confederationId: ofc.id
      }
    },
    create: {
      competitionId: ofcNationsCup.id,
      confederationId: ofc.id
    },
    update: {}
  });

  for (const result of OFC_NATIONS_CUP_RESULTS) {
    const editionName = `${result.year}年`;
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: ofcNationsCup.id,
          name: editionName
        }
      },
      create: {
        competitionId: ofcNationsCup.id,
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
      data: buildStandings(result).flatMap(({ placement, countryName, standingOrder }) => {
        const country = countries.get(countryName);

        if (!country) {
          console.warn(`Skip ${editionName} ${countryName}: country not found.`);
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

  console.log('OFC Nations Cup seed completed.');
}

function buildStandings(result: TopFourOfcNationsCupResult | SemiFinalistOfcNationsCupResult) {
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

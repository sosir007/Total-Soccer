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
  { uid: '4', code: 'CONCACAF', name: '中北美足联', sortOrder: 40 },
  { uid: '6', code: 'CONMEBOL', name: '南美足联', sortOrder: 60 }
];

const REQUIRED_COUNTRIES = [
  { uid: '364', name: '加拿大', confederationCode: 'CONCACAF' },
  { uid: '366', name: '哥斯达黎加', confederationCode: 'CONCACAF' },
  { uid: '367', name: '古巴', confederationCode: 'CONCACAF' },
  { uid: '370', name: '萨尔瓦多', confederationCode: 'CONCACAF' },
  { uid: '373', name: '危地马拉', confederationCode: 'CONCACAF' },
  { uid: '375', name: '海地', confederationCode: 'CONCACAF' },
  { uid: '376', name: '洪都拉斯', confederationCode: 'CONCACAF' },
  { uid: '377', name: '牙买加', confederationCode: 'CONCACAF' },
  { uid: '379', name: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '380', name: '库拉索', confederationCode: 'CONCACAF' },
  { uid: '382', name: '巴拿马', confederationCode: 'CONCACAF' },
  { uid: '389', name: '特立尼达和多巴哥', confederationCode: 'CONCACAF' },
  { uid: '390', name: '美国', confederationCode: 'CONCACAF' },
  { uid: '135', name: '韩国', confederationCode: 'AFC' },
  { uid: '132', name: '卡塔尔', confederationCode: 'AFC' },
  { uid: '1651', name: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1653', name: '哥伦比亚', confederationCode: 'CONMEBOL' },
  { uid: '1656', name: '秘鲁', confederationCode: 'CONMEBOL' },
  { uid: '-', name: '瓜德罗普', confederationCode: 'CONCACAF', visibleInCatalogForNew: false }
];

const HISTORICAL_COUNTRIES = [
  { uid: '-', name: '荷属安的列斯', successorNames: ['库拉索'], redirectName: '库拉索' }
];

const PREDECESSOR_REMARK =
  '本届为中北美及加勒比海金杯赛前身 CONCACAF Championship，按最终排名录入冠亚季殿。';
const WORLD_CUP_QUALIFIER_REMARK =
  '本届为中北美及加勒比海金杯赛前身 CONCACAF Championship，同时作为世界杯预选赛最终阶段，按最终排名录入冠亚季殿。';
const WORLD_CUP_QUALIFIER_TOP_THREE_REMARK =
  '本届为中北美及加勒比海金杯赛前身 CONCACAF Championship，同时作为世界杯预选赛最终阶段，最终阶段只有前三名，按前三录入。';
const SHARED_THIRD_REMARK = '本届无三四名赛，哥斯达黎加和牙买加并列第三，按两个四强录入。';

type BaseGoldCupResult = {
  year: number;
  host: string;
  quantity: number;
  remark?: string;
};

type TopFourGoldCupResult = BaseGoldCupResult & {
  mode: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

type TopThreeGoldCupResult = BaseGoldCupResult & {
  mode: typeof CompetitionEditionStandingMode.LEAGUE_TOP_THREE;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
};

type SemiFinalistGoldCupResult = BaseGoldCupResult & {
  mode: typeof CompetitionEditionStandingMode.SEMI_FINALISTS;
  champion: string;
  runnerUp: string;
  semiFinalists: [string, string];
};

const GOLD_CUP_RESULTS: Array<
  TopFourGoldCupResult | TopThreeGoldCupResult | SemiFinalistGoldCupResult
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
      select: { id: true, code: true, name: true }
    });
    confederations.set(confederationData.code, confederation);
  }

  const concacaf = confederations.get('CONCACAF');

  if (!concacaf) {
    throw new Error('CONCACAF confederation not found.');
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
      confederationId: concacaf.id,
      confederationName: concacaf.name,
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

  const goldCup = await prisma.competition.upsert({
    where: { code: 'CONCACAF_GOLD_CUP' },
    create: {
      code: 'CONCACAF_GOLD_CUP',
      name: '中北美及加勒比海金杯赛',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      description: '中北美洲及加勒比海地区男子国家队最高级别洲际杯赛。',
      confederationId: concacaf.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 40
    },
    update: {
      name: '中北美及加勒比海金杯赛',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      confederationId: concacaf.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 40
    },
    select: { id: true }
  });

  await prisma.competitionScopeConfederation.deleteMany({
    where: {
      competitionId: goldCup.id,
      confederationId: { not: concacaf.id }
    }
  });

  await prisma.competitionScopeConfederation.upsert({
    where: {
      competitionId_confederationId: {
        competitionId: goldCup.id,
        confederationId: concacaf.id
      }
    },
    create: {
      competitionId: goldCup.id,
      confederationId: concacaf.id
    },
    update: {}
  });

  for (const result of GOLD_CUP_RESULTS) {
    const editionName = `${result.year}年`;
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: goldCup.id,
          name: editionName
        }
      },
      create: {
        competitionId: goldCup.id,
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

  console.log('CONCACAF Gold Cup seed completed.');
}

function buildStandings(
  result: TopFourGoldCupResult | TopThreeGoldCupResult | SemiFinalistGoldCupResult
) {
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
  } else if (result.mode === CompetitionEditionStandingMode.LEAGUE_TOP_THREE) {
    standings.push({
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      countryName: result.thirdPlace
    });
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

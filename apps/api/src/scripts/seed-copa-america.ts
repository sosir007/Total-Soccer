import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const CONFEDERATIONS = [
  { uid: '4', code: 'CONCACAF', name: '中北美足联', sortOrder: 40 },
  { uid: '6', code: 'CONMEBOL', name: '南美足联', sortOrder: 60 }
];

const REQUIRED_COUNTRIES = [
  { uid: '364', name: '加拿大', confederationCode: 'CONCACAF' },
  { uid: '376', name: '洪都拉斯', confederationCode: 'CONCACAF' },
  { uid: '379', name: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '390', name: '美国', confederationCode: 'CONCACAF' },
  { uid: '1649', name: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1650', name: '玻利维亚', confederationCode: 'CONMEBOL' },
  { uid: '1651', name: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1652', name: '智利', confederationCode: 'CONMEBOL' },
  { uid: '1653', name: '哥伦比亚', confederationCode: 'CONMEBOL' },
  { uid: '1654', name: '厄瓜多尔', confederationCode: 'CONMEBOL' },
  { uid: '1655', name: '巴拉圭', confederationCode: 'CONMEBOL' },
  { uid: '1656', name: '秘鲁', confederationCode: 'CONMEBOL' },
  { uid: '1657', name: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '1658', name: '委内瑞拉', confederationCode: 'CONMEBOL' }
];

const ROUND_ROBIN_REMARK = '本届为循环赛最终排名，按前四排名录入冠亚季殿；并非实际三四名赛。';
const FINAL_ROUND_REMARK =
  '本届为最终阶段循环赛排名，按前四排名录入冠亚季殿；并非实际决赛或三四名赛。';

type BaseCopaAmericaResult = {
  year: number;
  name?: string;
  host: string;
  quantity: number;
  remark?: string;
};

type TopFourCopaAmericaResult = BaseCopaAmericaResult & {
  mode: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

type TopThreeCopaAmericaResult = BaseCopaAmericaResult & {
  mode: typeof CompetitionEditionStandingMode.LEAGUE_TOP_THREE;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
};

type SemiFinalistCopaAmericaResult = BaseCopaAmericaResult & {
  mode: typeof CompetitionEditionStandingMode.SEMI_FINALISTS;
  champion: string;
  runnerUp: string;
  semiFinalists: [string, string];
};

const COPA_AMERICA_RESULTS: Array<
  TopFourCopaAmericaResult | TopThreeCopaAmericaResult | SemiFinalistCopaAmericaResult
> = [
  {
    year: 1916,
    host: '阿根廷',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '智利'
  },
  {
    year: 1917,
    host: '乌拉圭',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '智利'
  },
  {
    year: 1919,
    host: '巴西',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '巴西',
    runnerUp: '乌拉圭',
    thirdPlace: '阿根廷',
    fourthPlace: '智利'
  },
  {
    year: 1920,
    host: '智利',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '智利'
  },
  {
    year: 1921,
    host: '阿根廷',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1922,
    host: '巴西',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '巴西',
    runnerUp: '巴拉圭',
    thirdPlace: '乌拉圭',
    fourthPlace: '阿根廷'
  },
  {
    year: 1923,
    host: '乌拉圭',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴拉圭',
    fourthPlace: '巴西'
  },
  {
    year: 1924,
    host: '乌拉圭',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1925,
    host: '阿根廷',
    quantity: 3,
    mode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '本届只有 3 支球队参赛，按循环赛前三录入。',
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '巴拉圭'
  },
  {
    year: 1926,
    host: '智利',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '智利',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1927,
    host: '秘鲁',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '乌拉圭',
    thirdPlace: '秘鲁',
    fourthPlace: '玻利维亚'
  },
  {
    year: 1929,
    host: '阿根廷',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴拉圭',
    thirdPlace: '乌拉圭',
    fourthPlace: '秘鲁'
  },
  {
    year: 1935,
    host: '秘鲁',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '秘鲁',
    fourthPlace: '智利'
  },
  {
    year: 1937,
    host: '阿根廷',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1939,
    host: '秘鲁',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '秘鲁',
    runnerUp: '乌拉圭',
    thirdPlace: '巴拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1941,
    host: '智利',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '乌拉圭',
    thirdPlace: '智利',
    fourthPlace: '秘鲁'
  },
  {
    year: 1942,
    host: '乌拉圭',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1945,
    host: '智利',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '智利',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1946,
    host: '阿根廷',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '巴拉圭',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1947,
    host: '厄瓜多尔',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴拉圭',
    thirdPlace: '乌拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1949,
    host: '巴西',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '巴西',
    runnerUp: '巴拉圭',
    thirdPlace: '秘鲁',
    fourthPlace: '玻利维亚'
  },
  {
    year: 1953,
    host: '秘鲁',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '巴拉圭',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '智利'
  },
  {
    year: 1955,
    host: '智利',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '智利',
    thirdPlace: '秘鲁',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1956,
    host: '乌拉圭',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '智利',
    thirdPlace: '阿根廷',
    fourthPlace: '巴西'
  },
  {
    year: 1957,
    host: '秘鲁',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '乌拉圭',
    fourthPlace: '秘鲁'
  },
  {
    year: 1959,
    name: '1959年 阿根廷',
    host: '阿根廷',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '巴拉圭',
    fourthPlace: '秘鲁'
  },
  {
    year: 1959,
    name: '1959年 厄瓜多尔',
    host: '厄瓜多尔',
    quantity: 5,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '厄瓜多尔'
  },
  {
    year: 1963,
    host: '玻利维亚',
    quantity: 7,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '玻利维亚',
    runnerUp: '巴拉圭',
    thirdPlace: '阿根廷',
    fourthPlace: '巴西'
  },
  {
    year: 1967,
    host: '乌拉圭',
    quantity: 6,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: ROUND_ROBIN_REMARK,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '智利',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1975,
    host: '主客场制',
    quantity: 10,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '秘鲁',
    runnerUp: '哥伦比亚',
    semiFinalists: ['巴西', '乌拉圭']
  },
  {
    year: 1979,
    host: '主客场制',
    quantity: 10,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '巴拉圭',
    runnerUp: '智利',
    semiFinalists: ['巴西', '秘鲁']
  },
  {
    year: 1983,
    host: '主客场制',
    quantity: 10,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '乌拉圭',
    runnerUp: '巴西',
    semiFinalists: ['巴拉圭', '秘鲁']
  },
  {
    year: 1987,
    host: '阿根廷',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '智利',
    thirdPlace: '哥伦比亚',
    fourthPlace: '阿根廷'
  },
  {
    year: 1989,
    host: '巴西',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: FINAL_ROUND_REMARK,
    champion: '巴西',
    runnerUp: '乌拉圭',
    thirdPlace: '阿根廷',
    fourthPlace: '巴拉圭'
  },
  {
    year: 1991,
    host: '智利',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: FINAL_ROUND_REMARK,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '智利',
    fourthPlace: '哥伦比亚'
  },
  {
    year: 1993,
    host: '厄瓜多尔',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '墨西哥',
    thirdPlace: '哥伦比亚',
    fourthPlace: '厄瓜多尔'
  },
  {
    year: 1995,
    host: '乌拉圭',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '巴西',
    thirdPlace: '哥伦比亚',
    fourthPlace: '美国'
  },
  {
    year: 1997,
    host: '玻利维亚',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '玻利维亚',
    thirdPlace: '墨西哥',
    fourthPlace: '秘鲁'
  },
  {
    year: 1999,
    host: '巴拉圭',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '乌拉圭',
    thirdPlace: '墨西哥',
    fourthPlace: '智利'
  },
  {
    year: 2001,
    host: '哥伦比亚',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '哥伦比亚',
    runnerUp: '墨西哥',
    thirdPlace: '洪都拉斯',
    fourthPlace: '乌拉圭'
  },
  {
    year: 2004,
    host: '秘鲁',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '阿根廷',
    thirdPlace: '乌拉圭',
    fourthPlace: '哥伦比亚'
  },
  {
    year: 2007,
    host: '委内瑞拉',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '阿根廷',
    thirdPlace: '墨西哥',
    fourthPlace: '乌拉圭'
  },
  {
    year: 2011,
    host: '阿根廷',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '巴拉圭',
    thirdPlace: '秘鲁',
    fourthPlace: '委内瑞拉'
  },
  {
    year: 2015,
    host: '智利',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '智利',
    runnerUp: '阿根廷',
    thirdPlace: '秘鲁',
    fourthPlace: '巴拉圭'
  },
  {
    year: 2016,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '智利',
    runnerUp: '阿根廷',
    thirdPlace: '哥伦比亚',
    fourthPlace: '美国'
  },
  {
    year: 2019,
    host: '巴西',
    quantity: 12,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '秘鲁',
    thirdPlace: '阿根廷',
    fourthPlace: '智利'
  },
  {
    year: 2021,
    host: '巴西',
    quantity: 10,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '巴西',
    thirdPlace: '哥伦比亚',
    fourthPlace: '秘鲁'
  },
  {
    year: 2024,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '哥伦比亚',
    thirdPlace: '乌拉圭',
    fourthPlace: '加拿大'
  }
];

async function main() {
  const countries = new Map<string, { id: string; name: string }>();
  const confederations = new Map<string, { id: string; name: string }>();

  for (const item of CONFEDERATIONS) {
    const confederation = await prisma.confederation.upsert({
      where: { uid: item.uid },
      create: item,
      update: {
        code: item.code,
        name: item.name,
        sortOrder: item.sortOrder
      },
      select: { id: true, name: true }
    });
    confederations.set(item.code, confederation);
  }

  const conmebol = confederations.get('CONMEBOL');

  if (!conmebol) {
    throw new Error('CONMEBOL confederation not found.');
  }

  for (const countryData of REQUIRED_COUNTRIES) {
    const confederation = confederations.get(countryData.confederationCode);

    if (!confederation) {
      throw new Error(`Confederation not found: ${countryData.confederationCode}.`);
    }

    const country = await upsertCountry({
      uid: countryData.uid,
      name: countryData.name,
      confederationId: confederation.id,
      confederationName: confederation.name,
      isHistorical: false,
      visibleInCatalogForNew: false
    });
    countries.set(country.name, country);
  }

  const copaAmerica = await prisma.competition.upsert({
    where: { code: 'COPA_AMERICA' },
    create: {
      code: 'COPA_AMERICA',
      name: '美洲杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      description: '南美足联主办的男子国家队最高级别洲际杯赛。',
      confederationId: conmebol.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 25
    },
    update: {
      name: '美洲杯',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.CONFEDERATION,
      category: '洲际',
      level: '一级',
      format: '杯赛',
      confederationId: conmebol.id,
      enabled: true,
      includeInStats: true,
      sortOrder: 25
    },
    select: { id: true }
  });

  await prisma.competitionScopeConfederation.deleteMany({
    where: {
      competitionId: copaAmerica.id,
      confederationId: { not: conmebol.id }
    }
  });

  await prisma.competitionScopeConfederation.upsert({
    where: {
      competitionId_confederationId: {
        competitionId: copaAmerica.id,
        confederationId: conmebol.id
      }
    },
    create: {
      competitionId: copaAmerica.id,
      confederationId: conmebol.id
    },
    update: {}
  });

  for (const result of COPA_AMERICA_RESULTS) {
    const editionName = result.name ?? `${result.year}年`;
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: copaAmerica.id,
          name: editionName
        }
      },
      create: {
        competitionId: copaAmerica.id,
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

  console.log('Copa America seed completed.');
}

function buildStandings(
  result: TopFourCopaAmericaResult | TopThreeCopaAmericaResult | SemiFinalistCopaAmericaResult
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

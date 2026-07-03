import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const CONFEDERATIONS = [
  { uid: '1', code: 'CAF', name: '非足联', sortOrder: 10 },
  { uid: '2', code: 'AFC', name: '亚足联', sortOrder: 20 },
  { uid: '3', code: 'UEFA', name: '欧足联', sortOrder: 30 },
  { uid: '4', code: 'CONCACAF', name: '中北美足联', sortOrder: 40 },
  { uid: '6', code: 'CONMEBOL', name: '南美足联', sortOrder: 60 }
];

const REQUIRED_COUNTRIES = [
  { uid: '11', name: '喀麦隆', confederationCode: 'CAF' },
  { uid: '24', name: '科特迪瓦', confederationCode: 'CAF' },
  { uid: '38', name: '尼日利亚', confederationCode: 'CAF' },
  { uid: '45', name: '南非', confederationCode: 'CAF' },
  { uid: '116', name: '日本', confederationCode: 'AFC' },
  { uid: '133', name: '沙特阿拉伯', confederationCode: 'AFC' },
  { uid: '1435', name: '澳大利亚', confederationCode: 'AFC' },
  { uid: '379', name: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '390', name: '美国', confederationCode: 'CONCACAF' },
  { uid: '763', name: '捷克', confederationCode: 'UEFA' },
  { uid: '764', name: '丹麦', confederationCode: 'UEFA' },
  { uid: '769', name: '法国', confederationCode: 'UEFA' },
  { uid: '771', name: '德国', confederationCode: 'UEFA' },
  { uid: '776', name: '意大利', confederationCode: 'UEFA' },
  { uid: '788', name: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '791', name: '俄罗斯', confederationCode: 'UEFA' },
  { uid: '796', name: '西班牙', confederationCode: 'UEFA' },
  { uid: '799', name: '土耳其', confederationCode: 'UEFA' },
  { uid: '1649', name: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1651', name: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1652', name: '智利', confederationCode: 'CONMEBOL' },
  { uid: '1653', name: '哥伦比亚', confederationCode: 'CONMEBOL' },
  { uid: '1657', name: '乌拉圭', confederationCode: 'CONMEBOL' }
];

const KING_FAHD_CUP_REMARK = '本届为国际足联联合会杯前身法赫德国王杯。';

type ConfederationsCupResult = {
  year: number;
  host: string;
  quantity: number;
  remark?: string;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

const CONFEDERATIONS_CUP_RESULTS: ConfederationsCupResult[] = [
  {
    year: 1992,
    host: '沙特阿拉伯',
    quantity: 4,
    remark: KING_FAHD_CUP_REMARK,
    champion: '阿根廷',
    runnerUp: '沙特阿拉伯',
    thirdPlace: '美国',
    fourthPlace: '科特迪瓦'
  },
  {
    year: 1995,
    host: '沙特阿拉伯',
    quantity: 6,
    remark: KING_FAHD_CUP_REMARK,
    champion: '丹麦',
    runnerUp: '阿根廷',
    thirdPlace: '墨西哥',
    fourthPlace: '尼日利亚'
  },
  {
    year: 1997,
    host: '沙特阿拉伯',
    quantity: 8,
    champion: '巴西',
    runnerUp: '澳大利亚',
    thirdPlace: '捷克',
    fourthPlace: '乌拉圭'
  },
  {
    year: 1999,
    host: '墨西哥',
    quantity: 8,
    champion: '墨西哥',
    runnerUp: '巴西',
    thirdPlace: '美国',
    fourthPlace: '沙特阿拉伯'
  },
  {
    year: 2001,
    host: '日本 / 韩国',
    quantity: 8,
    champion: '法国',
    runnerUp: '日本',
    thirdPlace: '澳大利亚',
    fourthPlace: '巴西'
  },
  {
    year: 2003,
    host: '法国',
    quantity: 8,
    champion: '法国',
    runnerUp: '喀麦隆',
    thirdPlace: '土耳其',
    fourthPlace: '哥伦比亚'
  },
  {
    year: 2005,
    host: '德国',
    quantity: 8,
    champion: '巴西',
    runnerUp: '阿根廷',
    thirdPlace: '德国',
    fourthPlace: '墨西哥'
  },
  {
    year: 2009,
    host: '南非',
    quantity: 8,
    champion: '巴西',
    runnerUp: '美国',
    thirdPlace: '西班牙',
    fourthPlace: '南非'
  },
  {
    year: 2013,
    host: '巴西',
    quantity: 8,
    champion: '巴西',
    runnerUp: '西班牙',
    thirdPlace: '意大利',
    fourthPlace: '乌拉圭'
  },
  {
    year: 2017,
    host: '俄罗斯',
    quantity: 8,
    champion: '德国',
    runnerUp: '智利',
    thirdPlace: '葡萄牙',
    fourthPlace: '墨西哥'
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
      visibleInCatalogForNew: false
    });
    countries.set(country.name, country);
  }

  const confederationsCup = await prisma.competition.upsert({
    where: { code: 'FIFA_CONFEDERATIONS_CUP' },
    create: {
      code: 'FIFA_CONFEDERATIONS_CUP',
      name: '国际足联联合会杯',
      externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.GLOBAL,
      category: '国际',
      level: '二级',
      format: '杯赛',
      description: '国际足联主办的国家队洲际冠军邀请赛，前身为法赫德国王杯，2017 年后停办。',
      enabled: true,
      includeInStats: true,
      sortOrder: 10
    },
    update: {
      name: '国际足联联合会杯',
      externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup',
      targetType: CompetitionTargetType.COUNTRY,
      scopeType: CompetitionScopeType.GLOBAL,
      category: '国际',
      level: '二级',
      format: '杯赛',
      description: '国际足联主办的国家队洲际冠军邀请赛，前身为法赫德国王杯，2017 年后停办。',
      confederationId: null,
      countryId: null,
      enabled: true,
      includeInStats: true,
      sortOrder: 10
    },
    select: { id: true }
  });

  await prisma.competitionScopeConfederation.deleteMany({
    where: { competitionId: confederationsCup.id }
  });
  await prisma.competitionScopeCountry.deleteMany({
    where: { competitionId: confederationsCup.id }
  });

  for (const result of CONFEDERATIONS_CUP_RESULTS) {
    const editionName = `${result.year}年`;
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: confederationsCup.id,
          name: editionName
        }
      },
      create: {
        competitionId: confederationsCup.id,
        name: editionName,
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
        remark: result.remark ?? null
      },
      update: {
        year: result.year,
        season: null,
        host: result.host,
        quantity: result.quantity,
        standingMode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
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

  console.log('FIFA Confederations Cup seed completed.');
}

function buildStandings(result: ConfederationsCupResult) {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, countryName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, countryName: result.runnerUp },
    { placement: CompetitionStandingPlacement.THIRD_PLACE, countryName: result.thirdPlace },
    { placement: CompetitionStandingPlacement.FOURTH_PLACE, countryName: result.fourthPlace }
  ];
}

async function upsertCountry(input: {
  uid: string;
  name: string;
  confederationId: string | null;
  confederationName: string | null;
  visibleInCatalogForNew: boolean;
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
        federation: existing.federation ?? input.confederationName
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
      visibleInCatalog: input.visibleInCatalogForNew
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

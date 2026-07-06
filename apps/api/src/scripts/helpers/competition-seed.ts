import {
  CompetitionEditionStandingMode,
  CompetitionStandingPlacement,
  Prisma,
  PrismaClient
} from '@prisma/client';

export type SeedConfederation = {
  uid: string;
  code: string;
  name: string;
  sortOrder: number;
};

export type SeedCountry = {
  uid: string;
  name: string;
  confederationCode: string;
  visibleInCatalogForNew?: boolean;
};

export type SeedHistoricalCountry = SeedCountry & {
  successorNames: string[];
  redirectName?: string;
};

type SeedCountryRef = {
  id: string;
  name: string;
};

export type SeedStanding = {
  placement: CompetitionStandingPlacement;
  countryName?: string;
  clubName?: string;
  standingOrder?: number;
  remark?: string | null;
};

export type SeedEdition = {
  name?: string;
  year?: number;
  season?: string | null;
  host?: string | null;
  quantity?: number | null;
  standingMode?: CompetitionEditionStandingMode;
  remark?: string | null;
};

type CompetitionSeedOptions<T extends SeedEdition> = {
  prisma: PrismaClient;
  competition: {
    code: string;
    create: Prisma.CompetitionUncheckedCreateInput;
    update: Prisma.CompetitionUncheckedUpdateInput;
    primaryConfederationCode?: string;
    primaryCountryName?: string;
  };
  confederations: SeedConfederation[];
  countries?: SeedCountry[];
  historicalCountries?: SeedHistoricalCountry[];
  historicalCountryNames?: string[];
  resolveCountries?: (names: string[]) => {
    countries?: SeedCountry[];
    historicalCountries?: SeedHistoricalCountry[];
  };
  editions: T[];
  buildStandings: (edition: T) => SeedStanding[];
  scope?: {
    confederationCodes?: string[];
    countryNames?: string[];
  };
  expected?: {
    editions: number;
    standings: number;
  };
  completedMessage: string;
};

export async function runCompetitionSeed<T extends SeedEdition>({
  prisma,
  competition,
  confederations: confederationSeeds,
  countries: countrySeeds = [],
  historicalCountries = [],
  historicalCountryNames = [],
  resolveCountries,
  editions,
  buildStandings,
  scope,
  expected,
  completedMessage
}: CompetitionSeedOptions<T>) {
  const editionStandings = editions.map((edition) => ({
    edition,
    standings: buildStandings(edition)
  }));
  const resolvedSeedCountries = resolveCountries
    ? resolveCountries(collectStandingCountryNames(editionStandings, scope, historicalCountryNames))
    : {};
  const mergedCountrySeeds = uniqueSeedCountries([
    ...countrySeeds,
    ...(resolvedSeedCountries.countries ?? [])
  ]);
  const mergedHistoricalCountries = uniqueSeedCountries([
    ...historicalCountries,
    ...(resolvedSeedCountries.historicalCountries ?? [])
  ]);
  const confederations = await upsertConfederations(prisma, confederationSeeds);
  const countries = new Map<string, SeedCountryRef>();

  for (const countryData of mergedCountrySeeds) {
    const confederation = getConfederation(confederations, countryData.confederationCode);
    const country = await upsertCountry(prisma, {
      ...countryData,
      confederationId: confederation.id,
      confederationName: confederation.name,
      isHistorical: false
    });
    countries.set(country.name, country);
  }

  for (const countryData of mergedHistoricalCountries) {
    const confederation = getConfederation(confederations, countryData.confederationCode);
    const country = await upsertCountry(prisma, {
      ...countryData,
      confederationId: confederation.id,
      confederationName: confederation.name,
      isHistorical: true,
      visibleInCatalogForNew: false,
      detailRedirectCountryId: countryData.redirectName
        ? countries.get(countryData.redirectName)?.id
        : null
    });
    countries.set(country.name, country);
  }

  await syncCountrySuccessors(prisma, countries, mergedHistoricalCountries);

  const primaryCompetitionRelations = resolvePrimaryCompetitionRelations(
    confederations,
    countries,
    competition.primaryConfederationCode,
    competition.primaryCountryName
  );
  const seededCompetition = await prisma.competition.upsert({
    where: { code: competition.code },
    create: {
      ...competition.create,
      ...primaryCompetitionRelations
    },
    update: {
      ...competition.update,
      ...primaryCompetitionRelations
    },
    select: { id: true }
  });

  await syncCompetitionScopes(prisma, seededCompetition.id, confederations, countries, scope);

  for (const { edition: editionData, standings } of editionStandings) {
    const editionName = editionData.name ?? formatEditionName(editionData);
    const standingMode =
      editionData.standingMode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH;

    validateEditionStandings(competition.code, editionName, standingMode, standings);

    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: seededCompetition.id,
          name: editionName
        }
      },
      create: {
        competitionId: seededCompetition.id,
        name: editionName,
        year: editionData.year ?? null,
        season: editionData.season ?? null,
        host: editionData.host ?? null,
        quantity: editionData.quantity ?? null,
        standingMode,
        remark: editionData.remark ?? null
      },
      update: {
        year: editionData.year ?? null,
        season: editionData.season ?? null,
        host: editionData.host ?? null,
        quantity: editionData.quantity ?? null,
        standingMode,
        remark: editionData.remark ?? null
      },
      select: { id: true }
    });

    await prisma.competitionStanding.deleteMany({
      where: { editionId: edition.id }
    });

    await prisma.competitionStanding.createMany({
      data: standings.flatMap((standing) => {
        const country = standing.countryName
          ? getCountry(countries, standing.countryName, `${competition.code} ${editionName}`)
          : null;

        return [
          {
            editionId: edition.id,
            placement: standing.placement,
            standingOrder: standing.standingOrder ?? 0,
            countryId: country?.id,
            remark: standing.remark ?? null
          }
        ];
      })
    });
  }

  await validateSeedResult(prisma, seededCompetition.id, competition.code, editions, expected);
  printSeedSummary({
    competitionCode: competition.code,
    editions,
    editionStandings,
    countries: mergedCountrySeeds,
    historicalCountries: mergedHistoricalCountries,
    scope
  });
  console.log(completedMessage);
}

export function buildTopFourStandings(input: {
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
}) {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, countryName: input.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, countryName: input.runnerUp },
    { placement: CompetitionStandingPlacement.THIRD_PLACE, countryName: input.thirdPlace },
    { placement: CompetitionStandingPlacement.FOURTH_PLACE, countryName: input.fourthPlace }
  ];
}

export function buildTopThreeStandings(input: {
  champion: string;
  runnerUp: string;
  thirdPlace: string;
}) {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, countryName: input.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, countryName: input.runnerUp },
    { placement: CompetitionStandingPlacement.THIRD_PLACE, countryName: input.thirdPlace }
  ];
}

export function buildFinalOnlyStandings(input: { champion: string; runnerUp: string }) {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, countryName: input.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, countryName: input.runnerUp }
  ];
}

export function buildSemiFinalistStandings(input: {
  champion: string;
  runnerUp: string;
  semiFinalists: [string, string];
}) {
  return [
    ...buildFinalOnlyStandings(input),
    {
      placement: CompetitionStandingPlacement.SEMI_FINALIST,
      countryName: input.semiFinalists[0],
      standingOrder: 1
    },
    {
      placement: CompetitionStandingPlacement.SEMI_FINALIST,
      countryName: input.semiFinalists[1],
      standingOrder: 2
    }
  ];
}

export function buildDoubleThirdPlaceStandings(input: {
  champion: string;
  runnerUp: string;
  thirdPlaces: [string, string];
}) {
  return [
    ...buildFinalOnlyStandings(input),
    {
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      countryName: input.thirdPlaces[0],
      standingOrder: 1
    },
    {
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      countryName: input.thirdPlaces[1],
      standingOrder: 2
    }
  ];
}

export async function runSeed(prisma: PrismaClient, callback: () => Promise<void>) {
  const startedAt = Date.now();

  try {
    await callback();
    console.log(`Seed completed in ${Date.now() - startedAt}ms.`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

async function upsertConfederations(prisma: PrismaClient, confederations: SeedConfederation[]) {
  const result = new Map<string, { id: string; name: string }>();

  for (const confederationData of confederations) {
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
    result.set(confederationData.code, confederation);
  }

  return result;
}

function getConfederation(confederations: Map<string, { id: string; name: string }>, code: string) {
  const confederation = confederations.get(code);

  if (!confederation) {
    throw new Error(`${code} confederation not found.`);
  }

  return confederation;
}

function getCountry(countries: Map<string, SeedCountryRef>, name: string, context: string) {
  const country = countries.get(name);

  if (!country) {
    throw new Error(`${context}: country ${name} not found.`);
  }

  return country;
}

async function upsertCountry(
  prisma: PrismaClient,
  input: SeedCountry & {
    confederationId: string | null;
    confederationName: string | null;
    isHistorical: boolean;
    detailRedirectCountryId?: string | null;
  }
) {
  const existing = await findExistingCountry(prisma, input.uid, input.name);
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
      visibleInCatalog: input.visibleInCatalogForNew ?? false,
      isHistorical: input.isHistorical,
      detailRedirectCountryId: input.detailRedirectCountryId ?? null
    },
    select: { id: true, name: true }
  });
}

async function findExistingCountry(prisma: PrismaClient, uid: string, name: string) {
  const select = {
    id: true,
    uid: true,
    uidSort: true,
    federationId: true,
    federation: true,
    visibleInCatalog: true
  } satisfies Prisma.CountrySelect;

  if (uid !== '-') {
    const byUid = await prisma.country.findFirst({
      where: { uid },
      select
    });

    if (byUid) {
      return byUid;
    }
  }

  return prisma.country.findFirst({
    where: { name },
    select
  });
}

async function syncCountrySuccessors(
  prisma: PrismaClient,
  countries: Map<string, SeedCountryRef>,
  historicalCountries: SeedHistoricalCountry[]
) {
  for (const historicalCountry of historicalCountries) {
    const historical = countries.get(historicalCountry.name);

    if (!historical) {
      continue;
    }

    await prisma.countrySuccessor.deleteMany({
      where: { historicalCountryId: historical.id }
    });

    for (const successorName of historicalCountry.successorNames) {
      const successor = countries.get(successorName);

      if (!successor) {
        continue;
      }

      await prisma.countrySuccessor.upsert({
        where: {
          historicalCountryId_successorCountryId: {
            historicalCountryId: historical.id,
            successorCountryId: successor.id
          }
        },
        create: {
          historicalCountryId: historical.id,
          successorCountryId: successor.id
        },
        update: {}
      });
    }
  }
}

async function syncCompetitionScopes(
  prisma: PrismaClient,
  competitionId: string,
  confederations: Map<string, { id: string; name: string }>,
  countries: Map<string, SeedCountryRef>,
  scope?: CompetitionSeedOptions<SeedEdition>['scope']
) {
  await prisma.competitionScopeConfederation.deleteMany({
    where: { competitionId }
  });
  await prisma.competitionScopeCountry.deleteMany({
    where: { competitionId }
  });

  if (!scope) {
    return;
  }

  for (const code of scope.confederationCodes ?? []) {
    const confederation = getConfederation(confederations, code);

    await prisma.competitionScopeConfederation.create({
      data: {
        competitionId,
        confederationId: confederation.id
      }
    });
  }

  for (const name of scope.countryNames ?? []) {
    const country = getCountry(countries, name, `competition scope ${competitionId}`);

    await prisma.competitionScopeCountry.create({
      data: {
        competitionId,
        countryId: country.id
      }
    });
  }
}

function resolvePrimaryCompetitionRelations(
  confederations: Map<string, { id: string; name: string }>,
  countries: Map<string, SeedCountryRef>,
  primaryConfederationCode?: string,
  primaryCountryName?: string
) {
  return {
    ...(primaryConfederationCode
      ? { confederationId: getConfederation(confederations, primaryConfederationCode).id }
      : {}),
    ...(primaryCountryName
      ? { countryId: getCountry(countries, primaryCountryName, 'primary competition country').id }
      : {})
  };
}

function validateEditionStandings(
  competitionCode: string,
  editionName: string,
  mode: CompetitionEditionStandingMode,
  standings: SeedStanding[]
) {
  const context = `${competitionCode} ${editionName}`;
  const count = (placement: CompetitionStandingPlacement) =>
    standings.filter((standing) => standing.placement === placement).length;
  const counts = {
    champion: count(CompetitionStandingPlacement.CHAMPION),
    runnerUp: count(CompetitionStandingPlacement.RUNNER_UP),
    thirdPlace: count(CompetitionStandingPlacement.THIRD_PLACE),
    fourthPlace: count(CompetitionStandingPlacement.FOURTH_PLACE),
    semiFinalist: count(CompetitionStandingPlacement.SEMI_FINALIST)
  };

  const assertCounts = (expected: typeof counts) => {
    for (const [key, expectedCount] of Object.entries(expected)) {
      const actualCount = counts[key as keyof typeof counts];

      if (actualCount !== expectedCount) {
        throw new Error(
          `${context}: invalid standings for ${mode}. Expected ${key}=${expectedCount}, got ${actualCount}.`
        );
      }
    }
  };

  switch (mode) {
    case CompetitionEditionStandingMode.THIRD_PLACE_MATCH:
      assertCounts({ champion: 1, runnerUp: 1, thirdPlace: 1, fourthPlace: 1, semiFinalist: 0 });
      break;
    case CompetitionEditionStandingMode.SEMI_FINALISTS:
      assertCounts({ champion: 1, runnerUp: 1, thirdPlace: 0, fourthPlace: 0, semiFinalist: 2 });
      break;
    case CompetitionEditionStandingMode.FINAL_ONLY:
      assertCounts({ champion: 1, runnerUp: 1, thirdPlace: 0, fourthPlace: 0, semiFinalist: 0 });
      break;
    case CompetitionEditionStandingMode.LEAGUE_TOP_THREE:
      assertCounts({ champion: 1, runnerUp: 1, thirdPlace: 1, fourthPlace: 0, semiFinalist: 0 });
      break;
    case CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE:
      assertCounts({ champion: 1, runnerUp: 1, thirdPlace: 2, fourthPlace: 0, semiFinalist: 0 });
      break;
    default:
      throw new Error(`${context}: unsupported standing mode ${mode}.`);
  }
}

function collectStandingCountryNames<T extends SeedEdition>(
  editionStandings: Array<{ edition: T; standings: SeedStanding[] }>,
  scope: CompetitionSeedOptions<T>['scope'],
  historicalCountryNames: string[]
) {
  const names = new Set<string>(historicalCountryNames);

  for (const countryName of scope?.countryNames ?? []) {
    names.add(countryName);
  }

  for (const { standings } of editionStandings) {
    for (const standing of standings) {
      if (standing.countryName) {
        names.add(standing.countryName);
      }
    }
  }

  return [...names];
}

function uniqueSeedCountries<T extends SeedCountry>(countries: T[]) {
  return [...new Map(countries.map((country) => [country.name, country])).values()];
}

function formatEditionName(edition: SeedEdition) {
  if (edition.year) {
    return `${edition.year}年`;
  }

  return edition.season ?? '未命名届次';
}

async function validateSeedResult(
  prisma: PrismaClient,
  competitionId: string,
  competitionCode: string,
  editions: SeedEdition[],
  expected?: CompetitionSeedOptions<SeedEdition>['expected']
) {
  if (!expected) {
    return;
  }

  const editionNames = editions.map((edition) => edition.name ?? formatEditionName(edition));
  const seededEditions = await prisma.competitionEdition.findMany({
    where: {
      competitionId,
      name: { in: editionNames }
    },
    select: {
      id: true,
      _count: {
        select: { standings: true }
      }
    }
  });
  const standingCount = seededEditions.reduce(
    (total, edition) => total + edition._count.standings,
    0
  );

  console.log(
    `${competitionCode}: ${seededEditions.length} target editions, ${standingCount} target standings`
  );

  if (seededEditions.length !== expected.editions || standingCount !== expected.standings) {
    throw new Error(
      `${competitionCode} seed count mismatch: expected ${expected.editions} editions / ${expected.standings} standings, got ${seededEditions.length} / ${standingCount}.`
    );
  }
}

function printSeedSummary<T extends SeedEdition>({
  competitionCode,
  editions,
  editionStandings,
  countries,
  historicalCountries,
  scope
}: {
  competitionCode: string;
  editions: T[];
  editionStandings: Array<{ edition: T; standings: SeedStanding[] }>;
  countries: SeedCountry[];
  historicalCountries: SeedHistoricalCountry[];
  scope?: CompetitionSeedOptions<T>['scope'];
}) {
  const standingCount = editionStandings.reduce(
    (total, { standings }) => total + standings.length,
    0
  );
  const standingCountryCount = new Set(
    editionStandings.flatMap(({ standings }) =>
      standings.flatMap((standing) => (standing.countryName ? [standing.countryName] : []))
    )
  ).size;
  const modeCounts = editions.reduce<Record<string, number>>((result, edition) => {
    const mode = edition.standingMode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
    result[mode] = (result[mode] ?? 0) + 1;
    return result;
  }, {});
  const scopeParts = [
    scope?.confederationCodes?.length ? `confederations=${scope.confederationCodes.join('/')}` : '',
    scope?.countryNames?.length ? `countries=${scope.countryNames.join('/')}` : ''
  ].filter(Boolean);

  console.log(
    [
      `${competitionCode} summary:`,
      `seedCountries=${countries.length}`,
      `historicalCountries=${historicalCountries.length}`,
      `standingCountries=${standingCountryCount}`,
      `editions=${editions.length}`,
      `standings=${standingCount}`,
      `modes=${formatCountRecord(modeCounts)}`,
      `scope=${scopeParts.length ? scopeParts.join(', ') : 'global'}`
    ].join(' ')
  );
}

function formatCountRecord(record: Record<string, number>) {
  return Object.entries(record)
    .map(([key, value]) => `${key}:${value}`)
    .join(', ');
}

function toUidSort(uid: string) {
  return /^\d+$/.test(uid) ? Number(uid) : null;
}

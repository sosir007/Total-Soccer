import {
  CompetitionEditionStandingMode,
  CompetitionStandingPlacement,
  CompetitionTargetType,
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

export type SeedClub = {
  uid?: string;
  name: string;
  countryName?: string;
  confederationCode?: string;
  externalUrl?: string | null;
  remark?: string | null;
  exists?: boolean;
};

type SeedClubRef = {
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
  clubs?: SeedClub[];
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
  validateOnly?: boolean;
  completedMessage: string;
};

export type SeedCompetitionPatch = SeedEdition & {
  competitionCode: string;
  standingMode: CompetitionEditionStandingMode;
  standings: SeedStanding[];
};

type CompetitionPatchSeedOptions<T extends SeedCompetitionPatch> = {
  prisma: PrismaClient;
  confederations?: SeedConfederation[];
  countries?: SeedCountry[];
  clubs?: SeedClub[];
  patches: T[];
  expected?: {
    editions: number;
    standings: number;
  };
  validateOnly?: boolean;
  completedMessage: string;
};

export async function runCompetitionSeed<T extends SeedEdition>({
  prisma,
  competition,
  confederations: confederationSeeds,
  countries: countrySeeds = [],
  historicalCountries = [],
  historicalCountryNames = [],
  clubs: clubSeeds = [],
  resolveCountries,
  editions,
  buildStandings,
  scope,
  expected,
  validateOnly = isValidateOnlyRequested(),
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

  validateSeedInput({
    competitionCode: competition.code,
    targetType: getCompetitionTargetType(competition.create.targetType),
    confederations: confederationSeeds,
    countries: mergedCountrySeeds,
    historicalCountries: mergedHistoricalCountries,
    clubs: clubSeeds,
    editions,
    editionStandings,
    scope,
    expected
  });

  if (validateOnly) {
    console.log(`${competition.code}: validate-only passed.`);
    printSeedSummary({
      competitionCode: competition.code,
      editions,
      editionStandings,
      countries: mergedCountrySeeds,
      historicalCountries: mergedHistoricalCountries,
      scope
    });
    return;
  }

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

  const clubs = await upsertSeedClubs(prisma, clubSeeds, confederations, countries);

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
        const club = standing.clubName
          ? getClub(clubs, standing.clubName, `${competition.code} ${editionName}`)
          : null;

        return [
          {
            editionId: edition.id,
            placement: standing.placement,
            standingOrder: standing.standingOrder ?? 0,
            countryId: country?.id,
            clubId: club?.id,
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

export async function runCompetitionPatchSeed<T extends SeedCompetitionPatch>({
  prisma,
  confederations: confederationSeeds = [],
  countries: countrySeeds = [],
  clubs: clubSeeds = [],
  patches,
  expected,
  validateOnly = isValidateOnlyRequested(),
  completedMessage
}: CompetitionPatchSeedOptions<T>) {
  validatePatchSeedInput({
    patches,
    expected
  });

  const competitionCodes = uniqueValues(patches.map((patch) => patch.competitionCode));
  const competitions = await loadPatchCompetitions(prisma, competitionCodes);
  const patchClubNames = uniqueValues(
    patches.flatMap((patch) =>
      patch.standings.flatMap((standing) => (standing.clubName ? [standing.clubName] : []))
    )
  );
  const existingClubs = await loadExistingClubs(prisma, patchClubNames);
  const missingClubNames = patchClubNames.filter(
    (name) => !existingClubs.has(name) && !clubSeeds.some((club) => club.name === name)
  );

  if (missingClubNames.length) {
    throw new Error(`Club patch references unknown clubs: ${missingClubNames.join(', ')}.`);
  }

  if (validateOnly) {
    await validatePatchConflicts(prisma, patches, competitions, existingClubs);
    console.log(`Club competition patches: validate-only passed.`);
    printPatchSeedSummary(patches, clubSeeds);
    return;
  }

  const confederations = confederationSeeds.length
    ? await upsertConfederations(prisma, confederationSeeds)
    : new Map<string, { id: string; name: string }>();
  const countries = await upsertSeedCountries(prisma, countrySeeds, confederations);
  const clubs = mergeMaps(
    existingClubs,
    await upsertSeedClubs(prisma, clubSeeds, confederations, countries)
  );

  await applyCompetitionPatches(prisma, patches, competitions, clubs);
  printPatchSeedSummary(patches, clubSeeds);
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

function getClub(clubs: Map<string, SeedClubRef>, name: string, context: string) {
  const club = clubs.get(name);

  if (!club) {
    throw new Error(`${context}: club ${name} not found.`);
  }

  return club;
}

async function upsertSeedCountries(
  prisma: PrismaClient,
  countrySeeds: SeedCountry[],
  confederations: Map<string, { id: string; name: string }>
) {
  const countries = new Map<string, SeedCountryRef>();

  for (const countryData of countrySeeds) {
    const confederation = getConfederation(confederations, countryData.confederationCode);
    const country = await upsertCountry(prisma, {
      ...countryData,
      confederationId: confederation.id,
      confederationName: confederation.name,
      isHistorical: false
    });
    countries.set(country.name, country);
  }

  return countries;
}

async function upsertSeedClubs(
  prisma: PrismaClient,
  clubSeeds: SeedClub[],
  confederations: Map<string, { id: string; name: string }>,
  countries: Map<string, SeedCountryRef>
) {
  const clubs = new Map<string, SeedClubRef>();

  for (const clubData of clubSeeds) {
    const country = clubData.countryName
      ? getCountry(countries, clubData.countryName, `club ${clubData.name}`)
      : null;
    const confederation = clubData.confederationCode
      ? getConfederation(confederations, clubData.confederationCode)
      : null;
    const club = await upsertClub(prisma, {
      ...clubData,
      countryId: country?.id ?? null,
      federationId: confederation?.id ?? null,
      federation: confederation?.name ?? null
    });
    clubs.set(club.name, club);
  }

  return clubs;
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

async function upsertClub(
  prisma: PrismaClient,
  input: SeedClub & {
    countryId: string | null;
    federationId: string | null;
    federation: string | null;
  }
) {
  const uid = input.uid ?? '-';
  const existing = await findExistingClub(prisma, uid, input.name);

  if (existing) {
    return prisma.club.update({
      where: { id: existing.id },
      data: {
        uid: existing.uid === '-' && uid !== '-' ? uid : existing.uid,
        name: input.name,
        externalUrl: input.externalUrl ?? existing.externalUrl,
        remark: input.remark ?? existing.remark,
        exists: input.exists ?? existing.exists,
        countryId: existing.countryId ?? input.countryId,
        country: existing.country ?? input.countryName ?? null,
        federationId: existing.federationId ?? input.federationId,
        federation: existing.federation ?? input.federation
      },
      select: { id: true, name: true }
    });
  }

  return prisma.club.create({
    data: {
      importKey: `seed:club:${uid === '-' ? input.name : uid}`,
      uid,
      name: input.name,
      externalUrl: input.externalUrl ?? null,
      remark: input.remark ?? null,
      exists: input.exists ?? true,
      countryId: input.countryId,
      country: input.countryName ?? null,
      federationId: input.federationId,
      federation: input.federation
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

async function findExistingClub(prisma: PrismaClient, uid: string, name: string) {
  const select = {
    id: true,
    uid: true,
    externalUrl: true,
    remark: true,
    exists: true,
    countryId: true,
    country: true,
    federationId: true,
    federation: true
  } satisfies Prisma.ClubSelect;

  if (uid !== '-') {
    const byUid = await prisma.club.findFirst({
      where: { uid },
      select
    });

    if (byUid) {
      return byUid;
    }
  }

  return prisma.club.findFirst({
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

  validateStandingRows(context, standings);
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

function validateSeedInput<T extends SeedEdition>({
  competitionCode,
  targetType,
  confederations,
  countries,
  historicalCountries,
  clubs,
  editions,
  editionStandings,
  scope,
  expected
}: {
  competitionCode: string;
  targetType: CompetitionTargetType;
  confederations: SeedConfederation[];
  countries: SeedCountry[];
  historicalCountries: SeedHistoricalCountry[];
  clubs: SeedClub[];
  editions: T[];
  editionStandings: Array<{ edition: T; standings: SeedStanding[] }>;
  scope?: CompetitionSeedOptions<T>['scope'];
  expected?: CompetitionSeedOptions<T>['expected'];
}) {
  const editionNames = editions.map((edition) => edition.name ?? formatEditionName(edition));
  const duplicateEditionNames = findDuplicates(editionNames);

  if (duplicateEditionNames.length) {
    throw new Error(
      `${competitionCode}: duplicate edition names: ${duplicateEditionNames.join(', ')}.`
    );
  }

  for (const { edition, standings } of editionStandings) {
    const editionName = edition.name ?? formatEditionName(edition);
    const standingMode = edition.standingMode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
    validateEditionStandings(competitionCode, editionName, standingMode, standings);
    validateStandingTargets(`${competitionCode} ${editionName}`, targetType, standings);
  }

  validateExpectedCounts(competitionCode, editions, editionStandings, expected);
  validateSeedReferences({
    competitionCode,
    targetType,
    confederations,
    countries,
    historicalCountries,
    clubs,
    editionStandings,
    scope
  });
}

function validateStandingRows(context: string, standings: SeedStanding[]) {
  const countriesInEdition = standings.flatMap((standing) =>
    standing.countryName ? [standing.countryName] : []
  );
  const duplicateCountries = findDuplicates(countriesInEdition);

  if (duplicateCountries.length) {
    throw new Error(`${context}: duplicate standing countries: ${duplicateCountries.join(', ')}.`);
  }

  for (const standing of standings) {
    if (!standing.countryName && !standing.clubName) {
      throw new Error(`${context}: standing ${standing.placement} has no target.`);
    }

    if (standing.countryName && standing.clubName) {
      throw new Error(`${context}: standing ${standing.placement} has both country and club.`);
    }
  }
}

function validateStandingTargets(
  context: string,
  targetType: CompetitionTargetType,
  standings: SeedStanding[]
) {
  for (const standing of standings) {
    if (targetType === CompetitionTargetType.COUNTRY && standing.clubName) {
      throw new Error(
        `${context}: country competition standing cannot use club ${standing.clubName}.`
      );
    }

    if (targetType === CompetitionTargetType.CLUB && standing.countryName) {
      throw new Error(
        `${context}: club competition standing cannot use country ${standing.countryName}.`
      );
    }
  }
}

function validateExpectedCounts<T extends SeedEdition>(
  competitionCode: string,
  editions: T[],
  editionStandings: Array<{ edition: T; standings: SeedStanding[] }>,
  expected?: CompetitionSeedOptions<T>['expected']
) {
  if (!expected) {
    return;
  }

  const standingCount = editionStandings.reduce(
    (total, { standings }) => total + standings.length,
    0
  );

  if (editions.length !== expected.editions || standingCount !== expected.standings) {
    throw new Error(
      `${competitionCode} seed data count mismatch: expected ${expected.editions} editions / ${expected.standings} standings, got ${editions.length} / ${standingCount}.`
    );
  }
}

function validateSeedReferences<T extends SeedEdition>({
  competitionCode,
  targetType,
  confederations,
  countries,
  historicalCountries,
  clubs,
  editionStandings,
  scope
}: {
  competitionCode: string;
  targetType: CompetitionTargetType;
  confederations: SeedConfederation[];
  countries: SeedCountry[];
  historicalCountries: SeedHistoricalCountry[];
  clubs: SeedClub[];
  editionStandings: Array<{ edition: T; standings: SeedStanding[] }>;
  scope?: CompetitionSeedOptions<T>['scope'];
}) {
  const confederationCodes = new Set(confederations.map((confederation) => confederation.code));
  const countryNames = new Set(countries.map((country) => country.name));
  const historicalCountryNames = new Set(historicalCountries.map((country) => country.name));
  const allCountryNames = new Set([...countryNames, ...historicalCountryNames]);
  const clubNames = new Set(clubs.map((club) => club.name));

  for (const country of [...countries, ...historicalCountries]) {
    if (!confederationCodes.has(country.confederationCode)) {
      throw new Error(
        `${competitionCode}: country ${country.name} references unknown confederation ${country.confederationCode}.`
      );
    }
  }

  for (const country of historicalCountries) {
    for (const successorName of country.successorNames) {
      if (!countryNames.has(successorName)) {
        throw new Error(
          `${competitionCode}: historical country ${country.name} references unknown successor ${successorName}.`
        );
      }
    }

    if (country.redirectName && !countryNames.has(country.redirectName)) {
      throw new Error(
        `${competitionCode}: historical country ${country.name} references unknown redirect ${country.redirectName}.`
      );
    }
  }

  for (const code of scope?.confederationCodes ?? []) {
    if (!confederationCodes.has(code)) {
      throw new Error(`${competitionCode}: scope references unknown confederation ${code}.`);
    }
  }

  for (const name of scope?.countryNames ?? []) {
    if (!allCountryNames.has(name)) {
      throw new Error(`${competitionCode}: scope references unknown country ${name}.`);
    }
  }

  for (const { edition, standings } of editionStandings) {
    const editionName = edition.name ?? formatEditionName(edition);

    for (const standing of standings) {
      if (standing.countryName && !allCountryNames.has(standing.countryName)) {
        throw new Error(
          `${competitionCode} ${editionName}: standing country ${standing.countryName} not found in seed countries.`
        );
      }

      if (
        targetType === CompetitionTargetType.CLUB &&
        standing.clubName &&
        !clubNames.has(standing.clubName)
      ) {
        throw new Error(
          `${competitionCode} ${editionName}: standing club ${standing.clubName} not found in seed clubs.`
        );
      }
    }
  }
}

function validatePatchSeedInput<T extends SeedCompetitionPatch>({
  patches,
  expected
}: {
  patches: T[];
  expected?: CompetitionPatchSeedOptions<T>['expected'];
}) {
  const patchEditionKeys = uniqueValues(
    patches.map((patch) => `${patch.competitionCode}:${patch.name ?? formatEditionName(patch)}`)
  );
  const standingCount = patches.reduce((total, patch) => total + patch.standings.length, 0);

  if (
    expected &&
    (patchEditionKeys.length !== expected.editions || standingCount !== expected.standings)
  ) {
    throw new Error(
      `Club patch count mismatch: expected ${expected.editions} editions / ${expected.standings} standings, got ${patchEditionKeys.length} / ${standingCount}.`
    );
  }

  const duplicatePatchKeys = findDuplicates(
    patches.flatMap((patch) => {
      const editionName = patch.name ?? formatEditionName(patch);

      return patch.standings.map(
        (standing) =>
          `${patch.competitionCode}:${editionName}:${standing.placement}:${standing.standingOrder ?? 0}`
      );
    })
  );

  if (duplicatePatchKeys.length) {
    throw new Error(
      `Club patch contains duplicate placement keys: ${duplicatePatchKeys.join(', ')}.`
    );
  }

  for (const patch of patches) {
    const context = `${patch.competitionCode} ${patch.name ?? formatEditionName(patch)}`;
    const allowedPlacements = allowedPlacementsByMode(patch.standingMode);

    for (const standing of patch.standings) {
      if (!allowedPlacements.includes(standing.placement)) {
        throw new Error(
          `${context}: placement ${standing.placement} is not allowed for ${patch.standingMode}.`
        );
      }

      validateStandingRows(context, [standing]);

      if (standing.countryName) {
        throw new Error(
          `${context}: club patch standing cannot use country ${standing.countryName}.`
        );
      }

      if (!standing.clubName) {
        throw new Error(`${context}: club patch standing must include clubName.`);
      }
    }
  }
}

async function loadPatchCompetitions(prisma: PrismaClient, codes: string[]) {
  const competitions = await prisma.competition.findMany({
    where: { code: { in: codes } },
    select: { id: true, code: true, targetType: true }
  });
  const result = new Map(competitions.map((competition) => [competition.code, competition]));
  const missingCodes = codes.filter((code) => !result.has(code));

  if (missingCodes.length) {
    throw new Error(`Club patch references unknown competitions: ${missingCodes.join(', ')}.`);
  }

  for (const competition of result.values()) {
    if (competition.targetType !== CompetitionTargetType.CLUB) {
      throw new Error(
        `Club patch can only target club competitions. ${competition.code} is ${competition.targetType}.`
      );
    }
  }

  return result;
}

async function loadExistingClubs(prisma: PrismaClient, names: string[]) {
  const clubs = await prisma.club.findMany({
    where: { name: { in: names } },
    select: { id: true, name: true }
  });

  return new Map(clubs.map((club) => [club.name, club]));
}

async function validatePatchConflicts<T extends SeedCompetitionPatch>(
  prisma: PrismaClient,
  patches: T[],
  competitions: Map<string, { id: string; code: string; targetType: CompetitionTargetType }>,
  clubs: Map<string, SeedClubRef>
) {
  for (const patch of patches) {
    const competition = getPatchCompetition(competitions, patch.competitionCode);
    const editionName = patch.name ?? formatEditionName(patch);
    const edition = await prisma.competitionEdition.findUnique({
      where: {
        competitionId_name: {
          competitionId: competition.id,
          name: editionName
        }
      },
      select: {
        id: true,
        standings: {
          select: {
            placement: true,
            standingOrder: true,
            clubId: true,
            club: { select: { name: true } }
          }
        }
      }
    });

    if (!edition) {
      continue;
    }

    for (const standing of patch.standings) {
      const existing = edition.standings.filter(
        (item) =>
          item.placement === standing.placement &&
          item.standingOrder === (standing.standingOrder ?? 0)
      );

      if (existing.length > 1) {
        throw new Error(`${patch.competitionCode} ${editionName}: duplicate existing standings.`);
      }

      const club = standing.clubName ? clubs.get(standing.clubName) : null;
      const existingStanding = existing[0];

      if (existingStanding && club && existingStanding.clubId !== club.id) {
        throw new Error(
          `${patch.competitionCode} ${editionName}: ${standing.placement} already belongs to ${existingStanding.club?.name ?? 'unknown club'}.`
        );
      }
    }
  }
}

async function applyCompetitionPatches<T extends SeedCompetitionPatch>(
  prisma: PrismaClient,
  patches: T[],
  competitions: Map<string, { id: string; code: string; targetType: CompetitionTargetType }>,
  clubs: Map<string, SeedClubRef>
) {
  await validatePatchConflicts(prisma, patches, competitions, clubs);

  for (const patch of patches) {
    const competition = getPatchCompetition(competitions, patch.competitionCode);
    const editionName = patch.name ?? formatEditionName(patch);
    const edition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId: competition.id,
          name: editionName
        }
      },
      create: {
        competitionId: competition.id,
        name: editionName,
        year: patch.year ?? null,
        season: patch.season ?? null,
        host: patch.host ?? null,
        quantity: patch.quantity ?? null,
        standingMode: patch.standingMode,
        remark: patch.remark ?? null
      },
      update: {
        year: patch.year ?? null,
        season: patch.season ?? null,
        host: patch.host ?? null,
        quantity: patch.quantity ?? null,
        standingMode: patch.standingMode,
        remark: patch.remark ?? null
      },
      select: { id: true }
    });

    for (const standing of patch.standings) {
      const club = getClub(
        clubs,
        standing.clubName ?? '',
        `${patch.competitionCode} ${editionName}`
      );
      const existing = await prisma.competitionStanding.findFirst({
        where: {
          editionId: edition.id,
          placement: standing.placement,
          standingOrder: standing.standingOrder ?? 0
        },
        select: { id: true, clubId: true }
      });

      if (existing) {
        if (existing.clubId !== club.id) {
          throw new Error(
            `${patch.competitionCode} ${editionName}: ${standing.placement} already belongs to another club.`
          );
        }

        await prisma.competitionStanding.update({
          where: { id: existing.id },
          data: { remark: standing.remark ?? null }
        });
        continue;
      }

      await prisma.competitionStanding.create({
        data: {
          editionId: edition.id,
          placement: standing.placement,
          standingOrder: standing.standingOrder ?? 0,
          clubId: club.id,
          remark: standing.remark ?? null
        }
      });
    }
  }
}

function getPatchCompetition(
  competitions: Map<string, { id: string; code: string; targetType: CompetitionTargetType }>,
  code: string
) {
  const competition = competitions.get(code);

  if (!competition) {
    throw new Error(`Club patch references unknown competition ${code}.`);
  }

  return competition;
}

function allowedPlacementsByMode(
  mode: CompetitionEditionStandingMode
): CompetitionStandingPlacement[] {
  if (mode === CompetitionEditionStandingMode.THIRD_PLACE_MATCH) {
    return [
      CompetitionStandingPlacement.CHAMPION,
      CompetitionStandingPlacement.RUNNER_UP,
      CompetitionStandingPlacement.THIRD_PLACE,
      CompetitionStandingPlacement.FOURTH_PLACE
    ];
  }

  if (mode === CompetitionEditionStandingMode.SEMI_FINALISTS) {
    return [
      CompetitionStandingPlacement.CHAMPION,
      CompetitionStandingPlacement.RUNNER_UP,
      CompetitionStandingPlacement.SEMI_FINALIST
    ];
  }

  if (mode === CompetitionEditionStandingMode.FINAL_ONLY) {
    return [CompetitionStandingPlacement.CHAMPION, CompetitionStandingPlacement.RUNNER_UP];
  }

  if (mode === CompetitionEditionStandingMode.LEAGUE_TOP_THREE) {
    return [
      CompetitionStandingPlacement.CHAMPION,
      CompetitionStandingPlacement.RUNNER_UP,
      CompetitionStandingPlacement.THIRD_PLACE
    ];
  }

  if (mode === CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE) {
    return [
      CompetitionStandingPlacement.CHAMPION,
      CompetitionStandingPlacement.RUNNER_UP,
      CompetitionStandingPlacement.THIRD_PLACE
    ];
  }

  throw new Error(`Unsupported standing mode ${mode}.`);
}

function uniqueSeedCountries<T extends SeedCountry>(countries: T[]) {
  return [...new Map(countries.map((country) => [country.name, country])).values()];
}

function mergeMaps<K, V>(...maps: Array<Map<K, V>>) {
  const result = new Map<K, V>();

  for (const map of maps) {
    for (const [key, value] of map) {
      result.set(key, value);
    }
  }

  return result;
}

function uniqueValues<T>(values: T[]) {
  return [...new Set(values)];
}

function findDuplicates(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }

    seen.add(value);
  }

  return [...duplicates];
}

function formatEditionName(edition: SeedEdition) {
  if (edition.year) {
    return `${edition.year}年`;
  }

  return edition.season ?? '未命名届次';
}

function getCompetitionTargetType(value: unknown) {
  if (value === CompetitionTargetType.COUNTRY || value === CompetitionTargetType.CLUB) {
    return value;
  }

  throw new Error(`Unsupported competition target type ${String(value)}.`);
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

function printPatchSeedSummary<T extends SeedCompetitionPatch>(patches: T[], clubs: SeedClub[]) {
  const editionKeys = uniqueValues(
    patches.map((patch) => `${patch.competitionCode}:${patch.name ?? formatEditionName(patch)}`)
  );
  const standingCount = patches.reduce((total, patch) => total + patch.standings.length, 0);
  const standingClubCount = new Set(
    patches.flatMap((patch) =>
      patch.standings.flatMap((standing) => (standing.clubName ? [standing.clubName] : []))
    )
  ).size;
  const competitionCounts = patches.reduce<Record<string, number>>((result, patch) => {
    result[patch.competitionCode] = (result[patch.competitionCode] ?? 0) + patch.standings.length;
    return result;
  }, {});

  console.log(
    [
      'Club competition patches summary:',
      `seedClubs=${clubs.length}`,
      `standingClubs=${standingClubCount}`,
      `editions=${editionKeys.length}`,
      `standings=${standingCount}`,
      `competitions=${formatCountRecord(competitionCounts) || '-'}`
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

function isValidateOnlyRequested() {
  return process.argv.includes('--validate-only');
}

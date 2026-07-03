import {
  CompetitionEditionStandingMode,
  CompetitionStandingPlacement,
  Prisma,
  PrismaClient
} from '@prisma/client';

type SeedConfederation = {
  uid: string;
  code: string;
  name: string;
  sortOrder: number;
};

type SeedCountry = {
  uid: string;
  name: string;
  confederationCode: string;
  visibleInCatalogForNew?: boolean;
};

type SeedHistoricalCountry = SeedCountry & {
  successorNames: string[];
  redirectName?: string;
};

type SeedCountryRef = {
  id: string;
  name: string;
};

type SeedStanding = {
  placement: CompetitionStandingPlacement;
  countryName?: string;
  clubName?: string;
  standingOrder?: number;
  remark?: string | null;
};

type SeedEdition = {
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
  };
  confederations: SeedConfederation[];
  countries?: SeedCountry[];
  historicalCountries?: SeedHistoricalCountry[];
  editions: T[];
  buildStandings: (edition: T) => SeedStanding[];
  scope?: {
    confederationCodes?: string[];
    countryNames?: string[];
  };
  completedMessage: string;
};

export async function runCompetitionSeed<T extends SeedEdition>({
  prisma,
  competition,
  confederations: confederationSeeds,
  countries: countrySeeds = [],
  historicalCountries = [],
  editions,
  buildStandings,
  scope,
  completedMessage
}: CompetitionSeedOptions<T>) {
  const confederations = await upsertConfederations(prisma, confederationSeeds);
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

  for (const countryData of historicalCountries) {
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

  await syncCountrySuccessors(prisma, countries, historicalCountries);

  const seededCompetition = await prisma.competition.upsert({
    where: { code: competition.code },
    create: competition.create,
    update: competition.update,
    select: { id: true }
  });

  await syncCompetitionScopes(prisma, seededCompetition.id, confederations, countries, scope);

  for (const editionData of editions) {
    const editionName = editionData.name ?? formatEditionName(editionData);
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
        standingMode: editionData.standingMode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
        remark: editionData.remark ?? null
      },
      update: {
        year: editionData.year ?? null,
        season: editionData.season ?? null,
        host: editionData.host ?? null,
        quantity: editionData.quantity ?? null,
        standingMode: editionData.standingMode ?? CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
        remark: editionData.remark ?? null
      },
      select: { id: true }
    });

    await prisma.competitionStanding.deleteMany({
      where: { editionId: edition.id }
    });

    await prisma.competitionStanding.createMany({
      data: buildStandings(editionData).flatMap((standing) => {
        const country = standing.countryName ? countries.get(standing.countryName) : null;

        if (standing.countryName && !country) {
          console.warn(`Skip ${editionName} ${standing.countryName}: country not found.`);
          return [];
        }

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

      await prisma.countrySuccessor.create({
        data: {
          historicalCountryId: historical.id,
          successorCountryId: successor.id
        }
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
    const country = countries.get(name);

    if (!country) {
      console.warn(`Skip competition scope ${name}: country not found.`);
      continue;
    }

    await prisma.competitionScopeCountry.create({
      data: {
        competitionId,
        countryId: country.id
      }
    });
  }
}

function formatEditionName(edition: SeedEdition) {
  if (edition.year) {
    return `${edition.year}年`;
  }

  return edition.season ?? '未命名届次';
}

function toUidSort(uid: string) {
  return /^\d+$/.test(uid) ? Number(uid) : null;
}

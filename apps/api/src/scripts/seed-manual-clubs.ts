import { PrismaClient } from '@prisma/client';
import { MANUAL_CLUB_SEEDS, type ManualClubSeed } from './data/manual-club-seeds.js';
import { runSeed } from './helpers/competition-seed.js';

const prisma = new PrismaClient();

async function main() {
  let created = 0;
  let updated = 0;

  for (const club of MANUAL_CLUB_SEEDS) {
    const result = await upsertManualClub(prisma, club);

    if (result === 'created') {
      created += 1;
    } else {
      updated += 1;
    }
  }

  console.log(`Manual club seed completed. created=${created}, updated=${updated}`);
}

async function upsertManualClub(prisma: PrismaClient, club: ManualClubSeed) {
  const existing = await prisma.club.findFirst({
    where: {
      OR: [{ uid: club.uid }, { name: club.name }]
    },
    select: {
      id: true,
      importKey: true,
      name: true,
      uid: true,
      englishName: true,
      shortName: true,
      alias: true,
      formerName: true,
      externalUrl: true,
      remark: true,
      exists: true,
      visibleInCatalog: true,
      countryId: true,
      country: true,
      countryUid: true,
      federationId: true,
      federation: true
    }
  });

  const country = await prisma.country.findFirst({
    where: { name: club.countryName },
    select: { id: true, uid: true, name: true, federationId: true, federation: true }
  });

  if (!country) {
    throw new Error(`Country not found for club ${club.name}: ${club.countryName}`);
  }

  const confederation = await prisma.confederation.findFirst({
    where: { code: club.confederationCode },
    select: { id: true, name: true, code: true }
  });

  if (!confederation) {
    throw new Error(`Confederation not found for club ${club.name}: ${club.confederationCode}`);
  }

  const data = {
    importKey: existing?.importKey ?? `manual-club:${club.uid}`,
    uid: club.uid,
    name: club.name,
    englishName: club.englishName ?? existing?.englishName ?? null,
    shortName: club.shortName ?? existing?.shortName ?? null,
    formerName: club.formerName ?? existing?.formerName ?? null,
    alias: club.alias ?? existing?.alias ?? null,
    externalUrl: club.externalUrl ?? existing?.externalUrl ?? null,
    remark: club.remark ?? existing?.remark ?? null,
    exists: club.exists ?? existing?.exists ?? true,
    visibleInCatalog: club.visibleInCatalog ?? false,
    countryId: country.id,
    country: country.name,
    countryUid: country.uid,
    federationId: confederation.id,
    federation: confederation.name
  };

  if (existing) {
    await prisma.club.update({
      where: { id: existing.id },
      data
    });
    return 'updated' as const;
  }

  await prisma.club.create({
    data
  });
  return 'created' as const;
}

void runSeed(prisma, main);

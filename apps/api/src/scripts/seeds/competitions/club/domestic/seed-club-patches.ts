import { PrismaClient } from '@prisma/client';
import { runCompetitionPatchSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  CLUB_DOMESTIC_PATCH_CLUBS,
  CLUB_DOMESTIC_PATCHES
} from '../../../../data/competition-patches/club/domestic/index.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionPatchSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['奥地利', '法国', '匈牙利']),
    clubs: CLUB_DOMESTIC_PATCH_CLUBS,
    patches: CLUB_DOMESTIC_PATCHES,
    completedMessage: 'Club competition patches seed completed.'
  });
}

void runSeed(prisma, main);

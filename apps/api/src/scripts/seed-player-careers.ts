import { PlayerCareerType, PrismaClient } from '@prisma/client';
import { runSeed } from './helpers/competition-seed.js';

const prisma = new PrismaClient();
const validateOnly = process.argv.includes('--validate-only');

type PlayerCareerSeed = {
  playerUid: string;
  playerName: string;
  careerType: PlayerCareerType;
  clubUid?: string;
  countryUid?: string;
  teamName: string;
  startYear: number;
  endYear: number;
  appearances: number;
  goals: number;
  assists: number;
  position?: string;
  positionGroup?: string;
  showInProfile: boolean;
  isRepresentative: boolean;
  isLegend: boolean;
  sortOrder: number;
  remark?: string;
};

const PLAYER_CAREER_SEEDS: PlayerCareerSeed[] = [
  {
    playerUid: '52',
    playerName: '弗朗哥·巴雷西',
    careerType: PlayerCareerType.CLUB,
    clubUid: '1099',
    teamName: 'AC米兰',
    startYear: 1977,
    endYear: 1997,
    appearances: 719,
    goals: 33,
    assists: 24,
    position: 'DC',
    showInProfile: true,
    isRepresentative: true,
    isLegend: true,
    sortOrder: 1,
    remark: '按用户提供资料录入。'
  },
  {
    playerUid: '52',
    playerName: '弗朗哥·巴雷西',
    careerType: PlayerCareerType.COUNTRY,
    countryUid: '776',
    teamName: '意大利',
    startYear: 1982,
    endYear: 1994,
    appearances: 81,
    goals: 1,
    assists: 0,
    position: 'DC',
    showInProfile: true,
    isRepresentative: false,
    isLegend: false,
    sortOrder: 2,
    remark: '按用户提供资料录入。'
  }
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const seed of PLAYER_CAREER_SEEDS) {
    const player = await prisma.player.findFirst({
      where: { uid: seed.playerUid },
      select: { id: true, uid: true, chineseName: true }
    });

    if (!player) {
      throw new Error(`Player not found: ${seed.playerName} (${seed.playerUid})`);
    }

    const club = seed.clubUid
      ? await prisma.club.findFirst({
          where: { uid: seed.clubUid },
          select: { id: true, uid: true, name: true }
        })
      : null;
    const country = seed.countryUid
      ? await prisma.country.findFirst({
          where: { uid: seed.countryUid },
          select: { id: true, uid: true, name: true }
        })
      : null;

    if (seed.careerType === PlayerCareerType.CLUB && !club) {
      throw new Error(`Club not found: ${seed.teamName} (${seed.clubUid})`);
    }

    if (seed.careerType === PlayerCareerType.COUNTRY && !country) {
      throw new Error(`Country not found: ${seed.teamName} (${seed.countryUid})`);
    }

    if (validateOnly) {
      console.log(
        `validate-only passed: player=${player.chineseName} (${player.uid}), team=${club?.name ?? country?.name}`
      );
      continue;
    }

    const existing = await prisma.playerCareer.findFirst({
      where: {
        playerId: player.id,
        careerType: seed.careerType,
        clubId: club?.id ?? null,
        countryId: country?.id ?? null
      },
      select: { id: true }
    });

    const data = {
      careerType: seed.careerType,
      clubId: club?.id ?? null,
      countryId: country?.id ?? null,
      startYear: seed.startYear,
      endYear: seed.endYear,
      startSeason: null,
      endSeason: null,
      appearances: seed.appearances,
      goals: seed.goals,
      assists: seed.assists,
      cleanSheets: null,
      goalsConceded: null,
      position: seed.position ?? null,
      positionGroup: seed.positionGroup ?? null,
      showInProfile: seed.showInProfile,
      isRepresentative: seed.isRepresentative,
      isLegend: seed.isLegend,
      sortOrder: seed.sortOrder,
      remark: seed.remark ?? null
    };

    if (existing) {
      await prisma.playerCareer.update({
        where: { id: existing.id },
        data
      });
      updated += 1;
    } else {
      await prisma.playerCareer.create({
        data: {
          playerId: player.id,
          ...data
        }
      });
      created += 1;
    }
  }

  console.log(`Player career seed completed. created=${created}, updated=${updated}`);
}

void runSeed(prisma, main);

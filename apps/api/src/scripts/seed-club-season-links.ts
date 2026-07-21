import { PrismaClient } from '@prisma/client';
import { runSeed } from './helpers/competition-seed.js';

const prisma = new PrismaClient();
const validateOnly = process.argv.includes('--validate-only');

const SANTOS_UID = '335';

const SANTOS_SEASON_LINKS = [
  {
    year: 1956,
    season: '1956',
    externalUrl: 'https://en.wikipedia.org/wiki/1956_Santos_FC_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1957,
    season: '1957',
    externalUrl: 'https://en.wikipedia.org/wiki/1957_Santos_FC_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1958,
    season: '1958',
    externalUrl: 'https://en.wikipedia.org/wiki/1958_Santos_FC_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1959,
    season: '1959',
    externalUrl: 'https://en.wikipedia.org/wiki/1959_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1960,
    season: '1960',
    externalUrl: 'https://en.wikipedia.org/wiki/1960_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1961,
    season: '1961',
    externalUrl: 'https://en.wikipedia.org/wiki/1961_Santos_FC_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1962,
    season: '1962',
    externalUrl: 'https://en.wikipedia.org/wiki/1962_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1963,
    season: '1963',
    externalUrl: 'https://en.wikipedia.org/wiki/1963_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1964,
    season: '1964',
    externalUrl: 'https://en.wikipedia.org/wiki/1964_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1965,
    season: '1965',
    externalUrl: 'https://en.wikipedia.org/wiki/1965_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1966,
    season: '1966',
    externalUrl: 'https://en.wikipedia.org/wiki/1966_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1967,
    season: '1967',
    externalUrl: 'https://en.wikipedia.org/wiki/1967_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1968,
    season: '1968',
    externalUrl: 'https://en.wikipedia.org/wiki/1968_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1969,
    season: '1969',
    externalUrl: 'https://en.wikipedia.org/wiki/1969_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1970,
    season: '1970',
    externalUrl: 'https://en.wikipedia.org/wiki/1970_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1971,
    season: '1971',
    externalUrl: 'https://en.wikipedia.org/wiki/1971_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1972,
    season: '1972',
    externalUrl: 'https://en.wikipedia.org/wiki/1972_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1973,
    season: '1973',
    externalUrl: 'https://en.wikipedia.org/wiki/1973_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1974,
    season: '1974',
    externalUrl: 'https://en.wikipedia.org/wiki/1974_in_Brazilian_football',
    remark: '巴西足球年度页'
  },
  {
    year: 1997,
    season: '1997',
    externalUrl: 'https://en.wikipedia.org/wiki/1997_Campeonato_Brasileiro_S%C3%A9rie_A',
    remark: '赛事赛季页'
  },
  {
    year: 2009,
    season: '2009',
    externalUrl: 'https://en.wikipedia.org/wiki/2009_Campeonato_Brasileiro_S%C3%A9rie_A',
    remark: '赛事赛季页'
  },
  {
    year: 2018,
    season: '2018',
    externalUrl: 'https://en.wikipedia.org/wiki/2018_Santos_FC_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2019,
    season: '2019',
    externalUrl: 'https://en.wikipedia.org/wiki/2019_Santos_FC_season',
    remark: '俱乐部单季页'
  }
] as const;

async function main() {
  const club = await prisma.club.findFirst({
    where: { uid: SANTOS_UID },
    select: { id: true, name: true, uid: true }
  });

  if (!club) {
    throw new Error(`Club UID ${SANTOS_UID} not found.`);
  }

  if (validateOnly) {
    const existingCount = await prisma.clubSeasonLink.count({
      where: { clubId: club.id }
    });
    console.log(
      `validate-only passed: club=${club.name} (${club.uid}), targetLinks=${SANTOS_SEASON_LINKS.length}, existingLinks=${existingCount}`
    );
    return;
  }

  for (const [index, link] of SANTOS_SEASON_LINKS.entries()) {
    await prisma.clubSeasonLink.upsert({
      where: {
        clubId_season: {
          clubId: club.id,
          season: link.season
        }
      },
      create: {
        clubId: club.id,
        year: link.year,
        season: link.season,
        externalUrl: link.externalUrl,
        sourceName: 'Wikipedia',
        remark: link.remark,
        sortOrder: index + 1
      },
      update: {
        year: link.year,
        externalUrl: link.externalUrl,
        sourceName: 'Wikipedia',
        remark: link.remark,
        sortOrder: index + 1
      }
    });
  }

  console.log(
    `Seeded ${SANTOS_SEASON_LINKS.length} club season links for ${club.name} (${club.uid}).`
  );
}

void runSeed(prisma, main);

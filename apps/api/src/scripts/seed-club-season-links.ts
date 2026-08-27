import { PrismaClient } from '@prisma/client';
import { runSeed } from './helpers/competition-seed.js';

const prisma = new PrismaClient();
const validateOnly = process.argv.includes('--validate-only');

const SANTOS_UID = '335';
const AC_MILAN_UID = '1099';

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

const AC_MILAN_SEASON_LINKS = [
  {
    year: 1978,
    season: '1977-78',
    externalUrl: 'https://en.wikipedia.org/wiki/1977%E2%80%9378_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1979,
    season: '1978-79',
    externalUrl: 'https://en.wikipedia.org/wiki/1978%E2%80%9379_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1980,
    season: '1979-80',
    externalUrl: 'https://en.wikipedia.org/wiki/1979%E2%80%9380_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1981,
    season: '1980-81',
    externalUrl: 'https://en.wikipedia.org/wiki/1980%E2%80%9381_Serie_B',
    remark: '赛事赛季页'
  },
  {
    year: 1982,
    season: '1981-82',
    externalUrl: 'https://en.wikipedia.org/wiki/1981%E2%80%9382_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1983,
    season: '1982-83',
    externalUrl: 'https://en.wikipedia.org/wiki/1982%E2%80%9383_Serie_B',
    remark: '赛事赛季页'
  },
  {
    year: 1984,
    season: '1983-84',
    externalUrl: 'https://en.wikipedia.org/wiki/1983%E2%80%9384_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1985,
    season: '1984-85',
    externalUrl: 'https://en.wikipedia.org/wiki/1984%E2%80%9385_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1986,
    season: '1985-86',
    externalUrl: 'https://en.wikipedia.org/wiki/1985%E2%80%9386_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1987,
    season: '1986-87',
    externalUrl: 'https://en.wikipedia.org/wiki/1986%E2%80%9387_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1988,
    season: '1987-88',
    externalUrl: 'https://en.wikipedia.org/wiki/1987%E2%80%9388_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1989,
    season: '1988-89',
    externalUrl: 'https://en.wikipedia.org/wiki/1988%E2%80%9389_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1990,
    season: '1989-90',
    externalUrl: 'https://en.wikipedia.org/wiki/1989%E2%80%9390_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1991,
    season: '1990-91',
    externalUrl: 'https://en.wikipedia.org/wiki/1990%E2%80%9391_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1992,
    season: '1991-92',
    externalUrl: 'https://en.wikipedia.org/wiki/1991%E2%80%9392_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1993,
    season: '1992-93',
    externalUrl: 'https://en.wikipedia.org/wiki/1992%E2%80%9393_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1994,
    season: '1993-94',
    externalUrl: 'https://en.wikipedia.org/wiki/1993%E2%80%9394_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1995,
    season: '1994-95',
    externalUrl: 'https://en.wikipedia.org/wiki/1994%E2%80%9395_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1996,
    season: '1995-96',
    externalUrl: 'https://en.wikipedia.org/wiki/1995%E2%80%9396_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1997,
    season: '1996-97',
    externalUrl: 'https://en.wikipedia.org/wiki/1996%E2%80%9397_AC_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2001,
    season: '2000-01',
    externalUrl: 'https://en.wikipedia.org/wiki/2000%E2%80%9301_A.C._Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2002,
    season: '2001-02',
    externalUrl: 'https://en.wikipedia.org/wiki/2001%E2%80%9302_A.C._Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2003,
    season: '2002-03',
    externalUrl: 'https://en.wikipedia.org/wiki/2002%E2%80%9303_A.C._Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2004,
    season: '2003-04',
    externalUrl: 'https://en.wikipedia.org/wiki/2003%E2%80%9304_A.C._Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2008,
    season: '2007-08',
    externalUrl: 'https://en.wikipedia.org/wiki/2007%E2%80%9308_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 2009,
    season: '2008-09',
    externalUrl: 'https://en.wikipedia.org/wiki/2008%E2%80%9309_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 2010,
    season: '2009-10',
    externalUrl: 'https://en.wikipedia.org/wiki/2009%E2%80%9310_AC_Milan_season',
    remark: '俱乐部单季页'
  }
] as const;

const CLUB_SEASON_LINK_SEEDS = [
  {
    uid: SANTOS_UID,
    links: SANTOS_SEASON_LINKS
  },
  {
    uid: AC_MILAN_UID,
    links: AC_MILAN_SEASON_LINKS
  }
] as const;

async function main() {
  const clubs = await prisma.club.findMany({
    where: { uid: { in: CLUB_SEASON_LINK_SEEDS.map((seed) => seed.uid) } },
    select: { id: true, name: true, uid: true }
  });
  const clubByUid = new Map(clubs.map((club) => [club.uid, club]));

  const missingUid = CLUB_SEASON_LINK_SEEDS.find((seed) => !clubByUid.has(seed.uid))?.uid;
  if (missingUid) {
    throw new Error(`Club UID ${missingUid} not found.`);
  }

  if (validateOnly) {
    for (const seed of CLUB_SEASON_LINK_SEEDS) {
      const club = clubByUid.get(seed.uid)!;
      const existingCount = await prisma.clubSeasonLink.count({
        where: { clubId: club.id }
      });
      console.log(
        `validate-only passed: club=${club.name} (${club.uid}), targetLinks=${seed.links.length}, existingLinks=${existingCount}`
      );
    }
    return;
  }

  for (const seed of CLUB_SEASON_LINK_SEEDS) {
    const club = clubByUid.get(seed.uid)!;

    for (const [index, link] of seed.links.entries()) {
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

    console.log(`Seeded ${seed.links.length} club season links for ${club.name} (${club.uid}).`);
  }
}

void runSeed(prisma, main);

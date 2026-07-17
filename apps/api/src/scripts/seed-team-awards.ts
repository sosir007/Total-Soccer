import { AwardScopeType, AwardTargetType, LifecycleStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cliArgs = process.argv
  .slice(2)
  .filter((arg) => arg !== '--' && !arg.includes('/node') && !arg.includes('seed-team-awards.ts'));
const args = new Set(cliArgs);
const validateOnly = args.has('--validate-only');
const validateData = args.has('--validate-data');
const requestedCode = cliArgs.find((arg) => !arg.startsWith('--'));

const IFFHS_AWARD_CODE = 'IFFHS_WORLD_BEST_CLUB';

const CLUB_UIDS = {
  Roma: '1100',
  'Red Star Belgrade': '1955',
  Marseille: '866',
  Ajax: '992',
  Milan: '1099',
  'Real Madrid': '1736',
  Juventus: '1139',
  Barcelona: '1708',
  'Paris Saint-Germain': '868',
  Parma: '1156',
  'América de Cali': '417',
  'Borussia Dortmund': '907',
  'Inter Milan': '1135',
  'Vasco da Gama': '339',
  'Bayern Munich': '915',
  'Manchester United': '680',
  Palmeiras: '329',
  Galatasaray: '1871',
  'Boca Juniors': '82',
  Liverpool: '676',
  Arsenal: '602',
  Santos: '335',
  Valencia: '1775',
  Sevilla: '1759',
  Chelsea: '630',
  'Vélez Sarsfield': '98',
  'Atlético Madrid': '1687',
  Napoli: '1150',
  'Atlético Nacional': '427',
  Grêmio: '324',
  'Red Bull Salzburg': '158',
  'Manchester City': '679',
  'Atlético Mineiro': '314',
  Flamengo: '322',
  'Bayer Leverkusen': '901',
  Atalanta: '1106'
} satisfies Record<string, string>;

const IFFHS_RESULTS: Array<{
  year: number;
  rank: 1 | 2 | 3;
  club: keyof typeof CLUB_UIDS;
  points: string;
}> = [
  { year: 1991, rank: 1, club: 'Roma', points: '347.5' },
  { year: 1991, rank: 2, club: 'Red Star Belgrade', points: '344.5' },
  { year: 1991, rank: 3, club: 'Marseille', points: '299.5' },
  { year: 1992, rank: 1, club: 'Ajax', points: '331' },
  { year: 1992, rank: 2, club: 'Milan', points: '330' },
  { year: 1992, rank: 3, club: 'Real Madrid', points: '323' },
  { year: 1993, rank: 1, club: 'Juventus', points: '372.5' },
  { year: 1993, rank: 2, club: 'Milan', points: '367.5' },
  { year: 1993, rank: 3, club: 'Barcelona', points: '319' },
  { year: 1994, rank: 1, club: 'Paris Saint-Germain', points: '334' },
  { year: 1994, rank: 2, club: 'Parma', points: '332.5' },
  { year: 1994, rank: 3, club: 'Milan', points: '310' },
  { year: 1995, rank: 1, club: 'Milan', points: '367.5' },
  { year: 1995, rank: 2, club: 'Juventus', points: '320' },
  { year: 1995, rank: 3, club: 'Ajax', points: '300' },
  { year: 1996, rank: 1, club: 'Juventus', points: '335' },
  { year: 1996, rank: 2, club: 'América de Cali', points: '261.5' },
  { year: 1996, rank: 3, club: 'Barcelona', points: '256' },
  { year: 1997, rank: 1, club: 'Barcelona', points: '378' },
  { year: 1997, rank: 2, club: 'Juventus', points: '310' },
  { year: 1997, rank: 3, club: 'Borussia Dortmund', points: '308' },
  { year: 1998, rank: 1, club: 'Inter Milan', points: '326' },
  { year: 1998, rank: 2, club: 'Vasco da Gama', points: '295.5' },
  { year: 1998, rank: 3, club: 'Bayern Munich', points: '288' },
  { year: 1999, rank: 1, club: 'Manchester United', points: '361' },
  { year: 1999, rank: 2, club: 'Palmeiras', points: '291' },
  { year: 1999, rank: 3, club: 'Parma', points: '289' },
  { year: 2000, rank: 1, club: 'Real Madrid', points: '327' },
  { year: 2000, rank: 2, club: 'Galatasaray', points: '322' },
  { year: 2000, rank: 3, club: 'Boca Juniors', points: '296' },
  { year: 2001, rank: 1, club: 'Liverpool', points: '358' },
  { year: 2001, rank: 2, club: 'Barcelona', points: '298' },
  { year: 2001, rank: 3, club: 'Bayern Munich', points: '292' },
  { year: 2002, rank: 1, club: 'Real Madrid', points: '312' },
  { year: 2002, rank: 2, club: 'Manchester United', points: '306' },
  { year: 2002, rank: 3, club: 'Arsenal', points: '289' },
  { year: 2003, rank: 1, club: 'Milan', points: '295' },
  { year: 2003, rank: 2, club: 'Real Madrid', points: '293' },
  { year: 2003, rank: 3, club: 'Santos', points: '284' },
  { year: 2004, rank: 1, club: 'Valencia', points: '274' },
  { year: 2004, rank: 2, club: 'Boca Juniors', points: '270' },
  { year: 2004, rank: 3, club: 'Manchester United', points: '265' },
  { year: 2005, rank: 1, club: 'Liverpool', points: '317' },
  { year: 2005, rank: 2, club: 'Inter Milan', points: '307' },
  { year: 2005, rank: 3, club: 'Bayern Munich', points: '281' },
  { year: 2006, rank: 1, club: 'Sevilla', points: '295' },
  { year: 2006, rank: 2, club: 'Inter Milan', points: '286' },
  { year: 2006, rank: 3, club: 'Roma', points: '277' },
  { year: 2007, rank: 1, club: 'Sevilla', points: '306' },
  { year: 2007, rank: 2, club: 'Manchester United', points: '281' },
  { year: 2007, rank: 3, club: 'Milan', points: '280' },
  { year: 2008, rank: 1, club: 'Manchester United', points: '292' },
  { year: 2008, rank: 2, club: 'Bayern Munich', points: '272' },
  { year: 2008, rank: 3, club: 'Liverpool', points: '267' },
  { year: 2009, rank: 1, club: 'Barcelona', points: '341' },
  { year: 2009, rank: 2, club: 'Chelsea', points: '292' },
  { year: 2009, rank: 3, club: 'Manchester United', points: '291' },
  { year: 2010, rank: 1, club: 'Inter Milan', points: '300' },
  { year: 2010, rank: 2, club: 'Bayern Munich', points: '268' },
  { year: 2010, rank: 3, club: 'Barcelona', points: '266' },
  { year: 2011, rank: 1, club: 'Barcelona', points: '367' },
  { year: 2011, rank: 2, club: 'Real Madrid', points: '312' },
  { year: 2011, rank: 3, club: 'Vélez Sarsfield', points: '271' },
  { year: 2012, rank: 1, club: 'Barcelona', points: '307' },
  { year: 2012, rank: 2, club: 'Chelsea', points: '279' },
  { year: 2012, rank: 3, club: 'Boca Juniors', points: '278' },
  { year: 2013, rank: 1, club: 'Bayern Munich', points: '370' },
  { year: 2013, rank: 2, club: 'Real Madrid', points: '290' },
  { year: 2013, rank: 3, club: 'Chelsea', points: '273' },
  { year: 2014, rank: 1, club: 'Real Madrid', points: '381' },
  { year: 2014, rank: 2, club: 'Bayern Munich', points: '276' },
  { year: 2014, rank: 3, club: 'Atlético Madrid', points: '267' },
  { year: 2015, rank: 1, club: 'Barcelona', points: '379' },
  { year: 2015, rank: 2, club: 'Juventus', points: '286' },
  { year: 2015, rank: 3, club: 'Napoli', points: '268' },
  { year: 2016, rank: 1, club: 'Atlético Nacional', points: '383' },
  { year: 2016, rank: 2, club: 'Real Madrid', points: '310' },
  { year: 2016, rank: 3, club: 'Barcelona', points: '280' },
  { year: 2017, rank: 1, club: 'Real Madrid', points: '328' },
  { year: 2017, rank: 2, club: 'Grêmio', points: '286' },
  { year: 2017, rank: 3, club: 'Manchester United', points: '284' },
  { year: 2018, rank: 1, club: 'Atlético Madrid', points: '289' },
  { year: 2018, rank: 2, club: 'Real Madrid', points: '284' },
  { year: 2018, rank: 3, club: 'Red Bull Salzburg', points: '278' },
  { year: 2019, rank: 1, club: 'Liverpool', points: '316' },
  { year: 2019, rank: 2, club: 'Barcelona', points: '293' },
  { year: 2019, rank: 3, club: 'Manchester City', points: '284' },
  { year: 2020, rank: 1, club: 'Bayern Munich', points: '260' },
  { year: 2020, rank: 2, club: 'Palmeiras', points: '230' },
  { year: 2020, rank: 3, club: 'Paris Saint-Germain', points: '226' },
  { year: 2021, rank: 1, club: 'Palmeiras', points: '322' },
  { year: 2021, rank: 2, club: 'Atlético Mineiro', points: '313' },
  { year: 2021, rank: 3, club: 'Manchester City', points: '300' },
  { year: 2022, rank: 1, club: 'Flamengo', points: '299' },
  { year: 2022, rank: 2, club: 'Palmeiras', points: '284' },
  { year: 2022, rank: 3, club: 'Liverpool', points: '273' },
  { year: 2023, rank: 1, club: 'Manchester City', points: '359' },
  { year: 2023, rank: 2, club: 'Real Madrid', points: '332' },
  { year: 2023, rank: 3, club: 'Inter Milan', points: '289' },
  { year: 2024, rank: 1, club: 'Real Madrid', points: '441' },
  { year: 2024, rank: 2, club: 'Bayer Leverkusen', points: '384' },
  { year: 2024, rank: 3, club: 'Atalanta', points: '380' },
  { year: 2025, rank: 1, club: 'Paris Saint-Germain', points: '613' },
  { year: 2025, rank: 2, club: 'Real Madrid', points: '471' },
  { year: 2025, rank: 3, club: 'Chelsea', points: '447' }
];

const TEAM_HONOR_RULES = [
  {
    code: 'CLUB_WORLD_ANNUAL_RANKING_1',
    name: '俱乐部世界年度排名第一',
    rank: 1,
    baseScore: 2,
    coefficient: 1
  },
  {
    code: 'CLUB_WORLD_ANNUAL_RANKING_2',
    name: '俱乐部世界年度排名第二',
    rank: 2,
    baseScore: 2,
    coefficient: 0.5
  },
  {
    code: 'CLUB_WORLD_ANNUAL_RANKING_3',
    name: '俱乐部世界年度排名第三',
    rank: 3,
    baseScore: 2,
    coefficient: 0.3
  }
] as const;

async function main() {
  if (requestedCode && requestedCode !== 'iffhs-world-best-club') {
    console.log(`No team-award seed matched: ${requestedCode}`);
    return;
  }

  const clubMap = await ensureSeedClubs();
  await validateClubMappings(clubMap);

  if (validateData || validateOnly) {
    console.log(`IFFHS data rows: ${IFFHS_RESULTS.length}`);
    console.log(`IFFHS years: ${new Set(IFFHS_RESULTS.map((item) => item.year)).size}`);
  }

  if (validateOnly || validateData) {
    return;
  }

  await seedTeamHonorRules();
  const award = await prisma.award.upsert({
    where: { code: IFFHS_AWARD_CODE },
    create: {
      code: IFFHS_AWARD_CODE,
      name: 'IFFHS世界最佳俱乐部',
      externalUrl: 'https://en.wikipedia.org/wiki/IFFHS_World%27s_Best_Club',
      targetType: AwardTargetType.CLUB,
      scopeType: AwardScopeType.WORLD,
      category: '年度俱乐部排名',
      level: '团队附加分',
      description: 'IFFHS 男子俱乐部年度最终榜前三名。',
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 10010
    },
    update: {
      name: 'IFFHS世界最佳俱乐部',
      externalUrl: 'https://en.wikipedia.org/wiki/IFFHS_World%27s_Best_Club',
      targetType: AwardTargetType.CLUB,
      scopeType: AwardScopeType.WORLD,
      category: '年度俱乐部排名',
      level: '团队附加分',
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 10010
    }
  });

  for (const year of [...new Set(IFFHS_RESULTS.map((item) => item.year))]) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${year}年`,
        year
      },
      update: {
        year
      }
    });
    const rows = IFFHS_RESULTS.filter((item) => item.year === year);

    await prisma.awardRecipient.deleteMany({
      where: { editionId: edition.id }
    });
    await prisma.awardRecipient.createMany({
      data: rows.map((item) => ({
        editionId: edition.id,
        targetType: AwardTargetType.CLUB,
        clubId: clubMap.get(CLUB_UIDS[item.club])!.id,
        rank: item.rank,
        placement: `第${item.rank}名`,
        remark: `IFFHS 年度积分 ${item.points}`
      }))
    });
  }

  console.log(`Seeded ${IFFHS_AWARD_CODE}: ${IFFHS_RESULTS.length} recipients.`);
}

async function ensureSeedClubs() {
  const austria = await prisma.country.findFirst({
    where: { name: '奥地利' },
    include: {
      federationRef: true
    }
  });

  if (!austria) {
    throw new Error('Country not found: 奥地利');
  }

  await prisma.club.upsert({
    where: { importKey: 'manual:club:158' },
    create: {
      importKey: 'manual:club:158',
      uid: '158',
      name: '萨尔茨堡红牛',
      exists: true,
      visibleInCatalog: false,
      countryUid: austria.uid,
      countryId: austria.id,
      country: austria.name,
      federation: austria.federationRef?.name ?? austria.federation,
      federationId: austria.federationId
    },
    update: {
      name: '萨尔茨堡红牛',
      exists: true,
      visibleInCatalog: false,
      countryUid: austria.uid,
      countryId: austria.id,
      country: austria.name,
      federation: austria.federationRef?.name ?? austria.federation,
      federationId: austria.federationId
    }
  });

  const clubs = await prisma.club.findMany({
    where: {
      uid: {
        in: [...new Set(Object.values(CLUB_UIDS))]
      }
    },
    select: {
      id: true,
      uid: true,
      name: true
    }
  });

  return new Map(clubs.map((club) => [club.uid, club]));
}

async function validateClubMappings(
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
  const missing = Object.entries(CLUB_UIDS).filter(([, uid]) => !clubMap.has(uid));

  if (missing.length) {
    throw new Error(
      `IFFHS seed references missing clubs: ${missing
        .map(([name, uid]) => `${name}(${uid})`)
        .join(', ')}`
    );
  }
}

async function seedTeamHonorRules() {
  for (const rule of TEAM_HONOR_RULES) {
    await prisma.teamHonorRule.upsert({
      where: { code: rule.code },
      create: {
        code: rule.code,
        name: rule.name,
        targetType: AwardTargetType.CLUB,
        scopeType: AwardScopeType.WORLD,
        category: '年度俱乐部排名',
        rank: rule.rank,
        baseScore: rule.baseScore,
        coefficient: rule.coefficient,
        enabled: true,
        sortOrder: 10000 + rule.rank * 10,
        remark: 'IFFHS 世界最佳俱乐部年度最终榜前三名。'
      },
      update: {
        name: rule.name,
        targetType: AwardTargetType.CLUB,
        scopeType: AwardScopeType.WORLD,
        category: '年度俱乐部排名',
        rank: rule.rank,
        baseScore: rule.baseScore,
        coefficient: rule.coefficient,
        enabled: true,
        sortOrder: 10000 + rule.rank * 10,
        remark: 'IFFHS 世界最佳俱乐部年度最终榜前三名。'
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
const LAUREUS_COUNTRY_AWARD_CODE = 'LAUREUS_WORLD_TEAM_OF_THE_YEAR_COUNTRY';
const LAUREUS_CLUB_AWARD_CODE = 'LAUREUS_WORLD_TEAM_OF_THE_YEAR_CLUB';
const LAUREUS_EXTERNAL_URL = 'https://www.laureus.com/world-sports-awards/past-winners';
const WORLD_SOCCER_COUNTRY_AWARD_CODE = 'WORLD_SOCCER_TEAM_OF_THE_YEAR_COUNTRY';
const WORLD_SOCCER_CLUB_AWARD_CODE = 'WORLD_SOCCER_TEAM_OF_THE_YEAR_CLUB';
const WORLD_SOCCER_EXTERNAL_URL =
  "https://en.wikipedia.org/wiki/World_Soccer_(magazine)#Men's_World_Team_of_the_Year";
const GAZZETTA_COUNTRY_AWARD_CODE = 'GAZZETTA_WORLD_TEAM_OF_THE_YEAR_COUNTRY';
const GAZZETTA_CLUB_AWARD_CODE = 'GAZZETTA_WORLD_TEAM_OF_THE_YEAR_CLUB';
const GAZZETTA_EXTERNAL_URL = 'https://en.wikipedia.org/wiki/Gazzetta_Sports_Awards#Worldwide';

const CLUB_UIDS = {
  Roma: '1100',
  'Red Star Belgrade': '1955',
  Marseille: '866',
  'Hamburger SV': '947',
  Everton: '650',
  Porto: '1478',
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
  'Leicester City': '673',
  'Atlético Mineiro': '314',
  Flamengo: '322',
  'Bayer Leverkusen': '901',
  Atalanta: '1106'
} satisfies Record<string, string>;

const COUNTRY_UIDS = {
  France: '769',
  'Soviet Union': '583',
  'West Germany': '584',
  Germany: '771',
  Netherlands: '784',
  Denmark: '764',
  Nigeria: '38',
  Greece: '772',
  Iraq: '115',
  Italy: '776',
  Spain: '796',
  Argentina: '1649',
  Brazil: '1651'
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

const LAUREUS_COUNTRY_RESULTS: Array<{
  year: number;
  country: keyof typeof COUNTRY_UIDS;
  name: string;
}> = [
  { year: 2002, country: 'France', name: 'France Men’s Football Team' },
  { year: 2003, country: 'Brazil', name: 'Brazil Men’s Football Team' },
  { year: 2005, country: 'Greece', name: 'Greece Men’s Football Team' },
  { year: 2007, country: 'Italy', name: 'Italy Men’s Football Team' },
  { year: 2011, country: 'Spain', name: 'Spain Men’s Football Team' },
  { year: 2015, country: 'Germany', name: 'Germany Men’s Football Team' },
  { year: 2019, country: 'France', name: 'France Men’s Football Team' },
  { year: 2022, country: 'Italy', name: 'Italy National Football Team' },
  { year: 2023, country: 'Argentina', name: 'Argentina Men’s Football Team' }
];

const LAUREUS_CLUB_RESULTS: Array<{
  year: number;
  club: keyof typeof CLUB_UIDS;
  name: string;
}> = [
  { year: 2000, club: 'Manchester United', name: 'Manchester United' },
  { year: 2012, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2014, club: 'Bayern Munich', name: 'Bayern Munich' },
  { year: 2021, club: 'Bayern Munich', name: 'Bayern Munich' },
  { year: 2025, club: 'Real Madrid', name: 'Real Madrid Men’s Football Team' },
  { year: 2026, club: 'Paris Saint-Germain', name: 'Paris Saint-Germain' }
];

const WORLD_SOCCER_COUNTRY_RESULTS: Array<{
  year: number;
  country: keyof typeof COUNTRY_UIDS;
  name: string;
}> = [
  { year: 1982, country: 'Brazil', name: 'Brazil national football team' },
  { year: 1984, country: 'France', name: 'France national football team' },
  { year: 1986, country: 'Argentina', name: 'Argentina national football team' },
  { year: 1988, country: 'Netherlands', name: 'Netherlands national football team' },
  { year: 1990, country: 'West Germany', name: 'West Germany national football team' },
  { year: 1991, country: 'France', name: 'France national football team' },
  { year: 1992, country: 'Denmark', name: 'Denmark national football team' },
  { year: 1996, country: 'Nigeria', name: 'Nigeria national football team' },
  { year: 1998, country: 'France', name: 'France national football team' },
  { year: 2000, country: 'France', name: 'France national football team' },
  { year: 2002, country: 'Brazil', name: 'Brazil national football team' },
  { year: 2004, country: 'Greece', name: 'Greece national football team' },
  { year: 2007, country: 'Iraq', name: 'Iraq national football team' },
  { year: 2008, country: 'Spain', name: 'Spain national football team' },
  { year: 2010, country: 'Spain', name: 'Spain national football team' },
  { year: 2012, country: 'Spain', name: 'Spain national football team' },
  { year: 2014, country: 'Germany', name: 'Germany national football team' },
  { year: 2018, country: 'France', name: 'France national football team' },
  { year: 2021, country: 'Italy', name: 'Italy national football team' },
  { year: 2022, country: 'Argentina', name: 'Argentina national football team' },
  { year: 2024, country: 'Spain', name: 'Spain national football team' }
];

const WORLD_SOCCER_CLUB_RESULTS: Array<{
  year: number;
  club: keyof typeof CLUB_UIDS;
  name: string;
}> = [
  { year: 1983, club: 'Hamburger SV', name: 'Hamburger SV' },
  { year: 1985, club: 'Everton', name: 'Everton' },
  { year: 1987, club: 'Porto', name: 'FC Porto' },
  { year: 1989, club: 'Milan', name: 'AC Milan' },
  { year: 1993, club: 'Parma', name: 'Parma' },
  { year: 1994, club: 'Milan', name: 'AC Milan' },
  { year: 1995, club: 'Ajax', name: 'Ajax' },
  { year: 1997, club: 'Borussia Dortmund', name: 'Borussia Dortmund' },
  { year: 1999, club: 'Manchester United', name: 'Manchester United' },
  { year: 2001, club: 'Liverpool', name: 'Liverpool' },
  { year: 2003, club: 'Milan', name: 'AC Milan' },
  { year: 2005, club: 'Liverpool', name: 'Liverpool' },
  { year: 2006, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2009, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2011, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2013, club: 'Bayern Munich', name: 'Bayern Munich' },
  { year: 2015, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2016, club: 'Leicester City', name: 'Leicester City' },
  { year: 2017, club: 'Real Madrid', name: 'Real Madrid' },
  { year: 2019, club: 'Liverpool', name: 'Liverpool' },
  { year: 2020, club: 'Bayern Munich', name: 'Bayern Munich' },
  { year: 2023, club: 'Manchester City', name: 'Manchester City' },
  { year: 2025, club: 'Paris Saint-Germain', name: 'Paris Saint-Germain' }
];

const GAZZETTA_COUNTRY_RESULTS: Array<{
  year: number;
  country: keyof typeof COUNTRY_UIDS;
  name: string;
}> = [
  { year: 1978, country: 'Argentina', name: 'Argentina national football team' },
  { year: 1979, country: 'Soviet Union', name: 'Soviet Union national football team' },
  { year: 1980, country: 'West Germany', name: 'West Germany national football team' },
  { year: 1982, country: 'Italy', name: 'Italy national football team' },
  { year: 1986, country: 'Argentina', name: 'Argentina national football team' },
  { year: 1990, country: 'West Germany', name: 'West Germany national football team' },
  { year: 1994, country: 'Brazil', name: 'Brazil national football team' },
  { year: 1998, country: 'France', name: 'France national football team' },
  { year: 2000, country: 'France', name: 'France national football team' },
  { year: 2002, country: 'Brazil', name: 'Brazil national football team' },
  { year: 2006, country: 'Italy', name: 'Italy national football team' },
  { year: 2010, country: 'Spain', name: 'Spain national football team' },
  { year: 2012, country: 'Spain', name: 'Spain national football team' },
  { year: 2014, country: 'Germany', name: 'Germany national football team' },
  { year: 2018, country: 'France', name: 'France national football team' }
];

const GAZZETTA_CLUB_RESULTS: Array<{
  year: number;
  club: keyof typeof CLUB_UIDS;
  name: string;
}> = [
  { year: 1985, club: 'Juventus', name: 'Juventus' },
  { year: 1989, club: 'Milan', name: 'AC Milan' },
  { year: 1999, club: 'Manchester United', name: 'Manchester United' },
  { year: 2009, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2011, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2013, club: 'Bayern Munich', name: 'Bayern Munich' },
  { year: 2015, club: 'Barcelona', name: 'FC Barcelona' },
  { year: 2016, club: 'Leicester City', name: 'Leicester City' },
  { year: 2017, club: 'Real Madrid', name: 'Real Madrid' },
  { year: 2019, club: 'Liverpool', name: 'Liverpool' },
  { year: 2020, club: 'Bayern Munich', name: 'Bayern Munich' }
];

async function main() {
  if (requestedCode && !shouldRunSeed(requestedCode)) {
    console.log(`No team-award seed matched: ${requestedCode}`);
    return;
  }

  const clubMap = await ensureSeedClubs();
  const countryMap = await findSeedCountries();

  if (shouldRunIffhsSeed()) {
    await validateClubMappings(clubMap);
  }

  if (shouldRunLaureusSeed()) {
    await validateLaureusMappings(countryMap, clubMap);
  }

  if (shouldRunWorldSoccerSeed()) {
    await validateWorldSoccerMappings(countryMap, clubMap);
  }

  if (shouldRunGazzettaSeed()) {
    await validateGazzettaMappings(countryMap, clubMap);
  }

  if ((validateData || validateOnly) && shouldRunIffhsSeed()) {
    console.log(`IFFHS data rows: ${IFFHS_RESULTS.length}`);
    console.log(`IFFHS years: ${new Set(IFFHS_RESULTS.map((item) => item.year)).size}`);
  }

  if ((validateData || validateOnly) && shouldRunLaureusSeed()) {
    console.log(
      `Laureus country data rows: ${LAUREUS_COUNTRY_RESULTS.length}, club data rows: ${LAUREUS_CLUB_RESULTS.length}`
    );
    console.log(
      `Laureus football years: ${
        new Set([
          ...LAUREUS_COUNTRY_RESULTS.map((item) => item.year),
          ...LAUREUS_CLUB_RESULTS.map((item) => item.year)
        ]).size
      }`
    );
  }

  if ((validateData || validateOnly) && shouldRunWorldSoccerSeed()) {
    console.log(
      `World Soccer country data rows: ${WORLD_SOCCER_COUNTRY_RESULTS.length}, club data rows: ${WORLD_SOCCER_CLUB_RESULTS.length}`
    );
    console.log(
      `World Soccer football years: ${
        new Set([
          ...WORLD_SOCCER_COUNTRY_RESULTS.map((item) => item.year),
          ...WORLD_SOCCER_CLUB_RESULTS.map((item) => item.year)
        ]).size
      }`
    );
  }

  if ((validateData || validateOnly) && shouldRunGazzettaSeed()) {
    console.log(
      `Gazzetta country data rows: ${GAZZETTA_COUNTRY_RESULTS.length}, club data rows: ${GAZZETTA_CLUB_RESULTS.length}`
    );
    console.log(
      `Gazzetta football years: ${
        new Set([
          ...GAZZETTA_COUNTRY_RESULTS.map((item) => item.year),
          ...GAZZETTA_CLUB_RESULTS.map((item) => item.year)
        ]).size
      }`
    );
  }

  if (validateOnly || validateData) {
    return;
  }

  await seedTeamHonorRules();
  if (shouldRunIffhsSeed()) {
    await seedIffhsWorldBestClub(clubMap);
  }

  if (shouldRunLaureusSeed()) {
    await seedLaureusWorldTeamAwards(countryMap, clubMap);
  }

  if (shouldRunWorldSoccerSeed()) {
    await seedWorldSoccerWorldTeamAwards(countryMap, clubMap);
  }

  if (shouldRunGazzettaSeed()) {
    await seedGazzettaWorldTeamAwards(countryMap, clubMap);
  }
}

function shouldRunSeed(code: string) {
  return [
    'iffhs-world-best-club',
    'laureus-world-team',
    'laureus-world-team-country',
    'laureus-world-team-club',
    'world-soccer-team-of-the-year',
    'world-soccer-team-of-the-year-country',
    'world-soccer-team-of-the-year-club',
    'gazzetta-world-team-of-the-year',
    'gazzetta-world-team-of-the-year-country',
    'gazzetta-world-team-of-the-year-club'
  ].includes(code);
}

function shouldRunIffhsSeed() {
  return !requestedCode || requestedCode === 'iffhs-world-best-club';
}

function shouldRunLaureusSeed() {
  return (
    !requestedCode ||
    requestedCode === 'laureus-world-team' ||
    requestedCode === 'laureus-world-team-country' ||
    requestedCode === 'laureus-world-team-club'
  );
}

function shouldRunWorldSoccerSeed() {
  return (
    !requestedCode ||
    requestedCode === 'world-soccer-team-of-the-year' ||
    requestedCode === 'world-soccer-team-of-the-year-country' ||
    requestedCode === 'world-soccer-team-of-the-year-club'
  );
}

function shouldRunWorldSoccerCountrySeed() {
  return (
    !requestedCode ||
    requestedCode === 'world-soccer-team-of-the-year' ||
    requestedCode === 'world-soccer-team-of-the-year-country'
  );
}

function shouldRunWorldSoccerClubSeed() {
  return (
    !requestedCode ||
    requestedCode === 'world-soccer-team-of-the-year' ||
    requestedCode === 'world-soccer-team-of-the-year-club'
  );
}

function shouldRunGazzettaSeed() {
  return (
    !requestedCode ||
    requestedCode === 'gazzetta-world-team-of-the-year' ||
    requestedCode === 'gazzetta-world-team-of-the-year-country' ||
    requestedCode === 'gazzetta-world-team-of-the-year-club'
  );
}

function shouldRunGazzettaCountrySeed() {
  return (
    !requestedCode ||
    requestedCode === 'gazzetta-world-team-of-the-year' ||
    requestedCode === 'gazzetta-world-team-of-the-year-country'
  );
}

function shouldRunGazzettaClubSeed() {
  return (
    !requestedCode ||
    requestedCode === 'gazzetta-world-team-of-the-year' ||
    requestedCode === 'gazzetta-world-team-of-the-year-club'
  );
}

function shouldRunLaureusCountrySeed() {
  return (
    !requestedCode ||
    requestedCode === 'laureus-world-team' ||
    requestedCode === 'laureus-world-team-country'
  );
}

function shouldRunLaureusClubSeed() {
  return (
    !requestedCode ||
    requestedCode === 'laureus-world-team' ||
    requestedCode === 'laureus-world-team-club'
  );
}

async function seedIffhsWorldBestClub(
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
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

async function seedLaureusWorldTeamAwards(
  countryMap: Map<string, { id: string; uid: string; name: string }>,
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
  if (shouldRunLaureusCountrySeed()) {
    const award = await upsertLaureusAward({
      code: LAUREUS_COUNTRY_AWARD_CODE,
      name: '劳伦斯世界年度最佳团队奖（国家队）',
      targetType: AwardTargetType.COUNTRY,
      sortOrder: 10100,
      description: '劳伦斯世界体育奖年度最佳团队奖，当前只录男子足球国家队获奖对象。'
    });

    for (const item of LAUREUS_COUNTRY_RESULTS) {
      const edition = await upsertLaureusEdition(award.id, item.year);

      await prisma.awardRecipient.deleteMany({ where: { editionId: edition.id } });
      await prisma.awardRecipient.create({
        data: {
          editionId: edition.id,
          targetType: AwardTargetType.COUNTRY,
          countryId: countryMap.get(COUNTRY_UIDS[item.country])!.id,
          placement: '获奖',
          remark: item.name
        }
      });
    }

    console.log(
      `Seeded ${LAUREUS_COUNTRY_AWARD_CODE}: ${LAUREUS_COUNTRY_RESULTS.length} recipients.`
    );
  }

  if (shouldRunLaureusClubSeed()) {
    const award = await upsertLaureusAward({
      code: LAUREUS_CLUB_AWARD_CODE,
      name: '劳伦斯世界年度最佳团队奖（俱乐部）',
      targetType: AwardTargetType.CLUB,
      sortOrder: 10110,
      description: '劳伦斯世界体育奖年度最佳团队奖，当前只录男子足球俱乐部获奖对象。'
    });

    for (const item of LAUREUS_CLUB_RESULTS) {
      const edition = await upsertLaureusEdition(award.id, item.year);

      await prisma.awardRecipient.deleteMany({ where: { editionId: edition.id } });
      await prisma.awardRecipient.create({
        data: {
          editionId: edition.id,
          targetType: AwardTargetType.CLUB,
          clubId: clubMap.get(CLUB_UIDS[item.club])!.id,
          placement: '获奖',
          remark: item.name
        }
      });
    }

    console.log(`Seeded ${LAUREUS_CLUB_AWARD_CODE}: ${LAUREUS_CLUB_RESULTS.length} recipients.`);
  }
}

async function seedWorldSoccerWorldTeamAwards(
  countryMap: Map<string, { id: string; uid: string; name: string }>,
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
  if (shouldRunWorldSoccerCountrySeed()) {
    const award = await upsertWorldSoccerAward({
      code: WORLD_SOCCER_COUNTRY_AWARD_CODE,
      name: '世界足球年度最佳球队（国家队）',
      targetType: AwardTargetType.COUNTRY,
      sortOrder: 10200,
      description: 'World Soccer 杂志男子年度最佳球队，当前只录获奖国家队。'
    });

    for (const item of WORLD_SOCCER_COUNTRY_RESULTS) {
      const edition = await upsertWorldSoccerEdition(award.id, item.year);

      await prisma.awardRecipient.deleteMany({ where: { editionId: edition.id } });
      await prisma.awardRecipient.create({
        data: {
          editionId: edition.id,
          targetType: AwardTargetType.COUNTRY,
          countryId: countryMap.get(COUNTRY_UIDS[item.country])!.id,
          placement: '获奖',
          remark: item.name
        }
      });
    }

    console.log(
      `Seeded ${WORLD_SOCCER_COUNTRY_AWARD_CODE}: ${WORLD_SOCCER_COUNTRY_RESULTS.length} recipients.`
    );
  }

  if (shouldRunWorldSoccerClubSeed()) {
    const award = await upsertWorldSoccerAward({
      code: WORLD_SOCCER_CLUB_AWARD_CODE,
      name: '世界足球年度最佳球队（俱乐部）',
      targetType: AwardTargetType.CLUB,
      sortOrder: 10210,
      description: 'World Soccer 杂志男子年度最佳球队，当前只录获奖俱乐部。'
    });

    for (const item of WORLD_SOCCER_CLUB_RESULTS) {
      const edition = await upsertWorldSoccerEdition(award.id, item.year);

      await prisma.awardRecipient.deleteMany({ where: { editionId: edition.id } });
      await prisma.awardRecipient.create({
        data: {
          editionId: edition.id,
          targetType: AwardTargetType.CLUB,
          clubId: clubMap.get(CLUB_UIDS[item.club])!.id,
          placement: '获奖',
          remark: item.name
        }
      });
    }

    console.log(
      `Seeded ${WORLD_SOCCER_CLUB_AWARD_CODE}: ${WORLD_SOCCER_CLUB_RESULTS.length} recipients.`
    );
  }
}

async function seedGazzettaWorldTeamAwards(
  countryMap: Map<string, { id: string; uid: string; name: string }>,
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
  if (shouldRunGazzettaCountrySeed()) {
    const award = await upsertGazzettaAward({
      code: GAZZETTA_COUNTRY_AWARD_CODE,
      name: '《米兰体育报》年度世界最佳球队（国家队）',
      targetType: AwardTargetType.COUNTRY,
      sortOrder: 10220,
      description: '《米兰体育报》Worldwide 年度世界最佳团队，当前只录男子足球国家队获奖对象。'
    });

    for (const item of GAZZETTA_COUNTRY_RESULTS) {
      const edition = await upsertGazzettaEdition(award.id, item.year);

      await prisma.awardRecipient.deleteMany({ where: { editionId: edition.id } });
      await prisma.awardRecipient.create({
        data: {
          editionId: edition.id,
          targetType: AwardTargetType.COUNTRY,
          countryId: countryMap.get(COUNTRY_UIDS[item.country])!.id,
          placement: '获奖',
          remark: item.name
        }
      });
    }

    console.log(
      `Seeded ${GAZZETTA_COUNTRY_AWARD_CODE}: ${GAZZETTA_COUNTRY_RESULTS.length} recipients.`
    );
  }

  if (shouldRunGazzettaClubSeed()) {
    const award = await upsertGazzettaAward({
      code: GAZZETTA_CLUB_AWARD_CODE,
      name: '《米兰体育报》年度世界最佳球队（俱乐部）',
      targetType: AwardTargetType.CLUB,
      sortOrder: 10230,
      description: '《米兰体育报》Worldwide 年度世界最佳团队，当前只录男子足球俱乐部获奖对象。'
    });

    for (const item of GAZZETTA_CLUB_RESULTS) {
      const edition = await upsertGazzettaEdition(award.id, item.year);

      await prisma.awardRecipient.deleteMany({ where: { editionId: edition.id } });
      await prisma.awardRecipient.create({
        data: {
          editionId: edition.id,
          targetType: AwardTargetType.CLUB,
          clubId: clubMap.get(CLUB_UIDS[item.club])!.id,
          placement: '获奖',
          remark: item.name
        }
      });
    }

    console.log(`Seeded ${GAZZETTA_CLUB_AWARD_CODE}: ${GAZZETTA_CLUB_RESULTS.length} recipients.`);
  }
}

async function upsertLaureusAward(input: {
  code: string;
  name: string;
  targetType: AwardTargetType;
  sortOrder: number;
  description: string;
}) {
  return prisma.award.upsert({
    where: { code: input.code },
    create: {
      code: input.code,
      name: input.name,
      externalUrl: LAUREUS_EXTERNAL_URL,
      targetType: input.targetType,
      scopeType: AwardScopeType.WORLD,
      category: '年度最佳团队',
      level: '团队附加分',
      description: input.description,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: input.sortOrder
    },
    update: {
      name: input.name,
      externalUrl: LAUREUS_EXTERNAL_URL,
      targetType: input.targetType,
      scopeType: AwardScopeType.WORLD,
      category: '年度最佳团队',
      level: '团队附加分',
      description: input.description,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: input.sortOrder
    }
  });
}

async function upsertWorldSoccerAward(input: {
  code: string;
  name: string;
  targetType: AwardTargetType;
  sortOrder: number;
  description: string;
}) {
  return prisma.award.upsert({
    where: { code: input.code },
    create: {
      code: input.code,
      name: input.name,
      externalUrl: WORLD_SOCCER_EXTERNAL_URL,
      targetType: input.targetType,
      scopeType: AwardScopeType.MEDIA,
      category: '年度最佳团队',
      level: '团队附加分',
      description: input.description,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: input.sortOrder
    },
    update: {
      name: input.name,
      externalUrl: WORLD_SOCCER_EXTERNAL_URL,
      targetType: input.targetType,
      scopeType: AwardScopeType.MEDIA,
      category: '年度最佳团队',
      level: '团队附加分',
      description: input.description,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: input.sortOrder
    }
  });
}

async function upsertWorldSoccerEdition(awardId: string, year: number) {
  return prisma.awardEdition.upsert({
    where: {
      awardId_name: {
        awardId,
        name: `${year}年`
      }
    },
    create: {
      awardId,
      name: `${year}年`,
      year,
      externalUrl: WORLD_SOCCER_EXTERNAL_URL
    },
    update: {
      year,
      externalUrl: WORLD_SOCCER_EXTERNAL_URL
    }
  });
}

async function upsertGazzettaAward(input: {
  code: string;
  name: string;
  targetType: AwardTargetType;
  sortOrder: number;
  description: string;
}) {
  return prisma.award.upsert({
    where: { code: input.code },
    create: {
      code: input.code,
      name: input.name,
      externalUrl: GAZZETTA_EXTERNAL_URL,
      targetType: input.targetType,
      scopeType: AwardScopeType.MEDIA,
      category: '年度最佳团队',
      level: '团队附加分',
      description: input.description,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: input.sortOrder
    },
    update: {
      name: input.name,
      externalUrl: GAZZETTA_EXTERNAL_URL,
      targetType: input.targetType,
      scopeType: AwardScopeType.MEDIA,
      category: '年度最佳团队',
      level: '团队附加分',
      description: input.description,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: input.sortOrder
    }
  });
}

async function upsertGazzettaEdition(awardId: string, year: number) {
  return prisma.awardEdition.upsert({
    where: {
      awardId_name: {
        awardId,
        name: `${year}年`
      }
    },
    create: {
      awardId,
      name: `${year}年`,
      year,
      externalUrl: GAZZETTA_EXTERNAL_URL
    },
    update: {
      year,
      externalUrl: GAZZETTA_EXTERNAL_URL
    }
  });
}

async function upsertLaureusEdition(awardId: string, year: number) {
  return prisma.awardEdition.upsert({
    where: {
      awardId_name: {
        awardId,
        name: `${year}年`
      }
    },
    create: {
      awardId,
      name: `${year}年`,
      year,
      externalUrl: LAUREUS_EXTERNAL_URL
    },
    update: {
      year,
      externalUrl: LAUREUS_EXTERNAL_URL
    }
  });
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

async function findSeedCountries() {
  const countries = await prisma.country.findMany({
    where: {
      uid: {
        in: [...new Set(Object.values(COUNTRY_UIDS))]
      }
    },
    select: {
      id: true,
      uid: true,
      name: true
    }
  });

  return new Map(countries.map((country) => [country.uid, country]));
}

async function validateLaureusMappings(
  countryMap: Map<string, { id: string; uid: string; name: string }>,
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
  if (shouldRunLaureusCountrySeed()) {
    const missingCountries = Object.entries(COUNTRY_UIDS).filter(([, uid]) => !countryMap.has(uid));

    if (missingCountries.length) {
      throw new Error(
        `Laureus seed references missing countries: ${missingCountries
          .map(([name, uid]) => `${name}(${uid})`)
          .join(', ')}`
      );
    }
  }

  if (shouldRunLaureusClubSeed()) {
    const usedClubUids = new Set(LAUREUS_CLUB_RESULTS.map((item) => CLUB_UIDS[item.club]));
    const missingClubs = Object.entries(CLUB_UIDS).filter(
      ([, uid]) => usedClubUids.has(uid) && !clubMap.has(uid)
    );

    if (missingClubs.length) {
      throw new Error(
        `Laureus seed references missing clubs: ${missingClubs
          .map(([name, uid]) => `${name}(${uid})`)
          .join(', ')}`
      );
    }
  }
}

async function validateWorldSoccerMappings(
  countryMap: Map<string, { id: string; uid: string; name: string }>,
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
  if (shouldRunWorldSoccerCountrySeed()) {
    const usedCountryUids = new Set(
      WORLD_SOCCER_COUNTRY_RESULTS.map((item) => COUNTRY_UIDS[item.country])
    );
    const missingCountries = Object.entries(COUNTRY_UIDS).filter(
      ([, uid]) => usedCountryUids.has(uid) && !countryMap.has(uid)
    );

    if (missingCountries.length) {
      throw new Error(
        `World Soccer seed references missing countries: ${missingCountries
          .map(([name, uid]) => `${name}(${uid})`)
          .join(', ')}`
      );
    }
  }

  if (shouldRunWorldSoccerClubSeed()) {
    const usedClubUids = new Set(WORLD_SOCCER_CLUB_RESULTS.map((item) => CLUB_UIDS[item.club]));
    const missingClubs = Object.entries(CLUB_UIDS).filter(
      ([, uid]) => usedClubUids.has(uid) && !clubMap.has(uid)
    );

    if (missingClubs.length) {
      throw new Error(
        `World Soccer seed references missing clubs: ${missingClubs
          .map(([name, uid]) => `${name}(${uid})`)
          .join(', ')}`
      );
    }
  }
}

async function validateGazzettaMappings(
  countryMap: Map<string, { id: string; uid: string; name: string }>,
  clubMap: Map<string, { id: string; uid: string; name: string }>
) {
  if (shouldRunGazzettaCountrySeed()) {
    const usedCountryUids = new Set(
      GAZZETTA_COUNTRY_RESULTS.map((item) => COUNTRY_UIDS[item.country])
    );
    const missingCountries = Object.entries(COUNTRY_UIDS).filter(
      ([, uid]) => usedCountryUids.has(uid) && !countryMap.has(uid)
    );

    if (missingCountries.length) {
      throw new Error(
        `Gazzetta seed references missing countries: ${missingCountries
          .map(([name, uid]) => `${name}(${uid})`)
          .join(', ')}`
      );
    }
  }

  if (shouldRunGazzettaClubSeed()) {
    const usedClubUids = new Set(GAZZETTA_CLUB_RESULTS.map((item) => CLUB_UIDS[item.club]));
    const missingClubs = Object.entries(CLUB_UIDS).filter(
      ([, uid]) => usedClubUids.has(uid) && !clubMap.has(uid)
    );

    if (missingClubs.length) {
      throw new Error(
        `Gazzetta seed references missing clubs: ${missingClubs
          .map(([name, uid]) => `${name}(${uid})`)
          .join(', ')}`
      );
    }
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

  const mediaTeamHonorRules = [
    {
      code: 'CLUB_MEDIA_TEAM_OF_THE_YEAR',
      name: '俱乐部媒体年度团队',
      targetType: AwardTargetType.CLUB,
      sortOrder: 10120,
      remark: 'World Soccer 年度最佳球队、《米兰体育报》年度世界最佳球队等白名单媒体奖。'
    },
    {
      code: 'COUNTRY_MEDIA_TEAM_OF_THE_YEAR',
      name: '国家队媒体年度团队',
      targetType: AwardTargetType.COUNTRY,
      sortOrder: 20120,
      remark: 'World Soccer 年度最佳球队、《米兰体育报》年度世界最佳球队等白名单媒体奖。'
    }
  ] as const;

  for (const rule of mediaTeamHonorRules) {
    await prisma.teamHonorRule.upsert({
      where: { code: rule.code },
      create: {
        code: rule.code,
        name: rule.name,
        targetType: rule.targetType,
        scopeType: AwardScopeType.MEDIA,
        category: '年度最佳团队',
        baseScore: 1,
        coefficient: 1,
        enabled: true,
        sortOrder: rule.sortOrder,
        remark: rule.remark
      },
      update: {
        name: rule.name,
        targetType: rule.targetType,
        scopeType: AwardScopeType.MEDIA,
        category: '年度最佳团队',
        baseScore: 1,
        coefficient: 1,
        enabled: true,
        sortOrder: rule.sortOrder,
        remark: rule.remark
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

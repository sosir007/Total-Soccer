import { PrismaClient } from '@prisma/client';
import { runSeed } from './helpers/competition-seed.js';

const prisma = new PrismaClient();
const validateOnly = process.argv.includes('--validate-only');
const selectedUids = new Set(
  process.argv.filter((arg) => arg.startsWith('--uid=')).map((arg) => arg.slice('--uid='.length))
);

const SANTOS_UID = '335';
const AC_MILAN_UID = '1099';
const INTER_MILAN_UID = '1135';
const SAARBRUCKEN_UID = '949';
const KAISERSLAUTERN_UID = '945';
const BAYERN_MUNICH_UID = '915';
const REAL_ZARAGOZA_UID = '1749';
const LA_GALAXY_UID = '1907';
const LIVERPOOL_UID = '676';
const WEST_HAM_UNITED_UID = '735';
const CHELSEA_UID = '630';
const MANCHESTER_CITY_UID = '679';
const NEW_YORK_CITY_FC_UID = '72041885';

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

const INTER_MILAN_SEASON_LINKS = [
  {
    year: 1961,
    season: '1960-61',
    externalUrl: 'https://en.wikipedia.org/wiki/1960%E2%80%9361_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1962,
    season: '1961-62',
    externalUrl: 'https://en.wikipedia.org/wiki/1961%E2%80%9362_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1963,
    season: '1962-63',
    externalUrl: 'https://en.wikipedia.org/wiki/1962%E2%80%9363_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1964,
    season: '1963-64',
    externalUrl: 'https://en.wikipedia.org/wiki/1963%E2%80%9364_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1965,
    season: '1964-65',
    externalUrl: 'https://en.wikipedia.org/wiki/1964%E2%80%9365_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1966,
    season: '1965-66',
    externalUrl: 'https://en.wikipedia.org/wiki/1965%E2%80%9366_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1967,
    season: '1966-67',
    externalUrl: 'https://en.wikipedia.org/wiki/1966%E2%80%9367_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1968,
    season: '1967-68',
    externalUrl: 'https://en.wikipedia.org/wiki/1967%E2%80%9368_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1969,
    season: '1968-69',
    externalUrl: 'https://en.wikipedia.org/wiki/1968%E2%80%9369_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1970,
    season: '1969-70',
    externalUrl: 'https://en.wikipedia.org/wiki/1969%E2%80%9370_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1971,
    season: '1970-71',
    externalUrl: 'https://en.wikipedia.org/wiki/1970%E2%80%9371_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1972,
    season: '1971-72',
    externalUrl: 'https://en.wikipedia.org/wiki/1971%E2%80%9372_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1973,
    season: '1972-73',
    externalUrl: 'https://en.wikipedia.org/wiki/1972%E2%80%9373_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1974,
    season: '1973-74',
    externalUrl: 'https://en.wikipedia.org/wiki/1973%E2%80%9374_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1975,
    season: '1974-75',
    externalUrl: 'https://en.wikipedia.org/wiki/1974%E2%80%9375_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1976,
    season: '1975-76',
    externalUrl: 'https://en.wikipedia.org/wiki/1975%E2%80%9376_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1977,
    season: '1976-77',
    externalUrl: 'https://en.wikipedia.org/wiki/1976%E2%80%9377_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1978,
    season: '1977-78',
    externalUrl: 'https://en.wikipedia.org/wiki/1977%E2%80%9378_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1989,
    season: '1988-89',
    externalUrl: 'https://en.wikipedia.org/wiki/1988%E2%80%9389_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1990,
    season: '1989-90',
    externalUrl: 'https://en.wikipedia.org/wiki/1989%E2%80%9390_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1991,
    season: '1990-91',
    externalUrl: 'https://en.wikipedia.org/wiki/1990%E2%80%9391_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1992,
    season: '1991-92',
    externalUrl: 'https://en.wikipedia.org/wiki/1991%E2%80%9392_Serie_A',
    remark: '赛事赛季页'
  },
  {
    year: 1993,
    season: '1992-93',
    externalUrl: 'https://en.wikipedia.org/wiki/1992%E2%80%9393_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1994,
    season: '1993-94',
    externalUrl: 'https://en.wikipedia.org/wiki/1993%E2%80%9394_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1995,
    season: '1994-95',
    externalUrl: 'https://en.wikipedia.org/wiki/1994%E2%80%9395_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1998,
    season: '1997-98',
    externalUrl: 'https://en.wikipedia.org/wiki/1997%E2%80%9398_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 1999,
    season: '1998-99',
    externalUrl: 'https://en.wikipedia.org/wiki/1998%E2%80%9399_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2000,
    season: '1999-00',
    externalUrl: 'https://en.wikipedia.org/wiki/1999%E2%80%932000_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2001,
    season: '2000-01',
    externalUrl: 'https://en.wikipedia.org/wiki/2000%E2%80%9301_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2002,
    season: '2001-02',
    externalUrl: 'https://en.wikipedia.org/wiki/2001%E2%80%9302_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2003,
    season: '2002-03',
    externalUrl: 'https://en.wikipedia.org/wiki/2002%E2%80%9303_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2004,
    season: '2003-04',
    externalUrl: 'https://en.wikipedia.org/wiki/2003%E2%80%9304_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2005,
    season: '2004-05',
    externalUrl: 'https://en.wikipedia.org/wiki/2004%E2%80%9305_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2006,
    season: '2005-06',
    externalUrl: 'https://en.wikipedia.org/wiki/2005%E2%80%9306_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2007,
    season: '2006-07',
    externalUrl: 'https://en.wikipedia.org/wiki/2006%E2%80%9307_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2008,
    season: '2007-08',
    externalUrl: 'https://en.wikipedia.org/wiki/2007%E2%80%9308_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2009,
    season: '2008-09',
    externalUrl: 'https://en.wikipedia.org/wiki/2008%E2%80%9309_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2010,
    season: '2009-10',
    externalUrl: 'https://en.wikipedia.org/wiki/2009%E2%80%9310_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2011,
    season: '2010-11',
    externalUrl: 'https://en.wikipedia.org/wiki/2010%E2%80%9311_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2012,
    season: '2011-12',
    externalUrl: 'https://en.wikipedia.org/wiki/2011%E2%80%9312_Inter_Milan_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2013,
    season: '2012-13',
    externalUrl: 'https://en.wikipedia.org/wiki/2012%E2%80%9313_Inter_Milan_season',
    remark: '俱乐部单季页'
  }
] as const;

const LA_GALAXY_SEASON_LINKS = [
  {
    year: 2011,
    season: '2011',
    externalUrl: 'https://en.wikipedia.org/wiki/2011_Los_Angeles_Galaxy_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2012,
    season: '2012',
    externalUrl: 'https://en.wikipedia.org/wiki/2012_Los_Angeles_Galaxy_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2013,
    season: '2013',
    externalUrl: 'https://en.wikipedia.org/wiki/2013_Los_Angeles_Galaxy_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2014,
    season: '2014',
    externalUrl: 'https://en.wikipedia.org/wiki/2014_LA_Galaxy_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2015,
    season: '2015',
    externalUrl: 'https://en.wikipedia.org/wiki/2015_LA_Galaxy_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2016,
    season: '2016',
    externalUrl: 'https://en.wikipedia.org/wiki/2016_LA_Galaxy_season',
    remark: '俱乐部单季页'
  }
] as const;

const LIVERPOOL_SEASON_LINKS = [
  {
    year: 1999,
    season: '1998-99',
    externalUrl: 'https://en.wikipedia.org/wiki/1998%E2%80%9399_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2000,
    season: '1999-00',
    externalUrl: 'https://en.wikipedia.org/wiki/1999%E2%80%932000_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2001,
    season: '2000-01',
    externalUrl: 'https://en.wikipedia.org/wiki/2000%E2%80%9301_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2002,
    season: '2001-02',
    externalUrl: 'https://en.wikipedia.org/wiki/2001%E2%80%9302_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2003,
    season: '2002-03',
    externalUrl: 'https://en.wikipedia.org/wiki/2002%E2%80%9303_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2004,
    season: '2003-04',
    externalUrl: 'https://en.wikipedia.org/wiki/2003%E2%80%9304_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2005,
    season: '2004-05',
    externalUrl: 'https://en.wikipedia.org/wiki/2004%E2%80%9305_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2006,
    season: '2005-06',
    externalUrl: 'https://en.wikipedia.org/wiki/2005%E2%80%9306_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2007,
    season: '2006-07',
    externalUrl: 'https://en.wikipedia.org/wiki/2006%E2%80%9307_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2008,
    season: '2007-08',
    externalUrl: 'https://en.wikipedia.org/wiki/2007%E2%80%9308_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2009,
    season: '2008-09',
    externalUrl: 'https://en.wikipedia.org/wiki/2008%E2%80%9309_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2010,
    season: '2009-10',
    externalUrl: 'https://en.wikipedia.org/wiki/2009%E2%80%9310_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2011,
    season: '2010-11',
    externalUrl: 'https://en.wikipedia.org/wiki/2010%E2%80%9311_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2012,
    season: '2011-12',
    externalUrl: 'https://en.wikipedia.org/wiki/2011%E2%80%9312_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2013,
    season: '2012-13',
    externalUrl: 'https://en.wikipedia.org/wiki/2012%E2%80%9313_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2014,
    season: '2013-14',
    externalUrl: 'https://en.wikipedia.org/wiki/2013%E2%80%9314_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2015,
    season: '2014-15',
    externalUrl: 'https://en.wikipedia.org/wiki/2014%E2%80%9315_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2016,
    season: '2015-16',
    externalUrl: 'https://en.wikipedia.org/wiki/2015%E2%80%9316_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2017,
    season: '2016-17',
    externalUrl: 'https://en.wikipedia.org/wiki/2016%E2%80%9317_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2018,
    season: '2017-18',
    externalUrl: 'https://en.wikipedia.org/wiki/2017%E2%80%9318_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2019,
    season: '2018-19',
    externalUrl: 'https://en.wikipedia.org/wiki/2018%E2%80%9319_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2020,
    season: '2019-20',
    externalUrl: 'https://en.wikipedia.org/wiki/2019%E2%80%9320_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2021,
    season: '2020-21',
    externalUrl: 'https://en.wikipedia.org/wiki/2020%E2%80%9321_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2022,
    season: '2021-22',
    externalUrl: 'https://en.wikipedia.org/wiki/2021%E2%80%9322_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2023,
    season: '2022-23',
    externalUrl: 'https://en.wikipedia.org/wiki/2022%E2%80%9323_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2024,
    season: '2023-24',
    externalUrl: 'https://en.wikipedia.org/wiki/2023%E2%80%9324_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2025,
    season: '2024-25',
    externalUrl: 'https://en.wikipedia.org/wiki/2024%E2%80%9325_Liverpool_F.C._season',
    remark: '俱乐部单季页'
  }
] as const;

const WEST_HAM_UNITED_SEASON_LINKS = [
  {
    year: 1996,
    season: '1995-96',
    externalUrl: 'https://en.wikipedia.org/wiki/1995%E2%80%9396_West_Ham_United_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 1997,
    season: '1996-97',
    externalUrl: 'https://en.wikipedia.org/wiki/1996%E2%80%9397_West_Ham_United_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 1998,
    season: '1997-98',
    externalUrl: 'https://en.wikipedia.org/wiki/1997%E2%80%9398_West_Ham_United_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 1999,
    season: '1998-99',
    externalUrl: 'https://en.wikipedia.org/wiki/1998%E2%80%9399_West_Ham_United_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2000,
    season: '1999-00',
    externalUrl: 'https://en.wikipedia.org/wiki/1999%E2%80%932000_West_Ham_United_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2001,
    season: '2000-01',
    externalUrl: 'https://en.wikipedia.org/wiki/2000%E2%80%9301_West_Ham_United_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2011,
    season: '2010-11',
    externalUrl: 'https://en.wikipedia.org/wiki/2010%E2%80%9311_West_Ham_United_F.C._season',
    remark: '俱乐部单季页'
  }
] as const;

const CHELSEA_SEASON_LINKS = [
  {
    year: 2002,
    season: '2001-02',
    externalUrl: 'https://en.wikipedia.org/wiki/2001%E2%80%9302_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2003,
    season: '2002-03',
    externalUrl: 'https://en.wikipedia.org/wiki/2002%E2%80%9303_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2004,
    season: '2003-04',
    externalUrl: 'https://en.wikipedia.org/wiki/2003%E2%80%9304_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2005,
    season: '2004-05',
    externalUrl: 'https://en.wikipedia.org/wiki/2004%E2%80%9305_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2006,
    season: '2005-06',
    externalUrl: 'https://en.wikipedia.org/wiki/2005%E2%80%9306_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2007,
    season: '2006-07',
    externalUrl: 'https://en.wikipedia.org/wiki/2006%E2%80%9307_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2008,
    season: '2007-08',
    externalUrl: 'https://en.wikipedia.org/wiki/2007%E2%80%9308_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2009,
    season: '2008-09',
    externalUrl: 'https://en.wikipedia.org/wiki/2008%E2%80%9309_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2010,
    season: '2009-10',
    externalUrl: 'https://en.wikipedia.org/wiki/2009%E2%80%9310_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2011,
    season: '2010-11',
    externalUrl: 'https://en.wikipedia.org/wiki/2010%E2%80%9311_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2012,
    season: '2011-12',
    externalUrl: 'https://en.wikipedia.org/wiki/2011%E2%80%9312_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2013,
    season: '2012-13',
    externalUrl: 'https://en.wikipedia.org/wiki/2012%E2%80%9313_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2014,
    season: '2013-14',
    externalUrl: 'https://en.wikipedia.org/wiki/2013%E2%80%9314_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2015,
    season: '2014-15',
    externalUrl: 'https://en.wikipedia.org/wiki/2014%E2%80%9315_Chelsea_F.C._season',
    remark: '俱乐部单季页'
  }
] as const;

const MANCHESTER_CITY_SEASON_LINKS = [
  {
    year: 1960,
    season: '1959-60',
    externalUrl: 'https://en.wikipedia.org/wiki/1959%E2%80%9360_Football_League#First_Division',
    remark: '赛事赛季页'
  },
  {
    year: 1961,
    season: '1960-61',
    externalUrl: 'https://en.wikipedia.org/wiki/1960%E2%80%9361_Football_League#First_Division',
    remark: '赛事赛季页'
  },
  {
    year: 1974,
    season: '1973-74',
    externalUrl: 'https://en.wikipedia.org/wiki/1973%E2%80%9374_Football_League#First_Division',
    remark: '赛事赛季页'
  },
  {
    year: 2006,
    season: '2005-06',
    externalUrl: 'https://en.wikipedia.org/wiki/2005%E2%80%9306_Manchester_City_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2007,
    season: '2006-07',
    externalUrl: 'https://en.wikipedia.org/wiki/2006%E2%80%9307_Manchester_City_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2008,
    season: '2007-08',
    externalUrl: 'https://en.wikipedia.org/wiki/2007%E2%80%9308_Manchester_City_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2009,
    season: '2008-09',
    externalUrl: 'https://en.wikipedia.org/wiki/2008%E2%80%9309_Manchester_City_F.C._season',
    remark: '俱乐部单季页'
  },
  {
    year: 2015,
    season: '2014-15',
    externalUrl: 'https://en.wikipedia.org/wiki/2014%E2%80%9315_Manchester_City_F.C._season',
    remark: '俱乐部单季页'
  }
] as const;

const NEW_YORK_CITY_FC_SEASON_LINKS = [
  {
    year: 2015,
    season: '2015',
    externalUrl: 'https://en.wikipedia.org/wiki/2015_New_York_City_FC_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2016,
    season: '2016',
    externalUrl: 'https://en.wikipedia.org/wiki/2016_New_York_City_FC_season',
    remark: '俱乐部单季页'
  }
] as const;

const SAARBRUCKEN_SEASON_LINKS = [
  {
    year: 1981,
    season: '1980-81',
    externalUrl: 'https://en.wikipedia.org/wiki/1980%E2%80%9381_2._Bundesliga',
    remark: '赛事赛季页'
  }
] as const;

const KAISERSLAUTERN_SEASON_LINKS = [
  {
    year: 1982,
    season: '1981-82',
    externalUrl: 'https://en.wikipedia.org/wiki/1981%E2%80%9382_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1983,
    season: '1982-83',
    externalUrl: 'https://en.wikipedia.org/wiki/1982%E2%80%9383_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1984,
    season: '1983-84',
    externalUrl: 'https://en.wikipedia.org/wiki/1983%E2%80%9384_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1985,
    season: '1984-85',
    externalUrl: 'https://en.wikipedia.org/wiki/1984%E2%80%9385_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1986,
    season: '1985-86',
    externalUrl: 'https://en.wikipedia.org/wiki/1985%E2%80%9386_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1994,
    season: '1993-94',
    externalUrl: 'https://en.wikipedia.org/wiki/1993%E2%80%9394_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1995,
    season: '1994-95',
    externalUrl: 'https://en.wikipedia.org/wiki/1994%E2%80%9395_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1996,
    season: '1995-96',
    externalUrl: 'https://en.wikipedia.org/wiki/1995%E2%80%9396_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1997,
    season: '1996-97',
    externalUrl: 'https://en.wikipedia.org/wiki/1996%E2%80%9397_2._Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1998,
    season: '1997-98',
    externalUrl: 'https://en.wikipedia.org/wiki/1997%E2%80%9398_Bundesliga',
    remark: '赛事赛季页'
  }
] as const;

const BAYERN_MUNICH_SEASON_LINKS = [
  {
    year: 1983,
    season: '1982-83',
    externalUrl: 'https://en.wikipedia.org/wiki/1982%E2%80%9383_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1984,
    season: '1983-84',
    externalUrl: 'https://en.wikipedia.org/wiki/1983%E2%80%9384_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1985,
    season: '1984-85',
    externalUrl: 'https://en.wikipedia.org/wiki/1984%E2%80%9385_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1986,
    season: '1985-86',
    externalUrl: 'https://en.wikipedia.org/wiki/1985%E2%80%9386_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1987,
    season: '1986-87',
    externalUrl: 'https://en.wikipedia.org/wiki/1986%E2%80%9387_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 1988,
    season: '1987-88',
    externalUrl: 'https://en.wikipedia.org/wiki/1987%E2%80%9388_Bundesliga',
    remark: '赛事赛季页'
  },
  {
    year: 2010,
    season: '2009-10',
    externalUrl: 'https://en.wikipedia.org/wiki/2009%E2%80%9310_FC_Bayern_Munich_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2011,
    season: '2010-11',
    externalUrl: 'https://en.wikipedia.org/wiki/2010%E2%80%9311_FC_Bayern_Munich_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2012,
    season: '2011-12',
    externalUrl: 'https://en.wikipedia.org/wiki/2011%E2%80%9312_FC_Bayern_Munich_season',
    remark: '俱乐部单季页'
  }
] as const;

const REAL_ZARAGOZA_SEASON_LINKS = [
  {
    year: 1993,
    season: '1992-93',
    externalUrl: 'https://en.wikipedia.org/wiki/1992%E2%80%9393_La_Liga',
    remark: '赛事赛季页'
  },
  {
    year: 2004,
    season: '2003-04',
    externalUrl: 'https://en.wikipedia.org/wiki/2003%E2%80%9304_La_Liga',
    remark: '赛事赛季页'
  },
  {
    year: 2005,
    season: '2004-05',
    externalUrl: 'https://en.wikipedia.org/wiki/2004%E2%80%9305_Real_Zaragoza_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2006,
    season: '2005-06',
    externalUrl: 'https://en.wikipedia.org/wiki/2005%E2%80%9306_Real_Zaragoza_season',
    remark: '俱乐部单季页'
  },
  {
    year: 2007,
    season: '2006-07',
    externalUrl: 'https://en.wikipedia.org/wiki/2006%E2%80%9307_Real_Zaragoza_season',
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
  },
  {
    uid: INTER_MILAN_UID,
    links: INTER_MILAN_SEASON_LINKS
  },
  {
    uid: LA_GALAXY_UID,
    links: LA_GALAXY_SEASON_LINKS
  },
  {
    uid: LIVERPOOL_UID,
    links: LIVERPOOL_SEASON_LINKS
  },
  {
    uid: WEST_HAM_UNITED_UID,
    links: WEST_HAM_UNITED_SEASON_LINKS
  },
  {
    uid: CHELSEA_UID,
    links: CHELSEA_SEASON_LINKS
  },
  {
    uid: MANCHESTER_CITY_UID,
    links: MANCHESTER_CITY_SEASON_LINKS
  },
  {
    uid: NEW_YORK_CITY_FC_UID,
    links: NEW_YORK_CITY_FC_SEASON_LINKS
  },
  {
    uid: SAARBRUCKEN_UID,
    links: SAARBRUCKEN_SEASON_LINKS
  },
  {
    uid: KAISERSLAUTERN_UID,
    links: KAISERSLAUTERN_SEASON_LINKS
  },
  {
    uid: BAYERN_MUNICH_UID,
    links: BAYERN_MUNICH_SEASON_LINKS
  },
  {
    uid: REAL_ZARAGOZA_UID,
    links: REAL_ZARAGOZA_SEASON_LINKS
  }
] as const;

async function main() {
  const seeds = selectedUids.size
    ? CLUB_SEASON_LINK_SEEDS.filter((seed) => selectedUids.has(seed.uid))
    : CLUB_SEASON_LINK_SEEDS;
  const unknownUids = [...selectedUids].filter((uid) => !seeds.some((seed) => seed.uid === uid));
  if (unknownUids.length) {
    throw new Error(`Unknown club UID: ${unknownUids.join(', ')}.`);
  }

  const clubs = await prisma.club.findMany({
    where: { uid: { in: seeds.map((seed) => seed.uid) } },
    select: { id: true, name: true, uid: true }
  });
  const clubByUid = new Map(clubs.map((club) => [club.uid, club]));

  const missingUid = seeds.find((seed) => !clubByUid.has(seed.uid))?.uid;
  if (missingUid) {
    throw new Error(`Club UID ${missingUid} not found.`);
  }

  if (validateOnly) {
    for (const seed of seeds) {
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

  for (const seed of seeds) {
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

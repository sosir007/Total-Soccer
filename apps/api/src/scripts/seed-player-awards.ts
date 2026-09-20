import {
  AwardScopeType,
  AwardTargetType,
  CompetitionStandingPlacement,
  CompetitionEditionStandingMode,
  LifecycleStatus,
  PlayerTeamHonorSourceType,
  PlayerTeamHonorStatus
} from '@prisma/client';
import { AwardRulesService } from '../award-rules/award-rules.service.js';
import { PrismaService } from '../database/prisma.service.js';

const prisma = new PrismaService();

const SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE = 'SOUTH_AMERICAN_FOOTBALLER_OF_THE_YEAR';
const SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/South_American_Footballer_of_the_Year';
const ONZE_DOR_AWARD_CODE = 'ONZE_DOR';
const ONZE_DOR_EXTERNAL_URL = 'https://www.rsssf.org/miscellaneous/onze-awards.html';
const BALLON_DOR_AWARD_CODE = 'BALLON_DOR';
const BALLON_DOR_EXTERNAL_URL = 'https://www.rsssf.org/miscellaneous/europa-poy.html';
const BALLON_DOR_EDITION_EXTERNAL_URL_PREFIX = 'https://www.rsssf.org/miscellaneous/europa-poy';
const FIFA_WORLD_PLAYER_OF_THE_YEAR_AWARD_CODE = 'FIFA_WORLD_PLAYER_OF_THE_YEAR';
const FIFA_WORLD_PLAYER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/FIFA_World_Player_of_the_Year';
const FIFA_WORLD_PLAYER_OF_THE_YEAR_2005_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/2005_FIFA_World_Player_of_the_Year';
const FIFPRO_WORLD_11_AWARD_CODE = 'FIFPRO_WORLD_11';
const FIFPRO_WORLD_11_EXTERNAL_URL = 'https://www.fifpro.org/en/world-11';
const FIFPRO_WORLD_11_HISTORY_EXTERNAL_URL =
  'https://www.fifpro.org/en/articles/2023/10/history-mens-world-11';
const ARGENTINE_FOOTBALLER_OF_THE_YEAR_AWARD_CODE = 'ARGENTINE_FOOTBALLER_OF_THE_YEAR';
const ARGENTINE_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL =
  'https://www.rsssf.org/miscellaneous/arg-poy.html';
const FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE = 'FIFA_WORLD_CUP_GOLDEN_BALL';
const FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/FIFA_World_Cup_awards#Golden_Ball';
const FIFA_WORLD_CUP_GOLDEN_BOOT_AWARD_CODE = 'FIFA_WORLD_CUP_GOLDEN_BOOT';
const FIFA_WORLD_CUP_GOLDEN_BOOT_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/FIFA_World_Cup_awards#Golden_Boot';
const FIFA_WORLD_CUP_ALL_STAR_TEAM_AWARD_CODE = 'FIFA_WORLD_CUP_ALL_STAR_TEAM';
const FIFA_WORLD_CUP_ALL_STAR_TEAM_EXTERNAL_URL =
  'https://fbref.com/en/awards/wc_all_star/FIFA-World-Cup-All-Star-Team';
const FIFA_WORLD_CUP_ALL_STAR_TEAM_DATA_UPDATED_AT = new Date('2026-08-18T00:00:00.000Z');
const FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE = 'FIFA_WORLD_CUP_BEST_YOUNG_PLAYER';
const FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/FIFA_World_Cup_awards#Best_Young_Player_Award';
const COPA_AMERICA_BEST_PLAYER_AWARD_CODE = 'COPA_AMERICA_BEST_PLAYER';
const COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica_awards';
const COPA_AMERICA_TOP_SCORER_AWARD_CODE = 'COPA_AMERICA_TOP_SCORER';
const COPA_AMERICA_TOP_SCORER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica_awards#Golden_Boot';
const BRAZIL_SERIE_A_TOP_SCORER_AWARD_CODE = 'BRAZIL_SERIE_A_TOP_SCORER';
const BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL = 'https://rsssfbrasil.com/tablesae/brtops.htm';
const BRAZIL_SERIE_A_COMPETITION_CODE = 'BRAZIL_SERIE_A';
const ITALY_SERIE_A_TOP_SCORER_AWARD_CODE = 'ITALY_SERIE_A_TOP_SCORER';
const ITALY_SERIE_A_TOP_SCORER_EXTERNAL_URL = 'https://www.rsssf.org/tablesi/italtops.html';
const ITALY_SERIE_A_COMPETITION_CODE = 'ITALY_SERIE_A';
const ITALY_SERIE_B_COMPETITION_CODE = 'ITALY_SERIE_B';
const ITALY_SERIE_A_PLAYER_OF_THE_YEAR_AWARD_CODE = 'ITALY_SERIE_A_PLAYER_OF_THE_YEAR';
const ITALY_SERIE_A_PLAYER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Guerin_d%27Oro';
const ITALY_COPPA_ITALIA_TOP_SCORER_AWARD_CODE = 'ITALY_COPPA_ITALIA_TOP_SCORER';
const ITALY_COPPA_ITALIA_TOP_SCORER_EXTERNAL_URL = 'https://www.rsssf.org/tablesi/italcuptops.html';
const ITALY_COPPA_ITALIA_COMPETITION_CODE = 'ITALY_COPPA_ITALIA';
const ITALY_SUPER_CUP_COMPETITION_CODE = 'ITALY_SUPER_CUP';
const MITROPA_CUP_COMPETITION_CODE = 'MITROPA_CUP';
const UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE = 'UEFA_CHAMPIONS_LEAGUE';
const UEFA_EUROPA_LEAGUE_COMPETITION_CODE = 'UEFA_EUROPA_LEAGUE';
const UEFA_SUPER_CUP_COMPETITION_CODE = 'UEFA_SUPER_CUP';
const UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_AWARD_CODE = 'UEFA_CLUB_FOOTBALLER_OF_THE_YEAR';
const UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/UEFA_Club_Footballer_of_the_Year';
const UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_AWARD_CODE = 'UEFA_CLUB_MIDFIELDER_OF_THE_YEAR';
const UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/UEFA_Club_Football_Awards';
const UEFA_TEAM_OF_THE_YEAR_AWARD_CODE = 'UEFA_TEAM_OF_THE_YEAR';
const UEFA_TEAM_OF_THE_YEAR_EXTERNAL_URL = 'https://en.wikipedia.org/wiki/UEFA_Team_of_the_Year';
const PFA_PLAYERS_PLAYER_OF_THE_YEAR_AWARD_CODE = 'PFA_PLAYERS_PLAYER_OF_THE_YEAR';
const PFA_PLAYERS_PLAYER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/PFA_Players%27_Player_of_the_Year';
const LAMPARD_FWA_PFA_2005_REPORT_EXTERNAL_URL =
  'https://footballwriters.co.uk/news/frank-lampard-sweeps-to-footballer-of-the-year-award/';
const PFA_YOUNG_PLAYER_OF_THE_YEAR_AWARD_CODE = 'PFA_YOUNG_PLAYER_OF_THE_YEAR';
const PFA_YOUNG_PLAYER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/PFA_Young_Player_of_the_Year';
const PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_AWARD_CODE = 'PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR';
const PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/PFA_Team_of_the_Year';
const ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_SEASON_AWARD_CODE =
  'ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_SEASON';
const ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_SEASON_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Premier_League_Player_of_the_Season';
const ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_AWARD_CODE =
  'ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH';
const ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Premier_League_Player_of_the_Month';
const MLS_PLAYER_OF_THE_MONTH_AWARD_CODE = 'MLS_PLAYER_OF_THE_MONTH';
const MLS_PLAYER_OF_THE_MONTH_EXTERNAL_URL =
  'http://www.mlssoccer.com/post/2016/08/04/frank-lampard-wins-etihad-airways-mls-player-month-july';
const PFA_FANS_PLAYER_OF_THE_YEAR_AWARD_CODE = 'PFA_FANS_PLAYER_OF_THE_YEAR';
const ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_AWARD_CODE = 'ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER';
const ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/2013%E2%80%9314_Premier_League#Top_assists';
const PFA_MERIT_AWARD_EXTERNAL_URL =
  'https://web.archive.org/web/20200706203926/https://www.goal.com/en/news/9/english-football/2015/04/26/11170022/gerrard-lampard-share-pfa-merit-award';
const UEFA_ULTIMATE_TEAM_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/UEFA_Team_of_the_Year#UEFA_Ultimate_Team_of_the_Year';
const LIVERPOOL_GREATEST_EXTERNAL_URL =
  'https://www.liverpoolfc.com/news/liverpools-greatest-no1-steven-gerrard';
const FWA_FOOTBALLER_OF_THE_YEAR_AWARD_CODE = 'FWA_FOOTBALLER_OF_THE_YEAR';
const FWA_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/FWA_Footballer_of_the_Year';
const FWA_FOOTBALLER_OF_THE_YEAR_2014_EXTERNAL_URL =
  'https://footballwriters.co.uk/news/suarez-named-fwa-footballer-of-the-year-2014/';
const UEFA_EURO_TEAM_OF_THE_TOURNAMENT_AWARD_CODE = 'UEFA_EURO_TEAM_OF_THE_TOURNAMENT';
const UEFA_EURO_TEAM_OF_THE_TOURNAMENT_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/UEFA_Euro_2012#Awards';
const FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_AWARD_CODE = 'FIFA_CLUB_WORLD_CUP_GOLDEN_BALL';
const FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL =
  'https://web.archive.org/web/20150704030052/http://www.fifa.com/tournaments/archive/clubworldcup/japan2005/awards/index.html';
const ENGLAND_PLAYER_OF_THE_YEAR_AWARD_CODE = 'ENGLAND_PLAYER_OF_THE_YEAR';
const ENGLAND_PLAYER_OF_THE_YEAR_EXTERNAL_URL =
  'https://en.wikipedia.org/wiki/Steven_Gerrard#Honours';
const ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_AWARD_CODE = 'ARGENTINE_PRIMERA_DIVISION_TOP_SCORER';
const ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL =
  'https://www.rsssf.org/tablesa/argtops.html';
const ARGENTINE_PRIMERA_DIVISION_COMPETITION_CODE = 'ARGENTINE_PRIMERA_DIVISION';
const CAMPEONATO_PAULISTA_TOP_SCORER_AWARD_CODE = 'CAMPEONATO_PAULISTA_TOP_SCORER';
const CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL =
  'https://futebolpaulista.com.br/Noticias/Detalhe.aspx?Noticia=16359';
const CAMPEONATO_PAULISTA_COMPETITION_CODE = 'CAMPEONATO_PAULISTA';
const TORNEIO_RIO_SAO_PAULO_TOP_SCORER_AWARD_CODE = 'TORNEIO_RIO_SAO_PAULO_TOP_SCORER';
const TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL =
  'https://www.netvasco.com.br/mauroprais/futbr/artilrsp.html';
const TORNEIO_RIO_SAO_PAULO_COMPETITION_CODE = 'TORNEIO_RIO_SAO_PAULO';
const CONMEBOL_LIBERTADORES_TOP_SCORER_AWARD_CODE = 'CONMEBOL_LIBERTADORES_TOP_SCORER';
const CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL =
  'https://www.rsssf.org/sacups/copalibtops.html';
const CONMEBOL_LIBERTADORES_COMPETITION_CODE = 'CONMEBOL_LIBERTADORES';
const EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_AWARD_CODE = 'EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER';
const EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL =
  'https://www.rsssf.org/tablest/toyota.html';
const EUROPEAN_SOUTH_AMERICAN_CUP_COMPETITION_CODE = 'EUROPEAN_SOUTH_AMERICAN_CUP';
const NASL_MVP_AWARD_CODE = 'NASL_MOST_VALUABLE_PLAYER';
const NASL_MVP_EXTERNAL_URL =
  'https://www.sportingnews.com/us/soccer/news/tsn-archives-pele-landslide-winner-nasl-mvp-sept-11-1976-issue/fh9j4ahe4opejebwwe7d0cls';
const NASL_ALL_STAR_TEAM_AWARD_CODE = 'NASL_ALL_STAR_TEAM';
const NASL_ALL_STAR_TEAM_EXTERNAL_URL = 'https://www.nationalsoccerhof.com/players/pele.html';
const NASL_ASSISTS_LEADER_AWARD_CODE = 'NASL_ASSISTS_LEADER';
const NASL_ASSISTS_LEADER_EXTERNAL_URL = 'https://www.statscrew.com/soccer/leaders/l-NASL/y-1976';
const NORTH_AMERICAN_SOCCER_LEAGUE_COMPETITION_CODE = 'NORTH_AMERICAN_SOCCER_LEAGUE_1968_1984';
const ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE = 'ENGLAND_PREMIER_LEAGUE';
const MLS_COMPETITION_CODE = 'MLS_CUP';
const UEFA_EURO_COMPETITION_CODE = 'UEFA_EURO';
const FIFA_CLUB_WORLD_CUP_COMPETITION_CODE = 'FIFA_CLUB_WORLD_CUP';
const ENGLAND_FA_CUP_COMPETITION_CODE = 'ENGLAND_FA_CUP';
const ENGLAND_LEAGUE_CUP_COMPETITION_CODE = 'ENGLAND_LEAGUE_CUP';
const ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE = 'ENGLAND_COMMUNITY_SHIELD';

const PELE_NAME_KEYWORD = '贝利';
const MARADONA_NAME_KEYWORD = '马拉多纳';
const GERRARD_NAME_KEYWORD = '杰拉德';
const LAMPARD_NAME_KEYWORD = '兰帕德';

function buildBallonDorEditionExternalUrl(year: number) {
  return `${BALLON_DOR_EDITION_EXTERNAL_URL_PREFIX}${year.toString().slice(-2)}.html`;
}

type FIFAWorldCupGoldenBallSeed = {
  year: number;
  rank: number;
  placement: string;
  remark: string;
  editionRemark?: string;
};

type FIFAWorldCupGoldenBootSeed = {
  year: number;
  rank: number;
  placement: string;
  remark: string;
};

type FIFAWorldCupAllStarTeamSeed = {
  year: number;
  placement: string;
  remark: string;
};

type ArgentinePrimeraDivisionTopScorerSeed = {
  editionName: string;
  year: number;
  placement: string;
  remark: string;
};

type ItalianTopScorerSeed = {
  season: string;
  year: number;
  placement: string;
  goals: number;
  remark: string;
};

type LeaguePlayerOfTheYearSeed = {
  season: string;
  year: number;
  placement: string;
  remark: string;
};

type EnglishLeagueAwardSeed = LeaguePlayerOfTheYearSeed & {
  rank?: number;
  month?: number;
  awardEditionName?: string;
  competitionEditionName?: string;
  externalUrl?: string;
};

type EnglishLeagueAwardDefinition = {
  code: string;
  name: string;
  englishName: string;
  shortName: string;
  externalUrl: string;
  category: string;
  level: string;
  description: string;
  sortOrder: number;
  results: readonly EnglishLeagueAwardSeed[];
};

type PlayerAchievementSeed = {
  name: string;
  season: string;
  score: number;
  isScoring?: boolean;
  externalUrl: string;
  remark: string;
  sortOrder: number;
};

type PlayerTeamHonorSeed = {
  competitionCode: string;
  editionName: string;
  teamName: string;
  careerTeamName: string;
  expectedPlacement: CompetitionStandingPlacement;
  remark: string;
};

type RankedAwardSeed = {
  year: number;
  rank: number;
  placement: string;
  remark: string;
  editionRemark?: string;
};

type AnnualSelectionAwardSeed = {
  year: number;
  placement: string;
  remark: string;
  editionRemark: string;
};

const SOUTH_AMERICAN_FOOTBALLER_PELE_RESULTS = [
  {
    year: 1972,
    rank: 2,
    placement: '第二名',
    remark: 'El Mundo 口径，贝利效力桑托斯时期。'
  },
  {
    year: 1973,
    rank: 1,
    placement: '第一名',
    remark: 'El Mundo 口径，贝利效力桑托斯时期。'
  }
] as const;

const SOUTH_AMERICAN_FOOTBALLER_MARADONA_RESULTS: RankedAwardSeed[] = [
  {
    year: 1979,
    rank: 1,
    placement: '第一名',
    remark: '官方年度前三口径，马拉多纳效力阿根廷青年人时期。'
  },
  {
    year: 1980,
    rank: 1,
    placement: '第一名',
    remark: '官方年度前三口径，马拉多纳效力阿根廷青年人时期。'
  },
  {
    year: 1981,
    rank: 2,
    placement: '第二名',
    remark: '官方年度前三口径，马拉多纳效力博卡青年时期。'
  },
  {
    year: 1982,
    rank: 3,
    placement: '第三名',
    remark: '官方年度前三口径，马拉多纳效力博卡青年 / 巴塞罗那时期。'
  },
  {
    year: 1995,
    rank: 2,
    placement: '第二名',
    remark: '官方年度前三口径，马拉多纳效力博卡青年时期。'
  }
];

const ONZE_DOR_MARADONA_RESULTS: RankedAwardSeed[] = [
  {
    year: 1985,
    rank: 3,
    placement: '铜奖',
    remark: "Onze d'Or 1985 铜奖，马拉多纳效力那不勒斯时期。"
  },
  {
    year: 1986,
    rank: 1,
    placement: '金奖',
    remark: "Onze d'Or 1986 金奖，马拉多纳效力那不勒斯时期。"
  },
  {
    year: 1987,
    rank: 1,
    placement: '金奖',
    remark: "Onze d'Or 1987 金奖，马拉多纳效力那不勒斯时期。"
  },
  {
    year: 1988,
    rank: 3,
    placement: '铜奖',
    remark: "Onze d'Or 1988 铜奖，马拉多纳效力那不勒斯时期。"
  }
];

const ONZE_DOR_GERRARD_RESULTS: RankedAwardSeed[] = [
  {
    year: 2005,
    rank: 2,
    placement: '银奖',
    remark: "Onze d'Or 2005 银奖，杰拉德效力利物浦时期。"
  }
];

const BALLON_DOR_BARESI_RESULTS: RankedAwardSeed[] = [
  {
    year: 1989,
    rank: 2,
    placement: '第二名',
    remark: 'France Football 金球奖 1989 投票第二名，巴雷西效力 AC米兰时期。'
  }
];

const BALLON_DOR_GERRARD_RESULTS: RankedAwardSeed[] = [
  {
    year: 2005,
    rank: 3,
    placement: '第三名',
    remark: 'France Football 金球奖 2005 投票第三名，杰拉德效力利物浦时期。'
  }
];

const BALLON_DOR_LAMPARD_RESULTS: RankedAwardSeed[] = [
  {
    year: 2005,
    rank: 2,
    placement: '第二名',
    remark: 'France Football 金球奖 2005 投票第二名，兰帕德效力切尔西时期。'
  }
];

const FIFPRO_WORLD_11_GERRARD_RESULTS: AnnualSelectionAwardSeed[] = [
  {
    year: 2007,
    placement: '入选',
    remark: '杰拉德效力利物浦期间，以中场身份入选 2007 年 FIFPRO World 11。',
    editionRemark: '该届正式名称为 FIFPRO World 11。'
  },
  {
    year: 2008,
    placement: '入选',
    remark: '杰拉德效力利物浦期间，以中场身份入选 2008 年 FIFPRO World 11。',
    editionRemark: '该届正式名称为 FIFPRO World 11。'
  },
  {
    year: 2009,
    placement: '入选',
    remark: '杰拉德效力利物浦期间，以中场身份入选 2009 年 FIFA FIFPRO World 11。',
    editionRemark: '该届处于 FIFPRO 与 FIFA 合作期间，正式名称为 FIFA FIFPRO World 11。'
  }
];

const FIFPRO_WORLD_11_LAMPARD_RESULTS: AnnualSelectionAwardSeed[] = [
  {
    year: 2005,
    placement: '入选',
    remark: '兰帕德效力切尔西期间，以中场身份入选首届 FIFPRO World 11。',
    editionRemark: '首届 FIFPRO World 11，按颁奖年份记为 2005 年。'
  }
];

const UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_GERRARD_RESULTS: RankedAwardSeed[] = [
  {
    year: 2005,
    rank: 1,
    placement: '获奖',
    remark: '欧足联年度最佳俱乐部球员 2004-05 赛季获奖，杰拉德效力利物浦时期。'
  }
];

const UEFA_TEAM_OF_THE_YEAR_GERRARD_RESULTS: AnnualSelectionAwardSeed[] = [
  {
    year: 2005,
    placement: '入选',
    remark: '杰拉德效力利物浦期间，以中场身份入选 UEFA.com 2005 年球迷票选年度最佳阵容。',
    editionRemark: '由 UEFA.com 用户投票产生，不是 UEFA 技术观察员评选的赛事最佳阵容。'
  },
  {
    year: 2006,
    placement: '入选',
    remark: '杰拉德效力利物浦期间，以中场身份入选 UEFA.com 2006 年球迷票选年度最佳阵容。',
    editionRemark: '由 UEFA.com 用户投票产生，不是 UEFA 技术观察员评选的赛事最佳阵容。'
  },
  {
    year: 2007,
    placement: '入选',
    remark: '杰拉德效力利物浦期间，以中场身份入选 UEFA.com 2007 年球迷票选年度最佳阵容。',
    editionRemark: '由 UEFA.com 用户投票产生，不是 UEFA 技术观察员评选的赛事最佳阵容。'
  }
];

const PFA_PLAYERS_PLAYER_OF_THE_YEAR_GERRARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2005-06',
    year: 2006,
    rank: 1,
    placement: '获奖',
    remark: '杰拉德效力利物浦期间，由职业球员互投当选 2005-06 赛季 PFA 球员票选年度最佳球员。'
  }
];

const PFA_PLAYERS_PLAYER_OF_THE_YEAR_LAMPARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2003-04',
    year: 2004,
    rank: 2,
    placement: '第二名',
    externalUrl: LAMPARD_FWA_PFA_2005_REPORT_EXTERNAL_URL,
    remark: '兰帕德效力切尔西期间，在 2003-04 赛季 PFA 球员票选年度最佳球员评选中获得第二名。'
  },
  {
    season: '2004-05',
    year: 2005,
    rank: 2,
    placement: '第二名',
    externalUrl: LAMPARD_FWA_PFA_2005_REPORT_EXTERNAL_URL,
    remark: '兰帕德效力切尔西期间，在 2004-05 赛季 PFA 球员票选年度最佳球员评选中获得第二名。'
  }
];

const PFA_YOUNG_PLAYER_OF_THE_YEAR_GERRARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2000-01',
    year: 2001,
    rank: 1,
    placement: '获奖',
    remark: '杰拉德效力利物浦期间，当选 2000-01 赛季 PFA 年度最佳年轻球员。'
  }
];

const PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_GERRARD_RESULTS: EnglishLeagueAwardSeed[] = [
  '2000-01',
  '2003-04',
  '2004-05',
  '2005-06',
  '2006-07',
  '2007-08',
  '2008-09',
  '2013-14'
].map((season) => ({
  season,
  year: 2000 + Number(season.slice(-2)),
  placement: '入选',
  remark: `杰拉德效力利物浦期间，入选 ${season} 赛季 PFA 英超年度最佳阵容。`
}));

const PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_LAMPARD_RESULTS: EnglishLeagueAwardSeed[] = [
  '2003-04',
  '2004-05',
  '2005-06'
].map((season) => ({
  season,
  year: 2000 + Number(season.slice(-2)),
  placement: '入选',
  remark: `兰帕德效力切尔西期间，入选 ${season} 赛季 PFA 英超年度最佳阵容。`
}));

const ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_GERRARD_RESULTS: EnglishLeagueAwardSeed[] = [
  ['2000-01', 2001, 3],
  ['2002-03', 2003, 3],
  ['2004-05', 2004, 12],
  ['2005-06', 2006, 4],
  ['2008-09', 2009, 3],
  ['2013-14', 2014, 3]
].map(([season, year, month]) => ({
  season: String(season),
  year: Number(year),
  month: Number(month),
  awardEditionName: `${season}赛季${month}月`,
  placement: '月度最佳球员',
  remark: `杰拉德效力利物浦期间，获得 ${year}年${month}月英格兰足球超级联赛月度最佳球员；同赛季多次获奖最多计一次分。`
}));

const ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_LAMPARD_RESULTS: EnglishLeagueAwardSeed[] = [
  ['2003-04', 2003, 9],
  ['2004-05', 2005, 4],
  ['2005-06', 2005, 10],
  ['2008-09', 2008, 10]
].map(([season, year, month]) => ({
  season: String(season),
  year: Number(year),
  month: Number(month),
  awardEditionName: `${season}赛季${month}月`,
  placement: '月度最佳球员',
  remark: `兰帕德效力切尔西期间，获得 ${year}年${month}月英格兰足球超级联赛月度最佳球员；同赛季多次获奖最多计一次分。`
}));

const MLS_PLAYER_OF_THE_MONTH_LAMPARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2016',
    year: 2016,
    month: 7,
    awardEditionName: '2016赛季7月',
    competitionEditionName: '2016年',
    placement: '月度最佳球员',
    remark: '兰帕德效力纽约城期间，获得 2016 年 7 月 MLS 月度最佳球员；同赛季多次获奖最多计一次分。'
  }
];

const ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_GERRARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2013-14',
    year: 2014,
    rank: 1,
    placement: '助攻王',
    remark: '杰拉德效力利物浦期间，以 13 次助攻位列 2013-14 赛季英超助攻榜第一。'
  }
];

const ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_LAMPARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2004-05',
    year: 2005,
    rank: 1,
    placement: '助攻王',
    remark: '兰帕德效力切尔西期间，位列 2004-05 赛季英超助攻榜第一。'
  },
  {
    season: '2008-09',
    year: 2009,
    rank: 1,
    placement: '助攻王',
    remark: '兰帕德效力切尔西期间，并列 2008-09 赛季英超助攻榜第一。'
  },
  {
    season: '2009-10',
    year: 2010,
    rank: 1,
    placement: '助攻王',
    remark: '兰帕德效力切尔西期间，位列 2009-10 赛季英超助攻榜第一。'
  }
];

const FWA_FOOTBALLER_OF_THE_YEAR_GERRARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2008-09',
    year: 2009,
    rank: 1,
    placement: '获奖',
    remark: '杰拉德效力利物浦期间，当选 2008-09 赛季英格兰足球记者协会年度足球先生。'
  },
  {
    season: '2013-14',
    year: 2014,
    rank: 2,
    placement: '第二名',
    externalUrl: FWA_FOOTBALLER_OF_THE_YEAR_2014_EXTERNAL_URL,
    remark: '杰拉德效力利物浦期间，在 2013-14 赛季英格兰足球记者协会年度足球先生评选中获得第二名。'
  }
];

const ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_SEASON_LAMPARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2004-05',
    year: 2005,
    rank: 1,
    placement: '获奖',
    remark: '兰帕德效力切尔西期间，当选 2004-05 赛季英格兰足球超级联赛赛季最佳球员。'
  }
];

const FWA_FOOTBALLER_OF_THE_YEAR_LAMPARD_RESULTS: EnglishLeagueAwardSeed[] = [
  {
    season: '2003-04',
    year: 2004,
    rank: 2,
    placement: '第二名',
    externalUrl: LAMPARD_FWA_PFA_2005_REPORT_EXTERNAL_URL,
    remark: '兰帕德效力切尔西期间，在 2003-04 赛季英格兰足球记者协会年度足球先生评选中获得第二名。'
  },
  {
    season: '2004-05',
    year: 2005,
    rank: 1,
    placement: '获奖',
    remark: '兰帕德效力切尔西期间，当选 2004-05 赛季英格兰足球记者协会年度足球先生。'
  }
];

const ENGLAND_PLAYER_OF_THE_YEAR_GERRARD_RESULTS: RankedAwardSeed[] = [
  {
    year: 2007,
    rank: 1,
    placement: '获奖',
    remark: '杰拉德经英格兰球迷投票，当选英足总 2007 年度英格兰代表队最佳球员。'
  },
  {
    year: 2012,
    rank: 1,
    placement: '获奖',
    remark: '杰拉德经英格兰球迷投票，当选英足总 2012 年度英格兰代表队最佳球员。'
  }
];

const ENGLAND_PLAYER_OF_THE_YEAR_LAMPARD_RESULTS: RankedAwardSeed[] = [
  {
    year: 2004,
    rank: 1,
    placement: '获奖',
    remark: '兰帕德经英格兰球迷投票，当选英足总 2004 年度英格兰代表队最佳球员。'
  },
  {
    year: 2005,
    rank: 1,
    placement: '获奖',
    remark: '兰帕德经英格兰球迷投票，当选英足总 2005 年度英格兰代表队最佳球员。'
  }
];

const UEFA_EURO_TEAM_OF_THE_TOURNAMENT_GERRARD_RESULTS: AnnualSelectionAwardSeed[] = [
  {
    year: 2012,
    placement: '入选',
    remark: '杰拉德作为英格兰队长，以中场身份入选 UEFA Euro 2012 官方赛事最佳阵容。',
    editionRemark: '欧足联技术团队评选的 UEFA Euro 2012 赛事最佳阵容。'
  }
];

const UEFA_EURO_TEAM_OF_THE_TOURNAMENT_LAMPARD_RESULTS: AnnualSelectionAwardSeed[] = [
  {
    year: 2004,
    placement: '入选',
    remark: '兰帕德代表英格兰参加 UEFA Euro 2004，以中场身份入选官方赛事最佳阵容。',
    editionRemark: '欧足联技术团队评选的 UEFA Euro 2004 赛事最佳阵容。'
  }
];

const ARGENTINE_FOOTBALLER_OF_THE_YEAR_MARADONA_RESULTS: RankedAwardSeed[] = [
  {
    year: 1979,
    rank: 1,
    placement: '第一名',
    remark: '阿根廷体育记者协会 Olimpia de Plata 足球分项，马拉多纳效力阿根廷青年人时期。'
  },
  {
    year: 1980,
    rank: 1,
    placement: '第一名',
    remark: '阿根廷体育记者协会 Olimpia de Plata 足球分项，马拉多纳效力阿根廷青年人时期。'
  },
  {
    year: 1981,
    rank: 1,
    placement: '第一名',
    remark: '阿根廷体育记者协会 Olimpia de Plata 足球分项，马拉多纳效力博卡青年时期。'
  },
  {
    year: 1986,
    rank: 1,
    placement: '第一名',
    remark: '阿根廷体育记者协会 Olimpia de Plata 足球分项，马拉多纳效力那不勒斯时期。'
  }
];

const FIFA_WORLD_CUP_GOLDEN_BALL_MARADONA_RESULTS: FIFAWorldCupGoldenBallSeed[] = [
  {
    year: 1986,
    rank: 1,
    placement: '第一名',
    remark: '1986年世界杯金球奖，阿根廷夺冠核心。'
  },
  {
    year: 1990,
    rank: 3,
    placement: '第三名',
    remark: '1990年世界杯铜球奖。'
  }
];

const FIFA_WORLD_CUP_GOLDEN_BOOT_MARADONA_RESULTS: FIFAWorldCupGoldenBootSeed[] = [
  {
    year: 1986,
    rank: 2,
    placement: '银靴奖',
    remark: '1986年世界杯银靴奖，5 球；与卡雷卡、布特拉格诺并列第二射手。'
  }
];

const FIFA_WORLD_CUP_ALL_STAR_TEAM_MARADONA_RESULTS: FIFAWorldCupAllStarTeamSeed[] = [
  {
    year: 1986,
    placement: '入选',
    remark: '1986年国际足联世界杯最佳阵容，中场。'
  },
  {
    year: 1990,
    placement: '入选',
    remark: '1990年国际足联世界杯最佳阵容，中场。'
  }
];

const FIFA_WORLD_CUP_GOLDEN_BALL_PELE_RESULTS = [
  {
    year: 1958,
    rank: 2,
    placement: '第二名',
    remark: '世界杯银球奖，历史追认口径，非当届正式颁发。',
    editionRemark: '历史追认口径，非当届正式颁发。'
  },
  {
    year: 1970,
    rank: 1,
    placement: '第一名',
    remark: '世界杯金球奖，历史追认口径，非当届正式颁发。',
    editionRemark: '历史追认口径，非当届正式颁发。'
  }
] as const;

const FIFA_WORLD_CUP_ALL_STAR_TEAM_PELE_RESULTS: FIFAWorldCupAllStarTeamSeed[] = [
  {
    year: 1958,
    placement: '入选',
    remark: '1958年国际足联世界杯最佳阵容，前锋。'
  },
  {
    year: 1970,
    placement: '入选',
    remark: '1970年国际足联世界杯最佳阵容，前锋。'
  }
];

const FIFA_WORLD_CUP_ALL_STAR_TEAM_BARESI_RESULTS: FIFAWorldCupAllStarTeamSeed[] = [
  {
    year: 1990,
    placement: '入选',
    remark: '1990年国际足联世界杯最佳阵容，后卫。'
  }
];

const ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_MARADONA_RESULTS: ArgentinePrimeraDivisionTopScorerSeed[] =
  [
    {
      editionName: '1978 (Metropolitano)',
      year: 1978,
      placement: '最佳射手',
      remark: '1978 (Metropolitano) 阿甲最佳射手，阿根廷青年人。'
    },
    {
      editionName: '1979 (Metropolitano)',
      year: 1979,
      placement: '最佳射手',
      remark: '1979 (Metropolitano) 阿甲最佳射手，阿根廷青年人。'
    },
    {
      editionName: '1979 (Nacional)',
      year: 1979,
      placement: '最佳射手',
      remark: '1979 (Nacional) 阿甲最佳射手，阿根廷青年人。'
    },
    {
      editionName: '1980 (Metropolitano)',
      year: 1980,
      placement: '最佳射手',
      remark: '1980 (Metropolitano) 阿甲最佳射手，阿根廷青年人。'
    },
    {
      editionName: '1980 (Nacional)',
      year: 1980,
      placement: '最佳射手',
      remark: '1980 (Nacional) 阿甲最佳射手，阿根廷青年人。'
    }
  ];

const FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_PELE_RESULTS = [
  {
    year: 1958,
    placement: '获奖',
    remark: '历史追认口径，非当届正式颁发。'
  }
] as const;

const COPA_AMERICA_BEST_PLAYER_PELE_RESULTS = [
  {
    year: 1959,
    editionName: '1959年 阿根廷',
    placement: '获奖',
    remark: '南美锦标赛历史最佳球员口径；该届贝利同时以 8 球成为最佳射手。'
  }
] as const;

const COPA_AMERICA_TOP_SCORER_PELE_RESULTS = [
  {
    year: 1959,
    editionName: '1959年 阿根廷',
    rank: 1,
    placement: '最佳射手',
    remark: '1959年阿根廷美洲杯最佳射手，贝利 6 场 8 球。'
  }
] as const;

const BRAZIL_SERIE_A_TOP_SCORER_PELE_RESULTS = [
  {
    year: 1961,
    rank: 1,
    placement: '最佳射手',
    goals: 9,
    remark: '1961年巴西全国冠军统一口径最佳射手，贝利效力桑托斯，RSSSF Brasil 口径为 9 球。'
  },
  {
    year: 1964,
    rank: 1,
    placement: '最佳射手',
    goals: 8,
    remark: '1964年巴西全国冠军统一口径最佳射手，贝利效力桑托斯，RSSSF Brasil 口径为 8 球。'
  }
] as const;

const ITALY_SERIE_A_TOP_SCORER_MARADONA_RESULTS: ItalianTopScorerSeed[] = [
  {
    season: '1987-88',
    year: 1988,
    placement: '最佳射手',
    goals: 15,
    remark: '1987-88 意甲最佳射手，马拉多纳效力那不勒斯，15 球。'
  }
];

const ITALY_SERIE_A_PLAYER_OF_THE_YEAR_MARADONA_RESULTS: LeaguePlayerOfTheYearSeed[] = [
  {
    season: '1984-85',
    year: 1985,
    placement: '年度最佳球员',
    remark: "1984-85 意大利足球甲级联赛 Guerin d'Oro，马拉多纳效力那不勒斯时期。"
  }
];

const ITALY_SERIE_A_PLAYER_OF_THE_YEAR_BARESI_RESULTS: LeaguePlayerOfTheYearSeed[] = [
  {
    season: '1989-90',
    year: 1990,
    placement: '年度最佳球员',
    remark: "1989-90 意大利足球甲级联赛 Guerin d'Oro，巴雷西效力 AC米兰时期。"
  }
];

const ITALY_COPPA_ITALIA_TOP_SCORER_MARADONA_RESULTS: ItalianTopScorerSeed[] = [
  {
    season: '1987-88',
    year: 1988,
    placement: '最佳射手',
    goals: 6,
    remark: '1987-88 意大利杯最佳射手，马拉多纳效力那不勒斯，6 球。'
  }
];

const ITALY_COPPA_ITALIA_TOP_SCORER_BARESI_RESULTS: ItalianTopScorerSeed[] = [
  {
    season: '1989-90',
    year: 1990,
    placement: '最佳射手',
    goals: 4,
    remark: '1989-90 意大利杯最佳射手，巴雷西效力 AC米兰，4 球。'
  }
];

const MARADONA_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1987-88',
    teamName: '那不勒斯',
    careerTeamName: '那不勒斯',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '马拉多纳 1987-88 赛季代表那不勒斯出战意甲，球队获得意大利足球甲级联赛亚军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1988-89',
    teamName: '那不勒斯',
    careerTeamName: '那不勒斯',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '马拉多纳 1988-89 赛季代表那不勒斯出战意甲，球队获得意大利足球甲级联赛亚军。'
  },
  {
    competitionCode: ITALY_COPPA_ITALIA_COMPETITION_CODE,
    editionName: '1988-89',
    teamName: '那不勒斯',
    careerTeamName: '那不勒斯',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '马拉多纳 1988-89 赛季代表那不勒斯参加意大利杯，球队获得意大利杯亚军。'
  }
];

const BARESI_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: 'FIFA_WORLD_CUP',
    editionName: '1982年',
    teamName: '意大利',
    careerTeamName: '意大利',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西为意大利 1982 年世界杯冠军名单成员，但未出场。'
  },
  {
    competitionCode: 'FIFA_WORLD_CUP',
    editionName: '1990年',
    teamName: '意大利',
    careerTeamName: '意大利',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '巴雷西代表意大利出战 1990 年世界杯，球队获得季军。'
  },
  {
    competitionCode: 'FIFA_WORLD_CUP',
    editionName: '1994年',
    teamName: '意大利',
    careerTeamName: '意大利',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西代表意大利出战 1994 年世界杯并参加决赛，球队获得亚军。'
  },
  {
    competitionCode: 'UEFA_EURO',
    editionName: '1988年',
    teamName: '意大利',
    careerTeamName: '意大利',
    expectedPlacement: CompetitionStandingPlacement.SEMI_FINALIST,
    remark: '巴雷西代表意大利参加 1988 年欧洲足球锦标赛，球队进入四强。'
  },
  {
    competitionCode: 'OLYMPIC_MENS_FOOTBALL',
    editionName: '1984年',
    teamName: '意大利',
    careerTeamName: '意大利',
    expectedPlacement: CompetitionStandingPlacement.FOURTH_PLACE,
    remark: '巴雷西代表意大利奥林匹克队参加 1984 年奥运会男子足球赛，球队获得殿军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1978-79',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1978-79 赛季代表 AC米兰出战意甲，球队获得意大利足球甲级联赛冠军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1987-88',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1987-88 赛季代表 AC米兰出战意甲，球队获得意大利足球甲级联赛冠军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1991-92',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1991-92 赛季代表 AC米兰出战意甲，球队获得意大利足球甲级联赛冠军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1992-93',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1992-93 赛季代表 AC米兰出战意甲，球队获得意大利足球甲级联赛冠军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1993-94',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1993-94 赛季代表 AC米兰出战意甲，球队获得意大利足球甲级联赛冠军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1995-96',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1995-96 赛季代表 AC米兰出战意甲，球队获得意大利足球甲级联赛冠军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1979-80',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '巴雷西 1979-80 赛季代表 AC米兰出战意甲 28 场，球队获得意大利足球甲级联赛季军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1988-89',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '巴雷西 1988-89 赛季代表 AC米兰出战意甲 33 场，球队获得意大利足球甲级联赛季军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1989-90',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西 1989-90 赛季代表 AC米兰出战意甲 30 场，球队获得意大利足球甲级联赛亚军。'
  },
  {
    competitionCode: ITALY_SERIE_A_COMPETITION_CODE,
    editionName: '1990-91',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西 1990-91 赛季代表 AC米兰出战意甲 31 场，球队获得意大利足球甲级联赛亚军。'
  },
  {
    competitionCode: ITALY_SERIE_B_COMPETITION_CODE,
    editionName: '1980-81',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1980-81 赛季代表 AC米兰出战意乙，球队获得意大利足球乙级联赛冠军。'
  },
  {
    competitionCode: ITALY_SERIE_B_COMPETITION_CODE,
    editionName: '1982-83',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1982-83 赛季代表 AC米兰出战意乙，球队获得意大利足球乙级联赛冠军。'
  },
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '1988-89赛季',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1988-89 赛季代表 AC米兰出战欧洲冠军杯，球队获得冠军。'
  },
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '1989-90赛季',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1989-90 赛季代表 AC米兰出战欧洲冠军杯，球队获得冠军。'
  },
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '1993-94赛季',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1993-94 赛季代表 AC米兰出战欧洲冠军联赛，球队获得冠军。'
  },
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '1992-93赛季',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西 1992-93 赛季代表 AC米兰出战欧洲冠军联赛决赛，球队获得亚军。'
  },
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '1994-95赛季',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西 1994-95 赛季代表 AC米兰出战欧洲冠军联赛决赛并担任队长，球队获得亚军。'
  },
  {
    competitionCode: UEFA_SUPER_CUP_COMPETITION_CODE,
    editionName: '1990年',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1990 年欧洲超级杯，球队获得冠军。'
  },
  {
    competitionCode: UEFA_SUPER_CUP_COMPETITION_CODE,
    editionName: '1994年',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1994 年欧洲超级杯，球队获得冠军。'
  },
  {
    competitionCode: UEFA_SUPER_CUP_COMPETITION_CODE,
    editionName: '1993年',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西代表 AC米兰参加 1993 年欧洲超级杯两回合比赛，球队获得亚军。'
  },
  {
    competitionCode: ITALY_SUPER_CUP_COMPETITION_CODE,
    editionName: '1988',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1988 年意大利超级杯，球队获得冠军。'
  },
  {
    competitionCode: ITALY_SUPER_CUP_COMPETITION_CODE,
    editionName: '1992',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1992 年意大利超级杯，球队获得冠军。'
  },
  {
    competitionCode: ITALY_SUPER_CUP_COMPETITION_CODE,
    editionName: '1993',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1993 年意大利超级杯，球队获得冠军。'
  },
  {
    competitionCode: ITALY_SUPER_CUP_COMPETITION_CODE,
    editionName: '1994',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1994 年意大利超级杯，球队获得冠军。'
  },
  {
    competitionCode: ITALY_SUPER_CUP_COMPETITION_CODE,
    editionName: '1996',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西代表 AC米兰参加 1996 年意大利超级杯并担任队长，球队获得亚军。'
  },
  {
    competitionCode: ITALY_COPPA_ITALIA_COMPETITION_CODE,
    editionName: '1984-85',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西代表 AC米兰参加 1984-85 赛季意大利杯两回合决赛，球队获得亚军。'
  },
  {
    competitionCode: ITALY_COPPA_ITALIA_COMPETITION_CODE,
    editionName: '1989-90',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark:
      '巴雷西代表 AC米兰参加 1989-90 赛季意大利杯两回合决赛，球队获得亚军；同届个人为意大利杯最佳射手。'
  },
  {
    competitionCode: EUROPEAN_SOUTH_AMERICAN_CUP_COMPETITION_CODE,
    editionName: '1989年',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1989 年欧洲/南美洲杯，球队获得冠军。'
  },
  {
    competitionCode: EUROPEAN_SOUTH_AMERICAN_CUP_COMPETITION_CODE,
    editionName: '1990年',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西代表 AC米兰参加 1990 年欧洲/南美洲杯，球队获得冠军。'
  },
  {
    competitionCode: EUROPEAN_SOUTH_AMERICAN_CUP_COMPETITION_CODE,
    editionName: '1993年',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西代表 AC米兰参加 1993 年欧洲/南美洲杯决赛并担任队长，球队获得亚军。'
  },
  {
    competitionCode: EUROPEAN_SOUTH_AMERICAN_CUP_COMPETITION_CODE,
    editionName: '1994年',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '巴雷西代表 AC米兰参加 1994 年欧洲/南美洲杯决赛，球队获得亚军。'
  },
  {
    competitionCode: MITROPA_CUP_COMPETITION_CODE,
    editionName: '1981-82',
    teamName: 'AC米兰',
    careerTeamName: 'AC米兰',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '巴雷西 1981-82 赛季代表 AC米兰参加米特罗帕杯，球队获得冠军。'
  }
];

const GERRARD_PREMIER_LEAGUE_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2000-01',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '杰拉德代表利物浦参加 2000-01 赛季英超，球队获得季军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2001-02',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '杰拉德代表利物浦参加 2001-02 赛季英超，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2005-06',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '杰拉德代表利物浦参加 2005-06 赛季英超，球队获得季军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2006-07',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '杰拉德代表利物浦参加 2006-07 赛季英超，球队获得季军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2008-09',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '杰拉德代表利物浦参加 2008-09 赛季英超，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2013-14',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '杰拉德代表利物浦参加 2013-14 赛季英超，球队获得亚军。'
  }
];

const GERRARD_ENGLAND_CUP_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2000-01',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2000-01 赛季足总杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2005-06',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2005-06 赛季足总杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2011-12',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '杰拉德代表利物浦参加 2011-12 赛季足总杯，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_LEAGUE_CUP_COMPETITION_CODE,
    editionName: '2000-01',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2000-01 赛季英格兰联赛杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_LEAGUE_CUP_COMPETITION_CODE,
    editionName: '2002-03',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2002-03 赛季英格兰联赛杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_LEAGUE_CUP_COMPETITION_CODE,
    editionName: '2004-05',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '杰拉德代表利物浦参加 2004-05 赛季英格兰联赛杯，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_LEAGUE_CUP_COMPETITION_CODE,
    editionName: '2011-12',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2011-12 赛季英格兰联赛杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2006',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2006 年社区盾杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2002',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '杰拉德代表利物浦参加 2002 年社区盾杯，球队获得亚军。'
  }
];

const GERRARD_EUROPEAN_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '2004-05赛季',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2004-05 赛季欧冠，球队获得冠军。'
  },
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '2006-07赛季',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '杰拉德代表利物浦参加 2006-07 赛季欧冠，球队获得亚军。'
  },
  {
    competitionCode: UEFA_EUROPA_LEAGUE_COMPETITION_CODE,
    editionName: '2000-01赛季',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2000-01 赛季欧洲联盟杯，球队获得冠军。'
  },
  {
    competitionCode: UEFA_SUPER_CUP_COMPETITION_CODE,
    editionName: '2001年',
    teamName: '利物浦',
    careerTeamName: '利物浦',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '杰拉德代表利物浦参加 2001 年欧洲超级杯，球队获得冠军。'
  }
];

const LAMPARD_PREMIER_LEAGUE_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2003-04',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2003-04 赛季英格兰足球超级联赛，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2004-05',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2004-05 赛季英格兰足球超级联赛，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2005-06',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2005-06 赛季英格兰足球超级联赛，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2006-07',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2006-07 赛季英格兰足球超级联赛，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2007-08',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2007-08 赛季英格兰足球超级联赛，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2008-09',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '兰帕德代表切尔西参加 2008-09 赛季英格兰足球超级联赛，球队获得季军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2009-10',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2009-10 赛季英格兰足球超级联赛，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2010-11',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2010-11 赛季英格兰足球超级联赛，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2012-13',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '兰帕德代表切尔西参加 2012-13 赛季英格兰足球超级联赛，球队获得季军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2013-14',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.THIRD_PLACE,
    remark: '兰帕德代表切尔西参加 2013-14 赛季英格兰足球超级联赛，球队获得季军。'
  },
  {
    competitionCode: ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE,
    editionName: '2014-15',
    teamName: '曼彻斯特城',
    careerTeamName: '曼彻斯特城',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表曼彻斯特城参加 2014-15 赛季英格兰足球超级联赛，球队获得亚军。'
  }
];

const LAMPARD_ENGLAND_CUP_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2001-02',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2001-02 赛季英格兰足总杯，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2006-07',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2006-07 赛季英格兰足总杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2008-09',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2008-09 赛季英格兰足总杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2009-10',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2009-10 赛季英格兰足总杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_FA_CUP_COMPETITION_CODE,
    editionName: '2011-12',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2011-12 赛季英格兰足总杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_LEAGUE_CUP_COMPETITION_CODE,
    editionName: '2004-05',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2004-05 赛季英格兰联赛杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_LEAGUE_CUP_COMPETITION_CODE,
    editionName: '2006-07',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2006-07 赛季英格兰联赛杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_LEAGUE_CUP_COMPETITION_CODE,
    editionName: '2007-08',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2007-08 赛季英格兰联赛杯，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2005',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2005 年英格兰社区盾杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2006',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2006 年英格兰社区盾杯，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2007',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2007 年英格兰社区盾杯，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2009',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2009 年英格兰社区盾杯，球队获得冠军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2010',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2010 年英格兰社区盾杯，球队获得亚军。'
  },
  {
    competitionCode: ENGLAND_COMMUNITY_SHIELD_COMPETITION_CODE,
    editionName: '2012',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2012 年英格兰社区盾杯，球队获得亚军。'
  }
];

const LAMPARD_EUROPEAN_AND_GLOBAL_TEAM_HONOR_RESULTS: PlayerTeamHonorSeed[] = [
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '2007-08赛季',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2007-08 赛季欧洲冠军联赛，球队获得亚军。'
  },
  {
    competitionCode: UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE,
    editionName: '2011-12赛季',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2011-12 赛季欧洲冠军联赛，球队获得冠军。'
  },
  {
    competitionCode: UEFA_EUROPA_LEAGUE_COMPETITION_CODE,
    editionName: '2012-13赛季',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.CHAMPION,
    remark: '兰帕德代表切尔西参加 2012-13 赛季欧足联欧洲联赛，球队获得冠军。'
  },
  {
    competitionCode: UEFA_SUPER_CUP_COMPETITION_CODE,
    editionName: '2012年',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2012 年欧洲超级杯，球队获得亚军。'
  },
  {
    competitionCode: UEFA_SUPER_CUP_COMPETITION_CODE,
    editionName: '2013年',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2013 年欧洲超级杯，球队获得亚军。'
  },
  {
    competitionCode: FIFA_CLUB_WORLD_CUP_COMPETITION_CODE,
    editionName: '2012年',
    teamName: '切尔西',
    careerTeamName: '切尔西',
    expectedPlacement: CompetitionStandingPlacement.RUNNER_UP,
    remark: '兰帕德代表切尔西参加 2012 年国际足联俱乐部世界杯，球队获得亚军。'
  }
];

const CAMPEONATO_PAULISTA_TOP_SCORER_PELE_RESULTS = [
  {
    year: 1957,
    rank: 1,
    placement: '最佳射手',
    goalsText: '17 / 36 球',
    remark:
      '1957年保利斯塔锦标赛最佳射手，贝利效力桑托斯；进球数资料存在 17 / 36 球差异，最佳射手名次无争议。'
  },
  {
    year: 1958,
    rank: 1,
    placement: '最佳射手',
    goalsText: '58 球',
    remark: '1958年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 58 球。'
  },
  {
    year: 1959,
    rank: 1,
    placement: '最佳射手',
    goalsText: '44 / 45 / 46 球',
    remark:
      '1959年保利斯塔锦标赛最佳射手，贝利效力桑托斯；资料常见 44 / 45 球，圣保罗足协修订口径为 46 球。'
  },
  {
    year: 1960,
    rank: 1,
    placement: '最佳射手',
    goalsText: '32 / 33 / 34 球',
    remark:
      '1960年保利斯塔锦标赛最佳射手，贝利效力桑托斯；资料常见 33 / 34 球，圣保罗足协修订口径为 32 球。'
  },
  {
    year: 1961,
    rank: 1,
    placement: '最佳射手',
    goalsText: '47 球',
    remark: '1961年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 47 球。'
  },
  {
    year: 1962,
    rank: 1,
    placement: '最佳射手',
    goalsText: '37 球',
    remark: '1962年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 37 球。'
  },
  {
    year: 1963,
    rank: 1,
    placement: '最佳射手',
    goalsText: '22 球',
    remark: '1963年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 22 球。'
  },
  {
    year: 1964,
    rank: 1,
    placement: '最佳射手',
    goalsText: '34 球',
    remark: '1964年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 34 球。'
  },
  {
    year: 1965,
    rank: 1,
    placement: '最佳射手',
    goalsText: '49 球',
    remark: '1965年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 49 球。'
  },
  {
    year: 1969,
    rank: 1,
    placement: '最佳射手',
    goalsText: '26 球',
    remark: '1969年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 26 球。'
  },
  {
    year: 1973,
    rank: 1,
    placement: '最佳射手',
    goalsText: '11 球',
    remark: '1973年保利斯塔锦标赛最佳射手，贝利效力桑托斯，常见口径为 11 球。'
  }
] as const;

const TORNEIO_RIO_SAO_PAULO_TOP_SCORER_PELE_RESULTS = [
  {
    year: 1963,
    rank: 1,
    placement: '最佳射手',
    goals: 14,
    remark: '1963年里约-圣保罗锦标赛最佳射手，贝利效力桑托斯，14 球。'
  }
] as const;

const CONMEBOL_LIBERTADORES_TOP_SCORER_PELE_RESULTS = [
  {
    year: 1965,
    rank: 1,
    placement: '最佳射手',
    remark:
      '1965年南美解放者杯最佳射手，贝利效力桑托斯；进球数资料存在 7 / 8 球差异，最佳射手名次无争议。'
  }
] as const;

const EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_PELE_RESULTS = [
  {
    year: 1962,
    rank: 1,
    placement: '最佳射手',
    goals: 5,
    remark: '1962年欧洲/南美洲杯最佳射手，贝利效力桑托斯，两回合对本菲卡合计 5 球。'
  },
  {
    year: 1963,
    rank: 1,
    placement: '并列最佳射手',
    goals: 2,
    remark:
      '1963年欧洲/南美洲杯并列最佳射手，贝利效力桑托斯，2 球；与 Pepe、Amarildo、Bruno Mora 并列。'
  }
] as const;

const NASL_MVP_PELE_RESULTS = [
  {
    year: 1976,
    placement: 'MVP',
    remark: '1976年旧北美足球联赛最有价值球员，贝利效力纽约宇宙。'
  }
] as const;

const NASL_ALL_STAR_TEAM_PELE_RESULTS = [
  {
    year: 1975,
    placement: '入选',
    remark: '1975年旧北美足球联赛全明星阵容一队，贝利效力纽约宇宙。'
  },
  {
    year: 1976,
    placement: '入选',
    remark: '1976年旧北美足球联赛全明星阵容一队，贝利效力纽约宇宙。'
  },
  {
    year: 1977,
    placement: '入选',
    remark: '1977年旧北美足球联赛全明星阵容一队，贝利效力纽约宇宙。'
  }
] as const;

const NASL_ASSISTS_LEADER_PELE_RESULTS = [
  {
    year: 1976,
    rank: 1,
    placement: '助攻王',
    remark: '1976年旧北美足球联赛助攻榜第一，贝利效力纽约宇宙，18 次助攻。'
  }
] as const;

const MARADONA_ACHIEVEMENT_RESULTS: PlayerAchievementSeed[] = [
  {
    name: 'France Football 金球奖荣誉奖',
    season: '1995',
    score: 1,
    externalUrl:
      'https://www.ina.fr/ina-eclaire-actu/3-janvier-1995-maradona-recoit-le-ballon-d-or',
    remark: 'France Football 因马拉多纳球员时代非欧洲球员不能参评金球奖而授予的职业生涯荣誉奖。',
    sortOrder: 1
  },
  {
    name: 'FIFA 二十世纪最佳球员',
    season: '2000',
    score: 1,
    externalUrl: 'https://en.wikipedia.org/wiki/FIFA_Player_of_the_Century',
    remark:
      'FIFA 世纪类荣誉。马拉多纳赢得互联网公众投票，最终与贝利分设/共享二十世纪最佳球员口径。',
    sortOrder: 2
  },
  {
    name: 'IFFHS 阿根廷二十世纪最佳球员',
    season: '2000',
    score: 1,
    externalUrl: 'https://iffhs.com/posts/1094',
    remark: 'IFFHS 国家世纪最佳球员评选，马拉多纳当选阿根廷二十世纪最佳球员。',
    sortOrder: 3
  },
  {
    name: 'FIFA 世纪最佳进球',
    season: '2002',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://inside.fifa.com/en/tournaments/mens/worldcup/1986mexico/news/maradona-s-immortal-11-second-dash-2802747',
    remark: '1986 国际足联世界杯对英格兰的第二粒进球，FIFA 世纪最佳进球口径；仅展示，不计分。',
    sortOrder: 4
  },
  {
    name: 'Globe Soccer 20世纪最佳球员',
    season: '2012',
    score: 1,
    externalUrl: 'https://www.globesoccer.com/history/edition-2012/',
    remark: 'Globe Soccer Awards 20世纪最佳球员荣誉。',
    sortOrder: 5
  },
  {
    name: 'World Soccer 历史最佳阵容',
    season: '2013',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://www.worldsoccer.com/world-soccer-latest/the-greatest-xi-how-the-panel-voted-341427',
    remark: 'World Soccer 由专家评选的历史最佳十一人阵容；仅展示，不计分。',
    sortOrder: 6
  },
  {
    name: 'AFA 阿根廷历史最佳阵容',
    season: '2016',
    score: 1,
    isScoring: false,
    externalUrl: 'https://www.afa.com.ar/Futbol/posts/la-seleccion-de-todos-los-tiempos',
    remark: '阿根廷足协历史最佳阵容口径；仅展示，不计分。',
    sortOrder: 7
  },
  {
    name: '金球奖梦之队第一阵容',
    season: '2020',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://www.francefootball.fr/news/Ballon-d-or-dream-team-le-roi-pele-et-diego-maradona-elus-dans-ce-onze-de-legende/1205768',
    remark: "France Football Ballon d'Or Dream Team 第一阵容；仅展示，不计分。",
    sortOrder: 8
  },
  {
    name: 'IFFHS 历史最佳阵容',
    season: '2021',
    score: 1,
    isScoring: false,
    externalUrl: 'https://iffhs.com/posts/1110',
    remark: 'IFFHS 男足历史最佳阵容口径；仅展示，不计分。',
    sortOrder: 9
  },
  {
    name: '那不勒斯退役 10 号球衣',
    season: '2000',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Diego_Maradona',
    remark: '那不勒斯为表彰马拉多纳对俱乐部的贡献退役其 10 号球衣；仅展示，不计分。',
    sortOrder: 10
  },
  {
    name: '曾保持那不勒斯队史正式比赛进球纪录 26 年',
    season: '1991-2017',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Diego_Maradona',
    remark:
      '马拉多纳以 115 个正式比赛进球保持那不勒斯队史纪录，直至 2017 年被超越；仅展示，不计分。',
    sortOrder: 11
  }
];

const PELE_ACHIEVEMENT_RESULTS: PlayerAchievementSeed[] = [
  {
    name: '入选美国国家足球名人堂',
    season: '1992',
    score: 1,
    isScoring: false,
    externalUrl: 'https://www.nationalsoccerhof.com/players/pele.html',
    remark: '美国国家足球名人堂成员；仅展示，不计分。',
    sortOrder: 1
  },
  {
    name: '获国际足联功勋勋章',
    season: '1984',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Pel%C3%A9',
    remark: '获国际足联功勋勋章（FIFA Order of Merit）；仅展示，不计分。',
    sortOrder: 2
  },
  {
    name: '获巴西国家功勋勋章',
    season: '1991',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Pel%C3%A9',
    remark: '获巴西国家功勋勋章（National Order of Merit）；仅展示，不计分。',
    sortOrder: 3
  },
  {
    name: '国际奥委会世纪运动员',
    season: '1999',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Pel%C3%A9',
    remark: '国际奥委会评选的 20 世纪最佳运动员；仅展示，不计分。',
    sortOrder: 4
  },
  {
    name: 'BBC 体育人物终身成就奖',
    season: '2005',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Pel%C3%A9',
    remark: 'BBC Sports Personality of the Year Lifetime Achievement Award；仅展示，不计分。',
    sortOrder: 5
  },
  {
    name: '获奥林匹克勋章',
    season: '2016',
    score: 1,
    isScoring: false,
    externalUrl: 'https://olympics.com/ioc/news/pele-receives-olympic-order',
    remark: '国际奥委会授予的奥林匹克勋章；仅展示，不计分。',
    sortOrder: 6
  },
  {
    name: '入选 IFFHS 世界历史最佳阵容',
    season: '2021',
    score: 1,
    isScoring: false,
    externalUrl: 'https://iffhs.com/posts/1110',
    remark: 'IFFHS 男足世界历史最佳阵容；仅展示，不计分。',
    sortOrder: 7
  },
  {
    name: '入选 IFFHS 南美历史最佳阵容',
    season: '2021',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Pel%C3%A9',
    remark: 'IFFHS 男足南美历史最佳阵容；仅展示，不计分。',
    sortOrder: 8
  },
  {
    name: '吉尼斯认证职业生涯进球纪录',
    season: '2013',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://www.guinnessworldrecords.com/news/2013/10/pele-honoured-with-two-guinness-world-records-achievements-in-london-52558',
    remark: '吉尼斯世界纪录按包含友谊赛的统计口径认定贝利职业生涯攻入 1,283 球；仅展示，不计分。',
    sortOrder: 9
  },
  {
    name: '世界杯历史最年轻冠军球员',
    season: '1958',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://www.guinnessworldrecords.com/world-records/youngest-winner-of-the-football-soccer-world-cup',
    remark: '1958 年以 17 岁 249 天成为世界杯历史最年轻冠军球员；仅展示，不计分。',
    sortOrder: 10
  }
];

const BARESI_ACHIEVEMENT_RESULTS: PlayerAchievementSeed[] = [
  {
    name: '金球奖梦之队银阵',
    season: '2020',
    score: 1,
    isScoring: true,
    externalUrl: 'https://en.wikipedia.org/wiki/Ballon_d%27Or_Dream_Team',
    remark: "France Football Ballon d'Or Dream Team 第二阵容 / 银阵。",
    sortOrder: 1
  },
  {
    name: 'IFFHS 历史最佳阵容',
    season: '2021',
    score: 1,
    isScoring: true,
    externalUrl: 'https://iffhs.com/posts/1110',
    remark: 'IFFHS 男足历史最佳阵容口径。',
    sortOrder: 2
  },
  {
    name: 'AIC 意甲世纪最佳球员',
    season: '2000',
    score: 1,
    isScoring: true,
    externalUrl: 'https://en.wikipedia.org/wiki/Franco_Baresi',
    remark: 'AIC 意甲世纪最佳球员口径。',
    sortOrder: 3
  },
  {
    name: 'AC米兰世纪最佳球员',
    season: '1999',
    score: 1,
    isScoring: true,
    externalUrl: 'https://www.acmilan.com/en/hall-of-fame/inductees/franco-baresi',
    remark: 'AC米兰世纪最佳球员口径。',
    sortOrder: 4
  },
  {
    name: '入选意大利足球名人堂',
    season: '2013',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Franco_Baresi',
    remark: '意大利足球名人堂成员；仅展示，不计分。',
    sortOrder: 5
  },
  {
    name: '入选 IFFHS 男足传奇人物（第二阶段）',
    season: '2019',
    score: 1,
    isScoring: false,
    externalUrl: "https://en.wikipedia.org/wiki/IFFHS_World's_Best_Player#Men_Legends",
    remark:
      'IFFHS 传奇球员计划第二阶段 48 位入选者之一；荣誉性历史名单，不设个人排名，仅展示、不计分。',
    sortOrder: 6
  },
  {
    name: 'AC米兰队史担任队长 15 个赛季',
    season: '1982-1997',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Franco_Baresi',
    remark: '巴雷西担任 AC 米兰队长达 15 个赛季，为俱乐部纪录；仅展示，不计分。',
    sortOrder: 7
  },
  {
    name: 'AC米兰一人一队 20 年职业生涯',
    season: '1977-1997',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Franco_Baresi',
    remark: '整个职业生涯均效力 AC 米兰；仅展示，不计分。',
    sortOrder: 8
  },
  {
    name: 'AC米兰退役 6 号球衣',
    season: '1997',
    score: 1,
    isScoring: false,
    externalUrl: 'https://www.acmilan.com/en/hall-of-fame/inductees/franco-baresi',
    remark: 'AC 米兰为纪念巴雷西退役其 6 号球衣；仅展示，不计分。',
    sortOrder: 9
  },
  {
    name: '入选 World Soccer 20 世纪百大球员第 19 位',
    season: '1999',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Franco_Baresi',
    remark: 'World Soccer 杂志 20 世纪百大球员历史排名第 19 位；仅展示，不计分。',
    sortOrder: 10
  }
];

const GERRARD_ACHIEVEMENT_RESULTS: PlayerAchievementSeed[] = [
  {
    name: 'PFA功勋奖',
    season: '2015',
    score: 1,
    externalUrl: PFA_MERIT_AWARD_EXTERNAL_URL,
    remark: 'PFA Merit Award；PFA 于 2015 年授予杰拉德和兰帕德的职业生涯贡献荣誉。',
    sortOrder: 1
  },
  {
    name: '欧足联世纪迄今终极年度最佳阵容',
    season: '2017',
    score: 1,
    externalUrl: UEFA_ULTIMATE_TEAM_OF_THE_YEAR_EXTERNAL_URL,
    remark:
      'UEFA Ultimate Team of the Year；欧足联 2017 年发布的世纪迄今历史最佳十一人，杰拉德入选中场。',
    sortOrder: 2
  },
  {
    name: '利物浦官方历史最佳球员评选第一名',
    season: '2026',
    score: 1,
    externalUrl: LIVERPOOL_GREATEST_EXTERNAL_URL,
    remark:
      "Liverpool's Greatest；利物浦官方结合俱乐部历史数据、球迷选择和名宿意见评选，杰拉德排名第一。",
    sortOrder: 3
  },
  {
    name: '利物浦队史担任队长场次最多的球员',
    season: '2003-2015',
    score: 1,
    isScoring: false,
    externalUrl: 'https://www.liverpoolfc.com/news/liverpools-greatest-no1-steven-gerrard',
    remark: '利物浦官方称杰拉德担任队长的比赛数为俱乐部历史最多；仅展示，不计分。',
    sortOrder: 10
  },
  {
    name: '利物浦队史仅有的三位 700 次以上出场球员之一',
    season: '1998-2015',
    score: 1,
    isScoring: false,
    externalUrl: 'https://www.liverpoolfc.com/news/liverpools-greatest-no1-steven-gerrard',
    remark:
      '利物浦官方称杰拉德共出场 710 次、打进 186 球，是队史仅有的三位 700 次以上出场球员之一；仅展示，不计分。',
    sortOrder: 11
  },
  {
    name: '英格兰百场国脚',
    season: '2000-2014',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Steven_Gerrard',
    remark: '杰拉德代表英格兰出场 114 次，其中 38 次担任队长；仅展示，不计分。',
    sortOrder: 13
  },
  {
    name: '2005 年欧冠决赛完成伊斯坦布尔逆转并作为队长捧杯',
    season: '2005',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/2005_UEFA_Champions_League_final',
    remark: '作为队长在欧冠决赛落后 0-3 时打进反击首球并最终捧杯；仅展示，不计分。',
    sortOrder: 14
  },
  {
    name: '2006 年足总杯决赛贡献进球、助攻并罚入制胜点球',
    season: '2006',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/2006_FA_Cup_final',
    remark: '足总杯决赛贡献助攻、进球、扳平远射并罚入点球；仅展示，不计分。',
    sortOrder: 15
  },
  {
    name: '在联盟杯、联赛杯、欧冠和足总杯决赛均取得进球',
    season: '2001-2006',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Steven_Gerrard',
    remark: '分别在联盟杯、联赛杯、欧冠和足总杯决赛取得进球；仅展示，不计分。',
    sortOrder: 16
  },
  {
    name: '入选英格兰足球名人堂',
    season: '2017',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://web.archive.org/web/20170923002826/http://www.nationalfootballmuseum.com/halloffame/steven-gerrard',
    remark: '国家足球博物馆英格兰足球名人堂；仅展示，不计分。',
    sortOrder: 17
  },
  {
    name: '入选英超名人堂',
    season: '2021',
    score: 1,
    isScoring: false,
    externalUrl: 'https://www.premierleague.com/en/news/2147433',
    remark: '英超官方名人堂成员；仅展示，不计分。',
    sortOrder: 18
  },
  {
    name: '获授大英帝国勋章成员（MBE）',
    season: '2007',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Steven_Gerrard',
    remark: '国家授勋荣誉，不属于足球竞技奖项；仅展示，不计分。',
    sortOrder: 19
  },
  {
    name: '入选英超20赛季梦幻球队（公众票选）',
    season: '2012',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://en.wikipedia.org/wiki/Premier_League_20_Seasons_Awards#Fantasy_Teams_of_the_20_Seasons',
    remark: '英超 1992-93 至 2011-12 赛季回顾性公众票选梦幻球队；仅展示，不计分。',
    sortOrder: 20
  }
];

const LAMPARD_ACHIEVEMENT_RESULTS: PlayerAchievementSeed[] = [
  {
    name: 'PFA功勋奖',
    season: '2015',
    score: 1,
    isScoring: true,
    externalUrl: PFA_MERIT_AWARD_EXTERNAL_URL,
    remark: 'PFA Merit Award；PFA 于 2015 年授予杰拉德和兰帕德的职业生涯贡献荣誉。',
    sortOrder: 1
  },
  {
    name: '切尔西队史正式比赛最佳射手（211球）',
    season: '2001-2014',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '兰帕德以 211 个正式比赛进球成为切尔西队史最佳射手；仅展示，不计分。',
    sortOrder: 10
  },
  {
    name: '英超历史中场进球纪录（177球）',
    season: '1995-2015',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '兰帕德在英超攻入 177 球，保持英超历史中场球员进球纪录；仅展示，不计分。',
    sortOrder: 11
  },
  {
    name: '英超历史禁区外进球纪录（41球）',
    season: '1995-2015',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '兰帕德在英超完成 41 个禁区外进球，位列历史纪录口径；仅展示，不计分。',
    sortOrder: 12
  },
  {
    name: '连续十个英超赛季进球达到两位数',
    season: '2003-04至2012-13',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '兰帕德连续十个英超赛季进球达到两位数，体现长期稳定的进攻产出；仅展示，不计分。',
    sortOrder: 13
  },
  {
    name: '英超连续出场164场（曾为纪录）',
    season: '2001-2005',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '兰帕德曾连续 164 场出战英超；使用历史纪录表述，不代表当前纪录；仅展示，不计分。',
    sortOrder: 14
  },
  {
    name: '英格兰百场国脚',
    season: '1999-2014',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '兰帕德代表英格兰出场 106 次并打进 29 球，达到 FIFA 百场国脚里程碑；仅展示，不计分。',
    sortOrder: 15
  },
  {
    name: '入选英超20赛季500场俱乐部',
    season: '2012',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Premier_League_20_Seasons_Awards',
    remark:
      '入选英超 20 赛季奖项中的 Premier League 500 Club，表彰英超出场里程碑；仅展示，不计分。',
    sortOrder: 16
  },
  {
    name: '入选英格兰足球名人堂',
    season: '2017',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '英格兰足球名人堂成员；仅展示，不计分。',
    sortOrder: 17
  },
  {
    name: '入选英超名人堂',
    season: '2021',
    score: 1,
    isScoring: false,
    externalUrl: 'https://www.premierleague.com/news/2146455',
    remark: '英超官方名人堂成员；仅展示，不计分。',
    sortOrder: 18
  },
  {
    name: '2012年欧冠决赛作为队长捧杯',
    season: '2012',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/2012_UEFA_Champions_League_final',
    remark: '特里停赛期间担任切尔西场上队长，在 2012 年欧冠决赛带队夺冠；仅展示，不计分。',
    sortOrder: 19
  },
  {
    name: '获授大英帝国勋章官佐勋章（OBE）',
    season: '2015',
    score: 1,
    isScoring: false,
    externalUrl: 'https://en.wikipedia.org/wiki/Frank_Lampard',
    remark: '国家授勋荣誉，不属于足球竞技奖项；仅展示，不计分。',
    sortOrder: 20
  },
  {
    name: 'FWA致敬奖',
    season: '2010',
    score: 1,
    isScoring: false,
    externalUrl:
      'https://www.skysports.com/football/news/11095/5867711/lampard-celebrates-fwa-tribute',
    remark: '英格兰足球记者协会以 FWA Tribute Award 表彰兰帕德的职业生涯贡献；仅展示，不计分。',
    sortOrder: 21
  }
];

const GERRARD_LEGACY_ACHIEVEMENT_NAMES = [
  '利物浦队长纪录',
  '利物浦正式比赛出场 710 次、进球 186 个',
  '英超生涯 504 次出场、120 球、92 次助攻',
  '英格兰成年国家队 114 次出场、38 次担任队长',
  '伊斯坦布尔奇迹决赛关键表现',
  '足总杯决赛关键表现',
  '四类主要赛事决赛进球纪录',
  '英格兰足球名人堂成员',
  '英超名人堂成员',
  '大英帝国勋章成员（MBE）'
];

async function main() {
  const conmebol = await prisma.confederation.findFirst({
    where: {
      OR: [{ code: 'CONMEBOL' }, { name: '南美足联' }]
    },
    select: { id: true }
  });

  if (!conmebol) {
    throw new Error('Confederation not found: CONMEBOL / 南美足联');
  }

  const uefa = await prisma.confederation.findFirst({
    where: {
      OR: [{ code: 'UEFA' }, { name: '欧足联' }]
    },
    select: { id: true }
  });

  if (!uefa) {
    throw new Error('Confederation not found: UEFA / 欧足联');
  }

  const argentina = await prisma.country.findFirst({
    where: {
      OR: [{ uid: '1649' }, { name: '阿根廷' }]
    },
    select: { id: true }
  });

  if (!argentina) {
    throw new Error('Country not found: Argentina / 阿根廷');
  }

  const pele = await prisma.player.findFirst({
    where: {
      chineseName: {
        contains: PELE_NAME_KEYWORD
      }
    },
    select: { id: true, chineseName: true }
  });

  if (!pele) {
    throw new Error(`Player not found: ${PELE_NAME_KEYWORD}`);
  }

  const maradona = await prisma.player.findFirst({
    where: {
      chineseName: {
        contains: MARADONA_NAME_KEYWORD
      }
    },
    select: { id: true, chineseName: true }
  });

  if (!maradona) {
    throw new Error(`Player not found: ${MARADONA_NAME_KEYWORD}`);
  }

  const baresi = await prisma.player.findFirst({
    where: {
      chineseName: {
        contains: '巴雷西'
      }
    },
    select: { id: true, chineseName: true }
  });

  if (!baresi) {
    throw new Error('Player not found: 巴雷西');
  }

  const gerrard = await prisma.player.findFirst({
    where: {
      chineseName: {
        contains: GERRARD_NAME_KEYWORD
      }
    },
    select: { id: true, chineseName: true }
  });

  if (!gerrard) {
    throw new Error(`Player not found: ${GERRARD_NAME_KEYWORD}`);
  }

  const lampard = await prisma.player.findFirst({
    where: {
      chineseName: {
        contains: LAMPARD_NAME_KEYWORD
      }
    },
    select: { id: true, chineseName: true }
  });

  if (!lampard) {
    throw new Error(`Player not found: ${LAMPARD_NAME_KEYWORD}`);
  }

  const fifaWorldCup = await findCompetition('FIFA_WORLD_CUP');
  const copaAmerica = await findCompetition('COPA_AMERICA');
  const brazilSerieA = await findCompetition(BRAZIL_SERIE_A_COMPETITION_CODE);
  const italySerieA = await findCompetition(ITALY_SERIE_A_COMPETITION_CODE);
  const italyCoppaItalia = await findCompetition(ITALY_COPPA_ITALIA_COMPETITION_CODE);
  const argentinePrimeraDivision = await findCompetition(
    ARGENTINE_PRIMERA_DIVISION_COMPETITION_CODE
  );
  const campeonatoPaulista = await findCompetition(CAMPEONATO_PAULISTA_COMPETITION_CODE);
  const torneioRioSaoPaulo = await findCompetition(TORNEIO_RIO_SAO_PAULO_COMPETITION_CODE);
  const conmebolLibertadores = await findCompetition(CONMEBOL_LIBERTADORES_COMPETITION_CODE);
  const europeanSouthAmericanCup = await findCompetition(
    EUROPEAN_SOUTH_AMERICAN_CUP_COMPETITION_CODE
  );
  const northAmericanSoccerLeague = await findCompetition(
    NORTH_AMERICAN_SOCCER_LEAGUE_COMPETITION_CODE
  );
  const englandPremierLeague = await findCompetition(ENGLAND_PREMIER_LEAGUE_COMPETITION_CODE);
  const mls = await findCompetition(MLS_COMPETITION_CODE);
  const uefaChampionsLeague = await findCompetition(UEFA_CHAMPIONS_LEAGUE_COMPETITION_CODE);
  const uefaEuro = await findCompetition(UEFA_EURO_COMPETITION_CODE);
  const fifaClubWorldCup = await findCompetition(FIFA_CLUB_WORLD_CUP_COMPETITION_CODE);
  const england = await prisma.country.findFirst({
    where: {
      OR: [{ uid: '765' }, { name: '英格兰' }]
    },
    select: { id: true }
  });

  if (!england) {
    throw new Error('Country not found: England / 英格兰');
  }

  await seedSouthAmericanFootballerOfTheYear(
    conmebol.id,
    pele.id,
    pele.chineseName,
    SOUTH_AMERICAN_FOOTBALLER_PELE_RESULTS
  );
  await seedSouthAmericanFootballerOfTheYear(
    conmebol.id,
    maradona.id,
    maradona.chineseName,
    SOUTH_AMERICAN_FOOTBALLER_MARADONA_RESULTS
  );
  await seedOnzeDor(uefa.id, maradona.id, maradona.chineseName, ONZE_DOR_MARADONA_RESULTS);
  await seedOnzeDor(uefa.id, gerrard.id, gerrard.chineseName, ONZE_DOR_GERRARD_RESULTS);
  await seedBallonDor(baresi.id, baresi.chineseName, BALLON_DOR_BARESI_RESULTS);
  await seedBallonDor(gerrard.id, gerrard.chineseName, BALLON_DOR_GERRARD_RESULTS);
  await seedBallonDor(lampard.id, lampard.chineseName, BALLON_DOR_LAMPARD_RESULTS);
  await seedFifaWorldPlayerOfTheYear(lampard.id, lampard.chineseName);
  await seedFifproWorld11(gerrard.id, gerrard.chineseName, FIFPRO_WORLD_11_GERRARD_RESULTS);
  await seedFifproWorld11(lampard.id, lampard.chineseName, FIFPRO_WORLD_11_LAMPARD_RESULTS);
  await seedUefaClubFootballerOfTheYear(uefa.id, gerrard.id, gerrard.chineseName);
  await seedUefaClubMidfielderOfTheYear(lampard.id, lampard.chineseName, uefaChampionsLeague.id);
  await seedUefaTeamOfTheYear(uefa.id, gerrard.id, gerrard.chineseName);
  await seedEnglishLeagueAwards(gerrard.id, gerrard.chineseName, englandPremierLeague.id);
  await removeLampardPfaFansPlayerOfTheYear(lampard.id, lampard.chineseName);
  await seedLampardEnglishLeagueAwards(lampard.id, lampard.chineseName, englandPremierLeague.id);
  await seedLampardMlsPlayerOfTheMonth(lampard.id, lampard.chineseName, mls.id);
  await seedUefaEuroTeamOfTheTournament(
    uefa.id,
    gerrard.id,
    gerrard.chineseName,
    uefaEuro.id,
    UEFA_EURO_TEAM_OF_THE_TOURNAMENT_GERRARD_RESULTS
  );
  await seedFifaClubWorldCupGoldenBall(gerrard.id, gerrard.chineseName, fifaClubWorldCup.id);
  await seedEnglandPlayerOfTheYear(
    england.id,
    gerrard.id,
    gerrard.chineseName,
    ENGLAND_PLAYER_OF_THE_YEAR_GERRARD_RESULTS
  );
  await seedEnglandPlayerOfTheYear(
    england.id,
    lampard.id,
    lampard.chineseName,
    ENGLAND_PLAYER_OF_THE_YEAR_LAMPARD_RESULTS
  );
  await seedUefaEuroTeamOfTheTournament(
    uefa.id,
    lampard.id,
    lampard.chineseName,
    uefaEuro.id,
    UEFA_EURO_TEAM_OF_THE_TOURNAMENT_LAMPARD_RESULTS
  );
  await seedArgentineFootballerOfTheYear(argentina.id, maradona.id, maradona.chineseName);
  await seedFifaWorldCupGoldenBall(
    pele.id,
    pele.chineseName,
    fifaWorldCup.id,
    FIFA_WORLD_CUP_GOLDEN_BALL_PELE_RESULTS
  );
  await seedFifaWorldCupGoldenBall(
    maradona.id,
    maradona.chineseName,
    fifaWorldCup.id,
    FIFA_WORLD_CUP_GOLDEN_BALL_MARADONA_RESULTS
  );
  await seedFifaWorldCupGoldenBoot(
    maradona.id,
    maradona.chineseName,
    fifaWorldCup.id,
    FIFA_WORLD_CUP_GOLDEN_BOOT_MARADONA_RESULTS
  );
  await seedFifaWorldCupAllStarTeam(
    pele.id,
    pele.chineseName,
    fifaWorldCup.id,
    FIFA_WORLD_CUP_ALL_STAR_TEAM_PELE_RESULTS
  );
  await seedFifaWorldCupAllStarTeam(
    maradona.id,
    maradona.chineseName,
    fifaWorldCup.id,
    FIFA_WORLD_CUP_ALL_STAR_TEAM_MARADONA_RESULTS
  );
  await seedFifaWorldCupAllStarTeam(
    baresi.id,
    baresi.chineseName,
    fifaWorldCup.id,
    FIFA_WORLD_CUP_ALL_STAR_TEAM_BARESI_RESULTS
  );
  await seedFifaWorldCupBestYoungPlayer(pele.id, fifaWorldCup.id);
  await seedCopaAmericaBestPlayer(conmebol.id, copaAmerica.id, pele.id);
  await seedCopaAmericaTopScorer(conmebol.id, copaAmerica.id, pele.id);
  await seedBrazilSerieATopScorer(pele.id, brazilSerieA.id);
  await seedItalySerieAPlayerOfTheYear(
    maradona.id,
    maradona.chineseName,
    italySerieA.id,
    ITALY_SERIE_A_PLAYER_OF_THE_YEAR_MARADONA_RESULTS
  );
  await seedItalySerieAPlayerOfTheYear(
    baresi.id,
    baresi.chineseName,
    italySerieA.id,
    ITALY_SERIE_A_PLAYER_OF_THE_YEAR_BARESI_RESULTS
  );
  await seedItalySerieATopScorer(maradona.id, maradona.chineseName, italySerieA.id);
  await seedItalyCoppaItaliaTopScorer(
    maradona.id,
    maradona.chineseName,
    italyCoppaItalia.id,
    ITALY_COPPA_ITALIA_TOP_SCORER_MARADONA_RESULTS
  );
  await seedItalyCoppaItaliaTopScorer(
    baresi.id,
    baresi.chineseName,
    italyCoppaItalia.id,
    ITALY_COPPA_ITALIA_TOP_SCORER_BARESI_RESULTS
  );
  await seedArgentinePrimeraDivisionTopScorer(
    maradona.id,
    maradona.chineseName,
    argentinePrimeraDivision.id
  );
  await seedPlayerTeamHonors(maradona.id, maradona.chineseName, MARADONA_TEAM_HONOR_RESULTS);
  await seedPlayerTeamHonors(baresi.id, baresi.chineseName, BARESI_TEAM_HONOR_RESULTS);
  await seedPlayerTeamHonors(
    gerrard.id,
    gerrard.chineseName,
    GERRARD_PREMIER_LEAGUE_TEAM_HONOR_RESULTS
  );
  await seedPlayerTeamHonors(
    gerrard.id,
    gerrard.chineseName,
    GERRARD_ENGLAND_CUP_TEAM_HONOR_RESULTS
  );
  await seedPlayerTeamHonors(gerrard.id, gerrard.chineseName, GERRARD_EUROPEAN_TEAM_HONOR_RESULTS);
  await seedPlayerTeamHonors(
    lampard.id,
    lampard.chineseName,
    LAMPARD_PREMIER_LEAGUE_TEAM_HONOR_RESULTS
  );
  await seedPlayerTeamHonors(
    lampard.id,
    lampard.chineseName,
    LAMPARD_ENGLAND_CUP_TEAM_HONOR_RESULTS
  );
  await seedPlayerTeamHonors(
    lampard.id,
    lampard.chineseName,
    LAMPARD_EUROPEAN_AND_GLOBAL_TEAM_HONOR_RESULTS
  );
  await seedCampeonatoPaulistaTopScorer(pele.id, campeonatoPaulista.id);
  await seedTorneioRioSaoPauloTopScorer(pele.id, torneioRioSaoPaulo.id);
  await seedConmebolLibertadoresTopScorer(pele.id, conmebolLibertadores.id);
  await seedEuropeanSouthAmericanCupTopScorer(pele.id, europeanSouthAmericanCup.id);
  await seedNaslMostValuablePlayer(pele.id, northAmericanSoccerLeague.id);
  await seedNaslAllStarTeam(pele.id, northAmericanSoccerLeague.id);
  await seedNaslAssistsLeader(pele.id, northAmericanSoccerLeague.id);
  await seedPlayerAchievements(pele.id, pele.chineseName, PELE_ACHIEVEMENT_RESULTS);
  await seedPlayerAchievements(maradona.id, maradona.chineseName, MARADONA_ACHIEVEMENT_RESULTS);
  await seedPlayerAchievements(baresi.id, baresi.chineseName, BARESI_ACHIEVEMENT_RESULTS);
  await prisma.playerHonor.deleteMany({
    where: { playerId: gerrard.id, name: { in: GERRARD_LEGACY_ACHIEVEMENT_NAMES } }
  });
  await seedPlayerAchievements(gerrard.id, gerrard.chineseName, GERRARD_ACHIEVEMENT_RESULTS);
  await seedPlayerAchievements(lampard.id, lampard.chineseName, LAMPARD_ACHIEVEMENT_RESULTS);

  const awardRulesService = new AwardRulesService(prisma);
  const recalculation = await awardRulesService.recalculate();

  console.log(`Recalculated player award scores: ${JSON.stringify(recalculation)}`);
}

async function findCompetition(code: string) {
  const competition = await prisma.competition.findUnique({
    where: { code },
    select: {
      id: true,
      code: true
    }
  });

  if (!competition) {
    throw new Error(`Competition not found: ${code}`);
  }

  return competition;
}

async function findCompetitionEdition(competitionId: string, name: string) {
  const edition = await prisma.competitionEdition.findUnique({
    where: {
      competitionId_name: {
        competitionId,
        name
      }
    },
    select: { id: true }
  });

  if (!edition) {
    throw new Error(`Competition edition not found: ${competitionId} / ${name}`);
  }

  return edition;
}

async function findCompetitionStanding(seed: PlayerTeamHonorSeed) {
  const standing = await prisma.competitionStanding.findFirst({
    where: {
      placement: seed.expectedPlacement,
      edition: {
        name: seed.editionName,
        competition: {
          code: seed.competitionCode
        }
      },
      OR: [
        {
          club: {
            name: seed.teamName
          }
        },
        {
          country: {
            name: seed.teamName
          }
        }
      ]
    },
    select: {
      id: true
    }
  });

  if (!standing) {
    throw new Error(
      `Competition standing not found: ${seed.competitionCode} / ${seed.editionName} / ${seed.teamName} / ${seed.expectedPlacement}`
    );
  }

  return standing;
}

async function findPlayerCareer(playerId: string, teamName: string) {
  const career = await prisma.playerCareer.findFirst({
    where: {
      playerId,
      OR: [
        {
          club: {
            name: teamName
          }
        },
        {
          country: {
            name: teamName
          }
        }
      ]
    },
    select: {
      id: true
    }
  });

  if (!career) {
    throw new Error(`Player career not found: ${teamName}`);
  }

  return career;
}

async function seedSouthAmericanFootballerOfTheYear(
  conmebolId: string,
  playerId: string,
  playerLabel: string,
  results: readonly RankedAwardSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE },
    create: {
      code: SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE,
      name: '南美足球先生',
      externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description:
        '南美年度个人综合奖。1971-1985 采用委内瑞拉 El Mundo 正式口径，1986 起采用乌拉圭 El País 主流口径；1986-1992 的 El Mundo 非官方延续不纳入。',
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 4100
    },
    update: {
      name: '南美足球先生',
      externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description:
        '南美年度个人综合奖。1971-1985 采用委内瑞拉 El Mundo 正式口径，1986 起采用乌拉圭 El País 主流口径；1986-1992 的 El Mundo 非官方延续不纳入。',
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 4100
    }
  });

  for (const result of results) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: result.editionRemark ?? null
      },
      update: {
        year: result.year,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: result.editionRemark ?? null
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: SOUTH_AMERICAN_FOOTBALLER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${SOUTH_AMERICAN_FOOTBALLER_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedOnzeDor(
  uefaId: string,
  playerId: string,
  playerLabel: string,
  results: readonly RankedAwardSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: ONZE_DOR_AWARD_CODE },
    create: {
      code: ONZE_DOR_AWARD_CODE,
      name: "Onze d'Or",
      englishName: "Onze d'Or",
      externalUrl: ONZE_DOR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description:
        '法国《Onze Mondial》杂志年度足球奖，设金奖、银奖、铜奖；系统按欧洲足坛范围内的媒体年度综合奖计入，非欧足联官方奖。',
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 4110
    },
    update: {
      name: "Onze d'Or",
      englishName: "Onze d'Or",
      externalUrl: ONZE_DOR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description:
        '法国《Onze Mondial》杂志年度足球奖，设金奖、银奖、铜奖；系统按欧洲足坛范围内的媒体年度综合奖计入，非欧足联官方奖。',
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 4110
    }
  });

  for (const result of results) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: ONZE_DOR_EXTERNAL_URL
      },
      update: {
        year: result.year,
        externalUrl: ONZE_DOR_EXTERNAL_URL
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: ONZE_DOR_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: ONZE_DOR_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(`Seeded ${ONZE_DOR_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`);
}

async function seedBallonDor(
  playerId: string,
  playerLabel: string,
  results: readonly RankedAwardSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: BALLON_DOR_AWARD_CODE },
    create: {
      code: BALLON_DOR_AWARD_CODE,
      name: '金球奖',
      englishName: "Ballon d'Or",
      shortName: '金球奖',
      externalUrl: BALLON_DOR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '国际一级综合奖',
      level: '一级',
      description: 'France Football 年度个人综合奖，系统按国际一级综合奖口径计入。',
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2010
    },
    update: {
      name: '金球奖',
      englishName: "Ballon d'Or",
      shortName: '金球奖',
      externalUrl: BALLON_DOR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '国际一级综合奖',
      level: '一级',
      description: 'France Football 年度个人综合奖，系统按国际一级综合奖口径计入。',
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2010
    }
  });

  for (const result of results) {
    const editionExternalUrl = buildBallonDorEditionExternalUrl(result.year);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: editionExternalUrl,
        remark: result.editionRemark ?? null
      },
      update: {
        year: result.year,
        externalUrl: editionExternalUrl,
        remark: result.editionRemark ?? null
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: edition.externalUrl,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: edition.externalUrl,
        remark: result.remark
      }
    });
  }

  console.log(`Seeded ${BALLON_DOR_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`);
}

async function seedFifaWorldPlayerOfTheYear(playerId: string, playerLabel: string) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_WORLD_PLAYER_OF_THE_YEAR_AWARD_CODE },
    create: {
      code: FIFA_WORLD_PLAYER_OF_THE_YEAR_AWARD_CODE,
      name: '国际足联世界足球先生',
      englishName: 'FIFA World Player of the Year',
      shortName: '世界足球先生',
      externalUrl: FIFA_WORLD_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '国际一级综合奖',
      level: '一级',
      description: '国际足联于 1991 至 2009 年颁发的年度最佳球员奖。',
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-15T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入兰帕德 2005 年第二名，未补完整历年获奖者。',
      enabled: true,
      sortOrder: 2015
    },
    update: {
      name: '国际足联世界足球先生',
      englishName: 'FIFA World Player of the Year',
      shortName: '世界足球先生',
      externalUrl: FIFA_WORLD_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '国际一级综合奖',
      level: '一级',
      description: '国际足联于 1991 至 2009 年颁发的年度最佳球员奖。',
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-15T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入兰帕德 2005 年第二名，未补完整历年获奖者。',
      enabled: true,
      sortOrder: 2015
    }
  });

  const edition = await prisma.awardEdition.upsert({
    where: {
      awardId_name: {
        awardId: award.id,
        name: '2005年'
      }
    },
    create: {
      awardId: award.id,
      name: '2005年',
      year: 2005,
      externalUrl: FIFA_WORLD_PLAYER_OF_THE_YEAR_2005_EXTERNAL_URL
    },
    update: {
      year: 2005,
      externalUrl: FIFA_WORLD_PLAYER_OF_THE_YEAR_2005_EXTERNAL_URL
    }
  });

  await prisma.awardRecipient.upsert({
    where: {
      editionId_targetType_playerId: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId
      }
    },
    create: {
      editionId: edition.id,
      targetType: AwardTargetType.PLAYER,
      playerId,
      rank: 2,
      placement: '第二名',
      externalUrl: FIFA_WORLD_PLAYER_OF_THE_YEAR_2005_EXTERNAL_URL,
      remark: '兰帕德在 2005 年国际足联世界足球先生评选中获得第二名。'
    },
    update: {
      rank: 2,
      placement: '第二名',
      externalUrl: FIFA_WORLD_PLAYER_OF_THE_YEAR_2005_EXTERNAL_URL,
      remark: '兰帕德在 2005 年国际足联世界足球先生评选中获得第二名。'
    }
  });

  console.log(`Seeded ${FIFA_WORLD_PLAYER_OF_THE_YEAR_AWARD_CODE}: 1 ${playerLabel} recipient.`);
}

async function seedFifproWorld11(
  playerId: string,
  playerLabel: string,
  results: readonly AnnualSelectionAwardSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: FIFPRO_WORLD_11_AWARD_CODE },
    create: {
      code: FIFPRO_WORLD_11_AWARD_CODE,
      name: 'FIFPRO年度最佳阵容',
      englishName: 'FIFPRO World 11',
      shortName: 'FIFPRO World 11',
      externalUrl: FIFPRO_WORLD_11_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '国际二级阵容奖',
      level: '二级',
      description: '由全球职业球员投票产生的年度世界最佳阵容，按入选记录计分，不分名次。',
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-15T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入杰拉德和兰帕德确认记录，未补完整历年最佳阵容。',
      enabled: true,
      sortOrder: 2020
    },
    update: {
      name: 'FIFPRO年度最佳阵容',
      englishName: 'FIFPRO World 11',
      shortName: 'FIFPRO World 11',
      externalUrl: FIFPRO_WORLD_11_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '国际二级阵容奖',
      level: '二级',
      description: '由全球职业球员投票产生的年度世界最佳阵容，按入选记录计分，不分名次。',
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-15T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入杰拉德和兰帕德确认记录，未补完整历年最佳阵容。',
      enabled: true,
      sortOrder: 2020
    }
  });

  for (const result of results) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: FIFPRO_WORLD_11_HISTORY_EXTERNAL_URL,
        remark: result.editionRemark
      },
      update: {
        year: result.year,
        externalUrl: FIFPRO_WORLD_11_HISTORY_EXTERNAL_URL,
        remark: result.editionRemark
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: null,
        placement: result.placement,
        externalUrl: FIFPRO_WORLD_11_HISTORY_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: FIFPRO_WORLD_11_HISTORY_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(`Seeded ${FIFPRO_WORLD_11_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`);
}

async function seedUefaClubFootballerOfTheYear(
  uefaId: string,
  playerId: string,
  playerLabel: string
) {
  const award = await prisma.award.upsert({
    where: { code: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_AWARD_CODE },
    create: {
      code: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_AWARD_CODE,
      name: '欧足联年度最佳俱乐部球员',
      englishName: 'UEFA Club Footballer of the Year',
      shortName: '欧足联年度最佳俱乐部球员',
      externalUrl: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description: '欧足联 1997-98 至 2009-10 赛季颁发的欧洲俱乐部年度最佳球员奖。',
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 6100
    },
    update: {
      name: '欧足联年度最佳俱乐部球员',
      englishName: 'UEFA Club Footballer of the Year',
      shortName: '欧足联年度最佳俱乐部球员',
      externalUrl: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际一级综合奖',
      level: '一级',
      description: '欧足联 1997-98 至 2009-10 赛季颁发的欧洲俱乐部年度最佳球员奖。',
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 6100
    }
  });

  for (const result of UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_GERRARD_RESULTS) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: '2004-05赛季'
        }
      },
      create: {
        awardId: award.id,
        name: '2004-05赛季',
        season: '2004-05',
        year: result.year,
        externalUrl: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL
      },
      update: {
        season: '2004-05',
        year: result.year,
        externalUrl: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_AWARD_CODE}: ${UEFA_CLUB_FOOTBALLER_OF_THE_YEAR_GERRARD_RESULTS.length} ${playerLabel} recipients.`
  );
}

async function seedUefaClubMidfielderOfTheYear(
  playerId: string,
  playerLabel: string,
  competitionId: string
) {
  const competitionEdition = await findCompetitionEdition(competitionId, '2007-08赛季');
  const award = await prisma.award.upsert({
    where: { code: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_AWARD_CODE },
    create: {
      code: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_AWARD_CODE,
      name: '欧足联俱乐部年度最佳中场',
      englishName: 'UEFA Club Midfielder of the Year',
      shortName: '欧足联俱乐部最佳中场',
      externalUrl: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '洲联二级专项奖',
      level: '二级',
      description: '欧足联俱乐部足球奖中的赛季最佳中场奖，系统按俱乐部洲际赛事位置专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-17T00:00:00.000Z'),
      dataRemark: '当前仅按球员录入节奏补入兰帕德 2007-08 赛季获奖记录，未补完整历届获奖者。',
      enabled: true,
      sortOrder: 6320
    },
    update: {
      name: '欧足联俱乐部年度最佳中场',
      englishName: 'UEFA Club Midfielder of the Year',
      shortName: '欧足联俱乐部最佳中场',
      externalUrl: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '洲联二级专项奖',
      level: '二级',
      description: '欧足联俱乐部足球奖中的赛季最佳中场奖，系统按俱乐部洲际赛事位置专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-17T00:00:00.000Z'),
      dataRemark: '当前仅按球员录入节奏补入兰帕德 2007-08 赛季获奖记录，未补完整历届获奖者。',
      enabled: true,
      sortOrder: 6320
    }
  });

  const edition = await prisma.awardEdition.upsert({
    where: {
      awardId_name: {
        awardId: award.id,
        name: '2007-08赛季'
      }
    },
    create: {
      awardId: award.id,
      competitionEditionId: competitionEdition.id,
      name: '2007-08赛季',
      season: '2007-08',
      year: 2008,
      externalUrl: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_EXTERNAL_URL,
      remark: '欧足联按 2007-08 赛季欧洲俱乐部赛事表现评选，于 2008 年颁发。'
    },
    update: {
      competitionEditionId: competitionEdition.id,
      season: '2007-08',
      year: 2008,
      externalUrl: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_EXTERNAL_URL,
      remark: '欧足联按 2007-08 赛季欧洲俱乐部赛事表现评选，于 2008 年颁发。'
    }
  });

  await prisma.awardRecipient.upsert({
    where: {
      editionId_targetType_playerId: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId
      }
    },
    create: {
      editionId: edition.id,
      targetType: AwardTargetType.PLAYER,
      playerId,
      rank: 1,
      placement: '最佳中场',
      externalUrl: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_EXTERNAL_URL,
      remark: '兰帕德效力切尔西期间，当选 2007-08 赛季欧足联俱乐部年度最佳中场。'
    },
    update: {
      rank: 1,
      placement: '最佳中场',
      externalUrl: UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_EXTERNAL_URL,
      remark: '兰帕德效力切尔西期间，当选 2007-08 赛季欧足联俱乐部年度最佳中场。'
    }
  });

  console.log(`Seeded ${UEFA_CLUB_MIDFIELDER_OF_THE_YEAR_AWARD_CODE}: 1 ${playerLabel} recipient.`);
}

async function seedUefaTeamOfTheYear(uefaId: string, playerId: string, playerLabel: string) {
  const award = await prisma.award.upsert({
    where: { code: UEFA_TEAM_OF_THE_YEAR_AWARD_CODE },
    create: {
      code: UEFA_TEAM_OF_THE_YEAR_AWARD_CODE,
      name: '欧洲足联年度最佳阵容',
      englishName: 'UEFA Team of the Year',
      shortName: '欧足联年度最佳阵容',
      externalUrl: UEFA_TEAM_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际二级阵容奖',
      level: '二级',
      description: 'UEFA 于 2001 至 2020 年通过 UEFA.com 用户或球迷投票产生的欧洲年度最佳阵容。',
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入杰拉德确认记录，未补完整历年最佳阵容。',
      enabled: true,
      sortOrder: 6200
    },
    update: {
      name: '欧洲足联年度最佳阵容',
      englishName: 'UEFA Team of the Year',
      shortName: '欧足联年度最佳阵容',
      externalUrl: UEFA_TEAM_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际二级阵容奖',
      level: '二级',
      description: 'UEFA 于 2001 至 2020 年通过 UEFA.com 用户或球迷投票产生的欧洲年度最佳阵容。',
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入杰拉德确认记录，未补完整历年最佳阵容。',
      enabled: true,
      sortOrder: 6200
    }
  });

  for (const result of UEFA_TEAM_OF_THE_YEAR_GERRARD_RESULTS) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: UEFA_TEAM_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.editionRemark
      },
      update: {
        year: result.year,
        externalUrl: UEFA_TEAM_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.editionRemark
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: null,
        placement: result.placement,
        externalUrl: UEFA_TEAM_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: UEFA_TEAM_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${UEFA_TEAM_OF_THE_YEAR_AWARD_CODE}: ${UEFA_TEAM_OF_THE_YEAR_GERRARD_RESULTS.length} ${playerLabel} recipients.`
  );
}

async function seedEnglishLeagueAwards(
  playerId: string,
  playerLabel: string,
  competitionId: string
) {
  const seeds: readonly EnglishLeagueAwardDefinition[] = [
    {
      code: PFA_PLAYERS_PLAYER_OF_THE_YEAR_AWARD_CODE,
      name: 'PFA球员票选年度最佳球员',
      englishName: "PFA Players' Player of the Year",
      shortName: 'PFA年度最佳球员',
      externalUrl: PFA_PLAYERS_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      category: '国联一级综合奖',
      level: '一级',
      description: '由英格兰职业球员工会会员球员互投产生的赛季最佳球员奖。',
      sortOrder: 7120,
      results: PFA_PLAYERS_PLAYER_OF_THE_YEAR_GERRARD_RESULTS
    },
    {
      code: PFA_YOUNG_PLAYER_OF_THE_YEAR_AWARD_CODE,
      name: 'PFA年度最佳年轻球员',
      englishName: 'PFA Young Player of the Year',
      shortName: 'PFA最佳年轻球员',
      externalUrl: PFA_YOUNG_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      category: '国联三级补充奖',
      level: '三级',
      description: '由英格兰职业球员工会评选的赛季最佳年轻球员奖。',
      sortOrder: 7320,
      results: PFA_YOUNG_PLAYER_OF_THE_YEAR_GERRARD_RESULTS
    },
    {
      code: PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_AWARD_CODE,
      name: 'PFA英超年度最佳阵容',
      englishName: 'PFA Premier League Team of the Year',
      shortName: 'PFA英超最佳阵容',
      externalUrl: PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_EXTERNAL_URL,
      category: '国联二级阵容奖',
      level: '二级',
      description: '由英格兰职业球员工会评选的英格兰顶级联赛赛季最佳阵容。',
      sortOrder: 7220,
      results: PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_GERRARD_RESULTS
    },
    {
      code: ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_AWARD_CODE,
      name: '英格兰足球超级联赛助攻王',
      englishName: 'Premier League Assists Leader',
      shortName: '英超助攻王',
      externalUrl: ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_EXTERNAL_URL,
      category: '国联二级专项奖',
      level: '二级',
      description:
        '英格兰足球超级联赛赛季助攻榜第一；2017-18赛季以前按统计榜首记录，不等同于后来设立的赛季最佳组织者奖。',
      sortOrder: 7310,
      results: ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_GERRARD_RESULTS
    },
    {
      code: FWA_FOOTBALLER_OF_THE_YEAR_AWARD_CODE,
      name: '英格兰足球记者协会年度足球先生',
      englishName: 'FWA Footballer of the Year',
      shortName: 'FWA年度足球先生',
      externalUrl: FWA_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
      category: '国联一级综合奖',
      level: '一级',
      description: '由英格兰足球记者协会会员投票产生、评价英格兰赛季表现的年度足球先生奖。',
      sortOrder: 7130,
      results: FWA_FOOTBALLER_OF_THE_YEAR_GERRARD_RESULTS
    },
    {
      code: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_AWARD_CODE,
      name: '英格兰足球超级联赛月度最佳球员',
      englishName: 'Premier League Player of the Month',
      shortName: '英超月度最佳球员',
      externalUrl: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_EXTERNAL_URL,
      category: '国联月度奖',
      level: '三级',
      description: '英格兰足球超级联赛官方评选的月度最佳球员；同一赛季多次获奖只计一次基础分。',
      sortOrder: 7410,
      results: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_GERRARD_RESULTS
    }
  ];

  await seedEnglishLeagueAwardDefinitions(playerId, playerLabel, competitionId, seeds);
}

async function seedLampardEnglishLeagueAwards(
  playerId: string,
  playerLabel: string,
  competitionId: string
) {
  const seeds: readonly EnglishLeagueAwardDefinition[] = [
    {
      code: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_SEASON_AWARD_CODE,
      name: '英格兰足球超级联赛赛季最佳球员',
      englishName: 'Premier League Player of the Season',
      shortName: '英超赛季最佳球员',
      externalUrl: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_SEASON_EXTERNAL_URL,
      category: '国联一级综合奖',
      level: '一级',
      description: '由英格兰足球超级联赛官方评选的赛季最佳球员奖。',
      sortOrder: 7110,
      results: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_SEASON_LAMPARD_RESULTS
    },
    {
      code: PFA_PLAYERS_PLAYER_OF_THE_YEAR_AWARD_CODE,
      name: 'PFA球员票选年度最佳球员',
      englishName: "PFA Players' Player of the Year",
      shortName: 'PFA年度最佳球员',
      externalUrl: PFA_PLAYERS_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      category: '国联一级综合奖',
      level: '一级',
      description: '由英格兰职业球员工会会员球员互投产生的赛季最佳球员奖。',
      sortOrder: 7120,
      results: PFA_PLAYERS_PLAYER_OF_THE_YEAR_LAMPARD_RESULTS
    },
    {
      code: FWA_FOOTBALLER_OF_THE_YEAR_AWARD_CODE,
      name: '英格兰足球记者协会年度足球先生',
      englishName: 'FWA Footballer of the Year',
      shortName: 'FWA年度足球先生',
      externalUrl: FWA_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
      category: '国联一级综合奖',
      level: '一级',
      description: '由英格兰足球记者协会会员投票产生、评价英格兰赛季表现的年度足球先生奖。',
      sortOrder: 7130,
      results: FWA_FOOTBALLER_OF_THE_YEAR_LAMPARD_RESULTS
    },
    {
      code: PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_AWARD_CODE,
      name: 'PFA英超年度最佳阵容',
      englishName: 'PFA Premier League Team of the Year',
      shortName: 'PFA英超最佳阵容',
      externalUrl: PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_EXTERNAL_URL,
      category: '国联二级阵容奖',
      level: '二级',
      description: '由英格兰职业球员工会评选的英格兰顶级联赛赛季最佳阵容。',
      sortOrder: 7220,
      results: PFA_PREMIER_LEAGUE_TEAM_OF_THE_YEAR_LAMPARD_RESULTS
    },
    {
      code: ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_AWARD_CODE,
      name: '英格兰足球超级联赛助攻王',
      englishName: 'Premier League Assists Leader',
      shortName: '英超助攻王',
      externalUrl: ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_EXTERNAL_URL,
      category: '国联二级专项奖',
      level: '二级',
      description:
        '英格兰足球超级联赛赛季助攻榜第一；2017-18赛季以前按统计榜首记录，不等同于后来设立的赛季最佳组织者奖。',
      sortOrder: 7310,
      results: ENGLAND_PREMIER_LEAGUE_ASSISTS_LEADER_LAMPARD_RESULTS
    },
    {
      code: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_AWARD_CODE,
      name: '英格兰足球超级联赛月度最佳球员',
      englishName: 'Premier League Player of the Month',
      shortName: '英超月度最佳球员',
      externalUrl: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_EXTERNAL_URL,
      category: '国联月度奖',
      level: '三级',
      description: '英格兰足球超级联赛官方评选的月度最佳球员；同一赛季多次获奖只计一次基础分。',
      sortOrder: 7410,
      results: ENGLAND_PREMIER_LEAGUE_PLAYER_OF_THE_MONTH_LAMPARD_RESULTS
    }
  ];

  await seedEnglishLeagueAwardDefinitions(playerId, playerLabel, competitionId, seeds);
}

async function seedLampardMlsPlayerOfTheMonth(
  playerId: string,
  playerLabel: string,
  competitionId: string
) {
  const seeds: readonly EnglishLeagueAwardDefinition[] = [
    {
      code: MLS_PLAYER_OF_THE_MONTH_AWARD_CODE,
      name: '美国职业足球大联盟月度最佳球员',
      englishName: 'MLS Player of the Month',
      shortName: 'MLS月度最佳球员',
      externalUrl: MLS_PLAYER_OF_THE_MONTH_EXTERNAL_URL,
      category: '国联月度奖',
      level: '三级',
      description: '美国职业足球大联盟官方评选的月度最佳球员；同一赛季多次获奖只计一次基础分。',
      sortOrder: 7420,
      results: MLS_PLAYER_OF_THE_MONTH_LAMPARD_RESULTS
    }
  ];

  await seedEnglishLeagueAwardDefinitions(playerId, playerLabel, competitionId, seeds);
}

async function removeLampardPfaFansPlayerOfTheYear(playerId: string, playerLabel: string) {
  const award = await prisma.award.findUnique({
    where: { code: PFA_FANS_PLAYER_OF_THE_YEAR_AWARD_CODE },
    select: { id: true }
  });

  if (!award) {
    return;
  }

  const removed = await prisma.awardRecipient.deleteMany({
    where: {
      targetType: AwardTargetType.PLAYER,
      playerId,
      edition: { awardId: award.id }
    }
  });
  const remainingRecipients = await prisma.awardRecipient.count({
    where: { edition: { awardId: award.id } }
  });

  if (remainingRecipients === 0) {
    await prisma.award.delete({ where: { id: award.id } });
  }

  console.log(
    `Removed ${PFA_FANS_PLAYER_OF_THE_YEAR_AWARD_CODE}: ${removed.count} ${playerLabel} recipient; ` +
      `award ${remainingRecipients === 0 ? 'deleted because it became empty' : 'kept for other recipients'}.`
  );
}

async function seedEnglishLeagueAwardDefinitions(
  playerId: string,
  playerLabel: string,
  competitionId: string,
  seeds: readonly EnglishLeagueAwardDefinition[]
) {
  for (const seed of seeds) {
    const award = await prisma.award.upsert({
      where: { code: seed.code },
      create: {
        code: seed.code,
        name: seed.name,
        englishName: seed.englishName,
        shortName: seed.shortName,
        externalUrl: seed.externalUrl,
        targetType: AwardTargetType.PLAYER,
        scopeType: AwardScopeType.LEAGUE,
        category: seed.category,
        level: seed.level,
        description: seed.description,
        competitionId,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-15T00:00:00.000Z'),
        dataRemark: '仅按当前球员录入节奏补入已确认记录，未补完整历年获奖者。',
        enabled: true,
        sortOrder: seed.sortOrder
      },
      update: {
        name: seed.name,
        englishName: seed.englishName,
        shortName: seed.shortName,
        externalUrl: seed.externalUrl,
        targetType: AwardTargetType.PLAYER,
        scopeType: AwardScopeType.LEAGUE,
        category: seed.category,
        level: seed.level,
        description: seed.description,
        competitionId,
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-15T00:00:00.000Z'),
        dataRemark: '仅按当前球员录入节奏补入已确认记录，未补完整历年获奖者。',
        enabled: true,
        sortOrder: seed.sortOrder
      }
    });

    if (seed.category === '国联月度奖') {
      const expectedEditionNames = new Set(
        seed.results.map((result) => result.awardEditionName ?? result.season)
      );
      const staleRecipients = await prisma.awardRecipient.findMany({
        where: {
          targetType: AwardTargetType.PLAYER,
          playerId,
          edition: { awardId: award.id }
        },
        select: {
          id: true,
          editionId: true,
          edition: { select: { name: true } }
        }
      });
      const staleRecipientIds = staleRecipients
        .filter((recipient) => !expectedEditionNames.has(recipient.edition.name))
        .map((recipient) => recipient.id);
      const staleEditionIds = [
        ...new Set(
          staleRecipients
            .filter((recipient) => staleRecipientIds.includes(recipient.id))
            .map((recipient) => recipient.editionId)
        )
      ];

      if (staleRecipientIds.length) {
        await prisma.awardRecipient.deleteMany({ where: { id: { in: staleRecipientIds } } });
        await prisma.awardEdition.deleteMany({
          where: {
            id: { in: staleEditionIds },
            recipients: { none: {} }
          }
        });
      }
    }

    for (const result of seed.results) {
      const resultExternalUrl = result.externalUrl ?? seed.externalUrl;
      const competitionEdition = await findCompetitionEdition(
        competitionId,
        result.competitionEditionName ?? result.season
      );
      const awardEditionName = result.awardEditionName ?? result.season;
      const edition = await prisma.awardEdition.upsert({
        where: {
          awardId_name: {
            awardId: award.id,
            name: awardEditionName
          }
        },
        create: {
          awardId: award.id,
          competitionEditionId: competitionEdition.id,
          name: awardEditionName,
          season: result.season,
          year: result.year,
          month: result.month,
          externalUrl: resultExternalUrl
        },
        update: {
          competitionEditionId: competitionEdition.id,
          season: result.season,
          year: result.year,
          month: result.month ?? null,
          externalUrl: resultExternalUrl
        }
      });

      await prisma.awardRecipient.upsert({
        where: {
          editionId_targetType_playerId: {
            editionId: edition.id,
            targetType: AwardTargetType.PLAYER,
            playerId
          }
        },
        create: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId,
          rank: result.rank,
          placement: result.placement,
          externalUrl: resultExternalUrl,
          remark: result.remark
        },
        update: {
          rank: result.rank ?? null,
          placement: result.placement,
          externalUrl: resultExternalUrl,
          remark: result.remark
        }
      });
    }

    console.log(`Seeded ${seed.code}: ${seed.results.length} ${playerLabel} recipients.`);
  }
}

async function seedUefaEuroTeamOfTheTournament(
  uefaId: string,
  playerId: string,
  playerLabel: string,
  competitionId: string,
  results: readonly AnnualSelectionAwardSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_AWARD_CODE },
    create: {
      code: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_AWARD_CODE,
      name: '欧洲杯赛事最佳阵容',
      englishName: 'UEFA European Championship Team of the Tournament',
      shortName: '欧洲杯最佳阵容',
      externalUrl: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯二级阵容奖',
      level: '二级',
      description: '欧足联欧洲足球锦标赛官方赛事最佳阵容，按入选记录计分，不分名次。',
      competitionId,
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入已确认记录，未补完整历届阵容。',
      enabled: true,
      sortOrder: 3200
    },
    update: {
      name: '欧洲杯赛事最佳阵容',
      englishName: 'UEFA European Championship Team of the Tournament',
      shortName: '欧洲杯最佳阵容',
      externalUrl: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯二级阵容奖',
      level: '二级',
      description: '欧足联欧洲足球锦标赛官方赛事最佳阵容，按入选记录计分，不分名次。',
      competitionId,
      confederationId: uefaId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入已确认记录，未补完整历届阵容。',
      enabled: true,
      sortOrder: 3200
    }
  });
  for (const result of results) {
    const editionName = `${result.year}年`;
    const competitionEdition = await findCompetitionEdition(competitionId, editionName);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: editionName
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: editionName,
        year: result.year,
        externalUrl: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_EXTERNAL_URL,
        remark: result.editionRemark
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_EXTERNAL_URL,
        remark: result.editionRemark
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: null,
        placement: result.placement,
        externalUrl: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: UEFA_EURO_TEAM_OF_THE_TOURNAMENT_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${UEFA_EURO_TEAM_OF_THE_TOURNAMENT_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedFifaClubWorldCupGoldenBall(
  playerId: string,
  playerLabel: string,
  competitionId: string
) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_AWARD_CODE },
    create: {
      code: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_AWARD_CODE,
      name: '国际足联俱乐部世界杯金球奖',
      englishName: 'FIFA Club World Cup Golden Ball',
      shortName: '世俱杯金球奖',
      externalUrl: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '俱乐部国际赛事一级综合奖',
      level: '一级',
      description: '国际足联俱乐部世界杯最佳球员奖项，统一承接金球奖、银球奖和铜球奖。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入杰拉德 2005 年银球奖记录，未补完整历届获奖者。',
      enabled: true,
      sortOrder: 5100
    },
    update: {
      name: '国际足联俱乐部世界杯金球奖',
      englishName: 'FIFA Club World Cup Golden Ball',
      shortName: '世俱杯金球奖',
      externalUrl: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '俱乐部国际赛事一级综合奖',
      level: '一级',
      description: '国际足联俱乐部世界杯最佳球员奖项，统一承接金球奖、银球奖和铜球奖。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入杰拉德 2005 年银球奖记录，未补完整历届获奖者。',
      enabled: true,
      sortOrder: 5100
    }
  });
  const competitionEdition = await findCompetitionEdition(competitionId, '2005年');
  const edition = await prisma.awardEdition.upsert({
    where: {
      awardId_name: {
        awardId: award.id,
        name: '2005年'
      }
    },
    create: {
      awardId: award.id,
      competitionEditionId: competitionEdition.id,
      name: '2005年',
      year: 2005,
      externalUrl: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL
    },
    update: {
      competitionEditionId: competitionEdition.id,
      year: 2005,
      externalUrl: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL
    }
  });

  await prisma.awardRecipient.upsert({
    where: {
      editionId_targetType_playerId: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId
      }
    },
    create: {
      editionId: edition.id,
      targetType: AwardTargetType.PLAYER,
      playerId,
      rank: 2,
      placement: '银球奖',
      externalUrl: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      remark: '杰拉德代表利物浦参加 2005 年国际足联俱乐部世界锦标赛，获得赛事银球奖。'
    },
    update: {
      rank: 2,
      placement: '银球奖',
      externalUrl: FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      remark: '杰拉德代表利物浦参加 2005 年国际足联俱乐部世界锦标赛，获得赛事银球奖。'
    }
  });

  console.log(`Seeded ${FIFA_CLUB_WORLD_CUP_GOLDEN_BALL_AWARD_CODE}: 1 ${playerLabel} recipient.`);
}

async function seedEnglandPlayerOfTheYear(
  englandId: string,
  playerId: string,
  playerLabel: string,
  results: readonly RankedAwardSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: ENGLAND_PLAYER_OF_THE_YEAR_AWARD_CODE },
    create: {
      code: ENGLAND_PLAYER_OF_THE_YEAR_AWARD_CODE,
      name: '英格兰年度最佳球员',
      englishName: "England Men's Player of the Year",
      shortName: '英格兰年度最佳球员',
      externalUrl: ENGLAND_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.COUNTRY,
      category: '国家一级综合奖',
      level: '一级',
      description: '英足总组织、由英格兰球迷投票评选的英格兰男子代表队年度最佳球员奖。',
      countryId: englandId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入已确认记录，未补完整历届获奖者。',
      enabled: true,
      sortOrder: 8100
    },
    update: {
      name: '英格兰年度最佳球员',
      englishName: "England Men's Player of the Year",
      shortName: '英格兰年度最佳球员',
      externalUrl: ENGLAND_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.COUNTRY,
      category: '国家一级综合奖',
      level: '一级',
      description: '英足总组织、由英格兰球迷投票评选的英格兰男子代表队年度最佳球员奖。',
      countryId: englandId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-09-09T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入已确认记录，未补完整历届获奖者。',
      enabled: true,
      sortOrder: 8100
    }
  });

  for (const result of results) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: ENGLAND_PLAYER_OF_THE_YEAR_EXTERNAL_URL
      },
      update: {
        year: result.year,
        externalUrl: ENGLAND_PLAYER_OF_THE_YEAR_EXTERNAL_URL
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: ENGLAND_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: ENGLAND_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${ENGLAND_PLAYER_OF_THE_YEAR_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedArgentineFootballerOfTheYear(
  argentinaId: string,
  playerId: string,
  playerLabel: string
) {
  const award = await prisma.award.upsert({
    where: { code: ARGENTINE_FOOTBALLER_OF_THE_YEAR_AWARD_CODE },
    create: {
      code: ARGENTINE_FOOTBALLER_OF_THE_YEAR_AWARD_CODE,
      name: '阿根廷足球先生',
      englishName: 'Argentine Footballer of the Year',
      shortName: '阿根廷足球先生',
      externalUrl: ARGENTINE_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.COUNTRY,
      category: '国家一级综合奖',
      level: '一级',
      description:
        '阿根廷体育记者协会 Olimpia de Plata 足球分项，常作为阿根廷年度足球先生口径；非阿根廷足协官方奖。',
      countryId: argentinaId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7100
    },
    update: {
      name: '阿根廷足球先生',
      englishName: 'Argentine Footballer of the Year',
      shortName: '阿根廷足球先生',
      externalUrl: ARGENTINE_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.COUNTRY,
      category: '国家一级综合奖',
      level: '一级',
      description:
        '阿根廷体育记者协会 Olimpia de Plata 足球分项，常作为阿根廷年度足球先生口径；非阿根廷足协官方奖。',
      countryId: argentinaId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7100
    }
  });

  for (const result of ARGENTINE_FOOTBALLER_OF_THE_YEAR_MARADONA_RESULTS) {
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: ARGENTINE_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL
      },
      update: {
        year: result.year,
        externalUrl: ARGENTINE_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: ARGENTINE_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: ARGENTINE_FOOTBALLER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${ARGENTINE_FOOTBALLER_OF_THE_YEAR_AWARD_CODE}: ${ARGENTINE_FOOTBALLER_OF_THE_YEAR_MARADONA_RESULTS.length} ${playerLabel} recipients.`
  );
}

async function seedFifaWorldCupGoldenBall(
  playerId: string,
  playerLabel: string,
  competitionId: string,
  results: readonly FIFAWorldCupGoldenBallSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE },
    create: {
      code: FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE,
      name: '国际足联世界杯金球奖',
      externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯一级综合奖',
      level: '一级',
      description: '国际足联世界杯最佳球员奖项，统一承接金球奖、银球奖、铜球奖。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2100
    },
    update: {
      name: '国际足联世界杯金球奖',
      externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯一级综合奖',
      level: '一级',
      description: '国际足联世界杯最佳球员奖项，统一承接金球奖、银球奖、铜球奖。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2100
    }
  });

  for (const result of results) {
    const competitionEdition = await findCompetitionEdition(competitionId, `${result.year}年`);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: result.editionRemark ?? null
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: result.editionRemark ?? null
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BALL_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${FIFA_WORLD_CUP_GOLDEN_BALL_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedFifaWorldCupGoldenBoot(
  playerId: string,
  playerLabel: string,
  competitionId: string,
  results: readonly FIFAWorldCupGoldenBootSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_WORLD_CUP_GOLDEN_BOOT_AWARD_CODE },
    create: {
      code: FIFA_WORLD_CUP_GOLDEN_BOOT_AWARD_CODE,
      name: '国际足联世界杯金靴奖',
      externalUrl: FIFA_WORLD_CUP_GOLDEN_BOOT_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯二级专项奖',
      level: '二级',
      description: '国际足联世界杯最佳射手奖项，统一承接金靴奖、银靴奖、铜靴奖。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2300
    },
    update: {
      name: '国际足联世界杯金靴奖',
      externalUrl: FIFA_WORLD_CUP_GOLDEN_BOOT_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯二级专项奖',
      level: '二级',
      description: '国际足联世界杯最佳射手奖项，统一承接金靴奖、银靴奖、铜靴奖。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2300
    }
  });

  for (const result of results) {
    const competitionEdition = await findCompetitionEdition(competitionId, `${result.year}年`);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BOOT_EXTERNAL_URL,
        remark: '世界杯最佳射手奖项。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BOOT_EXTERNAL_URL,
        remark: '世界杯最佳射手奖项。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BOOT_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_GOLDEN_BOOT_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${FIFA_WORLD_CUP_GOLDEN_BOOT_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedFifaWorldCupAllStarTeam(
  playerId: string,
  playerLabel: string,
  competitionId: string,
  results: readonly FIFAWorldCupAllStarTeamSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_WORLD_CUP_ALL_STAR_TEAM_AWARD_CODE },
    create: {
      code: FIFA_WORLD_CUP_ALL_STAR_TEAM_AWARD_CODE,
      name: '国际足联世界杯最佳阵容',
      englishName: 'FIFA World Cup All-Star Team',
      shortName: '世界杯最佳阵容',
      externalUrl: FIFA_WORLD_CUP_ALL_STAR_TEAM_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯二级阵容奖',
      level: '二级',
      description: '国际足联世界杯最佳阵容 / 全明星阵容，按入选记录计分，不分名次。',
      dataComplete: false,
      dataUpdatedAt: FIFA_WORLD_CUP_ALL_STAR_TEAM_DATA_UPDATED_AT,
      dataRemark: '仅录入当前确认的贝利、马拉多纳、巴雷西记录，未补满各届完整 11 人最佳阵容。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2200
    },
    update: {
      name: '国际足联世界杯最佳阵容',
      englishName: 'FIFA World Cup All-Star Team',
      shortName: '世界杯最佳阵容',
      externalUrl: FIFA_WORLD_CUP_ALL_STAR_TEAM_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯二级阵容奖',
      level: '二级',
      description: '国际足联世界杯最佳阵容 / 全明星阵容，按入选记录计分，不分名次。',
      dataComplete: false,
      dataUpdatedAt: FIFA_WORLD_CUP_ALL_STAR_TEAM_DATA_UPDATED_AT,
      dataRemark: '仅录入当前确认的贝利、马拉多纳、巴雷西记录，未补满各届完整 11 人最佳阵容。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2200
    }
  });

  for (const result of results) {
    const competitionEdition = await findCompetitionEdition(competitionId, `${result.year}年`);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '国际足联世界杯最佳阵容。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '国际足联世界杯最佳阵容。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${FIFA_WORLD_CUP_ALL_STAR_TEAM_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedFifaWorldCupBestYoungPlayer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE },
    create: {
      code: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE,
      name: '国际足联世界杯最佳年轻球员',
      externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯三级补充奖',
      level: '三级',
      description:
        '国际足联世界杯最佳年轻球员奖。正式奖项从 2006 年起稳定颁发，早期届次按历史追认口径备注。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2500
    },
    update: {
      name: '国际足联世界杯最佳年轻球员',
      externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.WORLD,
      category: '世界杯三级补充奖',
      level: '三级',
      description:
        '国际足联世界杯最佳年轻球员奖。正式奖项从 2006 年起稳定颁发，早期届次按历史追认口径备注。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 2500
    }
  });

  for (const result of FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_PELE_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, `${result.year}年`);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: '历史追认口径，非当届正式颁发。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: '历史追认口径，非当届正式颁发。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_AWARD_CODE}: ${FIFA_WORLD_CUP_BEST_YOUNG_PLAYER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedCopaAmericaBestPlayer(
  conmebolId: string,
  competitionId: string,
  peleId: string
) {
  const award = await prisma.award.upsert({
    where: { code: COPA_AMERICA_BEST_PLAYER_AWARD_CODE },
    create: {
      code: COPA_AMERICA_BEST_PLAYER_AWARD_CODE,
      name: '南美足联美洲杯最佳球员',
      externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯一级综合奖',
      level: '一级',
      description:
        '美洲杯最佳球员奖。现代届次以南美足联官方奖项为准，早期南美锦标赛届次按历史整理口径录入并备注。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3100
    },
    update: {
      name: '南美足联美洲杯最佳球员',
      externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯一级综合奖',
      level: '一级',
      description:
        '美洲杯最佳球员奖。现代届次以南美足联官方奖项为准，早期南美锦标赛届次按历史整理口径录入并备注。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3100
    }
  });

  for (const result of COPA_AMERICA_BEST_PLAYER_PELE_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, result.editionName);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.editionName
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.editionName,
        year: result.year,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: '早期南美锦标赛历史整理口径。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: '早期南美锦标赛历史整理口径。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        placement: result.placement,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: COPA_AMERICA_BEST_PLAYER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${COPA_AMERICA_BEST_PLAYER_AWARD_CODE}: ${COPA_AMERICA_BEST_PLAYER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedCopaAmericaTopScorer(conmebolId: string, competitionId: string, peleId: string) {
  const award = await prisma.award.upsert({
    where: { code: COPA_AMERICA_TOP_SCORER_AWARD_CODE },
    create: {
      code: COPA_AMERICA_TOP_SCORER_AWARD_CODE,
      name: '南美足联美洲杯最佳射手',
      externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯二级专项奖',
      level: '二级',
      description:
        '美洲杯赛事最佳射手奖，统一承接南美锦标赛和美洲杯 Golden Boot / Top Scorer 口径；只录明确获奖或最佳射手记录。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3300
    },
    update: {
      name: '南美足联美洲杯最佳射手',
      externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CONFEDERATION,
      category: '洲际杯二级专项奖',
      level: '二级',
      description:
        '美洲杯赛事最佳射手奖，统一承接南美锦标赛和美洲杯 Golden Boot / Top Scorer 口径；只录明确获奖或最佳射手记录。',
      competitionId,
      confederationId: conmebolId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 3300
    }
  });

  for (const result of COPA_AMERICA_TOP_SCORER_PELE_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, result.editionName);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.editionName
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.editionName,
        year: result.year,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: '早期南美锦标赛最佳射手口径。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: '早期南美锦标赛最佳射手口径。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: COPA_AMERICA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${COPA_AMERICA_TOP_SCORER_AWARD_CODE}: ${COPA_AMERICA_TOP_SCORER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedBrazilSerieATopScorer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: BRAZIL_SERIE_A_TOP_SCORER_AWARD_CODE },
    create: {
      code: BRAZIL_SERIE_A_TOP_SCORER_AWARD_CODE,
      name: '巴西甲级联赛最佳射手',
      externalUrl: BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '巴西全国冠军统一口径赛季最佳射手，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7300
    },
    update: {
      name: '巴西甲级联赛最佳射手',
      externalUrl: BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '巴西全国冠军统一口径赛季最佳射手，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7300
    }
  });

  for (const result of BRAZIL_SERIE_A_TOP_SCORER_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: '为绑定巴西甲级联赛个人奖项创建或补齐；球队 standings 由赛事补录脚本维护。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: `巴西甲级联赛最佳射手，${result.goals} 球。`
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: `巴西甲级联赛最佳射手，${result.goals} 球。`
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: BRAZIL_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${BRAZIL_SERIE_A_TOP_SCORER_AWARD_CODE}: ${BRAZIL_SERIE_A_TOP_SCORER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedItalySerieATopScorer(
  playerId: string,
  playerLabel: string,
  competitionId: string
) {
  const award = await prisma.award.upsert({
    where: { code: ITALY_SERIE_A_TOP_SCORER_AWARD_CODE },
    create: {
      code: ITALY_SERIE_A_TOP_SCORER_AWARD_CODE,
      name: '意大利足球甲级联赛最佳射手',
      englishName: 'Serie A Top Scorer',
      shortName: '意甲最佳射手',
      externalUrl: ITALY_SERIE_A_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '意大利足球甲级联赛赛季最佳射手，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7315
    },
    update: {
      name: '意大利足球甲级联赛最佳射手',
      englishName: 'Serie A Top Scorer',
      shortName: '意甲最佳射手',
      externalUrl: ITALY_SERIE_A_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '意大利足球甲级联赛赛季最佳射手，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7315
    }
  });

  for (const result of ITALY_SERIE_A_TOP_SCORER_MARADONA_RESULTS) {
    const competitionEdition = await findCompetitionEdition(competitionId, result.season);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.season
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.season,
        season: result.season,
        year: result.year,
        externalUrl: ITALY_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: `意大利足球甲级联赛最佳射手，${result.goals} 球。`
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: result.season,
        year: result.year,
        externalUrl: ITALY_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: `意大利足球甲级联赛最佳射手，${result.goals} 球。`
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: 1,
        placement: result.placement,
        externalUrl: ITALY_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: 1,
        placement: result.placement,
        externalUrl: ITALY_SERIE_A_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${ITALY_SERIE_A_TOP_SCORER_AWARD_CODE}: ${ITALY_SERIE_A_TOP_SCORER_MARADONA_RESULTS.length} ${playerLabel} recipients.`
  );
}

async function seedItalySerieAPlayerOfTheYear(
  playerId: string,
  playerLabel: string,
  competitionId: string,
  results: readonly LeaguePlayerOfTheYearSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_AWARD_CODE },
    create: {
      code: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_AWARD_CODE,
      name: '意大利足球甲级联赛年度最佳球员',
      englishName: "Guerin d'Oro",
      shortName: '意甲年度最佳球员',
      externalUrl: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联一级综合奖',
      level: '一级',
      description:
        '《Guerin Sportivo》基于意甲赛季平均评分评出的赛季最佳球员，系统按国内顶级联赛一级综合奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-08-26T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入马拉多纳、巴雷西确认记录，未补完整历年获奖者。',
      enabled: true,
      sortOrder: 7115
    },
    update: {
      name: '意大利足球甲级联赛年度最佳球员',
      englishName: "Guerin d'Oro",
      shortName: '意甲年度最佳球员',
      externalUrl: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联一级综合奖',
      level: '一级',
      description:
        '《Guerin Sportivo》基于意甲赛季平均评分评出的赛季最佳球员，系统按国内顶级联赛一级综合奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      dataComplete: false,
      dataUpdatedAt: new Date('2026-08-26T00:00:00.000Z'),
      dataRemark: '仅按当前球员录入节奏补入马拉多纳、巴雷西确认记录，未补完整历年获奖者。',
      enabled: true,
      sortOrder: 7115
    }
  });

  for (const result of results) {
    const competitionEdition = await findCompetitionEdition(competitionId, result.season);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.season
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.season,
        season: result.season,
        year: result.year,
        externalUrl: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
        remark: "意大利足球甲级联赛 Guerin d'Oro 年度最佳球员。"
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: result.season,
        year: result.year,
        externalUrl: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
        remark: "意大利足球甲级联赛 Guerin d'Oro 年度最佳球员。"
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: 1,
        placement: result.placement,
        externalUrl: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: 1,
        placement: result.placement,
        externalUrl: ITALY_SERIE_A_PLAYER_OF_THE_YEAR_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${ITALY_SERIE_A_PLAYER_OF_THE_YEAR_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedItalyCoppaItaliaTopScorer(
  playerId: string,
  playerLabel: string,
  competitionId: string,
  results: readonly ItalianTopScorerSeed[]
) {
  const award = await prisma.award.upsert({
    where: { code: ITALY_COPPA_ITALIA_TOP_SCORER_AWARD_CODE },
    create: {
      code: ITALY_COPPA_ITALIA_TOP_SCORER_AWARD_CODE,
      name: '意大利杯最佳射手',
      englishName: 'Coppa Italia Top Scorer',
      shortName: '意杯最佳射手',
      externalUrl: ITALY_COPPA_ITALIA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '国杯一级奖',
      level: '二级',
      description: '意大利杯赛季最佳射手，系统按国内杯赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7410
    },
    update: {
      name: '意大利杯最佳射手',
      englishName: 'Coppa Italia Top Scorer',
      shortName: '意杯最佳射手',
      externalUrl: ITALY_COPPA_ITALIA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '国杯一级奖',
      level: '二级',
      description: '意大利杯赛季最佳射手，系统按国内杯赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7410
    }
  });

  for (const result of results) {
    const competitionEdition = await findCompetitionEdition(competitionId, result.season);
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.season
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.season,
        season: result.season,
        year: result.year,
        externalUrl: ITALY_COPPA_ITALIA_TOP_SCORER_EXTERNAL_URL,
        remark: `意大利杯最佳射手，${result.goals} 球。`
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: result.season,
        year: result.year,
        externalUrl: ITALY_COPPA_ITALIA_TOP_SCORER_EXTERNAL_URL,
        remark: `意大利杯最佳射手，${result.goals} 球。`
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: 1,
        placement: result.placement,
        externalUrl: ITALY_COPPA_ITALIA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: 1,
        placement: result.placement,
        externalUrl: ITALY_COPPA_ITALIA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${ITALY_COPPA_ITALIA_TOP_SCORER_AWARD_CODE}: ${results.length} ${playerLabel} recipients.`
  );
}

async function seedArgentinePrimeraDivisionTopScorer(
  playerId: string,
  playerLabel: string,
  competitionId: string
) {
  const award = await prisma.award.upsert({
    where: { code: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_AWARD_CODE },
    create: {
      code: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_AWARD_CODE,
      name: '阿根廷足球甲级联赛最佳射手',
      englishName: 'Argentine Primera Division Top Scorer',
      shortName: '阿甲最佳射手',
      externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '阿根廷足球甲级联赛赛季最佳射手，按阿甲多冠军届次口径录入并由赛事分摊规则折算。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7310
    },
    update: {
      name: '阿根廷足球甲级联赛最佳射手',
      englishName: 'Argentine Primera Division Top Scorer',
      shortName: '阿甲最佳射手',
      externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '阿根廷足球甲级联赛赛季最佳射手，按阿甲多冠军届次口径录入并由赛事分摊规则折算。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 7310
    }
  });

  for (const result of ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_MARADONA_RESULTS) {
    const seasonLabel = result.editionName.replace(/\s*\(([^)]+)\)/g, ' $1');
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: result.editionName
        }
      },
      create: {
        competitionId,
        name: result.editionName,
        season: seasonLabel,
        year: result.year,
        championGroupKey: String(result.year),
        championShare: 2,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
        remark: '为绑定阿甲个人奖项创建或补齐；届次名按库内标准名称保留。'
      },
      update: {
        season: seasonLabel,
        year: result.year,
        championGroupKey: String(result.year),
        championShare: 2,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
        remark: '为绑定阿甲个人奖项创建或补齐；届次名按库内标准名称保留。'
      }
    });
    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: result.editionName
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: result.editionName,
        year: result.year,
        externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
        remark: `阿根廷足球甲级联赛最佳射手，届次 ${result.editionName}。`
      },
      update: {
        competitionEditionId: competitionEdition.id,
        year: result.year,
        externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
        remark: `阿根廷足球甲级联赛最佳射手，届次 ${result.editionName}。`
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId,
        rank: 1,
        placement: result.placement,
        externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: 1,
        placement: result.placement,
        externalUrl: ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_AWARD_CODE}: ${ARGENTINE_PRIMERA_DIVISION_TOP_SCORER_MARADONA_RESULTS.length} ${playerLabel} recipients.`
  );
}

async function seedCampeonatoPaulistaTopScorer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: CAMPEONATO_PAULISTA_TOP_SCORER_AWARD_CODE },
    create: {
      code: CAMPEONATO_PAULISTA_TOP_SCORER_AWARD_CODE,
      name: '保利斯塔锦标赛最佳射手',
      externalUrl: CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '二级国联二级专项奖',
      level: '二级',
      description:
        '保利斯塔锦标赛赛季最佳射手；该赛事为巴西圣保罗州级顶级联赛，系统按二级国内联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 8020
    },
    update: {
      name: '保利斯塔锦标赛最佳射手',
      externalUrl: CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '二级国联二级专项奖',
      level: '二级',
      description:
        '保利斯塔锦标赛赛季最佳射手；该赛事为巴西圣保罗州级顶级联赛，系统按二级国内联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 8020
    }
  });

  for (const result of CAMPEONATO_PAULISTA_TOP_SCORER_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL,
        remark: '为绑定保利斯塔锦标赛个人奖项创建或补齐；球队 standings 由赛事补录脚本维护。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL,
        remark: `保利斯塔锦标赛最佳射手，${result.goalsText}。`
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL,
        remark: `保利斯塔锦标赛最佳射手，${result.goalsText}。`
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: CAMPEONATO_PAULISTA_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${CAMPEONATO_PAULISTA_TOP_SCORER_AWARD_CODE}: ${CAMPEONATO_PAULISTA_TOP_SCORER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedTorneioRioSaoPauloTopScorer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_AWARD_CODE },
    create: {
      code: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_AWARD_CODE,
      name: '里约-圣保罗锦标赛最佳射手',
      externalUrl: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '国杯一级奖',
      level: '一级',
      description:
        '里约-圣保罗锦标赛赛季最佳射手；该赛事为巴西历史跨州地区杯赛，赛事本体按俱乐部国内三级杯赛计分，个人奖项暂复用国内杯赛个人奖口径。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 9000
    },
    update: {
      name: '里约-圣保罗锦标赛最佳射手',
      externalUrl: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '国杯一级奖',
      level: '一级',
      description:
        '里约-圣保罗锦标赛赛季最佳射手；该赛事为巴西历史跨州地区杯赛，赛事本体按俱乐部国内三级杯赛计分，个人奖项暂复用国内杯赛个人奖口径。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 9000
    }
  });

  for (const result of TORNEIO_RIO_SAO_PAULO_TOP_SCORER_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
        externalUrl: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL,
        remark: '为绑定里约-圣保罗锦标赛个人奖项创建或补齐；球队 standings 由赛事补录脚本维护。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.FINAL_ONLY
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL,
        remark: `里约-圣保罗锦标赛最佳射手，${result.goals} 球。`
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL,
        remark: `里约-圣保罗锦标赛最佳射手，${result.goals} 球。`
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: TORNEIO_RIO_SAO_PAULO_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${TORNEIO_RIO_SAO_PAULO_TOP_SCORER_AWARD_CODE}: ${TORNEIO_RIO_SAO_PAULO_TOP_SCORER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedConmebolLibertadoresTopScorer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: CONMEBOL_LIBERTADORES_TOP_SCORER_AWARD_CODE },
    create: {
      code: CONMEBOL_LIBERTADORES_TOP_SCORER_AWARD_CODE,
      name: '南美解放者杯最佳射手',
      externalUrl: CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '洲联二级专项奖',
      level: '二级',
      description: '南美解放者杯赛季最佳射手，系统按俱乐部洲际赛事专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 6300
    },
    update: {
      name: '南美解放者杯最佳射手',
      externalUrl: CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '洲联二级专项奖',
      level: '二级',
      description: '南美解放者杯赛季最佳射手，系统按俱乐部洲际赛事专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.CURRENT,
      enabled: true,
      sortOrder: 6300
    }
  });

  for (const result of CONMEBOL_LIBERTADORES_TOP_SCORER_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
        externalUrl: CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL,
        remark: '为绑定南美解放者杯个人奖项创建或补齐；球队 standings 由赛事补录脚本维护。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.FINAL_ONLY
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL,
        remark: '南美解放者杯最佳射手；进球数资料存在 7 / 8 球差异。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL,
        remark: '南美解放者杯最佳射手；进球数资料存在 7 / 8 球差异。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: CONMEBOL_LIBERTADORES_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${CONMEBOL_LIBERTADORES_TOP_SCORER_AWARD_CODE}: ${CONMEBOL_LIBERTADORES_TOP_SCORER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedEuropeanSouthAmericanCupTopScorer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_AWARD_CODE },
    create: {
      code: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_AWARD_CODE,
      name: '欧洲/南美洲杯最佳射手',
      externalUrl: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '俱乐部国际赛事三级专项奖',
      level: '三级',
      description:
        '欧洲/南美洲杯赛季最佳射手；因赛事本体为俱乐部国际三级杯赛，系统按俱乐部国际赛事三级专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 5350
    },
    update: {
      name: '欧洲/南美洲杯最佳射手',
      externalUrl: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.CLUB,
      category: '俱乐部国际赛事三级专项奖',
      level: '三级',
      description:
        '欧洲/南美洲杯赛季最佳射手；因赛事本体为俱乐部国际三级杯赛，系统按俱乐部国际赛事三级专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 5350
    }
  });

  for (const result of EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
        externalUrl: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL,
        remark: '为绑定欧洲/南美洲杯个人奖项创建或补齐；球队 standings 由赛事补录脚本维护。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.FINAL_ONLY
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL,
        remark: `欧洲/南美洲杯${result.placement}，${result.goals} 球。`
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL,
        remark: `欧洲/南美洲杯${result.placement}，${result.goals} 球。`
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_AWARD_CODE}: ${EUROPEAN_SOUTH_AMERICAN_CUP_TOP_SCORER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedNaslMostValuablePlayer(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: NASL_MVP_AWARD_CODE },
    create: {
      code: NASL_MVP_AWARD_CODE,
      name: '北美足球联赛最有价值球员',
      externalUrl: NASL_MVP_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联一级综合奖',
      level: '一级',
      description:
        '旧北美足球联赛赛季最有价值球员奖，系统按国内顶级联赛赛季 MVP / 最佳球员口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7100
    },
    update: {
      name: '北美足球联赛最有价值球员',
      externalUrl: NASL_MVP_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联一级综合奖',
      level: '一级',
      description:
        '旧北美足球联赛赛季最有价值球员奖，系统按国内顶级联赛赛季 MVP / 最佳球员口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7100
    }
  });

  for (const result of NASL_MVP_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '旧 NASL 赛季 MVP。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: '旧 NASL 赛季 MVP。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: 1,
        placement: result.placement,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: 1,
        placement: result.placement,
        externalUrl: NASL_MVP_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(`Seeded ${NASL_MVP_AWARD_CODE}: ${NASL_MVP_PELE_RESULTS.length} Pele recipients.`);
}

async function seedNaslAllStarTeam(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: NASL_ALL_STAR_TEAM_AWARD_CODE },
    create: {
      code: NASL_ALL_STAR_TEAM_AWARD_CODE,
      name: '北美足球联赛全明星阵容',
      externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级阵容奖',
      level: '二级',
      description: '旧北美足球联赛赛季全明星阵容一队，系统按国内顶级联赛赛季最佳阵容口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7200
    },
    update: {
      name: '北美足球联赛全明星阵容',
      externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级阵容奖',
      level: '二级',
      description: '旧北美足球联赛赛季全明星阵容一队，系统按国内顶级联赛赛季最佳阵容口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7200
    }
  });

  for (const result of NASL_ALL_STAR_TEAM_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '旧 NASL 赛季全明星阵容一队。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: '旧 NASL 赛季全明星阵容一队。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        placement: result.placement,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: null,
        placement: result.placement,
        externalUrl: NASL_ALL_STAR_TEAM_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${NASL_ALL_STAR_TEAM_AWARD_CODE}: ${NASL_ALL_STAR_TEAM_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedNaslAssistsLeader(peleId: string, competitionId: string) {
  const award = await prisma.award.upsert({
    where: { code: NASL_ASSISTS_LEADER_AWARD_CODE },
    create: {
      code: NASL_ASSISTS_LEADER_AWARD_CODE,
      name: '北美足球联赛助攻王',
      externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '旧北美足球联赛赛季助攻榜第一，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7300
    },
    update: {
      name: '北美足球联赛助攻王',
      externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
      targetType: AwardTargetType.PLAYER,
      scopeType: AwardScopeType.LEAGUE,
      category: '国联二级专项奖',
      level: '二级',
      description: '旧北美足球联赛赛季助攻榜第一，系统按国内顶级联赛专项奖口径计入。',
      competitionId,
      lifecycleStatus: LifecycleStatus.DISCONTINUED,
      enabled: true,
      sortOrder: 7300
    }
  });

  for (const result of NASL_ASSISTS_LEADER_PELE_RESULTS) {
    const competitionEdition = await prisma.competitionEdition.upsert({
      where: {
        competitionId_name: {
          competitionId,
          name: `${result.year}年`
        }
      },
      create: {
        competitionId,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      },
      update: {
        season: String(result.year),
        year: result.year,
        standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '为绑定旧 NASL 赛季个人奖项创建；本届不补写球队 standings。'
      }
    });

    const edition = await prisma.awardEdition.upsert({
      where: {
        awardId_name: {
          awardId: award.id,
          name: `${result.year}年`
        }
      },
      create: {
        awardId: award.id,
        competitionEditionId: competitionEdition.id,
        name: `${result.year}年`,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '旧 NASL 赛季助攻王。'
      },
      update: {
        competitionEditionId: competitionEdition.id,
        season: String(result.year),
        year: result.year,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: '旧 NASL 赛季助攻王。'
      }
    });

    await prisma.awardRecipient.upsert({
      where: {
        editionId_targetType_playerId: {
          editionId: edition.id,
          targetType: AwardTargetType.PLAYER,
          playerId: peleId
        }
      },
      create: {
        editionId: edition.id,
        targetType: AwardTargetType.PLAYER,
        playerId: peleId,
        rank: result.rank,
        placement: result.placement,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: result.remark
      },
      update: {
        rank: result.rank,
        placement: result.placement,
        externalUrl: NASL_ASSISTS_LEADER_EXTERNAL_URL,
        remark: result.remark
      }
    });
  }

  console.log(
    `Seeded ${NASL_ASSISTS_LEADER_AWARD_CODE}: ${NASL_ASSISTS_LEADER_PELE_RESULTS.length} Pele recipients.`
  );
}

async function seedPlayerTeamHonors(
  playerId: string,
  playerLabel: string,
  results: PlayerTeamHonorSeed[]
) {
  let upsertedCount = 0;

  for (const seed of results) {
    const standing = await findCompetitionStanding(seed);
    const career = await findPlayerCareer(playerId, seed.careerTeamName);

    await prisma.playerTeamHonor.upsert({
      where: {
        playerId_standingId: {
          playerId,
          standingId: standing.id
        }
      },
      create: {
        playerId,
        standingId: standing.id,
        careerId: career.id,
        sourceType: PlayerTeamHonorSourceType.IMPORT,
        status: PlayerTeamHonorStatus.CONFIRMED,
        remark: seed.remark
      },
      update: {
        careerId: career.id,
        sourceType: PlayerTeamHonorSourceType.IMPORT,
        status: PlayerTeamHonorStatus.CONFIRMED,
        remark: seed.remark
      }
    });

    upsertedCount += 1;
  }

  console.log(`Seeded team honors: ${upsertedCount} upserted for ${playerLabel}.`);
}

async function seedPlayerAchievements(
  playerId: string,
  playerLabel: string,
  achievements: readonly PlayerAchievementSeed[]
) {
  let createdCount = 0;
  let skippedCount = 0;

  for (const achievement of achievements) {
    const existing = await prisma.playerHonor.findFirst({
      where: {
        playerId,
        name: achievement.name,
        season: achievement.season
      },
      select: { id: true, isScoring: true }
    });

    if (existing) {
      if (achievement.isScoring !== undefined && existing.isScoring !== achievement.isScoring) {
        await prisma.playerHonor.update({
          where: { id: existing.id },
          data: { isScoring: achievement.isScoring }
        });
      }
      skippedCount += 1;
      continue;
    }

    await prisma.playerHonor.create({
      data: {
        playerId,
        name: achievement.name,
        season: achievement.season,
        score: achievement.score,
        isScoring: achievement.isScoring ?? true,
        externalUrl: achievement.externalUrl,
        remark: achievement.remark,
        sortOrder: achievement.sortOrder
      }
    });
    createdCount += 1;
  }

  console.log(
    `Seeded player achievements: ${createdCount} created, ${skippedCount} skipped for ${playerLabel}.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

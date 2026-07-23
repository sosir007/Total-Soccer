import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const CAMPEONATO_PAULISTA_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CAMPEONATO_PAULISTA',
  name: '保利斯塔锦标赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeonato Paulista podium - RSSSF Brazil',
      url: 'https://www.rsssfbrasil.com/tablessz/sppodium.htm',
      remark: '用于核对 1902-2015 年保利斯塔锦标赛冠军、亚军、季军、殿军。'
    },
    {
      label: 'São Paulo State - List of Champions - RSSSF',
      url: 'https://www.rsssf.org/tabless/splchamp.html',
      remark: '用于交叉核对早期并列冠军和赛事历史口径。'
    },
    {
      label: 'Campeonato Paulista Finals - 365Scores',
      url: 'https://www.365scores.com/football/league/paulista-serie-a1-6188',
      remark: '用于补充核对 2016-2025 年冠亚军。'
    },
    {
      label: 'Palmeiras campeao do Paulistao Sicredi 2026 - FPF',
      url: 'https://futebolpaulista.com.br/Noticias/Detalhe.aspx?Noticia=32284',
      remark: '用于核对 2026 年冠军帕尔梅拉斯、亚军诺沃里桑蒂诺。'
    }
  ],
  lastVerifiedAt: '2026-07-23',
  notes: [
    '保利斯塔锦标赛是巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    '本补录只写入当前数据库已存在球队命中的 standings，库外球队对应名次留空。',
    'RSSSF Brazil 四强表覆盖到 2015 年；2016-2026 年只补充稳定可核对的冠亚军，季军暂不强补。'
  ]
};

const RAW_CAMPEONATO_PAULISTA_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1914',
    year: 1914,
    season: '1914',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1916',
    year: 1916,
    season: '1916',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1917',
    year: 1917,
    season: '1917',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1918',
    year: 1918,
    season: '1918',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1919',
    year: 1919,
    season: '1919',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1920',
    year: 1920,
    season: '1920',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1921',
    year: 1921,
    season: '1921',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 2, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1922',
    year: 1922,
    season: '1922',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1923',
    year: 1923,
    season: '1923',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1924',
    year: 1924,
    season: '1924',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1925',
    year: 1925,
    season: '1925',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1926',
    year: 1926,
    season: '1926',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1927',
    year: 1927,
    season: '1927',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1928',
    year: 1928,
    season: '1928',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1929',
    year: 1929,
    season: '1929',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1930',
    year: 1930,
    season: '1930',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 2, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1931',
    year: 1931,
    season: '1931',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1932',
    year: 1932,
    season: '1932',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1933',
    year: 1933,
    season: '1933',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1934',
    year: 1934,
    season: '1934',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1935',
    year: 1935,
    season: '1935',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '葡萄牙人' },
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 2, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1936',
    year: 1936,
    season: '1936',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '葡萄牙人' },
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 2,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1937',
    year: 1937,
    season: '1937',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1938',
    year: 1938,
    season: '1938',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1939',
    year: 1939,
    season: '1939',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1940',
    year: 1940,
    season: '1940',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '葡萄牙人' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1941',
    year: 1941,
    season: '1941',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1942',
    year: 1942,
    season: '1942',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1943',
    year: 1943,
    season: '1943',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1944',
    year: 1944,
    season: '1944',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1945',
    year: 1945,
    season: '1945',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1946',
    year: 1946,
    season: '1946',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1947',
    year: 1947,
    season: '1947',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1948',
    year: 1948,
    season: '1948',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1949',
    year: 1949,
    season: '1949',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1950',
    year: 1950,
    season: '1950',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 2, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1951',
    year: 1951,
    season: '1951',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1952',
    year: 1952,
    season: '1952',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1953',
    year: 1953,
    season: '1953',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1954',
    year: 1954,
    season: '1954',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1955',
    year: 1955,
    season: '1955',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1956',
    year: 1956,
    season: '1956',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1957',
    year: 1957,
    season: '1957',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1958',
    year: 1958,
    season: '1958',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1959',
    year: 1959,
    season: '1959',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1960',
    year: 1960,
    season: '1960',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '葡萄牙人' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1961',
    year: 1961,
    season: '1961',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1962',
    year: 1962,
    season: '1962',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 2, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1963',
    year: 1963,
    season: '1963',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1964',
    year: 1964,
    season: '1964',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 2,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1965',
    year: 1965,
    season: '1965',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1966',
    year: 1966,
    season: '1966',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1967',
    year: 1967,
    season: '1967',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1968',
    year: 1968,
    season: '1968',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1969',
    year: 1969,
    season: '1969',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1970',
    year: 1970,
    season: '1970',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1971',
    year: 1971,
    season: '1971',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1972',
    year: 1972,
    season: '1972',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1973',
    year: 1973,
    season: '1973',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 2, clubName: '葡萄牙人' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1974',
    year: 1974,
    season: '1974',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1975',
    year: 1975,
    season: '1975',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '葡萄牙人' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1976',
    year: 1976,
    season: '1976',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '瓜拉尼' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1977',
    year: 1977,
    season: '1977',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1978',
    year: 1978,
    season: '1978',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '瓜拉尼' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1979',
    year: 1979,
    season: '1979',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1980',
    year: 1980,
    season: '1980',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1981',
    year: 1981,
    season: '1981',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '瓜拉尼' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1982',
    year: 1982,
    season: '1982',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1983',
    year: 1983,
    season: '1983',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1984',
    year: 1984,
    season: '1984',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1985',
    year: 1985,
    season: '1985',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '葡萄牙人' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '瓜拉尼' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1986',
    year: 1986,
    season: '1986',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1987',
    year: 1987,
    season: '1987',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1988',
    year: 1988,
    season: '1988',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '瓜拉尼' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1989',
    year: 1989,
    season: '1989',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1990',
    year: 1990,
    season: '1990',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1991',
    year: 1991,
    season: '1991',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1992',
    year: 1992,
    season: '1992',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1993',
    year: 1993,
    season: '1993',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1994',
    year: 1994,
    season: '1994',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1995',
    year: 1995,
    season: '1995',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1996',
    year: 1996,
    season: '1996',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1997',
    year: 1997,
    season: '1997',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1998',
    year: 1998,
    season: '1998',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '1999',
    year: 1999,
    season: '1999',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2000',
    year: 2000,
    season: '2000',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2001',
    year: 2001,
    season: '2001',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2002',
    year: 2002,
    season: '2002',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2003',
    year: 2003,
    season: '2003',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2004',
    year: 2004,
    season: '2004',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2005',
    year: 2005,
    season: '2005',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2006',
    year: 2006,
    season: '2006',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2007',
    year: 2007,
    season: '2007',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '圣卡埃塔诺'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2008',
    year: 2008,
    season: '2008',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2009',
    year: 2009,
    season: '2009',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2010',
    year: 2010,
    season: '2010',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2011',
    year: 2011,
    season: '2011',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2012',
    year: 2012,
    season: '2012',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '瓜拉尼' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2013',
    year: 2013,
    season: '2013',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.THIRD_PLACE, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2014',
    year: 2014,
    season: '2014',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2015',
    year: 2015,
    season: '2015',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2016',
    year: 2016,
    season: '2016',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2017',
    year: 2017,
    season: '2017',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2018',
    year: 2018,
    season: '2018',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2019',
    year: 2019,
    season: '2019',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2020',
    year: 2020,
    season: '2020',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2021',
    year: 2021,
    season: '2021',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '帕尔梅拉斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2025',
    year: 2025,
    season: '2025',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'CAMPEONATO_PAULISTA',
    name: '2026',
    year: 2026,
    season: '2026',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark:
      '巴西圣保罗州级顶级联赛，系统暂按俱乐部国内二级联赛计分；2016 年以后只补充已确认冠亚军。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '帕尔梅拉斯' }
    ]
  }
];

export const CAMPEONATO_PAULISTA_PATCHES: SeedCompetitionPatch[] =
  RAW_CAMPEONATO_PAULISTA_PATCHES.map((patch) => ({
    ...patch,
    quantity: patch.standings.length
  }));

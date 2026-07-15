import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_SERIE_B_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_SERIE_B',
  name: '巴西乙级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeonato Brasileiro Serie B - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Campeonato_Brasileiro_S%C3%A9rie_B',
      remark: '用于核对官方赛季冠军与亚军。'
    },
    {
      label: 'Campeonato Brasileiro de Futebol - Serie B - Portuguese Wikipedia',
      url: 'https://pt.wikipedia.org/wiki/Campeonato_Brasileiro_de_Futebol_-_S%C3%A9rie_B',
      remark: '用于补充核对近年积分榜前三。'
    }
  ],
  lastVerifiedAt: '2026-07-15',
  notes: [
    '本补录只写入当前数据库里已存在的巴西俱乐部 standings，缺失俱乐部对应名次先留空。',
    '巴乙命中 CLUB_DOMESTIC_LEVEL_2_LEAGUE，结合巴西 0.75 系数后实际为冠军 1.5、亚军 0.6、季军 0.375。'
  ]
};

export const BRAZIL_SERIE_B_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '1981',
    year: 1981,
    season: '1981',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '瓜拉尼'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '1990',
    year: 1990,
    season: '1990',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴拉纳竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '1991',
    year: 1991,
    season: '1991',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '瓜拉尼'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '1995',
    year: 1995,
    season: '1995',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '巴拉纳竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '1997',
    year: 1997,
    season: '1997',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '米内罗美洲'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '1998',
    year: 1998,
    season: '1998',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '博塔弗戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2003',
    year: 2003,
    season: '2003',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '博塔弗戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2005',
    year: 2005,
    season: '2005',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2006',
    year: 2006,
    season: '2006',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2007',
    year: 2007,
    season: '2007',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2008',
    year: 2008,
    season: '2008',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2009',
    year: 2009,
    season: '2009',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '瓜拉尼'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2011',
    year: 2011,
    season: '2011',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '葡萄牙人'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2012',
    year: 2012,
    season: '2012',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴拉纳竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2013',
    year: 2013,
    season: '2013',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2014',
    year: 2014,
    season: '2014',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2015',
    year: 2015,
    season: '2015',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '博塔弗戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2016',
    year: 2016,
    season: '2016',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2017',
    year: 2017,
    season: '2017',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '米内罗美洲'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2020',
    year: 2020,
    season: '2020',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '米内罗美洲'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2021',
    year: 2021,
    season: '2021',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '博塔弗戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '格雷米奥'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_B',
    name: '2025',
    year: 2025,
    season: '2025',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴拉纳竞技'
      }
    ]
  }
];

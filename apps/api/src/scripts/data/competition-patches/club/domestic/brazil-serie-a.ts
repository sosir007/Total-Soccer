import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const BRAZIL_SERIE_A_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'BRAZIL_SERIE_A',
  name: '巴西甲级联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Campeonato Brasileiro Serie A - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Campeonato_Brasileiro_S%C3%A9rie_A',
      remark: '用于核对赛事基础资料与统一赛事口径。'
    },
    {
      label: 'List of Brazilian football champions - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Brazilian_football_champions',
      remark: '用于按 CBF 官方承认口径整理历届全国冠军、亚军、季军。'
    }
  ],
  lastVerifiedAt: '2026-07-15',
  notes: [
    '本补录只写入当前仓库里已被其他 seed/patch 明确引用过的巴西俱乐部 standings。',
    '缺失俱乐部对应名次先留空，不自动创建新俱乐部，方便后续按 UID 再补库。',
    '巴西国内一级联赛命中 CLUB_DOMESTIC_LEVEL_1_LEAGUE，结合巴西 0.75 系数后实际为冠军 6、亚军 2.4、季军 1.5。'
  ]
};

const RAW_BRAZIL_SERIE_A_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1937',
    year: 1937,
    season: '1937',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '1937 Copa dos Campeões Estaduais（后于 2023 年获 CBF 认可）。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '米内罗竞技'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1959',
    year: 1959,
    season: '1959',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1960',
    year: 1960,
    season: '1960',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1961',
    year: 1961,
    season: '1961',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1962',
    year: 1962,
    season: '1962',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '博塔弗戈'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1963',
    year: 1963,
    season: '1963',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '博塔弗戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1964',
    year: 1964,
    season: '1964',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '弗拉门戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1965',
    year: 1965,
    season: '1965',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1966',
    year: 1966,
    season: '1966',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1967（塔萨巴西尔）',
    year: 1967,
    season: '1967',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1967（罗伯托-戈麦斯-佩德罗萨）',
    year: 1967,
    season: '1967',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Roberto Gomes Pedrosa 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1968（塔萨巴西尔）',
    year: 1968,
    season: '1968',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Taça Brasil 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '博塔弗戈'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '克鲁塞罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1968（罗伯托-戈麦斯-佩德罗萨）',
    year: 1968,
    season: '1968',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Roberto Gomes Pedrosa 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1969',
    year: 1969,
    season: '1969',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Roberto Gomes Pedrosa / Taça de Prata 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1970',
    year: 1970,
    season: '1970',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: 'Roberto Gomes Pedrosa / Taça de Prata 口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗鲁米嫩塞'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1971',
    year: 1971,
    season: '1971',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '米内罗竞技'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '博塔弗戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1972',
    year: 1972,
    season: '1972',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '博塔弗戈'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1973',
    year: 1973,
    season: '1973',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '克鲁塞罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1974',
    year: 1974,
    season: '1974',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '桑托斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1975',
    year: 1975,
    season: '1975',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1976',
    year: 1976,
    season: '1976',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1977',
    year: 1977,
    season: '1977',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1978',
    year: 1978,
    season: '1978',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1979',
    year: 1979,
    season: '1979',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1980',
    year: 1980,
    season: '1980',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '米内罗竞技'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1981',
    year: 1981,
    season: '1981',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '格雷米奥'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣保罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1982',
    year: 1982,
    season: '1982',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1983',
    year: 1983,
    season: '1983',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1984',
    year: 1984,
    season: '1984',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗鲁米嫩塞'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1986',
    year: 1986,
    season: '1986',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '圣保罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1987',
    year: 1987,
    season: '1987',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    remark: '仅录 CBF 官方承认冠军口径。',
    standings: [
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗拉门戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1988',
    year: 1988,
    season: '1988',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1989',
    year: 1989,
    season: '1989',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '克鲁塞罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1990',
    year: 1990,
    season: '1990',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣保罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1991',
    year: 1991,
    season: '1991',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1992',
    year: 1992,
    season: '1992',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '博塔弗戈'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1993',
    year: 1993,
    season: '1993',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1994',
    year: 1994,
    season: '1994',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1995',
    year: 1995,
    season: '1995',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '博塔弗戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1996',
    year: 1996,
    season: '1996',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '格雷米奥'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1997',
    year: 1997,
    season: '1997',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1998',
    year: 1998,
    season: '1998',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '桑托斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '1999',
    year: 1999,
    season: '1999',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2000',
    year: 2000,
    season: '2000',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣卡埃塔诺'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '克鲁塞罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2001',
    year: 2001,
    season: '2001',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '巴拉纳竞技'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣卡埃塔诺'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2002',
    year: 2002,
    season: '2002',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2003',
    year: 2003,
    season: '2003',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '圣保罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2004',
    year: 2004,
    season: '2004',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴拉纳竞技'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '圣保罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2005',
    year: 2005,
    season: '2005',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2006',
    year: 2006,
    season: '2006',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2007',
    year: 2007,
    season: '2007',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗拉门戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2008',
    year: 2008,
    season: '2008',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '格雷米奥'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '克鲁塞罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2009',
    year: 2009,
    season: '2009',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '圣保罗'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2010',
    year: 2010,
    season: '2010',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗鲁米嫩塞'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '科林蒂安'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2011',
    year: 2011,
    season: '2011',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2012',
    year: 2012,
    season: '2012',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗鲁米嫩塞'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '米内罗竞技'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2013',
    year: 2013,
    season: '2013',
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
        clubName: '巴拉纳竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2014',
    year: 2014,
    season: '2014',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '克鲁塞罗'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '圣保罗'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2015',
    year: 2015,
    season: '2015',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '米内罗竞技'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '格雷米奥'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2016',
    year: 2016,
    season: '2016',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗拉门戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2017',
    year: 2017,
    season: '2017',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '科林蒂安'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '桑托斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2018',
    year: 2018,
    season: '2018',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '巴西国际'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2019',
    year: 2019,
    season: '2019',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '桑托斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2020',
    year: 2020,
    season: '2020',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2021',
    year: 2021,
    season: '2021',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '米内罗竞技'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '巴西国际'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '格雷米奥'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '米内罗竞技'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '博塔弗戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '弗拉门戈'
      }
    ]
  },
  {
    competitionCode: 'BRAZIL_SERIE_A',
    name: '2025',
    year: 2025,
    season: '2025',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '弗拉门戈'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '克鲁塞罗'
      }
    ]
  }
];

function getBrazilSerieAExternalUrl(patch: SeedCompetitionPatch) {
  if (patch.year === 1967 || patch.year === 1968) {
    if (patch.name?.includes('塔萨')) {
      return `https://pt.wikipedia.org/wiki/Campeonato_Brasileiro_de_Futebol_de_${patch.year}_%28Ta%C3%A7a_Brasil%29`;
    }

    if (patch.name?.includes('罗伯托')) {
      return `https://pt.wikipedia.org/wiki/Campeonato_Brasileiro_de_Futebol_de_${patch.year}_%28Torneio_Roberto_Gomes_Pedrosa%29`;
    }
  }

  return `https://pt.wikipedia.org/wiki/Campeonato_Brasileiro_de_Futebol_de_${patch.year}`;
}

export const BRAZIL_SERIE_A_PATCHES: SeedCompetitionPatch[] = RAW_BRAZIL_SERIE_A_PATCHES.map(
  (patch) => ({
    ...patch,
    externalUrl: getBrazilSerieAExternalUrl(patch)
  })
);

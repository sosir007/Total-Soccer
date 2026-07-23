import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const TORNEIO_RIO_SAO_PAULO_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'TORNEIO_RIO_SAO_PAULO',
  name: '里约-圣保罗锦标赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Torneio Rio-São Paulo - List of Champions - RSSSF',
      url: 'https://www.rsssf.org/tablesr/riosplchamp.html',
      remark: '用于核对 1933-2002 年历届冠军和并列冠军。'
    },
    {
      label: 'Torneio Rio-São Paulo - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Torneio_Rio_%E2%80%93_S%C3%A3o_Paulo',
      remark: '用于核对冠军、亚军和 1940 年中断口径。'
    },
    {
      label: 'São Paulo Futebol Clube history - RSSSF Brazil',
      url: 'https://www.rsssfbrasil.com/miscellaneous/hsaopaulo.htm',
      remark: '用于交叉核对圣保罗在 1933、1962、1965、1998、2002 年的亚军记录。'
    }
  ],
  lastVerifiedAt: '2026-07-23',
  notes: [
    '里约-圣保罗锦标赛是巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    '1940 年赛事中断未产生冠军，只保留届次备注，不写入 standings。',
    '1964、1966 年按并列冠军录入，不强造亚军。',
    '本补录只写入当前数据库已存在球队命中的 standings。'
  ]
};

const RAW_TORNEIO_RIO_SAO_PAULO_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1933',
    year: 1933,
    season: '1933',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
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
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1940',
    year: 1940,
    season: '1940',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，1940 年赛事中断未完成，未产生冠军；不计入 standings。',
    standings: []
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1950',
    year: 1950,
    season: '1950',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1951',
    year: 1951,
    season: '1951',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1952',
    year: 1952,
    season: '1952',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '葡萄牙人' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1953',
    year: 1953,
    season: '1953',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1954',
    year: 1954,
    season: '1954',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '弗鲁米嫩塞'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1955',
    year: 1955,
    season: '1955',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '葡萄牙人' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1957',
    year: 1957,
    season: '1957',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '弗鲁米嫩塞'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '弗拉门戈',
        remark: '并列亚军'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 2,
        clubName: '瓦斯科达伽马',
        remark: '并列亚军'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1958',
    year: 1958,
    season: '1958',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '瓦斯科达伽马'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '弗拉门戈'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1959',
    year: 1959,
    season: '1959',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1960',
    year: 1960,
    season: '1960',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '弗鲁米嫩塞'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '博塔弗戈' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1961',
    year: 1961,
    season: '1961',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '弗拉门戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '博塔弗戈' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1962',
    year: 1962,
    season: '1962',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '博塔弗戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1963',
    year: 1963,
    season: '1963',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1964',
    year: 1964,
    season: '1964',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '桑托斯',
        remark: '并列冠军'
      },
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 2,
        clubName: '博塔弗戈',
        remark: '并列冠军'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1965',
    year: 1965,
    season: '1965',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
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
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1966',
    year: 1966,
    season: '1966',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '博塔弗戈',
        remark: '并列冠军'
      },
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 2,
        clubName: '科林蒂安',
        remark: '并列冠军'
      },
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 3,
        clubName: '桑托斯',
        remark: '并列冠军'
      },
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 4,
        clubName: '瓦斯科达伽马',
        remark: '并列冠军'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1993',
    year: 1993,
    season: '1993',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '科林蒂安' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1997',
    year: 1997,
    season: '1997',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '桑托斯' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '弗拉门戈' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1998',
    year: 1998,
    season: '1998',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '博塔弗戈' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '1999',
    year: 1999,
    season: '1999',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '瓦斯科达伽马'
      },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '桑托斯' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '2000',
    year: 2000,
    season: '2000',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        standingOrder: 1,
        clubName: '帕尔梅拉斯'
      },
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        standingOrder: 1,
        clubName: '瓦斯科达伽马'
      }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '2001',
    year: 2001,
    season: '2001',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '圣保罗' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '博塔弗戈' }
    ]
  },
  {
    competitionCode: 'TORNEIO_RIO_SAO_PAULO',
    name: '2002',
    year: 2002,
    season: '2002',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: '巴西历史跨州地区杯赛，系统暂按俱乐部国内三级杯赛计分。',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, standingOrder: 1, clubName: '科林蒂安' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, standingOrder: 1, clubName: '圣保罗' }
    ]
  }
];

export const TORNEIO_RIO_SAO_PAULO_PATCHES: SeedCompetitionPatch[] =
  RAW_TORNEIO_RIO_SAO_PAULO_PATCHES.map((patch) => ({
    ...patch,
    quantity: patch.standings.length
  }));

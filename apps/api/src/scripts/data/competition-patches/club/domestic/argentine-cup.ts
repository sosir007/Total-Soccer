import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const ARGENTINE_CUP_PATCH_METADATA: CompetitionDataMetadata = {
  competitionCode: 'ARGENTINE_CUP',
  name: '阿根廷杯',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [
    {
      label: 'Copa Argentina - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_Argentina',
      remark: '用于核对 1969、2011-12 至 2025 历届冠军与亚军。'
    },
    {
      label: 'Copa Argentina official website',
      url: 'https://www.copaargentina.org/',
      remark: '用于核对赛事现行状态和最近届次。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本补录只写入当前数据库里已存在的阿根廷俱乐部 standings，缺失俱乐部对应名次先留空。',
    '1969 年旧版阿根廷杯有正式冠军；1970 年赛事未完成，不创建荣誉届次。',
    '现代阿根廷杯自 2011-12 赛季重启。',
    '阿根廷杯命中 CLUB_DOMESTIC_LEVEL_1_CUP，结合阿根廷 0.75 系数后实际为冠军 2.25、亚军 1.125。'
  ]
};

export const ARGENTINE_CUP_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '1969',
    year: 1969,
    season: '1969',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/1969_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' }],
    remark: '亚军为 Club Atletico Atlanta，当前数据库暂无对应阿根廷俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2011-12',
    year: 2012,
    season: '2011-12',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2011%E2%80%9312_Copa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '竞赛' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2012-13',
    year: 2013,
    season: '2012-13',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2012%E2%80%9313_Copa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '萨兰迪阿森纳' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '圣洛伦索' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2013-14',
    year: 2014,
    season: '2013-14',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2013%E2%80%9314_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '罗萨里奥中央' }],
    remark: '冠军为飓风，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2014-15',
    year: 2015,
    season: '2014-15',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2014%E2%80%9315_Copa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '罗萨里奥中央' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2015-16',
    year: 2016,
    season: '2015-16',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2015%E2%80%9316_Copa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '罗萨里奥中央' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2016-17',
    year: 2017,
    season: '2016-17',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2016%E2%80%9317_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' }],
    remark: '亚军为图库曼竞技，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2017-18',
    year: 2018,
    season: '2017-18',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2017%E2%80%9318_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '罗萨里奥中央' }],
    remark: '亚军为拉普拉塔体操，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2018-19',
    year: 2019,
    season: '2018-19',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2018%E2%80%9319_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: '河床竞技' }],
    remark: '亚军为科尔多瓦中央，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2019-20',
    year: 2021,
    season: '2019-20',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2019%E2%80%9320_Copa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '博卡青年' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '塔勒雷斯' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2022',
    year: 2022,
    season: '2022',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2022_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '塔勒雷斯' }],
    remark: '冠军为帕特罗纳图，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2023',
    year: 2023,
    season: '2023',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2023_Copa_Argentina',
    standings: [
      { placement: CompetitionStandingPlacement.CHAMPION, clubName: '拉普拉塔大学生' },
      { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '国防与司法' }
    ]
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2024',
    year: 2024,
    season: '2024',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2024_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '萨斯菲尔德' }],
    remark: '冠军为科尔多瓦中央，当前数据库暂无对应俱乐部，暂不录 standings。'
  },
  {
    competitionCode: 'ARGENTINE_CUP',
    name: '2025',
    year: 2025,
    season: '2025',
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    externalUrl: 'https://en.wikipedia.org/wiki/2025_Copa_Argentina',
    standings: [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: '阿根廷青年人' }],
    remark: '冠军为门多萨独立，当前数据库暂无对应俱乐部，暂不录 standings。'
  }
];

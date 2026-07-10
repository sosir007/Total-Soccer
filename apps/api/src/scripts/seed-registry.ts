export type SeedRegistryItem = {
  key: string;
  file: string;
  dataFiles: string[];
  label: string;
  dataKind: 'competition-results' | 'competition-patches';
  target: 'national-team' | 'club';
  scope: 'global' | 'confederation' | 'domestic';
};

export const COMPETITION_SEEDS: SeedRegistryItem[] = [
  {
    key: 'world-cup',
    label: '国际足联世界杯',
    file: 'src/scripts/seeds/competitions/national-team/global/seed-world-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/global/world-cup.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'global'
  },
  {
    key: 'euro',
    label: '欧洲足球锦标赛',
    file: 'src/scripts/seeds/competitions/national-team/confederation/seed-euro.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/confederation/euro.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'confederation'
  },
  {
    key: 'asian-cup',
    label: '亚足联亚洲杯',
    file: 'src/scripts/seeds/competitions/national-team/confederation/seed-asian-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/confederation/asian-cup.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'confederation'
  },
  {
    key: 'copa-america',
    label: '美洲杯',
    file: 'src/scripts/seeds/competitions/national-team/confederation/seed-copa-america.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/confederation/copa-america.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'confederation'
  },
  {
    key: 'africa-cup',
    label: '非洲国家杯',
    file: 'src/scripts/seeds/competitions/national-team/confederation/seed-africa-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/confederation/africa-cup.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'confederation'
  },
  {
    key: 'gold-cup',
    label: '中北美及加勒比海金杯赛',
    file: 'src/scripts/seeds/competitions/national-team/confederation/seed-gold-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/confederation/gold-cup.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'confederation'
  },
  {
    key: 'ofc-nations-cup',
    label: '大洋洲国家杯',
    file: 'src/scripts/seeds/competitions/national-team/confederation/seed-ofc-nations-cup.ts',
    dataFiles: [
      'src/scripts/data/competition-results/national-team/confederation/ofc-nations-cup.ts'
    ],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'confederation'
  },
  {
    key: 'confederations-cup',
    label: '国际足联联合会杯',
    file: 'src/scripts/seeds/competitions/national-team/global/seed-confederations-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/global/confederations-cup.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'global'
  },
  {
    key: 'olympic-mens-football',
    label: '奥运会男子足球赛',
    file: 'src/scripts/seeds/competitions/national-team/global/seed-olympic-mens-football.ts',
    dataFiles: [
      'src/scripts/data/competition-results/national-team/global/olympic-mens-football.ts'
    ],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'global'
  },
  {
    key: 'fifa-club-world-cup',
    label: '国际足联俱乐部世界杯',
    file: 'src/scripts/seeds/competitions/club/global/seed-fifa-club-world-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/global/fifa-club-world-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'global'
  },
  {
    key: 'fifa-intercontinental-cup',
    label: '国际足联洲际杯',
    file: 'src/scripts/seeds/competitions/club/global/seed-fifa-intercontinental-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/global/fifa-intercontinental-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'global'
  },
  {
    key: 'european-south-american-cup',
    label: '欧洲/南美洲杯',
    file: 'src/scripts/seeds/competitions/club/global/seed-european-south-american-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/global/european-south-american-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'global'
  },
  {
    key: 'uefa-champions-league',
    label: '欧洲冠军联赛',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-uefa-champions-league.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/uefa-champions-league.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'club-patches',
    label: '俱乐部部分荣誉补录',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-club-patches.ts',
    dataFiles: ['src/scripts/data/competition-patches/club/domestic/index.ts'],
    dataKind: 'competition-patches',
    target: 'club',
    scope: 'domestic'
  }
];

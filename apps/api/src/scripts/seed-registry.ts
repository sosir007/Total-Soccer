export type SeedRegistryItem = {
  key: string;
  file: string;
  dataFiles: string[];
  label: string;
  dataKind: 'competition-results' | 'competition-patches';
  target: 'national-team' | 'club';
  scope: 'global' | 'confederation' | 'domestic' | 'custom';
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
    key: 'panamerican-championship',
    label: '泛美锦标赛',
    file: 'src/scripts/seeds/competitions/national-team/global/seed-panamerican-championship.ts',
    dataFiles: [
      'src/scripts/data/competition-results/national-team/global/panamerican-championship.ts'
    ],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'global'
  },
  {
    key: 'finalissima',
    label: '南美洲-欧洲冠军杯',
    file: 'src/scripts/seeds/competitions/national-team/global/seed-finalissima.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/global/finalissima.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'custom'
  },
  {
    key: 'uefa-nations-league',
    label: '欧洲国家联赛',
    file: 'src/scripts/seeds/competitions/national-team/global/seed-uefa-nations-league.ts',
    dataFiles: ['src/scripts/data/competition-results/national-team/global/uefa-nations-league.ts'],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'custom'
  },
  {
    key: 'central-european-international-cup',
    label: '中欧国际杯',
    file: 'src/scripts/seeds/competitions/national-team/global/seed-central-european-international-cup.ts',
    dataFiles: [
      'src/scripts/data/competition-results/national-team/global/central-european-international-cup.ts'
    ],
    dataKind: 'competition-results',
    target: 'national-team',
    scope: 'custom'
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
    key: 'intercontinental-champions-supercup',
    label: '洲际冠军超级杯',
    file: 'src/scripts/seeds/competitions/club/global/seed-intercontinental-champions-supercup.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/global/intercontinental-champions-supercup.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'global'
  },
  {
    key: 'copa-interamericana',
    label: '美洲洲际杯',
    file: 'src/scripts/seeds/competitions/club/global/seed-copa-interamericana.ts',
    dataFiles: ['src/scripts/data/competition-results/club/global/copa-interamericana.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'global'
  },
  {
    key: 'uefa-conmebol-club-challenge',
    label: '欧足联-南美足联俱乐部挑战赛',
    file: 'src/scripts/seeds/competitions/club/global/seed-uefa-conmebol-club-challenge.ts',
    dataFiles: ['src/scripts/data/competition-results/club/global/uefa-conmebol-club-challenge.ts'],
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
    key: 'uefa-europa-league',
    label: '欧足联欧洲联赛',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-uefa-europa-league.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/uefa-europa-league.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'uefa-cup-winners-cup',
    label: '欧洲优胜者杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-uefa-cup-winners-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/uefa-cup-winners-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'inter-cities-fairs-cup',
    label: '国际城市博览会杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-inter-cities-fairs-cup.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/confederation/inter-cities-fairs-cup.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'latin-cup',
    label: '拉丁杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-latin-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/latin-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'custom'
  },
  {
    key: 'cup-of-the-alps',
    label: '阿尔卑斯杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-cup-of-the-alps.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/cup-of-the-alps.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'custom'
  },
  {
    key: 'anglo-italian-league-cup',
    label: '英意联赛杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-anglo-italian-league-cup.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/confederation/anglo-italian-league-cup.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'custom'
  },
  {
    key: 'mitropa-cup',
    label: '米特罗帕杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-mitropa-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/mitropa-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'custom'
  },
  {
    key: 'uefa-super-cup',
    label: '欧洲超级杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-uefa-super-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/uefa-super-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'conmebol-libertadores',
    label: '南美解放者杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-conmebol-libertadores.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/conmebol-libertadores.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'supercopa-libertadores',
    label: '南美解放者超级杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-supercopa-libertadores.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/confederation/supercopa-libertadores.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'copa-conmebol',
    label: '南美足联杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-copa-conmebol.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/copa-conmebol.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'copa-sudamericana',
    label: '南美杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-copa-sudamericana.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/copa-sudamericana.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'recopa-sudamericana',
    label: '南美优胜者杯',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-recopa-sudamericana.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/recopa-sudamericana.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'copa-de-oro',
    label: '南美金杯赛',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-copa-de-oro.ts',
    dataFiles: ['src/scripts/data/competition-results/club/confederation/copa-de-oro.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'copa-master-de-supercopa',
    label: '南美解放者超级杯大师赛',
    file: 'src/scripts/seeds/competitions/club/confederation/seed-copa-master-de-supercopa.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/confederation/copa-master-de-supercopa.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'confederation'
  },
  {
    key: 'brazil-serie-a',
    label: '巴西甲级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-brazil-serie-a.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/brazil-serie-a.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'argentine-primera-division',
    label: '阿根廷足球甲级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-argentine-primera-division.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/argentine-primera-division.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'argentine-primera-nacional',
    label: '阿根廷足球乙级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-argentine-primera-nacional.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/argentine-primera-nacional.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'argentine-cup',
    label: '阿根廷杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-argentine-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/argentine-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'argentine-professional-league-cup',
    label: '阿根廷职业联赛杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-argentine-professional-league-cup.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/domestic/argentine-professional-league-cup.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'argentine-professional-league-champions-trophy',
    label: '阿根廷职业联赛冠军杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-argentine-professional-league-champions-trophy.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/domestic/argentine-professional-league-champions-trophy.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'argentine-super-cup',
    label: '阿根廷超级杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-argentine-super-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/argentine-super-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'argentine-international-super-cup',
    label: '阿根廷国际超级杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-argentine-international-super-cup.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/domestic/argentine-international-super-cup.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'spain-la-liga',
    label: '西班牙足球甲级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-spain-la-liga.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/spain-la-liga.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'premier-league',
    label: '英格兰足球超级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-premier-league.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/premier-league.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'old-first-division',
    label: '英格兰足球甲级联赛（旧英甲）',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-old-first-division.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/old-first-division.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'germany-bundesliga',
    label: '德国足球甲级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-germany-bundesliga.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/germany-bundesliga.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'german-football-championship',
    label: '德国足球锦标赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-german-football-championship.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/domestic/german-football-championship.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'spain-segunda-division',
    label: '西班牙足球乙级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-spain-segunda-division.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/spain-segunda-division.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'italy-serie-a',
    label: '意大利足球甲级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-italy-serie-a.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/italy-serie-a.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'italy-serie-b',
    label: '意大利足球乙级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-italy-serie-b.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/italy-serie-b.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'italy-coppa-italia',
    label: '意大利杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-italy-coppa-italia.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/italy-coppa-italia.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'italy-super-cup',
    label: '意大利超级杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-italy-super-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/italy-super-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'spain-copa-del-rey',
    label: '西班牙国王杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-spain-copa-del-rey.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/spain-copa-del-rey.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'spain-super-cup',
    label: '西班牙超级杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-spain-super-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/spain-super-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'spain-league-cup',
    label: '西班牙联赛杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-spain-league-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/spain-league-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'brazil-serie-b',
    label: '巴西乙级联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-brazil-serie-b.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/brazil-serie-b.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'brazil-cup',
    label: '巴西杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-brazil-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/brazil-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'brazil-super-cup',
    label: '巴西超级杯',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-brazil-super-cup.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/brazil-super-cup.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'campeonato-paulista',
    label: '保利斯塔锦标赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-campeonato-paulista.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/campeonato-paulista.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'torneio-rio-sao-paulo',
    label: '里约-圣保罗锦标赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-torneio-rio-sao-paulo.ts',
    dataFiles: ['src/scripts/data/competition-results/club/domestic/torneio-rio-sao-paulo.ts'],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
  },
  {
    key: 'north-american-soccer-league',
    label: '北美足球联赛',
    file: 'src/scripts/seeds/competitions/club/domestic/seed-north-american-soccer-league.ts',
    dataFiles: [
      'src/scripts/data/competition-results/club/domestic/north-american-soccer-league.ts'
    ],
    dataKind: 'competition-results',
    target: 'club',
    scope: 'domestic'
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

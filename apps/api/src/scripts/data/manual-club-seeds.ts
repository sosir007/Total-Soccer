import type { SeedClub } from '../helpers/competition-seed.js';

export type ManualClubSeed = Omit<SeedClub, 'uid'> & {
  uid: string;
  countryName: string;
  confederationCode: string;
};

export const MANUAL_CLUB_SEEDS: ManualClubSeed[] = [
  {
    uid: '1742',
    name: '皇家社会',
    englishName: 'Real Sociedad',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '-',
    name: '桑坦德竞技',
    englishName: 'Racing Santander',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1728',
    name: '皇家奥维耶多',
    englishName: 'Real Oviedo',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '102029',
    name: '阿雷纳斯',
    englishName: 'Arenas Club de Getxo',
    alias: '格乔',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1772',
    name: '拉斯帕尔马斯',
    englishName: 'Las Palmas',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1726',
    name: '皇家马略卡',
    englishName: 'Real Mallorca',
    shortName: '马略卡',
    alias: '马洛卡',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1746',
    name: '皇家伊伦联',
    englishName: 'Real Unión',
    alias: '皇家联合',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1724',
    name: '维戈塞尔塔',
    englishName: 'Celta Vigo',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1685',
    name: '奥萨苏纳',
    englishName: 'Osasuna',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1747',
    name: '巴拉多利德',
    englishName: 'Real Valladolid',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1710',
    name: '赫塔费',
    englishName: 'Getafe',
    alias: '赫塔菲',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1714',
    name: '格拉纳达',
    englishName: 'Granada',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1707',
    name: '埃尔切',
    englishName: 'Elche',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1690',
    name: '卡斯特利翁',
    englishName: 'Castellón',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2201',
    name: '维罗纳',
    englishName: 'Hellas Verona',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2206',
    name: '利沃诺',
    englishName: 'Livorno',
    alias: '里窝那',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1147',
    name: '摩德纳',
    englishName: 'Modena',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1178',
    name: '乌迪内斯',
    englishName: 'Udinese',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1166',
    name: '维琴察',
    englishName: 'L.R. Vicenza',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1157',
    name: '佩鲁贾',
    englishName: 'Perugia',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '691',
    name: '诺维奇城',
    englishName: 'Norwich City',
    shortName: '诺维奇',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '722',
    name: '桑德兰',
    englishName: 'Sunderland AFC',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '708',
    name: '谢菲尔德联',
    englishName: 'Sheffield United',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '614',
    name: '博尔顿',
    englishName: 'Bolton Wanderers',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '613',
    name: '布莱克浦',
    englishName: 'Blackpool',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '628',
    name: '查尔顿竞技',
    englishName: 'Charlton Athletic',
    shortName: '查尔顿',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '625',
    name: '卡迪夫城',
    englishName: 'Cardiff City',
    countryName: '威尔士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '694',
    name: '奥尔德姆竞技',
    englishName: 'Oldham Athletic',
    shortName: '奥尔德姆',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '619',
    name: '布里斯托尔城',
    englishName: 'Bristol City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '732',
    name: '沃特福德',
    englishName: 'Watford',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '933',
    name: '杜伊斯堡',
    englishName: 'MSV Duisburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2237',
    name: '布伦瑞克',
    englishName: 'Eintracht Braunschweig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '900',
    name: '亚琛',
    englishName: 'Alemannia Aachen',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '902',
    name: '乌丁根05',
    englishName: 'KFC Uerdingen 05',
    alias: '乌尔丁根05',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '91013388',
    name: 'RB莱比锡',
    englishName: 'RB Leipzig',
    alias: '莱比锡红牛',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '879226',
    name: '霍芬海姆',
    englishName: 'TSG Hoffenheim',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '858',
    name: '里尔',
    englishName: 'Lille OSC',
    alias: '里尔奥林匹克',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '865',
    name: '里昂',
    englishName: 'Olympique Lyonnais',
    alias: '奥林匹克里昂',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2009',
    name: '索肖',
    englishName: 'Sochaux-Montbéliard',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '824',
    name: '欧塞尔',
    englishName: 'Auxerre',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '872',
    name: '斯特拉斯堡',
    englishName: 'Strasbourg',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '859',
    name: '蒙彼利埃',
    englishName: 'Montpellier HSC',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2000282946',
    name: '塞特',
    englishName: 'FC Sète',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '860',
    name: '尼姆',
    englishName: 'Nîmes Olympique',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '886',
    name: '图卢兹',
    englishName: 'Toulouse FC',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '888',
    name: '瓦朗谢讷',
    englishName: 'Valenciennes FC',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '880',
    name: '色当',
    englishName: 'CS Sedan',
    alias: '色当阿登',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2061',
    name: '布雷斯特',
    englishName: 'Stade Brestois 29',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '856',
    name: '勒阿弗尔',
    englishName: 'Le Havre AC',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '875',
    name: '昂热',
    englishName: 'Angers SCO',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '825',
    name: '戛纳',
    englishName: 'AS Cannes',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  }
];

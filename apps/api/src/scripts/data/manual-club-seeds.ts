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
    uid: '1728',
    name: '桑坦德竞技',
    englishName: 'Racing Santander',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1741',
    name: '皇家奥维耶多',
    englishName: 'Real Oviedo',
    countryName: '西班牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '814089',
    name: '赫罗纳',
    englishName: 'Girona',
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
    uid: '1102',
    name: '亚历山德里亚',
    englishName: 'Alessandria',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: true
  },
  {
    uid: '852',
    name: '格勒诺布尔',
    englishName: 'Grenoble',
    countryName: '法国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2193',
    name: '卡塔尼亚',
    englishName: 'Catania',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1856',
    name: '洛桑体育',
    englishName: 'Lausanne-Sport',
    countryName: '瑞士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1847',
    name: '伯尔尼年轻人',
    englishName: 'Young Boys',
    countryName: '瑞士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1857',
    name: '纳沙泰尔萨马克斯',
    englishName: 'Neuchâtel Xamax',
    shortName: '纳沙泰尔',
    countryName: '瑞士',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '725',
    name: '斯温登镇',
    englishName: 'Swindon Town',
    shortName: '斯温登镇',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1474',
    name: '贝伦人',
    englishName: 'Belenenses',
    countryName: '葡萄牙',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2194',
    name: '巴勒莫',
    englishName: 'Palermo',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1104',
    name: '安科纳',
    englishName: 'Ancona',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1119',
    name: '卡坦扎罗',
    englishName: 'Catanzaro',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1153',
    name: '诺瓦拉',
    englishName: 'Novara',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2220',
    name: '斯帕尔',
    englishName: 'SPAL',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '101345',
    name: '瓦多',
    englishName: 'Vado',
    countryName: '意大利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '700173',
    name: '瓦雷泽',
    englishName: 'Varese',
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
    uid: '1060',
    name: 'MTK布达佩斯',
    englishName: 'MTK Budapest',
    countryName: '匈牙利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1452',
    name: '扎布热矿工',
    englishName: 'Górnik Zabrze',
    countryName: '波兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '2233',
    name: '马格德堡',
    englishName: '1. FC Magdeburg',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1055',
    name: '费伦茨瓦罗斯',
    englishName: 'Ferencváros',
    countryName: '匈牙利',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '942',
    name: '卡尔蔡司耶拿',
    englishName: 'Carl Zeiss Jena',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '892',
    name: '第比利斯迪纳摩',
    englishName: 'Dinamo Tbilisi',
    countryName: '格鲁吉亚',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '3600077',
    name: '莱比锡火车头',
    englishName: '1. FC Lokomotive Leipzig',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '609',
    name: '伯明翰城',
    englishName: 'Birmingham City',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '1064',
    name: '新佩斯',
    englishName: 'Újpest',
    alias: '乌伊佩斯特',
    countryName: '匈牙利',
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
  },
  {
    uid: '1905',
    name: '达拉斯FC',
    englishName: 'FC Dallas',
    shortName: '达拉斯',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: true
  },
  {
    uid: '72041885',
    name: '纽约城FC',
    englishName: 'New York City FC',
    shortName: '纽约城',
    countryName: '美国',
    confederationCode: 'CONCACAF',
    visibleInCatalog: true
  }
];

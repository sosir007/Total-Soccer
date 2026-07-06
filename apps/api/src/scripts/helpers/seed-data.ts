import type { SeedConfederation, SeedCountry, SeedHistoricalCountry } from './competition-seed.js';

export const CONFEDERATION_SEEDS: SeedConfederation[] = [
  { uid: '1', code: 'CAF', name: '非足联', sortOrder: 10 },
  { uid: '2', code: 'AFC', name: '亚足联', sortOrder: 20 },
  { uid: '3', code: 'UEFA', name: '欧足联', sortOrder: 30 },
  { uid: '4', code: 'CONCACAF', name: '中北美足联', sortOrder: 40 },
  { uid: '5', code: 'OFC', name: '大洋足联', sortOrder: 50 },
  { uid: '6', code: 'CONMEBOL', name: '南美足联', sortOrder: 60 }
];

const COUNTRY_SEEDS: Record<string, SeedCountry> = {
  阿尔及利亚: { uid: '5', name: '阿尔及利亚', confederationCode: 'CAF' },
  布基纳法索: { uid: '9', name: '布基纳法索', confederationCode: 'CAF' },
  喀麦隆: { uid: '11', name: '喀麦隆', confederationCode: 'CAF' },
  埃及: { uid: '16', name: '埃及', confederationCode: 'CAF' },
  赤道几内亚: { uid: '17', name: '赤道几内亚', confederationCode: 'CAF' },
  埃塞俄比亚: { uid: '18', name: '埃塞俄比亚', confederationCode: 'CAF' },
  加纳: { uid: '21', name: '加纳', confederationCode: 'CAF' },
  几内亚: { uid: '22', name: '几内亚', confederationCode: 'CAF' },
  科特迪瓦: { uid: '24', name: '科特迪瓦', confederationCode: 'CAF' },
  利比亚: { uid: '28', name: '利比亚', confederationCode: 'CAF' },
  马里: { uid: '31', name: '马里', confederationCode: 'CAF' },
  摩洛哥: { uid: '34', name: '摩洛哥', confederationCode: 'CAF' },
  尼日利亚: { uid: '38', name: '尼日利亚', confederationCode: 'CAF' },
  塞内加尔: { uid: '41', name: '塞内加尔', confederationCode: 'CAF' },
  南非: { uid: '45', name: '南非', confederationCode: 'CAF' },
  苏丹: { uid: '46', name: '苏丹', confederationCode: 'CAF' },
  刚果: { uid: '49', name: '刚果', confederationCode: 'CAF' },
  突尼斯: { uid: '51', name: '突尼斯', confederationCode: 'CAF' },
  乌干达: { uid: '52', name: '乌干达', confederationCode: 'CAF' },
  民主刚果: { uid: '53', name: '民主刚果', confederationCode: 'CAF' },
  赞比亚: { uid: '54', name: '赞比亚', confederationCode: 'CAF' },
  巴林: { uid: '107', name: '巴林', confederationCode: 'AFC' },
  中国: { uid: '110', name: '中国', confederationCode: 'AFC' },
  中国香港: { uid: '111', name: '中国香港', confederationCode: 'AFC' },
  印度: { uid: '112', name: '印度', confederationCode: 'AFC' },
  伊朗: { uid: '114', name: '伊朗', confederationCode: 'AFC' },
  伊拉克: { uid: '115', name: '伊拉克', confederationCode: 'AFC' },
  日本: { uid: '116', name: '日本', confederationCode: 'AFC' },
  约旦: { uid: '117', name: '约旦', confederationCode: 'AFC' },
  柬埔寨: { uid: '118', name: '柬埔寨', confederationCode: 'AFC' },
  科威特: { uid: '120', name: '科威特', confederationCode: 'AFC' },
  缅甸: { uid: '127', name: '缅甸', confederationCode: 'AFC' },
  朝鲜: { uid: '129', name: '朝鲜', confederationCode: 'AFC' },
  卡塔尔: { uid: '132', name: '卡塔尔', confederationCode: 'AFC' },
  沙特阿拉伯: { uid: '133', name: '沙特阿拉伯', confederationCode: 'AFC' },
  韩国: { uid: '135', name: '韩国', confederationCode: 'AFC' },
  中国台北: { uid: '138', name: '中国台北', confederationCode: 'AFC' },
  泰国: { uid: '140', name: '泰国', confederationCode: 'AFC' },
  阿联酋: { uid: '143', name: '阿联酋', confederationCode: 'AFC' },
  乌兹别克斯坦: { uid: '144', name: '乌兹别克斯坦', confederationCode: 'AFC' },
  越南: { uid: '145', name: '越南', confederationCode: 'AFC' },
  澳大利亚: { uid: '1435', name: '澳大利亚', confederationCode: 'AFC' },
  斐济: { uid: '1437', name: '斐济', confederationCode: 'OFC' },
  新西兰: { uid: '1438', name: '新西兰', confederationCode: 'OFC' },
  巴布亚新几内亚: { uid: '1439', name: '巴布亚新几内亚', confederationCode: 'OFC' },
  所罗门群岛: { uid: '1440', name: '所罗门群岛', confederationCode: 'OFC' },
  塔希提: { uid: '1441', name: '塔希提', confederationCode: 'OFC' },
  瓦努阿图: { uid: '1443', name: '瓦努阿图', confederationCode: 'OFC' },
  新喀里多尼亚: {
    uid: '-',
    name: '新喀里多尼亚',
    confederationCode: 'OFC',
    visibleInCatalogForNew: false
  },
  加拿大: { uid: '364', name: '加拿大', confederationCode: 'CONCACAF' },
  哥斯达黎加: { uid: '366', name: '哥斯达黎加', confederationCode: 'CONCACAF' },
  古巴: { uid: '367', name: '古巴', confederationCode: 'CONCACAF' },
  萨尔瓦多: { uid: '370', name: '萨尔瓦多', confederationCode: 'CONCACAF' },
  危地马拉: { uid: '373', name: '危地马拉', confederationCode: 'CONCACAF' },
  海地: { uid: '375', name: '海地', confederationCode: 'CONCACAF' },
  洪都拉斯: { uid: '376', name: '洪都拉斯', confederationCode: 'CONCACAF' },
  牙买加: { uid: '377', name: '牙买加', confederationCode: 'CONCACAF' },
  墨西哥: { uid: '379', name: '墨西哥', confederationCode: 'CONCACAF' },
  库拉索: { uid: '380', name: '库拉索', confederationCode: 'CONCACAF' },
  巴拿马: { uid: '382', name: '巴拿马', confederationCode: 'CONCACAF' },
  特立尼达和多巴哥: { uid: '389', name: '特立尼达和多巴哥', confederationCode: 'CONCACAF' },
  美国: { uid: '390', name: '美国', confederationCode: 'CONCACAF' },
  瓜德罗普: {
    uid: '-',
    name: '瓜德罗普',
    confederationCode: 'CONCACAF',
    visibleInCatalogForNew: false
  },
  奥地利: { uid: '755', name: '奥地利', confederationCode: 'UEFA' },
  比利时: { uid: '757', name: '比利时', confederationCode: 'UEFA' },
  保加利亚: { uid: '760', name: '保加利亚', confederationCode: 'UEFA' },
  捷克: { uid: '763', name: '捷克', confederationCode: 'UEFA' },
  丹麦: { uid: '764', name: '丹麦', confederationCode: 'UEFA' },
  英格兰: { uid: '765', name: '英格兰', confederationCode: 'UEFA' },
  芬兰: { uid: '768', name: '芬兰', confederationCode: 'UEFA' },
  法国: { uid: '769', name: '法国', confederationCode: 'UEFA' },
  德国: { uid: '771', name: '德国', confederationCode: 'UEFA' },
  希腊: { uid: '772', name: '希腊', confederationCode: 'UEFA' },
  匈牙利: { uid: '773', name: '匈牙利', confederationCode: 'UEFA' },
  以色列: { uid: '775', name: '以色列', confederationCode: 'UEFA' },
  意大利: { uid: '776', name: '意大利', confederationCode: 'UEFA' },
  荷兰: { uid: '784', name: '荷兰', confederationCode: 'UEFA' },
  挪威: { uid: '786', name: '挪威', confederationCode: 'UEFA' },
  波兰: { uid: '787', name: '波兰', confederationCode: 'UEFA' },
  葡萄牙: { uid: '788', name: '葡萄牙', confederationCode: 'UEFA' },
  俄罗斯: { uid: '791', name: '俄罗斯', confederationCode: 'UEFA' },
  西班牙: { uid: '796', name: '西班牙', confederationCode: 'UEFA' },
  瑞典: { uid: '797', name: '瑞典', confederationCode: 'UEFA' },
  瑞士: { uid: '798', name: '瑞士', confederationCode: 'UEFA' },
  土耳其: { uid: '799', name: '土耳其', confederationCode: 'UEFA' },
  威尔士: { uid: '801', name: '威尔士', confederationCode: 'UEFA' },
  塞尔维亚: { uid: '802', name: '塞尔维亚', confederationCode: 'UEFA' },
  斯洛伐克: { uid: '803', name: '斯洛伐克', confederationCode: 'UEFA' },
  英国: {
    uid: '-',
    name: '英国',
    confederationCode: 'UEFA',
    visibleInCatalogForNew: false
  },
  阿根廷: { uid: '1649', name: '阿根廷', confederationCode: 'CONMEBOL' },
  玻利维亚: { uid: '1650', name: '玻利维亚', confederationCode: 'CONMEBOL' },
  巴西: { uid: '1651', name: '巴西', confederationCode: 'CONMEBOL' },
  智利: { uid: '1652', name: '智利', confederationCode: 'CONMEBOL' },
  哥伦比亚: { uid: '1653', name: '哥伦比亚', confederationCode: 'CONMEBOL' },
  厄瓜多尔: { uid: '1654', name: '厄瓜多尔', confederationCode: 'CONMEBOL' },
  巴拉圭: { uid: '1655', name: '巴拉圭', confederationCode: 'CONMEBOL' },
  秘鲁: { uid: '1656', name: '秘鲁', confederationCode: 'CONMEBOL' },
  乌拉圭: { uid: '1657', name: '乌拉圭', confederationCode: 'CONMEBOL' },
  委内瑞拉: { uid: '1658', name: '委内瑞拉', confederationCode: 'CONMEBOL' }
};

const HISTORICAL_COUNTRY_SEEDS: Record<string, SeedHistoricalCountry> = {
  苏联: {
    uid: '583',
    name: '苏联',
    confederationCode: 'UEFA',
    successorNames: ['俄罗斯'],
    redirectName: '俄罗斯'
  },
  西德: {
    uid: '584',
    name: '西德',
    confederationCode: 'UEFA',
    successorNames: ['德国'],
    redirectName: '德国'
  },
  捷克斯洛伐克: {
    uid: '585',
    name: '捷克斯洛伐克',
    confederationCode: 'UEFA',
    successorNames: ['捷克', '斯洛伐克']
  },
  南斯拉夫: {
    uid: '586',
    name: '南斯拉夫',
    confederationCode: 'UEFA',
    successorNames: ['塞尔维亚']
  },
  东德: {
    uid: '-',
    name: '东德',
    confederationCode: 'UEFA',
    successorNames: ['德国'],
    redirectName: '德国'
  },
  德国联队: {
    uid: '-',
    name: '德国联队',
    confederationCode: 'UEFA',
    successorNames: ['德国'],
    redirectName: '德国'
  },
  阿拉伯联合共和国: {
    uid: '-',
    name: '阿拉伯联合共和国',
    confederationCode: 'CAF',
    successorNames: ['埃及'],
    redirectName: '埃及'
  },
  刚果金沙萨: {
    uid: '-',
    name: '刚果金沙萨',
    confederationCode: 'CAF',
    successorNames: ['民主刚果'],
    redirectName: '民主刚果'
  },
  扎伊尔: {
    uid: '-',
    name: '扎伊尔',
    confederationCode: 'CAF',
    successorNames: ['民主刚果'],
    redirectName: '民主刚果'
  },
  南越: {
    uid: '-',
    name: '南越',
    confederationCode: 'AFC',
    successorNames: ['越南'],
    redirectName: '越南'
  },
  新赫布里底: {
    uid: '-',
    name: '新赫布里底',
    confederationCode: 'OFC',
    successorNames: ['瓦努阿图'],
    redirectName: '瓦努阿图'
  },
  荷属安的列斯: {
    uid: '-',
    name: '荷属安的列斯',
    confederationCode: 'CONCACAF',
    successorNames: ['库拉索'],
    redirectName: '库拉索'
  }
};

export function pickSeedCountries(names: string[]) {
  return names.map((name) => pickSeedEntry(COUNTRY_SEEDS, name, 'country'));
}

export function pickHistoricalCountries(names: string[]) {
  return names.map((name) => pickSeedEntry(HISTORICAL_COUNTRY_SEEDS, name, 'historical country'));
}

export function resolveSeedCountries(names: string[]) {
  const countries: SeedCountry[] = [];
  const historicalCountries: SeedHistoricalCountry[] = [];

  for (const name of names) {
    if (COUNTRY_SEEDS[name]) {
      countries.push(COUNTRY_SEEDS[name]);
      continue;
    }

    if (HISTORICAL_COUNTRY_SEEDS[name]) {
      const historicalCountry = HISTORICAL_COUNTRY_SEEDS[name];
      historicalCountries.push(historicalCountry);

      const relatedNames = historicalCountry.redirectName
        ? [...historicalCountry.successorNames, historicalCountry.redirectName]
        : historicalCountry.successorNames;

      for (const relatedName of relatedNames) {
        if (COUNTRY_SEEDS[relatedName]) {
          countries.push(COUNTRY_SEEDS[relatedName]);
        }
      }
      continue;
    }

    throw new Error(`Unknown seed country: ${name}.`);
  }

  return {
    countries: uniqueByName(countries),
    historicalCountries: uniqueByName(historicalCountries)
  };
}

function pickSeedEntry<T>(record: Record<string, T>, name: string, label: string) {
  const item = record[name];

  if (!item) {
    throw new Error(`Unknown seed ${label}: ${name}.`);
  }

  return item;
}

function uniqueByName<T extends { name: string }>(items: T[]) {
  return [...new Map(items.map((item) => [item.name, item])).values()];
}

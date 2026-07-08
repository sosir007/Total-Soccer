import type { CompetitionStandingPlacement } from '@/services/types/competitions';

export interface SemanticTagTheme {
  text: string;
  border: string;
  background: string;
}

export interface SemanticColorToken {
  name: string;
  variant: SemanticTagVariant;
  description: string;
  vars: SemanticTagTheme;
}

export interface SemanticColorGroup {
  key: string;
  label: string;
  description: string;
  colors: SemanticColorToken[];
}

export interface ChartColorToken {
  key: string;
  name: string;
  value: string;
  varName: string;
  description: string;
}

export interface ChartColorGroup {
  key: string;
  label: string;
  description: string;
  colors: ChartColorToken[];
}

export type SemanticTagVariant =
  | 'neutral'
  | 'confed-afc'
  | 'confed-uefa'
  | 'confed-conmebol'
  | 'confed-caf'
  | 'confed-concacaf'
  | 'confed-ofc'
  | 'position-forward'
  | 'position-midfield'
  | 'position-backfield'
  | 'position-goalkeeper'
  | PositionTagVariant
  | 'competition-category-international'
  | 'competition-category-continental'
  | 'competition-category-domestic'
  | 'competition-category-other'
  | 'competition-level-primary'
  | 'competition-level-secondary'
  | 'competition-level-tertiary'
  | 'competition-level-quaternary'
  | 'status-enabled'
  | 'status-disabled'
  | 'status-included'
  | 'status-excluded'
  | 'status-active'
  | 'status-retired'
  | 'status-living'
  | 'status-deceased'
  | 'status-success'
  | 'status-failed'
  | 'status-representative'
  | 'status-legend'
  | 'status-top-award'
  | 'object-country'
  | 'object-club'
  | 'object-player'
  | 'object-competition'
  | 'object-award'
  | PlacementTagVariant
  | AbilityTagVariant;

export type PlacementTagVariant =
  | 'placement-champion'
  | 'placement-runner-up'
  | 'placement-third-place'
  | 'placement-fourth-place'
  | 'placement-semi-finalist';

export type AbilityTagVariant =
  | 'ability-legend'
  | 'ability-elite'
  | 'ability-superstar'
  | 'ability-first-class'
  | 'ability-excellent'
  | 'ability-starter'
  | 'ability-rotation'
  | 'ability-prospect'
  | 'ability-normal'
  | 'ability-basic'
  | 'ability-muted';

export type PositionTagVariant =
  | 'position-st'
  | 'position-aml'
  | 'position-amr'
  | 'position-amc'
  | 'position-mc'
  | 'position-dmc'
  | 'position-ml'
  | 'position-mr'
  | 'position-wbl'
  | 'position-wbr'
  | 'position-dl'
  | 'position-dc'
  | 'position-dr'
  | 'position-gk';

export const semanticTagThemes: Record<SemanticTagVariant, SemanticTagTheme> = {
  neutral: tagVars('neutral'),
  'confed-afc': tagVars('confed-afc'),
  'confed-uefa': tagVars('confed-uefa'),
  'confed-conmebol': tagVars('confed-conmebol'),
  'confed-caf': tagVars('confed-caf'),
  'confed-concacaf': tagVars('confed-concacaf'),
  'confed-ofc': tagVars('confed-ofc'),
  'position-forward': tagVars('position-forward'),
  'position-midfield': tagVars('position-midfield'),
  'position-backfield': tagVars('position-backfield'),
  'position-goalkeeper': tagVars('position-goalkeeper'),
  'position-st': tagVars('position-st'),
  'position-aml': tagVars('position-aml'),
  'position-amr': tagVars('position-amr'),
  'position-amc': tagVars('position-amc'),
  'position-mc': tagVars('position-mc'),
  'position-dmc': tagVars('position-dmc'),
  'position-ml': tagVars('position-ml'),
  'position-mr': tagVars('position-mr'),
  'position-wbl': tagVars('position-wbl'),
  'position-wbr': tagVars('position-wbr'),
  'position-dl': tagVars('position-dl'),
  'position-dc': tagVars('position-dc'),
  'position-dr': tagVars('position-dr'),
  'position-gk': tagVars('position-gk'),
  'competition-category-international': tagVars('competition-category-international'),
  'competition-category-continental': tagVars('competition-category-continental'),
  'competition-category-domestic': tagVars('competition-category-domestic'),
  'competition-category-other': tagVars('competition-category-other'),
  'competition-level-primary': tagVars('competition-level-primary'),
  'competition-level-secondary': tagVars('competition-level-secondary'),
  'competition-level-tertiary': tagVars('competition-level-tertiary'),
  'competition-level-quaternary': tagVars('competition-level-quaternary'),
  'status-enabled': tagVars('status-enabled'),
  'status-disabled': tagVars('status-disabled'),
  'status-included': tagVars('status-included'),
  'status-excluded': tagVars('status-excluded'),
  'status-active': tagVars('status-active'),
  'status-retired': tagVars('status-retired'),
  'status-living': tagVars('status-living'),
  'status-deceased': tagVars('status-deceased'),
  'status-success': tagVars('status-success'),
  'status-failed': tagVars('status-failed'),
  'status-representative': tagVars('status-representative'),
  'status-legend': tagVars('status-legend'),
  'status-top-award': tagVars('status-top-award'),
  'object-country': tagVars('object-country'),
  'object-club': tagVars('object-club'),
  'object-player': tagVars('object-player'),
  'object-competition': tagVars('object-competition'),
  'object-award': tagVars('object-award'),
  'placement-champion': tagVars('placement-champion'),
  'placement-runner-up': tagVars('placement-runner-up'),
  'placement-third-place': tagVars('placement-third-place'),
  'placement-fourth-place': tagVars('placement-fourth-place'),
  'placement-semi-finalist': tagVars('placement-semi-finalist'),
  'ability-legend': tagVars('ability-legend'),
  'ability-elite': tagVars('ability-elite'),
  'ability-superstar': tagVars('ability-superstar'),
  'ability-first-class': tagVars('ability-first-class'),
  'ability-excellent': tagVars('ability-excellent'),
  'ability-starter': tagVars('ability-starter'),
  'ability-rotation': tagVars('ability-rotation'),
  'ability-prospect': tagVars('ability-prospect'),
  'ability-normal': tagVars('ability-normal'),
  'ability-basic': tagVars('ability-basic'),
  'ability-muted': tagVars('ability-muted')
};

export const abilityLevelLabels: Record<AbilityTagVariant, string> = {
  'ability-legend': '传奇',
  'ability-elite': '顶级',
  'ability-superstar': '巨星',
  'ability-first-class': '一流',
  'ability-excellent': '优秀',
  'ability-starter': '主力',
  'ability-rotation': '轮换',
  'ability-prospect': '潜力/合格',
  'ability-normal': '普通',
  'ability-basic': '基础',
  'ability-muted': '未分'
};

export const semanticColorGroups: SemanticColorGroup[] = [
  {
    key: 'base',
    label: '基础',
    description: '通用中性色，用于无明确业务语义的标签和兜底展示。',
    colors: [colorToken('neutral', '中性', '默认标签、未知值、低强调信息。')]
  },
  {
    key: 'confederation',
    label: '足联',
    description: '六大足联标签配色，用于国家、俱乐部、球员和荣誉矩阵中的足联展示。',
    colors: [
      colorToken('confed-afc', '亚足联', 'AFC / 亚洲相关对象。'),
      colorToken('confed-uefa', '欧足联', 'UEFA / 欧洲相关对象。'),
      colorToken('confed-conmebol', '南美足联', 'CONMEBOL / 南美相关对象。'),
      colorToken('confed-caf', '非足联', 'CAF / 非洲相关对象。'),
      colorToken('confed-concacaf', '中北美足联', 'CONCACAF / 中北美及加勒比相关对象。'),
      colorToken('confed-ofc', '大洋足联', 'OFC / 大洋洲相关对象。')
    ]
  },
  {
    key: 'position',
    label: '位置',
    description: '球员位置组和具体位置配色，用于选择器、阵容和球员列表中的位置识别。',
    colors: [
      colorToken('position-forward', '前场', '前锋、边锋等前场球员。'),
      colorToken('position-midfield', '中场', '中前卫、后腰、前腰等中场球员。'),
      colorToken('position-backfield', '后场', '中卫、边卫等后场球员。'),
      colorToken('position-goalkeeper', '门将', '守门员。'),
      colorToken('position-st', 'ST', '中锋，归属前场。'),
      colorToken('position-aml', 'AML', '左边锋 / 左前场，归属前场。'),
      colorToken('position-amr', 'AMR', '右边锋 / 右前场，归属前场。'),
      colorToken('position-amc', 'AMC', '前腰，归属中场。'),
      colorToken('position-mc', 'MC', '中前卫，归属中场。'),
      colorToken('position-dmc', 'DMC', '后腰，归属中场。'),
      colorToken('position-ml', 'ML', '左中场，归属中场。'),
      colorToken('position-mr', 'MR', '右中场，归属中场。'),
      colorToken('position-wbl', 'WBL', '左翼卫，归属中场。'),
      colorToken('position-wbr', 'WBR', '右翼卫，归属中场。'),
      colorToken('position-dl', 'DL', '左后卫，归属后场。'),
      colorToken('position-dc', 'DC', '中后卫，归属后场。'),
      colorToken('position-dr', 'DR', '右后卫，归属后场。'),
      colorToken('position-gk', 'GK', '门将。')
    ]
  },
  {
    key: 'competition-category',
    label: '赛事分类',
    description: '赛事管理和详情中的分类标签。',
    colors: [
      colorToken('competition-category-international', '国际', '全球性国际赛事。'),
      colorToken('competition-category-continental', '洲际', '洲际赛事。'),
      colorToken('competition-category-domestic', '国内', '国内联赛和杯赛。'),
      colorToken('competition-category-other', '其他', '无法归入以上分类的赛事。')
    ]
  },
  {
    key: 'competition-level',
    label: '赛事级别',
    description: '赛事管理、规则和详情中的级别标签。',
    colors: [
      colorToken('competition-level-primary', '一级', '最高级别赛事。'),
      colorToken('competition-level-secondary', '二级', '第二级别赛事。'),
      colorToken('competition-level-tertiary', '三级', '第三级别赛事。'),
      colorToken('competition-level-quaternary', '四级', '第四级别赛事。')
    ]
  },
  {
    key: 'status',
    label: '状态',
    description: '启停、统计纳入、人物状态和操作结果等状态标签。',
    colors: [
      colorToken('status-enabled', '启用', '配置或规则启用。'),
      colorToken('status-disabled', '停用', '配置或规则停用。'),
      colorToken('status-included', '纳入统计', '赛事或对象纳入统计。'),
      colorToken('status-excluded', '排除统计', '赛事或对象不纳入统计。'),
      colorToken('status-active', '现役', '球员现役状态。'),
      colorToken('status-retired', '退役', '球员退役状态。'),
      colorToken('status-living', '在世', '球员在世状态。'),
      colorToken('status-deceased', '已故', '球员已故状态。'),
      colorToken('status-success', '成功', '成功结果或审计记录。'),
      colorToken('status-failed', '失败', '失败结果或异常记录。'),
      colorToken('status-representative', '代表', '代表人物、代表阵容等。'),
      colorToken('status-legend', '传奇', '传奇、名宿、重点标识。'),
      colorToken('status-top-award', '顶级奖项', '顶级奖项和重要荣誉标签。')
    ]
  },
  {
    key: 'object',
    label: '对象类型',
    description: '国家队、俱乐部、球员、赛事和奖项等对象标签。',
    colors: [
      colorToken('object-country', '国家队', '国家队对象。'),
      colorToken('object-club', '俱乐部', '俱乐部对象。'),
      colorToken('object-player', '球员', '球员对象。'),
      colorToken('object-competition', '赛事', '赛事对象。'),
      colorToken('object-award', '奖项', '奖项对象。')
    ]
  },
  {
    key: 'placement',
    label: '名次',
    description: '冠军、亚军、季军、殿军和四强的名次强调色。',
    colors: [
      colorToken('placement-champion', '冠军', '冠军名次、年份和统计数字。'),
      colorToken('placement-runner-up', '亚军', '亚军名次、年份和统计数字。'),
      colorToken('placement-third-place', '季军', '季军名次、年份和统计数字。'),
      colorToken('placement-fourth-place', '殿军', '殿军名次、年份和统计数字。'),
      colorToken('placement-semi-finalist', '四强', '无三四名赛时的半决赛负者。')
    ]
  },
  {
    key: 'ability',
    label: 'PA/CA',
    description: '球员 PA/CA 能力值区间徽标。',
    colors: [
      colorToken('ability-legend', '传奇', 'PA/CA 190-200。'),
      colorToken('ability-elite', '顶级', 'PA/CA 180-189。'),
      colorToken('ability-superstar', '巨星', 'PA/CA 170-179。'),
      colorToken('ability-first-class', '一流', 'PA/CA 160-169。'),
      colorToken('ability-excellent', '优秀', 'PA/CA 150-159。'),
      colorToken('ability-starter', '主力', 'PA/CA 140-149。'),
      colorToken('ability-rotation', '轮换', 'PA/CA 130-139。'),
      colorToken('ability-prospect', '潜力/合格', 'PA/CA 120-129。'),
      colorToken('ability-normal', '普通', 'PA/CA 111-119。'),
      colorToken('ability-basic', '基础', 'PA/CA 100-110。'),
      colorToken('ability-muted', '未分', '小于 100、空值或非法值。')
    ]
  }
];

export const chartColorGroups: ChartColorGroup[] = [
  {
    key: 'chart',
    label: '图表',
    description: 'ECharts series 调色板，用于折线、柱状、饼图等数据可视化。',
    colors: [
      chartColorToken('chart-series-blue', '鲜蓝', '#5470c6', '默认主序列、核心指标。'),
      chartColorToken('chart-series-green', '明绿', '#91cc75', '第二序列、正向或增长数据。'),
      chartColorToken('chart-series-gold', '亮金', '#fac858', '第三序列、重点对比数据。'),
      chartColorToken('chart-series-coral', '珊瑚', '#ee6666', '第四序列、变化或警示数据。'),
      chartColorToken('chart-series-sky', '天蓝', '#73c0de', '第五序列、结构分布。'),
      chartColorToken('chart-series-emerald', '翠绿', '#3ba272', '第六序列、补充分类。'),
      chartColorToken('chart-series-orange', '橙色', '#fc8452', '第七序列、暖色补充。'),
      chartColorToken('chart-series-violet', '紫色', '#9a60b4', '第八序列、多分类补充。'),
      chartColorToken('chart-series-pink', '粉紫', '#ea7ccc', '第九序列、醒目补充。'),
      chartColorToken('chart-series-mauve', '灰紫', '#6e7079', '第十序列、中性数据。')
    ]
  }
];

const chartCategoricalPalette = chartColorGroups[0].colors.map((color) => color.value);

export const chartPalette = {
  primary: ['#5470c6'],
  accent: ['#fac858'],
  categorical: chartCategoricalPalette,
  compactCategorical: chartCategoricalPalette.slice(0, 5),
  neutral: ['#6e7079']
};

export function getSemanticTagStyle(variant?: string | null) {
  const theme = semanticTagThemes[normalizeSemanticVariant(variant)];

  return {
    color: theme.text,
    borderColor: theme.border,
    background: theme.background
  };
}

export function normalizeSemanticVariant(variant?: string | null): SemanticTagVariant {
  if (variant && variant in semanticTagThemes) {
    return variant as SemanticTagVariant;
  }

  return 'neutral';
}

export function getConfederationVariant(value?: string | null): SemanticTagVariant {
  if (/亚足联|亚洲|AFC/i.test(value ?? '')) return 'confed-afc';
  if (/欧足联|欧洲|UEFA/i.test(value ?? '')) return 'confed-uefa';
  if (/南美|CONMEBOL/i.test(value ?? '')) return 'confed-conmebol';
  if (/非足联|非洲|CAF/i.test(value ?? '')) return 'confed-caf';
  if (/中北美|北中美|加勒比|CONCACAF/i.test(value ?? '')) return 'confed-concacaf';
  if (/大洋足联|大洋洲|OFC/i.test(value ?? '')) return 'confed-ofc';

  return 'neutral';
}

export function getCareerStatusVariant(retired?: boolean | null): SemanticTagVariant {
  if (retired === true) return 'status-retired';
  if (retired === false) return 'status-active';

  return 'neutral';
}

export function getCareerStatusLabel(retired?: boolean | null) {
  if (retired === true) return '退役';
  if (retired === false) return '现役';

  return '-';
}

export function getLifeStatusVariant(deceased?: boolean | null): SemanticTagVariant {
  if (deceased === true) return 'status-deceased';
  if (deceased === false) return 'status-living';

  return 'neutral';
}

export function getLifeStatusLabel(deceased?: boolean | null) {
  if (deceased === true) return '已故';
  if (deceased === false) return '在世';

  return '-';
}

export function getPositionVariant(value?: string | null): SemanticTagVariant {
  const normalizedValue = String(value ?? '')
    .trim()
    .toUpperCase();
  const map: Record<string, SemanticTagVariant> = {
    前场: 'position-forward',
    中场: 'position-midfield',
    后场: 'position-backfield',
    门将: 'position-goalkeeper',
    ST: 'position-st',
    AML: 'position-aml',
    AMR: 'position-amr',
    AMC: 'position-amc',
    MC: 'position-mc',
    DMC: 'position-dmc',
    ML: 'position-ml',
    MR: 'position-mr',
    WBL: 'position-wbl',
    WBR: 'position-wbr',
    DL: 'position-dl',
    DC: 'position-dc',
    DR: 'position-dr',
    GK: 'position-gk',
    中锋: 'position-st',
    前锋: 'position-st',
    左边锋: 'position-aml',
    右边锋: 'position-amr',
    前腰: 'position-amc',
    中前卫: 'position-mc',
    后腰: 'position-dmc',
    左中场: 'position-ml',
    右中场: 'position-mr',
    左翼卫: 'position-wbl',
    右翼卫: 'position-wbr',
    左后卫: 'position-dl',
    中后卫: 'position-dc',
    右后卫: 'position-dr',
    守门员: 'position-gk'
  };

  return map[normalizedValue] ?? map[value ?? ''] ?? 'neutral';
}

export function getCompetitionCategoryVariant(value?: string | null): SemanticTagVariant {
  const map: Record<string, SemanticTagVariant> = {
    国际: 'competition-category-international',
    洲际: 'competition-category-continental',
    国内: 'competition-category-domestic',
    其他: 'competition-category-other'
  };

  return map[value ?? ''] ?? 'competition-category-other';
}

export function getCompetitionLevelVariant(value?: string | null): SemanticTagVariant {
  const map: Record<string, SemanticTagVariant> = {
    一级: 'competition-level-primary',
    二级: 'competition-level-secondary',
    三级: 'competition-level-tertiary',
    四级: 'competition-level-quaternary'
  };

  return map[value ?? ''] ?? 'neutral';
}

export function getPlacementVariant(
  placement?: CompetitionStandingPlacement | null
): PlacementTagVariant {
  const map: Record<CompetitionStandingPlacement, PlacementTagVariant> = {
    CHAMPION: 'placement-champion',
    RUNNER_UP: 'placement-runner-up',
    THIRD_PLACE: 'placement-third-place',
    FOURTH_PLACE: 'placement-fourth-place',
    SEMI_FINALIST: 'placement-semi-finalist'
  };

  return placement ? map[placement] : 'placement-semi-finalist';
}

export function getPlacementTextColor(placement?: CompetitionStandingPlacement | null) {
  return getSemanticTagStyle(getPlacementVariant(placement)).color;
}

export function getPlayerStatusVariant(player: {
  deceased?: boolean | null;
  retired?: boolean | null;
}) {
  if (player.deceased) return 'status-deceased';
  if (player.retired) return 'status-retired';

  return 'status-active';
}

export function getPlayerStatusLabel(player: {
  deceased?: boolean | null;
  retired?: boolean | null;
}) {
  if (player.deceased) return '已故';
  if (player.retired) return '退役';

  return '现役';
}

export function getAbilityVariant(value?: string | number | null): AbilityTagVariant {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 100) return 'ability-muted';
  if (numericValue >= 190) return 'ability-legend';
  if (numericValue >= 180) return 'ability-elite';
  if (numericValue >= 170) return 'ability-superstar';
  if (numericValue >= 160) return 'ability-first-class';
  if (numericValue >= 150) return 'ability-excellent';
  if (numericValue >= 140) return 'ability-starter';
  if (numericValue >= 130) return 'ability-rotation';
  if (numericValue >= 120) return 'ability-prospect';
  if (numericValue >= 111) return 'ability-normal';

  return 'ability-basic';
}

function tagVars(name: string): SemanticTagTheme {
  return {
    text: `var(--tag-${name}-text)`,
    border: `var(--tag-${name}-border)`,
    background: `var(--tag-${name}-bg)`
  };
}

function colorToken(
  variant: SemanticTagVariant,
  name: string,
  description: string
): SemanticColorToken {
  return {
    name,
    variant,
    description,
    vars: {
      text: `--tag-${variant}-text`,
      border: `--tag-${variant}-border`,
      background: `--tag-${variant}-bg`
    }
  };
}

function chartColorToken(
  key: string,
  name: string,
  value: string,
  description: string
): ChartColorToken {
  return {
    key,
    name,
    value,
    description,
    varName: `--${key}`
  };
}

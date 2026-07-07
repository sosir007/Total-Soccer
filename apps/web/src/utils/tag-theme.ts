import type { CompetitionStandingPlacement } from '@/services/types/competitions';

export interface SemanticTagTheme {
  text: string;
  border: string;
  background: string;
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
  'ability-legend': '传奇级',
  'ability-elite': '顶级',
  'ability-superstar': '巨星',
  'ability-first-class': '一流',
  'ability-excellent': '优秀',
  'ability-starter': '主力',
  'ability-rotation': '轮换',
  'ability-prospect': '潜力/合格',
  'ability-normal': '普通',
  'ability-basic': '基础',
  'ability-muted': '未分级'
};

export const chartPalette = {
  primary: ['#1f8b55'],
  gold: ['#c89436'],
  categorical: ['#1f8b55', '#c89436', '#2563eb', '#dc2626', '#7c3aed', '#0e7490', '#a16207'],
  compactCategorical: ['#1f8b55', '#c89436', '#2563eb', '#dc2626', '#7c3aed']
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

export function getPositionVariant(value?: string | null): SemanticTagVariant {
  const map: Record<string, SemanticTagVariant> = {
    前场: 'position-forward',
    中场: 'position-midfield',
    后场: 'position-backfield',
    门将: 'position-goalkeeper'
  };

  return map[value ?? ''] ?? 'neutral';
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

import {
  AwardScopeType,
  AwardTargetType,
  CompetitionScopeType,
  CompetitionTargetType,
  HonorRuleConversionType,
  HonorRulePlacementScope
} from '@prisma/client';

export const EVENT_TEAM_BONUS_COMPETITION_CODE_BY_AWARD_CODE = {
  FIFA_WORLD_CUP_FAIR_PLAY_TROPHY: 'FIFA_WORLD_CUP',
  FIFA_CONFEDERATIONS_CUP_FAIR_PLAY_TROPHY: 'FIFA_CONFEDERATIONS_CUP',
  COPA_AMERICA_FAIR_PLAY_AWARD: 'COPA_AMERICA'
} as const;

export const EVENT_TEAM_BONUS_COMPETITION_CODES = [
  ...new Set(Object.values(EVENT_TEAM_BONUS_COMPETITION_CODE_BY_AWARD_CODE))
];

export type TeamBonusRuleForScoring = {
  targetType: AwardTargetType;
  scopeType: AwardScopeType | null;
  category: string | null;
  placement: string | null;
  rank: number | null;
  baseScore: number;
  coefficient: number;
};

export type HonorRuleForTeamBonusScoring = {
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType | null;
  category: string | null;
  level: string | null;
  format: string | null;
  placementScope: HonorRulePlacementScope;
  conversionType: HonorRuleConversionType;
  qualityCoefficient: number;
  coefficients: Array<{
    confederationId: string | null;
    countryId: string | null;
    coefficient: number;
  }>;
};

export type CompetitionForTeamBonusScoring = {
  code: string;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category: string | null;
  level: string | null;
  format: string | null;
  confederationId: string | null;
  countryId: string | null;
  scopeConfederations: Array<{ confederationId: string }>;
  scopeCountries: Array<{ countryId: string }>;
  editions: Array<{ year: number | null; quantity: number | null }>;
};

export type TeamBonusRecipientForScoring = {
  rank: number | null;
  placement: string | null;
  edition: {
    year: number | null;
    award: {
      code: string;
      targetType: AwardTargetType;
      scopeType: AwardScopeType | null;
      category: string | null;
    };
  };
};

export function resolveTeamBonusScore(input: {
  rule: TeamBonusRuleForScoring;
  recipient: TeamBonusRecipientForScoring;
  honorRules: HonorRuleForTeamBonusScoring[];
  competitionMap: Map<string, CompetitionForTeamBonusScoring>;
}) {
  const eventCoefficient = resolveEventTeamBonusCoefficient(
    input.recipient,
    input.honorRules,
    input.competitionMap
  );
  const coefficient = eventCoefficient ?? input.rule.coefficient;
  const rawScore = input.rule.baseScore * coefficient;

  return {
    rawScore,
    score: round(rawScore),
    baseScore: input.rule.baseScore,
    coefficient: round(coefficient)
  };
}

function resolveEventTeamBonusCoefficient(
  recipient: TeamBonusRecipientForScoring,
  honorRules: HonorRuleForTeamBonusScoring[],
  competitionMap: Map<string, CompetitionForTeamBonusScoring>
) {
  const competitionCode =
    EVENT_TEAM_BONUS_COMPETITION_CODE_BY_AWARD_CODE[
      recipient.edition.award.code as keyof typeof EVENT_TEAM_BONUS_COMPETITION_CODE_BY_AWARD_CODE
    ];

  if (!competitionCode) {
    return null;
  }

  const competition = competitionMap.get(competitionCode);

  if (!competition) {
    return null;
  }

  const rule = findMatchingHonorRule(honorRules, competition);

  if (!rule) {
    return null;
  }

  const edition = findCompetitionEditionByYear(competition, recipient.edition.year);

  return (
    resolveQualityCoefficient(rule, competition) *
    resolveConversionCoefficient(
      rule,
      competition,
      recipient.edition.year,
      edition?.quantity ?? null
    )
  );
}

function findMatchingHonorRule(
  rules: HonorRuleForTeamBonusScoring[],
  competition: CompetitionForTeamBonusScoring
) {
  return rules.find((rule) => {
    if (rule.targetType !== competition.targetType) {
      return false;
    }

    if (rule.scopeType && rule.scopeType !== competition.scopeType) {
      return false;
    }

    if (rule.category && normalize(rule.category) !== normalize(competition.category)) {
      return false;
    }

    if (rule.level && normalize(rule.level) !== normalize(competition.level)) {
      return false;
    }

    if (rule.format && normalize(rule.format) !== normalize(competition.format)) {
      return false;
    }

    return scopeAllowsChampion(rule);
  });
}

function scopeAllowsChampion(rule: HonorRuleForTeamBonusScoring) {
  return [
    HonorRulePlacementScope.CHAMPION_ONLY,
    HonorRulePlacementScope.TOP_TWO,
    HonorRulePlacementScope.TOP_THREE,
    HonorRulePlacementScope.TOP_FOUR,
    HonorRulePlacementScope.LEAGUE_TOP_THREE
  ].includes(rule.placementScope);
}

function resolveQualityCoefficient(
  rule: HonorRuleForTeamBonusScoring,
  competition: CompetitionForTeamBonusScoring
) {
  const confederationIds = competitionConfederationIds(competition);
  const countryIds = competitionCountryIds(competition);
  const coefficient = rule.coefficients.find(
    (item) =>
      (item.confederationId && confederationIds.includes(item.confederationId)) ||
      (item.countryId && countryIds.includes(item.countryId))
  );

  return coefficient?.coefficient ?? rule.qualityCoefficient;
}

function resolveConversionCoefficient(
  rule: HonorRuleForTeamBonusScoring,
  competition: CompetitionForTeamBonusScoring,
  year: number | null,
  quantity: number | null
) {
  if (rule.conversionType === HonorRuleConversionType.FREQUENCY_SCALE) {
    return frequencyCoefficient(competition) * scaleCoefficient(competition, quantity);
  }

  if (rule.conversionType === HonorRuleConversionType.OLYMPIC_STAGE) {
    if (!year) return 1;
    if (year <= 1928) return 3;
    if (year <= 1980) return 2;
    if (year <= 1988) return 1.5;
    return 1;
  }

  if (rule.conversionType === HonorRuleConversionType.CLUB_WORLD_CUP_STAGE) {
    if (!year) return 1;
    return year < 2025 ? 0.5 : 1;
  }

  return 1;
}

function findCompetitionEditionByYear(
  competition: CompetitionForTeamBonusScoring,
  year: number | null
) {
  if (!year) {
    return null;
  }

  return competition.editions.find((edition) => edition.year === year) ?? null;
}

function frequencyCoefficient(competition: CompetitionForTeamBonusScoring) {
  const years = competition.editions.map((edition) => edition.year).filter(isNumber);

  if (years.length < 2) {
    return 1;
  }

  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);
  const averageGap = (lastYear - firstYear) / (years.length - 1);

  return Math.min(averageGap / 4, 1);
}

function scaleCoefficient(competition: CompetitionForTeamBonusScoring, quantity: number | null) {
  const resolvedQuantity =
    quantity ?? median(competition.editions.map((edition) => edition.quantity));

  if (!resolvedQuantity) return 1;
  if (resolvedQuantity >= 24) return 1;
  if (resolvedQuantity >= 16) return 0.9;
  if (resolvedQuantity >= 10) return 0.75;
  if (resolvedQuantity >= 8) return 0.65;
  if (resolvedQuantity >= 4) return 0.5;
  if (resolvedQuantity === 3) return 0.35;
  if (resolvedQuantity === 2) return 0.25;
  return 0;
}

function median(values: Array<number | null>) {
  const numbers = values.filter(isNumber).sort((a, b) => a - b);

  if (!numbers.length) return null;

  const middle = Math.floor(numbers.length / 2);

  if (numbers.length % 2) {
    return numbers[middle];
  }

  return (numbers[middle - 1] + numbers[middle]) / 2;
}

function competitionConfederationIds(competition: CompetitionForTeamBonusScoring) {
  return [
    competition.confederationId,
    ...competition.scopeConfederations.map((item) => item.confederationId)
  ].filter((id): id is string => Boolean(id));
}

function competitionCountryIds(competition: CompetitionForTeamBonusScoring) {
  return [
    competition.countryId,
    ...competition.scopeCountries.map((item) => item.countryId)
  ].filter((id): id is string => Boolean(id));
}

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function isNumber(value: number | null): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

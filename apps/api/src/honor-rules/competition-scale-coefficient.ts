const FULL_SCALE_COMPETITION_CODES = new Set(['UEFA_EURO']);

export function competitionScaleCoefficient(
  competitionCode: string,
  quantity: number | null | undefined
) {
  if (FULL_SCALE_COMPETITION_CODES.has(competitionCode)) return 1;
  if (!quantity) return 1;
  if (quantity >= 24) return 1;
  if (quantity >= 16) return 0.9;
  if (quantity >= 10) return 0.75;
  if (quantity >= 8) return 0.65;
  if (quantity >= 4) return 0.5;
  if (quantity === 3) return 0.35;
  if (quantity === 2) return 0.25;
  return 0;
}

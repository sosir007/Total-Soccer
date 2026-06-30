import type { HonorRecord } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';

export const placementOptions: Array<{ label: string; value: CompetitionStandingPlacement }> = [
  { label: '冠军', value: 'CHAMPION' },
  { label: '亚军', value: 'RUNNER_UP' },
  { label: '季军', value: 'THIRD_PLACE' },
  { label: '殿军', value: 'FOURTH_PLACE' },
  { label: '四强', value: 'SEMI_FINALIST' }
];

export const placementLabels = Object.fromEntries(
  placementOptions.map((placement) => [placement.value, placement.label])
) as Record<CompetitionStandingPlacement, string>;

export const placementIconNames: Record<CompetitionStandingPlacement, string> = {
  CHAMPION: 'first',
  RUNNER_UP: 'second',
  THIRD_PLACE: 'third',
  FOURTH_PLACE: 'fourth',
  SEMI_FINALIST: 'rank'
};

export function formatPlacement(value?: CompetitionStandingPlacement | null) {
  return value ? placementLabels[value] : '-';
}

export function formatHonorSubject(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

export function formatHonorEdition(record: HonorRecord) {
  return record.edition.season || record.edition.name;
}

export function getStandingName(record: HonorRecord, placement: CompetitionStandingPlacement) {
  return record.standings[placement]?.name ?? '-';
}

export function getStandingRef(record: HonorRecord, placement: CompetitionStandingPlacement) {
  return record.standings[placement] ?? null;
}

export function getCountryEntityLinkId(ref?: NamedRef | null) {
  if (!ref) {
    return null;
  }

  if (ref.isHistorical) {
    return ref.detailRedirectCountryId ?? null;
  }

  return ref.id;
}

export function shouldHideCountryLink(ref?: NamedRef | null) {
  return Boolean(ref?.isHistorical && !ref?.detailRedirectCountryId);
}

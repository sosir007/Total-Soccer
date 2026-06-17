import type { HonorRecord, NamedRef } from '@/services/catalog';
import type { CompetitionStandingPlacement } from '@/services/competitions';

export const placementOptions: Array<{ label: string; value: CompetitionStandingPlacement }> = [
  { label: '冠军', value: 'CHAMPION' },
  { label: '亚军', value: 'RUNNER_UP' },
  { label: '季军', value: 'THIRD_PLACE' },
  { label: '殿军', value: 'FOURTH_PLACE' }
];

export const placementLabels = Object.fromEntries(
  placementOptions.map((placement) => [placement.value, placement.label])
) as Record<CompetitionStandingPlacement, string>;

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

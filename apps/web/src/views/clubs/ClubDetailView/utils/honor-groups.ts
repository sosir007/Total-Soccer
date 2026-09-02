import type { HonorGroupedPlacementEntry, HonorGroupedRecord } from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';

const ENGLISH_TOP_FLIGHT_CODES = ['ENGLAND_PREMIER_LEAGUE', 'ENGLAND_FIRST_DIVISION'] as const;
const ENGLISH_TOP_FLIGHT_CODE_SET = new Set<string>(ENGLISH_TOP_FLIGHT_CODES);

export function mergeEnglishTopFlightGroups(groups: HonorGroupedRecord[]) {
  const topFlightGroups = groups.filter((group) =>
    ENGLISH_TOP_FLIGHT_CODE_SET.has(group.competition.code)
  );

  if (topFlightGroups.length < ENGLISH_TOP_FLIGHT_CODES.length) {
    return groups;
  }

  const primaryGroup =
    topFlightGroups.find((group) => group.competition.code === 'ENGLAND_PREMIER_LEAGUE') ??
    topFlightGroups[0];
  const mergedGroup: HonorGroupedRecord = {
    competition: {
      ...primaryGroup.competition,
      id: ENGLISH_TOP_FLIGHT_CODES.join('__'),
      code: 'ENGLAND_TOP_FLIGHT',
      name: topFlightGroups.map((group) => group.competition.name).join(' / '),
      shortName: '英格兰顶级联赛',
      lifecycleStatus: 'CURRENT'
    },
    titleLinks: ENGLISH_TOP_FLIGHT_CODES.flatMap((code) => {
      const group = topFlightGroups.find((item) => item.competition.code === code);
      return group ? [{ id: group.competition.id, name: group.competition.name }] : [];
    }),
    placements: mergePlacements(topFlightGroups)
  };
  const firstTopFlightIndex = groups.findIndex((group) =>
    ENGLISH_TOP_FLIGHT_CODE_SET.has(group.competition.code)
  );
  const result = groups.filter((group) => !ENGLISH_TOP_FLIGHT_CODE_SET.has(group.competition.code));

  result.splice(firstTopFlightIndex, 0, mergedGroup);

  return result;
}

function mergePlacements(groups: HonorGroupedRecord[]) {
  const placements: HonorGroupedRecord['placements'] = {};

  for (const group of groups) {
    for (const [placement, entries] of Object.entries(group.placements)) {
      const key = placement as CompetitionStandingPlacement;
      placements[key] = [...(placements[key] ?? []), ...(entries ?? [])].sort(compareHonorEntry);
    }
  }

  return placements;
}

function compareHonorEntry(left: HonorGroupedPlacementEntry, right: HonorGroupedPlacementEntry) {
  return (
    (left.year ?? 0) - (right.year ?? 0) ||
    (left.season ?? left.label).localeCompare(right.season ?? right.label, 'zh-CN')
  );
}

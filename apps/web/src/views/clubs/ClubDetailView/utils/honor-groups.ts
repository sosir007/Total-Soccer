import type { HonorGroupedPlacementEntry, HonorGroupedRecord } from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';

const ENGLISH_TOP_FLIGHT_CODES = ['ENGLAND_PREMIER_LEAGUE', 'ENGLAND_FIRST_DIVISION'] as const;
const ENGLISH_SECOND_TIER_CODES = ['ENGLAND_CHAMPIONSHIP', 'ENGLAND_SECOND_DIVISION'] as const;
const GERMAN_TOP_FLIGHT_CODES = ['GERMANY_BUNDESLIGA', 'GERMAN_FOOTBALL_CHAMPIONSHIP'] as const;

export function mergeEnglishTopFlightGroups(groups: HonorGroupedRecord[]) {
  // 这里按赛事 code 合并，不按俱乐部国别过滤；威尔士等参加英格兰联赛的俱乐部也会自然命中。
  return mergeTopFlightGroups(groups, {
    codes: ENGLISH_TOP_FLIGHT_CODES,
    code: 'ENGLAND_TOP_FLIGHT',
    shortName: '英格兰顶级联赛'
  });
}

export function mergeEnglishSecondTierGroups(groups: HonorGroupedRecord[]) {
  return mergeTopFlightGroups(groups, {
    codes: ENGLISH_SECOND_TIER_CODES,
    code: 'ENGLAND_SECOND_TIER',
    shortName: '英格兰第二级联赛'
  });
}

export function mergeGermanTopFlightGroups(groups: HonorGroupedRecord[]) {
  return mergeTopFlightGroups(groups, {
    codes: GERMAN_TOP_FLIGHT_CODES,
    code: 'GERMANY_TOP_FLIGHT',
    shortName: '德国顶级联赛'
  });
}

function mergeTopFlightGroups(
  groups: HonorGroupedRecord[],
  config: {
    codes: readonly string[];
    code: string;
    shortName: string;
  }
) {
  const codeSet = new Set(config.codes);
  const topFlightGroups = groups.filter((group) => codeSet.has(group.competition.code));

  if (topFlightGroups.length < config.codes.length) {
    return groups;
  }

  const primaryGroup = topFlightGroups[0];
  const mergedGroup: HonorGroupedRecord = {
    competition: {
      ...primaryGroup.competition,
      id: config.codes.join('__'),
      code: config.code,
      name: topFlightGroups.map((group) => group.competition.name).join(' / '),
      shortName: config.shortName,
      lifecycleStatus: 'CURRENT'
    },
    titleLinks: config.codes.flatMap((code) => {
      const group = topFlightGroups.find((item) => item.competition.code === code);
      return group ? [{ id: group.competition.id, name: group.competition.name }] : [];
    }),
    placements: mergePlacements(topFlightGroups)
  };
  const firstTopFlightIndex = groups.findIndex((group) => codeSet.has(group.competition.code));
  const result = groups.filter((group) => !codeSet.has(group.competition.code));

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

<script setup lang="ts">
import { computed, ref } from 'vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type {
  HonorSummaryCompetition,
  HonorSummaryCounts,
  HonorSummaryDetail,
  HonorSummaryRow
} from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { placementLabels } from '@/utils/honor';
import { getConfederationVariant, getPlacementTextColor } from '@/utils/tag-theme';
import HonorPlacementLabel from './HonorPlacementLabel.vue';

const placements = [
  { key: 'championCount', value: 'CHAMPION' },
  { key: 'runnerUpCount', value: 'RUNNER_UP' },
  { key: 'thirdPlaceCount', value: 'THIRD_PLACE' },
  { key: 'fourthPlaceCount', value: 'FOURTH_PLACE' },
  { key: 'semiFinalistCount', value: 'SEMI_FINALIST' }
] as const;
type PlacementStat = (typeof placements)[number];

const fallbackPlacements = placements.filter((placement) =>
  ['CHAMPION', 'RUNNER_UP'].includes(placement.value)
) as PlacementStat[];

const props = defineProps<{
  rows: HonorSummaryRow[];
  competitions: HonorSummaryCompetition[];
  entityType: 'country' | 'club';
  page: number;
  pageSize: number;
}>();

type HonorSummaryDisplayCompetition = HonorSummaryCompetition & {
  sourceCompetitionIds: string[];
};
type HonorScoreBreakdownEntry = HonorSummaryDetail & {
  placement: CompetitionStandingPlacement;
  placementLabel: string;
};
type HonorScoreBreakdownGroup = {
  name: string;
  score: number;
  entries: HonorScoreBreakdownEntry[];
};
type HonorSummaryScoreRow = HonorSummaryRow & {
  scoreBreakdown: HonorScoreBreakdownGroup[];
};

const scoreDialogVisible = ref(false);
const scoreDialogRow = ref<HonorSummaryScoreRow | null>(null);

const displayCompetitions = computed<HonorSummaryDisplayCompetition[]>(() => {
  const columns: HonorSummaryDisplayCompetition[] = [];
  let continentalCupColumn: HonorSummaryDisplayCompetition | null = null;
  let internationalLevelThreeColumn: HonorSummaryDisplayCompetition | null = null;
  let clubInternationalLevelFourColumn: HonorSummaryDisplayCompetition | null = null;
  let continentalLevelTwoColumn: HonorSummaryDisplayCompetition | null = null;
  let continentalLevelFourColumn: HonorSummaryDisplayCompetition | null = null;
  let domesticLevelOneLeagueColumn: HonorSummaryDisplayCompetition | null = null;
  let domesticLevelTwoLeagueColumn: HonorSummaryDisplayCompetition | null = null;
  let domesticLevelOneCupColumn: HonorSummaryDisplayCompetition | null = null;
  let domesticLevelTwoCupColumn: HonorSummaryDisplayCompetition | null = null;
  let domesticLevelThreeCupColumn: HonorSummaryDisplayCompetition | null = null;

  for (const competition of props.competitions) {
    if (shouldMergeAsInternationalLevelThree(competition)) {
      if (!internationalLevelThreeColumn) {
        internationalLevelThreeColumn = {
          ...competition,
          id: getInternationalLevelThreeColumnId(),
          code: getInternationalLevelThreeColumnCode(),
          name: getInternationalLevelThreeColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(internationalLevelThreeColumn);
      }

      internationalLevelThreeColumn.sourceCompetitionIds.push(competition.id);
      internationalLevelThreeColumn.counts ??= createEmptyCounts();
      addCounts(
        internationalLevelThreeColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsClubInternationalLevelFour(competition)) {
      if (!clubInternationalLevelFourColumn) {
        clubInternationalLevelFourColumn = {
          ...competition,
          id: getClubInternationalLevelFourColumnId(),
          code: getClubInternationalLevelFourColumnCode(),
          name: getClubInternationalLevelFourColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(clubInternationalLevelFourColumn);
      }

      clubInternationalLevelFourColumn.sourceCompetitionIds.push(competition.id);
      clubInternationalLevelFourColumn.counts ??= createEmptyCounts();
      addCounts(
        clubInternationalLevelFourColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsContinentalCup(competition)) {
      if (!continentalCupColumn) {
        continentalCupColumn = {
          ...competition,
          id: getContinentalCupColumnId(),
          code: getContinentalCupColumnCode(),
          name: getContinentalCupColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(continentalCupColumn);
      }

      continentalCupColumn.sourceCompetitionIds.push(competition.id);
      continentalCupColumn.counts ??= createEmptyCounts();
      addCounts(
        continentalCupColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsContinentalLevelTwo(competition)) {
      if (!continentalLevelTwoColumn) {
        continentalLevelTwoColumn = {
          ...competition,
          id: getContinentalLevelTwoColumnId(),
          code: getContinentalLevelTwoColumnCode(),
          name: getContinentalLevelTwoColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(continentalLevelTwoColumn);
      }

      continentalLevelTwoColumn.sourceCompetitionIds.push(competition.id);
      continentalLevelTwoColumn.counts ??= createEmptyCounts();
      addCounts(
        continentalLevelTwoColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsContinentalLevelFour(competition)) {
      if (!continentalLevelFourColumn) {
        continentalLevelFourColumn = {
          ...competition,
          id: getContinentalLevelFourColumnId(),
          code: getContinentalLevelFourColumnCode(),
          name: getContinentalLevelFourColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(continentalLevelFourColumn);
      }

      continentalLevelFourColumn.sourceCompetitionIds.push(competition.id);
      continentalLevelFourColumn.counts ??= createEmptyCounts();
      addCounts(
        continentalLevelFourColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsDomesticLevelOneLeague(competition)) {
      if (!domesticLevelOneLeagueColumn) {
        domesticLevelOneLeagueColumn = {
          ...competition,
          id: getDomesticLevelOneLeagueColumnId(),
          code: getDomesticLevelOneLeagueColumnCode(),
          name: getDomesticLevelOneLeagueColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(domesticLevelOneLeagueColumn);
      }

      domesticLevelOneLeagueColumn.sourceCompetitionIds.push(competition.id);
      domesticLevelOneLeagueColumn.counts ??= createEmptyCounts();
      addCounts(
        domesticLevelOneLeagueColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsDomesticLevelTwoLeague(competition)) {
      if (!domesticLevelTwoLeagueColumn) {
        domesticLevelTwoLeagueColumn = {
          ...competition,
          id: getDomesticLevelTwoLeagueColumnId(),
          code: getDomesticLevelTwoLeagueColumnCode(),
          name: getDomesticLevelTwoLeagueColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(domesticLevelTwoLeagueColumn);
      }

      domesticLevelTwoLeagueColumn.sourceCompetitionIds.push(competition.id);
      domesticLevelTwoLeagueColumn.counts ??= createEmptyCounts();
      addCounts(
        domesticLevelTwoLeagueColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsDomesticLevelOneCup(competition)) {
      if (!domesticLevelOneCupColumn) {
        domesticLevelOneCupColumn = {
          ...competition,
          id: getDomesticLevelOneCupColumnId(),
          code: getDomesticLevelOneCupColumnCode(),
          name: getDomesticLevelOneCupColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(domesticLevelOneCupColumn);
      }

      domesticLevelOneCupColumn.sourceCompetitionIds.push(competition.id);
      domesticLevelOneCupColumn.counts ??= createEmptyCounts();
      addCounts(
        domesticLevelOneCupColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsDomesticLevelTwoCup(competition)) {
      if (!domesticLevelTwoCupColumn) {
        domesticLevelTwoCupColumn = {
          ...competition,
          id: getDomesticLevelTwoCupColumnId(),
          code: getDomesticLevelTwoCupColumnCode(),
          name: getDomesticLevelTwoCupColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(domesticLevelTwoCupColumn);
      }

      domesticLevelTwoCupColumn.sourceCompetitionIds.push(competition.id);
      domesticLevelTwoCupColumn.counts ??= createEmptyCounts();
      addCounts(
        domesticLevelTwoCupColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    if (shouldMergeAsDomesticLevelThreeCup(competition)) {
      if (!domesticLevelThreeCupColumn) {
        domesticLevelThreeCupColumn = {
          ...competition,
          id: getDomesticLevelThreeCupColumnId(),
          code: getDomesticLevelThreeCupColumnCode(),
          name: getDomesticLevelThreeCupColumnName(),
          sourceCompetitionIds: [],
          counts: createEmptyCounts()
        };
        columns.push(domesticLevelThreeCupColumn);
      }

      domesticLevelThreeCupColumn.sourceCompetitionIds.push(competition.id);
      domesticLevelThreeCupColumn.counts ??= createEmptyCounts();
      addCounts(
        domesticLevelThreeCupColumn.counts,
        competition.counts ?? getCompetitionCountsFromRows(competition.id)
      );
      continue;
    }

    columns.push({
      ...competition,
      sourceCompetitionIds: [competition.id]
    });
  }

  return columns;
});

function rowIndex(index: number) {
  return (props.page - 1) * props.pageSize + index + 1;
}

function formatNumber(value?: number | null, digits = 0) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function formatCount(value?: number | null) {
  return value ? formatNumber(value) : '-';
}

function getCompetitionCounts(row: HonorSummaryRow, competitionId: string): HonorSummaryCounts {
  return (
    row.competitionStats[competitionId] ?? {
      totalCount: 0,
      championCount: 0,
      runnerUpCount: 0,
      thirdPlaceCount: 0,
      fourthPlaceCount: 0,
      semiFinalistCount: 0,
      score: 0,
      details: createEmptyDetails()
    }
  );
}

function getDisplayCompetitionCounts(
  row: HonorSummaryRow,
  competition: HonorSummaryDisplayCompetition
): HonorSummaryCounts {
  return competition.sourceCompetitionIds.reduce((total, competitionId) => {
    addCounts(total, getCompetitionCounts(row, competitionId));
    return total;
  }, createEmptyCounts());
}

function getCompetitionPlacementFields(
  competition: HonorSummaryDisplayCompetition
): PlacementStat[] {
  const counts = competition.counts ?? getCompetitionCountsFromRows(competition.id);

  const visiblePlacements = placements.filter((placement) => counts[placement.key] > 0);

  return visiblePlacements.length ? visiblePlacements : fallbackPlacements;
}

function getCompetitionCountsFromRows(competitionId: string): HonorSummaryCounts {
  return props.rows.reduce((total, row) => {
    const counts = getCompetitionCounts(row, competitionId);

    total.totalCount += counts.totalCount;
    total.championCount += counts.championCount;
    total.runnerUpCount += counts.runnerUpCount;
    total.thirdPlaceCount += counts.thirdPlaceCount;
    total.fourthPlaceCount += counts.fourthPlaceCount;
    total.semiFinalistCount += counts.semiFinalistCount;

    return total;
  }, createEmptyCounts());
}

function createEmptyCounts(): HonorSummaryCounts {
  return {
    totalCount: 0,
    championCount: 0,
    runnerUpCount: 0,
    thirdPlaceCount: 0,
    fourthPlaceCount: 0,
    semiFinalistCount: 0,
    score: 0,
    details: createEmptyDetails()
  };
}

function addCounts(target: HonorSummaryCounts, source?: HonorSummaryCounts | null) {
  if (!source) {
    return;
  }

  target.totalCount += source.totalCount;
  target.championCount += source.championCount;
  target.runnerUpCount += source.runnerUpCount;
  target.thirdPlaceCount += source.thirdPlaceCount;
  target.fourthPlaceCount += source.fourthPlaceCount;
  target.semiFinalistCount += source.semiFinalistCount;
  target.score = (target.score ?? 0) + (source.score ?? 0);

  for (const placement of placementValues) {
    const sourceDetails = source.details?.[placement] ?? [];
    const targetDetails = target.details?.[placement] ?? [];
    target.details = target.details ?? createEmptyDetails();
    target.details[placement] = [...targetDetails, ...sourceDetails];
  }
}

function getPlacementValue(placement: PlacementStat) {
  return placement.value as CompetitionStandingPlacement;
}

function getPlacementStyle(placement: PlacementStat | CompetitionStandingPlacement) {
  const value = typeof placement === 'string' ? placement : getPlacementValue(placement);

  return {
    '--honor-placement-color': getPlacementTextColor(value)
  };
}

function formatConfederation(row: HonorSummaryRow) {
  return row.federationRef?.name ?? '';
}

function shouldMergeAsContinentalCup(competition: HonorSummaryCompetition) {
  return (
    competition.targetType === (props.entityType === 'country' ? 'COUNTRY' : 'CLUB') &&
    competition.category === '洲际' &&
    competition.level === '一级' &&
    competition.format === '杯赛'
  );
}

function shouldMergeAsInternationalLevelThree(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'country' &&
    competition.targetType === 'COUNTRY' &&
    competition.category === '国际' &&
    competition.level === '三级' &&
    competition.format === '杯赛'
  );
}

function shouldMergeAsClubInternationalLevelFour(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '国际' &&
    competition.level === '四级' &&
    competition.format === '杯赛'
  );
}

function shouldMergeAsContinentalLevelTwo(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '洲际' &&
    competition.level === '二级' &&
    competition.format === '杯赛'
  );
}

function shouldMergeAsContinentalLevelFour(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '洲际' &&
    competition.level === '四级' &&
    competition.format === '杯赛'
  );
}

function shouldMergeAsDomesticLevelOneLeague(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '国内' &&
    competition.level === '一级' &&
    competition.format === '联赛'
  );
}

function shouldMergeAsDomesticLevelTwoLeague(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '国内' &&
    competition.level === '二级' &&
    competition.format === '联赛'
  );
}

function shouldMergeAsDomesticLevelOneCup(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '国内' &&
    competition.level === '一级' &&
    competition.format === '杯赛'
  );
}

function shouldMergeAsDomesticLevelTwoCup(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '国内' &&
    competition.level === '二级' &&
    competition.format === '杯赛'
  );
}

function shouldMergeAsDomesticLevelThreeCup(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'club' &&
    competition.targetType === 'CLUB' &&
    competition.category === '国内' &&
    competition.level === '三级' &&
    competition.format === '杯赛'
  );
}

function getContinentalCupColumnId() {
  return props.entityType === 'country'
    ? '__country_continental_cup__'
    : '__club_continental_level_one__';
}

function getContinentalCupColumnCode() {
  return props.entityType === 'country' ? 'COUNTRY_CONTINENTAL_CUP' : 'CLUB_CONTINENTAL_LEVEL_ONE';
}

function getContinentalCupColumnName() {
  return props.entityType === 'country' ? '洲际杯' : '洲际一级';
}

function getInternationalLevelThreeColumnId() {
  return '__country_international_level_three__';
}

function getInternationalLevelThreeColumnCode() {
  return 'COUNTRY_INTERNATIONAL_LEVEL_THREE';
}

function getInternationalLevelThreeColumnName() {
  return '国际三级';
}

function getClubInternationalLevelFourColumnId() {
  return '__club_international_level_four__';
}

function getClubInternationalLevelFourColumnCode() {
  return 'CLUB_INTERNATIONAL_LEVEL_FOUR';
}

function getClubInternationalLevelFourColumnName() {
  return '国际四级';
}

function getContinentalLevelTwoColumnId() {
  return '__club_continental_level_two__';
}

function getContinentalLevelTwoColumnCode() {
  return 'CLUB_CONTINENTAL_LEVEL_TWO';
}

function getContinentalLevelTwoColumnName() {
  return '洲际二级';
}

function getContinentalLevelFourColumnId() {
  return '__club_continental_level_four__';
}

function getContinentalLevelFourColumnCode() {
  return 'CLUB_CONTINENTAL_LEVEL_FOUR';
}

function getContinentalLevelFourColumnName() {
  return '洲际四级';
}

function getDomesticLevelOneLeagueColumnId() {
  return '__club_domestic_level_one_league__';
}

function getDomesticLevelOneLeagueColumnCode() {
  return 'CLUB_DOMESTIC_LEVEL_ONE_LEAGUE';
}

function getDomesticLevelOneLeagueColumnName() {
  return '国内一级联赛';
}

function getDomesticLevelTwoLeagueColumnId() {
  return '__club_domestic_level_two_league__';
}

function getDomesticLevelTwoLeagueColumnCode() {
  return 'CLUB_DOMESTIC_LEVEL_TWO_LEAGUE';
}

function getDomesticLevelTwoLeagueColumnName() {
  return '国内二级联赛';
}

function getDomesticLevelOneCupColumnId() {
  return '__club_domestic_level_one_cup__';
}

function getDomesticLevelOneCupColumnCode() {
  return 'CLUB_DOMESTIC_LEVEL_ONE_CUP';
}

function getDomesticLevelOneCupColumnName() {
  return '国内一级杯赛';
}

function getDomesticLevelTwoCupColumnId() {
  return '__club_domestic_level_two_cup__';
}

function getDomesticLevelTwoCupColumnCode() {
  return 'CLUB_DOMESTIC_LEVEL_TWO_CUP';
}

function getDomesticLevelTwoCupColumnName() {
  return '国内二级杯赛';
}

function getDomesticLevelThreeCupColumnId() {
  return '__club_domestic_level_three_cup__';
}

function getDomesticLevelThreeCupColumnCode() {
  return 'CLUB_DOMESTIC_LEVEL_THREE_CUP';
}

function getDomesticLevelThreeCupColumnName() {
  return '国内三级杯赛';
}

const placementValues = placements.map(
  (placement) => placement.value
) as CompetitionStandingPlacement[];

function createEmptyDetails() {
  return {
    CHAMPION: [],
    RUNNER_UP: [],
    THIRD_PLACE: [],
    FOURTH_PLACE: [],
    SEMI_FINALIST: []
  } as Record<CompetitionStandingPlacement, HonorSummaryDetail[]>;
}

function getPlacementDetails(
  row: HonorSummaryRow,
  competition: HonorSummaryDisplayCompetition,
  placement: PlacementStat
) {
  return getDisplayCompetitionCounts(row, competition).details?.[placement.value] ?? [];
}

function hasPlacementDetails(
  row: HonorSummaryRow,
  competition: HonorSummaryDisplayCompetition,
  placement: PlacementStat
) {
  return getPlacementDetails(row, competition, placement).length > 0;
}

function formatDetailTitle(detail: HonorSummaryDetail) {
  const parts = [detail.label || '-', formatDetailHost(detail)].filter(Boolean);
  return parts.join(' / ');
}

function formatDetailHost(detail: HonorSummaryDetail) {
  return detail.host ? `举办地 ${detail.host}` : '';
}

function getPlacementDetailGroups(
  row: HonorSummaryRow,
  competition: HonorSummaryDisplayCompetition,
  placement: PlacementStat
) {
  const details = getPlacementDetails(row, competition, placement);
  const groupMap = new Map<string, HonorSummaryDetail[]>();

  for (const detail of details) {
    const competitionName = detail.competitionName || competition.name;
    const group = groupMap.get(competitionName) ?? [];
    group.push(detail);
    groupMap.set(competitionName, group);
  }

  return [...groupMap.entries()].map(([name, groupDetails]) => ({
    name,
    details: groupDetails
  }));
}

function hasScoreBreakdown(row: HonorSummaryRow) {
  return getScoreBreakdown(row).length > 0;
}

function getScoreBreakdown(row: HonorSummaryRow): HonorScoreBreakdownGroup[] {
  return [
    ...displayCompetitions.value.flatMap((competition) =>
      getCompetitionScoreBreakdown(row, competition)
    ),
    getBonusScoreBreakdown(row)
  ].filter((item): item is HonorScoreBreakdownGroup => Boolean(item && item.score > 0));
}

function getBonusScoreBreakdown(row: HonorSummaryRow): HonorScoreBreakdownGroup | null {
  const details = row.bonusHonorDetails ?? [];

  if (!details.length) {
    return null;
  }

  return {
    name: '团队附加分',
    score: details.reduce((total, detail) => total + detail.score, 0),
    entries: details.map((detail) => ({
      id: detail.id,
      label: detail.editionName,
      year: detail.year,
      season: detail.season,
      host: null,
      competitionId: null,
      competitionName: formatAwardName(detail.awardName),
      score: detail.score,
      placementScore: detail.baseScore,
      qualityCoefficient: detail.coefficient,
      conversionCoefficient: 1,
      sourceName: detail.sourceName,
      ruleName: detail.ruleName,
      placement: 'CHAMPION',
      placementLabel: detail.placement || (detail.rank ? `第 ${detail.rank} 名` : '获奖')
    }))
  };
}

function formatAwardName(name?: string | null) {
  return String(name ?? '')
    .replace(/（(?:国家队|俱乐部)）/g, '')
    .trim();
}

function getCompetitionScoreBreakdown(
  row: HonorSummaryRow,
  competition: HonorSummaryDisplayCompetition
) {
  if (competition.sourceCompetitionIds.length <= 1) {
    const counts = getDisplayCompetitionCounts(row, competition);
    return [
      {
        name: getScoreBreakdownName(row, competition),
        score: counts.score ?? 0,
        entries: getScoreBreakdownEntries(counts)
      }
    ];
  }

  return competition.sourceCompetitionIds.map((competitionId) => {
    const counts = getCompetitionCounts(row, competitionId);
    const sourceCompetition =
      props.competitions.find((item) => item.id === competitionId) ?? competition;

    return {
      name: getScoreBreakdownNameFromCounts(counts, sourceCompetition.name),
      score: counts.score ?? 0,
      entries: getScoreBreakdownEntries(counts)
    };
  });
}

function getScoreBreakdownName(row: HonorSummaryRow, competition: HonorSummaryDisplayCompetition) {
  const counts = getDisplayCompetitionCounts(row, competition);
  return getScoreBreakdownNameFromCounts(counts, competition.name);
}

function getScoreBreakdownNameFromCounts(counts: HonorSummaryCounts, fallbackName: string) {
  const names = placementValues.flatMap((placement) =>
    (counts.details?.[placement] ?? []).map((detail) => detail.competitionName).filter(Boolean)
  );
  const uniqueNames = [...new Set(names)];

  return uniqueNames.length === 1 ? (uniqueNames[0] ?? fallbackName) : fallbackName;
}

function getScoreBreakdownEntries(counts: HonorSummaryCounts): HonorScoreBreakdownEntry[] {
  return placementValues.flatMap((placement) =>
    (counts.details?.[placement] ?? []).map((detail) => ({
      ...detail,
      placement,
      placementLabel: placementLabels[placement]
    }))
  );
}

function formatScoreEntryEdition(entry: HonorScoreBreakdownEntry) {
  if (entry.season) {
    return entry.season;
  }

  if (entry.year) {
    return `${entry.year}年`;
  }

  return entry.label || '-';
}

function formatScoreEntryHonor(entry: HonorScoreBreakdownEntry) {
  return formatAwardName(entry.competitionName) || '-';
}

function isBonusScoreBreakdownGroup(group: HonorScoreBreakdownGroup) {
  return group.name === '团队附加分';
}

function hasScoreGroupSource(group: HonorScoreBreakdownGroup) {
  return group.entries.some((entry) => Boolean(entry.sourceName));
}

function openScoreDialog(row: HonorSummaryRow) {
  scoreDialogRow.value = {
    ...row,
    scoreBreakdown: getScoreBreakdown(row)
  };
  scoreDialogVisible.value = true;
}
</script>

<template>
  <el-table :data="rows" border class="honor-summary-table">
    <el-table-column label="序号" width="60" fixed align="center">
      <template #default="{ $index }">
        {{ rowIndex($index) }}
      </template>
    </el-table-column>

    <el-table-column label="足联" width="100" fixed>
      <template #default="{ row }">
        <SemanticTag
          v-if="formatConfederation(row)"
          :variant="getConfederationVariant(formatConfederation(row))"
          size="small"
        >
          {{ formatConfederation(row) }}
        </SemanticTag>
        <span v-else>-</span>
      </template>
    </el-table-column>

    <el-table-column v-if="entityType === 'club'" label="国家" width="160" fixed>
      <template #default="{ row }">
        <EntityNameCell
          :id="row.countryRef?.id"
          type="country"
          :title="row.countryRef?.name"
          :subtitle="`UID ${row.countryRef?.uid || '-'}`"
        />
      </template>
    </el-table-column>

    <el-table-column v-if="entityType === 'country'" label="国家" width="160" fixed>
      <template #default="{ row }">
        <EntityNameCell
          :id="row.id"
          type="country"
          :title="row.name"
          :subtitle="`UID ${row.uid || '-'}`"
        />
      </template>
    </el-table-column>

    <el-table-column v-if="entityType === 'club'" label="俱乐部" width="180" fixed>
      <template #default="{ row }">
        <EntityNameCell
          :id="row.id"
          type="club"
          :title="row.name"
          :subtitle="`UID ${row.uid || '-'}`"
        />
      </template>
    </el-table-column>

    <template v-for="competition in displayCompetitions" :key="competition.id">
      <el-table-column :label="competition.name" align="center" header-align="center">
        <template
          v-for="placement in getCompetitionPlacementFields(competition)"
          :key="`${competition.id}-${placement.value}`"
        >
          <el-table-column
            :label="placementLabels[placement.value]"
            width="70"
            align="center"
            header-align="center"
          >
            <template #header>
              <HonorPlacementLabel :placement="getPlacementValue(placement)" compact />
            </template>
            <template #default="{ row }">
              <el-tooltip
                v-if="hasPlacementDetails(row, competition, placement)"
                effect="light"
                placement="top"
                :show-after="180"
                popper-class="honor-summary-tooltip-popper"
              >
                <template #content>
                  <div class="honor-summary-tooltip">
                    <div class="honor-summary-tooltip__title">
                      <span :style="getPlacementStyle(placement)">
                        {{ placementLabels[placement.value] }}
                      </span>
                    </div>
                    <div
                      v-for="group in getPlacementDetailGroups(row, competition, placement)"
                      :key="group.name"
                      class="honor-summary-tooltip__group"
                    >
                      <div class="honor-summary-tooltip__group-title">
                        {{ group.name }}
                      </div>
                      <div
                        v-for="detail in group.details"
                        :key="detail.id"
                        class="honor-summary-tooltip__item"
                      >
                        {{ formatDetailTitle(detail) }}
                      </div>
                    </div>
                  </div>
                </template>
                <span
                  class="honor-count-cell is-placement is-hoverable"
                  :style="getPlacementStyle(placement)"
                >
                  {{ formatCount(getDisplayCompetitionCounts(row, competition)[placement.key]) }}
                </span>
              </el-tooltip>
              <span
                v-else
                class="honor-count-cell is-placement"
                :style="getPlacementStyle(placement)"
              >
                {{ formatCount(getDisplayCompetitionCounts(row, competition)[placement.key]) }}
              </span>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </template>

    <el-table-column label="总数" width="80" fixed="right" align="center">
      <template #default="{ row }">
        <span class="honor-count-cell">{{ formatCount(row.totalCount) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="冠军数" width="80" fixed="right" align="center">
      <template #default="{ row }">
        <span class="honor-count-cell">{{ formatCount(row.championCount) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="附加分" width="80" fixed="right" align="center">
      <template #default="{ row }">
        <span class="honor-count-cell">{{ formatNumber(row.bonusHonorScore, 2) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="荣誉分" width="90" fixed="right" align="center">
      <template #default="{ row }">
        <el-tooltip
          v-if="hasScoreBreakdown(row)"
          effect="light"
          placement="top"
          :show-after="180"
          popper-class="honor-summary-tooltip-popper"
        >
          <template #content>
            <div class="honor-summary-tooltip honor-summary-tooltip--score">
              <div class="honor-summary-tooltip__title">荣誉分拆解</div>
              <div
                v-for="group in getScoreBreakdown(row)"
                :key="group.name"
                class="honor-summary-tooltip__group"
              >
                <div class="honor-summary-tooltip__item honor-summary-tooltip__item--split">
                  <span>{{ group.name }}</span>
                  <strong>{{ formatNumber(group.score, 2) }}</strong>
                </div>
              </div>
              <div class="honor-summary-tooltip__item honor-summary-tooltip__item--split is-total">
                <span>总计</span>
                <strong>{{ formatNumber(row.honorScore, 2) }}</strong>
              </div>
              <div class="honor-summary-tooltip__hint">点击分数查看逐届计算明细</div>
            </div>
          </template>
          <button class="honor-score-button" type="button" @click="openScoreDialog(row)">
            {{ formatNumber(row.honorScore, 2) }}
          </button>
        </el-tooltip>
        <span v-else class="honor-count-cell">{{ formatNumber(row.honorScore, 2) }}</span>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="scoreDialogVisible"
    :title="`${scoreDialogRow?.name ?? ''} 荣誉分明细`"
    width="860px"
    class="honor-score-dialog"
  >
    <div v-if="scoreDialogRow" class="honor-score-dialog__body">
      <div class="honor-score-dialog__summary">
        <span>
          赛事分 {{ formatNumber(scoreDialogRow.baseHonorScore, 2) }} · 附加分
          {{ formatNumber(scoreDialogRow.bonusHonorScore, 2) }}
        </span>
        <strong>{{ formatNumber(scoreDialogRow.honorScore, 2) }}</strong>
      </div>

      <div
        v-for="group in scoreDialogRow.scoreBreakdown"
        :key="group.name"
        class="honor-score-dialog__group"
      >
        <div class="honor-score-dialog__group-head">
          <strong>{{ group.name }}</strong>
          <span>{{ formatNumber(group.score, 2) }}</span>
        </div>

        <el-table
          v-if="isBonusScoreBreakdownGroup(group)"
          :data="group.entries"
          border
          size="small"
        >
          <el-table-column label="届次" width="110">
            <template #default="{ row }">
              {{ formatScoreEntryEdition(row) }}
            </template>
          </el-table-column>
          <el-table-column label="荣誉" min-width="210" show-overflow-tooltip>
            <template #default="{ row }">{{ formatScoreEntryHonor(row) }}</template>
          </el-table-column>
          <el-table-column v-if="hasScoreGroupSource(group)" label="来源" width="90" align="center">
            <template #default="{ row }">{{ row.sourceName || '-' }}</template>
          </el-table-column>
          <el-table-column label="规则" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ row.ruleName || '-' }}</template>
          </el-table-column>
          <el-table-column label="基础分" width="86" align="center">
            <template #default="{ row }">{{ formatNumber(row.placementScore, 2) }}</template>
          </el-table-column>
          <el-table-column label="质量系数" width="92" align="center">
            <template #default="{ row }">{{ formatNumber(row.qualityCoefficient, 2) }}</template>
          </el-table-column>
          <el-table-column label="换算系数" width="92" align="center">
            <template #default="{ row }">{{ formatNumber(row.conversionCoefficient, 2) }}</template>
          </el-table-column>
          <el-table-column label="得分" width="90" align="center">
            <template #default="{ row }">
              <strong>{{ formatNumber(row.score, 2) }}</strong>
            </template>
          </el-table-column>
        </el-table>

        <el-table v-else :data="group.entries" border size="small">
          <el-table-column label="届次" min-width="140">
            <template #default="{ row }">
              {{ formatScoreEntryEdition(row) }}
            </template>
          </el-table-column>
          <el-table-column label="名次" width="90" align="center">
            <template #default="{ row }">
              <span class="honor-score-dialog__placement" :style="getPlacementStyle(row.placement)">
                {{ row.placementLabel }}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="hasScoreGroupSource(group)" label="来源" width="90" align="center">
            <template #default="{ row }">{{ row.sourceName || '-' }}</template>
          </el-table-column>
          <el-table-column label="规则" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ row.ruleName || '-' }}</template>
          </el-table-column>
          <el-table-column label="基础分" width="86" align="center">
            <template #default="{ row }">{{ formatNumber(row.placementScore, 2) }}</template>
          </el-table-column>
          <el-table-column label="质量系数" width="92" align="center">
            <template #default="{ row }">{{ formatNumber(row.qualityCoefficient, 2) }}</template>
          </el-table-column>
          <el-table-column label="换算系数" width="92" align="center">
            <template #default="{ row }">{{ formatNumber(row.conversionCoefficient, 2) }}</template>
          </el-table-column>
          <el-table-column label="得分" width="90" align="center">
            <template #default="{ row }">
              <strong>{{ formatNumber(row.score, 2) }}</strong>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <template #footer>
      <el-button @click="scoreDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.honor-count-cell.is-hoverable {
  cursor: pointer;
  transition: color 0.18s ease;

  &:hover {
    color: var(--honor-placement-color, var(--color-brand-primary));
  }
}

.honor-score-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  transition: color 0.18s ease;

  &:hover {
    color: var(--color-brand-primary);
  }
}

.honor-summary-tooltip {
  display: grid;
  gap: 6px;
  max-width: 320px;
  max-height: 260px;
  overflow: auto;
  color: var(--text-color-regular);
  font-size: 13px;
  line-height: 1.45;

  &__title {
    color: var(--text-color-primary);
    font-weight: 800;
  }

  &__group {
    display: grid;
    gap: 4px;
  }

  &__group-title {
    color: var(--color-brand-primary);
    font-weight: 800;
    white-space: nowrap;
  }

  &__item {
    white-space: nowrap;
  }

  &__item--split {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }

  &__item--split strong {
    color: var(--text-color-primary);
    font-weight: 800;
  }

  &__item--split.is-total {
    padding-top: 4px;
    border-top: 1px solid var(--color-border-brand-subtle);
  }

  &__hint {
    color: var(--text-color-secondary);
    font-size: 12px;
  }
}

.honor-score-dialog__body {
  display: grid;
  gap: 14px;
  max-height: 62vh;
  overflow: auto;
  padding-right: 4px;
}

.honor-score-dialog__summary,
.honor-score-dialog__group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.honor-score-dialog__summary {
  padding: 10px 12px;
  border: 1px solid var(--color-border-brand-subtle);
  border-radius: 6px;
  background: var(--color-surface-soft);
  color: var(--text-color-primary);

  strong {
    font-size: 18px;
  }
}

.honor-score-dialog__group {
  display: grid;
  gap: 8px;
}

.honor-score-dialog__group-head {
  color: var(--text-color-primary);

  span {
    color: var(--color-brand-primary);
    font-weight: 800;
  }
}

.honor-score-dialog__placement {
  color: var(--honor-placement-color);
  font-weight: 850;
}
</style>

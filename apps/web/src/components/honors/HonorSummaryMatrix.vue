<script setup lang="ts">
import { computed } from 'vue';
import EntityLink from '@/components/EntityLink.vue';
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
import { getConfederationVariant } from '@/utils/tag-theme';
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

const displayCompetitions = computed<HonorSummaryDisplayCompetition[]>(() => {
  const columns: HonorSummaryDisplayCompetition[] = [];
  let continentalCupColumn: HonorSummaryDisplayCompetition | null = null;

  for (const competition of props.competitions) {
    if (shouldMergeAsContinentalCup(competition)) {
      if (!continentalCupColumn) {
        continentalCupColumn = {
          ...competition,
          id: '__country_continental_cup__',
          code: 'COUNTRY_CONTINENTAL_CUP',
          name: '洲际杯',
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

function formatConfederation(row: HonorSummaryRow) {
  return row.federationRef?.name ?? '';
}

function shouldMergeAsContinentalCup(competition: HonorSummaryCompetition) {
  return (
    props.entityType === 'country' &&
    competition.targetType === 'COUNTRY' &&
    competition.category === '洲际' &&
    competition.level === '一级' &&
    competition.format === '杯赛'
  );
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

function getTooltipTitle(
  row: HonorSummaryRow,
  competition: HonorSummaryDisplayCompetition,
  placement: PlacementStat
) {
  const details = getPlacementDetails(row, competition, placement);
  const names = [...new Set(details.map((detail) => detail.competitionName).filter(Boolean))];

  const competitionName = names.length === 1 ? names[0] : competition.name;
  return `${competitionName} · ${placementLabels[placement.value]}`;
}

function hasScoreBreakdown(row: HonorSummaryRow) {
  return getScoreBreakdown(row).length > 0;
}

function getScoreBreakdown(row: HonorSummaryRow) {
  return displayCompetitions.value
    .map((competition) => ({
      name: getScoreBreakdownName(row, competition),
      score: getDisplayCompetitionCounts(row, competition).score ?? 0
    }))
    .filter((item) => item.score > 0);
}

function getScoreBreakdownName(row: HonorSummaryRow, competition: HonorSummaryDisplayCompetition) {
  const counts = getDisplayCompetitionCounts(row, competition);
  const names = placementValues.flatMap((placement) =>
    (counts.details?.[placement] ?? []).map((detail) => detail.competitionName).filter(Boolean)
  );
  const uniqueNames = [...new Set(names)];

  return uniqueNames.length === 1 ? (uniqueNames[0] ?? competition.name) : competition.name;
}
</script>

<template>
  <el-table :data="rows" border class="honor-summary-table">
    <el-table-column label="序号" width="72" fixed align="center">
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

    <el-table-column v-if="entityType === 'club'" label="国家" width="120" fixed>
      <template #default="{ row }">
        <EntityLink :id="row.countryRef?.id" type="country" :name="row.countryRef?.name" />
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

    <el-table-column v-if="entityType === 'club'" label="UID" width="92" fixed>
      <template #default="{ row }">
        {{ row.uid || '-' }}
      </template>
    </el-table-column>

    <el-table-column v-if="entityType === 'club'" label="俱乐部" width="180" fixed>
      <template #default="{ row }">
        <EntityLink :id="row.id" :type="entityType" :name="row.name" />
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
                      {{ getTooltipTitle(row, competition, placement) }}
                    </div>
                    <div
                      v-for="detail in getPlacementDetails(row, competition, placement)"
                      :key="detail.id"
                      class="honor-summary-tooltip__item"
                    >
                      {{ formatDetailTitle(detail) }}
                    </div>
                  </div>
                </template>
                <span class="honor-count-cell is-hoverable">
                  {{ formatCount(getDisplayCompetitionCounts(row, competition)[placement.key]) }}
                </span>
              </el-tooltip>
              <span v-else class="honor-count-cell">
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
                v-for="item in getScoreBreakdown(row)"
                :key="item.name"
                class="honor-summary-tooltip__item honor-summary-tooltip__item--split"
              >
                <span>{{ item.name }}</span>
                <strong>{{ formatNumber(item.score, 2) }}</strong>
              </div>
              <div class="honor-summary-tooltip__item honor-summary-tooltip__item--split is-total">
                <span>总计</span>
                <strong>{{ formatNumber(row.honorScore, 2) }}</strong>
              </div>
            </div>
          </template>
          <span class="honor-count-cell is-hoverable">{{ formatNumber(row.honorScore, 2) }}</span>
        </el-tooltip>
        <span v-else class="honor-count-cell">{{ formatNumber(row.honorScore, 2) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.honor-count-cell.is-hoverable {
  cursor: pointer;
  transition: color 0.18s ease;

  &:hover {
    color: #15784b;
  }
}

.honor-summary-tooltip {
  display: grid;
  gap: 6px;
  max-width: 320px;
  max-height: 260px;
  overflow: auto;
  color: #2f4338;
  font-size: 13px;
  line-height: 1.45;

  &__title {
    color: #10291d;
    font-weight: 800;
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
    color: #10291d;
    font-weight: 800;
  }

  &__item--split.is-total {
    padding-top: 4px;
    border-top: 1px solid rgb(21 120 75 / 14%);
  }
}
</style>

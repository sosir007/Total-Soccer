<script setup lang="ts">
import EntityLink from '@/components/EntityLink.vue';
import type {
  HonorSummaryCompetition,
  HonorSummaryCounts,
  HonorSummaryRow
} from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { placementLabels } from '@/utils/honor';
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
      semiFinalistCount: 0
    }
  );
}

function getCompetitionPlacementFields(competition: HonorSummaryCompetition): PlacementStat[] {
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
    semiFinalistCount: 0
  };
}

function getPlacementValue(placement: PlacementStat) {
  return placement.value as CompetitionStandingPlacement;
}
</script>

<template>
  <el-table :data="rows" border class="honor-summary-table">
    <el-table-column label="序号" width="72" fixed align="center">
      <template #default="{ $index }">
        {{ rowIndex($index) }}
      </template>
    </el-table-column>

    <el-table-column label="足联" width="120" fixed>
      <template #default="{ row }">
        {{ row.federationRef?.name ?? '-' }}
      </template>
    </el-table-column>

    <el-table-column v-if="entityType === 'club'" label="国家" width="120" fixed>
      <template #default="{ row }">
        <EntityLink :id="row.countryRef?.id" type="country" :name="row.countryRef?.name" />
      </template>
    </el-table-column>

    <el-table-column label="UID" width="92" fixed>
      <template #default="{ row }">
        {{ row.uid || '-' }}
      </template>
    </el-table-column>

    <el-table-column :label="entityType === 'country' ? '球队' : '俱乐部'" width="180" fixed>
      <template #default="{ row }">
        <EntityLink :id="row.id" :type="entityType" :name="row.name" />
      </template>
    </el-table-column>

    <template v-for="competition in competitions" :key="competition.id">
      <el-table-column :label="competition.name" align="center" header-align="center">
        <template
          v-for="placement in getCompetitionPlacementFields(competition)"
          :key="`${competition.id}-${placement.value}`"
        >
          <el-table-column
            :label="placementLabels[placement.value]"
            width="82"
            align="center"
            header-align="center"
          >
            <template #header>
              <HonorPlacementLabel :placement="getPlacementValue(placement)" compact />
            </template>
            <template #default="{ row }">
              <span class="honor-count-cell">
                {{ formatCount(getCompetitionCounts(row, competition.id)[placement.key]) }}
              </span>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </template>

    <el-table-column label="总数" width="90" fixed="right" align="center">
      <template #default="{ row }">
        <span class="honor-count-cell">{{ formatCount(row.totalCount) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="冠军数" width="90" fixed="right" align="center">
      <template #default="{ row }">
        <span class="honor-count-cell">{{ formatCount(row.championCount) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="荣誉分" width="100" fixed="right" align="center">
      <template #default="{ row }">
        <span class="honor-count-cell">{{ formatNumber(row.honorScore, 2) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

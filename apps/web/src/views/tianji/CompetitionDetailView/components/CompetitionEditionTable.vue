<script setup lang="ts">
import { computed } from 'vue';
import type {
  CompetitionEdition,
  CompetitionEditionStandingMode,
  CompetitionStanding,
  CompetitionStandingPlacement
} from '@/services/types/competitions';
import EntityLink from '@/components/EntityLink.vue';
import IconFont from '@/components/IconFont.vue';
import HonorPlacementLabel from '@/components/honors/HonorPlacementLabel.vue';
import NoDataView from '@/components/NoDataView.vue';
import { getPlacementTextColor } from '@/utils/tag-theme';
import type { PlacementField } from './types';

type StandingStatEntry = {
  label: string;
};

type StandingStatRow = {
  key: string;
  id: string | null;
  type: 'country' | 'club';
  name: string;
  counts: Record<CompetitionStandingPlacement, number>;
  entries: Record<CompetitionStandingPlacement, StandingStatEntry[]>;
  total: number;
};

const placementOrder: CompetitionStandingPlacement[] = [
  'CHAMPION',
  'RUNNER_UP',
  'THIRD_PLACE',
  'FOURTH_PLACE',
  'SEMI_FINALIST'
];

const props = defineProps<{
  editions: CompetitionEdition[];
  placementFields: PlacementField[];
  standingModeLabels: Record<CompetitionEditionStandingMode, string>;
  sortAscending: boolean;
  resultSaving: boolean;
  formatEditionLabel: (edition: CompetitionEdition) => string;
  formatText: (value?: string | number | boolean | null) => string | number | boolean;
  hasEditionStanding: (edition: CompetitionEdition, field: PlacementField) => boolean;
  getStandingEntityId: (
    edition: CompetitionEdition,
    field: PlacementField
  ) => string | null | undefined;
  getStandingEntityType: (edition: CompetitionEdition, field: PlacementField) => 'country' | 'club';
  getStandingEntityName: (edition: CompetitionEdition, field: PlacementField) => string;
}>();

const emit = defineEmits<{
  'update:sortAscending': [value: boolean];
  edit: [edition: CompetitionEdition];
  delete: [edition: CompetitionEdition];
  batchEdit: [];
}>();

function getStandingModeLabel(edition: CompetitionEdition) {
  return props.standingModeLabels[edition.standingMode] ?? '-';
}

const statisticsPlacementColumns = computed(() =>
  placementOrder.filter((placement) =>
    statisticsRows.value.some((row) => row.counts[placement] > 0)
  )
);
const statisticsRows = computed(() => buildStatisticsRows(props.editions));

function buildStatisticsRows(editions: CompetitionEdition[]) {
  const rowMap = new Map<string, StandingStatRow>();

  for (const edition of editions) {
    for (const standing of edition.standings) {
      const entity = getStandingStatEntity(standing);

      if (!entity.name) {
        continue;
      }

      const row = rowMap.get(entity.key) ?? {
        key: entity.key,
        id: entity.id,
        type: entity.type,
        name: entity.name,
        counts: createEmptyPlacementCounts(),
        entries: createEmptyPlacementEntries(),
        total: 0
      };

      row.counts[standing.placement] += 1;
      row.entries[standing.placement].push({ label: formatStatisticEditionLabel(edition) });
      row.total += 1;
      rowMap.set(entity.key, row);
    }
  }

  return [...rowMap.values()]
    .map((row) => ({
      ...row,
      entries: sortStatEntries(row.entries)
    }))
    .sort(compareStatisticRows);
}

function getStandingStatEntity(standing: CompetitionStanding) {
  if (standing.country) {
    const id = standing.country.isHistorical
      ? (standing.country.detailRedirectCountryId ?? standing.country.id)
      : standing.country.id;
    const name = standing.country.isHistorical
      ? (standing.country.detailRedirectCountry?.name ?? standing.country.name)
      : standing.country.name;

    return {
      key: `country:${id}`,
      id,
      type: 'country' as const,
      name
    };
  }

  if (standing.club) {
    return {
      key: `club:${standing.club.id}`,
      id: standing.club.id,
      type: 'club' as const,
      name: standing.club.name
    };
  }

  return {
    key: `empty:${standing.id}`,
    id: null,
    type: 'country' as const,
    name: ''
  };
}

function createEmptyPlacementCounts() {
  return Object.fromEntries(placementOrder.map((placement) => [placement, 0])) as Record<
    CompetitionStandingPlacement,
    number
  >;
}

function createEmptyPlacementEntries() {
  return {
    CHAMPION: [],
    RUNNER_UP: [],
    THIRD_PLACE: [],
    FOURTH_PLACE: [],
    SEMI_FINALIST: []
  } satisfies Record<CompetitionStandingPlacement, StandingStatEntry[]>;
}

function sortStatEntries(entries: Record<CompetitionStandingPlacement, StandingStatEntry[]>) {
  return Object.fromEntries(
    placementOrder.map((placement) => [
      placement,
      [...entries[placement]].sort((a, b) => compareEditionLabel(a.label, b.label))
    ])
  ) as Record<CompetitionStandingPlacement, StandingStatEntry[]>;
}

function compareStatisticRows(a: StandingStatRow, b: StandingStatRow) {
  if (a.counts.CHAMPION !== b.counts.CHAMPION) {
    return b.counts.CHAMPION - a.counts.CHAMPION;
  }

  if (a.total !== b.total) {
    return b.total - a.total;
  }

  for (const placement of placementOrder.slice(1)) {
    if (a.counts[placement] !== b.counts[placement]) {
      return b.counts[placement] - a.counts[placement];
    }
  }

  return a.name.localeCompare(b.name, 'zh-CN');
}

function compareEditionLabel(a: string, b: string) {
  const left = Number.parseInt(a, 10);
  const right = Number.parseInt(b, 10);

  if (Number.isFinite(left) && Number.isFinite(right)) {
    return left - right;
  }

  return a.localeCompare(b, 'zh-CN');
}

function formatStatCell(row: StandingStatRow, placement: CompetitionStandingPlacement) {
  const count = row.counts[placement];

  if (!count) {
    return '-';
  }

  return `${count}（${row.entries[placement].map((entry) => entry.label).join('、')}）`;
}

function formatStatisticEditionLabel(edition: CompetitionEdition) {
  const label = props.formatEditionLabel(edition);
  return label.endsWith('年') ? label.slice(0, -1) : label;
}

function getPlacementStyle(placement: CompetitionStandingPlacement) {
  return {
    '--edition-placement-color': getPlacementTextColor(placement)
  };
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h3>年份结果</h3>
        <p>在这里查看该赛事全部年份或赛季的名次结果。</p>
      </div>
      <div class="panel-actions">
        <el-switch
          :model-value="sortAscending"
          active-text="按年份升序"
          inactive-text="倒序"
          @update:model-value="emit('update:sortAscending', $event)"
        />
        <el-button type="primary" @click="emit('batchEdit')">
          <IconFont name="edit" />
          批量编辑结果
        </el-button>
      </div>
    </div>

    <NoDataView v-if="!editions.length" text="暂无年份结果" />

    <el-table v-else :data="editions" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column label="赛季" min-width="120">
        <template #default="{ row }">
          <a
            v-if="row.externalUrl"
            class="edition-link"
            :href="row.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ formatStatisticEditionLabel(row) }}
          </a>
          <span v-else>{{ formatStatisticEditionLabel(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="host" label="举办地" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.host || '-' }}</template>
      </el-table-column>
      <el-table-column label="名次口径" width="120">
        <template #default="{ row }">{{ getStandingModeLabel(row) }}</template>
      </el-table-column>
      <el-table-column
        v-for="field in placementFields"
        :key="field.key"
        min-width="140"
        show-overflow-tooltip
      >
        <template #header>
          <span class="edition-placement-head">
            <HonorPlacementLabel :placement="field.placement" />
            <span v-if="field.standingOrder" class="edition-placement-order">
              {{ field.standingOrder }}
            </span>
          </span>
        </template>
        <template #default="{ row }">
          <EntityLink
            v-if="hasEditionStanding(row, field)"
            :id="getStandingEntityId(row, field)"
            :type="getStandingEntityType(row, field)"
            :name="getStandingEntityName(row, field)"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="60" align="center">
        <template #default="{ row }">{{ formatText(row.quantity) }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="240" show-overflow-tooltip>
        <template #default="{ row }">{{ row.remark || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('edit', row)">
            <IconFont name="edit" />
            编辑
          </el-button>
          <el-button link type="danger" :loading="resultSaving" @click="emit('delete', row)">
            <IconFont name="delete" />
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="edition-statistics">
      <div class="edition-statistics__header">
        <h4>荣誉统计</h4>
        <p>按队伍汇总该赛事已录入年份或赛季的最终名次。</p>
      </div>

      <NoDataView v-if="!statisticsRows.length" text="暂无荣誉统计" />

      <el-table v-else :data="statisticsRows" border class="edition-statistics-table">
        <el-table-column label="序号" width="60" align="center" fixed="left">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="队伍" width="170" fixed="left">
          <template #default="{ row }">
            <EntityLink :id="row.id" :type="row.type" :name="row.name" />
          </template>
        </el-table-column>
        <el-table-column
          v-for="placement in statisticsPlacementColumns"
          :key="placement"
          min-width="190"
          align="center"
          show-overflow-tooltip
        >
          <template #header>
            <HonorPlacementLabel :placement="placement" />
          </template>
          <template #default="{ row }">
            <span class="edition-stat-cell" :style="getPlacementStyle(placement)">
              {{ formatStatCell(row, placement) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="总数" width="70" align="center">
          <template #default="{ row }">
            <strong>{{ row.total }}</strong>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edition-placement-head {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
}

.edition-placement-order {
  flex: 0 0 auto;
}

.edition-link {
  color: var(--color-brand-primary);
  font-weight: 800;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.edition-statistics {
  display: grid;
  gap: 12px;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-brand-subtle);
}

.edition-statistics__header {
  display: grid;
  gap: 4px;

  h4 {
    margin: 0;
    color: var(--text-color-primary);
    font-size: 18px;
    font-weight: 850;
  }

  p {
    margin: 0;
    color: var(--text-color-secondary);
    font-weight: 650;
  }
}

.edition-statistics-table {
  :deep(.edition-stat-cell) {
    color: var(--edition-placement-color, var(--text-color-regular));
    font-size: 14px;
    font-weight: 820;
    line-height: 1.55;
  }
}
</style>

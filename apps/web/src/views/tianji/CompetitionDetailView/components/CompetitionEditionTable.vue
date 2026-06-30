<script setup lang="ts">
import type {
  CompetitionEdition,
  CompetitionEditionStandingMode
} from '@/services/types/competitions';
import EntityLink from '@/components/EntityLink.vue';
import IconFont from '@/components/IconFont.vue';
import HonorPlacementLabel from '@/components/honors/HonorPlacementLabel.vue';
import type { PlacementField } from './types';

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

    <div v-if="!editions.length" class="mini-empty">暂无年份结果</div>

    <el-table v-else :data="editions" border>
      <el-table-column label="赛季" min-width="120">
        <template #default="{ row }">{{ formatEditionLabel(row) }}</template>
      </el-table-column>
      <el-table-column prop="host" label="举办地" min-width="120">
        <template #default="{ row }">{{ row.host || '-' }}</template>
      </el-table-column>
      <el-table-column label="名次口径" width="120">
        <template #default="{ row }">{{ getStandingModeLabel(row) }}</template>
      </el-table-column>
      <el-table-column v-for="field in placementFields" :key="field.key" min-width="120">
        <template #header>
          <span class="edition-placement-head">
            <HonorPlacementLabel :placement="field.placement" />
            <span v-if="field.standingOrder">{{ field.standingOrder }}</span>
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
      <el-table-column prop="quantity" label="数量" width="90">
        <template #default="{ row }">{{ formatText(row.quantity) }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ row.remark || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <div class="edition-actions">
            <el-button link type="primary" @click="emit('edit', row)">
              <IconFont name="edit" />
              编辑
            </el-button>
            <el-button link type="danger" :loading="resultSaving" @click="emit('delete', row)">
              <IconFont name="delete" />
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.edition-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import type {
  CompetitionEdition,
  CompetitionStandingPlacement
} from '@/services/types/competitions';
import EntityLink from '@/components/EntityLink.vue';
import IconFont from '@/components/IconFont.vue';

defineProps<{
  editions: CompetitionEdition[];
  placements: Array<{ label: string; value: CompetitionStandingPlacement }>;
  sortAscending: boolean;
  resultSaving: boolean;
  formatEditionLabel: (edition: CompetitionEdition) => string;
  formatText: (value?: string | number | boolean | null) => string | number | boolean;
  hasEditionStanding: (
    edition: CompetitionEdition,
    placement: CompetitionStandingPlacement
  ) => boolean;
  getStandingEntityId: (
    edition: CompetitionEdition,
    placement: CompetitionStandingPlacement
  ) => string | null | undefined;
  getStandingEntityType: (
    edition: CompetitionEdition,
    placement: CompetitionStandingPlacement
  ) => 'country' | 'club';
  getStandingEntityName: (
    edition: CompetitionEdition,
    placement: CompetitionStandingPlacement
  ) => string;
}>();

const emit = defineEmits<{
  'update:sortAscending': [value: boolean];
  edit: [edition: CompetitionEdition];
  delete: [edition: CompetitionEdition];
  batchEdit: [];
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h3>年份结果</h3>
        <p>在这里查看该赛事全部年份或赛季的冠军、亚军、季军和殿军。</p>
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
      <el-table-column
        v-for="placement in placements"
        :key="placement.value"
        :label="placement.label"
        min-width="120"
      >
        <template #default="{ row }">
          <EntityLink
            v-if="hasEditionStanding(row, placement.value)"
            :id="getStandingEntityId(row, placement.value)"
            :type="getStandingEntityType(row, placement.value)"
            :name="getStandingEntityName(row, placement.value)"
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
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('edit', row)">
            <IconFont name="edit" />
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            :disabled="row.standings.length > 0"
            :loading="resultSaving"
            @click="emit('delete', row)"
          >
            <IconFont name="delete" />
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

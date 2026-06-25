<script setup lang="ts">
import type {
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@/services/types/competitions';
import type { HonorRuleItem } from '@/services/types/honor-rules';

defineProps<{
  items: HonorRuleItem[];
  total: number;
  loading: boolean;
  hasRows: boolean;
  page: number;
  pageSize: number;
  getTargetTypeLabel: (value: CompetitionTargetType) => string;
  getPlacementLabel: (value: CompetitionStandingPlacement) => string;
  formatScore: (row: HonorRuleItem) => string;
}>();

const emit = defineEmits<{
  edit: [row: HonorRuleItem];
  toggle: [row: HonorRuleItem];
  'update:page': [value: number];
  'update:pageSize': [value: number];
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>规则列表</h3>
      <span class="status-pill">{{ total }} 条</span>
    </div>

    <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

    <div v-else-if="!hasRows" class="empty-panel">
      <h3>暂无荣誉规则</h3>
      <p>先新增赛事评分规则，再录入赛事名次并手动重算荣誉分。</p>
    </div>

    <template v-else>
      <el-table :data="items" border>
        <el-table-column prop="sortOrder" label="排序" width="72" />
        <el-table-column prop="code" label="编码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="规则名称" min-width="150" show-overflow-tooltip />
        <el-table-column label="对象" width="92">
          <template #default="{ row }">{{ getTargetTypeLabel(row.targetType) }}</template>
        </el-table-column>
        <el-table-column label="赛事分类" min-width="120">
          <template #default="{ row }">{{ row.category || '未分类' }}</template>
        </el-table-column>
        <el-table-column label="名次" width="84">
          <template #default="{ row }">{{ getPlacementLabel(row.placement) }}</template>
        </el-table-column>
        <el-table-column prop="baseScore" label="基础分" width="92" />
        <el-table-column prop="coefficient" label="系数" width="84" />
        <el-table-column label="实际分" width="92">
          <template #default="{ row }">{{ formatScore(row) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="84">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">{{ row.remark || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="132" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="emit('edit', row)">编辑</el-button>
            <el-button
              link
              :type="row.enabled ? 'warning' : 'success'"
              @click="emit('toggle', row)"
            >
              {{ row.enabled ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @update:current-page="emit('update:page', $event)"
          @update:page-size="emit('update:pageSize', $event)"
        />
      </div>
    </template>
  </div>
</template>

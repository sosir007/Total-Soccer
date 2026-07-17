<script setup lang="ts">
import { toRef } from 'vue';
import type { BaseConfigItem } from '@/services/types/base-config';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import SemanticTag from '@/components/SemanticTag.vue';

interface BaseConfigFilters {
  page: number;
  pageSize: number;
}

const props = defineProps<{
  label: string;
  items: BaseConfigItem[];
  total: number;
  loading: boolean;
  filters: BaseConfigFilters;
  isConfederation: boolean;
  isCity: boolean;
  isPosition: boolean;
  showEnabled: boolean;
}>();

const emit = defineEmits<{
  edit: [row: BaseConfigItem];
  delete: [row: BaseConfigItem];
}>();

const filters = toRef(props, 'filters');
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>{{ label }}列表</h3>
      <span class="status-pill">{{ total }} 条</span>
    </div>

    <el-skeleton v-if="loading && !items.length" :rows="8" animated />

    <NoDataView
      v-else-if="!items.length"
      :text="`暂无${label}配置，可以新增一条配置，或调整当前筛选条件。`"
    />

    <template v-else>
      <el-table class="base-config-table" :data="items" border>
        <el-table-column prop="sortOrder" label="排序" width="60" align="center" />
        <el-table-column v-if="isConfederation || isCity" prop="uid" label="UID" width="96" />
        <el-table-column v-if="!isCity" prop="code" label="编码" min-width="96">
          <template #default="{ row }">{{ row.code || '-' }}</template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="120">
          <template #default="{ row }">{{ row.name || '-' }}</template>
        </el-table-column>
        <el-table-column v-if="isCity" label="管理国家" min-width="120">
          <template #default="{ row }">{{ row.country?.name || '-' }}</template>
        </el-table-column>
        <el-table-column v-if="isPosition" prop="group" label="位置组" width="100">
          <template #default="{ row }">{{ row.group || '-' }}</template>
        </el-table-column>
        <el-table-column
          v-if="!isConfederation"
          prop="description"
          label="描述"
          min-width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">{{ row.description || '-' }}</template>
        </el-table-column>
        <el-table-column v-if="showEnabled" label="状态" width="84">
          <template #default="{ row }">
            <SemanticTag :variant="row.enabled ? 'status-enabled' : 'status-disabled'">
              {{ row.enabled ? '启用' : '停用' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="172" fixed="right">
          <template #default="{ row }">
            <div class="base-config-row-actions">
              <el-button link type="primary" @click="emit('edit', row)">
                <IconFont name="edit" />
                编辑
              </el-button>
              <el-button link type="danger" @click="emit('delete', row)">
                <IconFont name="delete" />
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <el-pagination
          v-model:current-page="filters.page"
          v-model:page-size="filters.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.base-config-table {
  max-width: 100%;
  width: 100%;

  :deep(.el-table__inner-wrapper),
  :deep(.el-table__header-wrapper),
  :deep(.el-table__body-wrapper),
  :deep(.el-scrollbar__wrap) {
    max-width: 100%;
    overflow-x: hidden;
  }

  :deep(.el-scrollbar__bar.is-horizontal) {
    display: none;
  }
}

.base-config-row-actions {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  white-space: nowrap;

  :deep(.el-button) {
    margin-left: 0;
  }
}
</style>

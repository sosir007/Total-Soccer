<script setup lang="ts">
import { toRef } from 'vue';
import type { BaseConfigItem } from '@/services/base-config';

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

    <div v-else-if="!items.length" class="empty-panel">
      <h3>暂无{{ label }}配置</h3>
      <p>可以新增一条配置，或调整当前筛选条件。</p>
    </div>

    <template v-else>
      <el-table class="base-config-table" :data="items" border>
        <el-table-column prop="sortOrder" label="排序" width="72" />
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
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button link type="primary" @click="emit('edit', row)">编辑</el-button>
            <el-button link type="danger" @click="emit('delete', row)">删除</el-button>
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

<style scoped>
.base-config-table {
  max-width: 100%;
  width: 100%;
}

.base-config-table :deep(.el-table__inner-wrapper),
.base-config-table :deep(.el-table__header-wrapper),
.base-config-table :deep(.el-table__body-wrapper),
.base-config-table :deep(.el-scrollbar__wrap) {
  max-width: 100%;
  overflow-x: hidden;
}

.base-config-table :deep(.el-scrollbar__bar.is-horizontal) {
  display: none;
}
</style>

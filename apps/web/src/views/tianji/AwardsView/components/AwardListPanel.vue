<script setup lang="ts">
import type { AwardListItem } from '@/services/awards';
import EntityNameCell from '@/components/EntityNameCell.vue';

defineProps<{
  awards: AwardListItem[];
  total: number;
  loading: boolean;
  hasRows: boolean;
  page: number;
  pageSize: number;
  formatScope: (award: AwardListItem) => string;
}>();

const emit = defineEmits<{
  create: [];
  open: [award: AwardListItem];
  'update:page': [value: number];
  'update:pageSize': [value: number];
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>奖项列表</h3>
      <div class="panel-actions">
        <span class="status-pill">{{ total }} 项奖项</span>
        <el-button type="primary" @click="emit('create')">新增奖项</el-button>
      </div>
    </div>

    <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

    <div v-else-if="!hasRows" class="empty-panel">
      <h3>暂无奖项数据</h3>
      <p>可以先创建金球奖、世界足球先生、洲际年度最佳球员等个人奖项。</p>
    </div>

    <template v-else>
      <el-table :data="awards" border highlight-current-row @row-click="emit('open', $event)">
        <el-table-column label="奖项" min-width="190">
          <template #default="{ row }">
            <EntityNameCell :id="row.id" type="award" :title="row.name" :subtitle="row.code" />
          </template>
        </el-table-column>
        <el-table-column label="范围" width="110">
          <template #default="{ row }">{{ formatScope(row) }}</template>
        </el-table-column>
        <el-table-column label="分类" min-width="120">
          <template #default="{ row }">{{ row.category || '-' }}</template>
        </el-table-column>
        <el-table-column label="年份" width="82">
          <template #default="{ row }">{{ row._count?.editions ?? 0 }}</template>
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

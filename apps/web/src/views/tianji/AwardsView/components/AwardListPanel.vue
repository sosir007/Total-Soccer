<script setup lang="ts">
import type { AwardListItem, AwardTargetType } from '@/services/types/awards';
import IconFont from '@/components/IconFont.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import NoDataView from '@/components/NoDataView.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { getLifecycleStatusLabel, getLifecycleStatusVariant } from '@/utils/tag-theme';

withDefaults(
  defineProps<{
    awards: AwardListItem[];
    total: number;
    loading: boolean;
    hasRows: boolean;
    deletingId: string;
    page: number;
    pageSize: number;
    formatScope: (award: AwardListItem) => string;
    targetTypeLabels: Record<AwardTargetType, string>;
    embedded?: boolean;
  }>(),
  {
    embedded: false
  }
);

const emit = defineEmits<{
  create: [];
  edit: [row: AwardListItem];
  delete: [row: AwardListItem];
  'update:page': [value: number];
  'update:pageSize': [value: number];
}>();

function getRowSequence(page: number, pageSize: number, index: number) {
  return (page - 1) * pageSize + index + 1;
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatTargetType(row: AwardListItem, labels: Record<AwardTargetType, string>) {
  return labels[row.targetType] ?? '-';
}

function openExternalLink(row: AwardListItem) {
  if (!row.externalUrl) {
    return;
  }

  window.open(row.externalUrl, '_blank');
}
</script>

<template>
  <div :class="embedded ? 'list-panel-content' : 'panel'">
    <div class="panel-header">
      <h3>奖项列表</h3>
      <div class="panel-actions">
        <span class="status-pill">{{ total }} 项奖项</span>
        <el-button type="primary" @click="emit('create')">
          <IconFont name="add" />
          新增奖项
        </el-button>
      </div>
    </div>

    <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

    <NoDataView
      v-else-if="!hasRows"
      text="暂无奖项数据，可以先创建金球奖、世界足球先生、洲际年度最佳球员等个人奖项。"
    />

    <template v-else>
      <el-table :data="awards" border>
        <el-table-column label="序号" width="60" align="center" fixed="left">
          <template #default="{ $index }">{{ getRowSequence(page, pageSize, $index) }}</template>
        </el-table-column>
        <el-table-column label="奖项" min-width="220" fixed="left">
          <template #default="{ row }">
            <EntityNameCell :id="row.id" type="award" :title="row.name" :subtitle="row.code" />
          </template>
        </el-table-column>
        <el-table-column label="范围" width="100" align="center" header-align="center">
          <template #default="{ row }">{{ formatScope(row) }}</template>
        </el-table-column>
        <el-table-column label="获奖对象" width="96" align="center" header-align="center">
          <template #default="{ row }">{{ formatTargetType(row, targetTypeLabels) }}</template>
        </el-table-column>
        <el-table-column label="规则分类" min-width="170" show-overflow-tooltip>
          <template #default="{ row }">{{ formatText(row.category) }}</template>
        </el-table-column>
        <el-table-column label="奖项类型" width="110" align="center" header-align="center">
          <template #default="{ row }">{{ formatText(row.level) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="row.enabled ? 'status-enabled' : 'status-disabled'">
              {{ row.enabled ? '启用' : '停用' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="奖项状态" width="96" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getLifecycleStatusVariant(row.lifecycleStatus)">
              {{ getLifecycleStatusLabel(row.lifecycleStatus) }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="年份" width="82" align="center" header-align="center">
          <template #default="{ row }">{{ row._count?.editions ?? 0 }}</template>
        </el-table-column>
        <el-table-column label="外链" width="86" align="center" header-align="center">
          <template #default="{ row }">
            <a
              v-if="row.externalUrl"
              class="external-text-link"
              :href="row.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent.stop="openExternalLink(row)"
            >
              打开
            </a>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
        <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">{{ formatText(row.description) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="emit('edit', row)">
              <IconFont name="edit" />
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              :loading="deletingId === row.id"
              @click.stop="emit('delete', row)"
            >
              <IconFont name="delete" />
              删除
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

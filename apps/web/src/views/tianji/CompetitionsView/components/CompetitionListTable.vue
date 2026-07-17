<script setup lang="ts">
import type { CompetitionListItem } from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import NoDataView from '@/components/NoDataView.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  getCompetitionCategoryVariant,
  getCompetitionLevelVariant,
  getLifecycleStatusLabel,
  getLifecycleStatusVariant,
  type SemanticTagVariant
} from '@/utils/tag-theme';

withDefaults(
  defineProps<{
    competitions: CompetitionListItem[];
    total: number;
    loading: boolean;
    hasRows: boolean;
    hasLoaded: boolean;
    deletingId: string;
    page: number;
    pageSize: number;
    formatTargetType: (competition: CompetitionListItem) => string;
    formatScope: (competition: CompetitionListItem) => string;
    formatText: (value?: string | number | null) => string | number;
    formatFormat: (competition: CompetitionListItem) => string;
    embedded?: boolean;
  }>(),
  {
    embedded: false
  }
);

const emit = defineEmits<{
  create: [];
  edit: [row: CompetitionListItem];
  open: [id: string];
  delete: [row: CompetitionListItem];
  'update:page': [value: number];
  'update:pageSize': [value: number];
}>();

function getRowSequence(page: number, pageSize: number, index: number) {
  return (page - 1) * pageSize + index + 1;
}

function getTargetTypeVariant(row: CompetitionListItem): SemanticTagVariant {
  return row.targetType === 'CLUB' ? 'object-club' : 'object-country';
}

function formatCompetitionSubtitle(row: CompetitionListItem) {
  return row.alias ? `${row.code} · ${row.alias}` : row.code;
}

function openExternalLink(row: CompetitionListItem) {
  if (!row.externalUrl) {
    return;
  }

  window.open(row.externalUrl, '_blank');
}
</script>

<template>
  <div :class="embedded ? 'list-panel-content' : 'panel'">
    <div class="panel-header">
      <h3>赛事列表</h3>
      <div class="panel-actions">
        <span class="status-pill">{{ total }} 项赛事</span>
        <el-button type="primary" @click="emit('create')">
          <IconFont name="add" />
          新增赛事
        </el-button>
      </div>
    </div>

    <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

    <NoDataView
      v-else-if="!hasRows"
      text="暂无赛事数据，可以先创建世界杯、欧洲杯、英超、欧冠等赛事。"
    />

    <template v-else>
      <el-table :data="competitions" border>
        <el-table-column label="序号" width="60" align="center" fixed="left">
          <template #default="{ $index }">{{ getRowSequence(page, pageSize, $index) }}</template>
        </el-table-column>
        <el-table-column label="赛事" min-width="220" fixed="left">
          <template #default="{ row }">
            <EntityNameCell
              :id="row.id"
              type="competition"
              :title="row.name"
              :subtitle="formatCompetitionSubtitle(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="对象" width="92" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getTargetTypeVariant(row)">
              {{ formatTargetType(row) }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="适用范围" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ formatScope(row) }}</template>
        </el-table-column>
        <el-table-column label="分类" width="90" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getCompetitionCategoryVariant(row.category)">
              {{ formatText(row.category) }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="级别" width="90" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getCompetitionLevelVariant(row.level)">
              {{ formatText(row.level) }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="赛制" width="90" align="center" header-align="center">
          <template #default="{ row }">{{ formatFormat(row) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="row.enabled ? 'status-enabled' : 'status-disabled'">
              {{ row.enabled ? '启用' : '停用' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="赛事状态" width="96" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getLifecycleStatusVariant(row.lifecycleStatus)">
              {{ getLifecycleStatusLabel(row.lifecycleStatus) }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="统计" width="90" align="center" header-align="center">
          <template #default="{ row }">
            <SemanticTag :variant="row.includeInStats ? 'status-included' : 'status-excluded'">
              {{ row.includeInStats ? '纳入' : '排除' }}
            </SemanticTag>
          </template>
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

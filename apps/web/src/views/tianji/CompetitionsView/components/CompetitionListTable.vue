<script setup lang="ts">
import type { CompetitionListItem } from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';

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
  competitionExternalUrl: (competition: CompetitionListItem) => string;
  getCategoryTagClass: (value?: string | null) => string[];
  getLevelTagClass: (value?: string | null) => string[];
}>();

const emit = defineEmits<{
  create: [];
  open: [id: string];
  delete: [row: CompetitionListItem];
  'update:page': [value: number];
  'update:pageSize': [value: number];
}>();

function getRowSequence(page: number, pageSize: number, index: number) {
  return (page - 1) * pageSize + index + 1;
}
</script>

<template>
  <div class="panel">
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

    <div v-else-if="!hasRows" class="empty-panel">
      <h3>暂无赛事数据</h3>
      <p>可以先创建世界杯、欧洲杯、英超、欧冠等赛事。</p>
    </div>

    <template v-else>
      <el-table :data="competitions" border>
        <el-table-column label="序号" width="76" fixed="left">
          <template #default="{ $index }">{{ getRowSequence(page, pageSize, $index) }}</template>
        </el-table-column>
        <el-table-column label="赛事" min-width="220" fixed="left">
          <template #default="{ row }">
            <EntityNameCell
              :id="row.id"
              type="competition"
              :title="row.name"
              :subtitle="row.code"
            />
          </template>
        </el-table-column>
        <el-table-column label="对象" width="92">
          <template #default="{ row }">{{ formatTargetType(row) }}</template>
        </el-table-column>
        <el-table-column label="适用范围" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ formatScope(row) }}</template>
        </el-table-column>
        <el-table-column label="分类" width="90">
          <template #default="{ row }">
            <span :class="getCategoryTagClass(row.category)">
              {{ formatText(row.category) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="级别" width="90">
          <template #default="{ row }">
            <span :class="getLevelTagClass(row.level)">
              {{ formatText(row.level) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="赛制" width="90">
          <template #default="{ row }">{{ formatFormat(row) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="统计" width="90">
          <template #default="{ row }">
            <el-tag :type="row.includeInStats ? 'success' : 'info'">
              {{ row.includeInStats ? '纳入' : '排除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="外链" width="86">
          <template #default="{ row }">
            <a
              v-if="row.externalUrl"
              class="external-text-link"
              :href="competitionExternalUrl(row)"
              target="_blank"
              rel="noopener noreferrer"
            >
              打开
            </a>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">{{ formatText(row.description) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="emit('open', row.id)">
              <IconFont name="edit" />
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              :loading="deletingId === row.id"
              @click="emit('delete', row)"
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

<style scoped lang="scss">
.competition-meta-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 46px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 750;
  line-height: 1;
  white-space: nowrap;

  &.competition-category-international {
    color: #986812;
    border-color: #f1d28a;
    background: #fff6dc;
  }

  &.competition-category-continental {
    color: #25658f;
    border-color: #b8d8ed;
    background: #e9f5fb;
  }

  &.competition-category-domestic {
    color: #218353;
    border-color: #bce4ca;
    background: #eaf8ef;
  }

  &.competition-category-other,
  &.competition-category-empty {
    color: #6a756f;
    border-color: #d9e1da;
    background: #f5f7f4;
  }

  &.competition-level-primary {
    color: #1b7a4b;
    border-color: #9ed7b6;
    background: #e8f7ee;
  }

  &.competition-level-secondary {
    color: #806216;
    border-color: #e6cf82;
    background: #fff7d8;
  }

  &.competition-level-tertiary {
    color: #536674;
    border-color: #c7d5dd;
    background: #edf4f7;
  }

  &.competition-level-empty {
    color: #6a756f;
    border-color: #d9e1da;
    background: #f5f7f4;
  }
}
</style>

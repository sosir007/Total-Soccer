<script setup lang="ts">
import type { AwardScopeType } from '@/services/types/awards';
import type { AwardRuleItem } from '@/services/types/award-rules';
import IconFont from '@/components/IconFont.vue';
import SemanticTag from '@/components/SemanticTag.vue';

defineProps<{
  items: AwardRuleItem[];
  total: number;
  loading: boolean;
  hasRows: boolean;
  page: number;
  pageSize: number;
  getAwardScopeLabel: (value?: AwardScopeType | null) => string;
  formatAwardRuleScore: (row: AwardRuleItem) => string;
}>();

const emit = defineEmits<{
  edit: [row: AwardRuleItem];
  toggle: [row: AwardRuleItem];
  'update:page': [value: number];
  'update:pageSize': [value: number];
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>奖项规则列表</h3>
      <span class="status-pill">{{ total }} 条</span>
    </div>

    <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

    <div v-else-if="!hasRows" class="empty-panel">
      <h3>暂无球员奖项规则</h3>
      <p>先新增个人奖项评分规则，再录入奖项获奖人并手动重算球员荣誉分。</p>
    </div>

    <template v-else>
      <el-table :data="items" border>
        <el-table-column prop="sortOrder" label="排序" width="60" align="center" />
        <el-table-column prop="code" label="编码" min-width="130" show-overflow-tooltip />
        <el-table-column prop="name" label="规则名称" min-width="160" show-overflow-tooltip />
        <el-table-column label="范围" width="100">
          <template #default="{ row }">{{ getAwardScopeLabel(row.scopeType) }}</template>
        </el-table-column>
        <el-table-column label="奖项分类" min-width="120">
          <template #default="{ row }">{{ row.category || '全部分类' }}</template>
        </el-table-column>
        <el-table-column label="名次文本" min-width="110">
          <template #default="{ row }">{{ row.placement || '不限' }}</template>
        </el-table-column>
        <el-table-column label="排名" width="84">
          <template #default="{ row }">{{ row.rank ?? '不限' }}</template>
        </el-table-column>
        <el-table-column prop="baseScore" label="基础分" width="92" />
        <el-table-column prop="coefficient" label="系数" width="84" />
        <el-table-column label="实际分" width="92">
          <template #default="{ row }">{{ formatAwardRuleScore(row) }}</template>
        </el-table-column>
        <el-table-column label="顶级奖" width="86">
          <template #default="{ row }">
            <SemanticTag :variant="row.topAward ? 'status-top-award' : 'status-disabled'">
              {{ row.topAward ? '是' : '否' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="84">
          <template #default="{ row }">
            <SemanticTag :variant="row.enabled ? 'status-enabled' : 'status-disabled'">
              {{ row.enabled ? '启用' : '停用' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">{{ row.remark || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="132" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="emit('edit', row)">
              <IconFont name="edit" />
              编辑
            </el-button>
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

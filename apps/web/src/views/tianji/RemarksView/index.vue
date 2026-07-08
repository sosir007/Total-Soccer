<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { fetchRemarks } from '@/services/modules/remarks';
import type { RemarkItem, RemarkObjectType } from '@/services/types/remarks';
import IconFont from '@/components/IconFont.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import SemanticTag from '@/components/SemanticTag.vue';

type RemarkEntityType = 'country' | 'club' | 'player' | 'competition' | 'award';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const remarks = ref<RemarkItem[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  objectType: '' as '' | RemarkObjectType,
  hasRemark: 'true' as 'true' | 'false' | 'all'
});

const objectTypeOptions: Array<{ label: string; value: RemarkObjectType }> = [
  { label: '球员', value: 'PLAYER' },
  { label: '国家', value: 'COUNTRY' },
  { label: '俱乐部', value: 'CLUB' },
  { label: '赛事', value: 'COMPETITION' },
  { label: '奖项', value: 'AWARD' },
  { label: '城市', value: 'CITY' },
  { label: '基础配置', value: 'BASE_CONFIG' }
];
const remarkStatusOptions = [
  { label: '有备注', value: 'true' },
  { label: '无备注', value: 'false' },
  { label: '全部', value: 'all' }
] as const;

const hasRows = computed(() => remarks.value.length > 0);

async function loadRemarks() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchRemarks({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      objectType: filters.objectType || undefined,
      hasRemark: filters.hasRemark
    });
    remarks.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '备注列表加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadRemarks();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.objectType = '';
  filters.hasRemark = 'true';
  void loadRemarks();
}

function openTarget(row: RemarkItem) {
  if (row.routeName) {
    void router.push({
      name: row.routeName,
      params: row.routeParams ?? {}
    });
    return;
  }

  if (row.managementRouteName) {
    void router.push({
      name: row.managementRouteName
    });
  }
}

function canOpen(row: RemarkItem) {
  return Boolean(row.routeName || row.managementRouteName);
}

function getRemarkEntityType(row: RemarkItem): RemarkEntityType | null {
  const typeMap: Partial<Record<RemarkObjectType, RemarkEntityType>> = {
    PLAYER: 'player',
    COUNTRY: 'country',
    CLUB: 'club',
    COMPETITION: 'competition',
    AWARD: 'award'
  };

  return typeMap[row.objectType] ?? null;
}

function formatDate(value?: string | null) {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';
}

function formatSourceField(row: RemarkItem) {
  return row.sourceField === 'remark' ? '备注' : '描述';
}

function rowIndex(index: number) {
  return (filters.page - 1) * filters.pageSize + index + 1;
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadRemarks();
  }
);

onMounted(() => {
  void loadRemarks();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>备注管理</h2>
          <p>集中查看资料库中的备注和描述，快速定位到对应资料或管理页面。</p>
        </div>
        <span class="status-pill">只读聚合</span>
      </div>

      <el-form
        class="filter-grid compact-filter remarks-filter"
        label-position="top"
        @submit.prevent="submitFilters"
      >
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="名称 / UID / 编码 / 备注内容"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="对象类型">
          <el-select v-model="filters.objectType" clearable placeholder="全部对象">
            <el-option
              v-for="option in objectTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注状态">
          <el-select v-model="filters.hasRemark">
            <el-option
              v-for="option in remarkStatusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <div class="filter-actions">
          <el-button type="primary" :loading="loading" @click="submitFilters">
            <IconFont name="filter" />
            筛选
          </el-button>
          <el-button :disabled="loading" @click="resetFilters">
            <IconFont name="reset" />
            重置
          </el-button>
        </div>
      </el-form>
    </div>

    <div class="backup-grid">
      <div class="panel backup-panel">
        <div class="panel-header">
          <h3>数据安全提醒</h3>
          <span class="status-pill">本地数据库</span>
        </div>
        <p>
          GitHub 只保存代码、迁移和文档；你手动录入的球员、国家、俱乐部、赛事和奖项数据保存在本机
          PostgreSQL，不会跟随代码自动推送。
        </p>
      </div>

      <div class="panel backup-panel">
        <div class="panel-header">
          <h3>手动备份命令</h3>
          <span class="status-pill">PostgreSQL</span>
        </div>
        <code class="backup-command">
          pg_dump "$DATABASE_URL" -Fc -f backups/total-soccer-$(date +%Y%m%d).dump
        </code>
      </div>
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>备注列表</h3>
        <span class="status-pill">{{ total }} 条</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无备注记录</h3>
        <p>当前筛选条件下没有备注或描述，可以切换为“全部”查看未填写备注的对象。</p>
      </div>

      <template v-else>
        <el-table :data="remarks" border>
          <el-table-column label="序号" width="60" align="center" fixed>
            <template #default="{ $index }">{{ rowIndex($index) }}</template>
          </el-table-column>
          <el-table-column label="对象" min-width="220" fixed>
            <template #default="{ row }">
              <EntityNameCell
                v-if="getRemarkEntityType(row)"
                :id="row.objectId"
                :type="getRemarkEntityType(row)!"
                :title="row.name"
                :subtitle="row.code ? `UID / 编码 ${row.code}` : row.objectId"
              />
              <button
                v-else-if="canOpen(row)"
                class="table-name-link player-name-cell"
                type="button"
                @click="openTarget(row)"
              >
                <strong>{{ row.name }}</strong>
                <span>{{ row.code ? `UID / 编码 ${row.code}` : row.objectId }}</span>
              </button>
              <div v-else class="player-name-cell">
                <strong>{{ row.name }}</strong>
                <span>{{ row.code ? `UID / 编码 ${row.code}` : row.objectId }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="120">
            <template #default="{ row }">
              <SemanticTag variant="neutral">{{ row.subType || row.objectTypeLabel }}</SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="字段" width="86">
            <template #default="{ row }">{{ formatSourceField(row) }}</template>
          </el-table-column>
          <el-table-column label="备注内容" min-width="320" show-overflow-tooltip>
            <template #default="{ row }">{{ row.content || '-' }}</template>
          </el-table-column>
          <el-table-column label="更新时间" width="160">
            <template #default="{ row }">{{ formatDate(row.updatedAt) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link :disabled="!canOpen(row)" @click="openTarget(row)">
                定位
              </el-button>
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
  </section>
</template>

<style scoped lang="scss">
.remarks-filter {
  grid-template-columns: minmax(240px, 1fr) 240px 240px auto;
}

.backup-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.8fr);
  gap: 18px;
}

.backup-panel {
  p {
    margin: 0;
    color: var(--text-color-secondary);
    line-height: 1.8;
  }
}

.backup-command {
  display: block;
  padding: 12px 14px;
  overflow-x: auto;
  border: 1px solid var(--color-border-brand-subtle);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-surface-brand-soft) 80%, var(--color-surface-default));
  color: var(--color-brand-primary);
  font-size: 13px;
  line-height: 1.6;
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .remarks-filter,
  .backup-grid {
    grid-template-columns: 1fr;
  }
}
</style>

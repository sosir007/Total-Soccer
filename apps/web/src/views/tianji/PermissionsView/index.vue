<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { fetchAuditLogs, type AuditAction, type AuditLogItem } from '@/services/audit-logs';

const loading = ref(false);
const errorMessage = ref('');
const logs = ref<AuditLogItem[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  module: '',
  action: '' as '' | AuditAction,
  success: ''
});

const actionOptions: Array<{ label: string; value: AuditAction }> = [
  { label: '创建', value: 'CREATE' },
  { label: '编辑', value: 'UPDATE' },
  { label: '重算', value: 'RECALCULATE' },
  { label: '导入', value: 'IMPORT' },
  { label: '写入', value: 'UPSERT' },
  { label: '其他', value: 'OTHER' }
];
const successOptions = [
  { label: '成功', value: 'true' },
  { label: '失败', value: 'false' }
];
const roleRows = [
  {
    permission: '查看资料和统计',
    viewer: true,
    editor: true,
    admin: true
  },
  {
    permission: '新增和编辑资料',
    viewer: false,
    editor: true,
    admin: true
  },
  {
    permission: '导入、重算和规则配置',
    viewer: false,
    editor: false,
    admin: true
  },
  {
    permission: '用户、权限和审计配置',
    viewer: false,
    editor: false,
    admin: true
  }
];
const dangerActions = ['导入确认', '国家/俱乐部荣誉分重算', '球员奖项分重算', '核心资料新增和编辑'];
const actionLabels = Object.fromEntries(
  actionOptions.map((item) => [item.value, item.label])
) as Record<AuditAction, string>;

const hasRows = computed(() => logs.value.length > 0);

async function loadLogs() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchAuditLogs({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      module: filters.module || undefined,
      action: filters.action || undefined,
      success: filters.success || undefined
    });
    logs.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '审计日志加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadLogs();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.module = '';
  filters.action = '';
  filters.success = '';
  void loadLogs();
}

function rowIndex(index: number) {
  return (filters.page - 1) * filters.pageSize + index + 1;
}

function formatDate(value?: string | null) {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-';
}

function formatAction(value: AuditAction) {
  return actionLabels[value] ?? value;
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatRoleValue(value: boolean) {
  return value ? '允许' : '暂不开放';
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadLogs();
  }
);

onMounted(() => {
  void loadLogs();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>权限与审计</h2>
          <p>当前是本地单人模式：暂不做登录拦截，先记录关键写操作，方便回溯和排查。</p>
        </div>
        <span class="status-pill">LOCAL_USER</span>
      </div>

      <div class="safety-grid">
        <div class="safety-card">
          <strong>本地单人模式</strong>
          <span>所有操作默认归属 LOCAL_USER。</span>
        </div>
        <div class="safety-card">
          <strong>暂无权限拦截</strong>
          <span>权限矩阵先作为后续 RBAC 设计稿。</span>
        </div>
        <div class="safety-card">
          <strong>数据库在本地</strong>
          <span>录入数据保存在 PostgreSQL，不会随 GitHub 自动推送。</span>
        </div>
      </div>
    </div>

    <div class="overview-grid">
      <div class="panel">
        <div class="panel-header">
          <h3>角色权限矩阵</h3>
          <span class="status-pill">设计稿</span>
        </div>
        <el-table :data="roleRows" border>
          <el-table-column prop="permission" label="权限点" min-width="180" />
          <el-table-column label="查看者" width="110">
            <template #default="{ row }">{{ formatRoleValue(row.viewer) }}</template>
          </el-table-column>
          <el-table-column label="编辑者" width="110">
            <template #default="{ row }">{{ formatRoleValue(row.editor) }}</template>
          </el-table-column>
          <el-table-column label="管理员" width="110">
            <template #default="{ row }">{{ formatRoleValue(row.admin) }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>危险操作清单</h3>
          <span class="status-pill">已纳入审计</span>
        </div>
        <div class="danger-list">
          <div v-for="item in dangerActions" :key="item">
            <strong>{{ item }}</strong>
            <span>成功或失败都会写入审计日志。</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <h3>审计日志</h3>
          <p>只记录 POST、PUT、PATCH、DELETE 请求，GET 查询不会写入日志。</p>
        </div>
        <span class="status-pill">{{ total }} 条</span>
      </div>

      <el-form
        class="filter-grid compact-filter audit-filter"
        label-position="top"
        @submit.prevent="submitFilters"
      >
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="摘要 / 模块 / 路径 / 对象"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="模块">
          <el-input
            v-model="filters.module"
            clearable
            placeholder="例如 球员资料 / 荣誉规则"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="操作">
          <el-select v-model="filters.action" clearable placeholder="全部操作">
            <el-option
              v-for="option in actionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.success" clearable placeholder="全部状态">
            <el-option
              v-for="option in successOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <div class="filter-actions">
          <el-button type="primary" :loading="loading" @click="submitFilters">筛选</el-button>
          <el-button :disabled="loading" @click="resetFilters">重置</el-button>
        </div>
      </el-form>
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="panel">
      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无审计日志</h3>
        <p>新增、编辑、导入确认或荣誉重算后，这里会出现操作记录。</p>
      </div>

      <template v-else>
        <el-table :data="logs" border>
          <el-table-column label="序号" width="76" fixed>
            <template #default="{ $index }">{{ rowIndex($index) }}</template>
          </el-table-column>
          <el-table-column label="时间" width="170" fixed>
            <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
          </el-table-column>
          <el-table-column label="模块" min-width="130">
            <template #default="{ row }">{{ row.module }}</template>
          </el-table-column>
          <el-table-column label="操作" width="86">
            <template #default="{ row }">{{ formatAction(row.action) }}</template>
          </el-table-column>
          <el-table-column label="状态" width="92">
            <template #default="{ row }">
              <el-tag :type="row.success ? 'success' : 'danger'">
                {{ row.success ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="请求" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">{{ row.method }} {{ row.path }}</template>
          </el-table-column>
          <el-table-column label="对象" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              {{ formatText(row.objectType) }} / {{ formatText(row.objectId) }}
            </template>
          </el-table-column>
          <el-table-column label="摘要" min-width="260" show-overflow-tooltip>
            <template #default="{ row }">{{ formatText(row.summary) }}</template>
          </el-table-column>
          <el-table-column label="操作者" width="120">
            <template #default="{ row }">{{ row.actor }}</template>
          </el-table-column>
          <el-table-column label="状态码" width="86">
            <template #default="{ row }">{{ formatText(row.statusCode) }}</template>
          </el-table-column>
          <el-table-column label="IP" width="130" show-overflow-tooltip>
            <template #default="{ row }">{{ formatText(row.ip) }}</template>
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
.safety-grid,
.overview-grid {
  display: grid;
  gap: 18px;
}

.safety-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.overview-grid {
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
}

.safety-card,
.danger-list > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border: 1px solid rgb(15 118 110 / 14%);
  border-radius: 8px;
  background: rgb(240 253 244 / 58%);
}

.safety-card {
  span {
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 1.6;
  }
}

.danger-list {
  display: grid;
  gap: 10px;

  span {
    color: var(--color-text-muted);
    font-size: 13px;
    line-height: 1.6;
  }
}

.audit-filter {
  grid-template-columns: minmax(240px, 1fr) 240px 180px 160px auto;
}

@media (max-width: 1180px) {
  .safety-grid,
  .overview-grid,
  .audit-filter {
    grid-template-columns: 1fr;
  }
}
</style>

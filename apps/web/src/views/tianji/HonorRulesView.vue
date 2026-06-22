<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createHonorRule,
  fetchHonorRules,
  recalculateHonorScores,
  updateHonorRule,
  type HonorRuleItem,
  type HonorRulePayload
} from '@/services/honor-rules';
import type { CompetitionStandingPlacement, CompetitionTargetType } from '@/services/competitions';

const targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }> = [
  { label: '国家队', value: 'COUNTRY' },
  { label: '俱乐部', value: 'CLUB' }
];
const placementOptions: Array<{ label: string; value: CompetitionStandingPlacement }> = [
  { label: '冠军', value: 'CHAMPION' },
  { label: '亚军', value: 'RUNNER_UP' },
  { label: '季军', value: 'THIRD_PLACE' },
  { label: '殿军', value: 'FOURTH_PLACE' }
];
const enabledOptions = [
  { label: '启用', value: 'true' },
  { label: '停用', value: 'false' }
];
const targetTypeLabels = Object.fromEntries(
  targetTypeOptions.map((item) => [item.value, item.label])
) as Record<CompetitionTargetType, string>;
const placementLabels = Object.fromEntries(
  placementOptions.map((item) => [item.value, item.label])
) as Record<CompetitionStandingPlacement, string>;

const loading = ref(false);
const submitting = ref(false);
const recalculating = ref(false);
const dialogVisible = ref(false);
const editingItem = ref<HonorRuleItem | null>(null);
const errorMessage = ref('');
const items = ref<HonorRuleItem[]>([]);
const total = ref(0);
const lastRecalculateSummary = ref('');

const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  targetType: '' as '' | CompetitionTargetType,
  placement: '' as '' | CompetitionStandingPlacement,
  enabled: ''
});
const form = reactive<HonorRulePayload>({
  code: '',
  name: '',
  targetType: 'COUNTRY',
  category: '',
  placement: 'CHAMPION',
  baseScore: 0,
  coefficient: 1,
  enabled: true,
  sortOrder: 0,
  remark: ''
});

const hasRows = computed(() => items.value.length > 0);
const dialogTitle = computed(() => (editingItem.value ? '编辑荣誉规则' : '新增荣誉规则'));

async function loadRules() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchHonorRules({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      targetType: filters.targetType || undefined,
      placement: filters.placement || undefined,
      enabled: filters.enabled || undefined
    });
    items.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '荣誉规则加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadRules();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.targetType = '';
  filters.placement = '';
  filters.enabled = '';
  void loadRules();
}

function resetForm() {
  form.code = '';
  form.name = '';
  form.targetType = 'COUNTRY';
  form.category = '';
  form.placement = 'CHAMPION';
  form.baseScore = 0;
  form.coefficient = 1;
  form.enabled = true;
  form.sortOrder = 0;
  form.remark = '';
}

function openCreateDialog() {
  editingItem.value = null;
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: HonorRuleItem) {
  editingItem.value = row;
  form.code = row.code;
  form.name = row.name;
  form.targetType = row.targetType;
  form.category = row.category ?? '';
  form.placement = row.placement;
  form.baseScore = row.baseScore;
  form.coefficient = row.coefficient;
  form.enabled = row.enabled;
  form.sortOrder = row.sortOrder;
  form.remark = row.remark ?? '';
  dialogVisible.value = true;
}

function validateForm() {
  if (!form.code.trim()) {
    ElMessage.warning('请填写规则编码。');
    return false;
  }

  if (!form.name.trim()) {
    ElMessage.warning('请填写规则名称。');
    return false;
  }

  if (!Number.isFinite(form.baseScore) || form.baseScore < 0) {
    ElMessage.warning('基础分必须是不小于 0 的数字。');
    return false;
  }

  if (!Number.isFinite(form.coefficient) || form.coefficient < 0) {
    ElMessage.warning('系数必须是不小于 0 的数字。');
    return false;
  }

  return true;
}

function buildPayload(): HonorRulePayload {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    targetType: form.targetType,
    category: form.category?.trim() || undefined,
    placement: form.placement,
    baseScore: Number(form.baseScore),
    coefficient: Number(form.coefficient),
    enabled: form.enabled,
    sortOrder: form.sortOrder ?? 0,
    remark: form.remark?.trim() || undefined
  };
}

async function saveRule() {
  if (!validateForm()) {
    return;
  }

  submitting.value = true;

  try {
    const payload = buildPayload();

    if (editingItem.value) {
      await updateHonorRule(editingItem.value.id, payload);
      ElMessage.success('荣誉规则已更新。');
    } else {
      await createHonorRule(payload);
      ElMessage.success('荣誉规则已创建。');
    }

    dialogVisible.value = false;
    await loadRules();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存荣誉规则失败。');
  } finally {
    submitting.value = false;
  }
}

async function toggleRule(row: HonorRuleItem) {
  submitting.value = true;

  try {
    await updateHonorRule(row.id, {
      code: row.code,
      name: row.name,
      targetType: row.targetType,
      category: row.category ?? undefined,
      placement: row.placement,
      baseScore: row.baseScore,
      coefficient: row.coefficient,
      enabled: !row.enabled,
      sortOrder: row.sortOrder,
      remark: row.remark ?? undefined
    });
    ElMessage.success(row.enabled ? '规则已停用。' : '规则已启用。');
    await loadRules();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '切换规则状态失败。');
  } finally {
    submitting.value = false;
  }
}

async function recalculateScores() {
  try {
    await ElMessageBox.confirm(
      '将根据当前启用规则重新计算国家和俱乐部荣誉分，并写回概览统计字段。是否继续？',
      '重新计算荣誉分',
      {
        confirmButtonText: '开始重算',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
  } catch {
    return;
  }

  recalculating.value = true;

  try {
    const result = await recalculateHonorScores();
    lastRecalculateSummary.value = `已处理 ${result.countryCount} 个国家、${result.clubCount} 个俱乐部、${result.standingCount} 条名次记录，启用规则 ${result.enabledRuleCount} 条。`;
    ElMessage.success('荣誉分重算完成。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '荣誉分重算失败。');
  } finally {
    recalculating.value = false;
  }
}

function formatScore(row: HonorRuleItem) {
  return Number(row.baseScore * row.coefficient).toFixed(2);
}

function getTargetTypeLabel(value: CompetitionTargetType) {
  return targetTypeLabels[value] ?? value;
}

function getPlacementLabel(value: CompetitionStandingPlacement) {
  return placementLabels[value] ?? value;
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadRules();
  }
);

onMounted(() => {
  void loadRules();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>荣誉规则</h2>
          <p>按赛事对象、分类和名次配置评分规则，手动触发后更新国家与俱乐部荣誉分。</p>
        </div>
        <div class="header-actions">
          <el-button type="warning" :loading="recalculating" @click="recalculateScores">
            重新计算荣誉分
          </el-button>
          <el-button type="success" :disabled="loading" @click="openCreateDialog">
            新增规则
          </el-button>
        </div>
      </div>

      <el-form
        class="filter-grid compact-filter honor-rule-filter"
        label-position="top"
        @submit.prevent="submitFilters"
      >
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="编码 / 名称 / 分类 / 备注"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="对象">
          <el-select v-model="filters.targetType" clearable placeholder="全部对象">
            <el-option
              v-for="option in targetTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名次">
          <el-select v-model="filters.placement" clearable placeholder="全部名次">
            <el-option
              v-for="option in placementOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.enabled" clearable placeholder="全部状态">
            <el-option
              v-for="option in enabledOptions"
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

      <el-alert
        v-if="lastRecalculateSummary"
        class="recalculate-alert"
        type="success"
        :title="lastRecalculateSummary"
        show-icon
        :closable="false"
      />
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

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
              <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
              <el-button link :type="row.enabled ? 'warning' : 'success'" @click="toggleRule(row)">
                {{ row.enabled ? '停用' : '启用' }}
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="620px">
      <el-form class="honor-rule-form" label-position="top">
        <el-form-item label="规则编码" required>
          <el-input v-model="form.code" placeholder="例如 WORLD_CUP_CHAMPION" />
        </el-form-item>
        <el-form-item label="规则名称" required>
          <el-input v-model="form.name" placeholder="例如 世界杯冠军" />
        </el-form-item>
        <el-form-item label="对象类型" required>
          <el-select v-model="form.targetType">
            <el-option
              v-for="option in targetTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="赛事分类">
          <el-input v-model="form.category" placeholder="需要与赛事分类完全一致，例如 世界杯" />
        </el-form-item>
        <el-form-item label="名次" required>
          <el-select v-model="form.placement">
            <el-option
              v-for="option in placementOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基础分" required>
          <el-input-number v-model="form.baseScore" :min="0" :precision="2" :controls="false" />
        </el-form-item>
        <el-form-item label="系数" required>
          <el-input-number v-model="form.coefficient" :min="0" :precision="2" :controls="false" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" :controls="false" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="可填写评分口径说明"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :disabled="submitting" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="saveRule">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.honor-rule-filter {
  grid-template-columns: minmax(240px, 1fr) repeat(3, 240px) auto;
}

.recalculate-alert {
  margin-top: 16px;
}

.honor-rule-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.honor-rule-form :deep(.el-form-item:last-child) {
  grid-column: 1 / -1;
}

@media (max-width: 1180px) {
  .honor-rule-filter {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 720px) {
  .honor-rule-form,
  .honor-rule-filter {
    grid-template-columns: 1fr;
  }
}
</style>

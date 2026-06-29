<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  fetchHonorRules,
  recalculateHonorScores,
  updateHonorRule
} from '@/services/modules/honor-rules';
import type { HonorRuleItem, HonorRulePayload } from '@/services/types/honor-rules';
import {
  createAwardRule,
  fetchAwardRules,
  recalculateAwardScores,
  updateAwardRule
} from '@/services/modules/award-rules';
import type { AwardRuleItem, AwardRulePayload } from '@/services/types/award-rules';
import type { AwardScopeType } from '@/services/types/awards';
import type { CompetitionTargetType } from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';
import AwardRuleDialog from './components/AwardRuleDialog.vue';
import AwardRuleListPanel from './components/AwardRuleListPanel.vue';
import HonorRuleDialog from './components/HonorRuleDialog.vue';
import HonorRuleListPanel from './components/HonorRuleListPanel.vue';

const targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }> = [
  { label: '国家队', value: 'COUNTRY' },
  { label: '俱乐部', value: 'CLUB' }
];
const enabledOptions = [
  { label: '启用', value: 'true' },
  { label: '停用', value: 'false' }
];
const awardScopeOptions: Array<{ label: string; value: AwardScopeType }> = [
  { label: '世界', value: 'WORLD' },
  { label: '洲际', value: 'CONFEDERATION' },
  { label: '国家', value: 'COUNTRY' },
  { label: '联赛', value: 'LEAGUE' },
  { label: '俱乐部', value: 'CLUB' },
  { label: '媒体', value: 'MEDIA' }
];
const targetTypeLabels = Object.fromEntries(
  targetTypeOptions.map((item) => [item.value, item.label])
) as Record<CompetitionTargetType, string>;
const awardScopeLabels = Object.fromEntries(
  awardScopeOptions.map((item) => [item.value, item.label])
) as Record<AwardScopeType, string>;

const activeTab = ref<'competition' | 'player-award'>('competition');
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
  keyword: '',
  enabled: ''
});
const form = reactive<HonorRulePayload>({
  championScore: null,
  runnerUpScore: null,
  thirdPlaceScore: null,
  fourthPlaceScore: null,
  typicalCompetitionIds: [],
  remark: null
});

const countryRules = computed(() => items.value.filter((item) => item.targetType === 'COUNTRY'));
const clubRules = computed(() => items.value.filter((item) => item.targetType === 'CLUB'));
const dialogTitle = computed(() =>
  editingItem.value ? `编辑荣誉规则：${editingItem.value.name}` : '编辑荣誉规则'
);

const awardLoading = ref(false);
const awardSubmitting = ref(false);
const awardRecalculating = ref(false);
const awardDialogVisible = ref(false);
const awardEditingItem = ref<AwardRuleItem | null>(null);
const awardErrorMessage = ref('');
const awardItems = ref<AwardRuleItem[]>([]);
const awardTotal = ref(0);
const lastAwardRecalculateSummary = ref('');
const awardFilters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  scopeType: '' as '' | AwardScopeType,
  enabled: ''
});
const awardForm = reactive<AwardRulePayload>({
  code: '',
  name: '',
  scopeType: null,
  category: '',
  placement: '',
  rank: null,
  baseScore: 0,
  coefficient: 1,
  topAward: false,
  enabled: true,
  sortOrder: 0,
  remark: ''
});
const hasAwardRows = computed(() => awardItems.value.length > 0);
const awardDialogTitle = computed(() =>
  awardEditingItem.value ? '编辑球员奖项规则' : '新增球员奖项规则'
);

async function loadRules() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchHonorRules({
      page: 1,
      pageSize: 100,
      keyword: filters.keyword || undefined,
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
  void loadRules();
}

function resetFilters() {
  filters.keyword = '';
  filters.enabled = '';
  void loadRules();
}

function resetForm() {
  form.championScore = null;
  form.runnerUpScore = null;
  form.thirdPlaceScore = null;
  form.fourthPlaceScore = null;
  form.typicalCompetitionIds = [];
  form.remark = null;
}

function openEditDialog(row: HonorRuleItem) {
  editingItem.value = row;
  form.championScore = row.championScore ?? null;
  form.runnerUpScore = row.runnerUpScore ?? null;
  form.thirdPlaceScore = row.thirdPlaceScore ?? null;
  form.fourthPlaceScore = row.fourthPlaceScore ?? null;
  form.typicalCompetitionIds = (row.typicalCompetitions ?? []).map((item) => item.competition.id);
  form.remark = row.remark ?? null;
  dialogVisible.value = true;
}

function validateNullableScore(value: unknown, label: string) {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (!Number.isFinite(Number(value)) || Number(value) < 0) {
    ElMessage.warning(`${label}必须是不小于 0 的数字。`);
    return false;
  }

  return true;
}

function validateForm() {
  return (
    validateNullableScore(form.championScore, '冠军分') &&
    validateNullableScore(form.runnerUpScore, '亚军分') &&
    validateNullableScore(form.thirdPlaceScore, '季军分') &&
    validateNullableScore(form.fourthPlaceScore, '殿军分')
  );
}

function normalizeNullableNumber(value: number | null | undefined) {
  return value === null || value === undefined ? null : Number(value);
}

function buildPayload(): HonorRulePayload {
  return {
    championScore: normalizeNullableNumber(form.championScore),
    runnerUpScore: normalizeNullableNumber(form.runnerUpScore),
    thirdPlaceScore: normalizeNullableNumber(form.thirdPlaceScore),
    fourthPlaceScore: normalizeNullableNumber(form.fourthPlaceScore),
    typicalCompetitionIds: form.typicalCompetitionIds ?? [],
    remark: form.remark?.trim() || null
  };
}

async function saveRule() {
  if (!editingItem.value || !validateForm()) {
    return;
  }

  submitting.value = true;

  try {
    await updateHonorRule(editingItem.value.id, buildPayload());
    ElMessage.success('荣誉规则已更新。');
    dialogVisible.value = false;
    resetForm();
    await loadRules();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存荣誉规则失败。');
  } finally {
    submitting.value = false;
  }
}

async function recalculateScores() {
  try {
    await ElMessageBox.confirm(
      '将根据当前系统规则重新计算国家和俱乐部荣誉分，并写回概览统计字段。是否继续？',
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

function getTargetTypeLabel(value: CompetitionTargetType) {
  return targetTypeLabels[value] ?? value;
}

function getAwardScopeLabel(value?: AwardScopeType | null) {
  return value ? (awardScopeLabels[value] ?? value) : '全部范围';
}

async function loadAwardRules() {
  awardLoading.value = true;
  awardErrorMessage.value = '';

  try {
    const result = await fetchAwardRules({
      page: awardFilters.page,
      pageSize: awardFilters.pageSize,
      keyword: awardFilters.keyword || undefined,
      scopeType: awardFilters.scopeType || undefined,
      enabled: awardFilters.enabled || undefined
    });
    awardItems.value = result.items;
    awardTotal.value = result.total;
  } catch (error) {
    awardErrorMessage.value = error instanceof Error ? error.message : '球员奖项规则加载失败。';
    ElMessage.error(awardErrorMessage.value);
  } finally {
    awardLoading.value = false;
  }
}

function submitAwardFilters() {
  awardFilters.page = 1;
  void loadAwardRules();
}

function resetAwardFilters() {
  awardFilters.page = 1;
  awardFilters.keyword = '';
  awardFilters.scopeType = '';
  awardFilters.enabled = '';
  void loadAwardRules();
}

function resetAwardForm() {
  awardForm.code = '';
  awardForm.name = '';
  awardForm.scopeType = null;
  awardForm.category = '';
  awardForm.placement = '';
  awardForm.rank = null;
  awardForm.baseScore = 0;
  awardForm.coefficient = 1;
  awardForm.topAward = false;
  awardForm.enabled = true;
  awardForm.sortOrder = 0;
  awardForm.remark = '';
}

function openCreateAwardDialog() {
  awardEditingItem.value = null;
  resetAwardForm();
  awardDialogVisible.value = true;
}

function openEditAwardDialog(row: AwardRuleItem) {
  awardEditingItem.value = row;
  awardForm.code = row.code;
  awardForm.name = row.name;
  awardForm.scopeType = row.scopeType ?? null;
  awardForm.category = row.category ?? '';
  awardForm.placement = row.placement ?? '';
  awardForm.rank = row.rank ?? null;
  awardForm.baseScore = row.baseScore;
  awardForm.coefficient = row.coefficient;
  awardForm.topAward = row.topAward;
  awardForm.enabled = row.enabled;
  awardForm.sortOrder = row.sortOrder;
  awardForm.remark = row.remark ?? '';
  awardDialogVisible.value = true;
}

function validateAwardForm() {
  if (!awardForm.code.trim()) {
    ElMessage.warning('请填写规则编码。');
    return false;
  }

  if (!awardForm.name.trim()) {
    ElMessage.warning('请填写规则名称。');
    return false;
  }

  if (!Number.isFinite(awardForm.baseScore) || awardForm.baseScore < 0) {
    ElMessage.warning('基础分必须是不小于 0 的数字。');
    return false;
  }

  if (!Number.isFinite(awardForm.coefficient) || awardForm.coefficient < 0) {
    ElMessage.warning('系数必须是不小于 0 的数字。');
    return false;
  }

  if (
    awardForm.rank !== null &&
    awardForm.rank !== undefined &&
    (!Number.isInteger(Number(awardForm.rank)) || Number(awardForm.rank) < 1)
  ) {
    ElMessage.warning('排名必须是大于 0 的整数。');
    return false;
  }

  return true;
}

function buildAwardPayload(): AwardRulePayload {
  return {
    code: awardForm.code.trim(),
    name: awardForm.name.trim(),
    scopeType: awardForm.scopeType || null,
    category: awardForm.category?.trim() || undefined,
    placement: awardForm.placement?.trim() || undefined,
    rank: awardForm.rank === null || awardForm.rank === undefined ? null : Number(awardForm.rank),
    baseScore: Number(awardForm.baseScore),
    coefficient: Number(awardForm.coefficient),
    topAward: awardForm.topAward,
    enabled: awardForm.enabled,
    sortOrder: awardForm.sortOrder ?? 0,
    remark: awardForm.remark?.trim() || undefined
  };
}

async function saveAwardRule() {
  if (!validateAwardForm()) {
    return;
  }

  awardSubmitting.value = true;

  try {
    const payload = buildAwardPayload();

    if (awardEditingItem.value) {
      await updateAwardRule(awardEditingItem.value.id, payload);
      ElMessage.success('球员奖项规则已更新。');
    } else {
      await createAwardRule(payload);
      ElMessage.success('球员奖项规则已创建。');
    }

    awardDialogVisible.value = false;
    await loadAwardRules();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存球员奖项规则失败。');
  } finally {
    awardSubmitting.value = false;
  }
}

async function toggleAwardRule(row: AwardRuleItem) {
  awardSubmitting.value = true;

  try {
    await updateAwardRule(row.id, {
      code: row.code,
      name: row.name,
      scopeType: row.scopeType ?? null,
      category: row.category ?? undefined,
      placement: row.placement ?? undefined,
      rank: row.rank ?? null,
      baseScore: row.baseScore,
      coefficient: row.coefficient,
      topAward: row.topAward,
      enabled: !row.enabled,
      sortOrder: row.sortOrder,
      remark: row.remark ?? undefined
    });
    ElMessage.success(row.enabled ? '规则已停用。' : '规则已启用。');
    await loadAwardRules();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '切换球员奖项规则失败。');
  } finally {
    awardSubmitting.value = false;
  }
}

async function recalculatePlayerAwardScores() {
  try {
    await ElMessageBox.confirm(
      '将根据当前启用的球员奖项规则重新计算球员荣誉分，并写回巨星统计字段。是否继续？',
      '重新计算球员荣誉分',
      {
        confirmButtonText: '开始重算',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
  } catch {
    return;
  }

  awardRecalculating.value = true;

  try {
    const result = await recalculateAwardScores();
    lastAwardRecalculateSummary.value = `已处理 ${result.playerCount} 名球员、${result.recipientCount} 条获奖记录，启用规则 ${result.enabledRuleCount} 条，计分球员 ${result.scoredPlayerCount} 名。`;
    ElMessage.success('球员荣誉分重算完成。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '球员荣誉分重算失败。');
  } finally {
    awardRecalculating.value = false;
  }
}

function formatAwardRuleScore(row: AwardRuleItem) {
  return Number(row.baseScore * row.coefficient).toFixed(2);
}

watch(
  () => [awardFilters.page, awardFilters.pageSize],
  () => {
    void loadAwardRules();
  }
);

onMounted(() => {
  void loadRules();
  void loadAwardRules();
});
</script>

<template>
  <section class="page-stack">
    <el-tabs v-model="activeTab" class="rule-tabs">
      <el-tab-pane label="赛事荣誉规则" name="competition">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2>荣誉规则</h2>
              <p>
                系统规则按对象、分类、级别、赛制和适用范围命中赛事；典型赛事只用于展示辅助理解。
              </p>
            </div>
            <div class="header-actions">
              <el-button type="warning" :loading="recalculating" @click="recalculateScores">
                <IconFont name="refresh" />
                重新计算荣誉分
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

        <HonorRuleListPanel
          title="国家队规则"
          description="国家队赛事按国际、洲际和其他分类匹配，世界杯、洲际杯等按规则范围决定是否计算殿军。"
          :items="countryRules"
          :loading="loading"
          :get-target-type-label="getTargetTypeLabel"
          @edit="openEditDialog"
        />

        <HonorRuleListPanel
          title="俱乐部规则"
          description="俱乐部赛事按国际、洲际、国内和其他分类匹配，国内联赛只计前三，杯赛和超级杯按冠亚处理。"
          :items="clubRules"
          :loading="loading"
          :get-target-type-label="getTargetTypeLabel"
          @edit="openEditDialog"
        />

        <p class="rule-count-hint">当前共 {{ total }} 条系统规则，页面不提供新增和删除。</p>
      </el-tab-pane>

      <el-tab-pane label="球员奖项规则" name="player-award">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2>球员奖项规则</h2>
              <p>按奖项范围、分类、名次文本或排名配置评分规则，手动触发后更新球员荣誉分。</p>
            </div>
            <div class="header-actions">
              <el-button
                type="warning"
                :loading="awardRecalculating"
                @click="recalculatePlayerAwardScores"
              >
                <IconFont name="refresh" />
                重新计算球员荣誉分
              </el-button>
              <el-button type="success" :disabled="awardLoading" @click="openCreateAwardDialog">
                <IconFont name="add" />
                新增奖项规则
              </el-button>
            </div>
          </div>

          <el-form
            class="filter-grid compact-filter award-rule-filter"
            label-position="top"
            @submit.prevent="submitAwardFilters"
          >
            <el-form-item label="关键词">
              <el-input
                v-model="awardFilters.keyword"
                clearable
                placeholder="编码 / 名称 / 分类 / 名次 / 备注"
                @keyup.enter="submitAwardFilters"
              />
            </el-form-item>
            <el-form-item label="奖项范围">
              <el-select v-model="awardFilters.scopeType" clearable placeholder="全部范围">
                <el-option
                  v-for="option in awardScopeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="awardFilters.enabled" clearable placeholder="全部状态">
                <el-option
                  v-for="option in enabledOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <div class="filter-actions">
              <el-button type="primary" :loading="awardLoading" @click="submitAwardFilters">
                <IconFont name="filter" />
                筛选
              </el-button>
              <el-button :disabled="awardLoading" @click="resetAwardFilters">
                <IconFont name="reset" />
                重置
              </el-button>
            </div>
          </el-form>

          <el-alert
            v-if="lastAwardRecalculateSummary"
            class="recalculate-alert"
            type="success"
            :title="lastAwardRecalculateSummary"
            show-icon
            :closable="false"
          />
        </div>

        <div v-if="awardErrorMessage" class="panel">
          <el-alert type="error" :title="awardErrorMessage" show-icon :closable="false" />
        </div>

        <AwardRuleListPanel
          :items="awardItems"
          :total="awardTotal"
          :loading="awardLoading"
          :has-rows="hasAwardRows"
          :page="awardFilters.page"
          :page-size="awardFilters.pageSize"
          :get-award-scope-label="getAwardScopeLabel"
          :format-award-rule-score="formatAwardRuleScore"
          @edit="openEditAwardDialog"
          @toggle="toggleAwardRule"
          @update:page="awardFilters.page = $event"
          @update:page-size="awardFilters.pageSize = $event"
        />
      </el-tab-pane>
    </el-tabs>

    <HonorRuleDialog
      v-model:visible="dialogVisible"
      :form="form"
      :rule="editingItem"
      :title="dialogTitle"
      :submitting="submitting"
      :get-target-type-label="getTargetTypeLabel"
      @save="saveRule"
    />

    <AwardRuleDialog
      v-model:visible="awardDialogVisible"
      :form="awardForm"
      :title="awardDialogTitle"
      :submitting="awardSubmitting"
      :award-scope-options="awardScopeOptions"
      @save="saveAwardRule"
    />
  </section>
</template>

<style scoped lang="scss">
.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.rule-tabs {
  min-width: 0;

  :deep(.el-tabs__content),
  :deep(.el-tab-pane) {
    min-width: 0;
  }
}

.honor-rule-filter {
  grid-template-columns: minmax(240px, 1fr) 220px auto;
}

.recalculate-alert {
  margin-top: 16px;
}

.rule-count-hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 1180px) {
  .honor-rule-filter {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 720px) {
  .honor-rule-filter {
    grid-template-columns: 1fr;
  }
}
</style>

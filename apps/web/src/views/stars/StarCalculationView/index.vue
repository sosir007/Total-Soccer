<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import {
  createPlayerPaAdjustmentBatch,
  fetchPlayerPaAdjustments,
  fetchPlayerPaEvaluations,
  updatePlayerPaEvaluation
} from '@/services/modules/catalog';
import type {
  PlayerPaAdjustmentColumn,
  PlayerPaAdjustmentPayloadItem,
  PlayerPaAdjustmentRow,
  PlayerPaEvaluationPayload,
  PlayerPaEvaluationRow
} from '@/services/types/catalog';
import AbilityBadge from '@/components/AbilityBadge.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import PositionTags from '@/components/PositionTags.vue';
import {
  ClubSelect,
  ConfederationSelect,
  CountrySelect,
  PositionSelect
} from '@/components/selects';
import { useAppStore } from '@/stores/app';
import { formatEntityName } from '@/utils/entity-name';

type ActiveTab = 'evaluation' | 'adjustment';
type SourceFieldKey =
  | 'reincarnationPa'
  | 'superDiamondPa'
  | 'websitePa'
  | 'doubaoPa'
  | 'dpPa'
  | 'yuanbaoPa'
  | 'qianwenPa'
  | 'geminiPa'
  | 'codexPa';

interface EvaluationForm {
  pa?: number;
  initialPa?: number;
  reincarnationPa: string;
  superDiamondPa: string;
  websitePa: string;
  doubaoPa: string;
  dpPa: string;
  yuanbaoPa: string;
  qianwenPa: string;
  geminiPa: string;
  codexPa: string;
  coreEvaluation: string;
  playerPositioning: string;
  teamContribution: string;
}

interface BatchDraftItem {
  playerId: string;
  chineseName: string;
  englishName?: string | null;
  currentPa?: number | null;
  pa?: number;
  remark: string;
}

const sourceFields: Array<{ key: SourceFieldKey; label: string }> = [
  { key: 'reincarnationPa', label: '转世' },
  { key: 'superDiamondPa', label: '超钻石' },
  { key: 'websitePa', label: '网站' },
  { key: 'doubaoPa', label: '豆包' },
  { key: 'dpPa', label: 'DP' },
  { key: 'yuanbaoPa', label: '元宝' },
  { key: 'qianwenPa', label: '千问' },
  { key: 'geminiPa', label: 'Gemini' },
  { key: 'codexPa', label: 'Codex' }
];

const activeTab = ref<ActiveTab>('evaluation');
const appStore = useAppStore();
const loading = ref(false);
const saving = ref(false);
const batchSaving = ref(false);
const errorMessage = ref('');
const evaluationRows = ref<PlayerPaEvaluationRow[]>([]);
const adjustmentRows = ref<PlayerPaAdjustmentRow[]>([]);
const adjustmentColumns = ref<PlayerPaAdjustmentColumn[]>([]);
const total = ref(0);
const editDialogVisible = ref(false);
const editingRow = ref<PlayerPaEvaluationRow | null>(null);
const batchDialogVisible = ref(false);
const filters = reactive({
  page: 1,
  pageSize: 100,
  keyword: '',
  confederationId: '',
  countryId: '',
  clubId: '',
  position: ''
});
const evaluationForm = reactive<EvaluationForm>({
  pa: undefined,
  initialPa: undefined,
  reincarnationPa: '',
  superDiamondPa: '',
  websitePa: '',
  doubaoPa: '',
  dpPa: '',
  yuanbaoPa: '',
  qianwenPa: '',
  geminiPa: '',
  codexPa: '',
  coreEvaluation: '',
  playerPositioning: '',
  teamContribution: ''
});
const batchForm = reactive({
  label: '',
  remark: '',
  items: [] as BatchDraftItem[]
});

const hasEvaluationRows = computed(() => evaluationRows.value.length > 0);
const hasAdjustmentRows = computed(() => adjustmentRows.value.length > 0);

async function loadCalculation() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const params = {
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      confederationId: filters.confederationId || undefined,
      countryId: filters.countryId || undefined,
      clubId: filters.clubId || undefined,
      position: filters.position || undefined
    };
    const [evaluationResult, adjustmentResult] = await Promise.all([
      fetchPlayerPaEvaluations(params),
      fetchPlayerPaAdjustments(params)
    ]);

    evaluationRows.value = evaluationResult.items;
    adjustmentRows.value = adjustmentResult.items;
    adjustmentColumns.value = adjustmentResult.columns;
    total.value = Math.max(evaluationResult.total, adjustmentResult.total);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '巨星演算数据加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadCalculation();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.confederationId = '';
  filters.countryId = '';
  filters.clubId = '';
  filters.position = '';
  void loadCalculation();
}

function rowIndex(index: number) {
  return (filters.page - 1) * filters.pageSize + index + 1;
}

function formatPaValue(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function formatEvaluationValue(row: PlayerPaEvaluationRow, key: SourceFieldKey) {
  return formatPaValue(row.evaluation?.[key]);
}

function formatLongText(value?: string | null) {
  return value?.trim() || '-';
}

function resetEvaluationForm(row: PlayerPaEvaluationRow) {
  const evaluation = row.evaluation;
  evaluationForm.pa = row.pa ?? undefined;
  evaluationForm.initialPa = evaluation?.initialPa ?? row.pa ?? undefined;

  for (const field of sourceFields) {
    evaluationForm[field.key] = evaluation?.[field.key] ?? '';
  }

  evaluationForm.coreEvaluation = evaluation?.coreEvaluation ?? '';
  evaluationForm.playerPositioning = evaluation?.playerPositioning ?? '';
  evaluationForm.teamContribution = evaluation?.teamContribution ?? '';
}

function openEditDialog(row: PlayerPaEvaluationRow) {
  editingRow.value = row;
  resetEvaluationForm(row);
  editDialogVisible.value = true;
}

async function saveEvaluation() {
  if (!editingRow.value) {
    return;
  }

  saving.value = true;

  try {
    const payload: PlayerPaEvaluationPayload = {
      pa: evaluationForm.pa ?? null,
      initialPa: evaluationForm.initialPa ?? null,
      reincarnationPa: evaluationForm.reincarnationPa,
      superDiamondPa: evaluationForm.superDiamondPa,
      websitePa: evaluationForm.websitePa,
      doubaoPa: evaluationForm.doubaoPa,
      dpPa: evaluationForm.dpPa,
      yuanbaoPa: evaluationForm.yuanbaoPa,
      qianwenPa: evaluationForm.qianwenPa,
      geminiPa: evaluationForm.geminiPa,
      codexPa: evaluationForm.codexPa,
      coreEvaluation: evaluationForm.coreEvaluation,
      playerPositioning: evaluationForm.playerPositioning,
      teamContribution: evaluationForm.teamContribution
    };

    await updatePlayerPaEvaluation(editingRow.value.id, payload);
    editDialogVisible.value = false;
    appStore.refreshPlayerList();
    ElMessage.success('PA评定已保存。');
    await loadCalculation();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'PA评定保存失败。');
  } finally {
    saving.value = false;
  }
}

function openBatchDialog() {
  batchForm.label = createTodayLabel();
  batchForm.remark = '';
  batchForm.items = evaluationRows.value.map((row) => ({
    playerId: row.id,
    chineseName: row.chineseName,
    englishName: row.englishName,
    currentPa: row.pa,
    pa: row.pa ?? undefined,
    remark: ''
  }));
  batchDialogVisible.value = true;
}

async function saveBatch() {
  const items: PlayerPaAdjustmentPayloadItem[] = batchForm.items
    .filter((item) => item.pa !== undefined && item.pa !== null)
    .map((item) => ({
      playerId: item.playerId,
      pa: item.pa,
      remark: item.remark
    }));

  if (!items.length) {
    ElMessage.warning('请至少保留一名球员的 PA。');
    return;
  }

  batchSaving.value = true;

  try {
    await createPlayerPaAdjustmentBatch({
      label: batchForm.label,
      remark: batchForm.remark,
      items
    });
    batchDialogVisible.value = false;
    appStore.refreshPlayerList();
    ElMessage.success('PA调整批次已创建。');
    await loadCalculation();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'PA调整批次创建失败。');
  } finally {
    batchSaving.value = false;
  }
}

function createTodayLabel() {
  return dayjs().format('YY.MM.DD');
}

function resolveAdjustmentValue(row: PlayerPaAdjustmentRow, column: PlayerPaAdjustmentColumn) {
  return column.kind === 'initial' ? row.initialPa : row.values[column.key];
}

function resolvePreviousAdjustmentValue(
  row: PlayerPaAdjustmentRow,
  columnIndex: number
): number | null {
  for (let index = columnIndex - 1; index >= 0; index -= 1) {
    const column = adjustmentColumns.value[index];

    if (!column) {
      continue;
    }

    const value = resolveAdjustmentValue(row, column);

    if (value !== null && value !== undefined) {
      return value;
    }
  }

  return null;
}

function getAdjustmentValueClass(row: PlayerPaAdjustmentRow, columnIndex: number) {
  const column = adjustmentColumns.value[columnIndex];

  if (!column) {
    return 'is-muted';
  }

  const value = resolveAdjustmentValue(row, column);

  if (column.kind === 'initial' || value === null || value === undefined) {
    return 'is-muted';
  }

  const previousValue = resolvePreviousAdjustmentValue(row, columnIndex);

  if (previousValue === null || previousValue === undefined || value === previousValue) {
    return 'is-muted';
  }

  return value > previousValue ? 'is-up' : 'is-down';
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadCalculation();
  }
);

onMounted(() => {
  void loadCalculation();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>巨星演算</h2>
          <p>统一维护球员 PA 来源、最终 PA 和阶段性宏观调整记录。</p>
        </div>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="球员 / UID / 国家 / 俱乐部"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="足联">
          <ConfederationSelect v-model="filters.confederationId" />
        </el-form-item>
        <el-form-item label="位置">
          <PositionSelect v-model="filters.position" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="filters.countryId" />
        </el-form-item>
        <el-form-item label="俱乐部">
          <ClubSelect v-model="filters.clubId" />
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

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>{{ activeTab === 'evaluation' ? 'PA评定' : 'PA调整' }}</h3>
        <div class="panel-actions">
          <span class="status-pill">{{ total }} 名球员</span>
          <el-button
            v-if="activeTab === 'adjustment'"
            type="primary"
            :disabled="loading || !hasEvaluationRows"
            @click="openBatchDialog"
          >
            <IconFont name="add" />
            新增调整批次
          </el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="calculation-tabs">
        <el-tab-pane label="PA评定" name="evaluation">
          <el-skeleton v-if="loading && !hasEvaluationRows" :rows="8" animated />
          <NoDataView v-else-if="!hasEvaluationRows" text="暂无球员 PA 评定数据。" />

          <el-table v-else :data="evaluationRows" border class="calculation-table">
            <el-table-column label="序号" width="60" fixed align="center">
              <template #default="{ $index }">
                {{ rowIndex($index) }}
              </template>
            </el-table-column>

            <el-table-column label="位置" width="80" fixed align="center">
              <template #default="{ row }">
                <PositionTags :value="row.primaryRole || row.positions" />
              </template>
            </el-table-column>

            <el-table-column prop="pa" label="PA" width="80" fixed align="center" sortable>
              <template #default="{ row }">
                <AbilityBadge type="PA" :value="row.pa" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="国家" width="150" fixed>
              <template #default="{ row }">
                <EntityNameCell
                  :id="row.country?.id"
                  type="country"
                  :title="formatEntityName(row.country)"
                  :subtitle="`UID ${row.country?.uid || '-'}`"
                />
              </template>
            </el-table-column>

            <el-table-column label="球员" width="180" fixed show-overflow-tooltip>
              <template #default="{ row }">
                <EntityNameCell
                  :id="row.id"
                  type="player"
                  :title="row.chineseName"
                  :subtitle="row.englishName || `UID ${row.uid}`"
                />
              </template>
            </el-table-column>

            <el-table-column
              v-for="field in sourceFields"
              :key="field.key"
              :label="field.label"
              width="90"
              align="center"
            >
              <template #default="{ row }">
                {{ formatEvaluationValue(row, field.key) }}
              </template>
            </el-table-column>

            <el-table-column label="核心定评" width="400" show-overflow-tooltip>
              <template #default="{ row }">
                {{ formatLongText(row.evaluation?.coreEvaluation) }}
              </template>
            </el-table-column>

            <el-table-column label="球员定位" width="400" show-overflow-tooltip>
              <template #default="{ row }">
                {{ formatLongText(row.evaluation?.playerPositioning) }}
              </template>
            </el-table-column>

            <el-table-column label="球队贡献" width="400" show-overflow-tooltip>
              <template #default="{ row }">
                {{ formatLongText(row.evaluation?.teamContribution) }}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="90" fixed="right" align="center">
              <template #default="{ row }">
                <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="PA调整" name="adjustment">
          <el-skeleton v-if="loading && !hasAdjustmentRows" :rows="8" animated />
          <NoDataView v-else-if="!hasAdjustmentRows" text="暂无 PA 调整记录。" />

          <el-table v-else :data="adjustmentRows" border class="calculation-table adjustment-table">
            <el-table-column label="序号" width="60" fixed align="center">
              <template #default="{ $index }">
                {{ rowIndex($index) }}
              </template>
            </el-table-column>

            <el-table-column label="位置" width="80" fixed align="center">
              <template #default="{ row }">
                <PositionTags :value="row.primaryRole || row.positions" />
              </template>
            </el-table-column>

            <el-table-column prop="currentPa" label="PA" width="80" fixed align="center" sortable>
              <template #default="{ row }">
                <AbilityBadge type="PA" :value="row.currentPa" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="国家" width="150" fixed>
              <template #default="{ row }">
                <EntityNameCell
                  :id="row.country?.id"
                  type="country"
                  :title="formatEntityName(row.country)"
                  :subtitle="`UID ${row.country?.uid || '-'}`"
                />
              </template>
            </el-table-column>

            <el-table-column label="球员" width="180" fixed show-overflow-tooltip>
              <template #default="{ row }">
                <EntityNameCell
                  :id="row.id"
                  type="player"
                  :title="row.chineseName"
                  :subtitle="row.englishName || `UID ${row.uid}`"
                />
              </template>
            </el-table-column>

            <el-table-column
              v-for="(column, columnIndex) in adjustmentColumns"
              :key="column.key"
              :label="column.label"
              width="90"
              align="center"
            >
              <template #default="{ row }">
                <span class="adjustment-value" :class="getAdjustmentValueClass(row, columnIndex)">
                  {{ formatPaValue(resolveAdjustmentValue(row, column)) }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <div class="pagination-row">
        <el-pagination
          v-model:current-page="filters.page"
          v-model:page-size="filters.pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[20, 50, 100]"
          :total="total"
        />
      </div>
    </div>

    <el-dialog v-model="editDialogVisible" title="维护 PA 评定" width="860px" destroy-on-close>
      <el-form label-position="top">
        <div class="calculation-form-grid">
          <el-form-item label="PA">
            <el-input-number v-model="evaluationForm.pa" :controls="false" :min="0" :max="250" />
          </el-form-item>
          <el-form-item label="初始PA">
            <el-input-number
              v-model="evaluationForm.initialPa"
              :controls="false"
              :min="0"
              :max="250"
            />
          </el-form-item>
          <el-form-item v-for="field in sourceFields" :key="field.key" :label="field.label">
            <el-input v-model="evaluationForm[field.key]" placeholder="支持 200 或 195-200" />
          </el-form-item>
        </div>
        <el-form-item label="核心定评">
          <el-input v-model="evaluationForm.coreEvaluation" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="球员定位">
          <el-input v-model="evaluationForm.playerPositioning" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="球队贡献">
          <el-input v-model="evaluationForm.teamContribution" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :disabled="saving" @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveEvaluation">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="batchDialogVisible" title="新增 PA 调整批次" width="860px" destroy-on-close>
      <el-form label-position="top">
        <div class="batch-form-grid">
          <el-form-item label="批次">
            <el-input v-model="batchForm.label" placeholder="例如 26.05.21" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="batchForm.remark" placeholder="例如 第三轮全库 PA 校准" />
          </el-form-item>
        </div>
      </el-form>

      <el-table :data="batchForm.items" border class="batch-table">
        <el-table-column label="球员" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <strong>{{ row.chineseName }}</strong>
            <span class="muted-text">{{ row.englishName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前PA" width="90" align="center">
          <template #default="{ row }">
            {{ formatPaValue(row.currentPa) }}
          </template>
        </el-table-column>
        <el-table-column label="调整后PA" width="120" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.pa" :controls="false" :min="0" :max="250" />
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="180">
          <template #default="{ row }">
            <el-input v-model="row.remark" placeholder="可选" />
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button :disabled="batchSaving" @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchSaving" @click="saveBatch">创建批次</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.calculation-tabs {
  --el-table-header-bg-color: #fbfcfb;
  --el-table-header-text-color: var(--text-color-regular);
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.calculation-table {
  width: 100%;
}

.calculation-table :deep(.el-table__header th.el-table__cell),
.batch-table :deep(.el-table__header th.el-table__cell) {
  background: #fbfcfb;
}

.calculation-table :deep(.el-table__header .cell),
.batch-table :deep(.el-table__header .cell) {
  color: var(--text-color-regular);
  font-weight: 850;
}

.adjustment-value {
  color: #8a9291;
  font-weight: 700;
}

.adjustment-value.is-up {
  color: #d92d20;
}

.adjustment-value.is-down {
  color: #52c41a;
}

.adjustment-value.is-muted {
  color: #8a9291;
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.calculation-form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.batch-form-grid {
  display: grid;
  grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
  gap: 12px;
}

.muted-text {
  display: block;
  margin-top: 2px;
  color: #999;
  font-size: 12px;
}

.batch-table :deep(.el-input-number) {
  width: 92px;
}

@media (max-width: 760px) {
  .calculation-form-grid,
  .batch-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

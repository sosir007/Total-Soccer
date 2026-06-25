<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createCompetitionEdition,
  deleteCompetitionEdition,
  fetchCompetitionDetail,
  saveCompetitionStandings,
  updateCompetition,
  updateCompetitionEdition
} from '@/services/modules/competitions';
import type {
  CompetitionCategory,
  CompetitionDetail,
  CompetitionEdition,
  CompetitionFormat,
  CompetitionLevel,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';
import { useOptionStore } from '@/stores/options';
import { useRouteTabsStore } from '@/stores/route-tabs';
import CompetitionDetailDialog from './components/CompetitionDetailDialog.vue';
import CompetitionEditionTable from './components/CompetitionEditionTable.vue';
import CompetitionHeroPanel from './components/CompetitionHeroPanel.vue';
import CompetitionInfoPanel from './components/CompetitionInfoPanel.vue';
import CompetitionResultDialog from './components/CompetitionResultDialog.vue';
import type { EditionRow, StandingForm } from './components/types';

defineOptions({
  name: 'CompetitionDetailView'
});

const targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }> = [
  { label: '国家队', value: 'COUNTRY' },
  { label: '俱乐部', value: 'CLUB' }
];
const scopeTypeOptions: Array<{ label: string; value: CompetitionScopeType }> = [
  { label: '全球', value: 'GLOBAL' },
  { label: '足联', value: 'CONFEDERATION' },
  { label: '国家', value: 'COUNTRY' },
  { label: '自定义', value: 'CUSTOM' }
];
const categoryOptions: Array<{ label: string; value: CompetitionCategory }> = [
  { label: '国际', value: '国际' },
  { label: '洲际', value: '洲际' },
  { label: '国内', value: '国内' },
  { label: '其他', value: '其他' }
];
const levelOptions: Array<{ label: string; value: CompetitionLevel }> = [
  { label: '一级', value: '一级' },
  { label: '二级', value: '二级' },
  { label: '三级', value: '三级' }
];
const formatOptions: Array<{ label: string; value: CompetitionFormat }> = [
  { label: '联赛', value: '联赛' },
  { label: '杯赛', value: '杯赛' },
  { label: '其他', value: '其他' }
];
const placements: Array<{ label: string; value: CompetitionStandingPlacement }> = [
  { label: '冠军', value: 'CHAMPION' },
  { label: '亚军', value: 'RUNNER_UP' },
  { label: '季军', value: 'THIRD_PLACE' },
  { label: '殿军', value: 'FOURTH_PLACE' }
];
const targetTypeLabels = Object.fromEntries(
  targetTypeOptions.map((targetType) => [targetType.value, targetType.label])
) as Record<CompetitionTargetType, string>;
const scopeTypeLabels = Object.fromEntries(
  scopeTypeOptions.map((scopeType) => [scopeType.value, scopeType.label])
) as Record<CompetitionScopeType, string>;

const route = useRoute();
const router = useRouter();
const optionStore = useOptionStore();
const routeTabsStore = useRouteTabsStore();
const loading = ref(false);
const savingDetail = ref(false);
const resultSaving = ref(false);
const detailDialogVisible = ref(false);
const resultDialogVisible = ref(false);
const resultDialogMode = ref<'batch' | 'single'>('batch');
const sortAscending = ref(true);
const errorMessage = ref('');
const competition = ref<CompetitionDetail | null>(null);
const editionRows = ref<EditionRow[]>([]);
const deletedEditionIds = ref<string[]>([]);
const competitionId = computed(() => String(route.params.id ?? ''));

const detailForm = reactive({
  code: '',
  name: '',
  externalUrl: '',
  targetType: 'COUNTRY' as CompetitionTargetType,
  scopeType: 'GLOBAL' as CompetitionScopeType,
  category: '',
  level: '',
  format: '其他' as '' | CompetitionFormat,
  description: '',
  confederationId: '',
  confederationIds: [] as string[],
  countryId: '',
  countryIds: [] as string[],
  enabled: true,
  includeInStats: true,
  sortOrder: 0
});

const sortedEditions = computed(() => sortEditions(competition.value?.editions ?? []));
const sortedEditionRows = computed(() => sortRows(editionRows.value));
const showDetailFormatField = computed(() => shouldUseCompetitionFormat(detailForm));
const resultDialogTitle = computed(() =>
  resultDialogMode.value === 'single' ? '编辑年份结果' : '批量编辑年份结果'
);

async function loadCompetition() {
  if (!competitionId.value) {
    competition.value = null;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const loadedCompetition = await fetchCompetitionDetail(competitionId.value);
    competition.value = loadedCompetition;
    routeTabsStore.setTitle(route.fullPath, loadedCompetition.name);
    populateDetailForm();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '赛事详情加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function backToList() {
  void router.push({
    name: 'tianji-competitions'
  });
}

function openDetailDialog() {
  populateDetailForm();
  detailDialogVisible.value = true;
}

async function saveCompetitionDetail() {
  if (!competition.value || !validateCompetitionForm()) {
    return;
  }

  savingDetail.value = true;

  try {
    await updateCompetition(competition.value.id, buildCompetitionPayload());
    ElMessage.success('赛事资料已保存。');
    optionStore.invalidate('competitions');
    detailDialogVisible.value = false;
    await loadCompetition();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事资料保存失败。');
  } finally {
    savingDetail.value = false;
  }
}

function openResultDialog() {
  if (!competition.value) {
    ElMessage.warning('请先选择赛事。');
    return;
  }

  resultDialogMode.value = 'batch';
  deletedEditionIds.value = [];
  editionRows.value = sortRows(
    competition.value.editions.map((edition) => mapEditionToRow(edition))
  );

  if (!editionRows.value.length) {
    editionRows.value = [createBlankEditionRow()];
  }

  resultDialogVisible.value = true;
}

function openEditEditionDialog(edition: CompetitionEdition) {
  resultDialogMode.value = 'single';
  deletedEditionIds.value = [];
  editionRows.value = [mapEditionToRow(edition)];
  resultDialogVisible.value = true;
}

function addEditionRow() {
  editionRows.value.push(createBlankEditionRow());
}

function removeEditionRow(row: EditionRow) {
  if (editionRows.value.length <= 1) {
    ElMessage.warning('至少保留一行年份结果。');
    return;
  }

  if (row.locked) {
    ElMessage.warning('该年份已有冠军/亚军/季军/殿军关联，不能直接删除。');
    return;
  }

  if (row.id) {
    deletedEditionIds.value.push(row.id);
  }

  editionRows.value = editionRows.value.filter((item) => item.clientId !== row.clientId);
}

async function confirmDeleteEdition(edition: CompetitionEdition) {
  if (edition.standings.length) {
    ElMessage.warning('该年份已有冠军/亚军/季军/殿军关联，不能直接删除。');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定删除「${formatEditionLabel(edition)}」这条年份结果吗？`,
      '删除年份结果',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }
    );
  } catch {
    return;
  }

  resultSaving.value = true;

  try {
    await deleteCompetitionEdition(edition.id);
    ElMessage.success('年份结果已删除。');
    await loadCompetition();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '年份结果删除失败。');
  } finally {
    resultSaving.value = false;
  }
}

async function saveResultRows() {
  if (!competition.value) {
    ElMessage.warning('请先选择赛事。');
    return;
  }

  if (!validateEditionRows()) {
    return;
  }

  resultSaving.value = true;

  try {
    if (resultDialogMode.value === 'batch') {
      for (const id of deletedEditionIds.value) {
        await deleteCompetitionEdition(id);
      }
    }

    for (const row of sortRows(editionRows.value)) {
      const payload = {
        name: buildEditionName(row),
        season: row.season.trim() || undefined,
        year: row.year ? Number(row.year) : undefined,
        quantity: row.quantity,
        host: row.host.trim() || undefined,
        remark: row.remark.trim() || undefined
      };
      const edition = row.id
        ? await updateCompetitionEdition(row.id, payload)
        : await createCompetitionEdition(competition.value.id, payload);

      await saveCompetitionStandings(edition.id, {
        standings: placements.map((placement) => ({
          placement: placement.value,
          countryId:
            competition.value?.targetType === 'COUNTRY'
              ? row.standings[placement.value].countryId || null
              : null,
          clubId:
            competition.value?.targetType === 'CLUB'
              ? row.standings[placement.value].clubId || null
              : null
        }))
      });
    }

    ElMessage.success('年份结果已保存。');
    resultDialogVisible.value = false;
    await loadCompetition();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '年份结果保存失败。');
  } finally {
    resultSaving.value = false;
  }
}

function populateDetailForm() {
  if (!competition.value) {
    return;
  }

  detailForm.code = competition.value.code;
  detailForm.name = competition.value.name;
  detailForm.externalUrl = competition.value.externalUrl ?? '';
  detailForm.targetType = competition.value.targetType;
  detailForm.scopeType = competition.value.scopeType;
  detailForm.category = competition.value.category ?? '';
  detailForm.level = competition.value.level ?? '';
  detailForm.format = (competition.value.format as CompetitionFormat | null) ?? '其他';
  detailForm.description = competition.value.description ?? '';
  detailForm.confederationId = competition.value.confederationId ?? '';
  detailForm.confederationIds = getCompetitionConfederationIds(competition.value);
  detailForm.countryId = competition.value.countryId ?? '';
  detailForm.countryIds = getCompetitionCountryIds(competition.value);
  detailForm.enabled = competition.value.enabled;
  detailForm.includeInStats = competition.value.includeInStats;
  detailForm.sortOrder = competition.value.sortOrder;
}

function validateCompetitionForm() {
  if (!detailForm.code.trim() || !detailForm.name.trim()) {
    ElMessage.warning('请填写赛事编码和赛事名称。');
    return false;
  }

  if (detailForm.scopeType === 'CONFEDERATION' && !detailForm.confederationIds.length) {
    ElMessage.warning('足联范围赛事需要至少选择一个足联。');
    return false;
  }

  if (detailForm.scopeType === 'COUNTRY' && !detailForm.countryIds.length) {
    ElMessage.warning('国家范围赛事需要至少选择一个国家。');
    return false;
  }

  return true;
}

function validateEditionRows() {
  for (const [index, row] of editionRows.value.entries()) {
    if (!row.year && !row.season.trim()) {
      ElMessage.warning(`第 ${index + 1} 行请填写年份或赛季。`);
      return false;
    }
  }

  return true;
}

function buildCompetitionPayload() {
  return {
    code: detailForm.code.trim(),
    name: detailForm.name.trim(),
    externalUrl: detailForm.externalUrl.trim() || undefined,
    targetType: detailForm.targetType,
    scopeType: detailForm.scopeType,
    category: detailForm.category.trim() || undefined,
    level: detailForm.level.trim() || undefined,
    format: shouldUseCompetitionFormat(detailForm) ? detailForm.format || '其他' : '其他',
    description: detailForm.description.trim() || undefined,
    confederationId:
      detailForm.scopeType === 'CONFEDERATION' ? detailForm.confederationIds[0] : undefined,
    confederationIds: detailForm.scopeType === 'CONFEDERATION' ? detailForm.confederationIds : [],
    countryId: detailForm.scopeType === 'COUNTRY' ? detailForm.countryIds[0] : undefined,
    countryIds: detailForm.scopeType === 'COUNTRY' ? detailForm.countryIds : [],
    enabled: detailForm.enabled,
    includeInStats: detailForm.includeInStats,
    sortOrder: detailForm.sortOrder
  };
}

function shouldUseCompetitionFormat(form: {
  scopeType: CompetitionScopeType;
  category?: string | null;
}) {
  return form.scopeType === 'COUNTRY' && form.category === '国内';
}

function createEmptyStandingForm(): StandingForm {
  return {
    CHAMPION: { countryId: '', clubId: '' },
    RUNNER_UP: { countryId: '', clubId: '' },
    THIRD_PLACE: { countryId: '', clubId: '' },
    FOURTH_PLACE: { countryId: '', clubId: '' }
  };
}

function createBlankEditionRow(): EditionRow {
  return {
    clientId: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    year: '',
    season: '',
    quantity: undefined,
    host: '',
    remark: '',
    standings: createEmptyStandingForm(),
    locked: false
  };
}

function mapEditionToRow(edition: CompetitionEdition): EditionRow {
  const standings = createEmptyStandingForm();

  for (const standing of edition.standings) {
    standings[standing.placement].countryId = standing.countryId ?? '';
    standings[standing.placement].clubId = standing.clubId ?? '';
  }

  return {
    clientId: edition.id,
    id: edition.id,
    year: edition.year ? String(edition.year) : '',
    season: edition.season ?? '',
    quantity: edition.quantity ?? undefined,
    host: edition.host ?? '',
    remark: edition.remark ?? '',
    standings,
    locked: edition.standings.length > 0
  };
}

function sortRows(rows: EditionRow[]) {
  return [...rows].sort((a, b) => compareYearLike(a.year, b.year));
}

function sortEditions(editions: CompetitionEdition[]) {
  return [...editions].sort((a, b) => compareYearLike(String(a.year ?? ''), String(b.year ?? '')));
}

function compareYearLike(a: string, b: string) {
  const left = Number(a);
  const right = Number(b);

  if (Number.isFinite(left) && Number.isFinite(right)) {
    return sortAscending.value ? left - right : right - left;
  }

  return sortAscending.value ? a.localeCompare(b) : b.localeCompare(a);
}

function buildEditionName(row: EditionRow) {
  return row.season.trim() || row.year || '未命名结果';
}

function formatScope(item: CompetitionDetail) {
  if (item.scopeType === 'CONFEDERATION') {
    const names = (item.scopeConfederations ?? [])
      .map((scope) => scope.confederation.name)
      .filter(Boolean);

    return names.length ? names.join('、') : (item.confederation?.name ?? '足联');
  }

  if (item.scopeType === 'COUNTRY') {
    const names = (item.scopeCountries ?? []).map((scope) => scope.country.name).filter(Boolean);

    return names.length ? names.join('、') : (item.country?.name ?? '国家');
  }

  return scopeTypeLabels[item.scopeType];
}

function getCompetitionConfederationIds(item: CompetitionDetail) {
  const ids = (item.scopeConfederations ?? [])
    .map((scope) => scope.confederation.id)
    .filter(Boolean);

  return ids.length ? ids : item.confederationId ? [item.confederationId] : [];
}

function getCompetitionCountryIds(item: CompetitionDetail) {
  const ids = (item.scopeCountries ?? []).map((scope) => scope.country.id).filter(Boolean);

  return ids.length ? ids : item.countryId ? [item.countryId] : [];
}

function getEditionStanding(edition: CompetitionEdition, placement: CompetitionStandingPlacement) {
  return edition.standings.find((item) => item.placement === placement);
}

function getStandingEntityType(
  edition: CompetitionEdition,
  placement: CompetitionStandingPlacement
) {
  const standing = getEditionStanding(edition, placement);

  if (standing?.country) {
    return 'country';
  }

  return 'club';
}

function getStandingEntityId(edition: CompetitionEdition, placement: CompetitionStandingPlacement) {
  const standing = getEditionStanding(edition, placement);

  if (standing?.country) {
    return standing.country.isHistorical
      ? (standing.country.detailRedirectCountryId ?? null)
      : standing.country.id;
  }

  return standing?.club?.id ?? null;
}

function getStandingEntityName(
  edition: CompetitionEdition,
  placement: CompetitionStandingPlacement
) {
  const standing = getEditionStanding(edition, placement);

  return standing?.country?.name ?? standing?.club?.name ?? '-';
}

function hasEditionStanding(edition: CompetitionEdition, placement: CompetitionStandingPlacement) {
  const standing = getEditionStanding(edition, placement);

  return Boolean(standing?.country || standing?.club);
}

function formatText(value?: string | number | boolean | null) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return typeof value === 'boolean' ? (value ? '启用' : '停用') : String(value);
}

function formatCompetitionFormat(item: CompetitionDetail) {
  return shouldUseCompetitionFormat(item) ? item.format || '-' : '-';
}

function getSummaryCountLabel() {
  return `${competition.value?.editions.length ?? 0} 年份/赛季`;
}

function formatEditionLabel(edition: CompetitionEdition) {
  if (edition.season) {
    return edition.season;
  }

  if (edition.year) {
    return `${edition.year}年`;
  }

  return edition.name || '-';
}

watch(
  () => detailForm.scopeType,
  () => {
    detailForm.confederationId = '';
    detailForm.confederationIds = [];
    detailForm.countryId = '';
    detailForm.countryIds = [];
  },
  { flush: 'sync' }
);

watch(
  () => [detailForm.scopeType, detailForm.category],
  () => {
    if (!shouldUseCompetitionFormat(detailForm)) {
      detailForm.format = '其他';
    }
  }
);

watch(
  () => competitionId.value,
  () => {
    void loadCompetition();
  }
);

onMounted(() => {
  void loadCompetition();
});
</script>

<template>
  <section class="page-stack">
    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div v-if="loading" class="panel">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="!competition" class="panel empty-panel">
      <h3>赛事不存在</h3>
      <p>可以返回赛事管理重新选择。</p>
      <el-button type="primary" @click="backToList">
        <IconFont name="back" />
        返回赛事列表
      </el-button>
    </div>

    <template v-else>
      <CompetitionHeroPanel
        :competition="competition"
        :target-type-labels="targetTypeLabels"
        :scope-type-labels="scopeTypeLabels"
        :format-scope="formatScope"
        :should-use-competition-format="shouldUseCompetitionFormat"
        :get-summary-count-label="getSummaryCountLabel"
        @back="backToList"
        @edit="openDetailDialog"
      />

      <CompetitionInfoPanel
        :competition="competition"
        :target-type-labels="targetTypeLabels"
        :format-scope="formatScope"
        :format-text="formatText"
        :format-competition-format="formatCompetitionFormat"
      />

      <CompetitionEditionTable
        v-model:sort-ascending="sortAscending"
        :editions="sortedEditions"
        :placements="placements"
        :result-saving="resultSaving"
        :format-edition-label="formatEditionLabel"
        :format-text="formatText"
        :has-edition-standing="hasEditionStanding"
        :get-standing-entity-id="getStandingEntityId"
        :get-standing-entity-type="getStandingEntityType"
        :get-standing-entity-name="getStandingEntityName"
        @batch-edit="openResultDialog"
        @edit="openEditEditionDialog"
        @delete="confirmDeleteEdition"
      />
    </template>

    <CompetitionDetailDialog
      v-model:visible="detailDialogVisible"
      :form="detailForm"
      :saving="savingDetail"
      :show-format-field="showDetailFormatField"
      :target-type-options="targetTypeOptions"
      :scope-type-options="scopeTypeOptions"
      :category-options="categoryOptions"
      :level-options="levelOptions"
      :format-options="formatOptions"
      @save="saveCompetitionDetail"
    />

    <CompetitionResultDialog
      v-model:visible="resultDialogVisible"
      v-model:sort-ascending="sortAscending"
      :title="resultDialogTitle"
      :mode="resultDialogMode"
      :rows="sortedEditionRows"
      :all-rows-count="editionRows.length"
      :competition="competition"
      :saving="resultSaving"
      @add="addEditionRow"
      @remove="removeEditionRow"
      @save="saveResultRows"
    />
  </section>
</template>

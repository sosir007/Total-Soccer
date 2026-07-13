<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createCompetition,
  deleteCompetition,
  fetchCompetitions,
  updateCompetition
} from '@/services/modules/competitions';
import { fetchHonorRules } from '@/services/modules/honor-rules';
import type {
  CompetitionCategory,
  CompetitionFormat,
  CompetitionLevel,
  CompetitionListItem,
  CompetitionScopeType,
  CompetitionTargetType
} from '@/services/types/competitions';
import type { HonorRuleItem } from '@/services/types/honor-rules';
import { useOptionStore } from '@/stores/options';
import CompetitionCreateDialog from './components/CompetitionCreateDialog.vue';
import CompetitionFilterPanel from './components/CompetitionFilterPanel.vue';
import CompetitionListTable from './components/CompetitionListTable.vue';

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
  { label: '三级', value: '三级' },
  { label: '四级', value: '四级' }
];
const formatOptions: Array<{ label: string; value: CompetitionFormat }> = [
  { label: '联赛', value: '联赛' },
  { label: '杯赛', value: '杯赛' },
  { label: '其他', value: '其他' }
];
const targetTypeLabels = Object.fromEntries(
  targetTypeOptions.map((targetType) => [targetType.value, targetType.label])
) as Record<CompetitionTargetType, string>;
const scopeTypeLabels = Object.fromEntries(
  scopeTypeOptions.map((scopeType) => [scopeType.value, scopeType.label])
) as Record<CompetitionScopeType, string>;

interface HonorRuleOption {
  value: string;
  label: string;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category: CompetitionCategory;
  level: CompetitionLevel;
  format: CompetitionFormat;
  sortOrder: number;
  description: string;
}

const router = useRouter();
const optionStore = useOptionStore();
const loading = ref(false);
const creating = ref(false);
const editingId = ref('');
const deletingId = ref('');
const createDialogVisible = ref(false);
const errorMessage = ref('');
const competitions = ref<CompetitionListItem[]>([]);
const honorRuleOptions = ref<HonorRuleOption[]>([]);
const total = ref(0);
const hasLoaded = ref(false);

const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  targetType: '' as '' | CompetitionTargetType,
  scopeType: '' as '' | CompetitionScopeType
});
const competitionForm = reactive({
  code: '',
  name: '',
  alias: '',
  honorRuleId: '',
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

const hasRows = computed(() => competitions.value.length > 0);
const showCreateFormatField = computed(
  () => Boolean(competitionForm.honorRuleId) || shouldUseCompetitionFormat(competitionForm)
);
const competitionDialogTitle = computed(() => (editingId.value ? '编辑赛事' : '创建赛事'));
const competitionDialogSubmitText = computed(() => (editingId.value ? '保存赛事' : '创建赛事'));

async function loadCompetitions() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchCompetitions({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      targetType: filters.targetType || undefined,
      scopeType: filters.scopeType || undefined
    });
    competitions.value = result.items;
    total.value = result.total;
    hasLoaded.value = true;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '赛事列表加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

async function loadHonorRuleOptions() {
  try {
    const result = await fetchHonorRules({
      page: 1,
      pageSize: 200,
      enabled: 'true'
    });
    honorRuleOptions.value = result.items
      .map((rule) => buildHonorRuleOption(rule))
      .filter((rule): rule is HonorRuleOption => Boolean(rule))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label, 'zh-CN'));
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '荣誉规则选项加载失败。');
  }
}

function buildHonorRuleOption(rule: HonorRuleItem): HonorRuleOption | null {
  const targetType = rule.targetType;
  const category = normalizeCompetitionCategory(rule.category);
  const level = normalizeCompetitionLevel(rule.level);
  const format = normalizeCompetitionFormat(rule.format);
  const scopeType = normalizeCompetitionScope(rule.scopeType, category);

  if (!category || !level || !format || !scopeType) {
    return null;
  }

  return {
    value: rule.id,
    label: rule.name,
    targetType,
    scopeType,
    category,
    level,
    format,
    sortOrder: rule.sortOrder,
    description: [
      targetTypeLabels[targetType],
      scopeTypeLabels[scopeType],
      category,
      level,
      format
    ].join(' / ')
  };
}

function submitFilters() {
  filters.page = 1;
  void loadCompetitions();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.targetType = '';
  filters.scopeType = '';
  void loadCompetitions();
}

function openCreateCompetitionDialog() {
  editingId.value = '';
  resetCompetitionForm();
  createDialogVisible.value = true;
}

async function openEditCompetitionDialog(row: CompetitionListItem) {
  if (!honorRuleOptions.value.length) {
    await loadHonorRuleOptions();
  }

  editingId.value = row.id;
  competitionForm.code = row.code;
  competitionForm.name = row.name;
  competitionForm.alias = row.alias ?? '';
  competitionForm.honorRuleId = resolveHonorRuleOptionId(row);
  competitionForm.externalUrl = row.externalUrl ?? '';
  competitionForm.targetType = row.targetType;
  competitionForm.scopeType = row.scopeType;
  competitionForm.category = row.category ?? '';
  competitionForm.level = row.level ?? '';
  competitionForm.format = (row.format as '' | CompetitionFormat) ?? '其他';
  competitionForm.description = row.description ?? '';
  competitionForm.confederationId = row.confederationId ?? '';
  competitionForm.confederationIds = (row.scopeConfederations ?? []).map(
    (scope) => scope.confederation.id
  );
  competitionForm.countryId = row.countryId ?? '';
  competitionForm.countryIds = (row.scopeCountries ?? []).map((scope) => scope.country.id);
  competitionForm.enabled = row.enabled;
  competitionForm.includeInStats = row.includeInStats;
  competitionForm.sortOrder = row.sortOrder;
  createDialogVisible.value = true;
}

async function submitCompetition() {
  if (!validateCompetitionForm()) {
    return;
  }

  creating.value = true;

  try {
    const payload = buildCompetitionPayload();

    if (editingId.value) {
      await updateCompetition(editingId.value, payload);
      ElMessage.success('赛事已更新。');
    } else {
      const created = await createCompetition(payload);
      ElMessage.success('赛事创建成功。');
      openCompetitionDetail(created.id);
    }

    createDialogVisible.value = false;
    resetCompetitionForm();
    editingId.value = '';
    optionStore.invalidate('competitions');
    await loadCompetitions();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存赛事失败。');
  } finally {
    creating.value = false;
  }
}

function openCompetitionDetail(id: string) {
  void router.push({
    name: 'tianji-competition-detail-id',
    params: { id }
  });
}

async function confirmDeleteCompetition(row: CompetitionListItem) {
  try {
    await ElMessageBox.confirm(
      `确定删除赛事「${row.name}」吗？已有届次结果的赛事会被后端阻止删除。`,
      '删除赛事',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }
    );
  } catch {
    return;
  }

  deletingId.value = row.id;

  try {
    await deleteCompetition(row.id);
    ElMessage.success('赛事已删除。');
    optionStore.invalidate('competitions');

    if (competitions.value.length === 1 && filters.page > 1) {
      filters.page -= 1;
    }

    await loadCompetitions();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事删除失败。');
  } finally {
    deletingId.value = '';
  }
}

function validateCompetitionForm() {
  if (!competitionForm.code.trim() || !competitionForm.name.trim()) {
    ElMessage.warning('请填写赛事编码和赛事名称。');
    return false;
  }

  if (competitionForm.scopeType === 'CONFEDERATION' && !competitionForm.confederationIds.length) {
    ElMessage.warning('足联范围赛事需要至少选择一个足联。');
    return false;
  }

  if (competitionForm.scopeType === 'COUNTRY' && !competitionForm.countryIds.length) {
    ElMessage.warning('国家范围赛事需要至少选择一个国家。');
    return false;
  }

  return true;
}

function buildCompetitionPayload() {
  return {
    code: competitionForm.code.trim(),
    name: competitionForm.name.trim(),
    alias: competitionForm.alias.trim() || undefined,
    externalUrl: competitionForm.externalUrl.trim() || undefined,
    targetType: competitionForm.targetType,
    scopeType: competitionForm.scopeType,
    category: competitionForm.category.trim() || undefined,
    level: competitionForm.level.trim() || undefined,
    format: showCreateFormatField.value ? competitionForm.format || '其他' : '其他',
    description: competitionForm.description.trim() || undefined,
    confederationId:
      competitionForm.scopeType === 'CONFEDERATION'
        ? competitionForm.confederationIds[0]
        : undefined,
    confederationIds:
      competitionForm.scopeType === 'CONFEDERATION' ? competitionForm.confederationIds : [],
    countryId: competitionForm.scopeType === 'COUNTRY' ? competitionForm.countryIds[0] : undefined,
    countryIds: competitionForm.scopeType === 'COUNTRY' ? competitionForm.countryIds : [],
    enabled: competitionForm.enabled,
    includeInStats: competitionForm.includeInStats,
    sortOrder: competitionForm.sortOrder
  };
}

function shouldUseCompetitionFormat(form: {
  scopeType: CompetitionScopeType;
  category?: string | null;
}) {
  return form.scopeType === 'COUNTRY' && form.category === '国内';
}

function resetCompetitionForm() {
  competitionForm.code = '';
  competitionForm.name = '';
  competitionForm.alias = '';
  competitionForm.honorRuleId = '';
  competitionForm.externalUrl = '';
  competitionForm.targetType = 'COUNTRY';
  competitionForm.scopeType = 'GLOBAL';
  competitionForm.category = '';
  competitionForm.level = '';
  competitionForm.format = '其他';
  competitionForm.description = '';
  competitionForm.confederationId = '';
  competitionForm.confederationIds = [];
  competitionForm.countryId = '';
  competitionForm.countryIds = [];
  competitionForm.enabled = true;
  competitionForm.includeInStats = true;
  competitionForm.sortOrder = 0;
}

function normalizeCompetitionCategory(value?: string | null): CompetitionCategory | null {
  return categoryOptions.some((option) => option.value === value)
    ? (value as CompetitionCategory)
    : null;
}

function normalizeCompetitionLevel(value?: string | null): CompetitionLevel | null {
  return levelOptions.some((option) => option.value === value) ? (value as CompetitionLevel) : null;
}

function normalizeCompetitionFormat(value?: string | null): CompetitionFormat | null {
  return formatOptions.some((option) => option.value === value)
    ? (value as CompetitionFormat)
    : null;
}

function normalizeCompetitionScope(
  value: CompetitionScopeType | null | undefined,
  category: CompetitionCategory | null
): CompetitionScopeType | null {
  if (scopeTypeOptions.some((option) => option.value === value)) {
    return value as CompetitionScopeType;
  }

  if (category === '国际') return 'GLOBAL';
  if (category === '洲际') return 'CONFEDERATION';
  if (category === '国内') return 'COUNTRY';
  if (category === '其他') return 'CUSTOM';
  return null;
}

function resolveHonorRuleOptionId(row: CompetitionListItem) {
  const matchedRules = honorRuleOptions.value.filter(
    (rule) =>
      rule.targetType === row.targetType &&
      rule.scopeType === row.scopeType &&
      rule.category === row.category &&
      rule.level === row.level
  );

  return (
    matchedRules.find((rule) => rule.format === row.format)?.value ?? matchedRules[0]?.value ?? ''
  );
}

function applyHonorRuleOption(ruleId: string) {
  const rule = honorRuleOptions.value.find((item) => item.value === ruleId);

  if (!rule) {
    return;
  }

  competitionForm.targetType = rule.targetType;
  competitionForm.scopeType = rule.scopeType;
  competitionForm.category = rule.category;
  competitionForm.level = rule.level;
  competitionForm.format = rule.format;

  if (rule.scopeType !== 'CONFEDERATION') {
    competitionForm.confederationId = '';
    competitionForm.confederationIds = [];
  }

  if (rule.scopeType !== 'COUNTRY') {
    competitionForm.countryId = '';
    competitionForm.countryIds = [];
  }

  updateSuggestedCompetitionSort();
}

function updateSuggestedCompetitionSort() {
  if (editingId.value || !competitionForm.honorRuleId) {
    return;
  }

  const rule = honorRuleOptions.value.find((item) => item.value === competitionForm.honorRuleId);

  if (!rule) {
    return;
  }

  competitionForm.sortOrder = suggestCompetitionSort(rule);
}

function suggestCompetitionSort(rule: HonorRuleOption) {
  if (rule.scopeType === 'CONFEDERATION') {
    const confederationBase = getSelectedConfederationSortBase();
    return confederationBase + getRuleLevelOffset(rule);
  }

  if (rule.scopeType === 'COUNTRY') {
    const countryBase = getSelectedCountrySortBase();
    return countryBase + getDomesticRuleOffset(rule);
  }

  if (rule.scopeType === 'GLOBAL') {
    return getRuleLevelOffset(rule);
  }

  return rule.targetType === 'COUNTRY'
    ? 70 + getRuleLevelOffset(rule)
    : 100 + getRuleLevelOffset(rule);
}

function getSelectedConfederationSortBase() {
  const values = competitionForm.confederationIds
    .map((id) => optionStore.confederations.find((item) => item.id === id))
    .map((item) => toNumericSortValue(item?.uid) ?? item?.sortOrder)
    .filter((value): value is number => Number.isFinite(value));

  return values.length ? Math.min(...values) * 10 : 100;
}

function getSelectedCountrySortBase() {
  const values = competitionForm.countryIds
    .map((id) => optionStore.countries.find((item) => item.id === id))
    .map((item) => toNumericSortValue(item?.uid))
    .filter((value): value is number => Number.isFinite(value));

  return values.length ? Math.min(...values) * 10 : 100;
}

function toNumericSortValue(value?: string | number | null) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function getRuleLevelOffset(rule: Pick<HonorRuleOption, 'level'>) {
  return Math.max(
    0,
    levelOptions.findIndex((option) => option.value === rule.level)
  );
}

function getDomesticRuleOffset(rule: HonorRuleOption) {
  const levelOffset = getRuleLevelOffset(rule) * 10;

  if (rule.format === '联赛') {
    return levelOffset;
  }

  if (rule.format === '杯赛') {
    return levelOffset + 1;
  }

  return levelOffset + 9;
}

function formatScope(competition: CompetitionListItem) {
  if (competition.scopeType === 'CONFEDERATION') {
    const names = (competition.scopeConfederations ?? [])
      .map((scope) => scope.confederation.name)
      .filter(Boolean);

    return names.length ? names.join('、') : (competition.confederation?.name ?? '足联');
  }

  if (competition.scopeType === 'COUNTRY') {
    const names = (competition.scopeCountries ?? [])
      .map((scope) => scope.country.name)
      .filter(Boolean);

    return names.length ? names.join('、') : (competition.country?.name ?? '国家');
  }

  return scopeTypeLabels[competition.scopeType];
}

function formatTargetType(competition: CompetitionListItem) {
  return targetTypeLabels[competition.targetType];
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatFormat(competition: CompetitionListItem) {
  return shouldUseCompetitionFormat(competition) ? competition.format || '-' : '-';
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadCompetitions();
  }
);

watch(
  () => competitionForm.scopeType,
  () => {
    competitionForm.confederationId = '';
    competitionForm.confederationIds = [];
    competitionForm.countryId = '';
    competitionForm.countryIds = [];
  },
  { flush: 'sync' }
);

watch(
  () => [competitionForm.scopeType, competitionForm.category],
  () => {
    if (!showCreateFormatField.value) {
      competitionForm.format = '其他';
    }
  }
);

watch(
  () => competitionForm.honorRuleId,
  (ruleId) => {
    if (ruleId) {
      applyHonorRuleOption(ruleId);
    }
  }
);

watch(
  () => [competitionForm.confederationIds.join(','), competitionForm.countryIds.join(',')],
  () => {
    updateSuggestedCompetitionSort();
  }
);

watch(
  () => createDialogVisible.value,
  (visible) => {
    if (!visible) {
      editingId.value = '';
      resetCompetitionForm();
    }
  }
);

onMounted(() => {
  void loadCompetitions();
  void loadHonorRuleOptions();
  void optionStore.ensureConfederations();
  void optionStore.ensureCountries();
});

onActivated(() => {
  if (hasLoaded.value) {
    void loadCompetitions();
  }
});
</script>

<template>
  <section class="page-stack">
    <CompetitionFilterPanel
      :filters="filters"
      :loading="loading"
      :target-type-options="targetTypeOptions"
      :scope-type-options="scopeTypeOptions"
      @submit="submitFilters"
      @reset="resetFilters"
    />

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <CompetitionListTable
      :competitions="competitions"
      :total="total"
      :loading="loading"
      :has-rows="hasRows"
      :has-loaded="hasLoaded"
      :deleting-id="deletingId"
      :page="filters.page"
      :page-size="filters.pageSize"
      :format-target-type="formatTargetType"
      :format-scope="formatScope"
      :format-text="formatText"
      :format-format="formatFormat"
      @create="openCreateCompetitionDialog"
      @edit="openEditCompetitionDialog"
      @open="openCompetitionDetail"
      @delete="confirmDeleteCompetition"
      @update:page="filters.page = $event"
      @update:page-size="filters.pageSize = $event"
    />

    <CompetitionCreateDialog
      v-model:visible="createDialogVisible"
      :title="competitionDialogTitle"
      :submit-text="competitionDialogSubmitText"
      :form="competitionForm"
      :submitting="creating"
      :show-format-field="showCreateFormatField"
      :target-type-options="targetTypeOptions"
      :scope-type-options="scopeTypeOptions"
      :category-options="categoryOptions"
      :level-options="levelOptions"
      :format-options="formatOptions"
      :honor-rule-options="honorRuleOptions"
      @submit="submitCompetition"
    />
  </section>
</template>

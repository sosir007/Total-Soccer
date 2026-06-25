<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createCompetition,
  deleteCompetition,
  fetchCompetitions,
  type CompetitionCategory,
  type CompetitionFormat,
  type CompetitionLevel,
  type CompetitionListItem,
  type CompetitionScopeType,
  type CompetitionTargetType
} from '@/services/competitions';
import { useOptionStore } from '@/stores/options';
import { buildExternalUrl } from '@/utils/external-link';
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
  { label: '三级', value: '三级' }
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

const router = useRouter();
const optionStore = useOptionStore();
const loading = ref(false);
const creating = ref(false);
const deletingId = ref('');
const createDialogVisible = ref(false);
const errorMessage = ref('');
const competitions = ref<CompetitionListItem[]>([]);
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
const showCreateFormatField = computed(() => shouldUseCompetitionFormat(competitionForm));

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
  resetCompetitionForm();
  createDialogVisible.value = true;
}

async function submitCompetition() {
  if (!validateCompetitionForm()) {
    return;
  }

  creating.value = true;

  try {
    const created = await createCompetition(buildCompetitionPayload());
    ElMessage.success('赛事创建成功。');
    createDialogVisible.value = false;
    resetCompetitionForm();
    optionStore.invalidate('competitions');
    await loadCompetitions();
    openCompetitionDetail(created.id);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事创建失败。');
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
    externalUrl: competitionForm.externalUrl.trim() || undefined,
    targetType: competitionForm.targetType,
    scopeType: competitionForm.scopeType,
    category: competitionForm.category.trim() || undefined,
    level: competitionForm.level.trim() || undefined,
    format: shouldUseCompetitionFormat(competitionForm) ? competitionForm.format || '其他' : '其他',
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

function competitionExternalUrl(competition: CompetitionListItem) {
  return buildExternalUrl(competition.externalUrl, competition.name);
}

function getCategoryTagClass(value?: string | null) {
  return [
    'competition-meta-tag',
    'competition-category-tag',
    `competition-category-${value || 'empty'}`
  ];
}

function getLevelTagClass(value?: string | null) {
  return ['competition-meta-tag', 'competition-level-tag', `competition-level-${value || 'empty'}`];
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
    if (!shouldUseCompetitionFormat(competitionForm)) {
      competitionForm.format = '其他';
    }
  }
);

onMounted(() => {
  void loadCompetitions();
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
      :competition-external-url="competitionExternalUrl"
      :get-category-tag-class="getCategoryTagClass"
      :get-level-tag-class="getLevelTagClass"
      @create="openCreateCompetitionDialog"
      @open="openCompetitionDetail"
      @delete="confirmDeleteCompetition"
      @update:page="filters.page = $event"
      @update:page-size="filters.pageSize = $event"
    />

    <CompetitionCreateDialog
      v-model:visible="createDialogVisible"
      :form="competitionForm"
      :creating="creating"
      :show-format-field="showCreateFormatField"
      :target-type-options="targetTypeOptions"
      :scope-type-options="scopeTypeOptions"
      :category-options="categoryOptions"
      :level-options="levelOptions"
      :format-options="formatOptions"
      @submit="submitCompetition"
    />
  </section>
</template>

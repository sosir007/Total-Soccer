<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import {
  createCompetition,
  createCompetitionEdition,
  fetchCompetitionDetail,
  fetchCompetitions,
  saveCompetitionStandings,
  updateCompetition,
  updateCompetitionEdition,
  type CompetitionCategory,
  type CompetitionDetail,
  type CompetitionEdition,
  type CompetitionFormat,
  type CompetitionLevel,
  type CompetitionListItem,
  type CompetitionScopeType,
  type CompetitionStandingPlacement,
  type CompetitionTargetType
} from '@/services/competitions';
import { ClubSelect, ConfederationSelect, CountrySelect } from '@/components/selects';
import { useOptionStore } from '@/stores/options';
import { buildExternalUrl } from '@/utils/external-link';

type StandingForm = Record<CompetitionStandingPlacement, { countryId: string; clubId: string }>;

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

const optionStore = useOptionStore();
const loading = ref(false);
const creating = ref(false);
const detailLoading = ref(false);
const savingDetail = ref(false);
const resultSaving = ref(false);
const resultDialogVisible = ref(false);
const errorMessage = ref('');
const competitions = ref<CompetitionListItem[]>([]);
const selectedCompetition = ref<CompetitionDetail | null>(null);
const editingEdition = ref<CompetitionEdition | null>(null);
const total = ref(0);

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
  sortOrder: 0
});
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
  sortOrder: 0
});
const resultForm = reactive({
  name: '',
  season: '',
  year: undefined as number | undefined,
  host: '',
  remark: '',
  standings: createEmptyStandingForm()
});

const hasRows = computed(() => competitions.value.length > 0);
const resultDialogTitle = computed(() => (editingEdition.value ? '编辑年份结果' : '新增年份结果'));
const sortedEditions = computed(() => selectedCompetition.value?.editions ?? []);

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

    if (!selectedCompetition.value && result.items[0]) {
      await openCompetition(result.items[0]);
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '赛事列表加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

async function openCompetition(competition: CompetitionListItem) {
  detailLoading.value = true;

  try {
    selectedCompetition.value = await fetchCompetitionDetail(competition.id);
    populateDetailForm();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事详情加载失败。');
  } finally {
    detailLoading.value = false;
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

async function submitCompetition() {
  if (!validateCompetitionForm(competitionForm)) {
    return;
  }

  creating.value = true;

  try {
    const created = await createCompetition(buildCompetitionPayload(competitionForm));
    ElMessage.success('赛事创建成功。');
    resetCompetitionForm();
    optionStore.invalidate('competitions');
    await loadCompetitions();
    await openCompetition(created);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事创建失败。');
  } finally {
    creating.value = false;
  }
}

async function saveCompetitionDetail() {
  if (!selectedCompetition.value || !validateCompetitionForm(detailForm)) {
    return;
  }

  savingDetail.value = true;

  try {
    await updateCompetition(selectedCompetition.value.id, buildCompetitionPayload(detailForm));
    ElMessage.success('赛事资料已保存。');
    optionStore.invalidate('competitions');
    await loadCompetitions();
    await refreshSelectedCompetition();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事资料保存失败。');
  } finally {
    savingDetail.value = false;
  }
}

function openCreateResultDialog() {
  if (!selectedCompetition.value) {
    ElMessage.warning('请先选择赛事。');
    return;
  }

  editingEdition.value = null;
  resetResultForm();
  resultDialogVisible.value = true;
}

function openEditResultDialog(edition: CompetitionEdition) {
  editingEdition.value = edition;
  resultForm.name = edition.name;
  resultForm.season = edition.season ?? '';
  resultForm.year = edition.year ?? undefined;
  resultForm.host = edition.host ?? '';
  resultForm.remark = edition.remark ?? '';
  resultForm.standings = createEmptyStandingForm();

  for (const standing of edition.standings) {
    resultForm.standings[standing.placement].countryId = standing.countryId ?? '';
    resultForm.standings[standing.placement].clubId = standing.clubId ?? '';
  }

  resultDialogVisible.value = true;
}

async function saveResult() {
  if (!selectedCompetition.value) {
    ElMessage.warning('请先选择赛事。');
    return;
  }

  if (!resultForm.name.trim()) {
    ElMessage.warning('请填写年份结果名称。');
    return;
  }

  resultSaving.value = true;

  try {
    const payload = {
      name: resultForm.name.trim(),
      season: resultForm.season.trim() || undefined,
      year: resultForm.year,
      host: resultForm.host.trim() || undefined,
      remark: resultForm.remark.trim() || undefined
    };
    const edition = editingEdition.value
      ? await updateCompetitionEdition(editingEdition.value.id, payload)
      : await createCompetitionEdition(selectedCompetition.value.id, payload);

    await saveCompetitionStandings(edition.id, {
      standings: placements.map((placement) => ({
        placement: placement.value,
        countryId:
          selectedCompetition.value?.targetType === 'COUNTRY'
            ? resultForm.standings[placement.value].countryId || null
            : null,
        clubId:
          selectedCompetition.value?.targetType === 'CLUB'
            ? resultForm.standings[placement.value].clubId || null
            : null
      }))
    });

    ElMessage.success(editingEdition.value ? '年份结果已更新。' : '年份结果已创建。');
    resultDialogVisible.value = false;
    await refreshSelectedCompetition();
    await loadCompetitions();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '年份结果保存失败。');
  } finally {
    resultSaving.value = false;
  }
}

async function refreshSelectedCompetition() {
  if (!selectedCompetition.value) {
    return;
  }

  selectedCompetition.value = await fetchCompetitionDetail(selectedCompetition.value.id);
  populateDetailForm();
}

function populateDetailForm() {
  if (!selectedCompetition.value) {
    return;
  }

  detailForm.code = selectedCompetition.value.code;
  detailForm.name = selectedCompetition.value.name;
  detailForm.externalUrl = selectedCompetition.value.externalUrl ?? '';
  detailForm.targetType = selectedCompetition.value.targetType;
  detailForm.scopeType = selectedCompetition.value.scopeType;
  detailForm.category = selectedCompetition.value.category ?? '';
  detailForm.level = selectedCompetition.value.level ?? '';
  detailForm.format = (selectedCompetition.value.format as CompetitionFormat | null) ?? '其他';
  detailForm.description = selectedCompetition.value.description ?? '';
  detailForm.confederationId = selectedCompetition.value.confederationId ?? '';
  detailForm.confederationIds = getCompetitionConfederationIds(selectedCompetition.value);
  detailForm.countryId = selectedCompetition.value.countryId ?? '';
  detailForm.countryIds = getCompetitionCountryIds(selectedCompetition.value);
  detailForm.enabled = selectedCompetition.value.enabled;
  detailForm.sortOrder = selectedCompetition.value.sortOrder;
}

function validateCompetitionForm(form: typeof competitionForm) {
  if (!form.code.trim() || !form.name.trim()) {
    ElMessage.warning('请填写赛事编码和赛事名称。');
    return false;
  }

  if (form.scopeType === 'CONFEDERATION' && !form.confederationIds.length) {
    ElMessage.warning('足联范围赛事需要至少选择一个足联。');
    return false;
  }

  if (form.scopeType === 'COUNTRY' && !form.countryIds.length) {
    ElMessage.warning('国家范围赛事需要至少选择一个国家。');
    return false;
  }

  return true;
}

function buildCompetitionPayload(form: typeof competitionForm) {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    externalUrl: form.externalUrl.trim() || undefined,
    targetType: form.targetType,
    scopeType: form.scopeType,
    category: form.category.trim() || undefined,
    level: form.level.trim() || undefined,
    format: form.format || undefined,
    description: form.description.trim() || undefined,
    confederationId: form.scopeType === 'CONFEDERATION' ? form.confederationIds[0] : undefined,
    confederationIds: form.scopeType === 'CONFEDERATION' ? form.confederationIds : [],
    countryId: form.scopeType === 'COUNTRY' ? form.countryIds[0] : undefined,
    countryIds: form.scopeType === 'COUNTRY' ? form.countryIds : [],
    enabled: form.enabled,
    sortOrder: form.sortOrder
  };
}

function resetCompetitionForm() {
  competitionForm.code = '';
  competitionForm.name = '';
  competitionForm.externalUrl = '';
  competitionForm.category = '';
  competitionForm.level = '';
  competitionForm.format = '其他';
  competitionForm.description = '';
  competitionForm.confederationId = '';
  competitionForm.confederationIds = [];
  competitionForm.countryId = '';
  competitionForm.countryIds = [];
  competitionForm.enabled = true;
  competitionForm.sortOrder = 0;
}

function resetResultForm() {
  resultForm.name = '';
  resultForm.season = '';
  resultForm.year = undefined;
  resultForm.host = '';
  resultForm.remark = '';
  resultForm.standings = createEmptyStandingForm();
}

function createEmptyStandingForm(): StandingForm {
  return {
    CHAMPION: { countryId: '', clubId: '' },
    RUNNER_UP: { countryId: '', clubId: '' },
    THIRD_PLACE: { countryId: '', clubId: '' },
    FOURTH_PLACE: { countryId: '', clubId: '' }
  };
}

function formatScope(competition: CompetitionListItem | CompetitionDetail) {
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

function getCompetitionConfederationIds(competition: CompetitionListItem | CompetitionDetail) {
  const ids = (competition.scopeConfederations ?? [])
    .map((scope) => scope.confederation.id)
    .filter(Boolean);

  return ids.length ? ids : competition.confederationId ? [competition.confederationId] : [];
}

function getCompetitionCountryIds(competition: CompetitionListItem | CompetitionDetail) {
  const ids = (competition.scopeCountries ?? []).map((scope) => scope.country.id).filter(Boolean);

  return ids.length ? ids : competition.countryId ? [competition.countryId] : [];
}

function formatTargetType(competition: CompetitionListItem | CompetitionDetail) {
  return targetTypeLabels[competition.targetType];
}

function formatEditionStanding(
  edition: CompetitionEdition,
  placement: CompetitionStandingPlacement
) {
  const standing = edition.standings.find((item) => item.placement === placement);

  return standing?.country?.name ?? standing?.club?.name ?? '-';
}

function competitionExternalUrl() {
  return buildExternalUrl(
    selectedCompetition.value?.externalUrl,
    selectedCompetition.value?.name || '赛事'
  );
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
  () => detailForm.scopeType,
  () => {
    detailForm.confederationId = '';
    detailForm.confederationIds = [];
    detailForm.countryId = '';
    detailForm.countryIds = [];
  },
  { flush: 'sync' }
);

onMounted(() => {
  void loadCompetitions();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>赛事管理</h2>
          <p>按一个赛事维护全部年份结果，例如世界杯下面统一管理历届冠亚季殿军。</p>
        </div>
        <span class="status-pill">Competition Hub</span>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="赛事名称 / 编码 / 分类 / 描述"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="对象">
          <el-select v-model="filters.targetType" clearable placeholder="全部对象">
            <el-option
              v-for="targetType in targetTypeOptions"
              :key="targetType.value"
              :label="targetType.label"
              :value="targetType.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="范围">
          <el-select v-model="filters.scopeType" clearable placeholder="全部范围">
            <el-option
              v-for="scopeType in scopeTypeOptions"
              :key="scopeType.value"
              :label="scopeType.label"
              :value="scopeType.value"
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

    <div class="competition-layout">
      <div class="page-stack">
        <div class="panel">
          <div class="panel-header">
            <h3>赛事列表</h3>
            <span class="status-pill">{{ total }} 项赛事</span>
          </div>

          <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

          <div v-else-if="!hasRows" class="empty-panel">
            <h3>暂无赛事数据</h3>
            <p>可以先创建世界杯、欧洲杯、英超、欧冠等赛事。</p>
          </div>

          <template v-else>
            <el-table
              :data="competitions"
              border
              highlight-current-row
              @row-click="openCompetition"
            >
              <el-table-column label="赛事" min-width="180">
                <template #default="{ row }">
                  <div class="player-name-cell">
                    <strong>{{ row.name }}</strong>
                    <span>{{ row.code }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="对象" width="92">
                <template #default="{ row }">{{ formatTargetType(row) }}</template>
              </el-table-column>
              <el-table-column label="范围" width="130">
                <template #default="{ row }">{{ formatScope(row) }}</template>
              </el-table-column>
              <el-table-column label="结果" width="82">
                <template #default="{ row }">{{ row._count?.editions ?? 0 }}</template>
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

        <div class="panel">
          <div class="panel-header">
            <h3>创建赛事</h3>
            <span class="status-pill">新增</span>
          </div>

          <el-form
            class="competition-form-grid"
            label-position="top"
            @submit.prevent="submitCompetition"
          >
            <el-form-item label="赛事编码">
              <el-input v-model="competitionForm.code" placeholder="WORLD_CUP" />
            </el-form-item>
            <el-form-item label="赛事名称">
              <el-input v-model="competitionForm.name" placeholder="世界杯" />
            </el-form-item>
            <el-form-item label="对象">
              <el-select v-model="competitionForm.targetType">
                <el-option
                  v-for="targetType in targetTypeOptions"
                  :key="targetType.value"
                  :label="targetType.label"
                  :value="targetType.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="适用范围">
              <el-select v-model="competitionForm.scopeType">
                <el-option
                  v-for="scopeType in scopeTypeOptions"
                  :key="scopeType.value"
                  :label="scopeType.label"
                  :value="scopeType.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="competitionForm.scopeType === 'CONFEDERATION'" label="足联">
              <ConfederationSelect
                v-model="competitionForm.confederationIds"
                placeholder="选择一个或多个足联"
                :clearable="false"
                multiple
              />
            </el-form-item>
            <el-form-item v-if="competitionForm.scopeType === 'COUNTRY'" label="国家">
              <CountrySelect
                v-model="competitionForm.countryIds"
                placeholder="选择一个或多个国家"
                :clearable="false"
                multiple
              />
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="competitionForm.category" clearable placeholder="选择分类">
                <el-option
                  v-for="category in categoryOptions"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="级别">
              <el-select v-model="competitionForm.level" clearable placeholder="选择级别">
                <el-option
                  v-for="level in levelOptions"
                  :key="level.value"
                  :label="level.label"
                  :value="level.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="赛制">
              <el-select v-model="competitionForm.format" clearable placeholder="选择赛制">
                <el-option
                  v-for="format in formatOptions"
                  :key="format.value"
                  :label="format.label"
                  :value="format.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="外链">
              <el-input v-model="competitionForm.externalUrl" placeholder="https://..." />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="competitionForm.sortOrder" :min="0" :controls="false" />
            </el-form-item>
            <el-form-item label="描述" class="form-wide">
              <el-input
                v-model="competitionForm.description"
                type="textarea"
                :rows="3"
                placeholder="赛事说明、统计口径或备注"
              />
            </el-form-item>
            <div class="form-wide form-help">
              赛事编码建议使用英文大写下划线，例如
              WORLD_CUP、UEFA_CHAMPIONS_LEAGUE、LA_LIGA。适用范围决定哪些国家或俱乐部会看到赛事；分类、级别、赛制用于归类和后续计分。
            </div>
            <el-form-item label="状态">
              <el-switch
                v-model="competitionForm.enabled"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
            <div class="competition-form-actions">
              <el-button type="primary" :loading="creating" @click="submitCompetition">
                创建赛事
              </el-button>
            </div>
          </el-form>
        </div>
      </div>

      <div class="page-stack">
        <div v-if="!selectedCompetition" class="panel empty-panel">
          <h3>请选择赛事</h3>
          <p>选择左侧赛事后，可以维护基础资料和全部年份结果。</p>
        </div>

        <div v-else-if="detailLoading" class="panel">
          <el-skeleton :rows="10" animated />
        </div>

        <template v-else>
          <div class="panel player-detail-hero">
            <div>
              <div class="detail-kicker">
                {{ targetTypeLabels[selectedCompetition.targetType] }} /
                {{ scopeTypeLabels[selectedCompetition.scopeType] }}
              </div>
              <a
                class="external-title-link"
                :href="competitionExternalUrl()"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h2>{{ selectedCompetition.name }}</h2>
              </a>
              <p>{{ selectedCompetition.code }} · {{ formatScope(selectedCompetition) }}</p>
              <div class="detail-tags">
                <el-tag type="success">{{ selectedCompetition.category || '未分类' }}</el-tag>
                <el-tag>{{ selectedCompetition.level || '未分级' }}</el-tag>
                <el-tag type="info">{{ selectedCompetition.format || '未设赛制' }}</el-tag>
                <el-tag type="warning">{{ selectedCompetition.editions.length }} 条结果</el-tag>
              </div>
            </div>
            <a
              class="external-text-link"
              :href="competitionExternalUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              外部链接
            </a>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>赛事资料</h3>
              <span class="status-pill">{{ selectedCompetition.enabled ? '启用' : '停用' }}</span>
            </div>
            <el-form
              class="competition-form-grid"
              label-position="top"
              @submit.prevent="saveCompetitionDetail"
            >
              <el-form-item label="赛事编码">
                <el-input v-model="detailForm.code" />
              </el-form-item>
              <el-form-item label="赛事名称">
                <el-input v-model="detailForm.name" />
              </el-form-item>
              <el-form-item label="对象">
                <el-select v-model="detailForm.targetType">
                  <el-option
                    v-for="targetType in targetTypeOptions"
                    :key="targetType.value"
                    :label="targetType.label"
                    :value="targetType.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="适用范围">
                <el-select v-model="detailForm.scopeType">
                  <el-option
                    v-for="scopeType in scopeTypeOptions"
                    :key="scopeType.value"
                    :label="scopeType.label"
                    :value="scopeType.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="detailForm.scopeType === 'CONFEDERATION'" label="足联">
                <ConfederationSelect
                  v-model="detailForm.confederationIds"
                  placeholder="选择一个或多个足联"
                  :clearable="false"
                  multiple
                />
              </el-form-item>
              <el-form-item v-if="detailForm.scopeType === 'COUNTRY'" label="国家">
                <CountrySelect
                  v-model="detailForm.countryIds"
                  placeholder="选择一个或多个国家"
                  :clearable="false"
                  multiple
                />
              </el-form-item>
              <el-form-item label="分类">
                <el-select v-model="detailForm.category" clearable placeholder="选择分类">
                  <el-option
                    v-for="category in categoryOptions"
                    :key="category.value"
                    :label="category.label"
                    :value="category.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="级别">
                <el-select v-model="detailForm.level" clearable placeholder="选择级别">
                  <el-option
                    v-for="level in levelOptions"
                    :key="level.value"
                    :label="level.label"
                    :value="level.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="赛制">
                <el-select v-model="detailForm.format" clearable placeholder="选择赛制">
                  <el-option
                    v-for="format in formatOptions"
                    :key="format.value"
                    :label="format.label"
                    :value="format.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="外链">
                <el-input v-model="detailForm.externalUrl" placeholder="https://..." />
              </el-form-item>
              <el-form-item label="排序">
                <el-input-number v-model="detailForm.sortOrder" :min="0" :controls="false" />
              </el-form-item>
              <el-form-item label="描述" class="form-wide">
                <el-input
                  v-model="detailForm.description"
                  type="textarea"
                  :rows="3"
                  placeholder="赛事说明、统计口径或备注"
                />
              </el-form-item>
              <div class="form-wide form-help">
                适用范围决定哪些国家或俱乐部会看到赛事；分类、级别、赛制用于归类和后续计分。
              </div>
              <el-form-item label="状态">
                <el-switch v-model="detailForm.enabled" active-text="启用" inactive-text="停用" />
              </el-form-item>
              <div class="competition-form-actions">
                <el-button type="primary" :loading="savingDetail" @click="saveCompetitionDetail">
                  保存赛事资料
                </el-button>
              </div>
            </el-form>
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <h3>历届结果</h3>
                <p>一个赛事下直接维护所有年份的冠军、亚军、季军和殿军。</p>
              </div>
              <el-button type="success" @click="openCreateResultDialog">新增年份结果</el-button>
            </div>

            <div v-if="!sortedEditions.length" class="mini-empty">暂无历届结果</div>

            <el-table v-else :data="sortedEditions" border>
              <el-table-column prop="year" label="年份" width="90" sortable />
              <el-table-column prop="name" label="届次 / 赛季" min-width="180" />
              <el-table-column prop="season" label="赛季" width="110">
                <template #default="{ row }">{{ row.season || '-' }}</template>
              </el-table-column>
              <el-table-column prop="host" label="主办地" min-width="120">
                <template #default="{ row }">{{ row.host || '-' }}</template>
              </el-table-column>
              <el-table-column
                v-for="placement in placements"
                :key="placement.value"
                :label="placement.label"
                min-width="120"
              >
                <template #default="{ row }">
                  {{ formatEditionStanding(row, placement.value) }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
                <template #default="{ row }">{{ row.remark || '-' }}</template>
              </el-table-column>
              <el-table-column label="操作" width="90" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openEditResultDialog(row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </div>
    </div>

    <el-dialog v-model="resultDialogVisible" :title="resultDialogTitle" width="720px">
      <el-form class="competition-form-grid" label-position="top" @submit.prevent="saveResult">
        <el-form-item label="名称" required>
          <el-input v-model="resultForm.name" placeholder="2022 世界杯 / 2023-24 英超" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input-number v-model="resultForm.year" :min="1800" :max="2200" :controls="false" />
        </el-form-item>
        <el-form-item label="赛季">
          <el-input v-model="resultForm.season" placeholder="2023-24" />
        </el-form-item>
        <el-form-item label="主办地">
          <el-input v-model="resultForm.host" placeholder="卡塔尔" />
        </el-form-item>

        <template v-for="placement in placements" :key="placement.value">
          <el-form-item :label="placement.label">
            <CountrySelect
              v-if="selectedCompetition?.targetType === 'COUNTRY'"
              v-model="resultForm.standings[placement.value].countryId"
              placeholder="选择国家队"
            />
            <ClubSelect
              v-else
              v-model="resultForm.standings[placement.value].clubId"
              placeholder="选择俱乐部"
            />
          </el-form-item>
        </template>

        <el-form-item label="备注" class="form-wide">
          <el-input v-model="resultForm.remark" type="textarea" :rows="3" placeholder="可选" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :disabled="resultSaving" @click="resultDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="resultSaving" @click="saveResult">保存结果</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.form-help {
  color: #66756d;
  font-size: 13px;
  line-height: 1.7;
}
</style>

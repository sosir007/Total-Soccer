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
  updateCompetitionEdition,
  type CompetitionCategory,
  type CompetitionDetail,
  type CompetitionEdition,
  type CompetitionFormat,
  type CompetitionLevel,
  type CompetitionScopeType,
  type CompetitionStandingPlacement,
  type CompetitionTargetType
} from '@/services/competitions';
import EntityLink from '@/components/EntityLink.vue';
import { ClubSelect, ConfederationSelect, CountrySelect } from '@/components/selects';
import { useOptionStore } from '@/stores/options';
import { useRouteTabsStore } from '@/stores/route-tabs';

type StandingForm = Record<CompetitionStandingPlacement, { countryId: string; clubId: string }>;

interface EditionRow {
  clientId: string;
  id?: string;
  year: string;
  season: string;
  quantity: number | undefined;
  host: string;
  remark: string;
  standings: StandingForm;
  locked: boolean;
}

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
    competition.value = await fetchCompetitionDetail(competitionId.value);
    routeTabsStore.setTitle(route.fullPath, competition.value.name);
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

  return standing?.country?.id ?? standing?.club?.id ?? null;
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
      <el-button type="primary" @click="backToList">返回赛事列表</el-button>
    </div>

    <template v-else>
      <div class="panel player-detail-hero">
        <div>
          <div class="detail-kicker">
            {{ targetTypeLabels[competition.targetType] }} /
            {{ scopeTypeLabels[competition.scopeType] }}
          </div>
          <h2>{{ competition.name }}</h2>
          <p>{{ competition.code }} · {{ formatScope(competition) }}</p>
          <div class="detail-tags">
            <el-tag type="success">{{ competition.category || '未分类' }}</el-tag>
            <el-tag>{{ competition.level || '未分级' }}</el-tag>
            <el-tag v-if="shouldUseCompetitionFormat(competition)" type="info">
              {{ competition.format || '未设赛制' }}
            </el-tag>
            <el-tag type="warning">{{ getSummaryCountLabel() }}</el-tag>
          </div>
        </div>
        <div class="panel-actions">
          <el-button @click="backToList">返回列表</el-button>
          <el-button type="primary" @click="openDetailDialog">编辑资料</el-button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>赛事资料</h3>
          <span class="status-pill">{{ competition.enabled ? '启用' : '停用' }}</span>
        </div>

        <div class="competition-info-grid">
          <div class="competition-info-item">
            <span>赛事编码</span>
            <strong>{{ competition.code }}</strong>
          </div>
          <div class="competition-info-item">
            <span>赛事名称</span>
            <strong>{{ competition.name }}</strong>
          </div>
          <div class="competition-info-item">
            <span>对象</span>
            <strong>{{ targetTypeLabels[competition.targetType] }}</strong>
          </div>
          <div class="competition-info-item">
            <span>适用范围</span>
            <strong>{{ formatScope(competition) }}</strong>
          </div>
          <div class="competition-info-item">
            <span>分类</span>
            <strong>{{ formatText(competition.category) }}</strong>
          </div>
          <div class="competition-info-item">
            <span>级别</span>
            <strong>{{ formatText(competition.level) }}</strong>
          </div>
          <div class="competition-info-item">
            <span>赛制</span>
            <strong>{{ formatCompetitionFormat(competition) }}</strong>
          </div>
          <div class="competition-info-item form-wide">
            <span>描述</span>
            <strong>{{ formatText(competition.description) }}</strong>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <h3>年份结果</h3>
            <p>在这里查看该赛事全部年份或赛季的冠军、亚军、季军和殿军。</p>
          </div>
          <div class="panel-actions">
            <el-switch v-model="sortAscending" active-text="按年份升序" inactive-text="倒序" />
            <el-button type="primary" @click="openResultDialog">批量编辑结果</el-button>
          </div>
        </div>

        <div v-if="!sortedEditions.length" class="mini-empty">暂无年份结果</div>

        <el-table v-else :data="sortedEditions" border>
          <el-table-column label="赛季" min-width="120">
            <template #default="{ row }">{{ formatEditionLabel(row) }}</template>
          </el-table-column>
          <el-table-column prop="host" label="举办地" min-width="120">
            <template #default="{ row }">{{ row.host || '-' }}</template>
          </el-table-column>
          <el-table-column
            v-for="placement in placements"
            :key="placement.value"
            :label="placement.label"
            min-width="120"
          >
            <template #default="{ row }">
              <EntityLink
                v-if="hasEditionStanding(row, placement.value)"
                :id="getStandingEntityId(row, placement.value)"
                :type="getStandingEntityType(row, placement.value)"
                :name="getStandingEntityName(row, placement.value)"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="90">
            <template #default="{ row }">{{ formatText(row.quantity) }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ row.remark || '-' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="130" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEditEditionDialog(row)">编辑</el-button>
              <el-button
                link
                type="danger"
                :disabled="row.standings.length > 0"
                :loading="resultSaving"
                @click="confirmDeleteEdition(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <el-dialog v-model="detailDialogVisible" title="编辑赛事资料" width="760px" destroy-on-close>
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
        <el-form-item v-if="showDetailFormatField" label="赛制">
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
        <el-form-item label="描述" class="form-wide">
          <el-input
            v-model="detailForm.description"
            type="textarea"
            :rows="3"
            placeholder="赛事说明、统计口径或备注"
          />
        </el-form-item>
        <div class="form-wide form-help">
          适用范围决定哪些国家或俱乐部会看到赛事；分类、级别用于归类和后续计分，赛制仅用于国内赛事区分联赛和杯赛。
        </div>
        <el-form-item label="状态">
          <el-switch v-model="detailForm.enabled" active-text="启用" inactive-text="停用" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :disabled="savingDetail" @click="detailDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingDetail" @click="saveCompetitionDetail">
          保存资料
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="resultDialogVisible" :title="resultDialogTitle" width="1180px">
      <div class="edition-editor-toolbar">
        <el-button v-if="resultDialogMode === 'batch'" type="primary" @click="addEditionRow">
          新增一行
        </el-button>
        <span v-else class="status-pill">编辑当前行</span>
        <el-switch v-model="sortAscending" active-text="按年份升序" inactive-text="倒序" />
      </div>

      <div class="edition-editor-table">
        <div class="edition-editor-row edition-editor-head">
          <span>年份</span>
          <span>赛季/别名</span>
          <span>举办地</span>
          <span>冠军</span>
          <span>亚军</span>
          <span>季军</span>
          <span>殿军</span>
          <span>数量</span>
          <span>备注</span>
          <span>操作</span>
        </div>

        <div
          v-for="row in sortedEditionRows"
          :key="row.clientId"
          class="edition-editor-row"
          :class="{ locked: row.locked }"
        >
          <el-date-picker
            v-model="row.year"
            type="year"
            value-format="YYYY"
            placeholder="年份"
            style="width: 100%"
          />
          <el-input v-model="row.season" placeholder="2023-24 / 可空" />
          <el-input v-model="row.host" placeholder="举办地" />
          <CountrySelect
            v-if="competition?.targetType === 'COUNTRY'"
            v-model="row.standings.CHAMPION.countryId"
            placeholder="冠军"
          />
          <ClubSelect v-else v-model="row.standings.CHAMPION.clubId" placeholder="冠军" />
          <CountrySelect
            v-if="competition?.targetType === 'COUNTRY'"
            v-model="row.standings.RUNNER_UP.countryId"
            placeholder="亚军"
          />
          <ClubSelect v-else v-model="row.standings.RUNNER_UP.clubId" placeholder="亚军" />
          <CountrySelect
            v-if="competition?.targetType === 'COUNTRY'"
            v-model="row.standings.THIRD_PLACE.countryId"
            placeholder="季军"
          />
          <ClubSelect v-else v-model="row.standings.THIRD_PLACE.clubId" placeholder="季军" />
          <CountrySelect
            v-if="competition?.targetType === 'COUNTRY'"
            v-model="row.standings.FOURTH_PLACE.countryId"
            placeholder="殿军"
          />
          <ClubSelect v-else v-model="row.standings.FOURTH_PLACE.clubId" placeholder="殿军" />
          <el-input-number
            v-model="row.quantity"
            :min="0"
            :controls="false"
            placeholder="可空"
            style="width: 100%"
          />
          <el-input v-model="row.remark" placeholder="备注" />
          <el-button
            link
            type="danger"
            :disabled="editionRows.length <= 1 || row.locked"
            @click="removeEditionRow(row)"
          >
            删除
          </el-button>
        </div>
      </div>

      <template #footer>
        <el-button :disabled="resultSaving" @click="resultDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="resultSaving" @click="saveResultRows">
          保存结果
        </el-button>
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

.competition-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.competition-info-item {
  display: grid;
  gap: 8px;
  min-height: 78px;
  padding: 14px;
  border: 1px solid rgba(31, 139, 85, 0.12);
  border-radius: 8px;
  background: #fbfdf9;
}

.competition-info-item span {
  color: #6b7b70;
  font-size: 13px;
  font-weight: 750;
}

.competition-info-item strong {
  color: #193426;
  font-size: 16px;
  line-height: 1.45;
}

.edition-editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.edition-editor-table {
  display: grid;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.edition-editor-row {
  display: grid;
  grid-template-columns: 120px 150px 90px 140px repeat(4, 170px) 150px 72px;
  gap: 10px;
  align-items: center;
  min-width: 1330px;
}

.edition-editor-head {
  color: #51665b;
  font-size: 13px;
  font-weight: 850;
}

.edition-editor-row.locked {
  opacity: 0.92;
}

@media (max-width: 1100px) {
  .competition-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

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
import { ConfederationSelect, CountrySelect } from '@/components/selects';
import { useOptionStore } from '@/stores/options';
import { buildExternalUrl } from '@/utils/external-link';

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

function getRowSequence(index: number) {
  return (filters.page - 1) * filters.pageSize + index + 1;
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
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>赛事管理</h2>
          <p>维护赛事基础资料。点击赛事名称打开详情页签，在详情里维护资料和历届结果。</p>
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

    <div class="panel">
      <div class="panel-header">
        <h3>赛事列表</h3>
        <div class="panel-actions">
          <span class="status-pill">{{ total }} 项赛事</span>
          <el-button type="primary" @click="openCreateCompetitionDialog">新增赛事</el-button>
        </div>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无赛事数据</h3>
        <p>可以先创建世界杯、欧洲杯、英超、欧冠等赛事。</p>
      </div>

      <template v-else>
        <el-table :data="competitions" border>
          <el-table-column label="序号" width="76" fixed="left">
            <template #default="{ $index }">{{ getRowSequence($index) }}</template>
          </el-table-column>
          <el-table-column label="赛事" min-width="220" fixed="left">
            <template #default="{ row }">
              <button
                class="table-name-link player-name-cell"
                @click="openCompetitionDetail(row.id)"
              >
                <strong>{{ row.name }}</strong>
                <span>{{ row.code }}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column label="对象" width="92">
            <template #default="{ row }">{{ formatTargetType(row) }}</template>
          </el-table-column>
          <el-table-column label="适用范围" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ formatScope(row) }}</template>
          </el-table-column>
          <el-table-column label="分类" width="90">
            <template #default="{ row }">
              <span :class="getCategoryTagClass(row.category)">
                {{ formatText(row.category) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="级别" width="90">
            <template #default="{ row }">
              <span :class="getLevelTagClass(row.level)">
                {{ formatText(row.level) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="赛制" width="90">
            <template #default="{ row }">{{ formatFormat(row) }}</template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'">
                {{ row.enabled ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="外链" width="86">
            <template #default="{ row }">
              <a
                v-if="row.externalUrl"
                class="external-text-link"
                :href="competitionExternalUrl(row)"
                target="_blank"
                rel="noopener noreferrer"
              >
                打开
              </a>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip>
            <template #default="{ row }">{{ formatText(row.description) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openCompetitionDetail(row.id)">编辑</el-button>
              <el-button
                link
                type="danger"
                :loading="deletingId === row.id"
                @click="confirmDeleteCompetition(row)"
              >
                删除
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

    <el-dialog v-model="createDialogVisible" title="创建赛事" width="760px" destroy-on-close>
      <el-form
        class="competition-form-grid"
        label-position="top"
        @submit.prevent="submitCompetition"
      >
        <el-form-item label="赛事编码">
          <el-input v-model="competitionForm.code" placeholder="FIFA_WORLD_CUP" />
        </el-form-item>
        <el-form-item label="赛事名称">
          <el-input v-model="competitionForm.name" placeholder="国际足联世界杯" />
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
        <el-form-item v-if="showCreateFormatField" label="赛制">
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
          FIFA_WORLD_CUP、UEFA_CHAMPIONS_LEAGUE、LA_LIGA。适用范围决定哪些国家或俱乐部会看到赛事；分类、级别用于归类和后续计分，赛制仅用于国内赛事区分联赛和杯赛。
        </div>
        <el-form-item label="状态">
          <el-switch v-model="competitionForm.enabled" active-text="启用" inactive-text="停用" />
        </el-form-item>
        <div class="competition-form-actions">
          <el-button type="primary" :loading="creating" @click="submitCompetition">
            创建赛事
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<style scoped>
.form-help {
  color: #66756d;
  font-size: 13px;
  line-height: 1.7;
}

.table-name-link {
  width: 100%;
  padding: 0;
  border: 0;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.competition-meta-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 46px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 750;
  line-height: 1;
  white-space: nowrap;
}

.competition-category-国际 {
  color: #986812;
  border-color: #f1d28a;
  background: #fff6dc;
}

.competition-category-洲际 {
  color: #25658f;
  border-color: #b8d8ed;
  background: #e9f5fb;
}

.competition-category-国内 {
  color: #218353;
  border-color: #bce4ca;
  background: #eaf8ef;
}

.competition-category-其他,
.competition-category-empty {
  color: #6a756f;
  border-color: #d9e1da;
  background: #f5f7f4;
}

.competition-level-一级 {
  color: #1b7a4b;
  border-color: #9ed7b6;
  background: #e8f7ee;
}

.competition-level-二级 {
  color: #806216;
  border-color: #e6cf82;
  background: #fff7d8;
}

.competition-level-三级 {
  color: #536674;
  border-color: #c7d5dd;
  background: #edf4f7;
}

.competition-level-empty {
  color: #6a756f;
  border-color: #d9e1da;
  background: #f5f7f4;
}
</style>

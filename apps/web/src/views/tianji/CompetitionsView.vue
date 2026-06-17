<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import {
  fetchClubs,
  fetchCountries,
  type ClubListItem,
  type CountryListItem,
  type NamedRef
} from '@/services/catalog';
import {
  createCompetition,
  createCompetitionEdition,
  fetchCompetitionDetail,
  fetchCompetitions,
  saveCompetitionStandings,
  type CompetitionDetail,
  type CompetitionEdition,
  type CompetitionListItem,
  type CompetitionScopeType,
  type CompetitionStandingPlacement,
  type CompetitionTargetType
} from '@/services/competitions';
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
const placements: Array<{ label: string; value: CompetitionStandingPlacement }> = [
  { label: '冠军', value: 'CHAMPION' },
  { label: '亚军', value: 'RUNNER_UP' },
  { label: '季军', value: 'THIRD_PLACE' },
  { label: '殿军', value: 'FOURTH_PLACE' }
];
const placementLabels = Object.fromEntries(
  placements.map((placement) => [placement.value, placement.label])
) as Record<CompetitionStandingPlacement, string>;
const targetTypeLabels = Object.fromEntries(
  targetTypeOptions.map((targetType) => [targetType.value, targetType.label])
) as Record<CompetitionTargetType, string>;
const scopeTypeLabels = Object.fromEntries(
  scopeTypeOptions.map((scopeType) => [scopeType.value, scopeType.label])
) as Record<CompetitionScopeType, string>;

const loading = ref(false);
const sourceLoading = ref(false);
const creating = ref(false);
const detailLoading = ref(false);
const editionSaving = ref(false);
const standingSaving = ref(false);
const errorMessage = ref('');
const competitions = ref<CompetitionListItem[]>([]);
const selectedCompetition = ref<CompetitionDetail | null>(null);
const selectedEditionId = ref('');
const countries = ref<CountryListItem[]>([]);
const clubs = ref<ClubListItem[]>([]);
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
  confederationId: '',
  countryId: '',
  enabled: true,
  sortOrder: 0
});
const editionForm = reactive({
  name: '',
  season: '',
  year: undefined as number | undefined,
  host: '',
  remark: ''
});
const standingForm = reactive<
  Record<CompetitionStandingPlacement, { countryId: string; clubId: string; remark: string }>
>({
  CHAMPION: { countryId: '', clubId: '', remark: '' },
  RUNNER_UP: { countryId: '', clubId: '', remark: '' },
  THIRD_PLACE: { countryId: '', clubId: '', remark: '' },
  FOURTH_PLACE: { countryId: '', clubId: '', remark: '' }
});

const hasRows = computed(() => competitions.value.length > 0);
const selectedEdition = computed(
  () =>
    selectedCompetition.value?.editions.find((edition) => edition.id === selectedEditionId.value) ??
    null
);
const confederations = computed<NamedRef[]>(() => {
  const refs = new Map<string, NamedRef>();

  for (const country of countries.value) {
    if (country.federationRef) {
      refs.set(country.federationRef.id, country.federationRef);
    }
  }

  return [...refs.values()].sort((current, next) =>
    current.name.localeCompare(next.name, 'zh-Hans-CN')
  );
});

async function loadSources() {
  sourceLoading.value = true;

  try {
    const [countryItems, clubItems] = await Promise.all([fetchAllCountries(), fetchAllClubs()]);
    countries.value = countryItems;
    clubs.value = clubItems;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事基础选项加载失败。');
  } finally {
    sourceLoading.value = false;
  }
}

async function fetchAllCountries() {
  const items: CountryListItem[] = [];
  let page = 1;
  let totalItems = 0;

  do {
    const result = await fetchCountries({
      page,
      pageSize: 100,
      sortBy: 'name',
      sortOrder: 'asc'
    });
    items.push(...result.items);
    totalItems = result.total;
    page += 1;
  } while (items.length < totalItems);

  return items;
}

async function fetchAllClubs() {
  const items: ClubListItem[] = [];
  let page = 1;
  let totalItems = 0;

  do {
    const result = await fetchClubs({
      page,
      pageSize: 100,
      sortBy: 'name',
      sortOrder: 'asc'
    });
    items.push(...result.items);
    totalItems = result.total;
    page += 1;
  } while (items.length < totalItems);

  return items;
}

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
    selectedEditionId.value = selectedCompetition.value.editions[0]?.id ?? '';
    populateStandingForm();
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
  if (!competitionForm.code.trim() || !competitionForm.name.trim()) {
    ElMessage.warning('请填写赛事编码和赛事名称。');
    return;
  }

  if (competitionForm.scopeType === 'CONFEDERATION' && !competitionForm.confederationId) {
    ElMessage.warning('足联范围赛事需要选择足联。');
    return;
  }

  if (competitionForm.scopeType === 'COUNTRY' && !competitionForm.countryId) {
    ElMessage.warning('国家范围赛事需要选择国家。');
    return;
  }

  creating.value = true;

  try {
    const created = await createCompetition({
      code: competitionForm.code.trim(),
      name: competitionForm.name.trim(),
      externalUrl: competitionForm.externalUrl.trim() || undefined,
      targetType: competitionForm.targetType,
      scopeType: competitionForm.scopeType,
      category: competitionForm.category.trim() || undefined,
      level: competitionForm.level.trim() || undefined,
      confederationId:
        competitionForm.scopeType === 'CONFEDERATION' ? competitionForm.confederationId : undefined,
      countryId: competitionForm.scopeType === 'COUNTRY' ? competitionForm.countryId : undefined,
      enabled: competitionForm.enabled,
      sortOrder: competitionForm.sortOrder
    });
    ElMessage.success('赛事创建成功。');
    resetCompetitionForm();
    await loadCompetitions();
    await openCompetition(created);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事创建失败。');
  } finally {
    creating.value = false;
  }
}

async function submitEdition() {
  if (!selectedCompetition.value) {
    ElMessage.warning('请先选择赛事。');
    return;
  }

  if (!editionForm.name.trim()) {
    ElMessage.warning('请填写届次或赛季名称。');
    return;
  }

  editionSaving.value = true;

  try {
    const edition = await createCompetitionEdition(selectedCompetition.value.id, {
      name: editionForm.name.trim(),
      season: editionForm.season.trim() || undefined,
      year: editionForm.year,
      host: editionForm.host.trim() || undefined,
      remark: editionForm.remark.trim() || undefined
    });
    ElMessage.success('届次创建成功。');
    resetEditionForm();
    await refreshSelectedCompetition(edition.id);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '届次创建失败。');
  } finally {
    editionSaving.value = false;
  }
}

async function submitStandings() {
  if (!selectedCompetition.value || !selectedEdition.value) {
    ElMessage.warning('请先选择赛事届次。');
    return;
  }

  standingSaving.value = true;

  try {
    await saveCompetitionStandings(selectedEdition.value.id, {
      standings: placements.map((placement) => ({
        placement: placement.value,
        countryId:
          selectedCompetition.value?.targetType === 'COUNTRY'
            ? standingForm[placement.value].countryId || null
            : null,
        clubId:
          selectedCompetition.value?.targetType === 'CLUB'
            ? standingForm[placement.value].clubId || null
            : null,
        remark: standingForm[placement.value].remark.trim() || null
      }))
    });
    ElMessage.success('名次保存成功。');
    await refreshSelectedCompetition(selectedEdition.value.id);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '名次保存失败。');
  } finally {
    standingSaving.value = false;
  }
}

async function refreshSelectedCompetition(editionId?: string) {
  if (!selectedCompetition.value) {
    return;
  }

  selectedCompetition.value = await fetchCompetitionDetail(selectedCompetition.value.id);
  selectedEditionId.value = editionId ?? selectedCompetition.value.editions[0]?.id ?? '';
  populateStandingForm();
}

function populateStandingForm() {
  clearStandingForm();

  if (!selectedEdition.value) {
    return;
  }

  for (const standing of selectedEdition.value.standings) {
    standingForm[standing.placement].countryId = standing.countryId ?? '';
    standingForm[standing.placement].clubId = standing.clubId ?? '';
    standingForm[standing.placement].remark = standing.remark ?? '';
  }
}

function clearStandingForm() {
  for (const placement of placements) {
    standingForm[placement.value].countryId = '';
    standingForm[placement.value].clubId = '';
    standingForm[placement.value].remark = '';
  }
}

function resetCompetitionForm() {
  competitionForm.code = '';
  competitionForm.name = '';
  competitionForm.externalUrl = '';
  competitionForm.category = '';
  competitionForm.level = '';
  competitionForm.confederationId = '';
  competitionForm.countryId = '';
  competitionForm.enabled = true;
  competitionForm.sortOrder = 0;
}

function resetEditionForm() {
  editionForm.name = '';
  editionForm.season = '';
  editionForm.year = undefined;
  editionForm.host = '';
  editionForm.remark = '';
}

function formatScope(competition: CompetitionListItem | CompetitionDetail) {
  if (competition.scopeType === 'CONFEDERATION') {
    return competition.confederation?.name ?? '足联';
  }

  if (competition.scopeType === 'COUNTRY') {
    return competition.country?.name ?? '国家';
  }

  return scopeTypeLabels[competition.scopeType];
}

function formatTargetType(competition: CompetitionListItem | CompetitionDetail) {
  return targetTypeLabels[competition.targetType];
}

function formatStanding(placement: CompetitionStandingPlacement) {
  const standing = selectedEdition.value?.standings.find((item) => item.placement === placement);

  return standing?.country?.name ?? standing?.club?.name ?? '-';
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
    competitionForm.countryId = '';
  }
);

watch(selectedEditionId, () => {
  populateStandingForm();
});

onMounted(async () => {
  await loadSources();
  await loadCompetitions();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>赛事管理</h2>
          <p>统一维护国家队赛事、俱乐部赛事、届次赛季和最终名次。</p>
        </div>
        <span class="status-pill">Competition Hub</span>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="赛事名称 / 编码 / 分类"
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
              <el-table-column label="届次" width="82">
                <template #default="{ row }">{{ row._count?.editions ?? 0 }}</template>
              </el-table-column>
              <el-table-column label="状态" width="86">
                <template #default="{ row }">
                  <el-tag :type="row.enabled ? 'success' : 'info'">
                    {{ row.enabled ? '启用' : '停用' }}
                  </el-tag>
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
            <el-form-item label="外部链接">
              <el-input v-model="competitionForm.externalUrl" placeholder="https://..." />
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
              <el-select
                v-model="competitionForm.confederationId"
                :loading="sourceLoading"
                filterable
                placeholder="选择足联"
              >
                <el-option
                  v-for="confederation in confederations"
                  :key="confederation.id"
                  :label="confederation.name"
                  :value="confederation.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="competitionForm.scopeType === 'COUNTRY'" label="国家">
              <el-select
                v-model="competitionForm.countryId"
                :loading="sourceLoading"
                filterable
                placeholder="选择国家"
              >
                <el-option
                  v-for="country in countries"
                  :key="country.id"
                  :label="country.name"
                  :value="country.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="competitionForm.category" placeholder="世界杯 / 国内联赛" />
            </el-form-item>
            <el-form-item label="级别">
              <el-input v-model="competitionForm.level" placeholder="国际 / 洲际 / 国内" />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="competitionForm.sortOrder" :min="0" />
            </el-form-item>
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
          <p>选择左侧赛事后，可以查看详情、录入届次和保存最终名次。</p>
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
                <el-tag type="warning">{{ selectedCompetition.editions.length }} 届</el-tag>
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
            <dl class="detail-list">
              <div>
                <dt>适用范围</dt>
                <dd>{{ formatScope(selectedCompetition) }}</dd>
              </div>
              <div>
                <dt>外部链接</dt>
                <dd>
                  <a
                    class="external-text-link"
                    :href="competitionExternalUrl()"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ selectedCompetition.externalUrl || 'Google 搜索' }}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>新增届次 / 赛季</h3>
              <span class="status-pill">Edition</span>
            </div>
            <el-form
              class="competition-form-grid"
              label-position="top"
              @submit.prevent="submitEdition"
            >
              <el-form-item label="名称">
                <el-input v-model="editionForm.name" placeholder="2022 世界杯 / 2023-24 英超" />
              </el-form-item>
              <el-form-item label="赛季">
                <el-input v-model="editionForm.season" placeholder="2023-24" />
              </el-form-item>
              <el-form-item label="年份">
                <el-input-number v-model="editionForm.year" :min="1800" :max="2200" />
              </el-form-item>
              <el-form-item label="主办地">
                <el-input v-model="editionForm.host" placeholder="卡塔尔" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="editionForm.remark" placeholder="可选" />
              </el-form-item>
              <div class="competition-form-actions">
                <el-button type="primary" :loading="editionSaving" @click="submitEdition">
                  新增届次
                </el-button>
              </div>
            </el-form>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>名次录入</h3>
              <span class="status-pill">冠军 / 亚军 / 季军 / 殿军</span>
            </div>

            <div v-if="!selectedCompetition.editions.length" class="mini-empty">
              先新增一个届次或赛季
            </div>

            <template v-else>
              <el-form
                class="standing-editor"
                label-position="top"
                @submit.prevent="submitStandings"
              >
                <el-form-item label="届次 / 赛季">
                  <el-select v-model="selectedEditionId" filterable>
                    <el-option
                      v-for="edition in selectedCompetition.editions"
                      :key="edition.id"
                      :label="edition.name"
                      :value="edition.id"
                    />
                  </el-select>
                </el-form-item>

                <div class="standing-grid">
                  <div v-for="placement in placements" :key="placement.value" class="standing-row">
                    <el-form-item :label="placement.label">
                      <el-select
                        v-if="selectedCompetition.targetType === 'COUNTRY'"
                        v-model="standingForm[placement.value].countryId"
                        clearable
                        filterable
                        :loading="sourceLoading"
                        placeholder="选择国家队"
                      >
                        <el-option
                          v-for="country in countries"
                          :key="country.id"
                          :label="country.name"
                          :value="country.id"
                        />
                      </el-select>
                      <el-select
                        v-else
                        v-model="standingForm[placement.value].clubId"
                        clearable
                        filterable
                        :loading="sourceLoading"
                        placeholder="选择俱乐部"
                      >
                        <el-option
                          v-for="club in clubs"
                          :key="club.id"
                          :label="club.name"
                          :value="club.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input v-model="standingForm[placement.value].remark" placeholder="可选" />
                    </el-form-item>
                  </div>
                </div>

                <div class="competition-form-actions">
                  <el-button type="primary" :loading="standingSaving" @click="submitStandings">
                    保存名次
                  </el-button>
                </div>
              </el-form>
            </template>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>历届结果</h3>
              <span class="status-pill">{{ selectedCompetition.editions.length }} 条</span>
            </div>

            <div v-if="!selectedCompetition.editions.length" class="mini-empty">暂无历届结果</div>

            <el-table v-else :data="selectedCompetition.editions" border>
              <el-table-column prop="name" label="届次 / 赛季" min-width="180" />
              <el-table-column prop="year" label="年份" width="90" />
              <el-table-column prop="host" label="主办地" min-width="120" />
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
            </el-table>

            <div v-if="selectedEdition" class="header-strip competition-result-strip">
              <span v-for="placement in placements" :key="placement.value">
                {{ placementLabels[placement.value] }}：{{ formatStanding(placement.value) }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

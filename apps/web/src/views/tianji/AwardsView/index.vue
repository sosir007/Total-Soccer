<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  createAward,
  createAwardEdition,
  fetchAwardDetail,
  fetchAwards,
  saveAwardRecipients,
  updateAward,
  updateAwardEdition,
  type AwardDetail,
  type AwardEdition,
  type AwardListItem,
  type AwardScopeType
} from '@/services/awards';
import { fetchPlayers, type PlayerListItem } from '@/services/catalog';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import { ConfederationSelect, CountrySelect } from '@/components/selects';
import { buildExternalUrl } from '@/utils/external-link';

interface RecipientFormRow {
  playerId: string;
  rank?: number;
  placement: string;
  externalUrl: string;
  remark: string;
}

const scopeTypeOptions: Array<{ label: string; value: AwardScopeType }> = [
  { label: '世界', value: 'WORLD' },
  { label: '洲际', value: 'CONFEDERATION' },
  { label: '国家', value: 'COUNTRY' },
  { label: '联赛', value: 'LEAGUE' },
  { label: '俱乐部', value: 'CLUB' },
  { label: '媒体', value: 'MEDIA' }
];
const scopeTypeLabels = Object.fromEntries(
  scopeTypeOptions.map((scopeType) => [scopeType.value, scopeType.label])
) as Record<AwardScopeType, string>;

const route = useRoute();
const loading = ref(false);
const creating = ref(false);
const detailLoading = ref(false);
const savingDetail = ref(false);
const editionSaving = ref(false);
const playersLoading = ref(false);
const createDialogVisible = ref(false);
const editionDialogVisible = ref(false);
const errorMessage = ref('');
const awards = ref<AwardListItem[]>([]);
const selectedAward = ref<AwardDetail | null>(null);
const editingEdition = ref<AwardEdition | null>(null);
const playerOptions = ref<PlayerListItem[]>([]);
const total = ref(0);

const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  scopeType: '' as '' | AwardScopeType
});
const awardForm = reactive(createEmptyAwardForm());
const detailForm = reactive(createEmptyAwardForm());
const editionForm = reactive({
  name: '',
  season: '',
  year: undefined as number | undefined,
  externalUrl: '',
  remark: '',
  recipients: [] as RecipientFormRow[]
});

const hasRows = computed(() => awards.value.length > 0);
const editionDialogTitle = computed(() => (editingEdition.value ? '编辑奖项年份' : '新增奖项年份'));
const sortedEditions = computed(() => selectedAward.value?.editions ?? []);
const queryAwardId = computed(() => String(route.query.awardId ?? ''));

async function loadAwards() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchAwards({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      scopeType: filters.scopeType || undefined
    });
    awards.value = result.items;
    total.value = result.total;

    const targetAward = result.items.find((item) => item.id === queryAwardId.value);

    if (targetAward) {
      await openAward(targetAward);
    } else if (!selectedAward.value && result.items[0]) {
      await openAward(result.items[0]);
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '奖项列表加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

async function loadPlayerOptions(keyword = '') {
  playersLoading.value = true;

  try {
    const result = await fetchPlayers({
      page: 1,
      pageSize: 100,
      keyword: keyword.trim() || undefined,
      sortBy: 'pa',
      sortOrder: 'desc'
    });
    playerOptions.value = result.items;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '球员选项加载失败。');
  } finally {
    playersLoading.value = false;
  }
}

function searchPlayerOptions(keyword: string) {
  void loadPlayerOptions(keyword);
}

async function openAward(award: AwardListItem) {
  detailLoading.value = true;

  try {
    selectedAward.value = await fetchAwardDetail(award.id);
    populateDetailForm();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项详情加载失败。');
  } finally {
    detailLoading.value = false;
  }
}

async function openAwardById(id: string) {
  if (!id || selectedAward.value?.id === id) {
    return;
  }

  detailLoading.value = true;

  try {
    selectedAward.value = await fetchAwardDetail(id);
    populateDetailForm();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项详情加载失败。');
  } finally {
    detailLoading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadAwards();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.scopeType = '';
  void loadAwards();
}

function openCreateAwardDialog() {
  Object.assign(awardForm, createEmptyAwardForm());
  createDialogVisible.value = true;
}

async function submitAward() {
  if (!validateAwardForm(awardForm)) {
    return;
  }

  creating.value = true;

  try {
    const created = await createAward(buildAwardPayload(awardForm));
    ElMessage.success('奖项创建成功。');
    createDialogVisible.value = false;
    Object.assign(awardForm, createEmptyAwardForm());
    await loadAwards();
    await openAward(created);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项创建失败。');
  } finally {
    creating.value = false;
  }
}

async function saveAwardDetail() {
  if (!selectedAward.value || !validateAwardForm(detailForm)) {
    return;
  }

  savingDetail.value = true;

  try {
    await updateAward(selectedAward.value.id, buildAwardPayload(detailForm));
    ElMessage.success('奖项资料已保存。');
    await loadAwards();
    await refreshSelectedAward();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项资料保存失败。');
  } finally {
    savingDetail.value = false;
  }
}

function openCreateEditionDialog() {
  if (!selectedAward.value) {
    ElMessage.warning('请先选择奖项。');
    return;
  }

  editingEdition.value = null;
  resetEditionForm();
  addRecipientRow();
  editionDialogVisible.value = true;
}

function openEditEditionDialog(edition: AwardEdition) {
  editingEdition.value = edition;
  editionForm.name = edition.name;
  editionForm.season = edition.season ?? '';
  editionForm.year = edition.year ?? undefined;
  editionForm.externalUrl = edition.externalUrl ?? '';
  editionForm.remark = edition.remark ?? '';
  editionForm.recipients = (edition.recipients ?? []).map((recipient) => ({
    playerId: recipient.playerId,
    rank: recipient.rank ?? undefined,
    placement: recipient.placement ?? '',
    externalUrl: recipient.externalUrl ?? '',
    remark: recipient.remark ?? ''
  }));

  if (!editionForm.recipients.length) {
    addRecipientRow();
  }

  editionDialogVisible.value = true;
}

async function saveEdition() {
  if (!selectedAward.value) {
    ElMessage.warning('请先选择奖项。');
    return;
  }

  if (!editionForm.name.trim()) {
    ElMessage.warning('请填写奖项年份名称。');
    return;
  }

  if (hasDuplicateRecipients()) {
    ElMessage.warning('同一届奖项不能重复选择同一球员。');
    return;
  }

  editionSaving.value = true;

  try {
    const payload = {
      name: editionForm.name.trim(),
      season: editionForm.season.trim() || undefined,
      year: editionForm.year,
      externalUrl: editionForm.externalUrl.trim() || undefined,
      remark: editionForm.remark.trim() || undefined
    };
    const edition = editingEdition.value
      ? await updateAwardEdition(editingEdition.value.id, payload)
      : await createAwardEdition(selectedAward.value.id, payload);

    await saveAwardRecipients(edition.id, {
      recipients: editionForm.recipients
        .filter((recipient) => recipient.playerId)
        .map((recipient) => ({
          playerId: recipient.playerId,
          rank: recipient.rank ?? null,
          placement: recipient.placement.trim() || undefined,
          externalUrl: recipient.externalUrl.trim() || undefined,
          remark: recipient.remark.trim() || undefined
        }))
    });

    ElMessage.success(editingEdition.value ? '奖项年份已更新。' : '奖项年份已创建。');
    editionDialogVisible.value = false;
    await refreshSelectedAward();
    await loadAwards();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项年份保存失败。');
  } finally {
    editionSaving.value = false;
  }
}

async function refreshSelectedAward() {
  if (!selectedAward.value) {
    return;
  }

  selectedAward.value = await fetchAwardDetail(selectedAward.value.id);
  populateDetailForm();
}

function populateDetailForm() {
  if (!selectedAward.value) {
    return;
  }

  detailForm.code = selectedAward.value.code;
  detailForm.name = selectedAward.value.name;
  detailForm.externalUrl = selectedAward.value.externalUrl ?? '';
  detailForm.scopeType = selectedAward.value.scopeType;
  detailForm.category = selectedAward.value.category ?? '';
  detailForm.level = selectedAward.value.level ?? '';
  detailForm.description = selectedAward.value.description ?? '';
  detailForm.confederationId = selectedAward.value.confederationId ?? '';
  detailForm.countryId = selectedAward.value.countryId ?? '';
  detailForm.enabled = selectedAward.value.enabled;
  detailForm.sortOrder = selectedAward.value.sortOrder;
}

function validateAwardForm(form: ReturnType<typeof createEmptyAwardForm>) {
  if (!form.code.trim() || !form.name.trim()) {
    ElMessage.warning('请填写奖项编码和奖项名称。');
    return false;
  }

  if (form.scopeType === 'CONFEDERATION' && !form.confederationId) {
    ElMessage.warning('洲际奖项需要选择足联。');
    return false;
  }

  if (form.scopeType === 'COUNTRY' && !form.countryId) {
    ElMessage.warning('国家奖项需要选择国家。');
    return false;
  }

  return true;
}

function buildAwardPayload(form: ReturnType<typeof createEmptyAwardForm>) {
  return {
    code: form.code.trim(),
    name: form.name.trim(),
    externalUrl: form.externalUrl.trim() || undefined,
    scopeType: form.scopeType,
    category: form.category.trim() || undefined,
    level: form.level.trim() || undefined,
    description: form.description.trim() || undefined,
    confederationId: form.scopeType === 'CONFEDERATION' ? form.confederationId : undefined,
    countryId: form.scopeType === 'COUNTRY' ? form.countryId : undefined,
    enabled: form.enabled,
    sortOrder: form.sortOrder
  };
}

function createEmptyAwardForm() {
  return {
    code: '',
    name: '',
    externalUrl: '',
    scopeType: 'WORLD' as AwardScopeType,
    category: '',
    level: '',
    description: '',
    confederationId: '',
    countryId: '',
    enabled: true,
    sortOrder: 0
  };
}

function resetEditionForm() {
  editionForm.name = '';
  editionForm.season = '';
  editionForm.year = undefined;
  editionForm.externalUrl = '';
  editionForm.remark = '';
  editionForm.recipients = [];
}

function addRecipientRow() {
  editionForm.recipients.push({
    playerId: '',
    rank: undefined,
    placement: '',
    externalUrl: '',
    remark: ''
  });
}

function clearRecipientRow(index: number) {
  editionForm.recipients.splice(index, 1);

  if (!editionForm.recipients.length) {
    addRecipientRow();
  }
}

function hasDuplicateRecipients() {
  const ids = editionForm.recipients
    .map((recipient) => recipient.playerId)
    .filter(Boolean) as string[];

  return new Set(ids).size !== ids.length;
}

function formatScope(award: AwardListItem | AwardDetail) {
  if (award.scopeType === 'CONFEDERATION') {
    return award.confederation?.name ?? '足联';
  }

  if (award.scopeType === 'COUNTRY') {
    return award.country?.name ?? '国家';
  }

  return scopeTypeLabels[award.scopeType];
}

function formatEditionRecipients(edition: AwardEdition) {
  const recipients = edition.recipients ?? [];

  if (!recipients.length) {
    return '-';
  }

  return recipients
    .map((recipient) => {
      const placement = recipient.placement || (recipient.rank ? `第 ${recipient.rank} 名` : '');
      return [placement, recipient.player.chineseName].filter(Boolean).join(' ');
    })
    .join('、');
}

function formatRecipientPlacement(recipient: NonNullable<AwardEdition['recipients']>[number]) {
  return recipient.placement || (recipient.rank ? `第 ${recipient.rank} 名` : '');
}

function awardExternalUrl() {
  return buildExternalUrl(selectedAward.value?.externalUrl, selectedAward.value?.name || '奖项');
}

function playerOptionMeta(player: PlayerListItem) {
  return [player.uid, player.country?.name, player.club?.name, player.pa ? `PA ${player.pa}` : '']
    .filter(Boolean)
    .join(' · ');
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadAwards();
  }
);

watch(queryAwardId, (id) => {
  void openAwardById(id);
});

watch(
  () => awardForm.scopeType,
  () => {
    awardForm.confederationId = '';
    awardForm.countryId = '';
  }
);

onMounted(() => {
  void loadAwards();
  void loadPlayerOptions();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>奖项管理</h2>
          <p>维护金球奖、世界足球先生、洲际和国家个人奖项，以及每年获奖球员。</p>
        </div>
        <span class="status-pill">Award Hub</span>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="奖项名称 / 编码 / 分类 / 描述"
            @keyup.enter="submitFilters"
          />
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
            <h3>奖项列表</h3>
            <div class="panel-actions">
              <span class="status-pill">{{ total }} 项奖项</span>
              <el-button type="primary" @click="openCreateAwardDialog">新增奖项</el-button>
            </div>
          </div>

          <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

          <div v-else-if="!hasRows" class="empty-panel">
            <h3>暂无奖项数据</h3>
            <p>可以先创建金球奖、世界足球先生、洲际年度最佳球员等个人奖项。</p>
          </div>

          <template v-else>
            <el-table :data="awards" border highlight-current-row @row-click="openAward">
              <el-table-column label="奖项" min-width="190">
                <template #default="{ row }">
                  <EntityNameCell
                    :id="row.id"
                    type="award"
                    :title="row.name"
                    :subtitle="row.code"
                  />
                </template>
              </el-table-column>
              <el-table-column label="范围" width="110">
                <template #default="{ row }">{{ formatScope(row) }}</template>
              </el-table-column>
              <el-table-column label="分类" min-width="120">
                <template #default="{ row }">{{ row.category || '-' }}</template>
              </el-table-column>
              <el-table-column label="年份" width="82">
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

        <el-dialog v-model="createDialogVisible" title="创建奖项" width="760px" destroy-on-close>
          <el-form class="competition-form-grid" label-position="top" @submit.prevent="submitAward">
            <el-form-item label="奖项编码">
              <el-input v-model="awardForm.code" placeholder="BALLON_DOR" />
            </el-form-item>
            <el-form-item label="奖项名称">
              <el-input v-model="awardForm.name" placeholder="金球奖" />
            </el-form-item>
            <el-form-item label="范围">
              <el-select v-model="awardForm.scopeType">
                <el-option
                  v-for="scopeType in scopeTypeOptions"
                  :key="scopeType.value"
                  :label="scopeType.label"
                  :value="scopeType.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="awardForm.scopeType === 'CONFEDERATION'" label="足联">
              <ConfederationSelect
                v-model="awardForm.confederationId"
                placeholder="选择足联"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item v-if="awardForm.scopeType === 'COUNTRY'" label="国家">
              <CountrySelect
                v-model="awardForm.countryId"
                placeholder="选择国家"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="awardForm.category" placeholder="个人奖项 / 年度评选" />
            </el-form-item>
            <el-form-item label="级别">
              <el-input v-model="awardForm.level" placeholder="世界 / 洲际 / 国家" />
            </el-form-item>
            <el-form-item label="外链">
              <el-input v-model="awardForm.externalUrl" placeholder="https://..." />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="awardForm.sortOrder" :min="0" :controls="false" />
            </el-form-item>
            <el-form-item label="描述" class="form-wide">
              <el-input
                v-model="awardForm.description"
                type="textarea"
                :rows="3"
                placeholder="奖项说明、统计口径或备注"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-switch v-model="awardForm.enabled" active-text="启用" inactive-text="停用" />
            </el-form-item>
            <div class="competition-form-actions">
              <el-button type="primary" :loading="creating" @click="submitAward">
                创建奖项
              </el-button>
            </div>
          </el-form>
        </el-dialog>
      </div>

      <div class="page-stack">
        <div v-if="!selectedAward" class="panel empty-panel">
          <h3>请选择奖项</h3>
          <p>选择左侧奖项后，可以维护基础资料和每年获奖球员。</p>
        </div>

        <div v-else-if="detailLoading" class="panel">
          <el-skeleton :rows="10" animated />
        </div>

        <template v-else>
          <div class="panel player-detail-hero">
            <div>
              <div class="detail-kicker">{{ scopeTypeLabels[selectedAward.scopeType] }}</div>
              <a
                class="external-title-link"
                :href="awardExternalUrl()"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h2>{{ selectedAward.name }}</h2>
              </a>
              <p>{{ selectedAward.code }} · {{ formatScope(selectedAward) }}</p>
              <div class="detail-tags">
                <el-tag type="success">{{ selectedAward.category || '未分类' }}</el-tag>
                <el-tag>{{ selectedAward.level || '未分级' }}</el-tag>
                <el-tag type="warning">{{ selectedAward.editions.length }} 个年份</el-tag>
              </div>
            </div>
            <a
              class="external-text-link"
              :href="awardExternalUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              外部链接
            </a>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>奖项资料</h3>
              <span class="status-pill">{{ selectedAward.enabled ? '启用' : '停用' }}</span>
            </div>
            <el-form
              class="competition-form-grid"
              label-position="top"
              @submit.prevent="saveAwardDetail"
            >
              <el-form-item label="奖项编码">
                <el-input v-model="detailForm.code" />
              </el-form-item>
              <el-form-item label="奖项名称">
                <el-input v-model="detailForm.name" />
              </el-form-item>
              <el-form-item label="范围">
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
                  v-model="detailForm.confederationId"
                  placeholder="选择足联"
                  :clearable="false"
                />
              </el-form-item>
              <el-form-item v-if="detailForm.scopeType === 'COUNTRY'" label="国家">
                <CountrySelect
                  v-model="detailForm.countryId"
                  placeholder="选择国家"
                  :clearable="false"
                />
              </el-form-item>
              <el-form-item label="分类">
                <el-input v-model="detailForm.category" />
              </el-form-item>
              <el-form-item label="级别">
                <el-input v-model="detailForm.level" />
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
                  placeholder="奖项说明、统计口径或备注"
                />
              </el-form-item>
              <el-form-item label="状态">
                <el-switch v-model="detailForm.enabled" active-text="启用" inactive-text="停用" />
              </el-form-item>
              <div class="competition-form-actions">
                <el-button type="primary" :loading="savingDetail" @click="saveAwardDetail">
                  保存奖项资料
                </el-button>
              </div>
            </el-form>
          </div>

          <div class="panel">
            <div class="panel-header">
              <div>
                <h3>年份与获奖人</h3>
                <p>一个奖项下维护所有年份和当年获奖球员。</p>
              </div>
              <el-button type="success" @click="openCreateEditionDialog">新增年份</el-button>
            </div>

            <div v-if="!sortedEditions.length" class="mini-empty">暂无奖项年份</div>

            <el-table v-else :data="sortedEditions" border>
              <el-table-column prop="year" label="年份" width="90" sortable />
              <el-table-column prop="name" label="届次 / 年份" min-width="150" />
              <el-table-column prop="season" label="赛季" width="110">
                <template #default="{ row }">{{ row.season || '-' }}</template>
              </el-table-column>
              <el-table-column label="获奖人" min-width="240" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-if="row.recipients?.length" class="inline-entity-list">
                    <span
                      v-for="recipient in row.recipients"
                      :key="recipient.id"
                      class="award-recipient-chip"
                    >
                      <span v-if="formatRecipientPlacement(recipient)">
                        {{ formatRecipientPlacement(recipient) }}
                      </span>
                      <EntityLink
                        :id="recipient.player.id"
                        type="player"
                        :name="recipient.player.chineseName"
                      />
                    </span>
                  </div>
                  <span v-else>{{ formatEditionRecipients(row) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
                <template #default="{ row }">{{ row.remark || '-' }}</template>
              </el-table-column>
              <el-table-column label="操作" width="90" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openEditEditionDialog(row)"
                    >编辑</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </div>
    </div>

    <el-dialog v-model="editionDialogVisible" :title="editionDialogTitle" width="860px">
      <el-form class="competition-form-grid" label-position="top" @submit.prevent="saveEdition">
        <el-form-item label="名称" required>
          <el-input v-model="editionForm.name" placeholder="2024 金球奖" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input-number v-model="editionForm.year" :min="1800" :max="2200" :controls="false" />
        </el-form-item>
        <el-form-item label="赛季">
          <el-input v-model="editionForm.season" placeholder="2023-24" />
        </el-form-item>
        <el-form-item label="外链">
          <el-input v-model="editionForm.externalUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="备注" class="form-wide">
          <el-input v-model="editionForm.remark" type="textarea" :rows="2" placeholder="可选" />
        </el-form-item>
      </el-form>

      <div class="standing-editor">
        <div class="panel-header">
          <h3>获奖球员</h3>
          <el-button size="small" @click="addRecipientRow">新增获奖人</el-button>
        </div>
        <div class="standing-grid">
          <div
            v-for="(recipient, index) in editionForm.recipients"
            :key="index"
            class="standing-row award-recipient-row"
          >
            <el-form-item label="球员">
              <el-select
                v-model="recipient.playerId"
                filterable
                remote
                clearable
                :loading="playersLoading"
                :remote-method="searchPlayerOptions"
                placeholder="选择球员"
              >
                <el-option
                  v-for="player in playerOptions"
                  :key="player.id"
                  :label="player.chineseName"
                  :value="player.id"
                >
                  <div class="player-name-cell">
                    <strong>{{ player.chineseName }}</strong>
                    <span>{{ playerOptionMeta(player) }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排名">
              <el-input-number v-model="recipient.rank" :min="1" :controls="false" />
            </el-form-item>
            <el-form-item label="名次文本">
              <el-input v-model="recipient.placement" placeholder="冠军 / 金球奖 / 第二名" />
            </el-form-item>
            <el-form-item label="外链">
              <el-input v-model="recipient.externalUrl" placeholder="https://..." />
            </el-form-item>
            <el-form-item label="备注" class="form-wide">
              <el-input v-model="recipient.remark" placeholder="补充说明" />
            </el-form-item>
            <div class="competition-form-actions">
              <el-button type="danger" plain @click="clearRecipientRow(index)">清空此行</el-button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button :disabled="editionSaving" @click="editionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editionSaving" @click="saveEdition">保存年份</el-button>
      </template>
    </el-dialog>
  </section>
</template>

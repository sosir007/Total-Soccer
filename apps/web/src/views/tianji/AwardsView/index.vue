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
import { buildExternalUrl } from '@/utils/external-link';
import AwardCreateDialog from './components/AwardCreateDialog.vue';
import AwardDetailFormPanel from './components/AwardDetailFormPanel.vue';
import AwardDetailHero from './components/AwardDetailHero.vue';
import AwardEditionDialog from './components/AwardEditionDialog.vue';
import AwardEditionsPanel from './components/AwardEditionsPanel.vue';
import AwardFilterPanel from './components/AwardFilterPanel.vue';
import AwardListPanel from './components/AwardListPanel.vue';

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
    <AwardFilterPanel
      :filters="filters"
      :loading="loading"
      :scope-type-options="scopeTypeOptions"
      @submit="submitFilters"
      @reset="resetFilters"
    />

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="competition-layout">
      <div class="page-stack">
        <AwardListPanel
          :awards="awards"
          :total="total"
          :loading="loading"
          :has-rows="hasRows"
          :page="filters.page"
          :page-size="filters.pageSize"
          :format-scope="formatScope"
          @create="openCreateAwardDialog"
          @open="openAward"
          @update:page="filters.page = $event"
          @update:page-size="filters.pageSize = $event"
        />

        <AwardCreateDialog
          v-model:visible="createDialogVisible"
          :form="awardForm"
          :creating="creating"
          :scope-type-options="scopeTypeOptions"
          @submit="submitAward"
        />
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
          <AwardDetailHero
            :award="selectedAward"
            :scope-type-labels="scopeTypeLabels"
            :format-scope="formatScope"
            :external-url="awardExternalUrl()"
          />

          <AwardDetailFormPanel
            :form="detailForm"
            :award="selectedAward"
            :saving="savingDetail"
            :scope-type-options="scopeTypeOptions"
            @save="saveAwardDetail"
          />

          <AwardEditionsPanel
            :editions="sortedEditions"
            :format-edition-recipients="formatEditionRecipients"
            :format-recipient-placement="formatRecipientPlacement"
            @create="openCreateEditionDialog"
            @edit="openEditEditionDialog"
          />
        </template>
      </div>
    </div>

    <AwardEditionDialog
      v-model:visible="editionDialogVisible"
      :form="editionForm"
      :title="editionDialogTitle"
      :saving="editionSaving"
      :players-loading="playersLoading"
      :player-options="playerOptions"
      :player-option-meta="playerOptionMeta"
      @search-players="searchPlayerOptions"
      @save="saveEdition"
    />
  </section>
</template>

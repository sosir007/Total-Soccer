<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createAward,
  createAwardEdition,
  deleteAward,
  fetchAwardDetail,
  fetchAwards,
  saveAwardRecipients,
  updateAward,
  updateAwardEdition
} from '@/services/modules/awards';
import { fetchAwardRules } from '@/services/modules/award-rules';
import type {
  AwardDetail,
  AwardEdition,
  AwardListItem,
  AwardScopeType,
  AwardTargetType
} from '@/services/types/awards';
import type { LifecycleStatus } from '@/services/types/common';
import type { AwardRuleItem } from '@/services/types/award-rules';
import { fetchPlayers } from '@/services/modules/catalog';
import type { PlayerListItem } from '@/services/types/catalog';
import { buildExternalUrl } from '@/utils/external-link';
import AwardCreateDialog from './components/AwardCreateDialog.vue';
import AwardDetailDialog from './components/AwardDetailDialog.vue';
import AwardDetailHero from './components/AwardDetailHero.vue';
import AwardInfoPanel from './components/AwardInfoPanel.vue';
import AwardEditionDialog from './components/AwardEditionDialog.vue';
import AwardEditionsPanel from './components/AwardEditionsPanel.vue';
import AwardFilterPanel from './components/AwardFilterPanel.vue';
import AwardListPanel from './components/AwardListPanel.vue';

interface RecipientFormRow {
  playerId: string;
  countryId: string;
  clubId: string;
  rank?: number;
  placement: string;
  externalUrl: string;
  remark: string;
}

interface AwardRuleCategoryOption {
  value: string;
  label: string;
  scopeType: AwardScopeType;
  category: string;
  level: string;
  sortOrder: number;
  description: string;
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
const targetTypeOptions: Array<{ label: string; value: AwardTargetType }> = [
  { label: '球员', value: 'PLAYER' },
  { label: '国家队', value: 'COUNTRY' },
  { label: '俱乐部', value: 'CLUB' }
];
const targetTypeLabels = Object.fromEntries(
  targetTypeOptions.map((targetType) => [targetType.value, targetType.label])
) as Record<AwardTargetType, string>;
const awardLevelOptions = ['综合奖项', '阵容奖项', '专项奖项', '补充奖项'];
const lifecycleStatusOptions: Array<{ label: string; value: LifecycleStatus }> = [
  { label: '现行', value: 'CURRENT' },
  { label: '停办', value: 'DISCONTINUED' }
];

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const creating = ref(false);
const editingAwardId = ref('');
const deletingId = ref('');
const detailLoading = ref(false);
const savingDetail = ref(false);
const editionSaving = ref(false);
const playersLoading = ref(false);
const createDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const editionDialogVisible = ref(false);
const errorMessage = ref('');
const awards = ref<AwardListItem[]>([]);
const selectedAward = ref<AwardDetail | null>(null);
const editingEdition = ref<AwardEdition | null>(null);
const playerOptions = ref<PlayerListItem[]>([]);
const awardRuleOptions = ref<AwardRuleCategoryOption[]>([]);
const total = ref(0);

const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  scopeType: '' as '' | AwardScopeType,
  targetType: 'PLAYER' as AwardTargetType,
  lifecycleStatus: '' as '' | LifecycleStatus
});
const awardForm = reactive(createEmptyAwardForm());
const detailForm = reactive(createEmptyAwardForm());
const editionForm = reactive({
  name: '',
  competitionEditionId: '',
  season: '',
  year: undefined as number | undefined,
  externalUrl: '',
  remark: '',
  recipients: [] as RecipientFormRow[]
});

const hasRows = computed(() => awards.value.length > 0);
const editionDialogTitle = computed(() => (editingEdition.value ? '编辑奖项年份' : '新增奖项年份'));
const sortedEditions = computed(() =>
  [...(selectedAward.value?.editions ?? [])].sort(compareAwardEditions)
);
const rankedAwardLayout = computed(() =>
  sortedEditions.value.some((edition) =>
    (edition.recipients ?? []).some((recipient) => isRankedRecipient(recipient))
  )
);
const competitionEditionOptions = computed(() =>
  (selectedAward.value?.competition?.editions ?? []).map((edition) => ({
    id: edition.id,
    value: edition.id,
    label: edition.season || edition.name || String(edition.year ?? edition.id),
    description: selectedAward.value?.competition?.name ?? undefined,
    meta: [edition.season, edition.name, edition.year ? String(edition.year) : ''].filter(
      Boolean
    ) as string[]
  }))
);
const routeAwardId = computed(() => String(route.params.id ?? ''));
const isAwardDetailRoute = computed(() => route.name === 'tianji-award-detail-id');
const isAwardsRoute = computed(
  () => route.name === 'tianji-awards' || route.name === 'tianji-award-detail-id'
);
const isDetailPage = computed(() => isAwardDetailRoute.value && Boolean(routeAwardId.value));
const awardDialogTitle = computed(() => (editingAwardId.value ? '编辑奖项' : '创建奖项'));
const awardDialogSubmitText = computed(() => (editingAwardId.value ? '保存奖项' : '创建奖项'));

async function loadAwards() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchAwards({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      scopeType: filters.scopeType || undefined,
      targetType: filters.targetType || undefined,
      lifecycleStatus: filters.lifecycleStatus || undefined
    });
    awards.value = result.items;
    total.value = result.total;
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

async function loadAwardRuleOptions() {
  try {
    const result = await fetchAwardRules({
      page: 1,
      pageSize: 200,
      enabled: 'true'
    });
    awardRuleOptions.value = buildAwardRuleOptions(result.items);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项规则选项加载失败。');
  }
}

function buildAwardRuleOptions(rules: AwardRuleItem[]) {
  const categoryMap = new Map<string, AwardRuleCategoryOption>();

  for (const rule of rules) {
    if (!rule.scopeType || !rule.category) {
      continue;
    }

    const key = awardRuleKey(rule.scopeType, rule.category);
    const existing = categoryMap.get(key);
    const sortOrder = existing ? Math.min(existing.sortOrder, rule.sortOrder) : rule.sortOrder;

    categoryMap.set(key, {
      value: key,
      label: rule.category,
      scopeType: rule.scopeType,
      category: rule.category,
      level: resolveAwardRuleLevel(rule.category),
      sortOrder,
      description: [scopeTypeLabels[rule.scopeType], resolveAwardRuleLevel(rule.category)]
        .filter(Boolean)
        .join(' / ')
    });
  }

  return [...categoryMap.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label, 'zh-CN')
  );
}

function awardRuleKey(scopeType: AwardScopeType, category: string) {
  return `${scopeType}::${category}`;
}

function resolveAwardRuleLevel(category: string) {
  if (category.includes('综合')) return '综合奖项';
  if (category.includes('阵容')) return '阵容奖项';
  if (category.includes('专项') || category.includes('门将')) return '专项奖项';
  if (category.includes('补充') || category.includes('附加')) return '补充奖项';
  if (category.includes('国杯')) return '综合奖项';
  return '';
}

function applyAwardRuleOption(
  form: ReturnType<typeof createEmptyAwardForm>,
  optionValue: string,
  { resetScopeRefs = true }: { resetScopeRefs?: boolean } = {}
) {
  const option = awardRuleOptions.value.find((item) => item.value === optionValue);

  if (!option) {
    return;
  }

  form.ruleCategoryKey = option.value;
  form.scopeType = option.scopeType;
  form.category = option.category;
  form.level = option.level;

  if (resetScopeRefs) {
    if (option.scopeType !== 'CONFEDERATION') {
      form.confederationId = '';
    }

    if (option.scopeType !== 'COUNTRY') {
      form.countryId = '';
    }
  }
}

function searchPlayerOptions(keyword: string) {
  void loadPlayerOptions(keyword);
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

function goBackToAwards() {
  void router.push({
    name: 'tianji-awards'
  });
}

function submitFilters() {
  filters.page = 1;
  void loadAwards();
}

function resetFilters() {
  const currentTargetType = filters.targetType;
  filters.page = 1;
  filters.keyword = '';
  filters.scopeType = '';
  filters.targetType = currentTargetType;
  filters.lifecycleStatus = '';
  void loadAwards();
}

function openCreateAwardDialog() {
  editingAwardId.value = '';
  Object.assign(awardForm, createEmptyAwardForm());
  awardForm.targetType = filters.targetType;
  createDialogVisible.value = true;
}

function changeAwardTargetTab() {
  filters.page = 1;
  void loadAwards();
}

async function openEditAwardDialog(row: AwardListItem) {
  if (!awardRuleOptions.value.length) {
    await loadAwardRuleOptions();
  }

  editingAwardId.value = row.id;
  populateAwardForm(row, awardForm);
  createDialogVisible.value = true;
}

async function openDetailDialog() {
  if (!selectedAward.value) {
    return;
  }

  if (!awardRuleOptions.value.length) {
    await loadAwardRuleOptions();
  }

  populateDetailForm();
  detailDialogVisible.value = true;
}

async function submitAward() {
  if (!validateAwardForm(awardForm)) {
    return;
  }

  creating.value = true;

  try {
    if (editingAwardId.value) {
      await updateAward(editingAwardId.value, buildAwardPayload(awardForm));
      ElMessage.success('奖项已更新。');
      await loadAwards();
    } else {
      const created = await createAward(buildAwardPayload(awardForm));
      ElMessage.success('奖项创建成功。');
      await router.push({
        name: 'tianji-award-detail-id',
        params: { id: created.id }
      });
    }

    createDialogVisible.value = false;
    Object.assign(awardForm, createEmptyAwardForm());
    editingAwardId.value = '';
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项保存失败。');
  } finally {
    creating.value = false;
  }
}

async function confirmDeleteAward(row: AwardListItem) {
  try {
    await ElMessageBox.confirm(
      `确定删除奖项「${row.name}」吗？已有届次或获奖人的奖项会被后端阻止删除。`,
      '删除奖项',
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
    await deleteAward(row.id);
    ElMessage.success('奖项已删除。');

    if (awards.value.length === 1 && filters.page > 1) {
      filters.page -= 1;
    }

    await loadAwards();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项删除失败。');
  } finally {
    deletingId.value = '';
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
    detailDialogVisible.value = false;
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
  editionForm.competitionEditionId = edition.competitionEditionId ?? '';
  editionForm.season = edition.season ?? '';
  editionForm.year = edition.year ?? undefined;
  editionForm.externalUrl = edition.externalUrl ?? '';
  editionForm.remark = edition.remark ?? '';
  editionForm.recipients = (edition.recipients ?? []).map((recipient) => ({
    playerId: recipient.playerId ?? '',
    countryId: recipient.countryId ?? '',
    clubId: recipient.clubId ?? '',
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
    ElMessage.warning('同一届奖项不能重复选择同一获奖对象。');
    return;
  }

  editionSaving.value = true;

  try {
    const payload = {
      name: editionForm.name.trim(),
      competitionEditionId: editionForm.competitionEditionId || undefined,
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
        .filter((recipient) => getRecipientTargetId(recipient))
        .map((recipient) => ({
          ...buildRecipientTargetPayload(recipient),
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

  populateAwardForm(selectedAward.value, detailForm);
}

function populateAwardForm(
  award: AwardListItem | AwardDetail,
  form: ReturnType<typeof createEmptyAwardForm>
) {
  form.code = award.code;
  form.name = award.name;
  form.externalUrl = award.externalUrl ?? '';
  form.targetType = award.targetType;
  form.scopeType = award.scopeType;
  form.category = award.category ?? '';
  form.level = award.level ?? '';
  form.ruleCategoryKey = award.category ? awardRuleKey(award.scopeType, award.category) : '';
  form.description = award.description ?? '';
  form.competitionId = award.competitionId ?? '';
  form.confederationId = award.confederationId ?? '';
  form.countryId = award.countryId ?? '';
  form.lifecycleStatus = award.lifecycleStatus;
  form.enabled = award.enabled;
  form.sortOrder = award.sortOrder;
}

function validateAwardForm(form: ReturnType<typeof createEmptyAwardForm>) {
  if (!form.code.trim() || !form.name.trim()) {
    ElMessage.warning('请填写奖项编码和奖项名称。');
    return false;
  }

  if (!form.ruleCategoryKey) {
    ElMessage.warning('请选择评分规则。');
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
    targetType: form.targetType,
    scopeType: form.scopeType,
    category: form.category.trim() || undefined,
    level: form.level.trim() || undefined,
    description: form.description.trim() || undefined,
    competitionId: form.competitionId || undefined,
    confederationId: form.scopeType === 'CONFEDERATION' ? form.confederationId : undefined,
    countryId: form.scopeType === 'COUNTRY' ? form.countryId : undefined,
    lifecycleStatus: form.lifecycleStatus,
    enabled: form.enabled,
    sortOrder: form.sortOrder
  };
}

function createEmptyAwardForm() {
  return {
    code: '',
    name: '',
    externalUrl: '',
    targetType: 'PLAYER' as AwardTargetType,
    scopeType: 'WORLD' as AwardScopeType,
    category: '',
    level: '',
    ruleCategoryKey: '',
    description: '',
    competitionId: '',
    confederationId: '',
    countryId: '',
    lifecycleStatus: 'CURRENT' as LifecycleStatus,
    enabled: true,
    sortOrder: 0
  };
}

function resetEditionForm() {
  editionForm.name = '';
  editionForm.competitionEditionId = '';
  editionForm.season = '';
  editionForm.year = undefined;
  editionForm.externalUrl = '';
  editionForm.remark = '';
  editionForm.recipients = [];
}

function addRecipientRow() {
  editionForm.recipients.push({
    playerId: '',
    countryId: '',
    clubId: '',
    rank: undefined,
    placement: '',
    externalUrl: '',
    remark: ''
  });
}

function hasDuplicateRecipients() {
  const ids = editionForm.recipients
    .map((recipient) => getRecipientTargetId(recipient))
    .filter(Boolean) as string[];

  return new Set(ids).size !== ids.length;
}

function getRecipientTargetId(recipient: RecipientFormRow) {
  if (selectedAward.value?.targetType === 'COUNTRY') {
    return recipient.countryId;
  }

  if (selectedAward.value?.targetType === 'CLUB') {
    return recipient.clubId;
  }

  return recipient.playerId;
}

function buildRecipientTargetPayload(recipient: RecipientFormRow) {
  if (selectedAward.value?.targetType === 'COUNTRY') {
    return { countryId: recipient.countryId };
  }

  if (selectedAward.value?.targetType === 'CLUB') {
    return { clubId: recipient.clubId };
  }

  return { playerId: recipient.playerId };
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
      return [placement, formatRecipientTargetName(recipient)].filter(Boolean).join(' ');
    })
    .join('、');
}

function formatRecipientTargetName(recipient: NonNullable<AwardEdition['recipients']>[number]) {
  return recipient.player?.chineseName ?? recipient.country?.name ?? recipient.club?.name ?? '-';
}

function formatRecipientPlacement(recipient: NonNullable<AwardEdition['recipients']>[number]) {
  return recipient.placement || (recipient.rank ? `第 ${recipient.rank} 名` : '');
}

function compareAwardEditions(left: AwardEdition, right: AwardEdition) {
  const leftYear = left.year ?? Number.MAX_SAFE_INTEGER;
  const rightYear = right.year ?? Number.MAX_SAFE_INTEGER;

  if (leftYear !== rightYear) {
    return leftYear - rightYear;
  }

  return (left.season || left.name || '').localeCompare(right.season || right.name || '', 'zh-CN');
}

function isRankedRecipient(recipient: NonNullable<AwardEdition['recipients']>[number]) {
  if (recipient.rank === 1 || recipient.rank === 2 || recipient.rank === 3) {
    return true;
  }

  const placement = recipient.placement?.trim();
  const rankedPlacements = [
    '第一名',
    '第1名',
    '冠军',
    '金奖',
    '第二名',
    '第2名',
    '亚军',
    '银奖',
    '第三名',
    '第3名',
    '季军',
    '铜奖'
  ];

  return Boolean(placement && rankedPlacements.includes(placement));
}

function awardExternalUrl() {
  return buildExternalUrl(selectedAward.value?.externalUrl, selectedAward.value?.name || '奖项');
}

function formatText(value?: string | number | boolean | null) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }

  return value;
}

function playerOptionMeta(player: PlayerListItem) {
  return [player.uid, player.country?.name, player.club?.name, player.pa ? `PA ${player.pa}` : '']
    .filter(Boolean)
    .join(' · ');
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    if (!isDetailPage.value) {
      void loadAwards();
    }
  }
);

watch(routeAwardId, (id) => {
  if (!isAwardsRoute.value) {
    return;
  }

  if (id) {
    void openAwardById(id);
  } else {
    selectedAward.value = null;
    void loadAwards();
  }
});

watch(
  () => awardForm.scopeType,
  () => {
    awardForm.confederationId = '';
    awardForm.countryId = '';
  }
);

watch(
  () => awardForm.ruleCategoryKey,
  (value) => {
    if (value) {
      applyAwardRuleOption(awardForm, value);
    } else {
      awardForm.category = '';
    }
  }
);

watch(
  () => detailForm.ruleCategoryKey,
  (value) => {
    if (value) {
      applyAwardRuleOption(detailForm, value);
    } else {
      detailForm.category = '';
    }
  }
);

onMounted(() => {
  void loadPlayerOptions();
  void loadAwardRuleOptions();

  if (!isAwardsRoute.value) {
    return;
  }

  if (isDetailPage.value) {
    void openAwardById(routeAwardId.value);
  } else {
    void loadAwards();
  }
});
</script>

<template>
  <section class="page-stack">
    <template v-if="!isDetailPage">
      <AwardFilterPanel
        :filters="filters"
        :loading="loading"
        :scope-type-options="scopeTypeOptions"
        :lifecycle-status-options="lifecycleStatusOptions"
        @submit="submitFilters"
        @reset="resetFilters"
      />

      <div v-if="errorMessage" class="panel">
        <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      </div>

      <div class="panel management-list-panel">
        <el-tabs
          v-model="filters.targetType"
          class="object-tabs"
          @tab-change="changeAwardTargetTab"
        >
          <el-tab-pane
            v-for="targetType in targetTypeOptions"
            :key="targetType.value"
            :label="`${targetType.label}奖项`"
            :name="targetType.value"
          />
        </el-tabs>

        <AwardListPanel
          :awards="awards"
          :total="total"
          :loading="loading"
          :has-rows="hasRows"
          :deleting-id="deletingId"
          :page="filters.page"
          :page-size="filters.pageSize"
          :format-scope="formatScope"
          :target-type-labels="targetTypeLabels"
          embedded
          @create="openCreateAwardDialog"
          @edit="openEditAwardDialog"
          @delete="confirmDeleteAward"
          @update:page="filters.page = $event"
          @update:page-size="filters.pageSize = $event"
        />
      </div>

      <AwardCreateDialog
        v-model:visible="createDialogVisible"
        :title="awardDialogTitle"
        :submit-text="awardDialogSubmitText"
        :form="awardForm"
        :creating="creating"
        :scope-type-options="scopeTypeOptions"
        :target-type-options="targetTypeOptions"
        :lifecycle-status-options="lifecycleStatusOptions"
        :award-rule-options="awardRuleOptions"
        :award-level-options="awardLevelOptions"
        @submit="submitAward"
      />
    </template>

    <template v-else>
      <div v-if="errorMessage" class="panel">
        <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      </div>

      <div v-if="detailLoading" class="panel">
        <el-skeleton :rows="10" animated />
      </div>

      <div v-else-if="!selectedAward" class="panel empty-panel">
        <h3>奖项不存在</h3>
        <p>可以返回奖项管理重新选择。</p>
      </div>

      <template v-else>
        <AwardDetailHero
          :award="selectedAward"
          :scope-type-labels="scopeTypeLabels"
          :target-type-labels="targetTypeLabels"
          :format-scope="formatScope"
          :external-url="awardExternalUrl()"
          @back="goBackToAwards"
          @edit="openDetailDialog"
        />

        <AwardInfoPanel
          :award="selectedAward"
          :target-type-labels="targetTypeLabels"
          :scope-type-labels="scopeTypeLabels"
          :format-scope="formatScope"
          :format-text="formatText"
        />

        <AwardEditionsPanel
          :editions="sortedEditions"
          :ranked-layout="rankedAwardLayout"
          :format-edition-recipients="formatEditionRecipients"
          :format-recipient-placement="formatRecipientPlacement"
          @create="openCreateEditionDialog"
          @edit="openEditEditionDialog"
        />
      </template>
    </template>

    <AwardEditionDialog
      v-model:visible="editionDialogVisible"
      :form="editionForm"
      :title="editionDialogTitle"
      :saving="editionSaving"
      :players-loading="playersLoading"
      :player-options="playerOptions"
      :player-option-meta="playerOptionMeta"
      :target-type="selectedAward?.targetType ?? 'PLAYER'"
      :target-type-labels="targetTypeLabels"
      :competition-edition-options="competitionEditionOptions"
      @search-players="searchPlayerOptions"
      @save="saveEdition"
    />

    <AwardDetailDialog
      v-model:visible="detailDialogVisible"
      :form="detailForm"
      :saving="savingDetail"
      :scope-type-options="scopeTypeOptions"
      :target-type-options="targetTypeOptions"
      :lifecycle-status-options="lifecycleStatusOptions"
      :award-rule-options="awardRuleOptions"
      :award-level-options="awardLevelOptions"
      @save="saveAwardDetail"
    />
  </section>
</template>

<style scoped lang="scss">
.management-list-panel {
  display: grid;
  gap: 18px;
}

.object-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
}
</style>

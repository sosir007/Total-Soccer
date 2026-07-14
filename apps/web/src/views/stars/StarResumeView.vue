<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createPlayerAwardRecipient,
  createPlayerTeamHonor,
  deletePlayerAwardRecipient,
  deletePlayerTeamHonor,
  fetchPlayerDetail,
  fetchPlayerTeamHonors,
  fetchTeamHonorStandingOptions,
  savePlayerCareers,
  updatePlayerAwardRecipient,
  updatePlayerTeamHonor
} from '@/services/modules/catalog';
import { fetchAwardDetail } from '@/services/modules/awards';
import type { AwardDetail, AwardRecipientRecord } from '@/services/types/awards';
import type {
  PlayerCareer,
  PlayerCareerPayload,
  PlayerCareerType,
  PlayerDetail,
  PlayerTeamHonor,
  PlayerTeamHonorPayload,
  PlayerTeamHonorSourceType,
  PlayerTeamHonorStatus,
  TeamHonorStandingOption
} from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { AwardSelect, ClubSelect, CountrySelect, PositionSelect } from '@/components/selects';
import EntityNameCell from '@/components/EntityNameCell.vue';
import IconFont from '@/components/IconFont.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { useRouteTabsStore } from '@/stores/route-tabs';
import { useOptionStore } from '@/stores/options';

interface CareerForm {
  careerType: PlayerCareerType;
  clubId: string;
  countryId: string;
  startYear: string;
  endYear: string;
  appearances?: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  goalsConceded?: number;
  position: string;
  showInProfile: boolean;
  isRepresentative: boolean;
  isLegend: boolean;
  sortOrder: number;
  remark: string;
}

const placementLabels: Record<CompetitionStandingPlacement, string> = {
  CHAMPION: '冠军',
  RUNNER_UP: '亚军',
  THIRD_PLACE: '季军',
  FOURTH_PLACE: '殿军',
  SEMI_FINALIST: '四强'
};
const sourceOptions: Array<{ label: string; value: PlayerTeamHonorSourceType }> = [
  { label: '手动资料', value: 'MANUAL' },
  { label: '经历反查', value: 'CAREER_MATCH' },
  { label: '批量导入', value: 'IMPORT' }
];
const statusOptions: Array<{ label: string; value: PlayerTeamHonorStatus }> = [
  { label: '已确认', value: 'CONFIRMED' },
  { label: '待确认', value: 'PENDING' },
  { label: '不计入', value: 'EXCLUDED' }
];

const route = useRoute();
const router = useRouter();
const routeTabsStore = useRouteTabsStore();
const optionStore = useOptionStore();
const playerId = computed(() => String(route.params.id ?? ''));
const loading = ref(false);
const savingCareers = ref(false);
const awardSaving = ref(false);
const honorSaving = ref(false);
const teamHonorsLoading = ref(false);
const standingSearching = ref(false);
const player = ref<PlayerDetail | null>(null);
const teamHonors = ref<PlayerTeamHonor[]>([]);
const careerForms = ref<CareerForm[]>([]);
const activeTab = ref('careers');
const careerDialogVisible = ref(false);
const editingCareerIndex = ref<number | null>(null);
const awardDialogVisible = ref(false);
const editingAwardRecipient = ref<AwardRecipientRecord | null>(null);
const selectedAwardId = ref('');
const awardEditions = ref<AwardDetail['editions']>([]);
const honorDialogVisible = ref(false);
const editingTeamHonor = ref<PlayerTeamHonor | null>(null);
const standingOptions = ref<TeamHonorStandingOption[]>([]);

const awardForm = reactive({
  editionId: '',
  rank: undefined as number | undefined,
  placement: '',
  externalUrl: '',
  remark: ''
});
const honorForm = reactive({
  standingId: '',
  careerId: '',
  sourceType: 'MANUAL' as PlayerTeamHonorSourceType,
  status: 'CONFIRMED' as PlayerTeamHonorStatus,
  remark: ''
});
const careerForm = reactive<CareerForm>({
  careerType: 'CLUB',
  clubId: '',
  countryId: '',
  startYear: '',
  endYear: '',
  appearances: undefined,
  goals: undefined,
  assists: undefined,
  cleanSheets: undefined,
  goalsConceded: undefined,
  position: '',
  showInProfile: true,
  isRepresentative: false,
  isLegend: false,
  sortOrder: 0,
  remark: ''
});
const careerOptions = computed(() =>
  careerForms.value
    .map((career, index) => {
      const label =
        career.careerType === 'CLUB' ? `俱乐部经历 ${index + 1}` : `国家队经历 ${index + 1}`;

      return {
        value: player.value?.careers?.[index]?.id ?? '',
        label: `${label} / ${formatCareerPeriod(career)}`
      };
    })
    .filter((item) => item.value)
);

async function loadPlayer() {
  if (!playerId.value) return;

  loading.value = true;

  try {
    const loaded = await fetchPlayerDetail(playerId.value);
    player.value = loaded;
    careerForms.value = (loaded.careers ?? []).map((career, index) => careerToForm(career, index));
    routeTabsStore.setTitle(route.fullPath, `${loaded.chineseName} 履历管理`);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '球员履历加载失败。');
  } finally {
    loading.value = false;
  }
}

async function loadTeamHonors() {
  if (!playerId.value) return;

  teamHonorsLoading.value = true;

  try {
    teamHonors.value = await fetchPlayerTeamHonors(playerId.value);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '关联荣誉加载失败。');
  } finally {
    teamHonorsLoading.value = false;
  }
}

function careerToForm(career: PlayerCareer, index: number): CareerForm {
  return {
    careerType: career.careerType,
    clubId: career.club?.id ?? career.clubId ?? '',
    countryId: career.country?.id ?? career.countryId ?? '',
    startYear: career.startYear ? String(career.startYear) : '',
    endYear: career.endYear ? String(career.endYear) : '',
    appearances: career.appearances ?? undefined,
    goals: career.goals ?? undefined,
    assists: career.assists ?? undefined,
    cleanSheets: career.cleanSheets ?? undefined,
    goalsConceded: career.goalsConceded ?? undefined,
    position: career.position ?? '',
    showInProfile: career.showInProfile,
    isRepresentative: career.isRepresentative,
    isLegend: career.isLegend,
    sortOrder: career.sortOrder ?? index,
    remark: career.remark ?? ''
  };
}

function createCareerForm(careerType: PlayerCareerType): CareerForm {
  return {
    careerType,
    clubId: '',
    countryId: careerType === 'COUNTRY' ? (player.value?.country?.id ?? '') : '',
    startYear: '',
    endYear: '',
    appearances: undefined,
    goals: undefined,
    assists: undefined,
    cleanSheets: undefined,
    goalsConceded: undefined,
    position: player.value?.primaryRole ?? '',
    showInProfile: true,
    isRepresentative: false,
    isLegend: false,
    sortOrder: careerForms.value.length,
    remark: ''
  };
}

function openCareerDialog(careerType: PlayerCareerType, index?: number) {
  editingCareerIndex.value = typeof index === 'number' ? index : null;
  Object.assign(
    careerForm,
    typeof index === 'number' ? careerForms.value[index] : createCareerForm(careerType)
  );
  careerDialogVisible.value = true;
}

function removeCareer(index: number) {
  careerForms.value.splice(index, 1);
}

function saveCareerDialog() {
  if (careerForm.careerType === 'CLUB' && !careerForm.clubId) {
    ElMessage.warning('请选择俱乐部。');
    return;
  }

  if (careerForm.careerType === 'COUNTRY' && !careerForm.countryId) {
    ElMessage.warning('请选择国家队。');
    return;
  }

  const nextCareer = { ...careerForm };

  if (editingCareerIndex.value === null) {
    careerForms.value.push(nextCareer);
  } else {
    careerForms.value.splice(editingCareerIndex.value, 1, nextCareer);
  }

  careerDialogVisible.value = false;
}

function parseYear(value: string) {
  const year = Number(value);

  return Number.isFinite(year) ? year : null;
}

function buildCareerPayload(): PlayerCareerPayload[] {
  return careerForms.value.flatMap((career, index) => {
    if (career.careerType === 'CLUB' && !career.clubId) return [];
    if (career.careerType === 'COUNTRY' && !career.countryId) return [];

    return [
      {
        careerType: career.careerType,
        clubId: career.careerType === 'CLUB' ? career.clubId : null,
        countryId: career.careerType === 'COUNTRY' ? career.countryId : null,
        startYear: parseYear(career.startYear),
        endYear: parseYear(career.endYear),
        appearances: career.appearances ?? null,
        goals: career.goals ?? null,
        assists: career.assists ?? null,
        cleanSheets: career.cleanSheets ?? null,
        goalsConceded: career.goalsConceded ?? null,
        position: career.position.trim() || undefined,
        showInProfile: career.careerType === 'CLUB' ? career.showInProfile : true,
        isRepresentative: career.careerType === 'CLUB' ? career.isRepresentative : false,
        isLegend: career.careerType === 'CLUB' ? career.isLegend : false,
        sortOrder: career.sortOrder ?? index,
        remark: career.remark.trim() || undefined
      }
    ];
  });
}

async function saveCareers() {
  savingCareers.value = true;

  try {
    player.value = await savePlayerCareers(playerId.value, buildCareerPayload());
    careerForms.value = (player.value.careers ?? []).map((career, index) =>
      careerToForm(career, index)
    );
    ElMessage.success('结构化经历已保存。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '结构化经历保存失败。');
  } finally {
    savingCareers.value = false;
  }
}

function openAwardDialog(row?: AwardRecipientRecord) {
  editingAwardRecipient.value = row ?? null;
  selectedAwardId.value = row?.edition.award.id ?? '';
  awardForm.editionId = row?.editionId ?? '';
  awardForm.rank = row?.rank ?? undefined;
  awardForm.placement = row?.placement ?? '';
  awardForm.externalUrl = row?.externalUrl ?? '';
  awardForm.remark = row?.remark ?? '';
  awardDialogVisible.value = true;

  if (selectedAwardId.value) {
    void loadAwardEditions(selectedAwardId.value);
  }
}

async function loadAwardEditions(awardId: string) {
  if (!awardId) {
    awardEditions.value = [];
    awardForm.editionId = '';
    return;
  }

  try {
    const detail = await fetchAwardDetail(awardId);
    awardEditions.value = detail.editions ?? [];
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '奖项年份加载失败。');
  }
}

async function saveAwardRecipient() {
  if (!awardForm.editionId) {
    ElMessage.warning('请选择奖项年份。');
    return;
  }

  awardSaving.value = true;

  try {
    const payload = {
      editionId: awardForm.editionId,
      rank: awardForm.rank ?? null,
      placement: awardForm.placement.trim() || undefined,
      externalUrl: awardForm.externalUrl.trim() || undefined,
      remark: awardForm.remark.trim() || undefined
    };

    if (editingAwardRecipient.value) {
      await updatePlayerAwardRecipient(playerId.value, editingAwardRecipient.value.id, payload);
    } else {
      await createPlayerAwardRecipient(playerId.value, payload);
    }

    awardDialogVisible.value = false;
    await loadPlayer();
    ElMessage.success('个人奖项已保存。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '个人奖项保存失败。');
  } finally {
    awardSaving.value = false;
  }
}

async function confirmDeleteAwardRecipient(row: AwardRecipientRecord) {
  try {
    await ElMessageBox.confirm('确定删除这条个人奖项记录吗？', '删除个人奖项', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    });
  } catch {
    return;
  }

  try {
    await deletePlayerAwardRecipient(playerId.value, row.id);
    await loadPlayer();
    ElMessage.success('个人奖项已删除。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '个人奖项删除失败。');
  }
}

function openTeamHonorDialog(row?: PlayerTeamHonor) {
  editingTeamHonor.value = row ?? null;
  honorForm.standingId = row?.standingId ?? '';
  honorForm.careerId = row?.careerId ?? '';
  honorForm.sourceType = row?.sourceType ?? 'MANUAL';
  honorForm.status = row?.status ?? 'CONFIRMED';
  honorForm.remark = row?.remark ?? '';
  honorDialogVisible.value = true;

  if (row?.standing) {
    standingOptions.value = [row.standing];
  }
}

async function searchStandingOptions(keyword = '') {
  standingSearching.value = true;

  try {
    const result = await fetchTeamHonorStandingOptions({
      page: 1,
      pageSize: 30,
      keyword: keyword.trim() || undefined
    });
    standingOptions.value = result.items;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '赛事结果搜索失败。');
  } finally {
    standingSearching.value = false;
  }
}

async function saveTeamHonor() {
  if (!honorForm.standingId) {
    ElMessage.warning('请选择赛事结果。');
    return;
  }

  honorSaving.value = true;

  try {
    const payload: PlayerTeamHonorPayload = {
      standingId: honorForm.standingId,
      careerId: honorForm.careerId || null,
      sourceType: honorForm.sourceType,
      status: honorForm.status,
      remark: honorForm.remark.trim() || undefined
    };

    if (editingTeamHonor.value) {
      await updatePlayerTeamHonor(playerId.value, editingTeamHonor.value.id, payload);
    } else {
      await createPlayerTeamHonor(playerId.value, payload);
    }

    honorDialogVisible.value = false;
    await Promise.all([loadPlayer(), loadTeamHonors()]);
    ElMessage.success('关联荣誉已保存。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '关联荣誉保存失败。');
  } finally {
    honorSaving.value = false;
  }
}

async function confirmDeleteTeamHonor(row: PlayerTeamHonor) {
  try {
    await ElMessageBox.confirm('确定删除这条关联荣誉吗？', '删除关联荣誉', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    });
  } catch {
    return;
  }

  try {
    await deletePlayerTeamHonor(playerId.value, row.id);
    await Promise.all([loadPlayer(), loadTeamHonors()]);
    ElMessage.success('关联荣誉已删除。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '关联荣誉删除失败。');
  }
}

function formatCareerPeriod(career: CareerForm) {
  return [career.startYear, career.endYear].filter(Boolean).join(' - ') || '-';
}

function formatCareerType(type: PlayerCareerType) {
  return type === 'CLUB' ? '俱乐部' : '国家队';
}

function formatCareerTeam(career: CareerForm) {
  const source =
    career.careerType === 'CLUB'
      ? optionStore.clubs.find((club) => club.id === career.clubId)
      : optionStore.countries.find((country) => country.id === career.countryId);

  return source?.name ?? '-';
}

function formatCareerStats(career: CareerForm) {
  const stats = [
    career.appearances !== undefined ? `出场 ${career.appearances}` : '',
    career.goals !== undefined ? `进球 ${career.goals}` : '',
    career.assists !== undefined ? `助攻 ${career.assists}` : '',
    career.cleanSheets !== undefined ? `零封 ${career.cleanSheets}` : '',
    career.goalsConceded !== undefined ? `失球 ${career.goalsConceded}` : ''
  ].filter(Boolean);

  return stats.join(' / ') || '-';
}

function formatEdition(row: AwardRecipientRecord) {
  return row.edition.season || row.edition.name || row.edition.year || '-';
}

function formatAwardPlacement(row: AwardRecipientRecord) {
  return row.placement || (row.rank ? `第 ${row.rank} 名` : '-');
}

function formatStandingLabel(standing: TeamHonorStandingOption) {
  const team = standing.club?.name ?? standing.country?.name ?? '-';
  const competition = standing.edition.competition.name;
  const edition = standing.edition.season || standing.edition.name || standing.edition.year || '-';

  return `${team} / ${competition} / ${edition} / ${placementLabels[standing.placement]}`;
}

function formatTeamHonorStatus(status: PlayerTeamHonorStatus) {
  return statusOptions.find((item) => item.value === status)?.label ?? status;
}

function formatTeamHonorSource(sourceType: PlayerTeamHonorSourceType) {
  return sourceOptions.find((item) => item.value === sourceType)?.label ?? sourceType;
}

function statusVariant(status: PlayerTeamHonorStatus) {
  if (status === 'CONFIRMED') return 'status-enabled';
  if (status === 'PENDING') return 'status-pending';
  return 'status-disabled';
}

function goBack() {
  void router.push({
    name: 'stars-detail-id',
    params: { id: playerId.value }
  });
}

watch(selectedAwardId, (awardId) => {
  void loadAwardEditions(awardId);
});

onMounted(() => {
  void optionStore.ensureClubs();
  void optionStore.ensureCountries();
  void loadPlayer();
  void loadTeamHonors();
  void searchStandingOptions();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>{{ player ? `${player.chineseName} 履历管理` : '履历管理' }}</h2>
          <p>维护结构化经历、个人奖项和确认后的团队荣誉关联。</p>
        </div>
        <el-button @click="goBack">
          <IconFont name="back" />
          返回球员详情
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="panel">
      <el-skeleton :rows="12" animated />
    </div>

    <el-tabs v-else v-model="activeTab" class="panel resume-tabs">
      <el-tab-pane label="经历" name="careers">
        <div class="panel-header resume-tab-header">
          <div>
            <h3>结构化经历</h3>
            <p>维护俱乐部经历、国家队经历和对应出场数据。</p>
          </div>
          <div class="header-actions">
            <el-button @click="openCareerDialog('CLUB')">
              <IconFont name="add" />
              新增俱乐部经历
            </el-button>
            <el-button @click="openCareerDialog('COUNTRY')">
              <IconFont name="add" />
              新增国家队经历
            </el-button>
            <el-button type="primary" :loading="savingCareers" @click="saveCareers">
              <IconFont name="save" />
              保存经历
            </el-button>
          </div>
        </div>

        <div v-if="!careerForms.length" class="mini-empty">暂无结构化经历。</div>

        <el-table v-else :data="careerForms" border>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="类型" width="90" align="center">
            <template #default="{ row }">
              <SemanticTag :variant="row.careerType === 'CLUB' ? 'object-club' : 'object-country'">
                {{ formatCareerType(row.careerType) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="球队 / 国家队" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ formatCareerTeam(row) }}</template>
          </el-table-column>
          <el-table-column label="年份" width="120" align="center">
            <template #default="{ row }">{{ formatCareerPeriod(row) }}</template>
          </el-table-column>
          <el-table-column label="位置" width="100" align="center">
            <template #default="{ row }">{{ row.position || '-' }}</template>
          </el-table-column>
          <el-table-column label="数据" min-width="220" show-overflow-tooltip>
            <template #default="{ row }">{{ formatCareerStats(row) }}</template>
          </el-table-column>
          <el-table-column label="标记" width="190" align="center">
            <template #default="{ row }">
              <div class="career-tags">
                <SemanticTag v-if="row.showInProfile" variant="status-enabled">展示</SemanticTag>
                <SemanticTag v-if="row.isRepresentative" variant="status-representative">
                  代表
                </SemanticTag>
                <SemanticTag v-if="row.isLegend" variant="status-legend">传奇</SemanticTag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ $index }">
              <el-button link type="primary" @click="openCareerDialog('CLUB', $index)">
                <IconFont name="edit" />
                编辑
              </el-button>
              <el-button link type="danger" @click="removeCareer($index)">
                <IconFont name="delete" />
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="个人奖项" name="awards">
        <div class="panel-header resume-tab-header">
          <div>
            <h3>个人奖项</h3>
            <p>只维护球员个人奖项，团队赛事荣誉放在关联荣誉。</p>
          </div>
          <el-button type="primary" @click="openAwardDialog()">
            <IconFont name="add" />
            新增个人奖项
          </el-button>
        </div>
        <el-table :data="player?.personalHonors ?? []" border>
          <el-table-column label="奖项" min-width="220">
            <template #default="{ row }">
              <EntityNameCell
                :id="row.edition.award.id"
                type="award"
                :title="row.edition.award.name"
                :subtitle="row.edition.award.category || row.edition.award.code"
              />
            </template>
          </el-table-column>
          <el-table-column label="年份 / 届次" min-width="150">
            <template #default="{ row }">{{ formatEdition(row) }}</template>
          </el-table-column>
          <el-table-column label="名次" width="110" align="center">
            <template #default="{ row }">{{ formatAwardPlacement(row) }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openAwardDialog(row)">
                <IconFont name="edit" />
                编辑
              </el-button>
              <el-button link type="danger" @click="confirmDeleteAwardRecipient(row)">
                <IconFont name="delete" />
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="关联荣誉" name="team-honors">
        <div class="panel-header resume-tab-header">
          <div>
            <h3>关联团队荣誉</h3>
            <p>确认该球员应计入的俱乐部或国家队赛事结果，不直接修改赛事结果。</p>
          </div>
          <el-button type="primary" @click="openTeamHonorDialog()">
            <IconFont name="add" />
            新增关联荣誉
          </el-button>
        </div>
        <el-table v-loading="teamHonorsLoading" :data="teamHonors" border>
          <el-table-column label="荣誉" min-width="320">
            <template #default="{ row }">{{ formatStandingLabel(row.standing) }}</template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <SemanticTag :variant="statusVariant(row.status)">
                {{ formatTeamHonorStatus(row.status) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="来源" width="110" align="center">
            <template #default="{ row }">{{ formatTeamHonorSource(row.sourceType) }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openTeamHonorDialog(row)">
                <IconFont name="edit" />
                编辑
              </el-button>
              <el-button link type="danger" @click="confirmDeleteTeamHonor(row)">
                <IconFont name="delete" />
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="核对清单" name="candidates">
        <div class="resume-guide">
          <h3>核对清单将在第二阶段启用</h3>
          <p>后续这里会把“资料荣誉”和“根据经历反查的可能遗漏荣誉”合并成待确认清单。</p>
          <p>第一版先维护确认后的关联荣誉，避免自动写入全局赛事结果。</p>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="careerDialogVisible"
      :title="editingCareerIndex === null ? '新增经历' : '编辑经历'"
      width="680px"
      destroy-on-close
    >
      <el-form class="resume-form-stack" label-position="top">
        <el-form-item label="经历类型">
          <el-select v-model="careerForm.careerType">
            <el-option label="俱乐部" value="CLUB" />
            <el-option label="国家队" value="COUNTRY" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="careerForm.careerType === 'CLUB'" label="俱乐部">
          <ClubSelect v-model="careerForm.clubId" placeholder="请选择俱乐部" />
        </el-form-item>
        <el-form-item v-else label="国家队">
          <CountrySelect v-model="careerForm.countryId" placeholder="请选择国家队" />
        </el-form-item>
        <div class="resume-form-pair">
          <el-form-item label="开始年份">
            <el-date-picker
              v-model="careerForm.startYear"
              type="year"
              value-format="YYYY"
              placeholder="选择开始年份"
            />
          </el-form-item>
          <el-form-item label="结束年份">
            <el-date-picker
              v-model="careerForm.endYear"
              type="year"
              value-format="YYYY"
              placeholder="选择结束年份"
            />
          </el-form-item>
        </div>
        <el-form-item label="位置">
          <PositionSelect v-model="careerForm.position" placeholder="请选择位置" />
        </el-form-item>
        <div class="resume-form-pair">
          <el-form-item label="场次">
            <el-input-number v-model="careerForm.appearances" :controls="false" :min="0" />
          </el-form-item>
          <el-form-item label="进球">
            <el-input-number v-model="careerForm.goals" :controls="false" :min="0" />
          </el-form-item>
        </div>
        <div class="resume-form-pair">
          <el-form-item label="助攻">
            <el-input-number v-model="careerForm.assists" :controls="false" :min="0" />
          </el-form-item>
          <el-form-item label="零封">
            <el-input-number v-model="careerForm.cleanSheets" :controls="false" :min="0" />
          </el-form-item>
        </div>
        <div class="resume-form-pair">
          <el-form-item label="失球">
            <el-input-number v-model="careerForm.goalsConceded" :controls="false" :min="0" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="careerForm.sortOrder" :controls="false" :min="0" />
          </el-form-item>
        </div>
        <div v-if="careerForm.careerType === 'CLUB'" class="resume-switch-row">
          <el-checkbox v-model="careerForm.showInProfile">俱乐部展示</el-checkbox>
          <el-checkbox v-model="careerForm.isRepresentative">代表俱乐部</el-checkbox>
          <el-checkbox v-model="careerForm.isLegend">俱乐部名宿</el-checkbox>
        </div>
        <el-form-item label="备注">
          <el-input v-model="careerForm.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="careerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCareerDialog">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="awardDialogVisible" title="维护个人奖项" width="720px" destroy-on-close>
      <el-form class="resume-form-grid" label-position="top">
        <el-form-item label="奖项">
          <AwardSelect v-model="selectedAwardId" placeholder="请选择奖项" />
        </el-form-item>
        <el-form-item label="奖项年份">
          <el-select v-model="awardForm.editionId" filterable placeholder="请选择奖项年份">
            <el-option
              v-for="edition in awardEditions"
              :key="edition.id"
              :label="edition.season || edition.name || edition.year || edition.id"
              :value="edition.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排名">
          <el-input-number v-model="awardForm.rank" :controls="false" :min="1" />
        </el-form-item>
        <el-form-item label="名次文字">
          <el-input v-model="awardForm.placement" placeholder="例如 金球奖 / 第二名 / 入选" />
        </el-form-item>
        <el-form-item label="外链" class="resume-form-wide">
          <el-input v-model="awardForm.externalUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="备注" class="resume-form-wide">
          <el-input v-model="awardForm.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="awardDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="awardSaving" @click="saveAwardRecipient">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="honorDialogVisible" title="维护关联荣誉" width="760px" destroy-on-close>
      <el-form class="resume-form-grid" label-position="top">
        <el-form-item label="赛事结果" class="resume-form-wide">
          <el-select
            v-model="honorForm.standingId"
            filterable
            remote
            reserve-keyword
            :remote-method="searchStandingOptions"
            :loading="standingSearching"
            placeholder="搜索赛事、届次、国家或俱乐部"
          >
            <el-option
              v-for="standing in standingOptions"
              :key="standing.id"
              :label="formatStandingLabel(standing)"
              :value="standing.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联经历">
          <el-select v-model="honorForm.careerId" clearable placeholder="可选">
            <el-option
              v-for="career in careerOptions"
              :key="career.value"
              :label="career.label"
              :value="career.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="honorForm.sourceType">
            <el-option
              v-for="option in sourceOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="honorForm.status">
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" class="resume-form-wide">
          <el-input v-model="honorForm.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="honorDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="honorSaving" @click="saveTeamHonor">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped lang="scss">
.resume-tabs {
  :deep(.el-tabs__content) {
    overflow: visible;
  }
}

.resume-tab-header {
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.resume-card {
  display: grid;
  gap: 12px;
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-surface-default);
}

.resume-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.resume-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;

  :deep(.el-select),
  :deep(.el-input-number) {
    width: 100%;
  }
}

.resume-form-wide {
  grid-column: 1 / -1;
}

.resume-form-stack {
  display: grid;
  gap: 2px;

  :deep(.el-select),
  :deep(.el-date-editor),
  :deep(.el-input-number) {
    width: 100%;
  }
}

.resume-form-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.resume-switch-row,
.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.resume-switch-row {
  padding: 2px 0 16px;
}

.resume-guide {
  display: grid;
  gap: 8px;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-surface-subtle);

  h3,
  p {
    margin: 0;
  }

  p {
    color: var(--text-color-secondary);
  }
}

@media (max-width: 720px) {
  .resume-form-grid {
    grid-template-columns: 1fr;
  }

  .resume-tab-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

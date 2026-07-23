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
import type {
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@/services/types/competitions';
import { AwardSelect, ClubSelect, CountrySelect, PositionSelect } from '@/components/selects';
import BaseOptionSelect from '@/components/selects/BaseOptionSelect.vue';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { useRouteTabsStore } from '@/stores/route-tabs';
import { useOptionStore } from '@/stores/options';
import type { SelectOption } from '@/stores/options';

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

interface TeamHonorGroup {
  id: string;
  careerId: string;
  careerLabel: string;
  teamName: string;
  teamId?: string | null;
  teamType: 'club' | 'country';
  competitionId: string;
  competitionName: string;
  standings: TeamHonorStandingOption[];
  honors: PlayerTeamHonor[];
  standingIds: string[];
  honorText: string;
  sourceType: PlayerTeamHonorSourceType;
  status: PlayerTeamHonorStatus;
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
const editingTeamHonorGroup = ref<TeamHonorGroup | null>(null);
const standingOptions = ref<TeamHonorStandingOption[]>([]);
const selectedCompetitionId = ref('');
const initializingHonorForm = ref(false);
const standingRequestId = ref(0);

const awardForm = reactive({
  editionId: '',
  rank: undefined as number | undefined,
  placement: '',
  externalUrl: '',
  remark: ''
});
const honorForm = reactive({
  standingIds: [] as string[],
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
      const typeLabel = career.careerType === 'CLUB' ? '俱乐部' : '国家队';
      const teamLabel = formatCareerTeam(career);

      return {
        value: player.value?.careers?.[index]?.id ?? '',
        label: `${teamLabel} / ${formatCareerPeriod(career)} / ${typeLabel}`,
        career
      };
    })
    .filter((item) => item.value)
);
const selectedCareerOption = computed(() =>
  careerOptions.value.find((item) => item.value === honorForm.careerId)
);
const selectedCareer = computed(() => selectedCareerOption.value?.career ?? null);
const selectedCareerTargetType = computed<CompetitionTargetType | undefined>(() => {
  if (!selectedCareer.value) return undefined;

  return selectedCareer.value.careerType === 'CLUB' ? 'CLUB' : 'COUNTRY';
});
const relatedCompetitionOptions = computed<SelectOption[]>(() => {
  const competitionMap = new Map<
    string,
    {
      id: string;
      name: string;
      description: string;
      sortOrder: number;
    }
  >();

  standingOptions.value.forEach((standing) => {
    const competition = standing.edition.competition;

    if (!competitionMap.has(competition.id)) {
      competitionMap.set(competition.id, {
        id: competition.id,
        name: competition.name,
        description: [competition.category, competition.level, competition.format]
          .filter(Boolean)
          .join(' / '),
        sortOrder:
          optionStore.competitions.find((item) => item.id === competition.id)?.sortOrder ?? 0
      });
    }
  });

  return [...competitionMap.values()]
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
      return left.name.localeCompare(right.name, 'zh-Hans-CN');
    })
    .map((competition) => ({
      id: competition.id,
      value: competition.id,
      label: competition.name,
      description: competition.description,
      meta: uniqueMeta([competition.description])
    }));
});
const standingChoiceOptions = computed<SelectOption[]>(() =>
  standingOptions.value
    .filter((standing) => {
      if (!selectedCompetitionId.value) return false;
      return standing.edition.competition.id === selectedCompetitionId.value;
    })
    .map((standing) => ({
      id: standing.id,
      value: standing.id,
      label: formatStandingChoice(standing),
      description: formatStandingLabel(standing),
      meta: uniqueMeta([
        standing.edition.season,
        standing.edition.name,
        standing.edition.year ? String(standing.edition.year) : '',
        placementLabels[standing.placement],
        standing.club?.name,
        standing.country?.name,
        standing.edition.competition.name
      ])
    }))
);
const teamHonorGroups = computed<TeamHonorGroup[]>(() => {
  const groups = new Map<string, TeamHonorGroup>();

  teamHonors.value.forEach((honor) => {
    const standing = honor.standing;
    const competition = standing.edition.competition;
    const careerId = honor.careerId ?? '';
    const key = [careerId, competition.id].join('|');
    const careerLabel = honor.career ? formatPlayerCareerLabel(honor.career) : '-';
    const group =
      groups.get(key) ??
      ({
        id: key,
        careerId,
        careerLabel,
        teamName: standing.club?.name ?? standing.country?.name ?? '-',
        teamId: standing.club?.id ?? standing.country?.id ?? null,
        teamType: standing.club ? 'club' : 'country',
        competitionId: competition.id,
        competitionName: competition.name,
        standings: [],
        honors: [],
        standingIds: [],
        honorText: '',
        sourceType: honor.sourceType,
        status: honor.status,
        remark: honor.remark ?? ''
      } satisfies TeamHonorGroup);

    group.standings.push(standing);
    group.honors.push(honor);
    group.standingIds.push(honor.standingId);
    group.remark = formatTeamHonorGroupRemark(group.honors);
    groups.set(key, group);
  });

  return [...groups.values()]
    .map((group) => {
      const honors = sortTeamHonors(group.honors);
      const standings = sortStandings(group.standings);

      return {
        ...group,
        standings,
        honors,
        sourceType: honors[0]?.sourceType ?? group.sourceType,
        status: honors[0]?.status ?? group.status,
        honorText: formatTeamHonorGroupText(standings),
        remark: formatTeamHonorGroupRemark(honors)
      };
    })
    .sort((left, right) => {
      const leftFirst = left.standings[0];
      const rightFirst = right.standings[0];
      const leftTypeSort = left.teamType === 'club' ? 0 : 1;
      const rightTypeSort = right.teamType === 'club' ? 0 : 1;
      const leftSort =
        optionStore.competitions.find((item) => item.id === left.competitionId)?.sortOrder ?? 0;
      const rightSort =
        optionStore.competitions.find((item) => item.id === right.competitionId)?.sortOrder ?? 0;

      if (leftTypeSort !== rightTypeSort) return leftTypeSort - rightTypeSort;
      if (left.careerLabel !== right.careerLabel) {
        return left.careerLabel.localeCompare(right.careerLabel, 'zh-Hans-CN');
      }
      if (leftSort !== rightSort) return leftSort - rightSort;

      return (leftFirst?.edition.year ?? 0) - (rightFirst?.edition.year ?? 0);
    });
});
const isGoalkeeperPlayer = computed(
  () =>
    isGoalkeeperPosition(player.value?.primaryRole) ||
    isGoalkeeperPosition(player.value?.positions) ||
    careerForms.value.some((career) => isGoalkeeperPosition(career.position))
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

async function removeCareer(index: number) {
  try {
    await ElMessageBox.confirm('确定删除这条经历吗？', '删除经历', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    });
  } catch {
    return;
  }

  const nextCareers = [...careerForms.value];
  nextCareers.splice(index, 1);
  await persistCareers(nextCareers, '经历已删除。');
}

async function saveCareerDialog() {
  if (careerForm.careerType === 'CLUB' && !careerForm.clubId) {
    ElMessage.warning('请选择俱乐部。');
    return;
  }

  if (careerForm.careerType === 'COUNTRY' && !careerForm.countryId) {
    ElMessage.warning('请选择国家队。');
    return;
  }

  const nextCareer = { ...careerForm };
  const nextCareers = [...careerForms.value];
  const successMessage = editingCareerIndex.value === null ? '经历已新增。' : '经历已更新。';

  if (editingCareerIndex.value === null) {
    nextCareers.push(nextCareer);
  } else {
    nextCareers.splice(editingCareerIndex.value, 1, nextCareer);
  }

  const saved = await persistCareers(nextCareers, successMessage);

  if (saved) {
    careerDialogVisible.value = false;
    editingCareerIndex.value = null;
  }
}

function parseYear(value: string) {
  const year = Number(value);

  return Number.isFinite(year) ? year : null;
}

function buildCareerPayload(careers = careerForms.value): PlayerCareerPayload[] {
  return careers.flatMap((career, index) => {
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

async function persistCareers(careers: CareerForm[], successMessage: string) {
  savingCareers.value = true;

  try {
    player.value = await savePlayerCareers(playerId.value, buildCareerPayload(careers));
    careerForms.value = (player.value.careers ?? []).map((career, index) =>
      careerToForm(career, index)
    );
    ElMessage.success(successMessage);
    return true;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '结构化经历保存失败。');
    return false;
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

async function openTeamHonorDialog(group?: TeamHonorGroup) {
  initializingHonorForm.value = true;
  editingTeamHonorGroup.value = group ?? null;
  honorForm.standingIds = [];
  honorForm.careerId = group?.careerId ?? '';
  honorForm.sourceType = group?.sourceType ?? 'MANUAL';
  honorForm.status = group?.status ?? 'CONFIRMED';
  honorForm.remark = group?.remark ?? '';
  selectedCompetitionId.value = '';
  honorDialogVisible.value = true;
  standingOptions.value = [];

  try {
    if (honorForm.careerId) {
      await loadStandingOptionsForCareer();
    } else if (group?.standings.length) {
      standingOptions.value = group.standings;
    }

    selectedCompetitionId.value = group?.competitionId ?? '';
    honorForm.standingIds = group?.standingIds ? [...group.standingIds] : [];
  } finally {
    initializingHonorForm.value = false;
  }
}

async function loadStandingOptionsForCareer() {
  const requestId = standingRequestId.value + 1;
  standingRequestId.value = requestId;
  const career = selectedCareer.value;

  if (!career) {
    standingOptions.value = [];
    selectedCompetitionId.value = '';
    honorForm.standingIds = [];
    return;
  }

  const targetType = selectedCareerTargetType.value;
  const teamFilter =
    career.careerType === 'CLUB' ? { clubId: career.clubId } : { countryId: career.countryId };
  const teamId = career.careerType === 'CLUB' ? career.clubId : career.countryId;

  if (!targetType || !teamId) {
    standingOptions.value = [];
    selectedCompetitionId.value = '';
    honorForm.standingIds = [];
    return;
  }

  standingSearching.value = true;

  try {
    const nextStandingOptions = await fetchAllStandingOptions({
      targetType,
      ...teamFilter
    });

    if (requestId !== standingRequestId.value) return;

    standingOptions.value = nextStandingOptions;

    if (
      selectedCompetitionId.value &&
      !standingOptions.value.some(
        (standing) => standing.edition.competition.id === selectedCompetitionId.value
      )
    ) {
      selectedCompetitionId.value = '';
      honorForm.standingIds = [];
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '关联赛事荣誉加载失败。');
  } finally {
    standingSearching.value = false;
  }
}

async function fetchAllStandingOptions(
  params: Omit<Parameters<typeof fetchTeamHonorStandingOptions>[0], 'page' | 'pageSize'>
) {
  const items: TeamHonorStandingOption[] = [];
  let page = 1;
  let total = 0;

  do {
    const result = await fetchTeamHonorStandingOptions({
      ...params,
      page,
      pageSize: 100
    });
    items.push(...result.items);
    total = result.total;
    page += 1;
  } while (items.length < total);

  return items;
}

async function saveTeamHonor() {
  if (!honorForm.careerId) {
    ElMessage.warning('请选择关联经历。');
    return;
  }

  if (!selectedCompetitionId.value) {
    ElMessage.warning('请选择关联赛事。');
    return;
  }

  if (!honorForm.standingIds.length) {
    ElMessage.warning('请选择赛事届次名次。');
    return;
  }

  honorSaving.value = true;

  try {
    const basePayload: Omit<PlayerTeamHonorPayload, 'standingId'> = {
      careerId: honorForm.careerId || null,
      sourceType: honorForm.sourceType,
      status: honorForm.status,
      remark: honorForm.remark.trim() || undefined
    };

    if (editingTeamHonorGroup.value) {
      const previousHonorByStandingId = new Map(
        editingTeamHonorGroup.value.honors.map((honor) => [honor.standingId, honor])
      );
      const nextStandingIds = new Set(honorForm.standingIds);
      const removedHonors = editingTeamHonorGroup.value.honors.filter(
        (honor) => !nextStandingIds.has(honor.standingId)
      );

      await Promise.all([
        ...removedHonors.map((honor) => deletePlayerTeamHonor(playerId.value, honor.id)),
        ...honorForm.standingIds.map((standingId) => {
          const existingHonor = previousHonorByStandingId.get(standingId);

          if (existingHonor) {
            return updatePlayerTeamHonor(playerId.value, existingHonor.id, {
              ...basePayload,
              standingId
            });
          }

          return createPlayerTeamHonor(playerId.value, {
            ...basePayload,
            standingId
          });
        })
      ]);
    } else {
      await Promise.all(
        honorForm.standingIds.map((standingId) =>
          createPlayerTeamHonor(playerId.value, {
            ...basePayload,
            standingId
          })
        )
      );
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

async function confirmDeleteTeamHonor(group: TeamHonorGroup) {
  try {
    await ElMessageBox.confirm(
      `确定删除「${group.teamName} / ${group.competitionName}」这一组关联荣誉吗？`,
      '删除关联荣誉',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }
    );
  } catch {
    return;
  }

  try {
    await Promise.all(group.honors.map((honor) => deletePlayerTeamHonor(playerId.value, honor.id)));
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

function formatTeamHonorType(type: TeamHonorGroup['teamType']) {
  return type === 'club' ? '俱乐部' : '国家队';
}

function formatCareerTeam(career: CareerForm) {
  const source =
    career.careerType === 'CLUB'
      ? optionStore.clubs.find((club) => club.id === career.clubId)
      : optionStore.countries.find((country) => country.id === career.countryId);

  return source?.name ?? '-';
}

function careerEntityType(career: CareerForm) {
  return career.careerType === 'CLUB' ? 'club' : 'country';
}

function careerEntityId(career: CareerForm) {
  return career.careerType === 'CLUB' ? career.clubId : career.countryId;
}

function formatCareerStat(value?: number) {
  return value === undefined || value === null ? '-' : value;
}

function isGoalkeeperPosition(position?: string | null) {
  const normalized = (position ?? '').trim().toUpperCase();
  return normalized === 'GK' || normalized.includes('门将') || normalized.includes('守门');
}

function formatEdition(row: AwardRecipientRecord) {
  return formatEditionShort(row.edition);
}

function formatAwardPlacement(row: AwardRecipientRecord) {
  return row.placement || (row.rank ? `第 ${row.rank} 名` : '-');
}

function formatStandingLabel(standing: TeamHonorStandingOption) {
  const team = standing.club?.name ?? standing.country?.name ?? '-';
  const competition = standing.edition.competition.name;
  const edition = formatEditionShort(standing.edition);

  return `${team} / ${competition} / ${edition} / ${placementLabels[standing.placement]}`;
}

function formatStandingChoice(standing: TeamHonorStandingOption) {
  const edition = formatEditionShort(standing.edition);

  return `${edition} / ${placementLabels[standing.placement]}`;
}

function formatEditionShort(edition: {
  season?: string | null;
  name?: string | null;
  year?: number | null;
}) {
  if (edition.year) return String(edition.year);

  return String(edition.season || edition.name || '-').replace(/年$/, '');
}

function formatPlayerCareerLabel(career: PlayerCareer) {
  const team = career.club?.name ?? career.country?.name ?? '-';
  const startYear = career.startYear ? String(career.startYear) : '';
  const endYear = career.endYear ? String(career.endYear) : '';
  const period = [startYear, endYear].filter(Boolean).join(' - ') || '-';
  const type = career.careerType === 'CLUB' ? '俱乐部' : '国家队';

  return `${team} / ${period} / ${type}`;
}

function sortStandings(standings: TeamHonorStandingOption[]) {
  return [...standings].sort(compareStandings);
}

function sortTeamHonors(honors: PlayerTeamHonor[]) {
  return [...honors].sort((left, right) => compareStandings(left.standing, right.standing));
}

function formatTeamHonorGroupRemark(honors: PlayerTeamHonor[]) {
  return uniqueMeta(honors.map((honor) => honor.remark)).join('；');
}

function compareStandings(left: TeamHonorStandingOption, right: TeamHonorStandingOption) {
  const leftYear = left.edition.year ?? 0;
  const rightYear = right.edition.year ?? 0;

  if (leftYear !== rightYear) return leftYear - rightYear;
  if (left.standingOrder !== right.standingOrder) return left.standingOrder - right.standingOrder;

  return placementSort(left.placement) - placementSort(right.placement);
}

function placementSort(placement: CompetitionStandingPlacement) {
  const order: Record<CompetitionStandingPlacement, number> = {
    CHAMPION: 1,
    RUNNER_UP: 2,
    THIRD_PLACE: 3,
    FOURTH_PLACE: 4,
    SEMI_FINALIST: 5
  };

  return order[placement];
}

function formatTeamHonorGroupText(standings: TeamHonorStandingOption[]) {
  const placementGroups = new Map<CompetitionStandingPlacement, string[]>();

  standings.forEach((standing) => {
    const edition = formatEditionShort(standing.edition);
    const current = placementGroups.get(standing.placement) ?? [];
    current.push(edition);
    placementGroups.set(standing.placement, current);
  });

  return [...placementGroups.entries()]
    .sort(([left], [right]) => placementSort(left) - placementSort(right))
    .map(([placement, editions]) => `${editions.join('、')} ${placementLabels[placement]}`)
    .join('；');
}

function uniqueMeta(values: Array<string | number | null | undefined>) {
  return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))];
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

watch(
  () => honorForm.careerId,
  () => {
    if (initializingHonorForm.value) return;

    selectedCompetitionId.value = '';
    honorForm.standingIds = [];

    if (honorDialogVisible.value) {
      void loadStandingOptionsForCareer();
    }
  }
);

watch(selectedCompetitionId, (competitionId) => {
  if (initializingHonorForm.value) return;

  if (!competitionId) {
    honorForm.standingIds = [];
    return;
  }

  honorForm.standingIds = honorForm.standingIds.filter((standingId) =>
    standingOptions.value.some(
      (standing) =>
        standing.id === standingId &&
        standing.edition.competition.id === selectedCompetitionId.value
    )
  );
});

onMounted(() => {
  void optionStore.ensureClubs();
  void optionStore.ensureCompetitions();
  void optionStore.ensureCountries();
  void loadPlayer();
  void loadTeamHonors();
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
            <el-button :disabled="savingCareers" @click="openCareerDialog('CLUB')">
              <IconFont name="add" />
              新增俱乐部经历
            </el-button>
            <el-button :disabled="savingCareers" @click="openCareerDialog('COUNTRY')">
              <IconFont name="add" />
              新增国家队经历
            </el-button>
          </div>
        </div>

        <NoDataView v-if="!careerForms.length" text="暂无结构化经历。" />

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
            <template #default="{ row }">
              <EntityLink
                :id="careerEntityId(row)"
                :type="careerEntityType(row)"
                :name="formatCareerTeam(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="年份" width="120" align="center">
            <template #default="{ row }">{{ formatCareerPeriod(row) }}</template>
          </el-table-column>
          <el-table-column label="位置" width="100" align="center">
            <template #default="{ row }">
              <PositionTags :value="row.position" />
            </template>
          </el-table-column>
          <el-table-column label="场次" width="80" align="center">
            <template #default="{ row }">{{ formatCareerStat(row.appearances) }}</template>
          </el-table-column>
          <el-table-column v-if="!isGoalkeeperPlayer" label="进球" width="80" align="center">
            <template #default="{ row }">{{ formatCareerStat(row.goals) }}</template>
          </el-table-column>
          <el-table-column v-if="!isGoalkeeperPlayer" label="助攻" width="80" align="center">
            <template #default="{ row }">{{ formatCareerStat(row.assists) }}</template>
          </el-table-column>
          <el-table-column v-if="isGoalkeeperPlayer" label="零封" width="80" align="center">
            <template #default="{ row }">{{ formatCareerStat(row.cleanSheets) }}</template>
          </el-table-column>
          <el-table-column v-if="isGoalkeeperPlayer" label="失球" width="80" align="center">
            <template #default="{ row }">{{ formatCareerStat(row.goalsConceded) }}</template>
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
              <el-button
                link
                type="primary"
                :disabled="savingCareers"
                @click="openCareerDialog('CLUB', $index)"
              >
                <IconFont name="edit" />
                编辑
              </el-button>
              <el-button link type="danger" :disabled="savingCareers" @click="removeCareer($index)">
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
        <el-table v-loading="teamHonorsLoading" :data="teamHonorGroups" border>
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column label="类型" width="90" align="center">
            <template #default="{ row }">
              <SemanticTag :variant="row.teamType === 'club' ? 'object-club' : 'object-country'">
                {{ formatTeamHonorType(row.teamType) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="球队 / 国家队" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <EntityLink :id="row.teamId" :type="row.teamType" :name="row.teamName" />
            </template>
          </el-table-column>
          <el-table-column label="赛事" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              <EntityLink :id="row.competitionId" type="competition" :name="row.competitionName" />
            </template>
          </el-table-column>
          <el-table-column prop="honorText" label="荣誉" min-width="300" show-overflow-tooltip />
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
        <el-button :disabled="savingCareers" @click="careerDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingCareers" @click="saveCareerDialog">
          保存
        </el-button>
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
        <el-form-item label="关联经历" class="resume-form-wide">
          <el-select v-model="honorForm.careerId" clearable placeholder="请选择关联经历">
            <el-option
              v-for="career in careerOptions"
              :key="career.value"
              :label="career.label"
              :value="career.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联赛事" class="resume-form-wide">
          <BaseOptionSelect
            v-model="selectedCompetitionId"
            :options="relatedCompetitionOptions"
            :loading="standingSearching"
            :disabled="!honorForm.careerId"
            placeholder="先选择经历，再选择该球队相关赛事"
          />
        </el-form-item>
        <el-form-item label="赛事届次名次" class="resume-form-wide">
          <BaseOptionSelect
            v-model="honorForm.standingIds"
            :options="standingChoiceOptions"
            multiple
            :max-collapse-tags="4"
            :loading="standingSearching"
            :disabled="!selectedCompetitionId"
            placeholder="选择年份或名次，支持搜索 1959"
          />
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

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createPlayerTeamHonor,
  deletePlayerAwardRecipient,
  deletePlayerTeamHonor,
  fetchPlayerDetail,
  fetchPlayerTeamHonors,
  fetchTeamHonorStandingOptions,
  savePlayerAwardRecipientGroup,
  savePlayerCareers,
  updatePlayerTeamHonor
} from '@/services/modules/catalog';
import { fetchAwardDetail } from '@/services/modules/awards';
import type {
  AwardDetail,
  AwardListItem,
  AwardRecipientRecord,
  AwardScopeType
} from '@/services/types/awards';
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
import { ClubSelect, CountrySelect, PositionSelect } from '@/components/selects';
import BaseOptionSelect from '@/components/selects/BaseOptionSelect.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { useRouteTabsStore } from '@/stores/route-tabs';
import { useOptionStore } from '@/stores/options';
import type { SelectOption } from '@/stores/options';
import {
  getCompetitionCategoryVariant,
  getCompetitionLevelVariant,
  getConfederationVariant,
  getLifecycleStatusLabel,
  getLifecycleStatusVariant,
  type SemanticTagVariant
} from '@/utils/tag-theme';

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
  competition: TeamHonorStandingOption['edition']['competition'];
  standings: TeamHonorStandingOption[];
  honors: PlayerTeamHonor[];
  standingIds: string[];
  honorText: string;
  sourceType: PlayerTeamHonorSourceType;
  status: PlayerTeamHonorStatus;
  remark: string;
}

interface AwardRecipientGroup {
  id: string;
  award: AwardListItem;
  recipients: AwardRecipientRecord[];
  editionIds: string[];
  honorText: string;
  remark: string;
}

interface AwardEditionRecipientForm {
  editionId: string;
  rank?: number;
  placement: string;
  externalUrl: string;
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
const competitionTargetOrder: Record<CompetitionTargetType, number> = {
  CLUB: 10,
  COUNTRY: 20
};
const competitionScopeOrder: Record<string, number> = {
  GLOBAL: 10,
  CONFEDERATION: 20,
  COUNTRY: 30,
  CUSTOM: 40
};
const competitionCategoryOrder: Record<string, number> = {
  国际: 10,
  洲际: 20,
  国内: 30,
  其他: 40
};
const competitionLevelOrder: Record<string, number> = {
  一级: 10,
  二级: 20,
  三级: 30,
  四级: 40
};
const competitionFormatOrder: Record<string, number> = {
  联赛: 10,
  杯赛: 20,
  其他: 30
};
const competitionLifecycleOrder: Record<string, number> = {
  CURRENT: 10,
  DISCONTINUED: 20
};
const awardScopeOptions: Array<{ label: string; value: AwardScopeType }> = [
  { label: '全球', value: 'WORLD' },
  { label: '洲际', value: 'CONFEDERATION' },
  { label: '国家', value: 'COUNTRY' },
  { label: '联赛', value: 'LEAGUE' },
  { label: '俱乐部', value: 'CLUB' },
  { label: '媒体', value: 'MEDIA' }
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
const editingAwardGroup = ref<AwardRecipientGroup | null>(null);
const awardMode = ref<'EVENT' | 'ANNUAL'>('EVENT');
const selectedAwardCompetitionId = ref('');
const selectedAwardScopeType = ref<AwardScopeType | ''>('');
const selectedAwardConfederationId = ref('');
const selectedAwardCountryId = ref('');
const selectedAwardId = ref('');
const awardEditions = ref<AwardDetail['editions']>([]);
const initializingAwardForm = ref(false);
const honorDialogVisible = ref(false);
const editingTeamHonorGroup = ref<TeamHonorGroup | null>(null);
const standingOptions = ref<TeamHonorStandingOption[]>([]);
const selectedCompetitionId = ref('');
const initializingHonorForm = ref(false);
const standingRequestId = ref(0);

const awardForm = reactive({
  editionIds: [] as string[],
  recipients: {} as Record<string, AwardEditionRecipientForm>
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
const eventAwardCompetitionOptions = computed<SelectOption[]>(() =>
  optionStore.competitionOptions.filter((competition) =>
    optionStore.awards.some(
      (award) => award.targetType === 'PLAYER' && award.competitionId === competition.id
    )
  )
);
const filteredAwardOptions = computed<SelectOption[]>(() =>
  optionStore.awardOptions.filter((option) => {
    const award = optionStore.awards.find((item) => item.id === option.id);

    if (!award || award.targetType !== 'PLAYER') {
      return false;
    }

    if (awardMode.value === 'EVENT') {
      return (
        Boolean(selectedAwardCompetitionId.value) &&
        award.competitionId === selectedAwardCompetitionId.value
      );
    }

    if (award.competitionId) {
      return false;
    }

    if (selectedAwardScopeType.value && award.scopeType !== selectedAwardScopeType.value) {
      return false;
    }

    if (
      selectedAwardScopeType.value === 'CONFEDERATION' &&
      selectedAwardConfederationId.value &&
      award.confederationId !== selectedAwardConfederationId.value
    ) {
      return false;
    }

    if (
      selectedAwardScopeType.value === 'COUNTRY' &&
      selectedAwardCountryId.value &&
      award.countryId !== selectedAwardCountryId.value
    ) {
      return false;
    }

    return true;
  })
);
const awardEditionOptions = computed<SelectOption[]>(() =>
  awardEditions.value.map((edition) => ({
    id: edition.id,
    value: edition.id,
    label: formatAwardEditionOption(edition),
    description: edition.competitionEdition?.competition?.name ?? undefined,
    meta: uniqueMeta([
      edition.season,
      edition.name,
      edition.year ? String(edition.year) : '',
      edition.competitionEdition?.competition?.name
    ])
  }))
);
const selectedAwardRecipientForms = computed(() =>
  awardForm.editionIds
    .map((editionId) => awardForm.recipients[editionId])
    .filter((item): item is AwardEditionRecipientForm => Boolean(item))
);
const personalHonorGroups = computed<AwardRecipientGroup[]>(() => {
  const groups = new Map<string, AwardRecipientGroup>();

  (player.value?.personalHonors ?? []).forEach((recipient) => {
    const award = recipient.edition.award;
    const group =
      groups.get(award.id) ??
      ({
        id: award.id,
        award,
        recipients: [],
        editionIds: [],
        honorText: '',
        remark: ''
      } satisfies AwardRecipientGroup);

    group.recipients.push(recipient);
    group.editionIds.push(recipient.editionId);
    groups.set(award.id, group);
  });

  return [...groups.values()]
    .map((group) => {
      const recipients = sortAwardRecipients(group.recipients);

      return {
        ...group,
        recipients,
        editionIds: recipients.map((recipient) => recipient.editionId),
        honorText: formatAwardGroupText(recipients),
        remark: formatAwardGroupRemark(recipients)
      };
    })
    .sort((left, right) => {
      if (left.award.sortOrder !== right.award.sortOrder) {
        return left.award.sortOrder - right.award.sortOrder;
      }

      return left.award.name.localeCompare(right.award.name, 'zh-Hans-CN');
    });
});
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
        competition,
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

      if (leftTypeSort !== rightTypeSort) return leftTypeSort - rightTypeSort;
      const competitionOrder = compareCompetitionOrder(left.competition, right.competition);
      if (competitionOrder !== 0) return competitionOrder;
      if (left.teamName !== right.teamName) return left.teamName.localeCompare(right.teamName);

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

function openAwardDialog(group?: AwardRecipientGroup) {
  initializingAwardForm.value = true;
  editingAwardGroup.value = group ?? null;
  const award = group?.award;

  awardMode.value = award?.competitionId ? 'EVENT' : 'ANNUAL';
  selectedAwardCompetitionId.value = award?.competitionId ?? '';
  selectedAwardScopeType.value = award?.competitionId ? '' : (award?.scopeType ?? '');
  selectedAwardConfederationId.value = award?.confederationId ?? '';
  selectedAwardCountryId.value = award?.countryId ?? '';
  selectedAwardId.value = award?.id ?? '';
  awardForm.editionIds = group?.editionIds ? [...group.editionIds] : [];
  awardForm.recipients = {};

  group?.recipients.forEach((recipient) => {
    awardForm.recipients[recipient.editionId] = {
      editionId: recipient.editionId,
      rank: recipient.rank ?? undefined,
      placement: recipient.placement ?? '',
      externalUrl: recipient.externalUrl ?? '',
      remark: recipient.remark ?? ''
    };
  });
  awardDialogVisible.value = true;

  if (selectedAwardId.value) {
    void loadAwardEditions(selectedAwardId.value);
  }

  void nextTick(() => {
    initializingAwardForm.value = false;
  });
}

async function loadAwardEditions(awardId: string) {
  if (!awardId) {
    awardEditions.value = [];
    awardForm.editionIds = [];
    awardForm.recipients = {};
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
  if (!selectedAwardId.value) {
    ElMessage.warning('请选择奖项。');
    return;
  }

  if (!awardForm.editionIds.length) {
    ElMessage.warning('请选择奖项年份。');
    return;
  }

  awardSaving.value = true;

  try {
    await savePlayerAwardRecipientGroup(playerId.value, {
      awardId: selectedAwardId.value,
      recipients: selectedAwardRecipientForms.value.map((recipient) => ({
        editionId: recipient.editionId,
        rank: recipient.rank ?? null,
        placement: recipient.placement.trim() || undefined,
        externalUrl: recipient.externalUrl.trim() || undefined,
        remark: recipient.remark.trim() || undefined
      }))
    });

    awardDialogVisible.value = false;
    await loadPlayer();
    ElMessage.success('个人奖项已保存。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '个人奖项保存失败。');
  } finally {
    awardSaving.value = false;
  }
}

async function confirmDeleteAwardRecipient(group: AwardRecipientGroup) {
  try {
    await ElMessageBox.confirm(
      `确定删除「${group.award.name}」这一组个人奖项吗？`,
      '删除个人奖项',
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
    await Promise.all(
      group.recipients.map((recipient) => deletePlayerAwardRecipient(playerId.value, recipient.id))
    );
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

function formatTeamHonorCompetitionSubtitle(row: TeamHonorGroup) {
  return row.competition.code || '-';
}

function getTeamHonorTypeVariant(type: TeamHonorGroup['teamType']): SemanticTagVariant {
  return type === 'club' ? 'object-club' : 'object-country';
}

function getAwardScopeLabel(award: AwardListItem) {
  if (award.scopeType === 'CONFEDERATION') {
    return award.confederation?.name ?? '足联';
  }

  if (award.scopeType === 'COUNTRY') {
    return award.country?.name ?? '国家';
  }

  return awardScopeOptions.find((item) => item.value === award.scopeType)?.label ?? award.scopeType;
}

function getAwardScopeVariant(award: AwardListItem): SemanticTagVariant {
  if (award.scopeType === 'CONFEDERATION') {
    return getConfederationVariant(getAwardScopeLabel(award));
  }

  if (award.scopeType === 'COUNTRY') return 'object-country';
  if (award.scopeType === 'CLUB') return 'object-club';
  if (award.scopeType === 'LEAGUE') return 'object-competition';
  if (award.scopeType === 'MEDIA') return 'object-award';

  return 'neutral';
}

function formatOptionalText(value?: string | number | boolean | null) {
  return value === undefined || value === null || value === '' ? '-' : String(value);
}

function formatCompetitionEnabled(enabled?: boolean) {
  if (enabled === true) return '启用';
  if (enabled === false) return '停用';

  return '-';
}

function getCompetitionEnabledVariant(enabled?: boolean): SemanticTagVariant {
  if (enabled === true) return 'status-enabled';
  if (enabled === false) return 'status-disabled';

  return 'neutral';
}

function compareCompetitionOrder(
  left: TeamHonorStandingOption['edition']['competition'],
  right: TeamHonorStandingOption['edition']['competition']
) {
  const leftManagedIndex = optionStore.competitions.findIndex((item) => item.id === left.id);
  const rightManagedIndex = optionStore.competitions.findIndex((item) => item.id === right.id);

  if (leftManagedIndex >= 0 && rightManagedIndex >= 0 && leftManagedIndex !== rightManagedIndex) {
    return leftManagedIndex - rightManagedIndex;
  }

  return (
    rank(competitionTargetOrder, left.targetType) -
      rank(competitionTargetOrder, right.targetType) ||
    rank(competitionScopeOrder, left.scopeType) - rank(competitionScopeOrder, right.scopeType) ||
    rank(competitionCategoryOrder, left.category) -
      rank(competitionCategoryOrder, right.category) ||
    rank(competitionLevelOrder, left.level) - rank(competitionLevelOrder, right.level) ||
    rank(competitionFormatOrder, left.format) - rank(competitionFormatOrder, right.format) ||
    rank(competitionLifecycleOrder, left.lifecycleStatus) -
      rank(competitionLifecycleOrder, right.lifecycleStatus) ||
    (left.sortOrder ?? 0) - (right.sortOrder ?? 0) ||
    left.name.localeCompare(right.name, 'zh-Hans-CN')
  );
}

function rank(order: Record<string, number>, value?: string | null) {
  return value ? (order[value] ?? 9999) : 9999;
}

function formatCareerTeam(career: CareerForm) {
  const source =
    career.careerType === 'CLUB'
      ? optionStore.clubs.find((club) => club.id === career.clubId)
      : optionStore.countries.find((country) => country.id === career.countryId);

  return source?.name ?? '-';
}

function formatCareerTeamSubtitle(career: CareerForm) {
  const source =
    career.careerType === 'CLUB'
      ? optionStore.clubs.find((club) => club.id === career.clubId)
      : optionStore.countries.find((country) => country.id === career.countryId);

  return source?.uid ? `UID ${source.uid}` : undefined;
}

function careerEntityType(career: CareerForm) {
  return career.careerType === 'CLUB' ? 'club' : 'country';
}

function careerEntityId(career: CareerForm) {
  return career.careerType === 'CLUB' ? career.clubId : career.countryId;
}

function teamHonorEntitySubtitle(row: TeamHonorGroup) {
  const firstStanding = row.standings[0];
  const uid = row.teamType === 'club' ? firstStanding?.club?.uid : firstStanding?.country?.uid;

  return uid ? `UID ${uid}` : undefined;
}

function formatCareerStat(value?: number) {
  return value === undefined || value === null ? '-' : value;
}

function isGoalkeeperPosition(position?: string | null) {
  const normalized = (position ?? '').trim().toUpperCase();
  return normalized === 'GK' || normalized.includes('门将') || normalized.includes('守门');
}

function formatAwardPlacement(row: AwardRecipientRecord) {
  return row.placement || (row.rank ? `第 ${row.rank} 名` : '-');
}

function sortAwardRecipients(recipients: AwardRecipientRecord[]) {
  return [...recipients].sort((left, right) => {
    const leftYear = left.edition.year ?? 0;
    const rightYear = right.edition.year ?? 0;

    if (leftYear !== rightYear) return leftYear - rightYear;

    return formatEditionShort(left.edition).localeCompare(
      formatEditionShort(right.edition),
      'zh-Hans-CN'
    );
  });
}

function formatAwardGroupText(recipients: AwardRecipientRecord[]) {
  return sortAwardRecipients(recipients)
    .map(
      (recipient) => `${formatEditionShort(recipient.edition)} ${formatAwardPlacement(recipient)}`
    )
    .join('、');
}

function formatAwardGroupRemark(recipients: AwardRecipientRecord[]) {
  return uniqueMeta(recipients.map((recipient) => recipient.remark)).join('；');
}

function formatAwardEditionOption(edition: AwardDetail['editions'][number]) {
  const editionLabel = formatEditionShort(edition);
  const competitionLabel = edition.competitionEdition?.competition?.name;

  return [editionLabel, competitionLabel].filter(Boolean).join(' / ');
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
  if (status === 'PENDING') return 'neutral';
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

watch(awardMode, () => {
  if (initializingAwardForm.value) return;

  selectedAwardId.value = '';
  selectedAwardCompetitionId.value = '';
  selectedAwardScopeType.value = '';
  selectedAwardConfederationId.value = '';
  selectedAwardCountryId.value = '';
});

watch(selectedAwardCompetitionId, () => {
  if (initializingAwardForm.value) return;

  if (awardMode.value === 'EVENT') {
    selectedAwardId.value = '';
  }
});

watch(selectedAwardScopeType, () => {
  if (initializingAwardForm.value) return;

  if (awardMode.value === 'ANNUAL') {
    selectedAwardId.value = '';
    selectedAwardConfederationId.value = '';
    selectedAwardCountryId.value = '';
  }
});

watch([selectedAwardConfederationId, selectedAwardCountryId], () => {
  if (initializingAwardForm.value) return;

  if (awardMode.value === 'ANNUAL') {
    selectedAwardId.value = '';
  }
});

watch(
  () => [...awardForm.editionIds],
  (editionIds) => {
    editionIds.forEach((editionId) => {
      if (!awardForm.recipients[editionId]) {
        awardForm.recipients[editionId] = {
          editionId,
          rank: undefined,
          placement: '',
          externalUrl: '',
          remark: ''
        };
      }
    });
  }
);

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
  void optionStore.ensureAwards();
  void optionStore.ensureClubs();
  void optionStore.ensureConfederations();
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
          <el-table-column label="球队" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <EntityNameCell
                :id="careerEntityId(row)"
                :type="careerEntityType(row)"
                :title="formatCareerTeam(row)"
                :subtitle="formatCareerTeamSubtitle(row)"
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
        <el-table :data="personalHonorGroups" border>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="范围" width="110" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getAwardScopeVariant(row.award)">
                {{ getAwardScopeLabel(row.award) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="奖项" min-width="220">
            <template #default="{ row }">
              <EntityNameCell
                :id="row.award.id"
                type="award"
                :title="row.award.name"
                :subtitle="row.award.code"
              />
            </template>
          </el-table-column>
          <el-table-column label="规则分类" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ formatOptionalText(row.award.category) }}</template>
          </el-table-column>
          <el-table-column label="奖项类型" width="110" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getCompetitionLevelVariant(row.award.level)">
                {{ formatOptionalText(row.award.level) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="奖项状态" width="96" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getLifecycleStatusVariant(row.award.lifecycleStatus)">
                {{ getLifecycleStatusLabel(row.award.lifecycleStatus) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column prop="honorText" label="荣誉" min-width="300" show-overflow-tooltip />
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
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="对象" width="90" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getTeamHonorTypeVariant(row.teamType)">
                {{ formatTeamHonorType(row.teamType) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="赛事" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              <EntityNameCell
                :id="row.competitionId"
                type="competition"
                :title="row.competitionName"
                :subtitle="formatTeamHonorCompetitionSubtitle(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="球队" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <EntityNameCell
                :id="row.teamId"
                :type="row.teamType"
                :title="row.teamName"
                :subtitle="teamHonorEntitySubtitle(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="分类" width="90" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getCompetitionCategoryVariant(row.competition.category)">
                {{ formatOptionalText(row.competition.category) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="级别" width="90" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getCompetitionLevelVariant(row.competition.level)">
                {{ formatOptionalText(row.competition.level) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getCompetitionEnabledVariant(row.competition.enabled)">
                {{ formatCompetitionEnabled(row.competition.enabled) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column label="赛事状态" width="96" align="center" header-align="center">
            <template #default="{ row }">
              <SemanticTag :variant="getLifecycleStatusVariant(row.competition.lifecycleStatus)">
                {{ getLifecycleStatusLabel(row.competition.lifecycleStatus) }}
              </SemanticTag>
            </template>
          </el-table-column>
          <el-table-column prop="honorText" label="荣誉" min-width="300" show-overflow-tooltip />
          <el-table-column label="确认状态" width="100" align="center">
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

    <el-dialog v-model="awardDialogVisible" title="维护个人奖项" width="820px" destroy-on-close>
      <el-form class="resume-form-grid" label-position="top">
        <el-form-item label="奖项类型" class="resume-form-wide">
          <el-segmented
            v-model="awardMode"
            :options="[
              { label: '赛事奖项', value: 'EVENT' },
              { label: '年度奖项', value: 'ANNUAL' }
            ]"
          />
        </el-form-item>
        <el-form-item v-if="awardMode === 'EVENT'" label="关联赛事">
          <BaseOptionSelect
            v-model="selectedAwardCompetitionId"
            :options="eventAwardCompetitionOptions"
            :loading="optionStore.loading.competitions || optionStore.loading.awards"
            placeholder="请选择赛事"
          />
        </el-form-item>
        <el-form-item v-if="awardMode === 'EVENT'" label="奖项">
          <BaseOptionSelect
            v-model="selectedAwardId"
            :options="filteredAwardOptions"
            :loading="optionStore.loading.awards"
            placeholder="请选择奖项"
          />
        </el-form-item>
        <template v-else>
          <el-form-item label="范围">
            <el-select v-model="selectedAwardScopeType" clearable placeholder="请选择范围">
              <el-option
                v-for="option in awardScopeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="selectedAwardScopeType === 'CONFEDERATION'" label="足联">
            <BaseOptionSelect
              v-model="selectedAwardConfederationId"
              :options="optionStore.confederationOptions"
              :loading="optionStore.loading.confederations"
              placeholder="请选择足联"
            />
          </el-form-item>
          <el-form-item v-if="selectedAwardScopeType === 'COUNTRY'" label="国家">
            <CountrySelect v-model="selectedAwardCountryId" placeholder="请选择国家" />
          </el-form-item>
          <el-form-item label="奖项" class="resume-form-wide">
            <BaseOptionSelect
              v-model="selectedAwardId"
              :options="filteredAwardOptions"
              :loading="optionStore.loading.awards"
              placeholder="请选择奖项"
            />
          </el-form-item>
        </template>
        <el-form-item label="奖项届次" class="resume-form-wide">
          <BaseOptionSelect
            v-model="awardForm.editionIds"
            :options="awardEditionOptions"
            multiple
            :max-collapse-tags="4"
            :disabled="!selectedAwardId"
            placeholder="请选择年份或赛季，支持搜索 1973"
          />
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

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  fetchTeamHonorRuleSummaries,
  fetchHonorRules,
  recalculateHonorScores,
  updateHonorRule
} from '@/services/modules/honor-rules';
import type {
  HonorRuleItem,
  HonorRulePayload,
  TeamHonorRuleSummaryItem
} from '@/services/types/honor-rules';
import {
  fetchAwardRules,
  recalculateAwardScores,
  updateAwardRule
} from '@/services/modules/award-rules';
import type { AwardRuleItem, AwardRulePayload } from '@/services/types/award-rules';
import type { AwardScopeType, AwardTargetType } from '@/services/types/awards';
import type { CompetitionTargetType } from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import AwardRuleDialog from './components/AwardRuleDialog.vue';
import AwardRuleListPanel from './components/AwardRuleListPanel.vue';
import HonorRuleDialog from './components/HonorRuleDialog.vue';
import HonorRuleListPanel from './components/HonorRuleListPanel.vue';

const targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }> = [
  { label: '国家队', value: 'COUNTRY' },
  { label: '俱乐部', value: 'CLUB' }
];
const enabledOptions = [
  { label: '启用', value: 'true' },
  { label: '停用', value: 'false' }
];
const awardScopeOptions: Array<{ label: string; value: AwardScopeType }> = [
  { label: '世界', value: 'WORLD' },
  { label: '洲际', value: 'CONFEDERATION' },
  { label: '国家', value: 'COUNTRY' },
  { label: '联赛', value: 'LEAGUE' },
  { label: '俱乐部', value: 'CLUB' },
  { label: '媒体', value: 'MEDIA' }
];
const targetTypeLabels = Object.fromEntries(
  targetTypeOptions.map((item) => [item.value, item.label])
) as Record<CompetitionTargetType, string>;
const awardScopeLabels = Object.fromEntries(
  awardScopeOptions.map((item) => [item.value, item.label])
) as Record<AwardScopeType, string>;
const teamTargetTypeLabels: Record<Extract<AwardTargetType, 'COUNTRY' | 'CLUB'>, string> = {
  COUNTRY: '国家队',
  CLUB: '俱乐部'
};
const defaultAwardCategoryScores: Record<string, string> = {
  国际一级综合奖: '6.00 / 3.00 / 1.80',
  国际二级阵容奖: '6.00',
  国际二级门将专项奖: '6.00 / 3.00 / 1.80',
  国际三级补充奖: '3.00 / 1.50 / 0.90',
  世界杯一级综合奖: '6.00 / 3.00 / 1.80',
  世界杯二级阵容奖: '6.00',
  世界杯二级专项奖: '6.00 / 3.00 / 1.80',
  世界杯二级门将专项奖: '6.00 / 3.00 / 1.80',
  世界杯三级补充奖: '3.00 / 1.50 / 0.90',
  洲际杯一级综合奖: '5.00 / 2.50 / 1.50',
  洲际杯二级阵容奖: '5.00',
  洲际杯二级专项奖: '5.00 / 2.50 / 1.50',
  洲际杯三级补充奖: '2.50 / 1.25 / 0.75',
  俱乐部国际赛事一级综合奖: '4.00 / 2.00 / 1.20',
  俱乐部国际赛事二级阵容奖: '4.00',
  俱乐部国际赛事二级专项奖: '4.00 / 2.00 / 1.20',
  俱乐部国际赛事三级专项奖: '2.00 / 1.00 / 0.60',
  俱乐部国际赛事三级补充奖: '2.00 / 1.00 / 0.60',
  洲际一级综合奖: '4.00 / 2.00 / 1.20',
  洲际二级阵容奖: '4.00',
  洲际二级门将专项奖: '4.00 / 2.00 / 1.20',
  洲际三级补充奖: '2.00 / 1.00 / 0.60',
  洲联一级综合奖: '4.00 / 2.00 / 1.20',
  洲联二级阵容奖: '4.00',
  洲联二级专项奖: '4.00 / 2.00 / 1.20',
  洲联三级补充奖: '2.00 / 1.00 / 0.60',
  国联一级综合奖: '3.00 / 1.50 / 0.90',
  国联二级阵容奖: '2.00',
  国联二级专项奖: '2.00 / 1.00 / 0.60',
  国联三级补充奖: '1.00 / 0.50 / 0.30',
  国家一级综合奖: '2.00 / 1.00 / 0.60',
  二级国联一级综合奖: '1.00 / 0.50 / 0.30',
  二级国联二级阵容奖: '1.00',
  二级国联二级专项奖: '1.00 / 0.50 / 0.30',
  二级国联三级补充奖: '0.50 / 0.25 / 0.15',
  国杯一级奖: '1.00 / 0.50 / 0.30',
  附加分: '1.00'
};

const activeTab = ref<'competition' | 'player-award' | 'team-bonus'>('competition');
const loading = ref(false);
const submitting = ref(false);
const recalculating = ref(false);
const dialogVisible = ref(false);
const editingItem = ref<HonorRuleItem | null>(null);
const errorMessage = ref('');
const items = ref<HonorRuleItem[]>([]);
const total = ref(0);
const lastRecalculateSummary = ref('');
const teamRuleLoading = ref(false);
const teamRuleErrorMessage = ref('');
const teamRuleItems = ref<TeamHonorRuleSummaryItem[]>([]);

const filters = reactive({
  keyword: '',
  enabled: ''
});
const form = reactive<HonorRulePayload>({
  championScore: null,
  runnerUpScore: null,
  thirdPlaceScore: null,
  fourthPlaceScore: null,
  semiFinalistScore: null,
  typicalCompetitionIds: [],
  remark: null
});

const countryRules = computed(() => items.value.filter((item) => item.targetType === 'COUNTRY'));
const clubRules = computed(() => items.value.filter((item) => item.targetType === 'CLUB'));
const dialogTitle = computed(() =>
  editingItem.value ? `编辑荣誉规则：${editingItem.value.name}` : '编辑荣誉规则'
);

const awardLoading = ref(false);
const awardSubmitting = ref(false);
const awardRecalculating = ref(false);
const awardDialogVisible = ref(false);
const awardEditingItem = ref<AwardRuleItem | null>(null);
const awardErrorMessage = ref('');
const awardItems = ref<AwardRuleItem[]>([]);
const awardSummaryItems = ref<AwardRuleItem[]>([]);
const awardTotal = ref(0);
const lastAwardRecalculateSummary = ref('');
const awardFilters = reactive({
  page: 1,
  pageSize: 100,
  keyword: '',
  scopeType: '' as '' | AwardScopeType,
  enabled: ''
});
const awardForm = reactive<AwardRulePayload>({
  code: '',
  name: '',
  scopeType: null,
  category: '',
  placement: '',
  rank: null,
  baseScore: 0,
  coefficient: 1,
  topAward: false,
  enabled: true,
  sortOrder: 0,
  remark: ''
});
const hasAwardRows = computed(() => awardItems.value.length > 0);
const awardDialogTitle = computed(() =>
  awardEditingItem.value ? '编辑球员奖项规则' : '球员奖项规则'
);
const awardRuleSummaryGroups = computed(() => [
  {
    title: '世界与国家队大赛规则',
    description: '国际年度奖、世界杯和洲际杯按球员个人奖项最高层级展示。',
    rows: [
      summaryRow({
        name: '国际年度奖',
        scopeType: 'WORLD',
        overall: { category: '国际一级综合奖', typical: '金球奖 / 世界足球先生 / The Best' },
        lineup: { category: '国际二级阵容奖', typical: 'FIFPRO World 11 / FIFA 年度最佳阵容' },
        specialty: { category: '国际二级门将专项奖', typical: '雅辛奖 / FIFA 年度最佳门将' },
        supplement: { category: '国际三级补充奖', typical: '普斯卡什奖 / 金童奖' },
        topAward: '一级综合第一名',
        reduction: '门将专项 + 年度最佳阵容时，门将专项折半'
      }),
      summaryRow({
        name: '世界杯个人奖',
        scopeType: 'WORLD',
        overall: { category: '世界杯一级综合奖', typical: '金球奖 / 银球奖 / 铜球奖' },
        lineup: { category: '世界杯二级阵容奖', typical: '世界杯最佳阵容' },
        specialty: [
          { category: '世界杯二级专项奖', typical: '金靴奖 / 银靴奖 / 铜靴奖' },
          { category: '世界杯二级门将专项奖', typical: '金手套奖 / 雅辛奖' }
        ],
        supplement: { category: '世界杯三级补充奖', typical: '最佳年轻球员' },
        topAward: '不计入',
        reduction: '金靴 / 金手套 + 世界杯最佳阵容时，专项奖折半'
      }),
      summaryRow({
        name: '洲际杯个人奖',
        scopeType: 'CONFEDERATION',
        overall: { category: '洲际杯一级综合奖', typical: '赛事最佳球员 / 金球奖 / MVP' },
        lineup: { category: '洲际杯二级阵容奖', typical: '赛事最佳阵容 / 最佳十一人' },
        specialty: { category: '洲际杯二级专项奖', typical: '最佳射手 / 金靴 / 最佳门将' },
        supplement: { category: '洲际杯三级补充奖', typical: '最佳年轻球员 / 最佳进球' },
        topAward: '不计入',
        reduction: '最佳射手 / 最佳门将 + 赛事最佳阵容时，专项奖折半'
      })
    ]
  },
  {
    title: '洲际年度与俱乐部赛事规则',
    description: '洲际年度奖、全球俱乐部赛事和洲际俱乐部赛事按 4 / 2 梯度展示。',
    rows: [
      summaryRow({
        name: '俱乐部国际赛事',
        scopeType: 'CLUB',
        overall: { category: '俱乐部国际赛事一级综合奖', typical: '世俱杯金球奖 / 赛事最佳球员' },
        lineup: { category: '俱乐部国际赛事二级阵容奖', typical: '世俱杯最佳阵容' },
        specialty: { category: '俱乐部国际赛事二级专项奖', typical: '世俱杯金靴 / 最佳门将' },
        supplement: { category: '俱乐部国际赛事三级补充奖', typical: '最佳年轻球员 / 最佳进球' },
        topAward: '不计入',
        reduction: '专项奖 + 赛事最佳阵容时，专项奖折半'
      }),
      summaryRow({
        name: '洲际年度奖',
        scopeType: 'CONFEDERATION',
        overall: {
          category: '洲际一级综合奖',
          typical: '欧洲足球先生 / 亚洲足球先生 / 非洲足球先生'
        },
        lineup: { category: '洲际二级阵容奖', typical: '洲际年度最佳阵容' },
        specialty: { category: '洲际二级门将专项奖', typical: '洲际年度最佳门将' },
        supplement: { category: '洲际三级补充奖', typical: '最佳新人 / 年度最佳进球' },
        topAward: '不计入',
        reduction: '门将专项 + 洲际最佳阵容时，门将专项折半'
      }),
      summaryRow({
        name: '洲联个人奖',
        scopeType: 'CLUB',
        overall: { category: '洲联一级综合奖', typical: '欧冠赛季最佳球员 / 解放者杯最佳球员' },
        lineup: { category: '洲联二级阵容奖', typical: '欧冠最佳阵容 / 解放者杯最佳阵容' },
        specialty: { category: '洲联二级专项奖', typical: '最佳射手 / 最佳门将 / 位置最佳球员' },
        supplement: { category: '洲联三级补充奖', typical: '最佳年轻球员 / 赛事最佳进球' },
        topAward: '不计入',
        reduction: '专项奖 + 赛事最佳阵容时，专项奖折半'
      })
    ]
  },
  {
    title: '联赛、国内与补充规则',
    description: '国内联赛、二级联赛、国内杯赛和白名单补充奖按低权重展示。',
    rows: [
      summaryRow({
        name: '国联个人奖',
        scopeType: 'LEAGUE',
        overall: { category: '国联一级综合奖', typical: '联赛赛季最佳球员 / MVP' },
        lineup: { category: '国联二级阵容奖', typical: '联赛赛季最佳阵容' },
        specialty: { category: '国联二级专项奖', typical: '金靴 / 金手套 / 助攻王' },
        supplement: { category: '国联三级补充奖', typical: '最佳年轻球员 / 最佳新人' },
        topAward: '不计入',
        reduction: '金靴 / 金手套 / 助攻王 + 最佳阵容时，专项奖折半'
      }),
      summaryRow({
        name: '国家年度奖',
        scopeType: 'COUNTRY',
        overall: { category: '国家一级综合奖', typical: '国家足球先生 / 国家年度最佳球员' },
        topAward: '不计入',
        reduction: '暂无组合折减'
      }),
      summaryRow({
        name: '二级国联个人奖',
        scopeType: 'LEAGUE',
        overall: { category: '二级国联一级综合奖', typical: '二级联赛赛季最佳球员' },
        lineup: { category: '二级国联二级阵容奖', typical: '二级联赛赛季最佳阵容' },
        specialty: { category: '二级国联二级专项奖', typical: '二级联赛金靴 / 最佳门将' },
        supplement: { category: '二级国联三级补充奖', typical: '最佳年轻球员 / 最佳新人' },
        topAward: '不计入',
        reduction: '专项奖 + 最佳阵容时，专项奖折半'
      }),
      summaryRow({
        name: '国杯个人奖',
        scopeType: 'CLUB',
        overall: { category: '国杯一级奖', typical: '杯赛最佳球员 / 杯赛最佳射手' },
        topAward: '不计入',
        reduction: '只收杯赛最佳球员 / 最佳射手'
      }),
      summaryRow({
        name: '附加分',
        scopeType: 'MEDIA',
        overall: { category: '附加分', typical: '白名单权威补充奖' },
        topAward: '不计入',
        reduction: '仅白名单权威补充奖'
      })
    ]
  }
]);

interface AwardSummaryRowOptions {
  name: string;
  scopeType: AwardScopeType;
  overall?: AwardSummaryScoreSource;
  lineup?: AwardSummaryScoreSource;
  specialty?: AwardSummaryScoreSource;
  supplement?: AwardSummaryScoreSource;
  topAward: string;
  reduction: string;
}

interface AwardSummaryScoreItem {
  category: string;
  typical: string;
}

type AwardSummaryScoreSource = AwardSummaryScoreItem | AwardSummaryScoreItem[];

function summaryRow(options: AwardSummaryRowOptions) {
  const overall = formatSummaryScore(options.overall);
  const lineup = formatSummaryScore(options.lineup);
  const specialty = formatSummaryScore(options.specialty);
  const supplement = formatSummaryScore(options.supplement);

  return {
    name: options.name,
    scopeType: options.scopeType,
    overallTypical: overall.typical,
    overallScore: overall.score,
    lineupTypical: lineup.typical,
    lineupScore: lineup.score,
    specialtyTypical: specialty.typical,
    specialtyScore: specialty.score,
    supplementTypical: supplement.typical,
    supplementScore: supplement.score,
    topAward: options.topAward,
    reduction: options.reduction
  };
}

function formatSummaryScore(source?: AwardSummaryScoreSource) {
  if (!source) {
    return { typical: '-', score: '-' };
  }

  const items = Array.isArray(source) ? source : [source];

  return {
    typical: items.map((item) => item.typical).join('；'),
    score: items.map((item) => formatCategoryScore(item.category)).join('；')
  };
}

function formatCategoryScore(categoryName: string) {
  const categoryRules = awardSummaryItems.value.filter((rule) => rule.category === categoryName);

  if (!categoryRules.length) {
    return defaultAwardCategoryScores[categoryName] ?? '-';
  }

  const rankedRules = [1, 2, 3]
    .map((rank) => categoryRules.find((rule) => rule.rank === rank))
    .filter(Boolean) as AwardRuleItem[];

  if (rankedRules.length > 1) {
    return rankedRules.map((rule) => formatAwardRuleScore(rule)).join(' / ');
  }

  const selectedRule =
    categoryRules.find((rule) => rule.rank === null || rule.rank === undefined) ??
    rankedRules[0] ??
    categoryRules[0];

  return formatAwardRuleScore(selectedRule);
}

async function loadRules() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchHonorRules({
      page: 1,
      pageSize: 100,
      keyword: filters.keyword || undefined,
      enabled: filters.enabled || undefined
    });
    items.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '荣誉规则加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  void loadRules();
}

function resetFilters() {
  filters.keyword = '';
  filters.enabled = '';
  void loadRules();
}

function resetForm() {
  form.championScore = null;
  form.runnerUpScore = null;
  form.thirdPlaceScore = null;
  form.fourthPlaceScore = null;
  form.semiFinalistScore = null;
  form.typicalCompetitionIds = [];
  form.remark = null;
}

function openEditDialog(row: HonorRuleItem) {
  editingItem.value = row;
  form.championScore = row.championScore ?? null;
  form.runnerUpScore = row.runnerUpScore ?? null;
  form.thirdPlaceScore = row.thirdPlaceScore ?? null;
  form.fourthPlaceScore = row.fourthPlaceScore ?? null;
  form.semiFinalistScore = row.semiFinalistScore ?? null;
  form.typicalCompetitionIds = (row.typicalCompetitions ?? []).map((item) => item.competition.id);
  form.remark = row.remark ?? null;
  dialogVisible.value = true;
}

function validateNullableScore(value: unknown, label: string) {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (!Number.isFinite(Number(value)) || Number(value) < 0) {
    ElMessage.warning(`${label}必须是不小于 0 的数字。`);
    return false;
  }

  return true;
}

function validateForm() {
  return (
    validateNullableScore(form.championScore, '冠军分') &&
    validateNullableScore(form.runnerUpScore, '亚军分') &&
    validateNullableScore(form.thirdPlaceScore, '季军分') &&
    validateNullableScore(form.fourthPlaceScore, '殿军分') &&
    validateNullableScore(form.semiFinalistScore, '四强分')
  );
}

function normalizeNullableNumber(value: number | null | undefined) {
  return value === null || value === undefined ? null : Number(value);
}

function buildPayload(): HonorRulePayload {
  return {
    championScore: normalizeNullableNumber(form.championScore),
    runnerUpScore: normalizeNullableNumber(form.runnerUpScore),
    thirdPlaceScore: normalizeNullableNumber(form.thirdPlaceScore),
    fourthPlaceScore: normalizeNullableNumber(form.fourthPlaceScore),
    semiFinalistScore: normalizeNullableNumber(form.semiFinalistScore),
    typicalCompetitionIds: form.typicalCompetitionIds ?? [],
    remark: form.remark?.trim() || null
  };
}

async function saveRule() {
  if (!editingItem.value || !validateForm()) {
    return;
  }

  submitting.value = true;

  try {
    await updateHonorRule(editingItem.value.id, buildPayload());
    ElMessage.success('荣誉规则已更新。');
    dialogVisible.value = false;
    resetForm();
    await loadRules();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存荣誉规则失败。');
  } finally {
    submitting.value = false;
  }
}

async function recalculateScores() {
  try {
    await ElMessageBox.confirm(
      '将根据当前系统规则重新计算国家和俱乐部荣誉分，并写回概览统计字段。是否继续？',
      '重新计算荣誉分',
      {
        confirmButtonText: '开始重算',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
  } catch {
    return;
  }

  recalculating.value = true;

  try {
    const result = await recalculateHonorScores();
    lastRecalculateSummary.value = `已处理 ${result.countryCount} 个国家、${result.clubCount} 个俱乐部、${result.standingCount} 条名次记录，启用规则 ${result.enabledRuleCount} 条。`;
    ElMessage.success('荣誉分重算完成。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '荣誉分重算失败。');
  } finally {
    recalculating.value = false;
  }
}

function getTargetTypeLabel(value: CompetitionTargetType) {
  return targetTypeLabels[value] ?? value;
}

function getAwardScopeLabel(value?: AwardScopeType | null) {
  return value ? (awardScopeLabels[value] ?? value) : '全部范围';
}

function getTeamTargetTypeLabel(values: AwardTargetType[]) {
  const labels = values
    .filter((value): value is Extract<AwardTargetType, 'COUNTRY' | 'CLUB'> =>
      ['COUNTRY', 'CLUB'].includes(value)
    )
    .map((value) => teamTargetTypeLabels[value]);

  return labels.length ? labels.join(' / ') : '-';
}

async function loadTeamRuleSummaries() {
  teamRuleLoading.value = true;
  teamRuleErrorMessage.value = '';

  try {
    teamRuleItems.value = await fetchTeamHonorRuleSummaries();
  } catch (error) {
    teamRuleErrorMessage.value =
      error instanceof Error ? error.message : '团队附加分规则加载失败。';
    ElMessage.error(teamRuleErrorMessage.value);
  } finally {
    teamRuleLoading.value = false;
  }
}

async function loadAwardRules() {
  awardLoading.value = true;
  awardErrorMessage.value = '';

  try {
    const result = await fetchAwardRules({
      page: awardFilters.page,
      pageSize: awardFilters.pageSize,
      keyword: awardFilters.keyword || undefined,
      scopeType: awardFilters.scopeType || undefined,
      enabled: awardFilters.enabled || undefined
    });
    awardItems.value = result.items;
    awardTotal.value = result.total;
  } catch (error) {
    awardErrorMessage.value = error instanceof Error ? error.message : '球员奖项规则加载失败。';
    ElMessage.error(awardErrorMessage.value);
  } finally {
    awardLoading.value = false;
  }
}

async function loadAwardRuleSummaries() {
  try {
    const result = await fetchAwardRules({
      page: 1,
      pageSize: 200
    });
    awardSummaryItems.value = result.items;
  } catch (error) {
    awardErrorMessage.value = error instanceof Error ? error.message : '球员奖项规则加载失败。';
  }
}

function submitAwardFilters() {
  awardFilters.page = 1;
  void loadAwardRules();
}

function resetAwardFilters() {
  awardFilters.page = 1;
  awardFilters.keyword = '';
  awardFilters.scopeType = '';
  awardFilters.enabled = '';
  void loadAwardRules();
}

function openEditAwardDialog(row: AwardRuleItem) {
  awardEditingItem.value = row;
  awardForm.code = row.code;
  awardForm.name = row.name;
  awardForm.scopeType = row.scopeType ?? null;
  awardForm.category = row.category ?? '';
  awardForm.placement = row.placement ?? '';
  awardForm.rank = row.rank ?? null;
  awardForm.baseScore = row.baseScore;
  awardForm.coefficient = row.coefficient;
  awardForm.topAward = row.topAward;
  awardForm.enabled = row.enabled;
  awardForm.sortOrder = row.sortOrder;
  awardForm.remark = row.remark ?? '';
  awardDialogVisible.value = true;
}

function validateAwardForm() {
  if (!awardForm.code.trim()) {
    ElMessage.warning('请填写规则编码。');
    return false;
  }

  if (!awardForm.name.trim()) {
    ElMessage.warning('请填写规则名称。');
    return false;
  }

  if (!Number.isFinite(awardForm.baseScore) || awardForm.baseScore < 0) {
    ElMessage.warning('基础分必须是不小于 0 的数字。');
    return false;
  }

  if (!Number.isFinite(awardForm.coefficient) || awardForm.coefficient < 0) {
    ElMessage.warning('系数必须是不小于 0 的数字。');
    return false;
  }

  if (
    awardForm.rank !== null &&
    awardForm.rank !== undefined &&
    (!Number.isInteger(Number(awardForm.rank)) || Number(awardForm.rank) < 1)
  ) {
    ElMessage.warning('排名必须是大于 0 的整数。');
    return false;
  }

  return true;
}

function buildAwardPayload(): AwardRulePayload {
  return {
    code: awardForm.code.trim(),
    name: awardForm.name.trim(),
    scopeType: awardForm.scopeType || null,
    category: awardForm.category?.trim() || undefined,
    placement: awardForm.placement?.trim() || undefined,
    rank: awardForm.rank === null || awardForm.rank === undefined ? null : Number(awardForm.rank),
    baseScore: Number(awardForm.baseScore),
    coefficient: Number(awardForm.coefficient),
    topAward: awardForm.topAward,
    enabled: awardForm.enabled,
    sortOrder: awardForm.sortOrder ?? 0,
    remark: awardForm.remark?.trim() || undefined
  };
}

async function saveAwardRule() {
  if (!validateAwardForm()) {
    return;
  }

  if (!awardEditingItem.value) {
    return;
  }

  awardSubmitting.value = true;

  try {
    const payload = buildAwardPayload();

    await updateAwardRule(awardEditingItem.value.id, payload);
    ElMessage.success('球员奖项规则已更新。');

    awardDialogVisible.value = false;
    await Promise.all([loadAwardRules(), loadAwardRuleSummaries()]);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存球员奖项规则失败。');
  } finally {
    awardSubmitting.value = false;
  }
}

async function toggleAwardRule(row: AwardRuleItem) {
  awardSubmitting.value = true;

  try {
    await updateAwardRule(row.id, {
      code: row.code,
      name: row.name,
      scopeType: row.scopeType ?? null,
      category: row.category ?? undefined,
      placement: row.placement ?? undefined,
      rank: row.rank ?? null,
      baseScore: row.baseScore,
      coefficient: row.coefficient,
      topAward: row.topAward,
      enabled: !row.enabled,
      sortOrder: row.sortOrder,
      remark: row.remark ?? undefined
    });
    ElMessage.success(row.enabled ? '规则已停用。' : '规则已启用。');
    await Promise.all([loadAwardRules(), loadAwardRuleSummaries()]);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '切换球员奖项规则失败。');
  } finally {
    awardSubmitting.value = false;
  }
}

async function recalculatePlayerAwardScores() {
  try {
    await ElMessageBox.confirm(
      '将根据当前启用的球员奖项规则重新计算球员荣誉分，并写回巨星统计字段。是否继续？',
      '重新计算球员荣誉分',
      {
        confirmButtonText: '开始重算',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
  } catch {
    return;
  }

  awardRecalculating.value = true;

  try {
    const result = await recalculateAwardScores();
    lastAwardRecalculateSummary.value = `已处理 ${result.playerCount} 名球员、${result.recipientCount} 条获奖记录，启用规则 ${result.enabledRuleCount} 条，计分球员 ${result.scoredPlayerCount} 名。`;
    ElMessage.success('球员荣誉分重算完成。');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '球员荣誉分重算失败。');
  } finally {
    awardRecalculating.value = false;
  }
}

function formatAwardRuleScore(row: AwardRuleItem) {
  return Number(row.baseScore * row.coefficient).toFixed(2);
}

watch(
  () => [awardFilters.page, awardFilters.pageSize],
  () => {
    void loadAwardRules();
  }
);

onMounted(() => {
  void loadRules();
  void loadTeamRuleSummaries();
  void loadAwardRules();
  void loadAwardRuleSummaries();
});
</script>

<template>
  <section class="page-stack">
    <el-tabs v-model="activeTab" class="rule-tabs">
      <el-tab-pane label="赛事荣誉规则" name="competition">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2>赛事荣誉规则</h2>
              <p>
                系统规则按对象、分类、级别、赛制和适用范围命中赛事；典型赛事只用于展示辅助理解。
              </p>
            </div>
            <div class="header-actions">
              <el-button type="warning" :loading="recalculating" @click="recalculateScores">
                <IconFont name="refresh" />
                重新计算荣誉分
              </el-button>
            </div>
          </div>

          <el-form
            class="filter-grid compact-filter honor-rule-filter"
            label-position="top"
            @submit.prevent="submitFilters"
          >
            <el-form-item label="关键词">
              <el-input
                v-model="filters.keyword"
                clearable
                placeholder="编码 / 名称 / 分类 / 备注"
                @keyup.enter="submitFilters"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="filters.enabled" clearable placeholder="全部状态">
                <el-option
                  v-for="option in enabledOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <div class="filter-actions">
              <el-button type="primary" :loading="loading" @click="submitFilters">
                <IconFont name="filter" />
                筛选
              </el-button>
              <el-button :disabled="loading" @click="resetFilters">
                <IconFont name="reset" />
                重置
              </el-button>
            </div>
          </el-form>

          <el-alert
            v-if="lastRecalculateSummary"
            class="recalculate-alert"
            type="success"
            :title="lastRecalculateSummary"
            show-icon
            :closable="false"
          />
        </div>

        <div v-if="errorMessage" class="panel">
          <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
        </div>

        <HonorRuleListPanel
          title="国家队规则"
          description="国家队赛事按国际、洲际和其他分类匹配，世界杯、洲际杯等按规则范围决定是否计算殿军。"
          :items="countryRules"
          :loading="loading"
          :get-target-type-label="getTargetTypeLabel"
          @edit="openEditDialog"
        />

        <HonorRuleListPanel
          title="俱乐部规则"
          description="俱乐部赛事按国际、洲际、国内和其他分类匹配，国内联赛只计前三，杯赛和超级杯按冠亚处理。"
          :items="clubRules"
          :loading="loading"
          :get-target-type-label="getTargetTypeLabel"
          @edit="openEditDialog"
        />

        <p class="rule-count-hint">当前共 {{ total }} 条系统规则，页面不提供新增和删除。</p>
      </el-tab-pane>

      <el-tab-pane label="团队附加分规则" name="team-bonus">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2>团队附加分规则</h2>
              <p>展示国家队和俱乐部在赛事荣誉之外可获得的小额团队奖项附加分，只展示总规则口径。</p>
            </div>
          </div>
        </div>

        <div v-if="teamRuleErrorMessage" class="panel">
          <el-alert type="error" :title="teamRuleErrorMessage" show-icon :closable="false" />
        </div>

        <div class="panel award-rule-summary-panel">
          <div class="panel-header">
            <div>
              <h3>团队附加分总规则</h3>
              <p>底层匹配规则会按排名、名次和奖项分类拆分；这里按业务口径聚合展示。</p>
            </div>
            <span class="status-pill">{{ teamRuleItems.length }} 条</span>
          </div>

          <el-skeleton v-if="teamRuleLoading && !teamRuleItems.length" :rows="6" animated />

          <NoDataView
            v-else-if="!teamRuleItems.length"
            text="暂无团队附加分规则，默认规则会由后端自动补齐；如仍为空，请刷新或检查接口状态。"
          />

          <el-table v-else :data="teamRuleItems" border>
            <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
            <el-table-column
              prop="name"
              label="规则名称"
              width="210"
              fixed="left"
              show-overflow-tooltip
            />
            <el-table-column label="对象" width="150" align="center">
              <template #default="{ row }">{{ getTeamTargetTypeLabel(row.targetTypes) }}</template>
            </el-table-column>
            <el-table-column label="范围" width="90" align="center">
              <template #default="{ row }">{{ getAwardScopeLabel(row.scopeType) }}</template>
            </el-table-column>
            <el-table-column prop="category" label="规则分类" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">{{ row.category || '-' }}</template>
            </el-table-column>
            <el-table-column
              prop="typicalAwards"
              label="典型命中奖项"
              min-width="300"
              show-overflow-tooltip
            />
            <el-table-column
              prop="scoring"
              label="计分口径"
              min-width="210"
              show-overflow-tooltip
            />
            <el-table-column label="状态" width="84" align="center">
              <template #default="{ row }">
                <SemanticTag :variant="row.enabled ? 'status-enabled' : 'status-disabled'">
                  {{ row.enabled ? '启用' : '停用' }}
                </SemanticTag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="280" show-overflow-tooltip>
              <template #default="{ row }">{{ row.remark || '-' }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="球员奖项规则" name="player-award">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2>球员奖项规则</h2>
              <p>按奖项范围、分类、名次文本或排名配置评分规则，手动触发后更新球员荣誉分。</p>
            </div>
          </div>

          <el-form
            class="filter-grid compact-filter award-rule-filter"
            label-position="top"
            @submit.prevent="submitAwardFilters"
          >
            <el-form-item label="关键词">
              <el-input
                v-model="awardFilters.keyword"
                clearable
                placeholder="编码 / 名称 / 分类 / 名次 / 备注"
                @keyup.enter="submitAwardFilters"
              />
            </el-form-item>
            <el-form-item label="奖项范围">
              <el-select v-model="awardFilters.scopeType" clearable placeholder="全部范围">
                <el-option
                  v-for="option in awardScopeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="awardFilters.enabled" clearable placeholder="全部状态">
                <el-option
                  v-for="option in enabledOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <div class="filter-actions">
              <el-button type="primary" :loading="awardLoading" @click="submitAwardFilters">
                <IconFont name="filter" />
                筛选
              </el-button>
              <el-button :disabled="awardLoading" @click="resetAwardFilters">
                <IconFont name="reset" />
                重置
              </el-button>
            </div>
          </el-form>

          <div class="rule-toolbar">
            <el-button
              type="warning"
              :loading="awardRecalculating"
              @click="recalculatePlayerAwardScores"
            >
              <IconFont name="refresh" />
              重新计算球员荣誉分
            </el-button>
          </div>

          <el-alert
            v-if="lastAwardRecalculateSummary"
            class="recalculate-alert"
            type="success"
            :title="lastAwardRecalculateSummary"
            show-icon
            :closable="false"
          />
        </div>

        <div v-if="awardErrorMessage" class="panel">
          <el-alert type="error" :title="awardErrorMessage" show-icon :closable="false" />
        </div>

        <div
          v-for="group in awardRuleSummaryGroups"
          :key="group.title"
          class="panel award-rule-summary-panel"
        >
          <div class="panel-header">
            <div>
              <h3>{{ group.title }}</h3>
              <p>{{ group.description }}</p>
            </div>
          </div>

          <el-table :data="group.rows" border>
            <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
            <el-table-column
              prop="name"
              label="规则名称"
              width="180"
              fixed="left"
              show-overflow-tooltip
            />
            <el-table-column label="范围" width="90" align="center">
              <template #default="{ row }">{{ getAwardScopeLabel(row.scopeType) }}</template>
            </el-table-column>
            <el-table-column
              prop="overallTypical"
              label="综合奖项"
              min-width="300"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.overallTypical }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="overallScore"
              label="综合分"
              width="150"
              align="center"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.overallScore }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="lineupTypical"
              label="阵容奖项"
              min-width="280"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.lineupTypical }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="lineupScore"
              label="阵容分"
              width="110"
              align="center"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.lineupScore }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="specialtyTypical"
              label="专项奖项"
              min-width="340"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.specialtyTypical }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="specialtyScore"
              label="专项分"
              width="170"
              align="center"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.specialtyScore }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="supplementTypical"
              label="补充奖项"
              min-width="240"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.supplementTypical }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="supplementScore"
              label="补充分"
              width="150"
              align="center"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span class="award-score-cell">{{ row.supplementScore }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="topAward" label="顶级奖项数" width="130" />
            <el-table-column
              prop="reduction"
              label="组合折减"
              min-width="260"
              show-overflow-tooltip
            />
          </el-table>
        </div>

        <div class="panel rule-detail-guide">
          <div>
            <h3>评分明细规则</h3>
            <p>下面这张表是实际参与球员荣誉分计算的底层规则，可编辑分值、系数、启停和备注。</p>
          </div>
        </div>

        <AwardRuleListPanel
          title="评分明细规则"
          description="以下为系统用于匹配 AwardRecipient 的底层评分规则；通常只需要编辑分值、系数、启停或备注。具体奖项请在奖项管理中维护。"
          :items="awardItems"
          :total="awardTotal"
          :loading="awardLoading"
          :has-rows="hasAwardRows"
          :page="awardFilters.page"
          :page-size="awardFilters.pageSize"
          :get-award-scope-label="getAwardScopeLabel"
          :format-award-rule-score="formatAwardRuleScore"
          @edit="openEditAwardDialog"
          @toggle="toggleAwardRule"
          @update:page="awardFilters.page = $event"
          @update:page-size="awardFilters.pageSize = $event"
        />
      </el-tab-pane>
    </el-tabs>

    <HonorRuleDialog
      v-model:visible="dialogVisible"
      :form="form"
      :rule="editingItem"
      :title="dialogTitle"
      :submitting="submitting"
      :get-target-type-label="getTargetTypeLabel"
      @save="saveRule"
    />

    <AwardRuleDialog
      v-model:visible="awardDialogVisible"
      :form="awardForm"
      :title="awardDialogTitle"
      :submitting="awardSubmitting"
      :award-scope-options="awardScopeOptions"
      @save="saveAwardRule"
    />
  </section>
</template>

<style scoped lang="scss">
.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.rule-tabs {
  min-width: 0;

  :deep(.el-tabs__content),
  :deep(.el-tab-pane) {
    min-width: 0;
  }
}

.honor-rule-filter {
  grid-template-columns: minmax(240px, 1fr) 220px auto;
}

.award-rule-filter {
  grid-template-columns: minmax(240px, 360px) 280px 220px auto;
}

.rule-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.rule-detail-guide {
  margin-top: 16px;

  h3 {
    margin: 0 0 6px;
    color: var(--text-color-primary);
  }

  p {
    margin: 0;
    color: var(--text-color-secondary);
    font-size: 13px;
  }
}

.award-rule-summary-panel {
  margin-top: 16px;
  overflow: hidden;
}

.award-score-cell {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recalculate-alert {
  margin-top: 16px;
}

.rule-count-hint {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 13px;
}

@media (max-width: 1180px) {
  .honor-rule-filter {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .award-rule-filter {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 720px) {
  .honor-rule-filter,
  .award-rule-filter {
    grid-template-columns: 1fr;
  }
}
</style>

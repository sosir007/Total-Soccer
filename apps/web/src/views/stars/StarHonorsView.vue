<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { fetchPlayerHonorListSummary, fetchPlayerHonorSummary } from '@/services/modules/catalog';
import type {
  PlayerHonorListColumn,
  PlayerHonorListRow,
  PlayerHonorSummaryColumn,
  PlayerHonorScoreDetail,
  PlayerHonorSummaryRow
} from '@/services/types/catalog';
import AbilityBadge from '@/components/AbilityBadge.vue';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  ClubSelect,
  ConfederationSelect,
  CountrySelect,
  PositionSelect
} from '@/components/selects';
import { formatEntityName } from '@/utils/entity-name';
import { getConfederationVariant } from '@/utils/tag-theme';

const loading = ref(false);
const errorMessage = ref('');
const activeTab = ref<'score' | 'list'>('score');
const summaryRows = ref<PlayerHonorSummaryRow[]>([]);
const summaryColumns = ref<PlayerHonorSummaryColumn[]>([]);
const listRows = ref<PlayerHonorListRow[]>([]);
const listColumns = ref<PlayerHonorListColumn[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  confederationId: '',
  position: '',
  countryId: '',
  clubId: ''
});

const hasSummaryRows = computed(() => summaryRows.value.length > 0);
const hasListRows = computed(() => listRows.value.length > 0);
const groupedSummaryColumns = computed(() => {
  const groups: Array<{ group: string; columns: PlayerHonorSummaryColumn[] }> = [];

  for (const column of summaryColumns.value) {
    const group = groups.find((item) => item.group === column.group);

    if (group) {
      group.columns.push(column);
    } else {
      groups.push({ group: column.group, columns: [column] });
    }
  }

  return groups;
});
const groupedListColumns = computed(() => {
  const groups: Array<{ group: string; columns: PlayerHonorListColumn[] }> = [];

  for (const column of listColumns.value) {
    const group = groups.find((item) => item.group === column.group);

    if (group) {
      group.columns.push(column);
    } else {
      groups.push({ group: column.group, columns: [column] });
    }
  }

  return groups;
});

async function loadHonors() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const params = {
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      confederationId: filters.confederationId || undefined,
      position: filters.position || undefined,
      countryId: filters.countryId || undefined,
      clubId: filters.clubId || undefined
    };
    const [summaryResult, listResult] = await Promise.all([
      fetchPlayerHonorSummary(params),
      fetchPlayerHonorListSummary(params)
    ]);

    summaryRows.value = summaryResult.items;
    summaryColumns.value = summaryResult.columns;
    listRows.value = listResult.items;
    listColumns.value = listResult.columns;
    total.value = Math.max(summaryResult.total, listResult.total);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '巨星荣誉加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadHonors();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.confederationId = '';
  filters.position = '';
  filters.countryId = '';
  filters.clubId = '';
  void loadHonors();
}

function rowIndex(index: number) {
  return (filters.page - 1) * filters.pageSize + index + 1;
}

function formatScore(value?: number | null) {
  if (!value) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: 2
  }).format(value);
}

function formatDate(value?: string | number | null) {
  if (!value) {
    return '-';
  }

  const date = dayjs(value);

  return date.isValid() ? date.format('YYYY-MM-DD') : String(value);
}

function formatBirthDecade(value?: string | number | null) {
  if (!value) {
    return '-';
  }

  const date = dayjs(value);

  if (!date.isValid()) {
    return '-';
  }

  const decadeStart = Math.floor(date.year() / 10) * 10;

  return `${decadeStart}-${String(decadeStart + 9).slice(2)}`;
}

function formatHonorCell(row: PlayerHonorListRow, key: PlayerHonorListColumn['key']) {
  return row.cells[key]?.text || '-';
}

function getHonorListColumnWidth(group: string, column: PlayerHonorListColumn) {
  if (column.key === 'achievement') {
    return 320;
  }

  if (
    group === '国内联赛' &&
    ['domesticLeagueTrophy', 'domesticLeagueAward'].includes(column.key)
  ) {
    return 300;
  }

  return 240;
}

function getHonorScoreColumnWidth(group: string, column: PlayerHonorSummaryColumn) {
  if (
    group === '国内联赛' &&
    ['domesticLeagueTrophy', 'domesticLeagueAward'].includes(column.key)
  ) {
    return 90;
  }

  return 80;
}

function getScoreDetails(row: PlayerHonorSummaryRow, key: PlayerHonorSummaryColumn['key']) {
  return sortScoreDetails(row.scoreDetails?.[key] ?? []);
}

function getAggregateScoreDetails(
  row: PlayerHonorSummaryRow,
  sourceType: 'AWARD' | 'TEAM' | 'ALL'
) {
  const keys =
    sourceType === 'ALL'
      ? summaryColumns.value.map((column) => column.key)
      : summaryColumns.value
          .filter((column) =>
            sourceType === 'AWARD'
              ? column.sourceType === 'AWARD' || column.sourceType === 'ACHIEVEMENT'
              : column.sourceType === sourceType
          )
          .map((column) => column.key);

  return sortScoreDetails(keys.flatMap((key) => getScoreDetails(row, key)));
}

function sortScoreDetails(details: PlayerHonorScoreDetail[]) {
  return [...details].sort((left, right) => {
    const yearDiff = resolveScoreDetailSortYear(left) - resolveScoreDetailSortYear(right);

    if (yearDiff !== 0) {
      return yearDiff;
    }

    const labelDiff = left.label.localeCompare(right.label, 'zh-CN');

    if (labelDiff !== 0) {
      return labelDiff;
    }

    return (left.competitionName ?? '').localeCompare(right.competitionName ?? '', 'zh-CN');
  });
}

function resolveScoreDetailSortYear(detail: PlayerHonorScoreDetail) {
  const match = detail.label.match(/\d{4}/);

  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function formatScoreDetailTitle(detail: PlayerHonorScoreDetail) {
  return [detail.label, detail.competitionName, formatScoreDetailPlacement(detail)]
    .filter(Boolean)
    .join(' ');
}

function formatScoreDetailFormula(detail: PlayerHonorScoreDetail) {
  if (detail.ruleName?.startsWith('个人成就')) {
    return formatScore(detail.score);
  }

  return ` ${formatScore(detail.placementScore)} × ${formatScore(detail.qualityCoefficient)} × ${formatScore(detail.conversionCoefficient)} = ${formatScore(detail.score)}`;
}

function isSingleSummaryColumnGroup(group: { group: string; columns: PlayerHonorSummaryColumn[] }) {
  return group.columns.length === 1 && group.columns[0]?.label === group.group;
}

function isSingleListColumnGroup(group: { group: string; columns: PlayerHonorListColumn[] }) {
  return group.columns.length === 1 && group.columns[0]?.label === group.group;
}

function formatScoreTooltipTitle(column: PlayerHonorSummaryColumn) {
  return column.group === column.label ? column.label : `${column.group} / ${column.label}`;
}

function formatScoreDetailPlacement(detail: PlayerHonorScoreDetail) {
  const placement = detail.placementLabel?.trim();

  if (!placement || ['获奖', '优胜者'].includes(placement)) {
    return '';
  }

  const normalizedPlacement = normalizeScoreDetailText(placement);
  const normalizedTitle = normalizeScoreDetailText(
    `${detail.label}${detail.competitionName ?? ''}`
  );

  return normalizedPlacement && normalizedTitle.includes(normalizedPlacement) ? '' : placement;
}

function normalizeScoreDetailText(value?: string | null) {
  return (value ?? '').replace(/\s+/g, '').trim();
}

function formatTeamPeriod(period?: string | null) {
  return period ? `（${period}）` : '';
}

function formatTeamTagLabel(team: {
  name?: string | null;
  shortName?: string | null;
  period?: string | null;
}) {
  return `${formatEntityName(team)}${formatTeamPeriod(team.period)}`;
}

function formatCountryTeamTagLabel(team: {
  name?: string | null;
  shortName?: string | null;
  period?: string | null;
}) {
  return `${formatEntityName(team, true)}${formatTeamPeriod(team.period)}`;
}

function getTeamTagVariant(team: {
  federationRef?: { name?: string | null; code?: string | null } | null;
}) {
  return getConfederationVariant(team.federationRef?.name ?? team.federationRef?.code ?? '');
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadHonors();
  }
);

onMounted(() => {
  void loadHonors();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>巨星荣誉</h2>
          <p>按球员汇总个人奖项分和已确认团队荣誉分，表格单元格展示对应分桶分值。</p>
        </div>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="球员 / UID / 国家 / 俱乐部"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="足联">
          <ConfederationSelect v-model="filters.confederationId" />
        </el-form-item>
        <el-form-item label="位置">
          <PositionSelect v-model="filters.position" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="filters.countryId" />
        </el-form-item>
        <el-form-item label="俱乐部">
          <ClubSelect v-model="filters.clubId" />
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
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>{{ activeTab === 'score' ? '荣誉分矩阵' : '荣誉清单' }}</h3>
        <span class="status-pill">{{ total }} 名球员</span>
      </div>

      <el-tabs v-model="activeTab" class="honor-tabs">
        <el-tab-pane label="荣誉分矩阵" name="score">
          <el-skeleton v-if="loading && !hasSummaryRows" :rows="8" animated />

          <NoDataView
            v-else-if="!hasSummaryRows"
            text="暂无巨星荣誉，可以先在履历管理中录入个人奖项或确认团队荣誉。"
          />

          <el-table v-else :data="summaryRows" border class="player-honor-summary-table">
            <el-table-column label="序号" width="60" fixed align="center">
              <template #default="{ $index }">
                {{ rowIndex($index) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="primaryRole"
              label="位置"
              width="80"
              fixed
              align="center"
              sortable
            >
              <template #default="{ row }">
                <PositionTags :value="row.primaryRole || row.positions" />
              </template>
            </el-table-column>

            <el-table-column prop="pa" label="PA" width="80" fixed align="center" sortable>
              <template #default="{ row }">
                <AbilityBadge type="PA" :value="row.pa" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="国家" width="150" fixed>
              <template #default="{ row }">
                <EntityNameCell
                  :id="row.country?.id"
                  type="country"
                  :title="formatEntityName(row.country)"
                  :subtitle="`UID ${row.country?.uid || '-'}`"
                />
              </template>
            </el-table-column>

            <el-table-column label="球员" width="180" fixed>
              <template #default="{ row }">
                <EntityNameCell
                  :id="row.id"
                  type="player"
                  :title="row.chineseName"
                  :subtitle="row.englishName || `UID ${row.uid}`"
                />
              </template>
            </el-table-column>

            <template v-for="group in groupedSummaryColumns" :key="group.group">
              <el-table-column
                v-if="isSingleSummaryColumnGroup(group)"
                :label="group.columns[0].label"
                :width="getHonorScoreColumnWidth(group.group, group.columns[0])"
                align="center"
                header-align="center"
              >
                <template #default="{ row }">
                  <el-tooltip
                    v-if="getScoreDetails(row, group.columns[0].key).length"
                    effect="light"
                    placement="top"
                    :show-after="180"
                    popper-class="honor-summary-tooltip-popper"
                  >
                    <template #content>
                      <div class="honor-summary-tooltip honor-summary-tooltip--score">
                        <div class="honor-summary-tooltip__title">
                          {{ formatScoreTooltipTitle(group.columns[0]) }}
                        </div>
                        <div
                          v-for="(detail, index) in getScoreDetails(row, group.columns[0].key)"
                          :key="`${detail.label}-${detail.competitionName}-${detail.ruleName}-${detail.score}-${index}`"
                          class="honor-summary-tooltip__item honor-summary-tooltip__item--split"
                        >
                          <span>{{ formatScoreDetailTitle(detail) }}</span>
                          <strong>{{ formatScoreDetailFormula(detail) }}</strong>
                        </div>
                        <div
                          class="honor-summary-tooltip__item honor-summary-tooltip__item--split is-total"
                        >
                          <span>合计&nbsp;</span>
                          <strong>{{ formatScore(row.scores[group.columns[0].key]) }}</strong>
                        </div>
                      </div>
                    </template>
                    <span class="score-cell is-hoverable">
                      {{ formatScore(row.scores[group.columns[0].key]) }}
                    </span>
                  </el-tooltip>
                  <span v-else class="score-cell">
                    {{ formatScore(row.scores[group.columns[0].key]) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column v-else :label="group.group" align="center" header-align="center">
                <el-table-column
                  v-for="column in group.columns"
                  :key="column.key"
                  :label="column.label"
                  :width="getHonorScoreColumnWidth(group.group, column)"
                  align="center"
                  header-align="center"
                >
                  <template #default="{ row }">
                    <el-tooltip
                      v-if="getScoreDetails(row, column.key).length"
                      effect="light"
                      placement="top"
                      :show-after="180"
                      popper-class="honor-summary-tooltip-popper"
                    >
                      <template #content>
                        <div class="honor-summary-tooltip honor-summary-tooltip--score">
                          <div class="honor-summary-tooltip__title">
                            {{ formatScoreTooltipTitle(column) }}
                          </div>
                          <div
                            v-for="(detail, index) in getScoreDetails(row, column.key)"
                            :key="`${detail.label}-${detail.competitionName}-${detail.ruleName}-${detail.score}-${index}`"
                            class="honor-summary-tooltip__item honor-summary-tooltip__item--split"
                          >
                            <span>{{ formatScoreDetailTitle(detail) }}</span>
                            <strong>{{ formatScoreDetailFormula(detail) }}</strong>
                          </div>
                          <div
                            class="honor-summary-tooltip__item honor-summary-tooltip__item--split is-total"
                          >
                            <span>合计&nbsp;</span>
                            <strong>{{ formatScore(row.scores[column.key]) }}</strong>
                          </div>
                        </div>
                      </template>
                      <span class="score-cell is-hoverable">
                        {{ formatScore(row.scores[column.key]) }}
                      </span>
                    </el-tooltip>
                    <span v-else class="score-cell">{{ formatScore(row.scores[column.key]) }}</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>

            <el-table-column label="奖项数" width="80" align="center">
              <template #default="{ row }">
                {{ row.awardCount || '-' }}
              </template>
            </el-table-column>

            <el-table-column label="团队荣誉" width="90" align="center">
              <template #default="{ row }">
                {{ row.teamHonorCount || '-' }}
              </template>
            </el-table-column>

            <el-table-column label="奖项分" width="80" align="center" fixed="right">
              <template #default="{ row }">
                <el-tooltip
                  v-if="getAggregateScoreDetails(row, 'AWARD').length"
                  effect="light"
                  placement="top"
                  :show-after="180"
                  popper-class="honor-summary-tooltip-popper"
                >
                  <template #content>
                    <div class="honor-summary-tooltip honor-summary-tooltip--score">
                      <div class="honor-summary-tooltip__title">奖项分拆解</div>
                      <div
                        v-for="(detail, index) in getAggregateScoreDetails(row, 'AWARD')"
                        :key="`award-${detail.label}-${detail.competitionName}-${detail.ruleName}-${detail.score}-${index}`"
                        class="honor-summary-tooltip__item honor-summary-tooltip__item--split"
                      >
                        <span>{{ formatScoreDetailTitle(detail) }}</span>
                        <strong>{{ formatScoreDetailFormula(detail) }}</strong>
                      </div>
                      <div
                        class="honor-summary-tooltip__item honor-summary-tooltip__item--split is-total"
                      >
                        <span>合计&nbsp;</span>
                        <strong>{{ formatScore(row.awardScore) }}</strong>
                      </div>
                    </div>
                  </template>
                  <span class="score-cell is-hoverable">{{ formatScore(row.awardScore) }}</span>
                </el-tooltip>
                <span v-else class="score-cell">{{ formatScore(row.awardScore) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="团队分" width="80" align="center" fixed="right">
              <template #default="{ row }">
                <el-tooltip
                  v-if="getAggregateScoreDetails(row, 'TEAM').length"
                  effect="light"
                  placement="top"
                  :show-after="180"
                  popper-class="honor-summary-tooltip-popper"
                >
                  <template #content>
                    <div class="honor-summary-tooltip honor-summary-tooltip--score">
                      <div class="honor-summary-tooltip__title">团队分拆解</div>
                      <div
                        v-for="(detail, index) in getAggregateScoreDetails(row, 'TEAM')"
                        :key="`team-${detail.label}-${detail.competitionName}-${detail.ruleName}-${detail.score}-${index}`"
                        class="honor-summary-tooltip__item honor-summary-tooltip__item--split"
                      >
                        <span>{{ formatScoreDetailTitle(detail) }}</span>
                        <strong>{{ formatScoreDetailFormula(detail) }}</strong>
                      </div>
                      <div
                        class="honor-summary-tooltip__item honor-summary-tooltip__item--split is-total"
                      >
                        <span>合计&nbsp;</span>
                        <strong>{{ formatScore(row.teamHonorScore) }}</strong>
                      </div>
                    </div>
                  </template>
                  <span class="score-cell is-hoverable">{{ formatScore(row.teamHonorScore) }}</span>
                </el-tooltip>
                <span v-else class="score-cell">{{ formatScore(row.teamHonorScore) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="总分" width="80" align="center" fixed="right">
              <template #default="{ row }">
                <el-tooltip
                  v-if="getAggregateScoreDetails(row, 'ALL').length"
                  effect="light"
                  placement="top"
                  :show-after="180"
                  popper-class="honor-summary-tooltip-popper"
                >
                  <template #content>
                    <div class="honor-summary-tooltip honor-summary-tooltip--score">
                      <div class="honor-summary-tooltip__title">总分拆解</div>
                      <div
                        v-for="(detail, index) in getAggregateScoreDetails(row, 'ALL')"
                        :key="`total-${detail.label}-${detail.competitionName}-${detail.ruleName}-${detail.score}-${index}`"
                        class="honor-summary-tooltip__item honor-summary-tooltip__item--split"
                      >
                        <span>{{ formatScoreDetailTitle(detail) }}</span>
                        <strong>{{ formatScoreDetailFormula(detail) }}</strong>
                      </div>
                      <div
                        class="honor-summary-tooltip__item honor-summary-tooltip__item--split is-total"
                      >
                        <span>合计&nbsp;</span>
                        <strong>{{ formatScore(row.totalScore) }}</strong>
                      </div>
                    </div>
                  </template>
                  <span class="score-cell is-total is-hoverable">
                    {{ formatScore(row.totalScore) }}
                  </span>
                </el-tooltip>
                <span v-else class="score-cell is-total">{{ formatScore(row.totalScore) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="荣誉清单" name="list">
          <el-skeleton v-if="loading && !hasListRows" :rows="8" animated />

          <NoDataView
            v-else-if="!hasListRows"
            text="暂无荣誉清单，可以先在履历管理中录入个人奖项或确认团队荣誉。"
          />

          <el-table v-else :data="listRows" border class="player-honor-list-table">
            <el-table-column label="序号" width="60" fixed align="center">
              <template #default="{ $index }">
                {{ rowIndex($index) }}
              </template>
            </el-table-column>

            <el-table-column label="年代" width="90" fixed align="center">
              <template #default="{ row }">
                {{ formatBirthDecade(row.birthDate) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="primaryRole"
              label="位置"
              width="80"
              fixed
              align="center"
              sortable
            >
              <template #default="{ row }">
                <PositionTags :value="row.primaryRole || row.positions" />
              </template>
            </el-table-column>

            <el-table-column prop="pa" label="PA" width="80" fixed align="center" sortable>
              <template #default="{ row }">
                <AbilityBadge type="PA" :value="row.pa" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="球员" width="180" fixed show-overflow-tooltip>
              <template #default="{ row }">
                <EntityNameCell
                  :id="row.id"
                  type="player"
                  :title="row.chineseName"
                  :subtitle="row.englishName"
                />
              </template>
            </el-table-column>

            <el-table-column prop="birthDate" label="出生日期" width="110" align="center" sortable>
              <template #default="{ row }">
                {{ formatDate(row.birthDate) }}
              </template>
            </el-table-column>

            <el-table-column label="国籍" width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-if="row.countryTeams.length" class="honor-team-list">
                  <template v-for="(team, index) in row.countryTeams" :key="`${team.id}-${index}`">
                    <EntityLink
                      :id="team.id"
                      class="honor-team-tag-link"
                      type="country"
                      :name="formatCountryTeamTagLabel(team)"
                      :title="formatTeamTagLabel(team)"
                    >
                      <SemanticTag
                        class="honor-team-tag"
                        :variant="getTeamTagVariant(team)"
                        size="small"
                      >
                        {{ formatCountryTeamTagLabel(team) }}
                      </SemanticTag>
                    </EntityLink>
                  </template>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>

            <el-table-column label="球队" width="300" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-if="row.trophyClubs.length" class="honor-team-list">
                  <template v-for="(team, index) in row.trophyClubs" :key="`${team.id}-${index}`">
                    <EntityLink
                      :id="team.id"
                      class="honor-team-tag-link"
                      type="club"
                      :name="formatEntityName(team)"
                      :title="formatTeamTagLabel(team)"
                    >
                      <SemanticTag
                        class="honor-team-tag"
                        :variant="getTeamTagVariant(team)"
                        size="small"
                      >
                        {{ formatTeamTagLabel(team) }}
                      </SemanticTag>
                    </EntityLink>
                  </template>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>

            <template v-for="group in groupedListColumns" :key="group.group">
              <el-table-column
                v-if="isSingleListColumnGroup(group)"
                :label="group.columns[0].label"
                :width="getHonorListColumnWidth(group.group, group.columns[0])"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span class="honor-text-cell" :title="formatHonorCell(row, group.columns[0].key)">
                    {{ formatHonorCell(row, group.columns[0].key) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column v-else :label="group.group" align="center" header-align="center">
                <el-table-column
                  v-for="column in group.columns"
                  :key="column.key"
                  :label="column.label"
                  :width="getHonorListColumnWidth(group.group, column)"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span class="honor-text-cell" :title="formatHonorCell(row, column.key)">
                      {{ formatHonorCell(row, column.key) }}
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <template v-if="activeTab === 'score' ? hasSummaryRows : hasListRows">
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
  </section>
</template>

<style scoped>
.player-honor-summary-table {
  width: 100%;

  --el-table-header-bg-color: #fbfcfb;
  --el-table-header-text-color: var(--text-color-regular);
}

.player-honor-list-table {
  width: 100%;

  --el-table-header-bg-color: #fbfcfb;
  --el-table-header-text-color: var(--text-color-regular);
}

.player-honor-summary-table :deep(.el-table__header th.el-table__cell),
.player-honor-summary-table :deep(thead.is-group th.el-table__cell),
.player-honor-list-table :deep(.el-table__header th.el-table__cell),
.player-honor-list-table :deep(thead.is-group th.el-table__cell) {
  background: #fbfcfb;
}

.player-honor-summary-table :deep(.el-table__header .cell),
.player-honor-list-table :deep(.el-table__header .cell) {
  color: var(--text-color-regular);
  font-weight: 850;
}

.honor-tabs {
  --el-tabs-header-height: 40px;
}

.score-cell {
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.score-cell.is-hoverable {
  cursor: pointer;
  transition: color 0.18s ease;

  &:hover {
    color: var(--color-brand-primary);
  }
}

.score-cell.is-total {
  font-weight: 700;
  color: var(--color-primary);
}

.honor-summary-tooltip {
  display: grid;
  gap: 6px;
  max-width: 380px;
  max-height: 280px;
  overflow: auto;
  color: var(--text-color-regular);
  font-size: 13px;
  line-height: 1.45;

  &__title {
    color: var(--text-color-primary);
    font-weight: 800;
  }

  &__item--split {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    min-width: 280px;
  }

  &__item--split span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item--split strong {
    flex: 0 0 auto;
    margin-left: 4px;
    color: var(--text-color-primary);
    font-weight: 800;
    white-space: nowrap;
  }

  &__item--split.is-total {
    padding-top: 4px;
    border-top: 1px solid var(--color-border-brand-subtle);
  }
}

.honor-text-cell {
  display: -webkit-box;
  max-width: 100%;
  overflow: hidden;
  color: var(--text-secondary);
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.45;
}

.honor-team-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  max-width: 100%;
  color: var(--text-secondary);
  line-height: 1.55;
}

.honor-team-tag-link {
  max-width: 160px;
}

.honor-team-tag {
  max-width: 160px;
}
</style>

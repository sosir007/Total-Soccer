<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { fetchPlayerHonorListSummary, fetchPlayerHonorSummary } from '@/services/modules/catalog';
import type {
  PlayerHonorListColumn,
  PlayerHonorListRow,
  PlayerHonorSummaryColumn,
  PlayerHonorSummaryRow
} from '@/services/types/catalog';
import AbilityBadge from '@/components/AbilityBadge.vue';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { ClubSelect, CountrySelect } from '@/components/selects';
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
  countryId: '',
  clubId: ''
});

const hasSummaryRows = computed(() => summaryRows.value.length > 0);
const hasListRows = computed(() => listRows.value.length > 0);
const awardColumns = computed(() =>
  summaryColumns.value.filter((column) => column.sourceType === 'AWARD')
);
const teamColumns = computed(() =>
  summaryColumns.value.filter((column) => column.sourceType === 'TEAM')
);
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

function formatTeamPeriod(period?: string | null) {
  return period ? `（${period}）` : '';
}

function formatTeamTagLabel(team: { name?: string | null; period?: string | null }) {
  return `${team.name ?? '-'}${formatTeamPeriod(team.period)}`;
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
                  :title="row.country?.name"
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

            <el-table-column label="个人奖项" align="center" header-align="center">
              <el-table-column
                v-for="column in awardColumns"
                :key="column.key"
                :label="column.label"
                width="90"
                align="center"
                header-align="center"
              >
                <template #default="{ row }">
                  <span class="score-cell">{{ formatScore(row.scores[column.key]) }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="团队荣誉" align="center" header-align="center">
              <el-table-column
                v-for="column in teamColumns"
                :key="column.key"
                :label="column.label"
                width="100"
                align="center"
                header-align="center"
              >
                <template #default="{ row }">
                  <span class="score-cell">{{ formatScore(row.scores[column.key]) }}</span>
                </template>
              </el-table-column>
            </el-table-column>

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
                <span class="score-cell">{{ formatScore(row.awardScore) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="团队分" width="80" align="center" fixed="right">
              <template #default="{ row }">
                <span class="score-cell">{{ formatScore(row.teamHonorScore) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="总分" width="80" align="center" fixed="right">
              <template #default="{ row }">
                <span class="score-cell is-total">{{ formatScore(row.totalScore) }}</span>
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
                      :name="team.name"
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

            <el-table-column label="球队" width="300" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-if="row.trophyClubs.length" class="honor-team-list">
                  <template v-for="(team, index) in row.trophyClubs" :key="`${team.id}-${index}`">
                    <EntityLink
                      :id="team.id"
                      class="honor-team-tag-link"
                      type="club"
                      :name="team.name"
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

            <el-table-column
              v-for="group in groupedListColumns"
              :key="group.group"
              :label="group.group"
              align="center"
              header-align="center"
            >
              <el-table-column
                v-for="column in group.columns"
                :key="column.key"
                :label="column.label"
                width="240"
              >
                <template #default="{ row }">
                  <span class="honor-text-cell" :title="formatHonorCell(row, column.key)">
                    {{ formatHonorCell(row, column.key) }}
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
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
}

.player-honor-list-table {
  width: 100%;
}

.honor-tabs {
  --el-tabs-header-height: 40px;
}

.score-cell {
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.score-cell.is-total {
  font-weight: 700;
  color: var(--color-primary);
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

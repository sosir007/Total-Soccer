<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { type NamedRef, type PlayerListItem } from '@/services/catalog';
import {
  fetchSummitCandidates,
  fetchSummitLineup,
  type SummitGroup,
  type SummitLineup
} from '@/services/summit';
import {
  ClubSelect,
  ConfederationSelect,
  CountrySelect,
  PlayerTypeSelect
} from '@/components/selects';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';

const router = useRouter();
const loading = ref(false);
const candidatesLoading = ref(false);
const errorMessage = ref('');
const lineup = ref<SummitLineup | null>(null);
const candidates = ref<PlayerListItem[]>([]);
const candidateTotal = ref(0);
const filters = reactive({
  confederationId: '',
  countryId: '',
  clubId: '',
  playerTypeId: '',
  minPa: 0,
  maxPa: 200,
  group: '前锋' as SummitGroup,
  page: 1,
  pageSize: 10
});

const hasStarters = computed(() =>
  (lineup.value?.starters ?? []).some((starter) => starter.player)
);

const starterRows = computed(() => ({
  forwards: ['LW', 'ST', 'RW'].map(findStarter),
  midfielders: ['CM1', 'CM2', 'CM3'].map(findStarter),
  defenders: ['LB', 'CB1', 'CB2', 'RB'].map(findStarter),
  keeper: ['GK'].map(findStarter)
}));

async function loadLineup() {
  loading.value = true;
  errorMessage.value = '';

  try {
    lineup.value = await fetchSummitLineup(buildParams());
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '紫禁之巅阵容加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

async function loadCandidates() {
  candidatesLoading.value = true;

  try {
    const result = await fetchSummitCandidates({
      ...buildParams(),
      group: filters.group,
      page: filters.page,
      pageSize: filters.pageSize
    });
    candidates.value = result.items;
    candidateTotal.value = result.total;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '候选榜加载失败。');
  } finally {
    candidatesLoading.value = false;
  }
}

function buildParams() {
  return {
    confederationId: filters.confederationId || undefined,
    countryId: filters.countryId || undefined,
    clubId: filters.clubId || undefined,
    playerTypeId: filters.playerTypeId || undefined,
    minPa: filters.minPa,
    maxPa: filters.maxPa
  };
}

function submitFilters() {
  filters.page = 1;
  void loadLineup();
  void loadCandidates();
}

function resetFilters() {
  filters.confederationId = '';
  filters.countryId = '';
  filters.clubId = '';
  filters.playerTypeId = '';
  filters.minPa = 0;
  filters.maxPa = 200;
  filters.group = '前锋';
  filters.page = 1;
  void loadLineup();
  void loadCandidates();
}

function openPlayer(player: PlayerListItem | null) {
  if (!player) {
    return;
  }

  void router.push({
    name: 'stars-detail-id',
    params: {
      id: player.id
    }
  });
}

function findStarter(slot: string) {
  return lineup.value?.starters.find((starter) => starter.slot === slot) ?? null;
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatPa(value?: number | null) {
  return value === null || value === undefined ? '-' : value;
}

watch(
  () => [filters.page, filters.pageSize, filters.group],
  () => {
    void loadCandidates();
  }
);

onMounted(() => {
  void Promise.all([loadLineup(), loadCandidates()]);
});
</script>

<template>
  <section class="page-stack">
    <div class="hero-panel summit-hero">
      <div class="hero-content">
        <div class="tag">最佳阵容排行</div>
        <h2>紫禁之巅</h2>
        <p>基于现有球员 PA / CA 数据自动生成 4-3-3 首发与位置候选榜。</p>
      </div>
      <div class="summit-hero-card">
        <strong>{{ lineup?.formation ?? '4-3-3' }}</strong>
        <span>PA 优先 · CA 辅助 · 位置匹配</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <h3>筛选范围</h3>
          <p>可按足联、国家、豪门、类型和 PA 区间生成不同维度的最佳阵容。</p>
        </div>
        <span class="status-pill">实时计算</span>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="足联">
          <ConfederationSelect v-model="filters.confederationId" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="filters.countryId" />
        </el-form-item>
        <el-form-item label="豪门">
          <ClubSelect v-model="filters.clubId" placeholder="全部豪门" />
        </el-form-item>
        <el-form-item label="球员类型">
          <PlayerTypeSelect v-model="filters.playerTypeId" />
        </el-form-item>
        <el-form-item label="PA 区间">
          <div class="range-fields">
            <el-input-number
              v-model="filters.minPa"
              :controls="false"
              :min="0"
              :max="250"
              placeholder="最低"
              @keyup.enter="submitFilters"
            />
            <span>-</span>
            <el-input-number
              v-model="filters.maxPa"
              :controls="false"
              :min="0"
              :max="250"
              placeholder="最高"
              @keyup.enter="submitFilters"
            />
          </div>
        </el-form-item>
        <div class="filter-actions">
          <el-button type="primary" :loading="loading" @click="submitFilters">生成阵容</el-button>
          <el-button :disabled="loading" @click="resetFilters">重置</el-button>
        </div>
      </el-form>
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      <div class="detail-actions">
        <el-button type="primary" @click="loadLineup">重试</el-button>
      </div>
    </div>

    <div v-if="loading && !lineup" class="panel">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else-if="lineup">
      <div v-if="!hasStarters" class="panel empty-panel">
        <h3>暂无匹配阵容</h3>
        <p>可以调整筛选条件，或先录入更多球员数据。</p>
      </div>

      <div v-else class="summit-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>首发 11 人</h3>
            <span class="status-pill">{{ lineup.formation }}</span>
          </div>

          <div class="summit-pitch">
            <div
              v-for="(row, rowIndex) in [
                starterRows.forwards,
                starterRows.midfielders,
                starterRows.defenders,
                starterRows.keeper
              ]"
              :key="rowIndex"
              class="summit-row"
            >
              <button
                v-for="(starter, playerIndex) in row"
                :key="starter?.slot ?? `${rowIndex}-${playerIndex}`"
                class="summit-player"
                type="button"
                :disabled="!starter?.player"
                @click="openPlayer(starter?.player ?? null)"
              >
                <span>{{ starter?.label ?? '-' }}</span>
                <strong>{{ starter?.player?.chineseName ?? '待定' }}</strong>
                <em
                  >PA {{ formatPa(starter?.player?.pa) }} ·
                  {{ starter?.player?.primaryRole ?? '-' }}</em
                >
              </button>
            </div>
          </div>
        </div>

        <div class="page-stack">
          <div class="panel">
            <div class="panel-header">
              <h3>替补候选</h3>
              <span class="status-pill">每组 Top 5</span>
            </div>

            <div class="bench-groups">
              <div
                v-for="benchGroup in lineup.benchCandidates"
                :key="benchGroup.group"
                class="bench-group"
              >
                <div class="bench-group-title">{{ benchGroup.group }}</div>
                <div v-if="!benchGroup.players.length" class="mini-empty">暂无候选</div>
                <button
                  v-for="player in benchGroup.players"
                  :key="player.id"
                  class="bench-player"
                  type="button"
                  @click="openPlayer(player)"
                >
                  <span>{{ player.chineseName }}</span>
                  <em>PA {{ formatPa(player.pa) }} · {{ formatRef(player.country) }}</em>
                </button>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>位置候选榜</h3>
              <span class="status-pill">{{ candidateTotal }} 人</span>
            </div>

            <div class="header-strip">
              <button
                v-for="group in lineup.groups"
                :key="group"
                class="filter-chip"
                :class="{ active: filters.group === group }"
                type="button"
                @click="filters.group = group"
              >
                {{ group }}
              </button>
            </div>

            <el-skeleton v-if="candidatesLoading && !candidates.length" :rows="6" animated />

            <div v-else-if="!candidates.length" class="mini-empty">暂无候选球员</div>

            <template v-else>
              <el-table :data="candidates" border @row-click="openPlayer">
                <el-table-column label="球员" min-width="150" fixed>
                  <template #default="{ row }">
                    <EntityNameCell
                      :id="row.id"
                      type="player"
                      :title="row.chineseName"
                      :subtitle="row.englishName || row.uid"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="pa" label="PA" width="80" />
                <el-table-column prop="ca" label="CA" width="80" />
                <el-table-column label="国家" min-width="110">
                  <template #default="{ row }">
                    <EntityLink
                      :id="row.country?.id"
                      type="country"
                      :name="formatRef(row.country)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="positions"
                  label="位置"
                  min-width="140"
                  show-overflow-tooltip
                />
              </el-table>

              <div class="table-footer">
                <el-pagination
                  v-model:current-page="filters.page"
                  v-model:page-size="filters.pageSize"
                  :page-sizes="[10, 20, 50]"
                  layout="total, sizes, prev, pager, next"
                  :total="candidateTotal"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

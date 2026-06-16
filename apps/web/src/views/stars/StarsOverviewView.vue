<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  fetchCountries,
  fetchPlayers,
  type CountryListItem,
  type NamedRef,
  type PlayerListItem
} from '@/services/catalog';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const players = ref<PlayerListItem[]>([]);
const total = ref(0);
const countries = ref<CountryListItem[]>([]);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  confederationId: '',
  position: '',
  minPa: undefined as number | undefined,
  maxPa: undefined as number | undefined
});

const confederations = computed<NamedRef[]>(() => {
  const refs = new Map<string, NamedRef>();

  for (const country of countries.value) {
    if (country.federationRef) {
      refs.set(country.federationRef.id, country.federationRef);
    }
  }

  return [...refs.values()].sort((current, next) =>
    current.name.localeCompare(next.name, 'zh-Hans-CN')
  );
});

const hasRows = computed(() => players.value.length > 0);

async function loadFilterOptions() {
  const result = await fetchCountries({
    page: 1,
    pageSize: 200
  });
  countries.value = result.items;
}

async function loadPlayers() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchPlayers({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      confederationId: filters.confederationId || undefined,
      position: filters.position || undefined,
      minPa: filters.minPa,
      maxPa: filters.maxPa,
      sortBy: 'pa',
      sortOrder: 'desc'
    });
    players.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '巨星数据加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.confederationId = '';
  filters.position = '';
  filters.minPa = undefined;
  filters.maxPa = undefined;
  void loadPlayers();
}

function submitFilters() {
  filters.page = 1;
  void loadPlayers();
}

function openDetail(player: PlayerListItem) {
  void router.push({
    name: 'stars-detail-id',
    params: {
      id: player.id
    }
  });
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadPlayers();
  }
);

onMounted(async () => {
  await loadFilterOptions();
  await loadPlayers();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>巨星概览</h2>
          <p>按真实导入数据浏览球员资料，支持基础筛选、分页和详情查看。</p>
        </div>
        <span class="status-pill">真实数据</span>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="姓名 / 英文名 / UID / 国家 / 俱乐部"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="足联">
          <el-select v-model="filters.confederationId" clearable placeholder="全部足联">
            <el-option
              v-for="confederation in confederations"
              :key="confederation.id"
              :label="confederation.name"
              :value="confederation.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="位置">
          <el-input
            v-model="filters.position"
            clearable
            placeholder="ST / MC / GK"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="PA 区间">
          <div class="range-fields">
            <el-input-number v-model="filters.minPa" :min="0" :max="250" placeholder="最低" />
            <span>-</span>
            <el-input-number v-model="filters.maxPa" :min="0" :max="250" placeholder="最高" />
          </div>
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

    <div class="panel">
      <div class="panel-header">
        <h3>球员列表</h3>
        <span class="status-pill">{{ total }} 人</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无巨星数据</h3>
        <p>可以先到天机阁导入数据，或调整当前筛选条件。</p>
      </div>

      <template v-else>
        <el-table :data="players" border @row-click="openDetail">
          <el-table-column prop="chineseName" label="球员" min-width="170" fixed>
            <template #default="{ row }">
              <div class="player-name-cell">
                <strong>{{ row.chineseName }}</strong>
                <span>{{ row.englishName || row.uid }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="pa" label="PA" width="90" sortable />
          <el-table-column prop="ca" label="CA" width="90" />
          <el-table-column prop="primaryRole" label="主要位置" width="110" />
          <el-table-column prop="positions" label="位置" min-width="150" show-overflow-tooltip />
          <el-table-column label="国家" min-width="120">
            <template #default="{ row }">{{ formatRef(row.country) }}</template>
          </el-table-column>
          <el-table-column label="俱乐部" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">{{ formatRef(row.club) }}</template>
          </el-table-column>
          <el-table-column label="足联" min-width="120">
            <template #default="{ row }">{{ formatRef(row.confederationRef) }}</template>
          </el-table-column>
          <el-table-column label="类型" min-width="120">
            <template #default="{ row }">{{ formatRef(row.playerTypeRef) }}</template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.deceased" type="info">已故</el-tag>
              <el-tag v-else-if="row.retired" type="warning">退役</el-tag>
              <el-tag v-else type="success">现役</el-tag>
            </template>
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
  </section>
</template>

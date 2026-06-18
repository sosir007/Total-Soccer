<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchCountries, type CountryListItem, type NamedRef } from '@/services/catalog';
import { ConfederationSelect } from '@/components/selects';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const countries = ref<CountryListItem[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  confederationId: ''
});

const hasRows = computed(() => countries.value.length > 0);

async function loadCountries() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchCountries({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      confederationId: filters.confederationId || undefined,
      sortBy: 'honorScore',
      sortOrder: 'desc'
    });
    countries.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '国家数据加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadCountries();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.confederationId = '';
  void loadCountries();
}

function openDetail(country: CountryListItem) {
  void router.push({
    name: 'nations-detail-id',
    params: {
      id: country.id
    }
  });
}

function formatNumber(value?: number | null, digits = 0) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadCountries();
  }
);

onMounted(() => {
  void loadCountries();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>国家概览</h2>
          <p>浏览国家队基础统计、PA 汇总和荣誉分表现。</p>
        </div>
        <span class="status-pill">真实数据</span>
      </div>

      <el-form
        class="filter-grid compact-filter"
        label-position="top"
        @submit.prevent="submitFilters"
      >
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="国家 / UID / 足联"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="足联">
          <ConfederationSelect v-model="filters.confederationId" />
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
        <h3>国家列表</h3>
        <span class="status-pill">{{ total }} 个国家</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无国家数据</h3>
        <p>可以先到天机阁导入数据，或调整当前筛选条件。</p>
      </div>

      <template v-else>
        <el-table :data="countries" border @row-click="openDetail">
          <el-table-column prop="name" label="国家" min-width="140" fixed>
            <template #default="{ row }">
              <div class="player-name-cell">
                <strong>{{ row.name }}</strong>
                <span>UID {{ row.uid }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="足联" min-width="120">
            <template #default="{ row }">{{ formatRef(row.federationRef) }}</template>
          </el-table-column>
          <el-table-column prop="playerCount" label="球员数" width="100" sortable />
          <el-table-column prop="totalPa" label="总 PA" width="110" sortable />
          <el-table-column label="平均 PA" width="110">
            <template #default="{ row }">{{ formatNumber(row.averagePa, 2) }}</template>
          </el-table-column>
          <el-table-column prop="medalCount" label="奖牌数" width="100" />
          <el-table-column prop="championCount" label="冠军数" width="100" />
          <el-table-column label="荣誉分" width="120">
            <template #default="{ row }">{{ formatNumber(row.honorScore, 2) }}</template>
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

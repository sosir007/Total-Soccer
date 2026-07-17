<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchCountryHonorSummary } from '@/services/modules/catalog';
import type { HonorSummaryCompetition, HonorSummaryRow } from '@/services/types/catalog';
import IconFont from '@/components/IconFont.vue';
import HonorSummaryMatrix from '@/components/honors/HonorSummaryMatrix.vue';
import NoDataView from '@/components/NoDataView.vue';
import { CompetitionSelect, CountrySelect } from '@/components/selects';

const loading = ref(false);
const errorMessage = ref('');
const rows = ref<HonorSummaryRow[]>([]);
const competitions = ref<HonorSummaryCompetition[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  competitionId: '',
  countryId: ''
});

const hasRows = computed(() => rows.value.length > 0);

async function loadHonors() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchCountryHonorSummary({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      competitionId: filters.competitionId || undefined,
      countryId: filters.countryId || undefined
    });
    rows.value = result.items;
    competitions.value = result.competitions;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '国家荣誉加载失败。';
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
  filters.competitionId = '';
  filters.countryId = '';
  void loadHonors();
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
          <h2>国家荣誉</h2>
          <p>查看国家队赛事历届最终名次，统计来源为赛事管理录入结果。</p>
        </div>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="国家 / 赛事 / 届次 / 主办地"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="赛事">
          <CompetitionSelect v-model="filters.competitionId" target-type="COUNTRY" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="filters.countryId" />
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
        <h3>荣誉矩阵</h3>
        <span class="status-pill">{{ total }} 支球队</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <NoDataView
        v-else-if="!hasRows"
        text="暂无国家荣誉，可以先到天机阁创建国家队赛事，并录入名次结果。"
      />

      <template v-else>
        <HonorSummaryMatrix
          :rows="rows"
          :competitions="competitions"
          entity-type="country"
          :page="filters.page"
          :page-size="filters.pageSize"
        />

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

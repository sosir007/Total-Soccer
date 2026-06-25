<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchCountryHonors, type HonorRecord } from '@/services/catalog';
import { type CompetitionStandingPlacement } from '@/services/competitions';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import { CompetitionSelect, CountrySelect } from '@/components/selects';
import {
  formatHonorEdition,
  formatPlacement,
  getCountryEntityLinkId,
  getStandingRef,
  placementOptions,
  shouldHideCountryLink
} from '@/utils/honor';

const loading = ref(false);
const errorMessage = ref('');
const records = ref<HonorRecord[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  competitionId: '',
  placement: '' as '' | CompetitionStandingPlacement,
  year: undefined as number | undefined,
  countryId: ''
});

const hasRows = computed(() => records.value.length > 0);

async function loadHonors() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchCountryHonors({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      competitionId: filters.competitionId || undefined,
      placement: filters.placement || undefined,
      year: filters.year,
      countryId: filters.countryId || undefined
    });
    records.value = result.items;
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
  filters.placement = '';
  filters.year = undefined;
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
        <span class="status-pill">真实数据</span>
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
          <el-button type="primary" :loading="loading" @click="submitFilters">筛选</el-button>
          <el-button :disabled="loading" @click="resetFilters">重置</el-button>
        </div>
        <el-form-item label="名次">
          <el-select v-model="filters.placement" clearable placeholder="全部名次">
            <el-option
              v-for="placement in placementOptions"
              :key="placement.value"
              :label="placement.label"
              :value="placement.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年份">
          <el-input-number v-model="filters.year" :min="1800" :max="2200" placeholder="全部年份" />
        </el-form-item>
      </el-form>
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>荣誉明细</h3>
        <span class="status-pill">{{ total }} 条记录</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无国家荣誉</h3>
        <p>可以先到天机阁创建国家队赛事，并录入冠亚季殿。</p>
      </div>

      <template v-else>
        <el-table :data="records" border>
          <el-table-column label="赛事" min-width="160" fixed>
            <template #default="{ row }">
              <EntityNameCell
                :id="row.competition.id"
                type="competition"
                :title="row.competition.name"
                :subtitle="
                  row.competition.category || row.competition.level || row.competition.code
                "
              />
            </template>
          </el-table-column>
          <el-table-column label="届次 / 赛季" min-width="150">
            <template #default="{ row }">{{ formatHonorEdition(row) }}</template>
          </el-table-column>
          <el-table-column label="年份" width="90">
            <template #default="{ row }">{{ row.edition.year || '-' }}</template>
          </el-table-column>
          <el-table-column label="国家" min-width="130">
            <template #default="{ row }">
              <EntityLink
                :id="getCountryEntityLinkId(row.country)"
                type="country"
                :name="row.country?.name"
                :disabled="shouldHideCountryLink(row.country)"
              />
            </template>
          </el-table-column>
          <el-table-column label="名次" width="90">
            <template #default="{ row }">
              <el-tag :type="row.placement === 'CHAMPION' ? 'warning' : 'success'">
                {{ formatPlacement(row.placement) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="冠军" min-width="120">
            <template #default="{ row }">
              <EntityLink
                :id="getCountryEntityLinkId(getStandingRef(row, 'CHAMPION'))"
                type="country"
                :name="getStandingRef(row, 'CHAMPION')?.name"
                :disabled="shouldHideCountryLink(getStandingRef(row, 'CHAMPION'))"
              />
            </template>
          </el-table-column>
          <el-table-column label="亚军" min-width="120">
            <template #default="{ row }">
              <EntityLink
                :id="getCountryEntityLinkId(getStandingRef(row, 'RUNNER_UP'))"
                type="country"
                :name="getStandingRef(row, 'RUNNER_UP')?.name"
                :disabled="shouldHideCountryLink(getStandingRef(row, 'RUNNER_UP'))"
              />
            </template>
          </el-table-column>
          <el-table-column label="季军" min-width="120">
            <template #default="{ row }">
              <EntityLink
                :id="getCountryEntityLinkId(getStandingRef(row, 'THIRD_PLACE'))"
                type="country"
                :name="getStandingRef(row, 'THIRD_PLACE')?.name"
                :disabled="shouldHideCountryLink(getStandingRef(row, 'THIRD_PLACE'))"
              />
            </template>
          </el-table-column>
          <el-table-column label="殿军" min-width="120">
            <template #default="{ row }">
              <EntityLink
                :id="getCountryEntityLinkId(getStandingRef(row, 'FOURTH_PLACE'))"
                type="country"
                :name="getStandingRef(row, 'FOURTH_PLACE')?.name"
                :disabled="shouldHideCountryLink(getStandingRef(row, 'FOURTH_PLACE'))"
              />
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

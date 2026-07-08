<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteCountry, fetchCountries, fetchCountryDetail } from '@/services/modules/catalog';
import type { CountryDetail, CountryListItem } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import IconFont from '@/components/IconFont.vue';
import CountryFormDialog from '@/components/catalog/CountryFormDialog.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { ConfederationSelect } from '@/components/selects';
import { useOptionStore } from '@/stores/options';
import { getConfederationVariant } from '@/utils/tag-theme';

const optionStore = useOptionStore();
const loading = ref(false);
const errorMessage = ref('');
const countries = ref<CountryListItem[]>([]);
const total = ref(0);
const countryDialogVisible = ref(false);
const editingCountry = ref<CountryDetail | null>(null);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  confederationId: '',
  sortBy: 'totalPa',
  sortOrder: 'desc' as 'asc' | 'desc',
  includeHidden: false
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
      includeHidden: filters.includeHidden,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
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
  filters.includeHidden = false;
  void loadCountries();
}

function changeListMode(includeHidden: boolean) {
  filters.includeHidden = includeHidden;
  filters.page = 1;
  void loadCountries();
}

function openCreateDialog() {
  editingCountry.value = null;
  countryDialogVisible.value = true;
}

function handleCountrySaved() {
  void loadCountries();
}

async function openEditDialog(country: CountryListItem) {
  try {
    editingCountry.value = await fetchCountryDetail(country.id);
    countryDialogVisible.value = true;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '国家详情加载失败。');
  }
}

async function confirmDelete(country: CountryListItem) {
  try {
    await ElMessageBox.confirm(
      `确定要删除「${country.name}」吗？如果已有球员、城市、赛事或荣誉关联，系统会阻止删除。`,
      '删除国家',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    await deleteCountry(country.id);
    ElMessage.success('国家已删除。');
    optionStore.invalidate('countries');
    await loadCountries();
  } catch (error) {
    if (error === 'cancel') {
      return;
    }

    ElMessage.error(error instanceof Error ? error.message : '国家删除失败。');
  }
}

function rowIndex(index: number) {
  return (filters.page - 1) * filters.pageSize + index + 1;
}

function handleSortChange({
  prop,
  order
}: {
  prop?: string;
  order?: 'ascending' | 'descending' | null;
}) {
  filters.page = 1;
  filters.sortBy = prop || 'totalPa';
  filters.sortOrder = order === 'ascending' ? 'asc' : 'desc';
  void loadCountries();
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

function formatConfederation(ref?: NamedRef | null) {
  return ref?.name ?? '';
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
        <div class="panel-actions">
          <el-button type="primary" @click="openCreateDialog">
            <IconFont name="add" />
            新增国家
          </el-button>
        </div>
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
        <el-form-item label="列表范围">
          <el-segmented
            :model-value="filters.includeHidden ? 'all' : 'default'"
            :options="[
              { label: '默认国家', value: 'default' },
              { label: '全部普通国家', value: 'all' }
            ]"
            @change="changeListMode($event === 'all')"
          />
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
        <h3>国家列表</h3>
        <span class="status-pill">{{ total }} 个国家</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无国家数据</h3>
        <p>可以先到天机阁导入数据，或调整当前筛选条件。</p>
      </div>

      <template v-else>
        <el-table
          :data="countries"
          border
          :default-sort="{ prop: 'totalPa', order: 'descending' }"
          @sort-change="handleSortChange"
        >
          <el-table-column label="序号" width="60" align="center" fixed>
            <template #default="{ $index }">{{ rowIndex($index) }}</template>
          </el-table-column>
          <el-table-column label="足联" width="100" fixed>
            <template #default="{ row }">
              <SemanticTag
                v-if="formatConfederation(row.federationRef)"
                :variant="getConfederationVariant(formatConfederation(row.federationRef))"
              >
                {{ formatConfederation(row.federationRef) }}
              </SemanticTag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="国家" min-width="160" fixed>
            <template #default="{ row }">
              <EntityNameCell
                :id="row.id"
                type="country"
                :title="row.name"
                :subtitle="`UID ${row.uid}`"
              />
            </template>
          </el-table-column>
          <el-table-column prop="playerCount" label="球员数" min-width="120" sortable />
          <el-table-column prop="totalPa" label="总 PA" min-width="120" sortable="custom" />
          <el-table-column prop="averagePa" label="平均 PA" min-width="120" sortable="custom">
            <template #default="{ row }">{{ formatNumber(row.averagePa, 2) }}</template>
          </el-table-column>
          <el-table-column prop="medalCount" label="奖牌数" min-width="120" sortable="custom" />
          <el-table-column prop="championCount" label="冠军数" min-width="120" sortable="custom" />
          <el-table-column prop="honorScore" label="荣誉分" min-width="120" sortable="custom">
            <template #default="{ row }">{{ formatNumber(row.honorScore, 2) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click.stop="openEditDialog(row)">
                <IconFont name="edit" />
                编辑
              </el-button>
              <el-button link type="danger" @click.stop="confirmDelete(row)">
                <IconFont name="delete" />
                删除
              </el-button>
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

    <CountryFormDialog
      v-model="countryDialogVisible"
      :country="editingCountry"
      @saved="handleCountrySaved"
    />
  </section>
</template>

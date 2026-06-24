<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  deleteClub,
  fetchClubDetail,
  fetchClubs,
  type ClubDetail,
  type ClubListItem,
  type NamedRef
} from '@/services/catalog';
import ClubFormDialog from '@/components/catalog/ClubFormDialog.vue';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import { ConfederationSelect, CountrySelect } from '@/components/selects';
import { useOptionStore } from '@/stores/options';

const router = useRouter();
const optionStore = useOptionStore();
const loading = ref(false);
const errorMessage = ref('');
const clubs = ref<ClubListItem[]>([]);
const total = ref(0);
const clubDialogVisible = ref(false);
const editingClub = ref<ClubDetail | null>(null);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  confederationId: '',
  countryId: '',
  sortBy: 'honorScore',
  sortOrder: 'desc' as 'asc' | 'desc'
});

const hasRows = computed(() => clubs.value.length > 0);

async function loadClubs() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchClubs({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      confederationId: filters.confederationId || undefined,
      countryId: filters.countryId || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    });
    clubs.value = result.items;
    total.value = result.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '豪门数据加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function submitFilters() {
  filters.page = 1;
  void loadClubs();
}

function resetFilters() {
  filters.page = 1;
  filters.keyword = '';
  filters.confederationId = '';
  filters.countryId = '';
  void loadClubs();
}

function openCreateDialog() {
  editingClub.value = null;
  clubDialogVisible.value = true;
}

function handleClubSaved() {
  void loadClubs();
}

async function openEditDialog(club: ClubListItem) {
  try {
    editingClub.value = await fetchClubDetail(club.id);
    clubDialogVisible.value = true;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '俱乐部详情加载失败。');
  }
}

async function confirmDelete(club: ClubListItem) {
  try {
    await ElMessageBox.confirm(
      `确定要删除「${club.name}」吗？如果已有球员、经历、赛事或荣誉关联，系统会阻止删除。`,
      '删除俱乐部',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    await deleteClub(club.id);
    ElMessage.success('俱乐部已删除。');
    optionStore.invalidate('clubs');
    await loadClubs();
  } catch (error) {
    if (error === 'cancel') {
      return;
    }

    ElMessage.error(error instanceof Error ? error.message : '俱乐部删除失败。');
  }
}

function openDetail(club: ClubListItem) {
  void router.push({
    name: 'clubs-detail-id',
    params: {
      id: club.id
    }
  });
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
  filters.sortBy = prop || 'honorScore';
  filters.sortOrder = order === 'ascending' ? 'asc' : 'desc';
  void loadClubs();
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
    void loadClubs();
  }
);

onMounted(() => {
  void loadClubs();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>豪门概览</h2>
          <p>浏览俱乐部基础统计、国家归属、足联归属和荣誉分表现。</p>
        </div>
        <div class="panel-actions">
          <span class="status-pill">真实数据</span>
          <el-button type="primary" @click="openCreateDialog">新增俱乐部</el-button>
        </div>
      </div>

      <el-form class="filter-grid" label-position="top" @submit.prevent="submitFilters">
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            clearable
            placeholder="俱乐部 / UID / 国家 / 足联"
            @keyup.enter="submitFilters"
          />
        </el-form-item>
        <el-form-item label="足联">
          <ConfederationSelect v-model="filters.confederationId" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="filters.countryId" />
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
        <h3>豪门列表</h3>
        <span class="status-pill">{{ total }} 家俱乐部</span>
      </div>

      <el-skeleton v-if="loading && !hasRows" :rows="8" animated />

      <div v-else-if="!hasRows" class="empty-panel">
        <h3>暂无豪门数据</h3>
        <p>可以先到天机阁导入数据，或调整当前筛选条件。</p>
      </div>

      <template v-else>
        <el-table :data="clubs" border @row-click="openDetail" @sort-change="handleSortChange">
          <el-table-column label="序号" width="76" fixed>
            <template #default="{ $index }">{{ rowIndex($index) }}</template>
          </el-table-column>
          <el-table-column prop="name" label="俱乐部" min-width="170" fixed>
            <template #default="{ row }">
              <EntityNameCell
                :id="row.id"
                type="club"
                :title="row.name"
                :subtitle="`UID ${row.uid}`"
              />
            </template>
          </el-table-column>
          <el-table-column label="国家" min-width="120">
            <template #default="{ row }">
              <EntityLink
                :id="row.countryRef?.id"
                type="country"
                :name="formatRef(row.countryRef)"
              />
            </template>
          </el-table-column>
          <el-table-column label="足联" min-width="120">
            <template #default="{ row }">{{ formatRef(row.federationRef) }}</template>
          </el-table-column>
          <el-table-column prop="playerCount" label="球员数" width="100" sortable />
          <el-table-column prop="totalPa" label="总 PA" width="110" sortable="custom" />
          <el-table-column prop="averagePa" label="平均 PA" width="110" sortable="custom">
            <template #default="{ row }">{{ formatNumber(row.averagePa, 2) }}</template>
          </el-table-column>
          <el-table-column prop="trophyCount" label="奖杯数" width="100" sortable="custom" />
          <el-table-column prop="championCount" label="冠军数" width="100" sortable="custom" />
          <el-table-column prop="honorScore" label="荣誉分" width="120" sortable="custom">
            <template #default="{ row }">{{ formatNumber(row.honorScore, 2) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click.stop="openEditDialog(row)">编辑</el-button>
              <el-button link type="danger" @click.stop="confirmDelete(row)">删除</el-button>
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

    <ClubFormDialog v-model="clubDialogVisible" :club="editingClub" @saved="handleClubSaved" />
  </section>
</template>

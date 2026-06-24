<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deletePlayer, fetchPlayers, type NamedRef, type PlayerListItem } from '@/services/catalog';
import {
  ClubSelect,
  ConfederationSelect,
  CountrySelect,
  PositionSelect
} from '@/components/selects';
import { useAppStore } from '@/stores/app';

const router = useRouter();
const appStore = useAppStore();
const loading = ref(false);
const errorMessage = ref('');
const players = ref<PlayerListItem[]>([]);
const total = ref(0);
const filters = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  confederationId: '',
  countryId: '',
  clubId: '',
  position: '',
  minPa: 0,
  maxPa: 200
});

const hasRows = computed(() => players.value.length > 0);

async function loadPlayers() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await fetchPlayers({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword || undefined,
      confederationId: filters.confederationId || undefined,
      countryId: filters.countryId || undefined,
      clubId: filters.clubId || undefined,
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
  filters.countryId = '';
  filters.clubId = '';
  filters.position = '';
  filters.minPa = 0;
  filters.maxPa = 200;
  void loadPlayers();
}

function openCreateDialog() {
  void router.push({ name: 'stars-new' });
}

function openEditDialog(player: PlayerListItem) {
  void router.push({
    name: 'stars-edit-id',
    params: { id: player.id }
  });
}

async function confirmDelete(player: PlayerListItem) {
  try {
    await ElMessageBox.confirm(
      `确定要删除「${player.chineseName}」吗？如果已有奖项、荣誉等关联，系统会阻止删除。`,
      '删除球员',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    await deletePlayer(player.id);
    ElMessage.success('球员已删除。');
    await loadPlayers();
  } catch (error) {
    if (error === 'cancel') {
      return;
    }

    ElMessage.error(error instanceof Error ? error.message : '球员删除失败。');
  }
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

function openCountryDetail(country?: NamedRef | null) {
  if (!country?.id) {
    return;
  }

  void router.push({
    name: 'nations-detail-id',
    params: {
      id: country.id
    }
  });
}

function openClubDetail(club?: NamedRef | null) {
  if (!club?.id) {
    return;
  }

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

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatDate(value?: string | number | null) {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-';
}

function formatAge(player: PlayerListItem) {
  if (player.deceased || player.deathDate) {
    return '-';
  }

  if (!player.birthDate) {
    return formatText(player.age);
  }

  const birthDate = dayjs(player.birthDate);

  if (!birthDate.isValid()) {
    return formatText(player.age);
  }

  if (birthDate.isAfter(dayjs(), 'day')) {
    return formatText(player.age);
  }

  return dayjs().diff(birthDate, 'year');
}

function formatNationality(player: PlayerListItem) {
  const names = player.nationalities?.map((item) => item.country.name).filter(Boolean);

  return names?.length ? names.join('、') : formatText(player.nationality);
}

function formatBirthCity(player: PlayerListItem) {
  const city = player.birthCityRef?.name ?? player.birthCity;
  const country = player.birthCityRef?.country?.name ?? player.birthCountry?.name;

  if (!city) {
    return '-';
  }

  return country ? `${city}（${country}）` : city;
}

function formatBirthCityUid(player: PlayerListItem) {
  return player.birthCityRef?.uid ?? player.birthCityUid ?? '-';
}

function getRepresentativeClub(player: PlayerListItem) {
  return player.representativeClubCareer?.club ?? player.club;
}

function formatRepresentativeClubName(player: PlayerListItem) {
  return player.representativeClubName ?? player.primaryClub ?? '-';
}

function formatRepresentativeClubUid(player: PlayerListItem) {
  const club = getRepresentativeClub(player);

  return club?.uid ?? player.clubUid ?? '-';
}

function formatProfileClubs(player: PlayerListItem) {
  return player.profileClubNames?.length
    ? player.profileClubNames.join('、')
    : formatText(player.clubs);
}

function formatFoot(player: PlayerListItem) {
  return formatText(player.foot || player.preferredFootRef?.name);
}

function formatEthnicity(player: PlayerListItem) {
  return formatText(player.ethnicityRef?.name || player.ethnicity);
}

function formatBoolean(value?: boolean | null) {
  if (value === true) {
    return '是';
  }

  if (value === false) {
    return '否';
  }

  return '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatMarketValue(value?: number | null) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: 2
  }).format(value);
}

watch(
  () => [filters.page, filters.pageSize],
  () => {
    void loadPlayers();
  }
);

watch(
  () => appStore.playerListRefreshKey,
  () => {
    void loadPlayers();
  }
);

onMounted(() => {
  void loadPlayers();
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
        <div class="panel-actions">
          <span class="status-pill">真实数据</span>
          <el-button type="primary" @click="openCreateDialog">新增球员</el-button>
        </div>
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
          <ConfederationSelect v-model="filters.confederationId" />
        </el-form-item>
        <el-form-item label="国家">
          <CountrySelect v-model="filters.countryId" />
        </el-form-item>
        <el-form-item label="俱乐部">
          <ClubSelect v-model="filters.clubId" />
        </el-form-item>
        <el-form-item label="位置">
          <PositionSelect v-model="filters.position" placeholder="全部位置" />
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
        <el-table :data="players" border>
          <el-table-column label="序号" width="76" fixed>
            <template #default="{ $index }">{{ rowIndex($index) }}</template>
          </el-table-column>
          <el-table-column prop="uid" label="UID" width="110" fixed />
          <el-table-column prop="chineseName" label="球员" min-width="170" fixed>
            <template #default="{ row }">
              <button
                class="table-name-link player-name-cell"
                type="button"
                @click="openDetail(row)"
              >
                <strong>{{ row.chineseName }}</strong>
                <span>{{ row.englishName || row.uid }}</span>
              </button>
            </template>
          </el-table-column>
          <el-table-column prop="pa" label="PA" width="90" sortable />
          <el-table-column prop="honorScore" label="荣誉分" width="100" sortable>
            <template #default="{ row }">{{ formatText(row.honorScore) }}</template>
          </el-table-column>
          <el-table-column prop="birthDate" label="生日" width="120" sortable>
            <template #default="{ row }">{{ formatDate(row.birthDate) }}</template>
          </el-table-column>
          <el-table-column label="过世" width="120">
            <template #default="{ row }">{{ formatDate(row.deathDate) }}</template>
          </el-table-column>
          <el-table-column label="年龄" width="80">
            <template #default="{ row }">{{ formatAge(row) }}</template>
          </el-table-column>
          <el-table-column prop="primaryRole" label="代表位置" width="110" />
          <el-table-column prop="positions" label="位置" min-width="150" show-overflow-tooltip />
          <el-table-column prop="height" label="身高" width="80" sortable />
          <el-table-column prop="weight" label="体重" width="80" sortable />
          <el-table-column prop="shirtNumber" label="球衣" width="80" />
          <el-table-column prop="skinTone" label="肤色" width="90" />
          <el-table-column prop="hairColor" label="发色" width="100" show-overflow-tooltip />
          <el-table-column label="种族" width="90" show-overflow-tooltip>
            <template #default="{ row }">{{ formatEthnicity(row) }}</template>
          </el-table-column>
          <el-table-column label="左右脚" width="100" show-overflow-tooltip>
            <template #default="{ row }">{{ formatFoot(row) }}</template>
          </el-table-column>
          <el-table-column label="足联" min-width="120">
            <template #default="{ row }">{{ formatRef(row.confederationRef) }}</template>
          </el-table-column>
          <el-table-column label="代表国籍" min-width="150">
            <template #default="{ row }">
              <button
                v-if="row.country"
                class="table-name-link table-ref-card"
                type="button"
                @click="openCountryDetail(row.country)"
              >
                <strong>{{ row.country.name }}</strong>
                <span>UID {{ row.country.uid || row.countryUid || '-' }}</span>
              </button>
              <div v-else class="table-ref-card">
                <strong>{{ row.representedCountry || '-' }}</strong>
                <span>UID {{ row.countryUid || '-' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="国籍" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">{{ formatNationality(row) }}</template>
          </el-table-column>
          <el-table-column label="出生城市" min-width="220" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="table-ref-card">
                <strong>{{ formatBirthCity(row) }}</strong>
                <span>UID {{ formatBirthCityUid(row) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="代表球队" min-width="170" show-overflow-tooltip>
            <template #default="{ row }">
              <button
                v-if="getRepresentativeClub(row)"
                class="table-name-link table-ref-card"
                type="button"
                @click="openClubDetail(getRepresentativeClub(row))"
              >
                <strong>{{ formatRepresentativeClubName(row) }}</strong>
                <span>UID {{ formatRepresentativeClubUid(row) }}</span>
              </button>
              <div v-else class="table-ref-card">
                <strong>{{ formatRepresentativeClubName(row) }}</strong>
                <span>UID {{ formatRepresentativeClubUid(row) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="initialClub"
            label="初始球队"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column label="球队经历" min-width="260" show-overflow-tooltip>
            <template #default="{ row }">{{ formatProfileClubs(row) }}</template>
          </el-table-column>
          <el-table-column label="类型" min-width="120">
            <template #default="{ row }">{{ formatRef(row.playerTypeRef) }}</template>
          </el-table-column>
          <el-table-column label="市场价值" width="120">
            <template #default="{ row }">{{ formatMarketValue(row.marketValue) }}</template>
          </el-table-column>
          <el-table-column label="是否退役" width="100">
            <template #default="{ row }">{{ formatBoolean(row.retired) }}</template>
          </el-table-column>
          <el-table-column label="是否去世" width="100">
            <template #default="{ row }">{{ formatBoolean(row.deceased) }}</template>
          </el-table-column>
          <el-table-column prop="databaseSource" label="数据库" width="100" />
          <el-table-column
            prop="staffRoles"
            label="担任过职位"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="achievement" label="成就" min-width="240" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.deceased" type="info">已故</el-tag>
              <el-tag v-else-if="row.retired" type="warning">退役</el-tag>
              <el-tag v-else type="success">现役</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click.stop="openEditDialog(row)">编辑</el-button>
              <el-button type="danger" link @click.stop="confirmDelete(row)">删除</el-button>
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

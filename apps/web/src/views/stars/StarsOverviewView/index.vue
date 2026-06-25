<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deletePlayer, fetchPlayers } from '@/services/modules/catalog';
import type { PlayerListItem } from '@/services/types/catalog';
import { useAppStore } from '@/stores/app';
import StarsFilterPanel from './components/StarsFilterPanel.vue';
import StarsTablePanel from './components/StarsTablePanel.vue';

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
    <StarsFilterPanel
      :filters="filters"
      :loading="loading"
      @submit="submitFilters"
      @reset="resetFilters"
      @create="openCreateDialog"
    />

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
    </div>

    <StarsTablePanel
      :players="players"
      :total="total"
      :loading="loading"
      :filters="filters"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />
  </section>
</template>

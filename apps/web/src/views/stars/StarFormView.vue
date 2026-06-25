<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import PlayerFormDialog from '@/components/catalog/PlayerFormDialog.vue';
import { fetchPlayerDetail, type PlayerDetail } from '@/services/catalog';
import { useAppStore } from '@/stores/app';
import { useRouteTabsStore } from '@/stores/route-tabs';

const route = useRoute();
const router = useRouter();
const routeTabsStore = useRouteTabsStore();
const appStore = useAppStore();
const player = ref<PlayerDetail | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const playerId = computed(() => String(route.params.id ?? ''));
const isEdit = computed(() => Boolean(playerId.value));
const pageTitle = computed(() => (isEdit.value ? '编辑球员' : '新增球员'));

async function loadPlayer() {
  if (!playerId.value) {
    player.value = null;
    routeTabsStore.setTitle(route.fullPath, '新增球员');
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const loadedPlayer = await fetchPlayerDetail(playerId.value);
    player.value = loadedPlayer;
    routeTabsStore.setTitle(route.fullPath, `编辑 ${loadedPlayer.chineseName}`);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '球员资料加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function goBack(refresh = false) {
  const currentPath = route.fullPath;
  if (refresh) {
    appStore.refreshPlayerList();
  }
  routeTabsStore.remove(currentPath);
  void router.push({ name: 'stars-overview' });
}

function handleSaved() {
  goBack(true);
}

watch(playerId, () => {
  void loadPlayer();
});

onMounted(() => {
  void loadPlayer();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>{{ pageTitle }}</h2>
          <p>维护球员基础资料、国籍、位置、身体数据、球队经历和结构化经历。</p>
        </div>
        <el-button :disabled="loading" @click="goBack(false)">返回巨星概览</el-button>
      </div>

      <el-alert
        v-if="errorMessage"
        type="error"
        :title="errorMessage"
        show-icon
        :closable="false"
      />
      <el-skeleton v-else-if="loading" :rows="12" animated />
      <PlayerFormDialog
        v-else
        display="page"
        :player="player"
        @saved="handleSaved"
        @cancelled="goBack(false)"
      />
    </div>
  </section>
</template>

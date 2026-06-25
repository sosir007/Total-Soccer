<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchPlayerDetail, type PlayerDetail } from '@/services/catalog';
import { useRouteTabsStore } from '@/stores/route-tabs';
import StarDetailContent from './components/StarDetailContent.vue';

defineOptions({
  name: 'StarDetailView'
});

const route = useRoute();
const router = useRouter();
const routeTabsStore = useRouteTabsStore();
const loading = ref(false);
const errorMessage = ref('');
const player = ref<PlayerDetail | null>(null);
const playerId = computed(() => String(route.params.id ?? ''));

async function loadPlayer() {
  if (!playerId.value) {
    player.value = null;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    player.value = await fetchPlayerDetail(playerId.value);
    routeTabsStore.setTitle(route.fullPath, player.value.chineseName);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '巨星详情加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function backToList() {
  void router.push({
    name: 'stars-overview'
  });
}

function openEditDialog() {
  if (!playerId.value) {
    return;
  }

  void router.push({
    name: 'stars-edit-id',
    params: { id: playerId.value }
  });
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
    <div v-if="!playerId" class="panel empty-panel">
      <h3>请选择巨星</h3>
      <p>从巨星概览进入详情，可以查看完整基础资料。</p>
      <el-button type="primary" @click="backToList">返回巨星概览</el-button>
    </div>

    <div v-else-if="loading" class="panel">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      <div class="detail-actions">
        <el-button @click="backToList">返回巨星概览</el-button>
        <el-button type="primary" @click="loadPlayer">重试</el-button>
      </div>
    </div>

    <StarDetailContent
      v-else-if="player"
      :player="player"
      @edit="openEditDialog"
      @back="backToList"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchClubDetail } from '@/services/modules/catalog';
import type { ClubDetail } from '@/services/types/catalog';
import ClubFormDialog from '@/components/catalog/ClubFormDialog.vue';
import { useRouteTabsStore } from '@/stores/route-tabs';
import ClubDetailContent from './components/ClubDetailContent.vue';

defineOptions({
  name: 'ClubDetailView'
});

const route = useRoute();
const router = useRouter();
const routeTabsStore = useRouteTabsStore();
const loading = ref(false);
const errorMessage = ref('');
const club = ref<ClubDetail | null>(null);
const clubDialogVisible = ref(false);
const clubId = computed(() => String(route.params.id ?? ''));

async function loadClub() {
  if (!clubId.value) {
    club.value = null;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const loadedClub = await fetchClubDetail(clubId.value);
    club.value = loadedClub;
    routeTabsStore.setTitle(route.fullPath, loadedClub.name);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '豪门详情加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function backToList() {
  void router.push({
    name: 'clubs-overview'
  });
}

function openEditDialog() {
  clubDialogVisible.value = true;
}

function openPlayerDetail(id?: string | null) {
  if (!id) {
    return;
  }

  void router.push({
    name: 'stars-detail-id',
    params: { id }
  });
}

function handleClubSaved(savedClub: ClubDetail) {
  club.value = savedClub;
  routeTabsStore.setTitle(route.fullPath, savedClub.name);
  void loadClub();
}

watch(clubId, () => {
  void loadClub();
});

onMounted(() => {
  void loadClub();
});
</script>

<template>
  <section class="page-stack">
    <div v-if="!clubId" class="panel empty-panel">
      <h3>请选择豪门</h3>
      <p>从豪门概览进入详情，可以查看俱乐部基础统计和荣誉摘要。</p>
      <el-button type="primary" @click="backToList">返回豪门概览</el-button>
    </div>

    <div v-else-if="loading" class="panel">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      <div class="detail-actions">
        <el-button @click="backToList">返回豪门概览</el-button>
        <el-button type="primary" @click="loadClub">重试</el-button>
      </div>
    </div>

    <template v-else-if="club">
      <ClubDetailContent
        :club="club"
        @edit="openEditDialog"
        @back="backToList"
        @open-player="openPlayerDetail"
      />

      <ClubFormDialog v-model="clubDialogVisible" :club="club" @saved="handleClubSaved" />
    </template>
  </section>
</template>

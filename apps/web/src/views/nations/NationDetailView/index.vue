<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchCountryDetail, type CountryDetail } from '@/services/catalog';
import CountryFormDialog from '@/components/catalog/CountryFormDialog.vue';
import { useRouteTabsStore } from '@/stores/route-tabs';
import NationDetailContent from './components/NationDetailContent.vue';

defineOptions({
  name: 'NationDetailView'
});

const route = useRoute();
const router = useRouter();
const routeTabsStore = useRouteTabsStore();
const loading = ref(false);
const errorMessage = ref('');
const country = ref<CountryDetail | null>(null);
const countryDialogVisible = ref(false);
const countryId = computed(() => String(route.params.id ?? ''));

async function loadCountry() {
  if (!countryId.value) {
    country.value = null;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    country.value = await fetchCountryDetail(countryId.value);
    routeTabsStore.setTitle(route.fullPath, country.value.name);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '国家详情加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
}

function backToList() {
  void router.push({
    name: 'nations-overview'
  });
}

function openEditDialog() {
  countryDialogVisible.value = true;
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

function handleCountrySaved(savedCountry: CountryDetail) {
  country.value = savedCountry;
  routeTabsStore.setTitle(route.fullPath, savedCountry.name);
  void loadCountry();
}

watch(countryId, () => {
  void loadCountry();
});

onMounted(() => {
  void loadCountry();
});
</script>

<template>
  <section class="page-stack">
    <div v-if="!countryId" class="panel empty-panel">
      <h3>请选择国家</h3>
      <p>从国家概览进入详情，可以查看国家队基础统计和荣誉摘要。</p>
      <el-button type="primary" @click="backToList">返回国家概览</el-button>
    </div>

    <div v-else-if="loading" class="panel">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      <div class="detail-actions">
        <el-button @click="backToList">返回国家概览</el-button>
        <el-button type="primary" @click="loadCountry">重试</el-button>
      </div>
    </div>

    <template v-else-if="country">
      <NationDetailContent
        :country="country"
        @edit="openEditDialog"
        @back="backToList"
        @open-player="openPlayerDetail"
      />

      <CountryFormDialog
        v-model="countryDialogVisible"
        :country="country"
        @saved="handleCountrySaved"
      />
    </template>
  </section>
</template>

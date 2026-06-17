<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchCountryDetail, type CountryDetail, type NamedRef } from '@/services/catalog';
import { buildExternalUrl } from '@/utils/external-link';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const country = ref<CountryDetail | null>(null);
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

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function countryExternalUrl() {
  return buildExternalUrl(country.value?.externalUrl, country.value?.name || '国家队');
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
      <div class="panel player-detail-hero">
        <div>
          <div class="detail-kicker">{{ formatRef(country.federationRef) }}</div>
          <a
            class="external-title-link"
            :href="countryExternalUrl()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>{{ country.name }}</h2>
          </a>
          <p>UID {{ country.uid }}</p>
          <div class="detail-tags">
            <el-tag type="success">球员 {{ formatNumber(country.playerCount) }}</el-tag>
            <el-tag>平均 PA {{ formatNumber(country.averagePa, 2) }}</el-tag>
            <el-tag type="warning">荣誉分 {{ formatNumber(country.honorScore, 2) }}</el-tag>
          </div>
        </div>
        <el-button @click="backToList">返回列表</el-button>
      </div>

      <div class="metric-grid">
        <div class="metric-card">
          <span>总 PA</span>
          <strong>{{ formatNumber(country.totalPa) }}</strong>
          <em>国家队球员能力总量</em>
        </div>
        <div class="metric-card gold">
          <span>冠军数</span>
          <strong>{{ formatNumber(country.championCount) }}</strong>
          <em>冠军荣誉累计</em>
        </div>
        <div class="metric-card">
          <span>大赛冠军</span>
          <strong>{{ formatNumber(country.majorChampionCount) }}</strong>
          <em>核心赛事冠军统计</em>
        </div>
        <div class="metric-card">
          <span>奖牌数</span>
          <strong>{{ formatNumber(country.medalCount) }}</strong>
          <em>冠军 / 亚军 / 季军汇总</em>
        </div>
      </div>

      <div class="detail-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>基础资料</h3>
            <span class="status-pill">国家圣殿</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>国家</dt>
              <dd>{{ country.name }}</dd>
            </div>
            <div>
              <dt>UID</dt>
              <dd>{{ country.uid }}</dd>
            </div>
            <div>
              <dt>足联</dt>
              <dd>{{ formatRef(country.federationRef) }}</dd>
            </div>
            <div>
              <dt>原始足联</dt>
              <dd>{{ formatText(country.federation) }}</dd>
            </div>
            <div>
              <dt>外部链接</dt>
              <dd>
                <a
                  class="external-text-link"
                  :href="countryExternalUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ country.externalUrl || 'Google 搜索' }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>资料库关联</h3>
            <span class="status-pill">真实数据</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>关联球员</dt>
              <dd>{{ formatNumber(country._count?.players ?? country.playerCount) }}</dd>
            </div>
            <div>
              <dt>关联俱乐部</dt>
              <dd>{{ formatNumber(country._count?.clubs) }}</dd>
            </div>
            <div>
              <dt>统计球员数</dt>
              <dd>{{ formatNumber(country.playerCount) }}</dd>
            </div>
            <div>
              <dt>平均荣誉分</dt>
              <dd>{{ formatNumber(country.averageHonorScore, 2) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </template>
  </section>
</template>

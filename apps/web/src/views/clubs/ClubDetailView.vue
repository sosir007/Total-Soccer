<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { fetchClubDetail, type ClubDetail, type NamedRef } from '@/services/catalog';
import { buildExternalUrl } from '@/utils/external-link';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const club = ref<ClubDetail | null>(null);
const clubId = computed(() => String(route.params.id ?? ''));

async function loadClub() {
  if (!clubId.value) {
    club.value = null;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    club.value = await fetchClubDetail(clubId.value);
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

function clubExternalUrl() {
  return buildExternalUrl(club.value?.externalUrl, club.value?.name || '俱乐部');
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
      <div class="panel player-detail-hero">
        <div>
          <div class="detail-kicker">{{ formatRef(club.federationRef) }}</div>
          <a
            class="external-title-link"
            :href="clubExternalUrl()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>{{ club.name }}</h2>
          </a>
          <p>UID {{ club.uid }}</p>
          <div class="detail-tags">
            <el-tag type="success">球员 {{ formatNumber(club.playerCount) }}</el-tag>
            <el-tag>平均 PA {{ formatNumber(club.averagePa, 2) }}</el-tag>
            <el-tag type="warning">荣誉分 {{ formatNumber(club.honorScore, 2) }}</el-tag>
          </div>
        </div>
        <el-button @click="backToList">返回列表</el-button>
      </div>

      <div class="metric-grid">
        <div class="metric-card">
          <span>总 PA</span>
          <strong>{{ formatNumber(club.totalPa) }}</strong>
          <em>俱乐部球员能力总量</em>
        </div>
        <div class="metric-card gold">
          <span>奖杯数</span>
          <strong>{{ formatNumber(club.trophyCount) }}</strong>
          <em>俱乐部荣誉累计</em>
        </div>
        <div class="metric-card">
          <span>冠军数</span>
          <strong>{{ formatNumber(club.championCount) }}</strong>
          <em>冠军荣誉统计</em>
        </div>
        <div class="metric-card">
          <span>关联球员</span>
          <strong>{{ formatNumber(club._count?.players ?? club.playerCount) }}</strong>
          <em>资料库关联数量</em>
        </div>
      </div>

      <div class="detail-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>基础资料</h3>
            <span class="status-pill">豪门殿堂</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>俱乐部</dt>
              <dd>{{ club.name }}</dd>
            </div>
            <div>
              <dt>UID</dt>
              <dd>{{ club.uid }}</dd>
            </div>
            <div>
              <dt>是否展示</dt>
              <dd>{{ club.exists ? '是' : '否' }}</dd>
            </div>
            <div>
              <dt>荣誉分</dt>
              <dd>{{ formatNumber(club.honorScore, 2) }}</dd>
            </div>
            <div>
              <dt>外部链接</dt>
              <dd>
                <a
                  class="external-text-link"
                  :href="clubExternalUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ club.externalUrl || 'Google 搜索' }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>关联信息</h3>
            <span class="status-pill">真实数据</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>国家</dt>
              <dd>{{ formatRef(club.countryRef) }}</dd>
            </div>
            <div>
              <dt>原始国家</dt>
              <dd>{{ formatText(club.country) }}</dd>
            </div>
            <div>
              <dt>足联</dt>
              <dd>{{ formatRef(club.federationRef) }}</dd>
            </div>
            <div>
              <dt>原始足联</dt>
              <dd>{{ formatText(club.federation) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </template>
  </section>
</template>

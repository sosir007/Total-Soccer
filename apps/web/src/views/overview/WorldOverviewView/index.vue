<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { fetchWorldOverview } from '@/services/modules/dashboard';
import type { DashboardRankItem, WorldOverview } from '@/services/types/dashboard';
import IconFont from '@/components/IconFont.vue';
import EntityLink from '@/components/EntityLink.vue';
import { chartPalette } from '@/utils/tag-theme';

const loading = ref(false);
const errorMessage = ref('');
const overview = ref<WorldOverview | null>(null);
const paChartRef = ref<HTMLDivElement | null>(null);
const confederationChartRef = ref<HTMLDivElement | null>(null);
const positionChartRef = ref<HTMLDivElement | null>(null);
const playerTypeChartRef = ref<HTMLDivElement | null>(null);
let paChart: echarts.ECharts | null = null;
let confederationChart: echarts.ECharts | null = null;
let positionChart: echarts.ECharts | null = null;
let playerTypeChart: echarts.ECharts | null = null;

const hasData = computed(() => (overview.value?.summary.playerCount ?? 0) > 0);

async function loadOverview() {
  loading.value = true;
  errorMessage.value = '';

  try {
    overview.value = await fetchWorldOverview();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '世界概览数据加载失败。';
    ElMessage.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
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

function formatRankMeta(item: DashboardRankItem, type: 'country' | 'club') {
  const score = formatNumber(item.honorScore, 2);
  const countLabel = type === 'country' ? '奖牌' : '奖杯';
  const count = type === 'country' ? item.medalCount : item.trophyCount;
  const relation = type === 'country' ? item.federationRef?.name : item.countryRef?.name;

  return `${relation ?? '未关联'} · ${countLabel} ${formatNumber(count)} · 荣誉分 ${score}`;
}

function initChart(current: echarts.ECharts | null, el: HTMLDivElement | null) {
  if (!el) {
    return null;
  }

  if (current) {
    return current;
  }

  return echarts.init(el);
}

function renderCharts() {
  if (!overview.value) {
    return;
  }

  paChart = initChart(paChart, paChartRef.value);
  confederationChart = initChart(confederationChart, confederationChartRef.value);
  positionChart = initChart(positionChart, positionChartRef.value);
  playerTypeChart = initChart(playerTypeChart, playerTypeChartRef.value);

  paChart?.setOption({
    color: chartPalette.primary,
    grid: { top: 24, right: 16, bottom: 30, left: 36 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: overview.value.paDistribution.map((item) => item.label),
      axisTick: { show: false }
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: overview.value.paDistribution.map((item) => item.count),
        barMaxWidth: 34,
        itemStyle: { borderRadius: [6, 6, 0, 0] }
      }
    ]
  });

  confederationChart?.setOption({
    color: chartPalette.categorical,
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        type: 'pie',
        radius: ['46%', '68%'],
        center: ['50%', '43%'],
        data: overview.value.confederationDistribution.map((item) => ({
          name: item.name,
          value: item.count
        })),
        label: { formatter: '{b}' }
      }
    ]
  });

  positionChart?.setOption({
    color: chartPalette.gold,
    grid: { top: 12, right: 18, bottom: 20, left: 72 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: overview.value.positionDistribution.map((item) => item.name).reverse(),
      axisTick: { show: false }
    },
    series: [
      {
        type: 'bar',
        data: overview.value.positionDistribution.map((item) => item.count).reverse(),
        barMaxWidth: 16,
        itemStyle: { borderRadius: [0, 6, 6, 0] }
      }
    ]
  });

  playerTypeChart?.setOption({
    color: chartPalette.compactCategorical,
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '68%',
        center: ['50%', '50%'],
        data: overview.value.playerTypeDistribution.map((item) => ({
          name: item.name,
          value: item.count
        }))
      }
    ]
  });
}

function resizeCharts() {
  paChart?.resize();
  confederationChart?.resize();
  positionChart?.resize();
  playerTypeChart?.resize();
}

function disposeCharts() {
  paChart?.dispose();
  confederationChart?.dispose();
  positionChart?.dispose();
  playerTypeChart?.dispose();
  paChart = null;
  confederationChart = null;
  positionChart = null;
  playerTypeChart = null;
}

watch(
  overview,
  async () => {
    await nextTick();
    renderCharts();
  },
  { deep: true }
);

onMounted(() => {
  void loadOverview();
  window.addEventListener('resize', resizeCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts);
  disposeCharts();
});
</script>

<template>
  <section class="page-stack">
    <div class="hero-panel">
      <div class="hero-content">
        <div class="tag">真实数据快照</div>
        <h2>足球历史资料、荣誉与能力评分中枢</h2>
        <p>聚合巨星、国家队与豪门俱乐部数据，快速观察 PA、足联、位置和荣誉分格局。</p>
      </div>
      <div class="pitch-card">
        <div class="pitch-line center"></div>
        <div class="pitch-dot"></div>
        <div class="player-token token-a">ST</div>
        <div class="player-token token-b">AMC</div>
        <div class="player-token token-c">MC</div>
        <div class="player-token token-d">GK</div>
      </div>
    </div>

    <div v-if="errorMessage" class="panel">
      <el-alert type="error" :title="errorMessage" show-icon :closable="false" />
      <div class="detail-actions">
        <el-button type="primary" @click="loadOverview">
          <IconFont name="refresh" />
          重试
        </el-button>
      </div>
    </div>

    <div v-if="loading && !overview" class="panel">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else-if="overview">
      <div class="metric-grid">
        <div class="metric-card">
          <span>球员总数</span>
          <strong>{{ formatNumber(overview.summary.playerCount) }}</strong>
          <em>已入库巨星资料</em>
        </div>
        <div class="metric-card gold">
          <span>国家样本</span>
          <strong>{{ formatNumber(overview.summary.countryCount) }}</strong>
          <em>国家圣殿记录</em>
        </div>
        <div class="metric-card">
          <span>正式豪门</span>
          <strong>{{ formatNumber(overview.summary.clubCount) }}</strong>
          <em>不含球员占位球队</em>
        </div>
        <div class="metric-card">
          <span>平均 / 最高 PA</span>
          <strong>{{ formatNumber(overview.summary.averagePa, 1) }}</strong>
          <em>最高 PA {{ formatNumber(overview.summary.highestPa) }}</em>
        </div>
      </div>

      <div v-if="!hasData" class="panel empty-panel">
        <h3>暂无可统计数据</h3>
        <p>可以先到天机阁导入《紫禁之巅》数据，再回到世界概览查看统计看板。</p>
      </div>

      <template v-else>
        <div class="dashboard-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>PA 分布</h3>
              <span class="status-pill">{{ formatNumber(overview.summary.playerCount) }} 人</span>
            </div>
            <div ref="paChartRef" class="chart-box"></div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>足联分布</h3>
              <span class="status-pill">球员归属</span>
            </div>
            <div ref="confederationChartRef" class="chart-box"></div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>位置分布</h3>
              <span class="status-pill">Top 12</span>
            </div>
            <div ref="positionChartRef" class="chart-box tall"></div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>球员类型</h3>
              <span class="status-pill">字典统计</span>
            </div>
            <div ref="playerTypeChartRef" class="chart-box tall"></div>
          </div>
        </div>

        <div class="rank-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>国家荣誉分榜</h3>
              <span class="status-pill">Top {{ overview.topCountries.length }}</span>
            </div>
            <div v-if="overview.topCountries.length" class="rank-list">
              <div
                v-for="(country, index) in overview.topCountries"
                :key="country.id"
                class="rank-item"
              >
                <strong>{{ index + 1 }}</strong>
                <div>
                  <EntityLink :id="country.id" type="country" :name="country.name" />
                  <em>{{ formatRankMeta(country, 'country') }}</em>
                </div>
              </div>
            </div>
            <div v-else class="mini-empty">暂无国家荣誉分数据</div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>豪门荣誉分榜</h3>
              <span class="status-pill">Top {{ overview.topClubs.length }}</span>
            </div>
            <div v-if="overview.topClubs.length" class="rank-list">
              <div v-for="(club, index) in overview.topClubs" :key="club.id" class="rank-item">
                <strong>{{ index + 1 }}</strong>
                <div>
                  <EntityLink :id="club.id" type="club" :name="club.name" />
                  <em>{{ formatRankMeta(club, 'club') }}</em>
                </div>
              </div>
            </div>
            <div v-else class="mini-empty">暂无豪门荣誉分数据</div>
          </div>
        </div>
      </template>
    </template>
  </section>
</template>

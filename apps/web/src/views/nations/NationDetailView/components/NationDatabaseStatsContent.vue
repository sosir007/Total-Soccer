<script setup lang="ts">
import type { CountryDetail } from '@/services/types/catalog';

defineProps<{
  country: CountryDetail;
}>();

function formatNumber(value?: number | null, digits = 0) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}
</script>

<template>
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
      <dt>平均 PA</dt>
      <dd>{{ formatNumber(country.averagePa, 2) }}</dd>
    </div>
    <div>
      <dt>总 PA</dt>
      <dd>{{ formatNumber(country.totalPa) }}</dd>
    </div>
    <div>
      <dt>球员平均荣誉分</dt>
      <dd>{{ formatNumber(country.averageHonorScore, 2) }}</dd>
    </div>
    <div>
      <dt>荣誉分</dt>
      <dd>{{ formatNumber(country.honorScore, 2) }}</dd>
    </div>
    <div>
      <dt>赛事分</dt>
      <dd>{{ formatNumber(country.baseHonorScore, 2) }}</dd>
    </div>
    <div>
      <dt>附加分</dt>
      <dd>{{ formatNumber(country.bonusHonorScore, 2) }}</dd>
    </div>
    <div>
      <dt>冠军数</dt>
      <dd>{{ formatNumber(country.championCount) }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import SemanticTag from '@/components/SemanticTag.vue';
import type { ClubDetail } from '@/services/types/catalog';
import { getBooleanLabel, getBooleanVariant } from '@/utils/tag-theme';

defineProps<{
  club: ClubDetail;
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
      <dd>{{ formatNumber(club._count?.players ?? club.playerCount) }}</dd>
    </div>
    <div>
      <dt>统计球员数</dt>
      <dd>{{ formatNumber(club.playerCount) }}</dd>
    </div>
    <div>
      <dt>球员平均 PA</dt>
      <dd>{{ formatNumber(club.averagePa, 2) }}</dd>
    </div>
    <div>
      <dt>总 PA</dt>
      <dd>{{ formatNumber(club.totalPa) }}</dd>
    </div>
    <div>
      <dt>荣誉分</dt>
      <dd>{{ formatNumber(club.honorScore, 2) }}</dd>
    </div>
    <div>
      <dt>赛事分</dt>
      <dd>{{ formatNumber(club.baseHonorScore, 2) }}</dd>
    </div>
    <div>
      <dt>附加分</dt>
      <dd>{{ formatNumber(club.bonusHonorScore, 2) }}</dd>
    </div>
    <div>
      <dt>奖杯数</dt>
      <dd>{{ formatNumber(club.trophyCount) }}</dd>
    </div>
    <div>
      <dt>冠军数</dt>
      <dd>{{ formatNumber(club.championCount) }}</dd>
    </div>
    <div>
      <dt>是否存在</dt>
      <dd>
        <SemanticTag :variant="getBooleanVariant(club.exists)">
          {{ getBooleanLabel(club.exists) }}
        </SemanticTag>
      </dd>
    </div>
    <div>
      <dt>列表展示</dt>
      <dd>
        <SemanticTag :variant="getBooleanVariant(club.visibleInCatalog)">
          {{ getBooleanLabel(club.visibleInCatalog) }}
        </SemanticTag>
      </dd>
    </div>
  </dl>
</template>

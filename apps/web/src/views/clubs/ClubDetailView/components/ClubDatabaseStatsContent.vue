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
      <dt>存在 / 展示</dt>
      <dd>
        <span class="club-status-tags">
          <SemanticTag :variant="getBooleanVariant(club.exists)">
            {{ getBooleanLabel(club.exists) }}
          </SemanticTag>
          <span class="club-status-separator">/</span>
          <SemanticTag :variant="getBooleanVariant(club.visibleInCatalog)">
            {{ getBooleanLabel(club.visibleInCatalog) }}
          </SemanticTag>
        </span>
      </dd>
    </div>
    <div>
      <dt>阵容球员数</dt>
      <dd>{{ formatNumber(club.lineupPlayerCount) }}</dd>
    </div>
    <div>
      <dt>代表球员数</dt>
      <dd>{{ formatNumber(club.playerCount) }}</dd>
    </div>
    <div>
      <dt>阵容平均 PA</dt>
      <dd>{{ formatNumber(club.lineupAveragePa, 2) }}</dd>
    </div>
    <div>
      <dt>代表平均 PA</dt>
      <dd>{{ formatNumber(club.averagePa, 2) }}</dd>
    </div>
    <div>
      <dt>赛事分</dt>
      <dd>{{ formatNumber(club.baseHonorScore, 2) }}</dd>
    </div>
    <div>
      <dt>附加分</dt>
      <dd>{{ formatNumber(club.bonusHonorScore, 2) }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.club-status-tags {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.club-status-separator {
  color: var(--text-color-secondary);
}
</style>

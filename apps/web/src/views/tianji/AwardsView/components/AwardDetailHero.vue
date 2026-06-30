<script setup lang="ts">
import SemanticTag from '@/components/SemanticTag.vue';
import type { AwardDetail, AwardListItem, AwardScopeType } from '@/services/types/awards';
import { getCompetitionCategoryVariant, getCompetitionLevelVariant } from '@/utils/tag-theme';

defineProps<{
  award: AwardDetail;
  scopeTypeLabels: Record<AwardScopeType, string>;
  formatScope: (award: AwardListItem | AwardDetail) => string;
  externalUrl: string;
}>();
</script>

<template>
  <div class="panel player-detail-hero">
    <div>
      <div class="detail-kicker">{{ scopeTypeLabels[award.scopeType] }}</div>
      <a class="external-title-link" :href="externalUrl" target="_blank" rel="noopener noreferrer">
        <h2>{{ award.name }}</h2>
      </a>
      <p>{{ award.code }} · {{ formatScope(award) }}</p>
      <div class="detail-tags">
        <SemanticTag :variant="getCompetitionCategoryVariant(award.category)">
          {{ award.category || '未分类' }}
        </SemanticTag>
        <SemanticTag :variant="getCompetitionLevelVariant(award.level)">
          {{ award.level || '未分级' }}
        </SemanticTag>
        <SemanticTag variant="status-legend">{{ award.editions.length }} 个年份</SemanticTag>
      </div>
    </div>
    <a class="external-text-link" :href="externalUrl" target="_blank" rel="noopener noreferrer">
      外部链接
    </a>
  </div>
</template>

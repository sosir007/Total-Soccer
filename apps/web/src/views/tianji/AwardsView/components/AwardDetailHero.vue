<script setup lang="ts">
import SemanticTag from '@/components/SemanticTag.vue';
import type {
  AwardDetail,
  AwardListItem,
  AwardScopeType,
  AwardTargetType
} from '@/services/types/awards';
import { getCompetitionLevelVariant, type SemanticTagVariant } from '@/utils/tag-theme';
import IconFont from '@/components/IconFont.vue';

defineProps<{
  award: AwardDetail;
  scopeTypeLabels: Record<AwardScopeType, string>;
  targetTypeLabels: Record<AwardTargetType, string>;
  formatScope: (award: AwardListItem | AwardDetail) => string;
  externalUrl: string;
}>();

const emit = defineEmits<{
  back: [];
  edit: [];
}>();

function getTargetTypeVariant(targetType: AwardTargetType): SemanticTagVariant {
  if (targetType === 'COUNTRY') return 'object-country';
  if (targetType === 'CLUB') return 'object-club';

  return 'object-player';
}
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
        <span class="award-category-text">{{ award.category || '未分类' }}</span>
        <SemanticTag :variant="getCompetitionLevelVariant(award.level)">
          {{ award.level || '未分级' }}
        </SemanticTag>
        <SemanticTag :variant="getTargetTypeVariant(award.targetType)">
          {{ targetTypeLabels[award.targetType] }}
        </SemanticTag>
        <SemanticTag variant="status-legend">{{ award.editions.length }} 个年份</SemanticTag>
      </div>
    </div>
    <div class="panel-actions">
      <el-button @click="emit('back')">
        <IconFont name="back" />
        返回列表
      </el-button>
      <el-button type="primary" @click="emit('edit')">
        <IconFont name="edit" />
        编辑资料
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.award-category-text {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  color: var(--text-color-secondary);
  font-size: 13px;
  font-weight: 750;
}
</style>

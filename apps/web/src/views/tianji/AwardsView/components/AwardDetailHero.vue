<script setup lang="ts">
import SemanticTag from '@/components/SemanticTag.vue';
import type {
  AwardDetail,
  AwardListItem,
  AwardScopeType,
  AwardTargetType
} from '@/services/types/awards';
import {
  getCompetitionCategoryVariant,
  getCompetitionLevelVariant,
  getLifecycleStatusLabel,
  getLifecycleStatusVariant
} from '@/utils/tag-theme';
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
        <SemanticTag variant="status-info">{{ targetTypeLabels[award.targetType] }}</SemanticTag>
        <SemanticTag :variant="getLifecycleStatusVariant(award.lifecycleStatus)">
          {{ getLifecycleStatusLabel(award.lifecycleStatus) }}
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
      <a class="external-text-link" :href="externalUrl" target="_blank" rel="noopener noreferrer">
        外部链接
      </a>
    </div>
  </div>
</template>

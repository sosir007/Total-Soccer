<script setup lang="ts">
import type {
  AwardDetail,
  AwardListItem,
  AwardScopeType,
  AwardTargetType
} from '@/services/types/awards';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  getCompetitionLevelVariant,
  getConfederationVariant,
  getLifecycleStatusLabel,
  getLifecycleStatusVariant,
  type SemanticTagVariant
} from '@/utils/tag-theme';

const props = defineProps<{
  award: AwardDetail;
  scopeTypeLabels: Record<AwardScopeType, string>;
  targetTypeLabels: Record<AwardTargetType, string>;
  formatScope: (award: AwardListItem | AwardDetail) => string;
  formatText: (value?: string | number | boolean | null) => string | number | boolean;
}>();

function formatAwardRuleName(award: AwardDetail) {
  if (award.level === '团队附加分') {
    if (award.category === '公平竞赛奖') {
      return award.targetType === 'CLUB' ? '俱乐部公平竞赛奖' : '国家队公平竞赛奖';
    }

    if (award.category === '年度最佳团队') {
      if (award.scopeType === 'MEDIA') {
        return award.targetType === 'CLUB' ? '俱乐部媒体年度团队' : '国家队媒体年度团队';
      }

      return award.targetType === 'CLUB' ? '俱乐部年度最佳团队' : '国家队年度最佳团队';
    }

    if (award.category === '年度俱乐部排名') {
      return '俱乐部世界年度排名';
    }

    if (award.category === '年度国家队排名') {
      return '国家队世界年度排名';
    }
  }

  if (!award.category) {
    return '未设置评分规则';
  }

  return `${props.scopeTypeLabels[award.scopeType]}${award.category}`;
}

function getTargetTypeVariant(targetType: AwardTargetType): SemanticTagVariant {
  if (targetType === 'COUNTRY') return 'object-country';
  if (targetType === 'CLUB') return 'object-club';

  return 'object-player';
}

function getScopeVariant(award: AwardDetail): SemanticTagVariant {
  if (award.scopeType === 'CONFEDERATION') {
    return getConfederationVariant(props.formatScope(award));
  }

  if (award.scopeType === 'COUNTRY') return 'object-country';
  if (award.scopeType === 'CLUB') return 'object-club';
  if (award.scopeType === 'LEAGUE') return 'object-competition';
  if (award.scopeType === 'MEDIA') return 'object-award';

  return 'neutral';
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>奖项资料</h3>
    </div>

    <div class="award-info-grid">
      <div class="award-info-item">
        <span>奖项编码</span>
        <strong>{{ award.code }}</strong>
      </div>
      <div class="award-info-item">
        <span>获奖对象</span>
        <strong>
          <SemanticTag :variant="getTargetTypeVariant(award.targetType)">
            {{ targetTypeLabels[award.targetType] }}
          </SemanticTag>
        </strong>
      </div>
      <div class="award-info-item">
        <span>评分规则</span>
        <strong>{{ formatAwardRuleName(award) }}</strong>
      </div>
      <div class="award-info-item">
        <span>范围</span>
        <strong>
          <SemanticTag :variant="getScopeVariant(award)">
            {{ formatScope(award) }}
          </SemanticTag>
        </strong>
      </div>
      <div class="award-info-item">
        <span>奖项类型</span>
        <strong>
          <SemanticTag :variant="getCompetitionLevelVariant(award.level)">
            {{ formatText(award.level) }}
          </SemanticTag>
        </strong>
      </div>
      <div class="award-info-item">
        <span>排序</span>
        <strong>{{ award.sortOrder }}</strong>
      </div>
      <div class="award-info-item">
        <span>奖项状态</span>
        <strong>
          <SemanticTag :variant="getLifecycleStatusVariant(award.lifecycleStatus)">
            {{ getLifecycleStatusLabel(award.lifecycleStatus) }}
          </SemanticTag>
        </strong>
      </div>
      <div class="award-info-item">
        <span>启用状态</span>
        <strong>
          <SemanticTag :variant="award.enabled ? 'status-enabled' : 'status-disabled'">
            {{ award.enabled ? '启用' : '停用' }}
          </SemanticTag>
        </strong>
      </div>
      <div class="award-info-item form-wide">
        <span>描述</span>
        <strong>{{ formatText(award.description) }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.award-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.award-info-item {
  display: grid;
  gap: 8px;
  min-height: 78px;
  padding: 14px;
  border: 1px solid var(--color-border-brand-subtle);
  border-radius: 8px;
  background: var(--color-surface-muted);

  span {
    color: var(--text-color-secondary);
    font-size: 13px;
    font-weight: 750;
  }

  strong {
    color: var(--text-color-primary);
    font-size: 16px;
    line-height: 1.45;
    word-break: break-word;
  }
}

@media (max-width: 1100px) {
  .award-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

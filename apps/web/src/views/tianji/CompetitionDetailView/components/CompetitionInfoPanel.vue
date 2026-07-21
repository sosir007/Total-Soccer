<script setup lang="ts">
import type { CompetitionDetail, CompetitionTargetType } from '@/services/types/competitions';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  getLifecycleStatusLabel,
  getLifecycleStatusVariant,
  getBooleanLabel,
  getBooleanVariant
} from '@/utils/tag-theme';

defineProps<{
  competition: CompetitionDetail;
  targetTypeLabels: Record<CompetitionTargetType, string>;
  formatScope: (item: CompetitionDetail) => string;
  formatText: (value?: string | number | boolean | null) => string | number | boolean;
  formatCompetitionFormat: (item: CompetitionDetail) => string;
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>赛事资料</h3>
      <div class="panel-actions">
        <SemanticTag :variant="competition.enabled ? 'status-enabled' : 'status-disabled'">
          {{ competition.enabled ? '启用' : '停用' }}
        </SemanticTag>
        <SemanticTag :variant="getLifecycleStatusVariant(competition.lifecycleStatus)">
          {{ getLifecycleStatusLabel(competition.lifecycleStatus) }}
        </SemanticTag>
      </div>
    </div>

    <div class="competition-info-grid">
      <div class="competition-info-item">
        <span>赛事编码</span>
        <strong>{{ competition.code }}</strong>
      </div>
      <div class="competition-info-item">
        <span>赛事名称</span>
        <strong>{{ competition.name }}</strong>
      </div>
      <div class="competition-info-item">
        <span>别名</span>
        <strong>{{ formatText(competition.alias) }}</strong>
      </div>
      <div class="competition-info-item">
        <span>对象</span>
        <strong>{{ targetTypeLabels[competition.targetType] }}</strong>
      </div>
      <div class="competition-info-item">
        <span>适用范围</span>
        <strong>{{ formatScope(competition) }}</strong>
      </div>
      <div class="competition-info-item">
        <span>分类</span>
        <strong>{{ formatText(competition.category) }}</strong>
      </div>
      <div class="competition-info-item">
        <span>级别</span>
        <strong>{{ formatText(competition.level) }}</strong>
      </div>
      <div class="competition-info-item">
        <span>赛制</span>
        <strong>{{ formatCompetitionFormat(competition) }}</strong>
      </div>
      <div class="competition-info-item">
        <span>赛事状态</span>
        <strong>
          <SemanticTag :variant="getLifecycleStatusVariant(competition.lifecycleStatus)">
            {{ getLifecycleStatusLabel(competition.lifecycleStatus) }}
          </SemanticTag>
        </strong>
      </div>
      <div class="competition-info-item">
        <span>统计</span>
        <strong>
          <SemanticTag :variant="getBooleanVariant(competition.includeInStats)">
            {{ getBooleanLabel(competition.includeInStats) }}
          </SemanticTag>
        </strong>
      </div>
      <div class="competition-info-item form-wide">
        <span>描述</span>
        <strong>{{ formatText(competition.description) }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.competition-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.competition-info-item {
  display: grid;
  gap: 8px;
  min-width: 0;
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
    min-width: 0;
    overflow-wrap: anywhere;
    color: var(--text-color-primary);
    font-size: 16px;
    line-height: 1.45;
  }
}

@media (max-width: 1100px) {
  .competition-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

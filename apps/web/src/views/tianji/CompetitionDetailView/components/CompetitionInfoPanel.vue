<script setup lang="ts">
import { computed } from 'vue';
import type { CompetitionDetail, CompetitionTargetType } from '@/services/types/competitions';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  getCompetitionCategoryVariant,
  getCompetitionLevelVariant,
  getConfederationVariant,
  getLifecycleStatusLabel,
  getLifecycleStatusVariant,
  getBooleanLabel,
  getBooleanVariant,
  type SemanticTagVariant
} from '@/utils/tag-theme';

type InfoField = {
  label: string;
  value: string | number | boolean;
  kind?: 'text' | 'tag';
  variant?: SemanticTagVariant;
  spanFull?: boolean;
};

const props = defineProps<{
  competition: CompetitionDetail;
  targetTypeLabels: Record<CompetitionTargetType, string>;
  formatScope: (item: CompetitionDetail) => string;
  formatText: (value?: string | number | boolean | null) => string | number | boolean;
  formatCompetitionFormat: (item: CompetitionDetail) => string;
}>();

function getTargetTypeVariant(targetType: CompetitionTargetType): SemanticTagVariant {
  return targetType === 'CLUB' ? 'object-club' : 'object-country';
}

function getScopeVariant(item: CompetitionDetail): SemanticTagVariant {
  if (item.scopeType === 'CONFEDERATION') {
    return getConfederationVariant(props.formatScope(item));
  }

  if (item.scopeType === 'COUNTRY') return 'object-country';

  return 'neutral';
}

function formatDataUpdatedAt(value?: string | null) {
  return value ? value.slice(0, 10) : '-';
}

const infoFields = computed<InfoField[]>(() => [
  { label: '赛事编码', value: props.competition.code },
  { label: '英文名', value: props.formatText(props.competition.englishName) },
  { label: '简称', value: props.formatText(props.competition.shortName) },
  { label: '别名', value: props.formatText(props.competition.alias) },
  {
    label: '对象',
    value: props.targetTypeLabels[props.competition.targetType],
    kind: 'tag',
    variant: getTargetTypeVariant(props.competition.targetType)
  },
  {
    label: '适用范围',
    value: props.formatScope(props.competition),
    kind: 'tag',
    variant: getScopeVariant(props.competition)
  },
  {
    label: '分类',
    value: props.formatText(props.competition.category),
    kind: 'tag',
    variant: getCompetitionCategoryVariant(props.competition.category)
  },
  {
    label: '级别',
    value: props.formatText(props.competition.level),
    kind: 'tag',
    variant: getCompetitionLevelVariant(props.competition.level)
  },
  { label: '赛制', value: props.formatCompetitionFormat(props.competition) },
  {
    label: '赛事状态',
    value: getLifecycleStatusLabel(props.competition.lifecycleStatus),
    kind: 'tag',
    variant: getLifecycleStatusVariant(props.competition.lifecycleStatus)
  },
  {
    label: '启用状态',
    value: props.competition.enabled ? '启用' : '停用',
    kind: 'tag',
    variant: props.competition.enabled ? 'status-enabled' : 'status-disabled'
  },
  {
    label: '统计',
    value: getBooleanLabel(props.competition.includeInStats),
    kind: 'tag',
    variant: getBooleanVariant(props.competition.includeInStats)
  },
  {
    label: '录入完整',
    value: getBooleanLabel(props.competition.dataComplete),
    kind: 'tag',
    variant: getBooleanVariant(props.competition.dataComplete)
  },
  { label: '数据更新', value: formatDataUpdatedAt(props.competition.dataUpdatedAt) },
  { label: '描述', value: props.formatText(props.competition.description), spanFull: true },
  { label: '完整性备注', value: props.formatText(props.competition.dataRemark), spanFull: true }
]);
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>赛事资料</h3>
    </div>

    <dl class="detail-list competition-detail-list">
      <div v-for="field in infoFields" :key="field.label" :class="{ 'form-wide': field.spanFull }">
        <dt>{{ field.label }}</dt>
        <dd>
          <SemanticTag v-if="field.kind === 'tag'" :variant="field.variant ?? 'neutral'">
            {{ field.value }}
          </SemanticTag>
          <template v-else>
            {{ field.value }}
          </template>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped lang="scss">
.competition-detail-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 40px;
}

.competition-detail-list .form-wide {
  grid-column: 1 / -1;
}

@media (max-width: 1100px) {
  .competition-detail-list {
    grid-template-columns: 1fr;
  }
}
</style>

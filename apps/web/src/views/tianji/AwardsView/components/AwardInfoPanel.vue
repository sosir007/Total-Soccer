<script setup lang="ts">
import { computed } from 'vue';
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
  getBooleanVariant,
  getLifecycleStatusLabel,
  getLifecycleStatusVariant,
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

function formatDataUpdatedAt(value?: string | null) {
  return value ? value.slice(0, 10) : '-';
}

const infoFields = computed<InfoField[]>(() => [
  { label: '奖项编码', value: props.award.code },
  { label: '英文名', value: props.formatText(props.award.englishName) },
  { label: '简称', value: props.formatText(props.award.shortName) },
  {
    label: '获奖对象',
    value: props.targetTypeLabels[props.award.targetType],
    kind: 'tag',
    variant: getTargetTypeVariant(props.award.targetType)
  },
  { label: '评分规则', value: formatAwardRuleName(props.award) },
  {
    label: '范围',
    value: props.formatScope(props.award),
    kind: 'tag',
    variant: getScopeVariant(props.award)
  },
  {
    label: '奖项类型',
    value: props.formatText(props.award.level),
    kind: 'tag',
    variant: getCompetitionLevelVariant(props.award.level)
  },
  { label: '排序', value: props.award.sortOrder },
  {
    label: '录入完整',
    value: props.award.dataComplete ? '是' : '否',
    kind: 'tag',
    variant: getBooleanVariant(props.award.dataComplete)
  },
  { label: '数据更新', value: formatDataUpdatedAt(props.award.dataUpdatedAt) },
  {
    label: '奖项状态',
    value: getLifecycleStatusLabel(props.award.lifecycleStatus),
    kind: 'tag',
    variant: getLifecycleStatusVariant(props.award.lifecycleStatus)
  },
  {
    label: '启用状态',
    value: props.award.enabled ? '启用' : '停用',
    kind: 'tag',
    variant: props.award.enabled ? 'status-enabled' : 'status-disabled'
  },
  { label: '描述', value: props.formatText(props.award.description), spanFull: true },
  { label: '完整性备注', value: props.formatText(props.award.dataRemark), spanFull: true }
]);
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>奖项资料</h3>
    </div>

    <dl class="detail-list award-detail-list">
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
.award-detail-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 40px;
}

.award-detail-list .form-wide {
  grid-column: 1 / -1;
}

@media (max-width: 1100px) {
  .award-detail-list {
    grid-template-columns: 1fr;
  }
}
</style>

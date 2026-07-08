<script setup lang="ts">
import type { CompetitionTargetType } from '@/services/types/competitions';
import type {
  HonorRuleConversionType,
  HonorRuleItem,
  HonorRulePlacementScope
} from '@/services/types/honor-rules';
import IconFont from '@/components/IconFont.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  getCompetitionCategoryVariant,
  getCompetitionLevelVariant,
  getPlacementTextColor,
  type SemanticTagVariant
} from '@/utils/tag-theme';

defineProps<{
  title: string;
  description: string;
  items: HonorRuleItem[];
  loading: boolean;
  getTargetTypeLabel: (value: CompetitionTargetType) => string;
}>();

const emit = defineEmits<{
  edit: [row: HonorRuleItem];
}>();

const placementScopeLabels: Record<HonorRulePlacementScope, string> = {
  TOP_FOUR: '冠亚季殿/四强',
  TOP_THREE: '前三',
  TOP_TWO: '冠亚',
  LEAGUE_TOP_THREE: '联赛前三',
  CHAMPION_ONLY: '仅冠军'
};

const conversionTypeLabels: Record<HonorRuleConversionType, string> = {
  NONE: '不换算',
  FREQUENCY_SCALE: '频率 / 规模自动换算',
  OLYMPIC_STAGE: '奥运年份阶段换算',
  CLUB_WORLD_CUP_STAGE: '世俱杯阶段换算'
};
const countryCoefficientOrder = ['765', '796', '776', '771', '769', '1651', '1649', '788', '784'];
const confederationCoefficientOrder = ['UEFA', 'CONMEBOL', 'AFC', 'CAF', 'CONCACAF', 'OFC'];

function formatNumber(value?: number | null) {
  return value === null || value === undefined ? '-' : Number(value).toFixed(2);
}

function formatScope(row: HonorRuleItem) {
  if (row.scopeType === 'GLOBAL') return '全球';
  if (row.scopeType === 'CONFEDERATION') return row.confederation?.name ?? '足联';
  if (row.scopeType === 'COUNTRY') return row.country?.name ?? '国家';
  if (row.scopeType === 'CUSTOM') return '自定义';

  return '全部';
}

function formatTypicalCompetitions(row: HonorRuleItem) {
  const names = (row.typicalCompetitions ?? [])
    .map((item) => item.competition?.name)
    .filter(Boolean);

  return names.length ? names.join('、') : '-';
}

function formatCoefficients(row: HonorRuleItem) {
  const coefficients = row.coefficients ?? [];

  if (!coefficients.length) {
    return `默认 ${formatNumber(row.qualityCoefficient)}`;
  }

  const labels = [...coefficients]
    .sort((left, right) => coefficientOrder(left, row) - coefficientOrder(right, row))
    .map((item) => {
      const subject = item.confederation?.name ?? item.country?.name ?? '默认';

      return `${subject} ${formatNumber(item.coefficient)}`;
    });

  if (row.targetType === 'CLUB' && row.category === '国内' && row.scopeType === 'COUNTRY') {
    labels.push(`其他 ${formatNumber(row.qualityCoefficient)}`);
  }

  return labels.join('；');
}

function coefficientOrder(
  item: NonNullable<HonorRuleItem['coefficients']>[number],
  row: HonorRuleItem
) {
  if (item.country?.uid) {
    const index = countryCoefficientOrder.indexOf(item.country.uid);

    return index === -1 ? 100 : index;
  }

  if (item.confederation) {
    const key = item.confederation.code ?? item.confederation.name;
    const index = confederationCoefficientOrder.findIndex((matcher) =>
      key.toLowerCase().includes(matcher.toLowerCase())
    );

    return index === -1 ? 100 : index;
  }

  return row.qualityCoefficient === item.coefficient ? 999 : 100;
}

function getPlacementScopeLabel(value: HonorRulePlacementScope) {
  return placementScopeLabels[value] ?? value;
}

function getConversionTypeLabel(value: HonorRuleConversionType) {
  return conversionTypeLabels[value] ?? value;
}

function getTargetTypeVariant(value: CompetitionTargetType): SemanticTagVariant {
  return value === 'CLUB' ? 'object-club' : 'object-country';
}

function getScoreStyle(
  placement: 'CHAMPION' | 'RUNNER_UP' | 'THIRD_PLACE' | 'FOURTH_PLACE' | 'SEMI_FINALIST'
) {
  return {
    color: getPlacementTextColor(placement)
  };
}
</script>

<template>
  <div class="panel honor-rule-panel">
    <div class="panel-header">
      <div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
      <span class="status-pill">{{ items.length }} 条</span>
    </div>

    <el-skeleton v-if="loading && !items.length" :rows="8" animated />

    <div v-else-if="!items.length" class="empty-panel">
      <h3>暂无系统规则</h3>
      <p>默认荣誉规则会由后端按稳定编码自动导入。</p>
    </div>

    <div v-else class="honor-rule-table-wrap">
      <el-table :data="items" border>
        <el-table-column label="序号" width="60" align="center">
          <template #default="{ $index }">
            <span class="rule-index">{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="规则名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="对象" width="90" align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getTargetTypeVariant(row.targetType)">
              {{ getTargetTypeLabel(row.targetType) }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="90" align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getCompetitionCategoryVariant(row.category)">
              {{ row.category || '-' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="级别" width="90" align="center">
          <template #default="{ row }">
            <SemanticTag :variant="getCompetitionLevelVariant(row.level)">
              {{ row.level || '-' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column prop="format" label="赛制" width="90" align="center" />
        <el-table-column label="适用范围" width="90" align="center">
          <template #default="{ row }">{{ formatScope(row) }}</template>
        </el-table-column>
        <el-table-column label="典型命中赛事" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ formatTypicalCompetitions(row) }}</template>
        </el-table-column>
        <el-table-column label="基础分" width="86" align="center">
          <template #default="{ row }">{{ formatNumber(row.baseScore) }}</template>
        </el-table-column>
        <el-table-column label="质量系数" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">{{ formatCoefficients(row) }}</template>
        </el-table-column>
        <el-table-column label="换算方式" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ getConversionTypeLabel(row.conversionType) }}</template>
        </el-table-column>
        <el-table-column label="名次范围" width="120" align="center">
          <template #default="{ row }">{{ getPlacementScopeLabel(row.placementScope) }}</template>
        </el-table-column>
        <el-table-column label="冠军分" width="90" align="center">
          <template #default="{ row }">
            <span class="placement-score" :style="getScoreStyle('CHAMPION')">
              {{ formatNumber(row.championScore) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="亚军分" width="90" align="center">
          <template #default="{ row }">
            <span class="placement-score" :style="getScoreStyle('RUNNER_UP')">
              {{ formatNumber(row.runnerUpScore) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="季军分" width="90" align="center">
          <template #default="{ row }">
            <span class="placement-score" :style="getScoreStyle('THIRD_PLACE')">
              {{ formatNumber(row.thirdPlaceScore) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="殿军分" width="90" align="center">
          <template #default="{ row }">
            <span class="placement-score" :style="getScoreStyle('FOURTH_PLACE')">
              {{ formatNumber(row.fourthPlaceScore) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="四强分" width="90" align="center">
          <template #default="{ row }">
            <span class="placement-score" :style="getScoreStyle('SEMI_FINALIST')">
              {{ formatNumber(row.semiFinalistScore) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="84" align="center">
          <template #default="{ row }">
            <SemanticTag :variant="row.enabled ? 'status-enabled' : 'status-disabled'">
              {{ row.enabled ? '启用' : '停用' }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">{{ row.remark || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="92" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="emit('edit', row)">
              <IconFont name="edit" />
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.honor-rule-panel {
  margin-top: 16px;
  overflow: hidden;

  :deep(.el-table__cell) {
    vertical-align: middle;
  }
}

.honor-rule-table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.rule-index {
  color: var(--text-color-secondary);
  font-size: 13px;
  font-weight: 600;
}

.placement-score {
  font-weight: 800;
}
</style>

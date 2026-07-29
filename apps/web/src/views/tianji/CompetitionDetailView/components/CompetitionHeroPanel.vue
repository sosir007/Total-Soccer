<script setup lang="ts">
import type {
  CompetitionDetail,
  CompetitionScopeType,
  CompetitionTargetType
} from '@/services/types/competitions';
import DetailHero from '@/components/DetailHero.vue';
import IconFont from '@/components/IconFont.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { getCompetitionCategoryVariant, getCompetitionLevelVariant } from '@/utils/tag-theme';
import { formatEntityName } from '@/utils/entity-name';

defineProps<{
  competition: CompetitionDetail;
  targetTypeLabels: Record<CompetitionTargetType, string>;
  scopeTypeLabels: Record<CompetitionScopeType, string>;
  formatScope: (item: CompetitionDetail) => string;
  shouldUseCompetitionFormat: (item: {
    scopeType: CompetitionScopeType;
    category?: string | null;
  }) => boolean;
  getSummaryCountLabel: () => string;
}>();

const emit = defineEmits<{
  back: [];
  edit: [];
}>();
</script>

<template>
  <DetailHero
    :kicker="`${targetTypeLabels[competition.targetType]} / ${scopeTypeLabels[competition.scopeType]}`"
    :title="formatEntityName(competition)"
    :subtitle="competition.englishName"
    :external-url="competition.externalUrl ?? undefined"
  >
    <template #tags>
      <p>{{ competition.code }} · {{ formatScope(competition) }}</p>
      <div class="detail-tags">
        <SemanticTag :variant="getCompetitionCategoryVariant(competition.category)">
          {{ competition.category || '未分类' }}
        </SemanticTag>
        <SemanticTag :variant="getCompetitionLevelVariant(competition.level)">
          {{ competition.level || '未分级' }}
        </SemanticTag>
        <span v-if="shouldUseCompetitionFormat(competition)" class="detail-tag-text">
          {{ competition.format || '未设赛制' }}
        </span>
        <SemanticTag variant="status-legend">{{ getSummaryCountLabel() }}</SemanticTag>
      </div>
    </template>

    <template #actions>
      <el-button @click="emit('back')">
        <IconFont name="back" />
        返回列表
      </el-button>
      <el-button type="primary" @click="emit('edit')">
        <IconFont name="edit" />
        编辑资料
      </el-button>
    </template>
  </DetailHero>
</template>

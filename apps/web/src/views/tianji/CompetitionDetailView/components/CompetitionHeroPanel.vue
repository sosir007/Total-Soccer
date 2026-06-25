<script setup lang="ts">
import type {
  CompetitionDetail,
  CompetitionScopeType,
  CompetitionTargetType
} from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';

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
  <div class="panel player-detail-hero">
    <div>
      <div class="detail-kicker">
        {{ targetTypeLabels[competition.targetType] }} /
        {{ scopeTypeLabels[competition.scopeType] }}
      </div>
      <h2>{{ competition.name }}</h2>
      <p>{{ competition.code }} · {{ formatScope(competition) }}</p>
      <div class="detail-tags">
        <el-tag type="success">{{ competition.category || '未分类' }}</el-tag>
        <el-tag>{{ competition.level || '未分级' }}</el-tag>
        <el-tag v-if="shouldUseCompetitionFormat(competition)" type="info">
          {{ competition.format || '未设赛制' }}
        </el-tag>
        <el-tag type="warning">{{ getSummaryCountLabel() }}</el-tag>
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

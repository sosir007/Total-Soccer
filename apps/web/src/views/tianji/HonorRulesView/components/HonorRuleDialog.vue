<script setup lang="ts">
import { computed, toRef } from 'vue';
import CompetitionSelect from '@/components/selects/CompetitionSelect.vue';
import type { CompetitionTargetType } from '@/services/types/competitions';
import type {
  HonorRuleConversionType,
  HonorRuleItem,
  HonorRulePayload,
  HonorRulePlacementScope
} from '@/services/types/honor-rules';
import IconFont from '@/components/IconFont.vue';

const props = defineProps<{
  title: string;
  form: HonorRulePayload;
  rule: HonorRuleItem | null;
  submitting: boolean;
  getTargetTypeLabel: (value: CompetitionTargetType) => string;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const form = toRef(props, 'form');

const emit = defineEmits<{
  save: [];
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

const targetType = computed(() => props.rule?.targetType);

function formatScope(rule: HonorRuleItem) {
  if (rule.scopeType === 'GLOBAL') return '全球';
  if (rule.scopeType === 'CONFEDERATION') return rule.confederation?.name ?? '足联';
  if (rule.scopeType === 'COUNTRY') return rule.country?.name ?? '国家';
  if (rule.scopeType === 'CUSTOM') return '自定义';

  return '全部';
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="720px">
    <div v-if="rule" class="rule-readonly-grid">
      <div>
        <span>规则编码</span>
        <strong>{{ rule.code }}</strong>
      </div>
      <div>
        <span>对象类型</span>
        <strong>{{ getTargetTypeLabel(rule.targetType) }}</strong>
      </div>
      <div>
        <span>分类</span>
        <strong>{{ rule.category || '-' }}</strong>
      </div>
      <div>
        <span>级别</span>
        <strong>{{ rule.level || '-' }}</strong>
      </div>
      <div>
        <span>赛制</span>
        <strong>{{ rule.format || '-' }}</strong>
      </div>
      <div>
        <span>适用范围</span>
        <strong>{{ formatScope(rule) }}</strong>
      </div>
      <div>
        <span>名次范围</span>
        <strong>{{ placementScopeLabels[rule.placementScope] }}</strong>
      </div>
      <div>
        <span>换算方式</span>
        <strong>{{ conversionTypeLabels[rule.conversionType] }}</strong>
      </div>
    </div>

    <el-form class="honor-rule-form" label-position="top">
      <el-form-item label="典型命中赛事">
        <CompetitionSelect
          v-model="form.typicalCompetitionIds"
          :target-type="targetType"
          multiple
          placeholder="可选择多个典型赛事"
        />
      </el-form-item>
      <el-form-item label="冠军分">
        <el-input-number
          v-model="form.championScore"
          :min="0"
          :precision="2"
          :controls="false"
          placeholder="不计分可留空"
        />
      </el-form-item>
      <el-form-item label="亚军分">
        <el-input-number
          v-model="form.runnerUpScore"
          :min="0"
          :precision="2"
          :controls="false"
          placeholder="不计分可留空"
        />
      </el-form-item>
      <el-form-item label="季军分">
        <el-input-number
          v-model="form.thirdPlaceScore"
          :min="0"
          :precision="2"
          :controls="false"
          placeholder="不计分可留空"
        />
      </el-form-item>
      <el-form-item label="殿军分">
        <el-input-number
          v-model="form.fourthPlaceScore"
          :min="0"
          :precision="2"
          :controls="false"
          placeholder="不计分可留空"
        />
      </el-form-item>
      <el-form-item label="四强分">
        <el-input-number
          v-model="form.semiFinalistScore"
          :min="0"
          :precision="2"
          :controls="false"
          placeholder="不计分可留空"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="可填写评分口径说明"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button :disabled="submitting" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="emit('save')">
        <IconFont name="save" />
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.rule-readonly-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;

  > div {
    min-width: 0;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--surface-soft);
  }

  span {
    display: block;
    margin-bottom: 4px;
    color: var(--muted);
    font-size: 12px;
  }

  strong {
    display: block;
    overflow: hidden;
    color: var(--text);
    font-size: 14px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.honor-rule-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;

  :deep(.el-form-item:first-child),
  :deep(.el-form-item:last-child) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .rule-readonly-grid,
  .honor-rule-form {
    grid-template-columns: 1fr;
  }
}
</style>

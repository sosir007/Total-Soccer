<script setup lang="ts">
import { toRef } from 'vue';
import type { AwardScopeType, AwardTargetType } from '@/services/types/awards';
import type { LifecycleStatus } from '@/services/types/common';
import { CompetitionSelect, ConfederationSelect, CountrySelect } from '@/components/selects';

const props = defineProps<{
  title: string;
  submitText: string;
  form: {
    code: string;
    name: string;
    targetType: AwardTargetType;
    ruleCategoryKey: string;
    scopeType: AwardScopeType;
    confederationId: string;
    countryId: string;
    category: string;
    level: string;
    externalUrl: string;
    description: string;
    competitionId: string;
    lifecycleStatus: LifecycleStatus;
    enabled: boolean;
    sortOrder: number;
  };
  creating: boolean;
  scopeTypeOptions: Array<{ label: string; value: AwardScopeType }>;
  targetTypeOptions: Array<{ label: string; value: AwardTargetType }>;
  lifecycleStatusOptions: Array<{ label: string; value: LifecycleStatus }>;
  awardLevelOptions: string[];
  awardRuleOptions: Array<{
    value: string;
    label: string;
    scopeType: AwardScopeType;
    category: string;
    level: string;
    description: string;
  }>;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const form = toRef(props, 'form');

const emit = defineEmits<{
  submit: [];
}>();
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="760px" destroy-on-close>
    <el-form class="competition-form-grid" label-position="top" @submit.prevent="emit('submit')">
      <el-form-item label="奖项编码">
        <el-input v-model="form.code" placeholder="BALLON_DOR" />
      </el-form-item>
      <el-form-item label="奖项名称">
        <el-input v-model="form.name" placeholder="金球奖" />
      </el-form-item>
      <el-form-item label="获奖对象">
        <el-select v-model="form.targetType" placeholder="选择获奖对象">
          <el-option
            v-for="targetType in targetTypeOptions"
            :key="targetType.value"
            :label="targetType.label"
            :value="targetType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="评分规则">
        <el-select
          v-model="form.ruleCategoryKey"
          filterable
          clearable
          placeholder="选择奖项所属的评分规则，例如 国际一级综合奖"
        >
          <el-option
            v-for="option in awardRuleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
            <div class="option-row">
              <span>{{ option.label }}</span>
              <span>{{ option.description }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="范围">
        <el-select v-model="form.scopeType" disabled>
          <el-option
            v-for="scopeType in scopeTypeOptions"
            :key="scopeType.value"
            :label="scopeType.label"
            :value="scopeType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'CONFEDERATION'" label="足联">
        <ConfederationSelect
          v-model="form.confederationId"
          placeholder="选择足联"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'COUNTRY'" label="国家">
        <CountrySelect v-model="form.countryId" placeholder="选择国家" :clearable="false" />
      </el-form-item>
      <el-form-item label="关联赛事">
        <CompetitionSelect v-model="form.competitionId" placeholder="非赛事奖项可不选" />
      </el-form-item>
      <el-form-item label="奖项类型">
        <el-select v-model="form.level" clearable placeholder="选择奖项类型">
          <el-option
            v-for="option in awardLevelOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="外链">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="form.sortOrder"
          :min="0"
          :controls="false"
          placeholder="奖项列表展示顺序"
        />
      </el-form-item>
      <el-form-item label="描述" class="form-wide">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="奖项说明、统计口径或备注"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <el-form-item label="奖项状态">
        <el-segmented v-model="form.lifecycleStatus" :options="lifecycleStatusOptions" />
      </el-form-item>
      <div class="competition-form-actions">
        <el-button type="primary" :loading="creating" @click="emit('submit')">
          {{ submitText }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">
.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  span:first-child {
    color: var(--text-color-primary);
  }

  span:last-child {
    color: var(--text-color-secondary);
    font-size: 12px;
  }
}
</style>

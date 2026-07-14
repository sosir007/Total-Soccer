<script setup lang="ts">
import { toRef } from 'vue';
import type {
  CompetitionCategory,
  CompetitionFormat,
  CompetitionLevel,
  CompetitionScopeType,
  CompetitionTargetType
} from '@/services/types/competitions';
import type { LifecycleStatus } from '@/services/types/common';
import { ConfederationSelect, CountrySelect } from '@/components/selects';

const props = defineProps<{
  title: string;
  submitText: string;
  form: {
    code: string;
    name: string;
    alias: string;
    honorRuleId: string;
    externalUrl: string;
    targetType: CompetitionTargetType;
    scopeType: CompetitionScopeType;
    category: string;
    level: string;
    format: '' | CompetitionFormat;
    description: string;
    confederationId: string;
    confederationIds: string[];
    countryId: string;
    countryIds: string[];
    lifecycleStatus: LifecycleStatus;
    enabled: boolean;
    includeInStats: boolean;
    sortOrder: number;
  };
  submitting: boolean;
  showFormatField: boolean;
  targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }>;
  scopeTypeOptions: Array<{ label: string; value: CompetitionScopeType }>;
  categoryOptions: Array<{ label: string; value: CompetitionCategory }>;
  levelOptions: Array<{ label: string; value: CompetitionLevel }>;
  formatOptions: Array<{ label: string; value: CompetitionFormat }>;
  lifecycleStatusOptions: Array<{ label: string; value: LifecycleStatus }>;
  honorRuleOptions: Array<{
    value: string;
    label: string;
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
      <el-form-item label="赛事编码">
        <el-input v-model="form.code" placeholder="FIFA_WORLD_CUP" />
      </el-form-item>
      <el-form-item label="赛事名称">
        <el-input v-model="form.name" placeholder="国际足联世界杯" />
      </el-form-item>
      <el-form-item label="别名">
        <el-input v-model="form.alias" placeholder="世界杯" />
      </el-form-item>
      <el-form-item label="荣誉规则">
        <el-select
          v-model="form.honorRuleId"
          filterable
          clearable
          placeholder="选择赛事命中的荣誉规则"
          popper-class="competition-rule-select-popper"
        >
          <el-option
            v-for="rule in honorRuleOptions"
            :key="rule.value"
            :label="rule.label"
            :value="rule.value"
          >
            <div class="option-row">
              <span>{{ rule.label }}</span>
              <span>{{ rule.description }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对象">
        <el-select v-model="form.targetType" :disabled="Boolean(form.honorRuleId)">
          <el-option
            v-for="targetType in targetTypeOptions"
            :key="targetType.value"
            :label="targetType.label"
            :value="targetType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="适用范围">
        <el-select v-model="form.scopeType" :disabled="Boolean(form.honorRuleId)">
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
          v-model="form.confederationIds"
          placeholder="选择一个或多个足联"
          :clearable="false"
          multiple
        />
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'COUNTRY'" label="国家">
        <CountrySelect
          v-model="form.countryIds"
          placeholder="选择一个或多个国家"
          :clearable="false"
          multiple
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="form.category"
          clearable
          placeholder="选择分类"
          :disabled="Boolean(form.honorRuleId)"
        >
          <el-option
            v-for="category in categoryOptions"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="级别">
        <el-select
          v-model="form.level"
          clearable
          placeholder="选择级别"
          :disabled="Boolean(form.honorRuleId)"
        >
          <el-option
            v-for="level in levelOptions"
            :key="level.value"
            :label="level.label"
            :value="level.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showFormatField" label="赛制">
        <el-select
          v-model="form.format"
          clearable
          placeholder="选择赛制"
          :disabled="Boolean(form.honorRuleId)"
        >
          <el-option
            v-for="format in formatOptions"
            :key="format.value"
            :label="format.label"
            :value="format.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="外链">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortOrder" :min="0" :controls="false" />
      </el-form-item>
      <el-form-item label="描述" class="form-wide">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="赛事说明、统计口径或备注"
        />
      </el-form-item>
      <div class="form-wide form-help">
        赛事编码建议使用英文大写下划线，例如
        FIFA_WORLD_CUP、UEFA_CHAMPIONS_LEAGUE、LA_LIGA。适用范围决定哪些国家或俱乐部会看到赛事；分类、级别用于归类和后续计分，赛制仅用于国内赛事区分联赛和杯赛。
      </div>
      <el-form-item label="状态">
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <el-form-item label="赛事状态">
        <el-segmented v-model="form.lifecycleStatus" :options="lifecycleStatusOptions" />
      </el-form-item>
      <el-form-item label="统计">
        <el-switch
          v-model="form.includeInStats"
          active-text="纳入奖牌/荣誉统计"
          inactive-text="排除统计"
        />
      </el-form-item>
      <div class="competition-form-actions">
        <el-button type="primary" :loading="submitting" @click="emit('submit')">
          {{ submitText }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">
.form-help {
  color: var(--text-color-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-width: 0;

  span:first-child {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-color-primary);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span:last-child {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-color-secondary);
    font-size: 12px;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

:global(.competition-rule-select-popper.el-popper) {
  max-width: min(720px, calc(100vw - 32px));
}

:global(.competition-rule-select-popper .el-select-dropdown__item) {
  overflow: hidden;
}
</style>

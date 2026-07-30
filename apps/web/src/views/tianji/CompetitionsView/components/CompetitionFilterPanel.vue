<script setup lang="ts">
import { toRef } from 'vue';
import type {
  CompetitionCategory,
  CompetitionLevel,
  CompetitionScopeType,
  CompetitionTargetType
} from '@/services/types/competitions';
import type { LifecycleStatus } from '@/services/types/common';
import IconFont from '@/components/IconFont.vue';

const props = defineProps<{
  filters: {
    keyword: string;
    honorRuleId: string;
    targetType: '' | CompetitionTargetType;
    scopeType: '' | CompetitionScopeType;
    category: '' | CompetitionCategory;
    level: '' | CompetitionLevel;
    lifecycleStatus: '' | LifecycleStatus;
  };
  loading: boolean;
  honorRuleOptions: Array<{ label: string; value: string; description: string }>;
  scopeTypeOptions: Array<{ label: string; value: CompetitionScopeType }>;
  categoryOptions: Array<{ label: string; value: CompetitionCategory }>;
  levelOptions: Array<{ label: string; value: CompetitionLevel }>;
  lifecycleStatusOptions: Array<{ label: string; value: LifecycleStatus }>;
}>();

const filters = toRef(props, 'filters');

const emit = defineEmits<{
  submit: [];
  reset: [];
}>();
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>赛事管理</h2>
        <p>维护赛事基础资料。点击赛事名称打开详情页签，在详情里维护资料和历届结果。</p>
      </div>
      <span class="status-pill">Competition Hub</span>
    </div>

    <el-form class="filter-grid" label-position="top" @submit.prevent="emit('submit')">
      <el-form-item label="关键词">
        <el-input
          v-model="filters.keyword"
          clearable
          :disabled="Boolean(filters.honorRuleId)"
          placeholder="赛事名称 / 编码 / 分类 / 描述"
          @keyup.enter="emit('submit')"
        />
      </el-form-item>
      <el-form-item label="规则名称">
        <el-select
          v-model="filters.honorRuleId"
          clearable
          filterable
          placeholder="全部规则"
          popper-class="competition-rule-select-popper"
        >
          <el-option
            v-for="rule in honorRuleOptions"
            :key="rule.value"
            :label="rule.label"
            :value="rule.value"
          >
            <div class="rule-option">
              <span>{{ rule.label }}</span>
              <small>{{ rule.description }}</small>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="范围">
        <el-select
          v-model="filters.scopeType"
          clearable
          :disabled="Boolean(filters.honorRuleId)"
          placeholder="全部范围"
        >
          <el-option
            v-for="scopeType in scopeTypeOptions"
            :key="scopeType.value"
            :label="scopeType.label"
            :value="scopeType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="filters.category"
          clearable
          filterable
          :disabled="Boolean(filters.honorRuleId)"
          placeholder="全部分类"
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
          v-model="filters.level"
          clearable
          filterable
          :disabled="Boolean(filters.honorRuleId)"
          placeholder="全部级别"
        >
          <el-option
            v-for="level in levelOptions"
            :key="level.value"
            :label="level.label"
            :value="level.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="赛事状态">
        <el-select
          v-model="filters.lifecycleStatus"
          clearable
          :disabled="Boolean(filters.honorRuleId)"
          placeholder="全部状态"
        >
          <el-option
            v-for="status in lifecycleStatusOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <div class="filter-actions">
        <el-button type="primary" :loading="loading" @click="emit('submit')">
          <IconFont name="filter" />
          筛选
        </el-button>
        <el-button :disabled="loading" @click="emit('reset')">
          <IconFont name="reset" />
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.rule-option {
  display: grid;
  gap: 2px;
  line-height: 1.2;

  small {
    color: #999;
    font-size: 12px;
  }
}
</style>

<style lang="scss">
.competition-rule-select-popper .el-select-dropdown__item {
  height: auto;
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>

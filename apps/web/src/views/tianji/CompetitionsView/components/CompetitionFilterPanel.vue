<script setup lang="ts">
import { toRef } from 'vue';
import type { CompetitionScopeType, CompetitionTargetType } from '@/services/types/competitions';

const props = defineProps<{
  filters: {
    keyword: string;
    targetType: '' | CompetitionTargetType;
    scopeType: '' | CompetitionScopeType;
  };
  loading: boolean;
  targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }>;
  scopeTypeOptions: Array<{ label: string; value: CompetitionScopeType }>;
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
          placeholder="赛事名称 / 编码 / 分类 / 描述"
          @keyup.enter="emit('submit')"
        />
      </el-form-item>
      <el-form-item label="对象">
        <el-select v-model="filters.targetType" clearable placeholder="全部对象">
          <el-option
            v-for="targetType in targetTypeOptions"
            :key="targetType.value"
            :label="targetType.label"
            :value="targetType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="范围">
        <el-select v-model="filters.scopeType" clearable placeholder="全部范围">
          <el-option
            v-for="scopeType in scopeTypeOptions"
            :key="scopeType.value"
            :label="scopeType.label"
            :value="scopeType.value"
          />
        </el-select>
      </el-form-item>
      <div class="filter-actions">
        <el-button type="primary" :loading="loading" @click="emit('submit')">筛选</el-button>
        <el-button :disabled="loading" @click="emit('reset')">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import type { AwardScopeType } from '@/services/types/awards';
import type { LifecycleStatus } from '@/services/types/common';
import IconFont from '@/components/IconFont.vue';

const props = defineProps<{
  filters: {
    keyword: string;
    scopeType: '' | AwardScopeType;
    lifecycleStatus: '' | LifecycleStatus;
  };
  loading: boolean;
  scopeTypeOptions: Array<{ label: string; value: AwardScopeType }>;
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
        <h2>奖项管理</h2>
        <p>维护金球奖、世界足球先生、洲际和国家个人奖项，以及每年获奖球员。</p>
      </div>
      <span class="status-pill">Award Hub</span>
    </div>

    <el-form class="filter-grid" label-position="top" @submit.prevent="emit('submit')">
      <el-form-item label="关键词">
        <el-input
          v-model="filters.keyword"
          clearable
          placeholder="奖项名称 / 编码 / 分类 / 描述"
          @keyup.enter="emit('submit')"
        />
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
      <el-form-item label="奖项状态">
        <el-select v-model="filters.lifecycleStatus" clearable placeholder="全部状态">
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

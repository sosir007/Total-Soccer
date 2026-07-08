<script setup lang="ts">
import { toRef } from 'vue';
import type { BaseConfigType } from '@/services/types/base-config';
import IconFont from '@/components/IconFont.vue';

interface ConfigTab {
  type: BaseConfigType;
  label: string;
  description: string;
}

interface BaseConfigFilters {
  keyword: string;
}

const props = defineProps<{
  activeType: BaseConfigType;
  activeTab: ConfigTab;
  configTabs: ConfigTab[];
  filters: BaseConfigFilters;
  loading: boolean;
}>();

const emit = defineEmits<{
  'update:activeType': [value: BaseConfigType];
  submit: [];
  reset: [];
  create: [];
}>();

const filters = toRef(props, 'filters');
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>基础配置</h2>
        <p>维护足联、位置、球员类型和基础字典，为后续手动录入保持数据口径一致。</p>
      </div>
      <span class="status-pill">真实配置</span>
    </div>

    <el-tabs
      :model-value="activeType"
      class="base-config-tabs"
      @update:model-value="emit('update:activeType', $event as BaseConfigType)"
    >
      <el-tab-pane v-for="tab in configTabs" :key="tab.type" :label="tab.label" :name="tab.type" />
    </el-tabs>

    <div class="base-config-intro">
      <strong>{{ activeTab.label }}</strong>
      <span>{{ activeTab.description }}</span>
    </div>

    <el-form
      class="filter-grid compact-filter base-config-filter"
      label-position="top"
      @submit.prevent="emit('submit')"
    >
      <el-form-item label="关键词">
        <el-input
          v-model="filters.keyword"
          clearable
          placeholder="编码 / 名称 / 描述"
          @keyup.enter="emit('submit')"
        />
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
        <el-button type="success" :disabled="loading" @click="emit('create')">
          <IconFont name="add" />
          新增{{ activeTab.label }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.base-config-tabs {
  margin-top: 6px;
}

.base-config-intro {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 2px 0 16px;
  color: var(--text-color-secondary);

  strong {
    color: var(--color-brand-primary);
  }
}

.base-config-filter {
  grid-template-columns: minmax(280px, 560px) auto;
}
</style>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'empty' | 'loading' | 'error';
    title?: string;
    description?: string;
    rows?: number;
  }>(),
  {
    type: 'empty',
    title: '',
    description: '',
    rows: 10
  }
);
</script>

<template>
  <div class="panel" :class="{ 'empty-panel': type === 'empty' }">
    <el-skeleton v-if="type === 'loading'" :rows="rows" animated />

    <template v-else-if="type === 'error'">
      <el-alert type="error" :title="title" show-icon :closable="false" />
      <div v-if="$slots.actions" class="detail-actions">
        <slot name="actions" />
      </div>
    </template>

    <template v-else>
      <h3 v-if="title">{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
      <slot />
      <div v-if="$slots.actions" class="detail-actions">
        <slot name="actions" />
      </div>
    </template>
  </div>
</template>

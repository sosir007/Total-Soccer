<script setup lang="ts">
import NoDataView from '@/components/NoDataView.vue';

withDefaults(
  defineProps<{
    title?: string;
    badge?: string | number | null;
    empty?: boolean;
    emptyText?: string;
  }>(),
  {
    title: '',
    badge: null,
    empty: false,
    emptyText: '暂无数据'
  }
);
</script>

<template>
  <div class="panel">
    <div v-if="title || badge !== null || $slots.extra" class="panel-header">
      <h3 v-if="title">{{ title }}</h3>

      <slot name="extra">
        <span v-if="badge !== null" class="status-pill">{{ badge }}</span>
      </slot>
    </div>

    <slot v-if="empty" name="empty">
      <NoDataView :text="emptyText" />
    </slot>

    <slot v-else />
  </div>
</template>

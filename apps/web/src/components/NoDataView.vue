<script setup lang="ts">
import noDataImage from '@/assets/images/no-data-archive.svg';

withDefaults(
  defineProps<{
    text?: string;
    imageSrc?: string;
    imageAlt?: string;
  }>(),
  {
    text: '暂无数据',
    imageSrc: noDataImage,
    imageAlt: ''
  }
);
</script>

<template>
  <div class="no-data-view">
    <img
      class="no-data-view__image"
      :src="imageSrc"
      :alt="imageAlt"
      :aria-hidden="imageAlt ? undefined : 'true'"
    />
    <div class="no-data-view__text">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.no-data-view {
  display: grid;
  min-height: 148px;
  gap: 10px;
  place-items: center;
  align-content: center;
  padding: 20px 16px;
  border: 1px dashed var(--color-border-default);
  border-radius: 8px;
  color: var(--text-color-secondary);
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  background: rgba(248, 250, 248, 0.76);
}

.no-data-view__image {
  display: block;
  width: min(148px, 52vw);
  max-width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
}

.no-data-view__text {
  max-width: 28em;
  line-height: 1.6;
}
</style>

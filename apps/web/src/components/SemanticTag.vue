<script setup lang="ts">
import { computed } from 'vue';
import type { SemanticTagVariant } from '@/utils/tag-theme';
import { getSemanticTagStyle } from '@/utils/tag-theme';

const props = withDefaults(
  defineProps<{
    variant?: SemanticTagVariant | string | null;
    size?: 'small' | 'default';
    round?: boolean;
  }>(),
  {
    variant: 'neutral',
    size: 'default',
    round: false
  }
);

const tagStyle = computed(() => getSemanticTagStyle(props.variant));
</script>

<template>
  <span
    class="semantic-tag"
    :class="[`semantic-tag--${size}`, { 'is-round': round }]"
    :style="tagStyle"
  >
    <slot />
  </span>
</template>

<style scoped lang="scss">
.semantic-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  height: 24px;
  padding: 0 10px;
  overflow: hidden;
  border: 1px solid;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 760;
  line-height: 1;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;

  &--small {
    height: 22px;
    padding: 0 8px;
    font-size: 12px;
  }

  &.is-round {
    border-radius: 999px;
  }
}
</style>

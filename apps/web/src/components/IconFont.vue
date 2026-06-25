<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
    title?: string;
    decorative?: boolean;
  }>(),
  {
    size: undefined,
    title: '',
    decorative: true
  }
);

const resolvedSize = computed(() => {
  if (props.size === undefined) {
    return undefined;
  }

  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>

<template>
  <i
    class="iconfont icon-font"
    :class="`ts-${name}`"
    :style="{ fontSize: resolvedSize }"
    :title="title || undefined"
    :aria-hidden="decorative && !title ? 'true' : undefined"
    role="img"
  />
</template>

<style scoped lang="scss">
.icon-font {
  display: inline-flex;
  width: 1em;
  height: 1em;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: currentcolor;
  vertical-align: -0.125em;
}
</style>

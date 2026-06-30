<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    content?: string | number | null;
    disabled?: boolean;
    placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  }>(),
  {
    content: '',
    disabled: false,
    placement: 'top'
  }
);

const textRef = ref<HTMLElement | null>(null);
const isOverflow = ref(false);
let resizeObserver: ResizeObserver | null = null;

const displayContent = computed(() => {
  if (props.content === null || props.content === undefined || props.content === '') {
    return '-';
  }

  return String(props.content);
});

function updateOverflow() {
  const el = textRef.value;

  if (!el) {
    isOverflow.value = false;
    return;
  }

  isOverflow.value = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
}

onMounted(() => {
  nextTick(updateOverflow);

  if (textRef.value) {
    resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(textRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(displayContent, () => {
  nextTick(updateOverflow);
});
</script>

<template>
  <el-tooltip
    :content="displayContent"
    :disabled="disabled || !isOverflow"
    :placement="placement"
    :show-after="180"
  >
    <span ref="textRef" class="overflow-tooltip-text">
      <slot>{{ displayContent }}</slot>
    </span>
  </el-tooltip>
</template>

<style scoped lang="scss">
.overflow-tooltip-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}
</style>

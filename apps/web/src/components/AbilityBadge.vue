<script setup lang="ts">
import { computed } from 'vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { getAbilityVariant } from '@/utils/tag-theme';

const props = withDefaults(
  defineProps<{
    type: 'PA' | 'CA';
    value?: string | number | null;
    size?: 'small' | 'default';
    showLabel?: boolean;
  }>(),
  {
    value: null,
    size: 'default',
    showLabel: true
  }
);

const variant = computed(() => getAbilityVariant(props.value));
const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return '-';
  }

  const numericValue = typeof props.value === 'number' ? props.value : Number(props.value);

  return Number.isFinite(numericValue) ? Math.round(numericValue) : '-';
});
</script>

<template>
  <SemanticTag class="ability-badge" :variant="variant" :size="size" round>
    <span v-if="showLabel">{{ type }}</span>
    <strong>{{ displayValue }}</strong>
  </SemanticTag>
</template>

<style scoped lang="scss">
.ability-badge {
  gap: 3px;

  strong {
    color: inherit;
    font-weight: 850;
  }
}
</style>

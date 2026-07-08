<script setup lang="ts">
import { computed } from 'vue';
import SemanticTag from '@/components/SemanticTag.vue';
import { getPositionVariant } from '@/utils/tag-theme';
import type { SemanticTagVariant } from '@/utils/tag-theme';

interface PositionSegment {
  label: string;
  variant?: SemanticTagVariant;
  muted?: boolean;
}

const positionCodes = [
  'WBR',
  'WBL',
  'DMC',
  'AMC',
  'AMR',
  'AML',
  'ST',
  'MC',
  'ML',
  'MR',
  'DL',
  'DC',
  'DR',
  'GK'
];

const props = withDefaults(
  defineProps<{
    value?: string | number | null;
    size?: 'small' | 'default';
  }>(),
  {
    value: '',
    size: 'small'
  }
);

const segments = computed(() => parsePositionSegments(props.value));

function parsePositionSegments(value?: string | number | null): PositionSegment[] {
  const rawValue = String(value ?? '').trim();

  if (!rawValue || rawValue === '-') {
    return [];
  }

  return rawValue
    .split(/[、,，/／|｜;；\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap((item) => parsePositionSegment(item));
}

function parsePositionSegment(item: string): PositionSegment[] {
  const label = /^[a-z]+$/i.test(item) ? item.toUpperCase() : item;
  const variant = getPositionVariant(label);

  if (variant !== 'neutral') {
    return [
      {
        label,
        variant
      }
    ];
  }

  const normalizedItem = item.toUpperCase();
  const positionCode = positionCodes.find(
    (code) => normalizedItem.startsWith(code) && normalizedItem.length > code.length
  );

  if (!positionCode) {
    return [
      {
        label: item,
        muted: true
      }
    ];
  }

  const suffix = item.slice(positionCode.length).trim();
  const codeVariant = getPositionVariant(positionCode);

  return [
    {
      label: positionCode,
      variant: codeVariant === 'neutral' ? undefined : codeVariant,
      muted: codeVariant === 'neutral'
    },
    ...(suffix
      ? [
          {
            label: suffix,
            muted: true
          }
        ]
      : [])
  ];
}
</script>

<template>
  <span v-if="segments.length" class="position-tags">
    <template
      v-for="(segment, index) in segments"
      :key="`${segment.label}-${segment.variant ?? 'muted'}-${index}`"
    >
      <SemanticTag v-if="segment.variant" :variant="segment.variant" :size="size">
        {{ segment.label }}
      </SemanticTag>
      <span v-else class="position-tags__extra">{{ segment.label }}</span>
    </template>
  </span>
  <span v-else>-</span>
</template>

<style scoped lang="scss">
.position-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  max-width: 100%;
  vertical-align: middle;
}

.position-tags__extra {
  min-width: 0;
  overflow: hidden;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 720;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

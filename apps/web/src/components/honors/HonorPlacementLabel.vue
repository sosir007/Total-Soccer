<script setup lang="ts">
import IconFont from '@/components/IconFont.vue';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { placementIconNames, placementLabels } from '@/utils/honor';

const props = withDefaults(
  defineProps<{
    placement: CompetitionStandingPlacement;
    compact?: boolean;
  }>(),
  {
    compact: false
  }
);
</script>

<template>
  <span class="honor-placement-label" :class="{ compact: props.compact }">
    <IconFont :name="placementIconNames[placement]" />
    <span>{{ placementLabels[placement] }}</span>
  </span>
</template>

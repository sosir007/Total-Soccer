<script setup lang="ts">
import { computed } from 'vue';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { placementLabels } from '@/utils/honor';
import { getPlacementTextColor } from '@/utils/tag-theme';
import championIcon from '@/assets/images/honor-icons/champion.svg';
import runnerUpIcon from '@/assets/images/honor-icons/runner-up.svg';
import thirdPlaceIcon from '@/assets/images/honor-icons/third-place.svg';
import fourthPlaceIcon from '@/assets/images/honor-icons/fourth-place.svg';
import topFourIcon from '@/assets/images/honor-icons/top-four.svg';

const placementImageUrls: Record<CompetitionStandingPlacement, string> = {
  CHAMPION: championIcon,
  RUNNER_UP: runnerUpIcon,
  THIRD_PLACE: thirdPlaceIcon,
  FOURTH_PLACE: fourthPlaceIcon,
  SEMI_FINALIST: topFourIcon
};

const props = withDefaults(
  defineProps<{
    placement: CompetitionStandingPlacement;
    compact?: boolean;
  }>(),
  {
    compact: false
  }
);

const placementStyle = computed(() => ({
  '--honor-placement-label-color': getPlacementTextColor(props.placement)
}));
</script>

<template>
  <span class="honor-placement-label" :class="{ compact: props.compact }" :style="placementStyle">
    <img
      class="honor-placement-icon"
      :src="placementImageUrls[placement]"
      alt=""
      aria-hidden="true"
    />
    <span>{{ placementLabels[placement] }}</span>
  </span>
</template>

<style scoped lang="scss">
.honor-placement-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  object-fit: contain;
}

.honor-placement-label {
  color: var(--honor-placement-label-color);
  font-size: 14px;
  font-weight: 800;
  line-height: 24px;
}

.honor-placement-label.compact {
  .honor-placement-icon {
    width: 24px;
    height: 24px;
  }
}
</style>

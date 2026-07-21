<script setup lang="ts">
import { computed } from 'vue';
import NoDataView from '@/components/NoDataView.vue';
import HonorGroupList from '@/components/honors/HonorGroupList.vue';
import type { HonorGroupedRecord } from '@/services/types/catalog';

const props = defineProps<{
  groups?: HonorGroupedRecord[];
}>();

const internationalHonorGroups = computed(() =>
  (props.groups ?? []).filter(isInternationalOrContinentalHonor)
);
const hasInternationalHonorGroups = computed(() => internationalHonorGroups.value.length > 0);
const leftHonorGroups = computed(() =>
  hasInternationalHonorGroups.value
    ? (props.groups ?? []).filter((group) => !isInternationalOrContinentalHonor(group))
    : (props.groups ?? [])
);
const hasLeftHonorContent = computed(() => leftHonorGroups.value.length > 0);

function isInternationalOrContinentalHonor(group: HonorGroupedRecord) {
  const category = group.competition.category;
  return (
    category === '国际' ||
    category === '洲际' ||
    group.competition.scopeType === 'GLOBAL' ||
    group.competition.scopeType === 'CONFEDERATION'
  );
}
</script>

<template>
  <div
    class="club-honor-layout"
    :class="{ 'club-honor-layout--split': hasInternationalHonorGroups }"
  >
    <div class="club-honor-section">
      <div v-if="hasInternationalHonorGroups" class="club-honor-section-title">国内荣誉</div>

      <NoDataView v-if="!hasLeftHonorContent" text="暂无国内荣誉记录" />
      <HonorGroupList v-else :groups="leftHonorGroups" />
    </div>

    <div v-if="hasInternationalHonorGroups" class="club-honor-section">
      <div class="club-honor-section-title">国际与洲际荣誉</div>
      <HonorGroupList :groups="internationalHonorGroups" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.club-honor-layout {
  display: grid;
  gap: 22px;
}

.club-honor-layout--split {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.club-honor-section {
  min-width: 0;
}

.club-honor-layout--split .club-honor-section + .club-honor-section {
  padding-left: 28px;
  border-left: 1px solid var(--color-border-default);
}

.club-honor-section-title {
  margin-bottom: 16px;
  color: var(--text-color-primary);
  font-size: 18px;
  font-weight: 850;
}

@media (max-width: 1180px) {
  .club-honor-layout--split {
    grid-template-columns: 1fr;
  }

  .club-honor-layout--split .club-honor-section + .club-honor-section {
    padding-left: 0;
    border-left: 0;
  }
}
</style>

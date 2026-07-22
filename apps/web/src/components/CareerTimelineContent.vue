<script setup lang="ts">
import { computed } from 'vue';
import LineupBoardContent from '@/components/LineupBoardContent.vue';
import type { CareerTimelineGroup } from '@/services/types/catalog';

const props = defineProps<{
  groups?: CareerTimelineGroup[];
}>();

const emit = defineEmits<{
  openPlayer: [id?: string | null];
}>();

const timelineGroups = computed(() =>
  (props.groups ?? []).map((group) => ({
    position: formatDecade(group.decade),
    items: group.items
  }))
);

function formatDecade(decade: string) {
  return decade.replace(/^(\d{4})-(\d{4})$/, (_, start: string, end: string) => {
    return `${start}-${end.slice(-2)}`;
  });
}
</script>

<template>
  <LineupBoardContent
    class="career-timeline-board"
    :groups="timelineGroups"
    meta-mode="period"
    show-item-position
    @open-player="emit('openPlayer', $event)"
  />
</template>

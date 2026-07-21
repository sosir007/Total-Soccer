<script setup lang="ts">
import AbilityBadge from '@/components/AbilityBadge.vue';
import type { CareerTimelineGroup } from '@/services/types/catalog';

defineProps<{
  groups?: CareerTimelineGroup[];
}>();

const emit = defineEmits<{
  openPlayer: [id?: string | null];
}>();

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}
</script>

<template>
  <div class="career-timeline">
    <div v-for="group in groups" :key="group.decade" class="timeline-block">
      <div class="timeline-decade">{{ group.decade }}</div>
      <div class="timeline-lines">
        <button
          v-for="item in group.items"
          :key="item.id"
          class="timeline-player"
          type="button"
          @click="emit('openPlayer', item.player.id)"
        >
          <span>{{ item.position }}</span>
          <strong>{{ item.player.chineseName }}</strong>
          <em class="ability-inline-meta">
            <AbilityBadge type="PA" :value="item.player.pa" size="small" />
            <span>{{ formatText(item.period) }}</span>
          </em>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AbilityBadge from '@/components/AbilityBadge.vue';
import OverflowTooltip from '@/components/OverflowTooltip.vue';
import PositionTags from '@/components/PositionTags.vue';
import type { CareerProfileLine, LineupPositionGroup } from '@/services/types/catalog';

withDefaults(
  defineProps<{
    groups?: LineupPositionGroup[];
    positionDisplay?: 'text' | 'tags';
  }>(),
  {
    groups: () => [],
    positionDisplay: 'text'
  }
);

const emit = defineEmits<{
  openPlayer: [id?: string | null];
}>();

function formatLineStats(item: CareerProfileLine) {
  const normal = [item.appearances, item.goals, item.assists]
    .map((value) => value ?? '-')
    .join('/');
  const goalkeeper = [item.cleanSheets, item.goalsConceded].some(
    (value) => value !== null && value !== undefined
  )
    ? `，零封/失球 ${item.cleanSheets ?? '-'}/${item.goalsConceded ?? '-'}`
    : '';

  return `${normal}${goalkeeper}`;
}
</script>

<template>
  <div class="lineup-board">
    <div v-for="group in groups" :key="group.position" class="lineup-row">
      <div class="lineup-position">
        <PositionTags v-if="positionDisplay === 'tags'" :value="group.position" />
        <template v-else>{{ group.position }}</template>
      </div>
      <div v-if="!group.items.length" class="lineup-empty">-</div>
      <div v-else class="lineup-players">
        <button
          v-for="item in group.items"
          :key="item.id"
          class="lineup-player"
          type="button"
          @click="emit('openPlayer', item.player.id)"
        >
          <strong>
            <OverflowTooltip :content="item.player.chineseName" />
          </strong>
          <div class="lineup-player-meta">
            <AbilityBadge type="PA" :value="item.player.pa" size="small" />
            <em>{{ formatLineStats(item) }}</em>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

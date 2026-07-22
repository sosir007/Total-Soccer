<script setup lang="ts">
import AbilityBadge from '@/components/AbilityBadge.vue';
import OverflowTooltip from '@/components/OverflowTooltip.vue';
import PositionTags from '@/components/PositionTags.vue';
import type { CareerProfileLine, LineupPositionGroup } from '@/services/types/catalog';

withDefaults(
  defineProps<{
    groups?: LineupPositionGroup[];
    positionDisplay?: 'text' | 'tags';
    metaMode?: 'stats' | 'period';
    showItemPosition?: boolean;
  }>(),
  {
    groups: () => [],
    positionDisplay: 'text',
    metaMode: 'stats',
    showItemPosition: false
  }
);

const emit = defineEmits<{
  openPlayer: [id?: string | null];
}>();

function formatLineMeta(item: CareerProfileLine, mode: 'stats' | 'period') {
  return mode === 'period' ? formatText(item.period) : formatLineStats(item);
}

function formatLineStats(item: CareerProfileLine) {
  const stats = isGoalkeeperPosition(item.position)
    ? [item.appearances, item.cleanSheets, item.goalsConceded]
    : [item.appearances, item.goals, item.assists];

  return stats.map((value) => value ?? '-').join('/');
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function isGoalkeeperPosition(position?: string | null) {
  const normalized = (position ?? '').trim().toUpperCase();
  return normalized === 'GK' || normalized.includes('门将') || normalized.includes('守门');
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
            <em>{{ formatLineMeta(item, metaMode) }}</em>
            <PositionTags v-if="showItemPosition" :value="item.position" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

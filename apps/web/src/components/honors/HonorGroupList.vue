<script setup lang="ts">
import EntityLink from '@/components/EntityLink.vue';
import type { HonorGroupedPlacementEntry, HonorGroupedRecord } from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { placementOptions } from '@/utils/honor';
import HonorPlacementLabel from './HonorPlacementLabel.vue';

defineProps<{
  groups?: HonorGroupedRecord[];
}>();

function getEntries(group: HonorGroupedRecord, placement: CompetitionStandingPlacement) {
  return group.placements[placement] ?? [];
}

function formatEntry(entry: HonorGroupedPlacementEntry) {
  return entry.sourceName ? `${entry.label}（${entry.sourceName}）` : entry.label;
}
</script>

<template>
  <div v-if="!groups?.length" class="mini-empty">暂无赛事荣誉记录</div>

  <div v-else class="honor-group-list">
    <div v-for="group in groups" :key="group.competition.id" class="honor-group">
      <div class="honor-group-title">
        <EntityLink :id="group.competition.id" type="competition" :name="group.competition.name" />
        <span>{{
          group.competition.category || group.competition.level || group.competition.code
        }}</span>
      </div>

      <div class="honor-group-placements">
        <template v-for="placement in placementOptions" :key="placement.value">
          <div v-if="getEntries(group, placement.value).length" class="honor-group-placement">
            <HonorPlacementLabel :placement="placement.value" />
            <strong>({{ getEntries(group, placement.value).length }})：</strong>
            <span>
              {{ getEntries(group, placement.value).map(formatEntry).join('、') }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

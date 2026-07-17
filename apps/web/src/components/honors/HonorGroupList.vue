<script setup lang="ts">
import EntityLink from '@/components/EntityLink.vue';
import NoDataView from '@/components/NoDataView.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { HonorGroupedPlacementEntry, HonorGroupedRecord } from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { placementOptions } from '@/utils/honor';
import { getCompetitionCategoryVariant, getPlacementTextColor } from '@/utils/tag-theme';
import HonorPlacementLabel from './HonorPlacementLabel.vue';

defineProps<{
  groups?: HonorGroupedRecord[];
}>();

function getEntries(group: HonorGroupedRecord, placement: CompetitionStandingPlacement) {
  return group.placements[placement] ?? [];
}

function formatEntry(entry: HonorGroupedPlacementEntry) {
  const label = entry.season || (entry.year ? String(entry.year) : entry.label.replace(/年$/, ''));
  return entry.sourceName ? `${label}（${entry.sourceName}）` : label;
}

function getCompetitionTagText(group: HonorGroupedRecord) {
  return group.competition.category || group.competition.level || group.competition.code;
}

function getPlacementStyle(placement: CompetitionStandingPlacement) {
  return {
    '--honor-placement-color': getPlacementTextColor(placement)
  };
}
</script>

<template>
  <NoDataView v-if="!groups?.length" text="暂无赛事荣誉记录" />

  <div v-else class="honor-group-list">
    <div v-for="group in groups" :key="group.competition.id" class="honor-group">
      <div class="honor-group-title">
        <EntityLink :id="group.competition.id" type="competition" :name="group.competition.name" />
        <SemanticTag
          size="small"
          :variant="getCompetitionCategoryVariant(group.competition.category)"
        >
          {{ getCompetitionTagText(group) }}
        </SemanticTag>
      </div>

      <div class="honor-group-placements">
        <template v-for="placement in placementOptions" :key="placement.value">
          <div
            v-if="getEntries(group, placement.value).length"
            class="honor-group-placement"
            :style="getPlacementStyle(placement.value)"
          >
            <HonorPlacementLabel :placement="placement.value" />
            <strong>({{ getEntries(group, placement.value).length }})：</strong>
            <span class="honor-entry-list">
              <template
                v-for="(entry, index) in getEntries(group, placement.value)"
                :key="`${entry.year ?? entry.season ?? entry.label}-${entry.sourceName ?? ''}-${index}`"
              >
                <span v-if="index > 0" class="honor-entry-separator">、</span>
                <span class="honor-entry-year">{{ formatEntry(entry) }}</span>
              </template>
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

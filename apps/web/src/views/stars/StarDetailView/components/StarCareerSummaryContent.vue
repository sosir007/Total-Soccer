<script setup lang="ts">
import { computed } from 'vue';
import EntityLink from '@/components/EntityLink.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import {
  getCareerStatusLabel,
  getCareerStatusVariant,
  getLifeStatusLabel,
  getLifeStatusVariant
} from '@/utils/tag-theme';

const props = defineProps<{
  player: PlayerDetail;
}>();

const clubCareerLinks = computed(() => {
  const clubById = new Map<string, NonNullable<PlayerDetail['careers']>[number]['club']>();

  (props.player.careers ?? []).forEach((career) => {
    if (career.careerType !== 'CLUB') return;

    if (career.club?.id && !clubById.has(career.club.id)) {
      clubById.set(career.club.id, career.club);
    }
  });

  return [...clubById.values()].filter(Boolean);
});

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}
</script>

<template>
  <dl class="detail-list wide">
    <div>
      <dt>初始球队</dt>
      <dd>
        <EntityLink
          :id="player.initialClubRef?.id"
          type="club"
          :name="player.initialClubRef?.name || player.initialClub"
        />
      </dd>
    </div>
    <div>
      <dt>球队经历</dt>
      <dd>
        <span v-if="clubCareerLinks.length" class="summary-club-links">
          <template v-for="(club, index) in clubCareerLinks" :key="club?.id ?? index">
            <span v-if="index > 0">、</span>
            <EntityLink :id="club?.id" type="club" :name="club?.name" />
          </template>
        </span>
        <span v-else>{{ formatText(player.clubs) }}</span>
      </dd>
    </div>
    <div>
      <dt>生涯</dt>
      <dd>
        <SemanticTag
          v-if="player.retired !== null && player.retired !== undefined"
          :variant="getCareerStatusVariant(player.retired)"
          size="small"
        >
          {{ getCareerStatusLabel(player.retired) }}
        </SemanticTag>
        <span v-else>-</span>
      </dd>
    </div>
    <div>
      <dt>生命</dt>
      <dd>
        <SemanticTag
          v-if="player.deceased !== null && player.deceased !== undefined"
          :variant="getLifeStatusVariant(player.deceased)"
          size="small"
        >
          {{ getLifeStatusLabel(player.deceased) }}
        </SemanticTag>
        <span v-else>-</span>
      </dd>
    </div>
    <div>
      <dt>成就</dt>
      <dd>{{ formatText(player.achievement) }}</dd>
    </div>
    <div>
      <dt>备注</dt>
      <dd>{{ formatText(player.remark) }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.summary-club-links {
  display: inline;
}
</style>

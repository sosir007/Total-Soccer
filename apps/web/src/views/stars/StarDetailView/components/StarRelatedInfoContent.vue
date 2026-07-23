<script setup lang="ts">
import { computed } from 'vue';
import EntityLink from '@/components/EntityLink.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { getConfederationVariant } from '@/utils/tag-theme';

const props = defineProps<{
  player: PlayerDetail;
}>();

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatNationality() {
  const names = props.player.nationalities?.map((item) => item.country.name).filter(Boolean);

  return names?.length ? names.join('、') : formatText(props.player.nationality);
}

const birthCityName = computed(() => props.player.birthCityRef?.name ?? props.player.birthCity);
const birthCityCountry = computed(
  () => props.player.birthCityRef?.country ?? props.player.birthCountry ?? null
);

function formatBirthCityName() {
  return birthCityName.value || '-';
}

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
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>足联</dt>
      <dd>
        <SemanticTag
          v-if="formatRef(player.confederationRef) !== '-'"
          :variant="getConfederationVariant(formatRef(player.confederationRef))"
        >
          {{ formatRef(player.confederationRef) }}
        </SemanticTag>
        <span v-else>-</span>
      </dd>
    </div>
    <div>
      <dt>代表国籍</dt>
      <dd>
        <EntityLink
          :id="player.country?.id"
          type="country"
          :name="formatText(player.representedCountry || player.country?.name)"
        />
      </dd>
    </div>
    <div>
      <dt>国籍</dt>
      <dd>
        <div v-if="player.nationalities?.length" class="inline-entity-list">
          <EntityLink
            v-for="item in player.nationalities"
            :id="item.country.id"
            :key="item.country.id"
            type="country"
            :name="item.country.name"
          />
        </div>
        <span v-else>{{ formatNationality() }}</span>
      </dd>
    </div>
    <div>
      <dt>代表球队</dt>
      <dd>
        <EntityLink
          :id="player.representativeClubCareer?.club?.id ?? player.club?.id"
          type="club"
          :name="formatText(player.representativeClubCareer?.club?.name || player.primaryClub)"
        />
      </dd>
    </div>
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
        <span v-if="clubCareerLinks.length" class="related-club-links">
          <template v-for="(club, index) in clubCareerLinks" :key="club?.id ?? index">
            <span v-if="index > 0">、</span>
            <EntityLink :id="club?.id" type="club" :name="club?.name" />
          </template>
        </span>
        <span v-else>{{ formatText(player.clubs) }}</span>
      </dd>
    </div>
    <div>
      <dt>出生城市</dt>
      <dd>
        <template v-if="birthCityName">
          {{ formatBirthCityName() }}
          <template v-if="birthCityCountry">
            （<EntityLink
              :id="birthCityCountry.id"
              type="country"
              :name="birthCityCountry.name"
            />）
          </template>
        </template>
        <span v-else>-</span>
      </dd>
    </div>
    <div>
      <dt>担任过职位</dt>
      <dd>{{ formatText(player.staffRoles) }}</dd>
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
.related-club-links {
  display: inline;
}
</style>

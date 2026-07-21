<script setup lang="ts">
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

function formatBirthCity() {
  const city = props.player.birthCityRef?.name ?? props.player.birthCity;
  const country = props.player.birthCityRef?.country?.name ?? props.player.birthCountry?.name;

  if (!city) {
    return '-';
  }

  return country ? `${city}（${country}）` : city;
}
</script>

<template>
  <dl class="detail-list">
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
      <dt>俱乐部</dt>
      <dd>
        <EntityLink :id="player.club?.id" type="club" :name="formatRef(player.club)" />
      </dd>
    </div>
    <div>
      <dt>主要球队</dt>
      <dd>
        <EntityLink
          :id="player.representativeClubCareer?.club?.id ?? player.club?.id"
          type="club"
          :name="formatText(player.representativeClubCareer?.club?.name || player.primaryClub)"
        />
      </dd>
    </div>
    <div>
      <dt>出生城市</dt>
      <dd>{{ formatBirthCity() }}</dd>
    </div>
    <div>
      <dt>担任过职位</dt>
      <dd>{{ formatText(player.staffRoles) }}</dd>
    </div>
  </dl>
</template>

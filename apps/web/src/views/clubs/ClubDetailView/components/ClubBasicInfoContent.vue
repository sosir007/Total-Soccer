<script setup lang="ts">
import EntityNameCell from '@/components/EntityNameCell.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { ClubDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { formatEntityName } from '@/utils/entity-name';
import { getConfederationVariant } from '@/utils/tag-theme';

defineProps<{
  club: ClubDetail;
}>();

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>英文名</dt>
      <dd>{{ formatText(club.englishName) }}</dd>
    </div>
    <div>
      <dt>简称</dt>
      <dd>{{ formatText(club.shortName) }}</dd>
    </div>
    <div>
      <dt>曾用名</dt>
      <dd>{{ formatText(club.formerName) }}</dd>
    </div>
    <div>
      <dt>别名</dt>
      <dd>{{ formatText(club.alias) }}</dd>
    </div>
    <div>
      <dt>国家</dt>
      <dd>
        <EntityNameCell
          v-if="club.countryRef"
          :id="club.countryRef.id"
          type="country"
          :title="formatEntityName(club.countryRef)"
        />
        <span v-else>-</span>
      </dd>
    </div>
    <div>
      <dt>足联</dt>
      <dd>
        <SemanticTag
          v-if="formatRef(club.federationRef) !== '-'"
          :variant="getConfederationVariant(formatRef(club.federationRef))"
        >
          {{ formatRef(club.federationRef) }}
        </SemanticTag>
        <span v-else>-</span>
      </dd>
    </div>
    <div>
      <dt>备注</dt>
      <dd>{{ formatText(club.remark) }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import EntityNameCell from '@/components/EntityNameCell.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { ClubDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { getBooleanLabel, getBooleanVariant, getConfederationVariant } from '@/utils/tag-theme';

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
          :title="club.countryRef.name"
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
      <dt>存在 / 展示</dt>
      <dd>
        <span class="club-status-tags">
          <SemanticTag :variant="getBooleanVariant(club.exists)">
            {{ getBooleanLabel(club.exists) }}
          </SemanticTag>
          <span class="club-status-separator">/</span>
          <SemanticTag :variant="getBooleanVariant(club.visibleInCatalog)">
            {{ getBooleanLabel(club.visibleInCatalog) }}
          </SemanticTag>
        </span>
      </dd>
    </div>
    <div>
      <dt>备注</dt>
      <dd>{{ formatText(club.remark) }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.club-status-tags {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.club-status-separator {
  color: var(--text-color-secondary);
}
</style>

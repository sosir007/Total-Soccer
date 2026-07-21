<script setup lang="ts">
import SemanticTag from '@/components/SemanticTag.vue';
import type { CountryDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import { getBooleanLabel, getBooleanVariant, getConfederationVariant } from '@/utils/tag-theme';

const props = defineProps<{
  country: CountryDetail;
}>();

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function countryExternalUrl() {
  return buildExternalUrl(props.country.externalUrl, props.country.name || '国家队');
}
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>国家</dt>
      <dd>{{ country.name }}</dd>
    </div>
    <div>
      <dt>UID</dt>
      <dd>{{ country.uid }}</dd>
    </div>
    <div>
      <dt>足联</dt>
      <dd>
        <SemanticTag
          v-if="formatRef(country.federationRef) !== '-'"
          :variant="getConfederationVariant(formatRef(country.federationRef))"
        >
          {{ formatRef(country.federationRef) }}
        </SemanticTag>
        <span v-else>-</span>
      </dd>
    </div>
    <div>
      <dt>外部链接</dt>
      <dd>
        <a
          class="external-text-link"
          :href="countryExternalUrl()"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ country.externalUrl || 'Google 搜索' }}
        </a>
      </dd>
    </div>
    <div>
      <dt>备注</dt>
      <dd>{{ formatText(country.remark) }}</dd>
    </div>
    <div>
      <dt>列表展示</dt>
      <dd>
        <SemanticTag :variant="getBooleanVariant(country.visibleInCatalog !== false)">
          {{ getBooleanLabel(country.visibleInCatalog !== false) }}
        </SemanticTag>
      </dd>
    </div>
  </dl>
</template>

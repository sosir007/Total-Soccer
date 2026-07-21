<script setup lang="ts">
import SemanticTag from '@/components/SemanticTag.vue';
import type { ClubDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import { getConfederationVariant } from '@/utils/tag-theme';

const props = defineProps<{
  club: ClubDetail;
}>();

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function clubExternalUrl() {
  return buildExternalUrl(props.club.externalUrl, props.club.name || '俱乐部');
}
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>俱乐部</dt>
      <dd>{{ club.name }}</dd>
    </div>
    <div>
      <dt>UID</dt>
      <dd>{{ club.uid }}</dd>
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
      <dd>{{ formatRef(club.countryRef) }}</dd>
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
      <dt>外部链接</dt>
      <dd>
        <a
          class="external-text-link"
          :href="clubExternalUrl()"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ club.externalUrl || 'Google 搜索' }}
        </a>
      </dd>
    </div>
    <div>
      <dt>备注</dt>
      <dd>{{ formatText(club.remark) }}</dd>
    </div>
  </dl>
</template>

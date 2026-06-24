<script setup lang="ts">
import EntityLink from '@/components/EntityLink.vue';

defineProps<{
  type: 'country' | 'club' | 'player' | 'competition' | 'award';
  id?: string | null;
  title?: string | number | null;
  subtitle?: string | number | null;
  muted?: boolean;
}>();
</script>

<template>
  <EntityLink :id="id" :type="type" :name="title" :muted="muted" class="entity-name-cell">
    <strong>{{ title || '-' }}</strong>
    <span v-if="subtitle !== null && subtitle !== undefined && subtitle !== ''">
      {{ subtitle }}
    </span>
  </EntityLink>
</template>

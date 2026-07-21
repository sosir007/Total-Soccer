<script setup lang="ts">
defineProps<{
  kicker?: string;
  title: string;
  subtitle?: string | number | null;
  externalUrl?: string;
}>();
</script>

<template>
  <div class="panel player-detail-hero">
    <div>
      <div v-if="kicker" class="detail-kicker">{{ kicker }}</div>

      <a
        v-if="externalUrl"
        class="external-title-link"
        :href="externalUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>{{ title }}</h2>
      </a>
      <h2 v-else>{{ title }}</h2>

      <p v-if="subtitle !== null && subtitle !== undefined">{{ subtitle }}</p>

      <slot name="tags" />
    </div>

    <div v-if="$slots.actions" class="panel-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

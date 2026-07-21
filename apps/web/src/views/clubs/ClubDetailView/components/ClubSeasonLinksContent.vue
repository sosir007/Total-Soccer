<script setup lang="ts">
import type { ClubSeasonLinkGroup } from '@/services/types/catalog';

defineProps<{
  groups?: ClubSeasonLinkGroup[];
}>();
</script>

<template>
  <div class="season-link-groups">
    <div v-for="group in groups" :key="group.decade" class="season-link-group">
      <div class="season-link-group-title">{{ group.decade }}</div>
      <div class="season-link-list">
        <a
          v-for="item in group.items"
          :key="item.id"
          class="season-link-item"
          :href="item.externalUrl || undefined"
          :target="item.externalUrl ? '_blank' : undefined"
          :rel="item.externalUrl ? 'noopener noreferrer' : undefined"
          :aria-disabled="item.externalUrl ? undefined : 'true'"
          :tabindex="item.externalUrl ? undefined : -1"
          :class="{ 'season-link-item--disabled': !item.externalUrl }"
        >
          {{ item.season }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.season-link-groups {
  display: grid;
  gap: 12px;
}

.season-link-group {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.season-link-group-title {
  color: var(--text-color-secondary);
  font-size: 14px;
  font-weight: 800;
  line-height: 32px;
  text-align: center;
}

.season-link-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.season-link-item {
  display: inline-flex;
  align-items: center;
  min-width: 56px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  color: var(--text-color-regular);
  font-size: 14px;
  font-weight: 750;
  line-height: 1;
  text-decoration: none;
  background: var(--color-bg-primary);
}

.season-link-item--disabled {
  cursor: default;
  opacity: 0.72;
  pointer-events: none;
}

@media (max-width: 1180px) {
  .season-link-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .season-link-group-title {
    line-height: 1.4;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    type: 'country' | 'club' | 'player' | 'competition' | 'award';
    id?: string | null;
    toId?: string | null;
    name?: string | number | null;
    muted?: boolean;
    disabled?: boolean;
  }>(),
  {
    id: null,
    toId: null,
    name: null,
    muted: false,
    disabled: false
  }
);

const router = useRouter();
const label = computed(() =>
  props.name === null || props.name === undefined || props.name === '' ? '-' : String(props.name)
);
const navigationId = computed(() => props.toId ?? props.id);
const canNavigate = computed(() => Boolean(navigationId.value) && !props.disabled);

function openDetail() {
  if (!navigationId.value) {
    return;
  }

  if (props.type === 'country') {
    void router.push({ name: 'nations-detail-id', params: { id: navigationId.value } });
    return;
  }

  if (props.type === 'club') {
    void router.push({ name: 'clubs-detail-id', params: { id: navigationId.value } });
    return;
  }

  if (props.type === 'player') {
    void router.push({ name: 'stars-detail-id', params: { id: navigationId.value } });
    return;
  }

  if (props.type === 'competition') {
    void router.push({ name: 'tianji-competition-detail-id', params: { id: navigationId.value } });
    return;
  }

  void router.push({ name: 'tianji-award-detail-id', params: { id: navigationId.value } });
}
</script>

<template>
  <button
    v-if="canNavigate"
    class="entity-link"
    :class="{ muted }"
    type="button"
    @click.stop="openDetail"
  >
    <slot>{{ label }}</slot>
  </button>
  <span v-else class="entity-link-text" :class="{ muted }">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    type: 'country' | 'club' | 'player' | 'competition' | 'award';
    id?: string | null;
    name?: string | number | null;
    muted?: boolean;
  }>(),
  {
    id: null,
    name: null,
    muted: false
  }
);

const router = useRouter();
const label = computed(() =>
  props.name === null || props.name === undefined || props.name === '' ? '-' : String(props.name)
);
const canNavigate = computed(() => Boolean(props.id));

function openDetail() {
  if (!props.id) {
    return;
  }

  if (props.type === 'country') {
    void router.push({ name: 'nations-detail-id', params: { id: props.id } });
    return;
  }

  if (props.type === 'club') {
    void router.push({ name: 'clubs-detail-id', params: { id: props.id } });
    return;
  }

  if (props.type === 'player') {
    void router.push({ name: 'stars-detail-id', params: { id: props.id } });
    return;
  }

  if (props.type === 'competition') {
    void router.push({ name: 'tianji-competition-detail-id', params: { id: props.id } });
    return;
  }

  void router.push({ name: 'tianji-awards', query: { awardId: props.id } });
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

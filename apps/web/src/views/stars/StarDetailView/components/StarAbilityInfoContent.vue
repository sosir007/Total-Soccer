<script setup lang="ts">
import PositionTags from '@/components/PositionTags.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';

const props = defineProps<{
  player: PlayerDetail;
}>();

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatFoot() {
  return formatText(props.player.foot || props.player.preferredFootRef?.name);
}
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>代表位置</dt>
      <dd>
        <PositionTags :value="player.primaryRole" />
      </dd>
    </div>
    <div>
      <dt>位置</dt>
      <dd>
        <PositionTags :value="player.positions" />
      </dd>
    </div>
    <div>
      <dt>左右脚</dt>
      <dd>{{ formatFoot() }}</dd>
    </div>
    <div>
      <dt>种族</dt>
      <dd>{{ formatRef(player.ethnicityRef) }}</dd>
    </div>
    <div>
      <dt>发色</dt>
      <dd>{{ formatRef(player.hairColorRef) }}</dd>
    </div>
    <div>
      <dt>肤色</dt>
      <dd>{{ formatText(player.skinTone) }}</dd>
    </div>
  </dl>
</template>

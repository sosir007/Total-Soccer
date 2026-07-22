<script setup lang="ts">
import dayjs from 'dayjs';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { getLifeStatusLabel, getLifeStatusVariant } from '@/utils/tag-theme';

const props = defineProps<{
  player: PlayerDetail;
}>();

function formatDate(value?: string | number | null) {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-';
}

function formatLifeDateRange() {
  const birthDate = props.player.birthDate ? formatDate(props.player.birthDate) : '';
  const deathDate = props.player.deathDate ? formatDate(props.player.deathDate) : '';

  if (birthDate && deathDate) return `${birthDate} ~ ${deathDate}`;
  if (birthDate) return birthDate;
  if (deathDate) return `~ ${deathDate}`;

  return '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatAge() {
  if (!props.player.birthDate) {
    return formatText(props.player.age);
  }

  const birthDate = dayjs(props.player.birthDate);

  if (!birthDate.isValid() || birthDate.isAfter(dayjs(), 'day')) {
    return formatText(props.player.age);
  }

  return dayjs().diff(birthDate, 'year');
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatFoot() {
  return formatText(props.player.foot || props.player.preferredFootRef?.name);
}
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>生日 / 过世</dt>
      <dd>{{ formatLifeDateRange() }}</dd>
    </div>
    <div>
      <dt>年龄</dt>
      <dd>
        <SemanticTag
          v-if="player.deceased || player.deathDate"
          :variant="getLifeStatusVariant(true)"
          size="small"
        >
          {{ getLifeStatusLabel(true) }}
        </SemanticTag>
        <span v-else>{{ formatAge() }}</span>
      </dd>
    </div>
    <div>
      <dt>身高 / 体重</dt>
      <dd>{{ formatText(player.height) }} cm / {{ formatText(player.weight) }} kg</dd>
    </div>
    <div>
      <dt>球衣</dt>
      <dd>{{ formatText(player.shirtNumber) }}</dd>
    </div>
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

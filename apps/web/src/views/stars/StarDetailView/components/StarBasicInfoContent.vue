<script setup lang="ts">
import dayjs from 'dayjs';
import type { PlayerDetail } from '@/services/types/catalog';
import { buildExternalUrl } from '@/utils/external-link';

const props = defineProps<{
  player: PlayerDetail;
}>();

function formatDate(value?: string | number | null) {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatAge() {
  if (props.player.deceased || props.player.deathDate) {
    return '-';
  }

  if (!props.player.birthDate) {
    return formatText(props.player.age);
  }

  const birthDate = dayjs(props.player.birthDate);

  if (!birthDate.isValid() || birthDate.isAfter(dayjs(), 'day')) {
    return formatText(props.player.age);
  }

  return dayjs().diff(birthDate, 'year');
}

function playerExternalUrl() {
  const fallbackName =
    props.player.chineseName || props.player.englishName || props.player.uid || '球员';

  return buildExternalUrl(props.player.externalUrl, fallbackName);
}
</script>

<template>
  <dl class="detail-list">
    <div>
      <dt>生日</dt>
      <dd>{{ formatDate(player.birthDate) }}</dd>
    </div>
    <div>
      <dt>过世</dt>
      <dd>{{ formatDate(player.deathDate) }}</dd>
    </div>
    <div>
      <dt>年龄</dt>
      <dd>{{ formatAge() }}</dd>
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
      <dt>数据库</dt>
      <dd>{{ formatText(player.databaseSource) }}</dd>
    </div>
    <div>
      <dt>外部链接</dt>
      <dd>
        <a
          class="external-text-link"
          :href="playerExternalUrl()"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ player.externalUrl || 'Google 搜索' }}
        </a>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AbilityBadge from '@/components/AbilityBadge.vue';
import DetailHero from '@/components/DetailHero.vue';
import IconFont from '@/components/IconFont.vue';
import SectionCard from '@/components/SectionCard.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import StarBasicInfoContent from './StarBasicInfoContent.vue';
import StarCareerTableContent from './StarCareerTableContent.vue';
import StarRelatedInfoContent from './StarRelatedInfoContent.vue';
import StarHonorProfileContent from './StarHonorProfileContent.vue';

const props = defineProps<{
  player: PlayerDetail;
}>();

type CareerRow = NonNullable<PlayerDetail['careers']>[number] & {
  periodText?: string;
};

const emit = defineEmits<{
  edit: [];
  manageResume: [];
  back: [];
}>();

function formatCareerPeriod(career: {
  startSeason?: string | null;
  endSeason?: string | null;
  startYear?: number | null;
  endYear?: number | null;
}) {
  if (career.startSeason || career.endSeason) {
    return [career.startSeason, career.endSeason].filter(Boolean).join(' - ') || '-';
  }

  if (career.startYear || career.endYear) {
    return [career.startYear, career.endYear].filter(Boolean).join(' - ');
  }

  return '-';
}

const displayCareers = computed<CareerRow[]>(() => {
  const rows: CareerRow[] = [];
  const clubRowById = new Map<string, CareerRow>();

  for (const career of [
    ...(props.player.profileClubCareers ?? []),
    ...(props.player.countryCareers ?? [])
  ]) {
    if (career.careerType === 'CLUB') {
      const clubId = career.club?.id ?? career.clubId ?? career.id;
      const periodText = formatCareerPeriod(career);
      const existing = clubRowById.get(clubId);

      if (existing) {
        existing.periodText = existing.periodText
          ? `${existing.periodText}、${periodText}`
          : periodText;
        existing.appearances = sumNullable(existing.appearances, career.appearances);
        existing.goals = sumNullable(existing.goals, career.goals);
        existing.assists = sumNullable(existing.assists, career.assists);
        existing.cleanSheets = sumNullable(existing.cleanSheets, career.cleanSheets);
        existing.goalsConceded = sumNullable(existing.goalsConceded, career.goalsConceded);
        existing.position = resolveCareerPosition(
          existing.position,
          career.position,
          career.positionGroup,
          props.player.primaryRole,
          props.player.positions
        );
        existing.showInProfile = existing.showInProfile || career.showInProfile;
        existing.isRepresentative = existing.isRepresentative || career.isRepresentative;
        existing.isLegend = existing.isLegend || career.isLegend;
        existing.sortOrder = Math.min(existing.sortOrder, career.sortOrder);
        continue;
      }

      const row = {
        ...career,
        periodText,
        position: resolveCareerPosition(
          career.position,
          career.positionGroup,
          props.player.primaryRole,
          props.player.positions
        )
      };
      clubRowById.set(clubId, row);
      rows.push(row);
      continue;
    }

    rows.push({
      ...career,
      periodText: formatCareerPeriod(career),
      position: resolveCareerPosition(
        career.position,
        career.positionGroup,
        props.player.primaryRole,
        props.player.positions
      )
    });
  }

  return rows.sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;

    return (left.startYear ?? 0) - (right.startYear ?? 0);
  });
});

function sumNullable(left?: number | null, right?: number | null) {
  if (left === null || left === undefined) {
    return right ?? null;
  }

  if (right === null || right === undefined) {
    return left;
  }

  return left + right;
}

function resolveCareerPosition(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const text = (value ?? '').trim();

    if (text) {
      return text;
    }
  }

  return null;
}
const playerTypeName = computed(() => props.player.playerTypeRef?.name || props.player.playerType);
const honorProfileCount = computed(
  () => (props.player.personalHonors?.length ?? 0) + (props.player.teamHonors?.length ?? 0)
);

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function playerExternalUrl() {
  const fallbackName =
    props.player.chineseName || props.player.englishName || props.player.uid || '球员';

  return buildExternalUrl(props.player.externalUrl, fallbackName);
}
</script>

<template>
  <template v-if="player">
    <DetailHero
      :kicker="formatRef(player.confederationRef)"
      :title="player.chineseName"
      :subtitle="player.englishName || player.uid"
      :external-url="playerExternalUrl()"
    >
      <template #tags>
        <div class="detail-tags">
          <AbilityBadge type="PA" :value="player.pa" />
          <SemanticTag variant="status-legend">
            荣誉分 {{ formatText(player.honorScore) }}
          </SemanticTag>
          <SemanticTag v-if="playerTypeName" variant="object-player">
            {{ playerTypeName }}
          </SemanticTag>
        </div>
      </template>

      <template #actions>
        <el-button type="primary" @click="emit('edit')">
          <IconFont name="edit" />
          编辑资料
        </el-button>
        <el-button type="success" @click="emit('manageResume')">
          <IconFont name="edit" />
          履历管理
        </el-button>
        <el-button @click="emit('back')">
          <IconFont name="back" />
          返回列表
        </el-button>
      </template>
    </DetailHero>

    <div class="detail-grid">
      <SectionCard title="基础资料" :badge="`UID ${player.uid}`">
        <StarBasicInfoContent :player="player" />
      </SectionCard>

      <SectionCard title="关联信息" badge="资料库">
        <StarRelatedInfoContent :player="player" />
      </SectionCard>
    </div>

    <SectionCard
      title="经历"
      :badge="`${displayCareers.length} 段`"
      :empty="!displayCareers.length"
      empty-text="暂无结构化经历"
    >
      <StarCareerTableContent :careers="displayCareers" type="mixed" />
    </SectionCard>

    <SectionCard
      title="荣誉履历"
      :badge="`${honorProfileCount} 条`"
      :empty="!honorProfileCount"
      empty-text="暂无结构化荣誉"
    >
      <StarHonorProfileContent :player="player" />
    </SectionCard>
  </template>
</template>

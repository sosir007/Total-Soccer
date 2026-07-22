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
import StarPersonalHonorsContent from './StarPersonalHonorsContent.vue';
import StarRelatedInfoContent from './StarRelatedInfoContent.vue';
import StarTeamHonorsContent from './StarTeamHonorsContent.vue';

const props = defineProps<{
  player: PlayerDetail;
}>();

const emit = defineEmits<{
  edit: [];
  manageResume: [];
  back: [];
}>();

const displayCareers = computed(() =>
  [...(props.player.profileClubCareers ?? []), ...(props.player.countryCareers ?? [])].sort(
    (left, right) => {
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;

      return (left.startYear ?? 0) - (right.startYear ?? 0);
    }
  )
);
const playerTypeName = computed(() => props.player.playerTypeRef?.name || props.player.playerType);

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
      title="个人荣誉"
      :badge="`${player.personalHonors?.length ?? 0} 条`"
      :empty="!player.personalHonors?.length"
      empty-text="暂无结构化个人荣誉"
    >
      <StarPersonalHonorsContent :honors="player.personalHonors" />
    </SectionCard>

    <SectionCard
      title="团队荣誉"
      :badge="`${player.teamHonors?.length ?? 0} 条`"
      :empty="!player.teamHonors?.length"
      empty-text="暂无确认关联的团队荣誉"
    >
      <StarTeamHonorsContent :honors="player.teamHonors" />
    </SectionCard>
  </template>
</template>

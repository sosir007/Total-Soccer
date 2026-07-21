<script setup lang="ts">
import AbilityBadge from '@/components/AbilityBadge.vue';
import DetailHero from '@/components/DetailHero.vue';
import IconFont from '@/components/IconFont.vue';
import SectionCard from '@/components/SectionCard.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import { getPlayerStatusLabel, getPlayerStatusVariant } from '@/utils/tag-theme';
import StarAbilityInfoContent from './StarAbilityInfoContent.vue';
import StarBasicInfoContent from './StarBasicInfoContent.vue';
import StarCareerSummaryContent from './StarCareerSummaryContent.vue';
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
          <AbilityBadge type="CA" :value="player.ca" />
          <SemanticTag variant="status-legend">
            荣誉分 {{ formatText(player.honorScore) }}
          </SemanticTag>
          <SemanticTag variant="object-player">{{ formatRef(player.playerTypeRef) }}</SemanticTag>
          <SemanticTag :variant="getPlayerStatusVariant(player)">
            {{ getPlayerStatusLabel(player) }}
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

      <SectionCard title="能力与属性" badge="FM Data">
        <StarAbilityInfoContent :player="player" />
      </SectionCard>

      <SectionCard title="生涯摘要" badge="备注">
        <StarCareerSummaryContent :player="player" />
      </SectionCard>
    </div>

    <div class="detail-grid">
      <SectionCard
        title="俱乐部经历"
        :badge="`${player.profileClubCareers?.length ?? 0} 段`"
        :empty="!player.profileClubCareers?.length"
        empty-text="暂无结构化俱乐部经历"
      >
        <StarCareerTableContent :careers="player.profileClubCareers" type="club" />
      </SectionCard>

      <SectionCard
        title="国家队经历"
        :badge="`${player.countryCareers?.length ?? 0} 段`"
        :empty="!player.countryCareers?.length"
        empty-text="暂无结构化国家队经历"
      >
        <StarCareerTableContent :careers="player.countryCareers" type="country" />
      </SectionCard>
    </div>

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

<script setup lang="ts">
import CareerTimelineContent from '@/components/CareerTimelineContent.vue';
import DetailHero from '@/components/DetailHero.vue';
import TeamBonusHonorList from '@/components/honors/TeamBonusHonorList.vue';
import IconFont from '@/components/IconFont.vue';
import LineupBoardContent from '@/components/LineupBoardContent.vue';
import SectionCard from '@/components/SectionCard.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { ClubDetail, LineupPositionGroup } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import ClubBasicInfoContent from './ClubBasicInfoContent.vue';
import ClubDatabaseStatsContent from './ClubDatabaseStatsContent.vue';
import ClubHonorDetailsContent from './ClubHonorDetailsContent.vue';
import ClubSeasonLinksContent from './ClubSeasonLinksContent.vue';

const props = defineProps<{
  club: ClubDetail;
}>();

const emit = defineEmits<{
  edit: [];
  back: [];
  openPlayer: [id?: string | null];
}>();

function formatNumber(value?: number | null, digits = 0) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function clubExternalUrl() {
  return buildExternalUrl(props.club.externalUrl, props.club.name || '俱乐部');
}

function countSeasonLinks() {
  return props.club.seasonLinks?.reduce((total, group) => total + group.items.length, 0) ?? 0;
}

function countLineupItems(groups?: LineupPositionGroup[]) {
  return groups?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
}
</script>

<template>
  <DetailHero
    :kicker="formatRef(club.federationRef)"
    :title="club.name"
    :subtitle="`UID ${club.uid}`"
    :external-url="clubExternalUrl()"
  >
    <template #tags>
      <div class="detail-tags">
        <SemanticTag variant="object-player">
          阵容球员 {{ formatNumber(club.lineupPlayerCount) }}
        </SemanticTag>
        <SemanticTag variant="status-legend">
          荣誉分 {{ formatNumber(club.honorScore, 2) }}
        </SemanticTag>
      </div>
    </template>

    <template #actions>
      <el-button type="primary" @click="emit('edit')">
        <IconFont name="edit" />
        编辑
      </el-button>
      <el-button @click="emit('back')">
        <IconFont name="back" />
        返回列表
      </el-button>
    </template>
  </DetailHero>

  <div class="metric-grid">
    <div class="metric-card">
      <span>阵容总 PA</span>
      <strong>{{ formatNumber(club.lineupTotalPa) }}</strong>
      <em>阵容履历球员能力总量</em>
    </div>
    <div class="metric-card">
      <span>代表总 PA</span>
      <strong>{{ formatNumber(club.totalPa) }}</strong>
      <em>代表俱乐部球员能力总量</em>
    </div>
    <div class="metric-card honor-score-card">
      <span>荣誉分</span>
      <strong>{{ formatNumber(club.honorScore, 2) }}</strong>
      <em>赛事分与附加分汇总</em>
    </div>
    <div class="metric-card gold">
      <span>冠军数 / 奖杯数</span>
      <strong class="metric-split-value">
        <span class="champion-count">{{ formatNumber(club.championCount) }}</span>
        <span class="metric-separator">/</span>
        <span class="trophy-count">{{ formatNumber(club.trophyCount) }}</span>
      </strong>
      <em>冠军与奖杯荣誉汇总</em>
    </div>
  </div>

  <div class="detail-grid">
    <SectionCard title="基础资料" :badge="`UID ${club.uid}`">
      <ClubBasicInfoContent :club="club" />
    </SectionCard>

    <SectionCard title="资料库关联" badge="真实数据">
      <ClubDatabaseStatsContent :club="club" />
    </SectionCard>
  </div>

  <SectionCard title="荣誉明细" :badge="`${club.honorGroups?.length ?? 0} 项赛事`">
    <ClubHonorDetailsContent :groups="club.honorGroups" />
  </SectionCard>

  <SectionCard title="团队附加分" :badge="`${club.bonusHonorDetails?.length ?? 0} 项奖项`">
    <TeamBonusHonorList :details="club.bonusHonorDetails" />
  </SectionCard>

  <SectionCard
    title="赛季资料"
    :badge="`${countSeasonLinks()} 条链接`"
    :empty="!club.seasonLinks?.length"
    empty-text="暂无赛季资料链接"
  >
    <ClubSeasonLinksContent :groups="club.seasonLinks" />
  </SectionCard>

  <SectionCard
    title="时间线"
    :badge="`${club.careerTimeline?.length ?? 0} 个年代`"
    :empty="!club.careerTimeline?.length"
    empty-text="暂无结构化俱乐部经历"
  >
    <CareerTimelineContent
      :groups="club.careerTimeline"
      @open-player="emit('openPlayer', $event)"
    />
  </SectionCard>

  <div class="detail-grid">
    <SectionCard
      title="阵容"
      :badge="`${countLineupItems(club.lineupByPosition)} 人`"
      :empty="countLineupItems(club.lineupByPosition) === 0"
      empty-text="暂无可展示球员"
    >
      <LineupBoardContent
        :groups="club.lineupByPosition"
        position-display="tags"
        @open-player="emit('openPlayer', $event)"
      />
    </SectionCard>

    <SectionCard
      title="代表阵容"
      :badge="`${countLineupItems(club.representativeLineupByPosition)} 人`"
      :empty="countLineupItems(club.representativeLineupByPosition) === 0"
      empty-text="暂无俱乐部名宿"
    >
      <LineupBoardContent
        :groups="club.representativeLineupByPosition"
        position-display="tags"
        @open-player="emit('openPlayer', $event)"
      />
    </SectionCard>
  </div>
</template>

<style scoped lang="scss">
.metric-split-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.metric-split-value .trophy-count,
.metric-split-value .metric-separator,
.metric-split-value .champion-count {
  display: inline;
  font-size: inherit;
  line-height: inherit;
}

.metric-card.honor-score-card strong {
  color: var(--color-brand-primary);
}

.metric-card.gold .metric-split-value > .champion-count {
  color: var(--color-accent-gold);
}

.metric-card.gold .metric-split-value > .metric-separator,
.metric-card.gold .metric-split-value > .trophy-count {
  color: var(--text-color-primary);
}
</style>

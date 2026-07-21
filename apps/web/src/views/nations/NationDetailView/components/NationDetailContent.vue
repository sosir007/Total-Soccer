<script setup lang="ts">
import CareerTimelineContent from '@/components/CareerTimelineContent.vue';
import HonorGroupList from '@/components/honors/HonorGroupList.vue';
import TeamBonusHonorList from '@/components/honors/TeamBonusHonorList.vue';
import IconFont from '@/components/IconFont.vue';
import LineupBoardContent from '@/components/LineupBoardContent.vue';
import SectionCard from '@/components/SectionCard.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { CountryDetail, LineupPositionGroup } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import NationBasicInfoContent from './NationBasicInfoContent.vue';
import NationDatabaseStatsContent from './NationDatabaseStatsContent.vue';

const props = defineProps<{
  country: CountryDetail;
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

function countryExternalUrl() {
  return buildExternalUrl(props.country.externalUrl, props.country.name || '国家队');
}

function countLineupItems(groups?: LineupPositionGroup[]) {
  return groups?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
}
</script>

<template>
  <div class="panel player-detail-hero">
    <div>
      <div class="detail-kicker">{{ formatRef(country.federationRef) }}</div>
      <a
        class="external-title-link"
        :href="countryExternalUrl()"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>{{ country.name }}</h2>
      </a>
      <p>UID {{ country.uid }}</p>
      <div class="detail-tags">
        <SemanticTag variant="object-player">
          球员 {{ formatNumber(country.playerCount) }}
        </SemanticTag>
        <SemanticTag variant="neutral">
          平均 PA {{ formatNumber(country.averagePa, 2) }}
        </SemanticTag>
        <SemanticTag variant="status-legend">
          荣誉分 {{ formatNumber(country.honorScore, 2) }}
        </SemanticTag>
      </div>
    </div>
    <div class="panel-actions">
      <el-button type="primary" @click="emit('edit')">
        <IconFont name="edit" />
        编辑
      </el-button>
      <el-button @click="emit('back')">
        <IconFont name="back" />
        返回列表
      </el-button>
    </div>
  </div>

  <div class="metric-grid">
    <div class="metric-card">
      <span>总 PA</span>
      <strong>{{ formatNumber(country.totalPa) }}</strong>
      <em>国家队球员能力总量</em>
    </div>
    <div class="metric-card gold">
      <span>冠军数</span>
      <strong>{{ formatNumber(country.championCount) }}</strong>
      <em>冠军荣誉累计</em>
    </div>
    <div class="metric-card">
      <span>大赛冠军</span>
      <strong>{{ formatNumber(country.majorChampionCount) }}</strong>
      <em>核心赛事冠军统计</em>
    </div>
    <div class="metric-card">
      <span>奖牌数</span>
      <strong>{{ formatNumber(country.medalCount) }}</strong>
      <em>冠军 / 亚军 / 季军汇总</em>
    </div>
  </div>

  <div class="detail-grid">
    <SectionCard title="基础资料" badge="国家圣殿">
      <NationBasicInfoContent :country="country" />
    </SectionCard>

    <SectionCard title="资料库关联" badge="真实数据">
      <NationDatabaseStatsContent :country="country" />
    </SectionCard>
  </div>

  <SectionCard title="荣誉明细" :badge="`${country.honorGroups?.length ?? 0} 项赛事`">
    <HonorGroupList :groups="country.honorGroups" />
  </SectionCard>

  <SectionCard title="团队附加分" :badge="`${country.bonusHonorDetails?.length ?? 0} 项奖项`">
    <TeamBonusHonorList :details="country.bonusHonorDetails" />
  </SectionCard>

  <SectionCard
    title="国家队时间线"
    :badge="`${country.careerTimeline?.length ?? 0} 个年代`"
    :empty="!country.careerTimeline?.length"
    empty-text="暂无结构化国家队经历"
  >
    <CareerTimelineContent
      :groups="country.careerTimeline"
      @open-player="emit('openPlayer', $event)"
    />
  </SectionCard>

  <SectionCard
    title="阵容"
    :badge="`${countLineupItems(country.lineupByPosition)} 人`"
    :empty="countLineupItems(country.lineupByPosition) === 0"
    empty-text="暂无代表国家球员"
  >
    <LineupBoardContent
      :groups="country.lineupByPosition"
      position-display="tags"
      @open-player="emit('openPlayer', $event)"
    />
  </SectionCard>
</template>

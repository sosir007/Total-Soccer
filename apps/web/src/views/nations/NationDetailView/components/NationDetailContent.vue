<script setup lang="ts">
import AbilityBadge from '@/components/AbilityBadge.vue';
import IconFont from '@/components/IconFont.vue';
import HonorGroupList from '@/components/honors/HonorGroupList.vue';
import OverflowTooltip from '@/components/OverflowTooltip.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type {
  CareerProfileLine,
  CountryDetail,
  LineupPositionGroup
} from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import { getConfederationVariant } from '@/utils/tag-theme';

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

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function countryExternalUrl() {
  return buildExternalUrl(props.country.externalUrl, props.country.name || '国家队');
}

function formatLineStats(item: CareerProfileLine) {
  const normal = [item.appearances, item.goals, item.assists]
    .map((value) => value ?? '-')
    .join('/');
  const goalkeeper = [item.cleanSheets, item.goalsConceded].some(
    (value) => value !== null && value !== undefined
  )
    ? `，零封/失球 ${item.cleanSheets ?? '-'}/${item.goalsConceded ?? '-'}`
    : '';

  return `${normal}${goalkeeper}`;
}

function countLineupItems(groups?: LineupPositionGroup[]) {
  return groups?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
}

function hasLineupItems(groups?: LineupPositionGroup[]) {
  return countLineupItems(groups) > 0;
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
    <div class="panel">
      <div class="panel-header">
        <h3>基础资料</h3>
        <span class="status-pill">国家圣殿</span>
      </div>
      <dl class="detail-list">
        <div>
          <dt>国家</dt>
          <dd>{{ country.name }}</dd>
        </div>
        <div>
          <dt>UID</dt>
          <dd>{{ country.uid }}</dd>
        </div>
        <div>
          <dt>足联</dt>
          <dd>
            <SemanticTag
              v-if="formatRef(country.federationRef) !== '-'"
              :variant="getConfederationVariant(formatRef(country.federationRef))"
            >
              {{ formatRef(country.federationRef) }}
            </SemanticTag>
            <span v-else>-</span>
          </dd>
        </div>
        <div>
          <dt>外部链接</dt>
          <dd>
            <a
              class="external-text-link"
              :href="countryExternalUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ country.externalUrl || 'Google 搜索' }}
            </a>
          </dd>
        </div>
        <div>
          <dt>备注</dt>
          <dd>{{ formatText(country.remark) }}</dd>
        </div>
      </dl>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>资料库关联</h3>
        <span class="status-pill">真实数据</span>
      </div>
      <dl class="detail-list">
        <div>
          <dt>关联球员</dt>
          <dd>{{ formatNumber(country._count?.players ?? country.playerCount) }}</dd>
        </div>
        <div>
          <dt>关联俱乐部</dt>
          <dd>{{ formatNumber(country._count?.clubs) }}</dd>
        </div>
        <div>
          <dt>统计球员数</dt>
          <dd>{{ formatNumber(country.playerCount) }}</dd>
        </div>
        <div>
          <dt>球员平均荣誉分</dt>
          <dd>{{ formatNumber(country.averageHonorScore, 2) }}</dd>
        </div>
      </dl>
    </div>
  </div>

  <div class="panel">
    <div class="panel-header">
      <h3>荣誉明细</h3>
      <span class="status-pill">{{ country.honorGroups?.length ?? 0 }} 项赛事</span>
    </div>

    <HonorGroupList :groups="country.honorGroups" />
  </div>

  <div class="panel">
    <div class="panel-header">
      <h3>国家队时间线</h3>
      <span class="status-pill">{{ country.careerTimeline?.length ?? 0 }} 个年代</span>
    </div>

    <div v-if="!country.careerTimeline?.length" class="mini-empty">暂无结构化国家队经历</div>

    <div v-else class="career-timeline">
      <div v-for="group in country.careerTimeline" :key="group.decade" class="timeline-block">
        <div class="timeline-decade">{{ group.decade }}</div>
        <div class="timeline-lines">
          <button
            v-for="item in group.items"
            :key="item.id"
            class="timeline-player"
            type="button"
            @click="emit('openPlayer', item.player.id)"
          >
            <span>{{ item.position }}</span>
            <strong>{{ item.player.chineseName }}</strong>
            <em class="ability-inline-meta">
              <AbilityBadge type="PA" :value="item.player.pa" size="small" />
              <span>{{ formatText(item.period) }}</span>
            </em>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-header">
      <h3>阵容</h3>
      <span class="status-pill">{{ countLineupItems(country.lineupByPosition) }} 人</span>
    </div>

    <div v-if="!hasLineupItems(country.lineupByPosition)" class="mini-empty">暂无代表国家球员</div>

    <div v-else class="lineup-board">
      <div v-for="group in country.lineupByPosition" :key="group.position" class="lineup-row">
        <div class="lineup-position">
          <PositionTags :value="group.position" />
        </div>
        <div v-if="!group.items.length" class="lineup-empty">-</div>
        <div v-else class="lineup-players">
          <button
            v-for="item in group.items"
            :key="item.id"
            class="lineup-player"
            type="button"
            @click="emit('openPlayer', item.player.id)"
          >
            <strong>
              <OverflowTooltip :content="item.player.chineseName" />
            </strong>
            <div class="lineup-player-meta">
              <AbilityBadge type="PA" :value="item.player.pa" size="small" />
              <em>{{ formatLineStats(item) }}</em>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

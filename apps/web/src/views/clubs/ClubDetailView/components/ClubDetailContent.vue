<script setup lang="ts">
import { computed } from 'vue';
import AbilityBadge from '@/components/AbilityBadge.vue';
import IconFont from '@/components/IconFont.vue';
import HonorGroupList from '@/components/honors/HonorGroupList.vue';
import OverflowTooltip from '@/components/OverflowTooltip.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type {
  CareerProfileLine,
  ClubDetail,
  HonorGroupedRecord,
  LineupPositionGroup,
  TeamBonusHonorDetail
} from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import { buildExternalUrl } from '@/utils/external-link';
import { getBooleanLabel, getBooleanVariant, getConfederationVariant } from '@/utils/tag-theme';

const props = defineProps<{
  club: ClubDetail;
}>();

const emit = defineEmits<{
  edit: [];
  back: [];
  openPlayer: [id?: string | null];
}>();

type BonusHonorPlacementGroup = {
  key: string;
  label: string;
  rank?: number | null;
  details: TeamBonusHonorDetail[];
};

const internationalHonorGroups = computed(() =>
  (props.club.honorGroups ?? []).filter(isInternationalOrContinentalHonor)
);
const hasInternationalHonorGroups = computed(() => internationalHonorGroups.value.length > 0);
const leftHonorGroups = computed(() =>
  hasInternationalHonorGroups.value
    ? (props.club.honorGroups ?? []).filter((group) => !isInternationalOrContinentalHonor(group))
    : (props.club.honorGroups ?? [])
);
const bonusHonorGroups = computed(() => buildBonusHonorGroups(props.club.bonusHonorDetails ?? []));
const hasLeftHonorContent = computed(
  () => leftHonorGroups.value.length > 0 || bonusHonorGroups.value.length > 0
);

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

function clubExternalUrl() {
  return buildExternalUrl(props.club.externalUrl, props.club.name || '俱乐部');
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

function formatBonusPlacement(detail: NonNullable<ClubDetail['bonusHonorDetails']>[number]) {
  return detail.placement || (detail.rank ? `第 ${detail.rank} 名` : '获奖');
}

function isInternationalOrContinentalHonor(group: HonorGroupedRecord) {
  const category = group.competition.category;
  return (
    category === '国际' ||
    category === '洲际' ||
    group.competition.scopeType === 'GLOBAL' ||
    group.competition.scopeType === 'CONFEDERATION'
  );
}

function buildBonusHonorGroups(details: TeamBonusHonorDetail[]) {
  const groupMap = new Map<string, Map<string, BonusHonorPlacementGroup>>();

  for (const detail of details) {
    const groupKey = detail.awardId;
    const placementLabel = formatBonusPlacement(detail);
    const placementKey = `${detail.rank ?? ''}:${placementLabel}`;
    const placementMap = groupMap.get(groupKey) ?? new Map<string, BonusHonorPlacementGroup>();
    const placementGroup = placementMap.get(placementKey) ?? {
      key: placementKey,
      label: placementLabel,
      rank: detail.rank,
      details: []
    };

    placementGroup.details.push(detail);
    placementMap.set(placementKey, placementGroup);
    groupMap.set(groupKey, placementMap);
  }

  return [...groupMap.entries()].map(([awardId, placementMap]) => {
    const placements = [...placementMap.values()]
      .map((placement) => ({
        ...placement,
        details: [...placement.details].sort(compareBonusDetails)
      }))
      .sort(compareBonusPlacements);
    const firstDetail = placements[0]?.details[0];

    return {
      key: awardId,
      awardName: firstDetail?.awardName ?? '团队附加分',
      placements
    };
  });
}

function compareBonusDetails(left: TeamBonusHonorDetail, right: TeamBonusHonorDetail) {
  return getBonusDetailSortValue(left) - getBonusDetailSortValue(right);
}

function compareBonusPlacements(left: BonusHonorPlacementGroup, right: BonusHonorPlacementGroup) {
  const leftRank = left.rank ?? 999;
  const rightRank = right.rank ?? 999;

  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  return left.label.localeCompare(right.label, 'zh-CN');
}

function getBonusDetailSortValue(detail: TeamBonusHonorDetail) {
  if (detail.year) {
    return detail.year;
  }

  const seasonYear = Number.parseInt(detail.season ?? '', 10);
  return Number.isFinite(seasonYear) ? seasonYear : 9999;
}

function formatBonusEntry(detail: TeamBonusHonorDetail) {
  return detail.season || (detail.year ? String(detail.year) : detail.editionName);
}

function getBonusPlacementStyle(group: BonusHonorPlacementGroup) {
  const color =
    group.rank === 1
      ? 'var(--color-accent-gold)'
      : group.rank === 3
        ? '#9c6a3c'
        : 'var(--text-color-primary)';

  return {
    '--honor-placement-color': color
  };
}
</script>

<template>
  <div class="panel player-detail-hero">
    <div>
      <div class="detail-kicker">{{ formatRef(club.federationRef) }}</div>
      <a
        class="external-title-link"
        :href="clubExternalUrl()"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>{{ club.name }}</h2>
      </a>
      <p>UID {{ club.uid }}</p>
      <div class="detail-tags">
        <SemanticTag variant="object-player">
          球员 {{ formatNumber(club.playerCount) }}
        </SemanticTag>
        <SemanticTag variant="neutral">平均 PA {{ formatNumber(club.averagePa, 2) }}</SemanticTag>
        <SemanticTag variant="status-legend">
          荣誉分 {{ formatNumber(club.honorScore, 2) }}
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
      <strong>{{ formatNumber(club.totalPa) }}</strong>
      <em>俱乐部球员能力总量</em>
    </div>
    <div class="metric-card gold">
      <span>奖杯数</span>
      <strong>{{ formatNumber(club.trophyCount) }}</strong>
      <em>俱乐部荣誉累计</em>
    </div>
    <div class="metric-card">
      <span>冠军数</span>
      <strong>{{ formatNumber(club.championCount) }}</strong>
      <em>冠军荣誉统计</em>
    </div>
    <div class="metric-card">
      <span>关联球员</span>
      <strong>{{ formatNumber(club._count?.players ?? club.playerCount) }}</strong>
      <em>资料库关联数量</em>
    </div>
  </div>

  <div class="detail-grid">
    <div class="panel">
      <div class="panel-header">
        <h3>基础资料</h3>
        <span class="status-pill">豪门殿堂</span>
      </div>
      <dl class="detail-list">
        <div>
          <dt>俱乐部</dt>
          <dd>{{ club.name }}</dd>
        </div>
        <div>
          <dt>UID</dt>
          <dd>{{ club.uid }}</dd>
        </div>
        <div>
          <dt>曾用名</dt>
          <dd>{{ formatText(club.formerName) }}</dd>
        </div>
        <div>
          <dt>别名</dt>
          <dd>{{ formatText(club.alias) }}</dd>
        </div>
        <div>
          <dt>国家</dt>
          <dd>{{ formatRef(club.countryRef) }}</dd>
        </div>
        <div>
          <dt>足联</dt>
          <dd>
            <SemanticTag
              v-if="formatRef(club.federationRef) !== '-'"
              :variant="getConfederationVariant(formatRef(club.federationRef))"
            >
              {{ formatRef(club.federationRef) }}
            </SemanticTag>
            <span v-else>-</span>
          </dd>
        </div>
        <div>
          <dt>外部链接</dt>
          <dd>
            <a
              class="external-text-link"
              :href="clubExternalUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ club.externalUrl || 'Google 搜索' }}
            </a>
          </dd>
        </div>
        <div>
          <dt>备注</dt>
          <dd>{{ formatText(club.remark) }}</dd>
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
          <dd>{{ formatNumber(club._count?.players ?? club.playerCount) }}</dd>
        </div>
        <div>
          <dt>统计球员数</dt>
          <dd>{{ formatNumber(club.playerCount) }}</dd>
        </div>
        <div>
          <dt>球员平均 PA</dt>
          <dd>{{ formatNumber(club.averagePa, 2) }}</dd>
        </div>
        <div>
          <dt>总 PA</dt>
          <dd>{{ formatNumber(club.totalPa) }}</dd>
        </div>
        <div>
          <dt>荣誉分</dt>
          <dd>{{ formatNumber(club.honorScore, 2) }}</dd>
        </div>
        <div>
          <dt>赛事分</dt>
          <dd>{{ formatNumber(club.baseHonorScore, 2) }}</dd>
        </div>
        <div>
          <dt>附加分</dt>
          <dd>{{ formatNumber(club.bonusHonorScore, 2) }}</dd>
        </div>
        <div>
          <dt>奖杯数</dt>
          <dd>{{ formatNumber(club.trophyCount) }}</dd>
        </div>
        <div>
          <dt>冠军数</dt>
          <dd>{{ formatNumber(club.championCount) }}</dd>
        </div>
        <div>
          <dt>是否存在</dt>
          <dd>
            <SemanticTag :variant="getBooleanVariant(club.exists)">
              {{ getBooleanLabel(club.exists) }}
            </SemanticTag>
          </dd>
        </div>
        <div>
          <dt>列表展示</dt>
          <dd>
            <SemanticTag :variant="getBooleanVariant(club.visibleInCatalog)">
              {{ getBooleanLabel(club.visibleInCatalog) }}
            </SemanticTag>
          </dd>
        </div>
      </dl>
    </div>
  </div>

  <div class="panel">
    <div class="panel-header">
      <h3>荣誉明细</h3>
      <span class="status-pill">{{ club.honorGroups?.length ?? 0 }} 项赛事</span>
    </div>

    <div
      class="club-honor-layout"
      :class="{ 'club-honor-layout--split': hasInternationalHonorGroups }"
    >
      <div class="club-honor-section">
        <div v-if="hasInternationalHonorGroups" class="club-honor-section-title">
          国内荣誉与奖项
        </div>

        <div v-if="!hasLeftHonorContent" class="mini-empty">暂无国内荣誉与团队附加分</div>
        <template v-else>
          <HonorGroupList :groups="leftHonorGroups" />

          <div v-if="bonusHonorGroups.length" class="bonus-honor-list">
            <div v-for="group in bonusHonorGroups" :key="group.key" class="bonus-honor-group">
              <div class="bonus-honor-title">
                <span>{{ group.awardName }}</span>
                <SemanticTag size="small" variant="status-legend">团队附加分</SemanticTag>
              </div>

              <div class="honor-group-placements">
                <div
                  v-for="placement in group.placements"
                  :key="placement.key"
                  class="honor-group-placement"
                  :style="getBonusPlacementStyle(placement)"
                >
                  <span>{{ placement.label }}</span>
                  <strong>({{ placement.details.length }})：</strong>
                  <span class="honor-entry-list">
                    <template v-for="(detail, index) in placement.details" :key="detail.id">
                      <span v-if="index > 0" class="honor-entry-separator">、</span>
                      <span class="honor-entry-year">{{ formatBonusEntry(detail) }}</span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div v-if="hasInternationalHonorGroups" class="club-honor-section">
        <div class="club-honor-section-title">国际与洲际荣誉</div>
        <HonorGroupList :groups="internationalHonorGroups" />
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-header">
      <h3>时间线</h3>
      <span class="status-pill">{{ club.careerTimeline?.length ?? 0 }} 个年代</span>
    </div>

    <div v-if="!club.careerTimeline?.length" class="mini-empty">暂无结构化俱乐部经历</div>

    <div v-else class="career-timeline">
      <div v-for="group in club.careerTimeline" :key="group.decade" class="timeline-block">
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

  <div class="detail-grid">
    <div class="panel">
      <div class="panel-header">
        <h3>阵容</h3>
        <span class="status-pill">{{ countLineupItems(club.lineupByPosition) }} 人</span>
      </div>

      <div v-if="!hasLineupItems(club.lineupByPosition)" class="mini-empty">暂无可展示球员</div>

      <div v-else class="lineup-board">
        <div v-for="group in club.lineupByPosition" :key="group.position" class="lineup-row">
          <div class="lineup-position">{{ group.position }}</div>
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

    <div class="panel">
      <div class="panel-header">
        <h3>代表阵容</h3>
        <span class="status-pill">
          {{ countLineupItems(club.representativeLineupByPosition) }} 人
        </span>
      </div>

      <div v-if="!hasLineupItems(club.representativeLineupByPosition)" class="mini-empty">
        暂无俱乐部名宿
      </div>

      <div v-else class="lineup-board">
        <div
          v-for="group in club.representativeLineupByPosition"
          :key="group.position"
          class="lineup-row"
        >
          <div class="lineup-position">{{ group.position }}</div>
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
  </div>
</template>

<style scoped lang="scss">
.club-honor-layout {
  display: grid;
  gap: 22px;
}

.club-honor-layout--split {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.club-honor-section {
  min-width: 0;
}

.club-honor-section-title {
  margin-bottom: 16px;
  color: var(--text-color-primary);
  font-size: 18px;
  font-weight: 850;
}

.bonus-honor-list {
  display: grid;
  gap: 18px;
  margin-top: 18px;
}

.bonus-honor-group {
  display: grid;
  gap: 10px;
  padding: 2px 0 12px;
  border-bottom: 1px solid rgba(31, 139, 85, 0.1);
}

.bonus-honor-title {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: var(--color-accent-gold);
  font-size: 16px;
  font-weight: 850;
}

@media (max-width: 1180px) {
  .club-honor-layout--split {
    grid-template-columns: 1fr;
  }
}
</style>

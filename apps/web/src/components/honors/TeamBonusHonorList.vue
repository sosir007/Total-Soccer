<script setup lang="ts">
import { computed } from 'vue';
import NoDataView from '@/components/NoDataView.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { TeamBonusHonorDetail } from '@/services/types/catalog';
import type { CompetitionStandingPlacement } from '@/services/types/competitions';
import { getPlacementTextColor } from '@/utils/tag-theme';

const props = defineProps<{
  details?: TeamBonusHonorDetail[];
  emptyText?: string;
}>();

type BonusHonorPlacementGroup = {
  key: string;
  label: string;
  rank?: number | null;
  placement: CompetitionStandingPlacement;
  details: TeamBonusHonorDetail[];
};

const bonusHonorGroups = computed(() => buildBonusHonorGroups(props.details ?? []));

function formatBonusPlacement(detail: TeamBonusHonorDetail) {
  return detail.placement || (detail.rank ? `第${detail.rank}名` : '获奖');
}

function formatAwardName(name: string) {
  return name.replace(/（(?:国家队|俱乐部)）/g, '').trim();
}

function buildBonusHonorGroups(details: TeamBonusHonorDetail[]) {
  const groupMap = new Map<string, Map<string, BonusHonorPlacementGroup>>();

  for (const detail of details) {
    const groupKey = detail.awardId;
    const placementLabel = formatBonusPlacement(detail);
    const placement = resolveBonusPlacement(detail);
    const placementKey = `${detail.rank ?? ''}:${placementLabel}`;
    const placementMap = groupMap.get(groupKey) ?? new Map<string, BonusHonorPlacementGroup>();
    const placementGroup = placementMap.get(placementKey) ?? {
      key: placementKey,
      label: placementLabel,
      rank: detail.rank,
      placement,
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
      awardName: formatAwardName(firstDetail?.awardName ?? '团队附加分'),
      placements
    };
  });
}

function resolveBonusPlacement(detail: TeamBonusHonorDetail): CompetitionStandingPlacement {
  if (detail.rank === 1) {
    return 'CHAMPION';
  }

  if (detail.rank === 2) {
    return 'RUNNER_UP';
  }

  if (detail.rank === 3) {
    return 'THIRD_PLACE';
  }

  if (detail.rank === 4) {
    return 'FOURTH_PLACE';
  }

  const placement = detail.placement ?? '';

  if (placement.includes('冠军') || placement.includes('获奖')) {
    return 'CHAMPION';
  }

  if (placement.includes('亚军')) {
    return 'RUNNER_UP';
  }

  if (placement.includes('季军')) {
    return 'THIRD_PLACE';
  }

  if (placement.includes('殿军')) {
    return 'FOURTH_PLACE';
  }

  return 'CHAMPION';
}

function compareBonusDetails(left: TeamBonusHonorDetail, right: TeamBonusHonorDetail) {
  return getBonusDetailSortValue(left) - getBonusDetailSortValue(right);
}

function compareBonusPlacements(left: BonusHonorPlacementGroup, right: BonusHonorPlacementGroup) {
  const leftRank = left.rank ?? (left.placement === 'CHAMPION' ? 1 : 999);
  const rightRank = right.rank ?? (right.placement === 'CHAMPION' ? 1 : 999);

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
  const label = detail.season || (detail.year ? String(detail.year) : detail.editionName);
  return detail.sourceName ? `${label}（${detail.sourceName}）` : label;
}

function getBonusPlacementStyle(group: BonusHonorPlacementGroup) {
  return {
    '--honor-placement-color': getPlacementTextColor(group.placement)
  };
}
</script>

<template>
  <NoDataView v-if="!bonusHonorGroups.length" :text="emptyText || '暂无团队附加分'" />

  <div v-else class="bonus-honor-list">
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
          <span class="bonus-placement-label">{{ placement.label }}</span>
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

<style scoped lang="scss">
.bonus-honor-list {
  display: grid;
  gap: 18px;
}

.bonus-honor-group {
  display: grid;
  gap: 10px;
  padding: 2px 0 12px;
  border-bottom: 1px solid rgba(31, 139, 85, 0.1);

  &:last-child {
    border-bottom: 0;
  }
}

.bonus-honor-title {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: var(--color-brand-primary);
  font-size: 16px;
  font-weight: 850;
}

.bonus-placement-label {
  font-weight: 800;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import EntityLink from '@/components/EntityLink.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';

type Career = NonNullable<PlayerDetail['careers']>[number];

const props = withDefaults(
  defineProps<{
    careers?: Career[];
    type?: 'club' | 'country' | 'mixed';
  }>(),
  {
    careers: () => [],
    type: 'mixed'
  }
);

const isGoalkeeperCareerTable = computed(
  () => props.careers?.some((career) => isGoalkeeperPosition(career.position)) ?? false
);

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

function formatCareerStat(value?: number | null) {
  return value === null || value === undefined ? '-' : value;
}

function getCareerTypeLabel(career: Career) {
  return career.careerType === 'CLUB' ? '俱乐部' : '国家队';
}

function getCareerEntityType(career: Career) {
  return career.careerType === 'CLUB' ? 'club' : 'country';
}

function getCareerEntityId(career: Career) {
  return career.careerType === 'CLUB'
    ? career.club?.id || career.clubId
    : career.country?.id || career.countryId;
}

function getCareerEntityName(career: Career) {
  return career.careerType === 'CLUB' ? career.club?.name : career.country?.name;
}

function isGoalkeeperPosition(position?: string | null) {
  const normalized = (position ?? '').trim().toUpperCase();
  return normalized === 'GK' || normalized.includes('门将') || normalized.includes('守门');
}
</script>

<template>
  <el-table :data="careers" border>
    <el-table-column type="index" label="序号" width="70" align="center" />
    <el-table-column v-if="type === 'mixed'" label="类型" width="90" align="center">
      <template #default="{ row }">
        <SemanticTag :variant="row.careerType === 'CLUB' ? 'object-club' : 'object-country'">
          {{ getCareerTypeLabel(row) }}
        </SemanticTag>
      </template>
    </el-table-column>
    <el-table-column :label="type === 'country' ? '国家队' : '球队 / 国家队'" min-width="150">
      <template #default="{ row }">
        <EntityLink
          :id="getCareerEntityId(row)"
          :type="getCareerEntityType(row)"
          :name="getCareerEntityName(row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="时间" min-width="120">
      <template #default="{ row }">{{ formatCareerPeriod(row) }}</template>
    </el-table-column>
    <el-table-column label="位置" width="100" align="center">
      <template #default="{ row }">
        <PositionTags :value="row.position" />
      </template>
    </el-table-column>
    <el-table-column label="场次" width="80" align="center">
      <template #default="{ row }">{{ formatCareerStat(row.appearances) }}</template>
    </el-table-column>
    <el-table-column v-if="!isGoalkeeperCareerTable" label="进球" width="80" align="center">
      <template #default="{ row }">{{ formatCareerStat(row.goals) }}</template>
    </el-table-column>
    <el-table-column v-if="!isGoalkeeperCareerTable" label="助攻" width="80" align="center">
      <template #default="{ row }">{{ formatCareerStat(row.assists) }}</template>
    </el-table-column>
    <el-table-column v-if="isGoalkeeperCareerTable" label="零封" width="80" align="center">
      <template #default="{ row }">{{ formatCareerStat(row.cleanSheets) }}</template>
    </el-table-column>
    <el-table-column v-if="isGoalkeeperCareerTable" label="失球" width="80" align="center">
      <template #default="{ row }">{{ formatCareerStat(row.goalsConceded) }}</template>
    </el-table-column>
    <el-table-column v-if="type !== 'country'" label="标记" width="170">
      <template #default="{ row }">
        <div v-if="row.careerType === 'CLUB'" class="career-tags">
          <SemanticTag v-if="row.showInProfile" size="small" variant="status-enabled">
            展示
          </SemanticTag>
          <SemanticTag v-if="row.isRepresentative" size="small" variant="status-representative">
            代表
          </SemanticTag>
          <SemanticTag v-if="row.isLegend" size="small" variant="status-legend">名宿</SemanticTag>
        </div>
        <span v-else>-</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.career-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import EntityLink from '@/components/EntityLink.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';

const props = defineProps<{
  careers?: NonNullable<PlayerDetail['profileClubCareers']>;
  type: 'club' | 'country';
}>();

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

function isGoalkeeperPosition(position?: string | null) {
  const normalized = (position ?? '').trim().toUpperCase();
  return normalized === 'GK' || normalized.includes('门将') || normalized.includes('守门');
}
</script>

<template>
  <el-table :data="careers" border>
    <el-table-column :label="type === 'club' ? '俱乐部' : '国家队'" min-width="150">
      <template #default="{ row }">
        <EntityLink v-if="type === 'club'" :id="row.club?.id" type="club" :name="row.club?.name" />
        <EntityLink v-else :id="row.country?.id" type="country" :name="row.country?.name" />
      </template>
    </el-table-column>
    <el-table-column label="时间" min-width="120">
      <template #default="{ row }">{{ formatCareerPeriod(row) }}</template>
    </el-table-column>
    <el-table-column prop="position" label="位置" width="90" />
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
    <el-table-column v-if="type === 'club'" label="标签" width="170">
      <template #default="{ row }">
        <SemanticTag v-if="row.isRepresentative" size="small" variant="status-representative">
          代表
        </SemanticTag>
        <SemanticTag v-if="row.isLegend" size="small" variant="status-legend">名宿</SemanticTag>
      </template>
    </el-table-column>
  </el-table>
</template>

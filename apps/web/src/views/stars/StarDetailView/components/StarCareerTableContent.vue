<script setup lang="ts">
import EntityLink from '@/components/EntityLink.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';

defineProps<{
  careers?: NonNullable<PlayerDetail['profileClubCareers']>;
  type: 'club' | 'country';
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

function formatCareerStats(career: {
  appearances?: number | null;
  goals?: number | null;
  assists?: number | null;
  cleanSheets?: number | null;
  goalsConceded?: number | null;
}) {
  const normal = [career.appearances, career.goals, career.assists]
    .map((item) => item ?? '-')
    .join('/');
  const goalkeeper = [career.cleanSheets, career.goalsConceded].some(
    (item) => item !== null && item !== undefined
  )
    ? `，零封/失球 ${career.cleanSheets ?? '-'}/${career.goalsConceded ?? '-'}`
    : '';

  return `${normal}${goalkeeper}`;
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
    <el-table-column label="场/球/助" width="120">
      <template #default="{ row }">{{ formatCareerStats(row) }}</template>
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

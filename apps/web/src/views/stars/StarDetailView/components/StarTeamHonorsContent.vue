<script setup lang="ts">
import type { PlayerDetail } from '@/services/types/catalog';

type TeamHonor = NonNullable<PlayerDetail['teamHonors']>[number];

defineProps<{
  honors?: TeamHonor[];
}>();

const placementLabels = {
  CHAMPION: '冠军',
  RUNNER_UP: '亚军',
  THIRD_PLACE: '季军',
  FOURTH_PLACE: '殿军',
  SEMI_FINALIST: '四强'
} as const;

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatTeamHonor(row: TeamHonor) {
  const team = row.standing.club?.name ?? row.standing.country?.name ?? '-';
  const competition = row.standing.edition.competition.name;
  const edition =
    row.standing.edition.season || row.standing.edition.name || row.standing.edition.year || '-';
  const placement = placementLabels[row.standing.placement] ?? row.standing.placement;

  return `${team} / ${competition} / ${edition} / ${placement}`;
}

function formatSourceType(row: TeamHonor) {
  if (row.sourceType === 'MANUAL') {
    return '手动资料';
  }

  if (row.sourceType === 'CAREER_MATCH') {
    return '经历反查';
  }

  return '批量导入';
}
</script>

<template>
  <el-table :data="honors" border>
    <el-table-column label="关联荣誉" min-width="300" show-overflow-tooltip>
      <template #default="{ row }">{{ formatTeamHonor(row) }}</template>
    </el-table-column>
    <el-table-column label="来源" width="110" align="center">
      <template #default="{ row }">{{ formatSourceType(row) }}</template>
    </el-table-column>
    <el-table-column label="备注" min-width="180" show-overflow-tooltip>
      <template #default="{ row }">{{ formatText(row.remark) }}</template>
    </el-table-column>
  </el-table>
</template>

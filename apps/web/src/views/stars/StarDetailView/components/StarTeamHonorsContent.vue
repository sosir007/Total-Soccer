<script setup lang="ts">
import EntityLink from '@/components/EntityLink.vue';
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
  const edition = formatEditionShort(row.standing.edition);
  const placement = placementLabels[row.standing.placement] ?? row.standing.placement;

  return `${edition} / ${placement}`;
}

function formatEditionShort(edition: {
  season?: string | null;
  name?: string | null;
  year?: number | null;
}) {
  if (edition.year) return String(edition.year);

  return String(edition.season || edition.name || '-').replace(/年$/, '');
}

function getTeamType(row: TeamHonor) {
  return row.standing.club ? 'club' : 'country';
}

function getTeamId(row: TeamHonor) {
  return row.standing.club?.id ?? row.standing.country?.id ?? null;
}

function getTeamName(row: TeamHonor) {
  return row.standing.club?.name ?? row.standing.country?.name ?? '-';
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
    <el-table-column label="球队 / 国家队" min-width="150" show-overflow-tooltip>
      <template #default="{ row }">
        <EntityLink :id="getTeamId(row)" :type="getTeamType(row)" :name="getTeamName(row)" />
      </template>
    </el-table-column>
    <el-table-column label="赛事" min-width="180" show-overflow-tooltip>
      <template #default="{ row }">
        <EntityLink
          :id="row.standing.edition.competition.id"
          type="competition"
          :name="row.standing.edition.competition.name"
        />
      </template>
    </el-table-column>
    <el-table-column label="荣誉" min-width="160" show-overflow-tooltip>
      <template #default="{ row }">
        <a
          v-if="row.standing.edition.externalUrl"
          class="team-honor-edition-link"
          :href="row.standing.edition.externalUrl"
          target="_blank"
          rel="noreferrer"
          @click.stop
        >
          {{ formatTeamHonor(row) }}
        </a>
        <span v-else>{{ formatTeamHonor(row) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="来源" width="110" align="center">
      <template #default="{ row }">{{ formatSourceType(row) }}</template>
    </el-table-column>
    <el-table-column label="备注" min-width="180" show-overflow-tooltip>
      <template #default="{ row }">{{ formatText(row.remark) }}</template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.team-honor-edition-link {
  color: var(--text-color-regular);
  text-decoration: none;

  &:hover {
    color: var(--color-primary);
  }
}
</style>

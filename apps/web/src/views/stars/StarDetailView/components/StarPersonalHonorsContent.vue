<script setup lang="ts">
import EntityNameCell from '@/components/EntityNameCell.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import { buildExternalUrl } from '@/utils/external-link';

type PersonalHonor = NonNullable<PlayerDetail['personalHonors']>[number];

defineProps<{
  honors?: PersonalHonor[];
}>();

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatAwardEdition(honor: PersonalHonor) {
  return honor.edition.season || honor.edition.name || honor.edition.year || '-';
}

function formatAwardPlacement(honor: PersonalHonor) {
  if (honor.placement) {
    return honor.placement;
  }

  return honor.rank ? `第 ${honor.rank} 名` : '-';
}

function awardEditionUrl(honor: PersonalHonor) {
  return buildExternalUrl(
    honor.edition.externalUrl || honor.externalUrl,
    `${honor.edition.award.name} ${formatAwardEdition(honor)}`
  );
}
</script>

<template>
  <el-table :data="honors" border>
    <el-table-column label="奖项" min-width="170" fixed>
      <template #default="{ row }">
        <EntityNameCell
          :id="row.edition.award.id"
          type="award"
          :title="row.edition.award.name"
          :subtitle="row.edition.award.category || row.edition.award.code"
        />
      </template>
    </el-table-column>
    <el-table-column label="年份 / 届次" min-width="150">
      <template #default="{ row }">
        <a
          class="external-text-link"
          :href="awardEditionUrl(row)"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ formatAwardEdition(row) }}
        </a>
      </template>
    </el-table-column>
    <el-table-column label="年份" width="90">
      <template #default="{ row }">{{ row.edition.year || '-' }}</template>
    </el-table-column>
    <el-table-column label="名次" width="110">
      <template #default="{ row }">
        <SemanticTag variant="status-top-award">{{ formatAwardPlacement(row) }}</SemanticTag>
      </template>
    </el-table-column>
    <el-table-column label="备注" min-width="180">
      <template #default="{ row }">{{ formatText(row.remark) }}</template>
    </el-table-column>
  </el-table>
</template>

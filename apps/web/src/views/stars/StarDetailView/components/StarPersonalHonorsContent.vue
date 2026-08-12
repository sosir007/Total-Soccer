<script setup lang="ts">
import EntityNameCell from '@/components/EntityNameCell.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import { buildExternalUrl } from '@/utils/external-link';
import { formatHonorEditionLabel } from '@/utils/honor';
import { formatEntityName } from '@/utils/entity-name';
import { formatAwardRecipientPlacementDisplay } from '@/utils/award-display';

type PersonalHonor = NonNullable<PlayerDetail['personalHonors']>[number];

defineProps<{
  honors?: PersonalHonor[];
}>();

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatAwardEdition(honor: PersonalHonor) {
  return formatHonorEditionLabel(honor.edition);
}

function formatAwardPlacement(honor: PersonalHonor) {
  return formatAwardRecipientPlacementDisplay(honor.edition.award, honor);
}

function awardEditionUrl(honor: PersonalHonor) {
  return buildExternalUrl(
    honor.edition.externalUrl || honor.externalUrl,
    `${formatEntityName(honor.edition.award)} ${formatAwardEdition(honor)}`
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
          :title="formatEntityName(row.edition.award)"
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
      <template #default="{ row }">{{ formatAwardPlacement(row) }}</template>
    </el-table-column>
    <el-table-column label="备注" min-width="180">
      <template #default="{ row }">{{ formatText(row.remark) }}</template>
    </el-table-column>
  </el-table>
</template>

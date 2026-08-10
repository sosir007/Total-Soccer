<script setup lang="ts">
import { computed } from 'vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import PositionTags from '@/components/PositionTags.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerDetail } from '@/services/types/catalog';
import { getConfederationVariant } from '@/utils/tag-theme';

type Career = NonNullable<PlayerDetail['careers']>[number];
type CareerRow = Career & {
  periodText?: string;
};

const props = withDefaults(
  defineProps<{
    careers?: CareerRow[];
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
  periodText?: string | null;
  startSeason?: string | null;
  endSeason?: string | null;
  startYear?: number | null;
  endYear?: number | null;
}) {
  if (career.periodText) {
    return career.periodText;
  }

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

function getCareerEntitySubtitle(career: Career) {
  const uid = career.careerType === 'CLUB' ? career.club?.uid : career.country?.uid;

  return uid ? `UID ${uid}` : undefined;
}

function getCareerFederation(career: Career) {
  return career.careerType === 'CLUB'
    ? career.club?.federationRef
    : (career.country?.federationRef ?? null);
}

function getCareerCountry(career: Career) {
  return career.careerType === 'CLUB' ? career.club?.countryRef : (career.country ?? null);
}

function getCareerTableCellSpan({
  row,
  column
}: {
  row: CareerRow;
  column: { label?: string | null };
}) {
  if (row.careerType !== 'COUNTRY') {
    return { rowspan: 1, colspan: 1 };
  }

  if (column.label === '国家') {
    return { rowspan: 1, colspan: 2 };
  }

  if (column.label === '球队') {
    return { rowspan: 0, colspan: 0 };
  }

  return { rowspan: 1, colspan: 1 };
}

function isGoalkeeperPosition(position?: string | null) {
  const normalized = (position ?? '').trim().toUpperCase();
  return normalized === 'GK' || normalized.includes('门将') || normalized.includes('守门');
}
</script>

<template>
  <el-table :data="careers" border :span-method="getCareerTableCellSpan">
    <el-table-column type="index" label="序号" width="60" align="center" />
    <el-table-column v-if="type === 'mixed'" label="类型" width="90" align="center">
      <template #default="{ row }">
        <SemanticTag :variant="row.careerType === 'CLUB' ? 'object-club' : 'object-country'">
          {{ getCareerTypeLabel(row) }}
        </SemanticTag>
      </template>
    </el-table-column>
    <el-table-column label="足联" width="110" align="center">
      <template #default="{ row }">
        <SemanticTag
          v-if="getCareerFederation(row)"
          :variant="
            getConfederationVariant(
              getCareerFederation(row)?.name ?? getCareerFederation(row)?.code ?? ''
            )
          "
        >
          {{ getCareerFederation(row)?.name ?? getCareerFederation(row)?.code }}
        </SemanticTag>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column label="国家" width="140">
      <template #default="{ row }">
        <EntityNameCell
          v-if="getCareerCountry(row)"
          :id="getCareerCountry(row)?.id"
          type="country"
          :title="getCareerCountry(row)?.name"
          :subtitle="getCareerCountry(row)?.uid ? `UID ${getCareerCountry(row)?.uid}` : undefined"
        />
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column label="球队" min-width="180">
      <template #default="{ row }">
        <EntityNameCell
          :id="getCareerEntityId(row)"
          :type="getCareerEntityType(row)"
          :title="getCareerEntityName(row)"
          :subtitle="getCareerEntitySubtitle(row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="年份" min-width="200">
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
    <el-table-column label="标记" width="190" align="center">
      <template #default="{ row }">
        <div class="career-tags">
          <SemanticTag v-if="row.showInProfile" variant="status-enabled">展示</SemanticTag>
          <SemanticTag v-if="row.isRepresentative" variant="status-representative">
            代表
          </SemanticTag>
          <SemanticTag v-if="row.isLegend" variant="status-legend">传奇</SemanticTag>
          <span v-if="!row.showInProfile && !row.isRepresentative && !row.isLegend">-</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang="ts">
import { toRef } from 'vue';
import dayjs from 'dayjs';
import IconFont from '@/components/IconFont.vue';
import AbilityBadge from '@/components/AbilityBadge.vue';
import EntityLink from '@/components/EntityLink.vue';
import EntityNameCell from '@/components/EntityNameCell.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import type { PlayerListItem } from '@/services/types/catalog';
import type { NamedRef } from '@/services/types/common';
import {
  getConfederationVariant,
  getPlayerStatusLabel,
  getPlayerStatusVariant
} from '@/utils/tag-theme';

interface StarsFilters {
  page: number;
  pageSize: number;
}

const props = defineProps<{
  players: PlayerListItem[];
  total: number;
  loading: boolean;
  filters: StarsFilters;
}>();

const emit = defineEmits<{
  edit: [player: PlayerListItem];
  delete: [player: PlayerListItem];
}>();

const filters = toRef(props, 'filters');

function rowIndex(index: number) {
  return (filters.value.page - 1) * filters.value.pageSize + index + 1;
}

function formatRef(ref?: NamedRef | null) {
  return ref?.name ?? '-';
}

function formatConfederation(ref?: NamedRef | null) {
  return ref?.name ?? '';
}

function formatDate(value?: string | number | null) {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-';
}

function formatAge(player: PlayerListItem) {
  if (player.deceased || player.deathDate) {
    return '-';
  }

  if (!player.birthDate) {
    return formatText(player.age);
  }

  const birthDate = dayjs(player.birthDate);

  if (!birthDate.isValid()) {
    return formatText(player.age);
  }

  if (birthDate.isAfter(dayjs(), 'day')) {
    return formatText(player.age);
  }

  return dayjs().diff(birthDate, 'year');
}

function formatNationality(player: PlayerListItem) {
  const names = player.nationalities?.map((item) => item.country.name).filter(Boolean);

  return names?.length ? names.join('、') : formatText(player.nationality);
}

function formatBirthCity(player: PlayerListItem) {
  const city = player.birthCityRef?.name ?? player.birthCity;
  const country = player.birthCityRef?.country?.name ?? player.birthCountry?.name;

  if (!city) {
    return '-';
  }

  return country ? `${city}（${country}）` : city;
}

function formatBirthCityUid(player: PlayerListItem) {
  return player.birthCityRef?.uid ?? player.birthCityUid ?? '-';
}

function getRepresentativeClub(player: PlayerListItem) {
  return player.representativeClubCareer?.club ?? player.club;
}

function formatRepresentativeClubName(player: PlayerListItem) {
  return player.representativeClubName ?? player.primaryClub ?? '-';
}

function formatRepresentativeClubUid(player: PlayerListItem) {
  const club = getRepresentativeClub(player);

  return club?.uid ?? player.clubUid ?? '-';
}

function formatProfileClubs(player: PlayerListItem) {
  return player.profileClubNames?.length
    ? player.profileClubNames.join('、')
    : formatText(player.clubs);
}

function formatFoot(player: PlayerListItem) {
  return formatText(player.foot || player.preferredFootRef?.name);
}

function formatEthnicity(player: PlayerListItem) {
  return formatText(player.ethnicityRef?.name || player.ethnicity);
}

function formatBoolean(value?: boolean | null) {
  if (value === true) {
    return '是';
  }

  if (value === false) {
    return '否';
  }

  return '-';
}

function formatText(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : value;
}

function formatMarketValue(value?: number | null) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: 2
  }).format(value);
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>球员列表</h3>
      <span class="status-pill">{{ total }} 人</span>
    </div>

    <el-skeleton v-if="loading && !players.length" :rows="8" animated />

    <div v-else-if="!players.length" class="empty-panel">
      <h3>暂无巨星数据</h3>
      <p>可以先到天机阁导入数据，或调整当前筛选条件。</p>
    </div>

    <template v-else>
      <el-table :data="players" border>
        <el-table-column label="序号" width="76" fixed>
          <template #default="{ $index }">{{ rowIndex($index) }}</template>
        </el-table-column>
        <el-table-column prop="uid" label="UID" width="110" fixed />
        <el-table-column prop="chineseName" label="球员" min-width="170" fixed>
          <template #default="{ row }">
            <EntityNameCell
              :id="row.id"
              type="player"
              :title="row.chineseName"
              :subtitle="row.englishName || row.uid"
            />
          </template>
        </el-table-column>
        <el-table-column prop="pa" label="PA" width="90" sortable>
          <template #default="{ row }">
            <AbilityBadge type="PA" :value="row.pa" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="honorScore" label="荣誉分" width="100" sortable>
          <template #default="{ row }">{{ formatText(row.honorScore) }}</template>
        </el-table-column>
        <el-table-column prop="birthDate" label="生日" width="120" sortable>
          <template #default="{ row }">{{ formatDate(row.birthDate) }}</template>
        </el-table-column>
        <el-table-column label="过世" width="120">
          <template #default="{ row }">{{ formatDate(row.deathDate) }}</template>
        </el-table-column>
        <el-table-column label="年龄" width="80">
          <template #default="{ row }">{{ formatAge(row) }}</template>
        </el-table-column>
        <el-table-column prop="primaryRole" label="代表位置" width="110" />
        <el-table-column prop="positions" label="位置" min-width="150" show-overflow-tooltip />
        <el-table-column prop="height" label="身高" width="80" sortable />
        <el-table-column prop="weight" label="体重" width="80" sortable />
        <el-table-column prop="shirtNumber" label="球衣" width="80" />
        <el-table-column prop="skinTone" label="肤色" width="90" />
        <el-table-column prop="hairColor" label="发色" width="100" show-overflow-tooltip />
        <el-table-column label="种族" width="90" show-overflow-tooltip>
          <template #default="{ row }">{{ formatEthnicity(row) }}</template>
        </el-table-column>
        <el-table-column label="左右脚" width="100" show-overflow-tooltip>
          <template #default="{ row }">{{ formatFoot(row) }}</template>
        </el-table-column>
        <el-table-column label="足联" min-width="120">
          <template #default="{ row }">
            <SemanticTag
              v-if="formatConfederation(row.confederationRef)"
              :variant="getConfederationVariant(formatConfederation(row.confederationRef))"
            >
              {{ formatConfederation(row.confederationRef) }}
            </SemanticTag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="代表国籍" min-width="150">
          <template #default="{ row }">
            <EntityLink
              v-if="row.country"
              :id="row.country.id"
              type="country"
              :name="row.country.name"
              class="table-ref-card"
            >
              <strong>{{ row.country.name }}</strong>
              <span>UID {{ row.country.uid || row.countryUid || '-' }}</span>
            </EntityLink>
            <div v-else class="table-ref-card">
              <strong>{{ row.representedCountry || '-' }}</strong>
              <span>UID {{ row.countryUid || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="国籍" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <div v-if="row.nationalities?.length" class="inline-entity-list">
              <EntityLink
                v-for="item in row.nationalities"
                :id="item.country.id"
                :key="item.country.id"
                type="country"
                :name="item.country.name"
              />
            </div>
            <span v-else>{{ formatNationality(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出生城市" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="table-ref-card">
              <strong>{{ formatBirthCity(row) }}</strong>
              <span>UID {{ formatBirthCityUid(row) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="代表球队" min-width="170" show-overflow-tooltip>
          <template #default="{ row }">
            <EntityLink
              v-if="getRepresentativeClub(row)"
              :id="getRepresentativeClub(row)?.id"
              type="club"
              :name="formatRepresentativeClubName(row)"
              class="table-ref-card"
            >
              <strong>{{ formatRepresentativeClubName(row) }}</strong>
              <span>UID {{ formatRepresentativeClubUid(row) }}</span>
            </EntityLink>
            <div v-else class="table-ref-card">
              <strong>{{ formatRepresentativeClubName(row) }}</strong>
              <span>UID {{ formatRepresentativeClubUid(row) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="initialClub"
          label="初始球队"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column label="球队经历" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">{{ formatProfileClubs(row) }}</template>
        </el-table-column>
        <el-table-column label="类型" min-width="120">
          <template #default="{ row }">{{ formatRef(row.playerTypeRef) }}</template>
        </el-table-column>
        <el-table-column label="市场价值" width="120">
          <template #default="{ row }">{{ formatMarketValue(row.marketValue) }}</template>
        </el-table-column>
        <el-table-column label="是否退役" width="100">
          <template #default="{ row }">{{ formatBoolean(row.retired) }}</template>
        </el-table-column>
        <el-table-column label="是否去世" width="100">
          <template #default="{ row }">{{ formatBoolean(row.deceased) }}</template>
        </el-table-column>
        <el-table-column prop="databaseSource" label="数据库" width="100" />
        <el-table-column
          prop="staffRoles"
          label="担任过职位"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="achievement" label="成就" min-width="240" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <SemanticTag :variant="getPlayerStatusVariant(row)">
              {{ getPlayerStatusLabel(row) }}
            </SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click.stop="emit('edit', row)">
              <IconFont name="edit" />
              编辑
            </el-button>
            <el-button type="danger" link @click.stop="emit('delete', row)">
              <IconFont name="delete" />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <el-pagination
          v-model:current-page="filters.page"
          v-model:page-size="filters.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
        />
      </div>
    </template>
  </div>
</template>

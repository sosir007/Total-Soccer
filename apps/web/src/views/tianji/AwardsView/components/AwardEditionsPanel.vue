<script setup lang="ts">
import { computed } from 'vue';
import type { AwardEdition, AwardEditionRecipient } from '@/services/types/awards';
import EntityLink from '@/components/EntityLink.vue';
import IconFont from '@/components/IconFont.vue';

type RecipientRankColumn = 1 | 2 | 3;

type RecipientStatEntry = {
  label: string;
};

type RecipientStatRow = {
  key: string;
  id: string | null;
  type: 'player' | 'country' | 'club';
  name: string;
  counts: Record<RecipientRankColumn, number>;
  entries: Record<RecipientRankColumn, RecipientStatEntry[]>;
  total: number;
};

const rankColumns: RecipientRankColumn[] = [1, 2, 3];

const props = defineProps<{
  editions: AwardEdition[];
  rankedLayout: boolean;
  formatEditionRecipients: (edition: AwardEdition) => string;
  formatRecipientPlacement: (recipient: NonNullable<AwardEdition['recipients']>[number]) => string;
}>();

const emit = defineEmits<{
  create: [];
  edit: [edition: AwardEdition];
}>();

const statisticsRows = computed(() => buildStatisticsRows(props.editions));

function getRecipientByRank(edition: AwardEdition, rank: RecipientRankColumn) {
  return edition.recipients?.find((recipient) => getRecipientRank(recipient) === rank) ?? null;
}

function getRecipientRank(recipient: AwardEditionRecipient): RecipientRankColumn | null {
  if (recipient.rank === 1 || recipient.rank === 2 || recipient.rank === 3) {
    return recipient.rank;
  }

  const placement = recipient.placement?.trim();

  if (!placement) {
    return null;
  }

  if (['第一名', '第1名', '冠军', '金奖'].includes(placement)) {
    return 1;
  }

  if (['第二名', '第2名', '亚军', '银奖'].includes(placement)) {
    return 2;
  }

  if (['第三名', '第3名', '季军', '铜奖'].includes(placement)) {
    return 3;
  }

  return null;
}

function buildStatisticsRows(editions: AwardEdition[]) {
  const rowMap = new Map<string, RecipientStatRow>();

  for (const edition of editions) {
    for (const recipient of edition.recipients ?? []) {
      const rank = getRecipientRank(recipient);
      const entity = getRecipientEntity(recipient);

      if (!rank || !entity.name) {
        continue;
      }

      const row = rowMap.get(entity.key) ?? {
        key: entity.key,
        id: entity.id,
        type: entity.type,
        name: entity.name,
        counts: createEmptyRankCounts(),
        entries: createEmptyRankEntries(),
        total: 0
      };

      row.counts[rank] += 1;
      row.entries[rank].push({ label: formatEditionYear(edition) });
      row.total += 1;
      rowMap.set(entity.key, row);
    }
  }

  return [...rowMap.values()]
    .map((row) => ({
      ...row,
      entries: sortStatEntries(row.entries)
    }))
    .sort(compareStatisticRows);
}

function getRecipientEntity(recipient: AwardEditionRecipient) {
  if (recipient.player) {
    return {
      key: `player:${recipient.player.id}`,
      id: recipient.player.id,
      type: 'player' as const,
      name: recipient.player.chineseName
    };
  }

  if (recipient.country) {
    return {
      key: `country:${recipient.country.id}`,
      id: recipient.country.id,
      type: 'country' as const,
      name: recipient.country.name
    };
  }

  if (recipient.club) {
    return {
      key: `club:${recipient.club.id}`,
      id: recipient.club.id,
      type: 'club' as const,
      name: recipient.club.name
    };
  }

  return {
    key: `empty:${recipient.id}`,
    id: null,
    type: 'player' as const,
    name: ''
  };
}

function createEmptyRankCounts() {
  return Object.fromEntries(rankColumns.map((rank) => [rank, 0])) as Record<
    RecipientRankColumn,
    number
  >;
}

function createEmptyRankEntries() {
  return {
    1: [],
    2: [],
    3: []
  } satisfies Record<RecipientRankColumn, RecipientStatEntry[]>;
}

function sortStatEntries(entries: Record<RecipientRankColumn, RecipientStatEntry[]>) {
  return Object.fromEntries(
    rankColumns.map((rank) => [
      rank,
      [...entries[rank]].sort((a, b) => compareEditionLabel(a.label, b.label))
    ])
  ) as Record<RecipientRankColumn, RecipientStatEntry[]>;
}

function compareStatisticRows(a: RecipientStatRow, b: RecipientStatRow) {
  if (a.counts[1] !== b.counts[1]) {
    return b.counts[1] - a.counts[1];
  }

  if (a.counts[2] !== b.counts[2]) {
    return b.counts[2] - a.counts[2];
  }

  if (a.counts[3] !== b.counts[3]) {
    return b.counts[3] - a.counts[3];
  }

  if (a.total !== b.total) {
    return b.total - a.total;
  }

  return a.name.localeCompare(b.name, 'zh-CN');
}

function compareEditionLabel(a: string, b: string) {
  const left = Number.parseInt(a, 10);
  const right = Number.parseInt(b, 10);

  if (Number.isFinite(left) && Number.isFinite(right)) {
    return left - right;
  }

  return a.localeCompare(b, 'zh-CN');
}

function formatEditionYear(edition: AwardEdition) {
  return edition.year ? String(edition.year) : edition.name || '-';
}

function formatStatCell(row: RecipientStatRow, rank: RecipientRankColumn) {
  const count = row.counts[rank];

  if (!count) {
    return '-';
  }

  return `${count}（${row.entries[rank].map((entry) => entry.label).join('、')}）`;
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h3>年份与获奖人</h3>
        <p>一个奖项下维护所有年份和当年获奖对象。</p>
      </div>
      <el-button type="success" @click="emit('create')">
        <IconFont name="add" />
        新增年份
      </el-button>
    </div>

    <div v-if="!editions.length" class="mini-empty">暂无奖项年份</div>

    <el-table v-else-if="rankedLayout" :data="editions" border>
      <el-table-column label="年份" width="100" sortable>
        <template #default="{ row }">{{ formatEditionYear(row) }}</template>
      </el-table-column>
      <el-table-column label="第一名" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <template v-if="getRecipientByRank(row, 1)">
            <EntityLink
              v-if="getRecipientByRank(row, 1)?.player"
              :id="getRecipientByRank(row, 1)?.player?.id"
              type="player"
              :name="getRecipientByRank(row, 1)?.player?.chineseName"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 1)?.country"
              :id="getRecipientByRank(row, 1)?.country?.id"
              type="country"
              :name="getRecipientByRank(row, 1)?.country?.name"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 1)?.club"
              :id="getRecipientByRank(row, 1)?.club?.id"
              type="club"
              :name="getRecipientByRank(row, 1)?.club?.name"
            />
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="第二名" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <template v-if="getRecipientByRank(row, 2)">
            <EntityLink
              v-if="getRecipientByRank(row, 2)?.player"
              :id="getRecipientByRank(row, 2)?.player?.id"
              type="player"
              :name="getRecipientByRank(row, 2)?.player?.chineseName"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 2)?.country"
              :id="getRecipientByRank(row, 2)?.country?.id"
              type="country"
              :name="getRecipientByRank(row, 2)?.country?.name"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 2)?.club"
              :id="getRecipientByRank(row, 2)?.club?.id"
              type="club"
              :name="getRecipientByRank(row, 2)?.club?.name"
            />
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="第三名" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <template v-if="getRecipientByRank(row, 3)">
            <EntityLink
              v-if="getRecipientByRank(row, 3)?.player"
              :id="getRecipientByRank(row, 3)?.player?.id"
              type="player"
              :name="getRecipientByRank(row, 3)?.player?.chineseName"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 3)?.country"
              :id="getRecipientByRank(row, 3)?.country?.id"
              type="country"
              :name="getRecipientByRank(row, 3)?.country?.name"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 3)?.club"
              :id="getRecipientByRank(row, 3)?.club?.id"
              type="club"
              :name="getRecipientByRank(row, 3)?.club?.name"
            />
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.remark || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('edit', row)">
            <IconFont name="edit" />
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-else :data="editions" border>
      <el-table-column prop="year" label="年份" width="90" sortable />
      <el-table-column prop="name" label="届次 / 年份" min-width="150" />
      <el-table-column prop="season" label="赛季" width="110">
        <template #default="{ row }">{{ row.season || '-' }}</template>
      </el-table-column>
      <el-table-column label="获奖对象" min-width="260" show-overflow-tooltip>
        <template #default="{ row }">
          <div v-if="row.recipients?.length" class="inline-entity-list">
            <span
              v-for="recipient in row.recipients"
              :key="recipient.id"
              class="award-recipient-chip"
            >
              <span v-if="formatRecipientPlacement(recipient)">
                {{ formatRecipientPlacement(recipient) }}
              </span>
              <EntityLink
                v-if="recipient.player"
                :id="recipient.player.id"
                type="player"
                :name="recipient.player.chineseName"
              />
              <EntityLink
                v-else-if="recipient.country"
                :id="recipient.country.id"
                type="country"
                :name="recipient.country.name"
              />
              <EntityLink
                v-else-if="recipient.club"
                :id="recipient.club.id"
                type="club"
                :name="recipient.club.name"
              />
              <span v-else>-</span>
            </span>
          </div>
          <span v-else>{{ formatEditionRecipients(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.remark || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="emit('edit', row)">
            <IconFont name="edit" />
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="rankedLayout && editions.length" class="edition-statistics">
      <div class="edition-statistics__header">
        <h4>荣誉统计</h4>
        <p>按获奖对象汇总该奖项已录入年份的最终名次。</p>
      </div>

      <div v-if="!statisticsRows.length" class="mini-empty">暂无荣誉统计</div>

      <el-table v-else :data="statisticsRows" border class="edition-statistics-table">
        <el-table-column label="序号" width="60" align="center" fixed="left">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="获奖对象" width="180" fixed="left">
          <template #default="{ row }">
            <EntityLink :id="row.id" :type="row.type" :name="row.name" />
          </template>
        </el-table-column>
        <el-table-column label="第一名" min-width="190" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="edition-stat-cell rank-first">{{ formatStatCell(row, 1) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="第二名" min-width="190" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="edition-stat-cell rank-second">{{ formatStatCell(row, 2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="第三名" min-width="190" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="edition-stat-cell rank-third">{{ formatStatCell(row, 3) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总数" width="70" align="center">
          <template #default="{ row }">
            <strong>{{ row.total }}</strong>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edition-statistics {
  display: grid;
  gap: 12px;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-brand-subtle);
}

.edition-statistics__header {
  display: grid;
  gap: 4px;

  h4 {
    margin: 0;
    color: var(--text-color-primary);
    font-size: 18px;
    font-weight: 850;
  }

  p {
    margin: 0;
    color: var(--text-color-secondary);
    font-weight: 650;
  }
}

.edition-statistics-table {
  :deep(.edition-stat-cell) {
    font-size: 14px;
    font-weight: 820;
    line-height: 1.55;
  }

  :deep(.rank-first) {
    color: var(--color-accent-gold);
  }

  :deep(.rank-second) {
    color: var(--text-color-primary);
  }

  :deep(.rank-third) {
    color: #9c6a3c;
  }
}
</style>

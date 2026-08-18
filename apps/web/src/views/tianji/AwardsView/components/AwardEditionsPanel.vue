<script setup lang="ts">
import { computed } from 'vue';
import type { AwardEdition, AwardEditionRecipient } from '@/services/types/awards';
import EntityLink from '@/components/EntityLink.vue';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import { formatEntityName } from '@/utils/entity-name';

type RecipientRankColumn = 1 | 2 | 3;
type LineupPositionColumn = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

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
const lineupColumns: Array<{ key: LineupPositionColumn; label: string; minWidth: number }> = [
  { key: 'goalkeeper', label: '门将', minWidth: 150 },
  { key: 'defender', label: '后卫', minWidth: 220 },
  { key: 'midfielder', label: '中场', minWidth: 220 },
  { key: 'forward', label: '前锋', minWidth: 220 }
];

const props = defineProps<{
  editions: AwardEdition[];
  rankedLayout: boolean;
  lineupLayout?: boolean;
  rankColumnLabels?: Partial<Record<RecipientRankColumn, string>>;
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

function getLineupRecipients(edition: AwardEdition, column: LineupPositionColumn) {
  return (
    edition.recipients?.filter((recipient) => resolveLineupPositionColumn(recipient) === column) ??
    []
  );
}

function resolveLineupPositionColumn(
  recipient: AwardEditionRecipient
): LineupPositionColumn | null {
  const primaryRoleColumn = classifyPositionText(recipient.player?.primaryRole);

  if (primaryRoleColumn) {
    return primaryRoleColumn;
  }

  return classifyPositionText(recipient.player?.positions);
}

function classifyPositionText(positionText?: string | null): LineupPositionColumn | null {
  const positions = splitPositionText(positionText);

  if (!positions.length) {
    return null;
  }

  if (positions.some((position) => ['GK', 'GOALKEEPER'].includes(position))) {
    return 'goalkeeper';
  }

  if (
    positions.some((position) =>
      ['DC', 'DL', 'DR', 'DLC', 'DRC', 'WBL', 'WBR', 'SW', 'CB', 'LB', 'RB'].includes(position)
    )
  ) {
    return 'defender';
  }

  if (
    positions.some((position) =>
      ['DMC', 'MC', 'AMC', 'ML', 'MR', 'AML', 'AMR', 'DM', 'CM', 'AM', 'LM', 'RM'].includes(
        position
      )
    )
  ) {
    return 'midfielder';
  }

  if (positions.some((position) => ['ST', 'FC', 'CF', 'FW', 'F'].includes(position))) {
    return 'forward';
  }

  return null;
}

function splitPositionText(positionText?: string | null) {
  return (positionText ?? '')
    .toUpperCase()
    .split(/[\s,，、/|]+/)
    .map((position) => position.trim())
    .filter(Boolean);
}

function getRankColumnLabel(rank: RecipientRankColumn) {
  const fallbackLabels: Record<RecipientRankColumn, string> = {
    1: '第一名',
    2: '第二名',
    3: '第三名'
  };

  return props.rankColumnLabels?.[rank] ?? fallbackLabels[rank];
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
      name: formatEntityName(recipient.country)
    };
  }

  if (recipient.club) {
    return {
      key: `club:${recipient.club.id}`,
      id: recipient.club.id,
      type: 'club' as const,
      name: formatEntityName(recipient.club)
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

function formatEditionTime(edition: AwardEdition) {
  if (edition.season) {
    return edition.season;
  }

  if (edition.year) {
    return `${edition.year}年`;
  }

  return edition.name || '-';
}

function shouldShowEditionName(edition: AwardEdition) {
  if (!edition.name) {
    return false;
  }

  return edition.name !== formatEditionTime(edition);
}

function formatStatCell(row: RecipientStatRow, rank: RecipientRankColumn) {
  const count = row.counts[rank];

  if (!count) {
    return '-';
  }

  return `${count} 次：${row.entries[rank].map((entry) => entry.label).join('、')}`;
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

    <NoDataView v-if="!editions.length" text="暂无奖项年份" />

    <el-table v-else-if="lineupLayout" :data="editions" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column label="年份" width="100" sortable>
        <template #default="{ row }">{{ formatEditionYear(row) }}</template>
      </el-table-column>
      <el-table-column
        v-for="column in lineupColumns"
        :key="column.key"
        :label="column.label"
        :min-width="column.minWidth"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <div
            v-if="getLineupRecipients(row, column.key).length"
            class="inline-entity-list lineup-entity-list"
          >
            <EntityLink
              v-for="recipient in getLineupRecipients(row, column.key)"
              :id="recipient.player?.id"
              :key="recipient.id"
              type="player"
              :name="recipient.player?.chineseName"
            />
          </div>
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

    <el-table v-else-if="rankedLayout" :data="editions" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column label="年份" width="100" sortable>
        <template #default="{ row }">{{ formatEditionYear(row) }}</template>
      </el-table-column>
      <el-table-column :label="getRankColumnLabel(1)" min-width="180" show-overflow-tooltip>
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
              :name="formatEntityName(getRecipientByRank(row, 1)?.country)"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 1)?.club"
              :id="getRecipientByRank(row, 1)?.club?.id"
              type="club"
              :name="formatEntityName(getRecipientByRank(row, 1)?.club)"
            />
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column :label="getRankColumnLabel(2)" min-width="180" show-overflow-tooltip>
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
              :name="formatEntityName(getRecipientByRank(row, 2)?.country)"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 2)?.club"
              :id="getRecipientByRank(row, 2)?.club?.id"
              type="club"
              :name="formatEntityName(getRecipientByRank(row, 2)?.club)"
            />
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column :label="getRankColumnLabel(3)" min-width="180" show-overflow-tooltip>
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
              :name="formatEntityName(getRecipientByRank(row, 3)?.country)"
            />
            <EntityLink
              v-else-if="getRecipientByRank(row, 3)?.club"
              :id="getRecipientByRank(row, 3)?.club?.id"
              type="club"
              :name="formatEntityName(getRecipientByRank(row, 3)?.club)"
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
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column label="时间" width="150" sortable>
        <template #default="{ row }">
          <div class="award-edition-time">
            <strong>{{ formatEditionTime(row) }}</strong>
            <span v-if="shouldShowEditionName(row)">{{ row.name }}</span>
          </div>
        </template>
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
                :name="formatEntityName(recipient.country)"
              />
              <EntityLink
                v-else-if="recipient.club"
                :id="recipient.club.id"
                type="club"
                :name="formatEntityName(recipient.club)"
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

      <NoDataView v-if="!statisticsRows.length" text="暂无荣誉统计" />

      <el-table v-else :data="statisticsRows" border class="edition-statistics-table">
        <el-table-column label="序号" width="60" align="center" fixed="left">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="获奖对象" width="180" fixed="left">
          <template #default="{ row }">
            <EntityLink :id="row.id" :type="row.type" :name="row.name" />
          </template>
        </el-table-column>
        <el-table-column
          :label="getRankColumnLabel(1)"
          min-width="190"
          align="center"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="edition-stat-cell rank-first">{{ formatStatCell(row, 1) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="getRankColumnLabel(2)"
          min-width="190"
          align="center"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="edition-stat-cell rank-second">{{ formatStatCell(row, 2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="getRankColumnLabel(3)"
          min-width="190"
          align="center"
          show-overflow-tooltip
        >
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
.award-edition-time {
  display: grid;
  gap: 4px;

  strong {
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: 1.35;
  }

  span {
    color: var(--text-color-secondary);
    font-size: 12px;
    font-weight: 650;
    line-height: 1.35;
  }
}

.lineup-entity-list {
  align-items: center;
  gap: 8px 12px;
}

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
    color: var(--tag-placement-runner-up-text);
  }

  :deep(.rank-third) {
    color: #9c6a3c;
  }
}
</style>

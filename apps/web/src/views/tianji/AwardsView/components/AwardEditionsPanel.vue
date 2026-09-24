<script setup lang="ts">
import { computed } from 'vue';
import type { AwardEdition, AwardEditionRecipient } from '@/services/types/awards';
import EntityLink from '@/components/EntityLink.vue';
import IconFont from '@/components/IconFont.vue';
import NoDataView from '@/components/NoDataView.vue';
import { formatEntityName } from '@/utils/entity-name';
import { formatHonorEditionLabel } from '@/utils/honor';

type RecipientRankColumn = 1 | 2 | 3;
type LineupPositionColumn = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

type RecipientStatEntry = {
  label: string;
};

type MonthlyRecipientStatEntry = {
  label: string;
  externalUrl: string | null;
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

type MonthlyRecipientStatRow = {
  key: string;
  id: string | null;
  type: 'player' | 'country' | 'club';
  name: string;
  entries: MonthlyRecipientStatEntry[];
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
  monthlyLayout?: boolean;
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
const monthlyStatisticsRows = computed(() => buildMonthlyStatisticsRows(props.editions));
const hasSeasonEditionLabel = computed(() =>
  props.editions.some((edition) => isSeasonEditionLabel(formatEditionYear(edition)))
);
const editionColumnLabel = computed(() => (hasSeasonEditionLabel.value ? '赛季' : '年份'));
const editionColumnMinWidth = computed(() => (hasSeasonEditionLabel.value ? 120 : 100));

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

  if (isImplicitFirstPlacement(placement)) {
    return 1;
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

function buildMonthlyStatisticsRows(editions: AwardEdition[]) {
  const rowMap = new Map<string, MonthlyRecipientStatRow>();

  for (const edition of editions) {
    for (const recipient of edition.recipients ?? []) {
      const entity = getRecipientEntity(recipient);

      if (!entity.name) {
        continue;
      }

      const row = rowMap.get(entity.key) ?? {
        ...entity,
        entries: [],
        total: 0
      };

      row.entries.push({
        label: formatMonthlyEditionLabel(edition),
        externalUrl: resolveMonthlyEditionUrl(edition, recipient)
      });
      row.total += 1;
      rowMap.set(entity.key, row);
    }
  }

  return [...rowMap.values()].sort(
    (left, right) => right.total - left.total || left.name.localeCompare(right.name, 'zh-CN')
  );
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
      name: formatEntityName(recipient.club, true)
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
    const yearDiff = left - right;

    if (yearDiff !== 0) {
      return yearDiff;
    }
  }

  return a.localeCompare(b, 'zh-CN');
}

function formatEditionYear(edition: AwardEdition) {
  return formatAwardEditionDisplayLabel(edition);
}

function formatEditionTime(edition: AwardEdition) {
  return formatAwardEditionDisplayLabel(edition);
}

function formatEditionMonth(edition: AwardEdition) {
  return edition.month ? `${edition.month}月` : '-';
}

function formatMonthlyEditionLabel(edition: AwardEdition) {
  return [formatEditionYear(edition), formatEditionMonth(edition)]
    .filter((value) => value !== '-')
    .join(' ');
}

function resolveMonthlyEditionUrl(edition: AwardEdition, recipient?: AwardEditionRecipient) {
  return (
    recipient?.externalUrl ??
    edition.recipients?.find((item) => item.externalUrl)?.externalUrl ??
    edition.externalUrl ??
    edition.competitionEdition?.externalUrl ??
    null
  );
}

function formatMonthlyEditionRemark(edition: AwardEdition) {
  return (
    edition.remark ||
    (edition.recipients ?? [])
      .map((recipient) => recipient.remark?.trim())
      .filter(Boolean)
      .join('；') ||
    '-'
  );
}

function shouldShowEditionName(edition: AwardEdition) {
  if (!edition.name) {
    return false;
  }

  return formatHonorEditionLabel({ name: edition.name }) !== formatEditionTime(edition);
}

function formatAwardEditionDisplayLabel(edition: AwardEdition) {
  const label = formatHonorEditionLabel(edition.competitionEdition ?? edition);

  if (edition.year && isYearWithHostLabel(label, edition.year)) {
    return String(edition.year);
  }

  return label;
}

function isYearWithHostLabel(label: string, year: number) {
  return new RegExp(`^${year}年\\s+\\S+`).test(label);
}

function isSeasonEditionLabel(label: string) {
  return Boolean(label && label !== '-' && !/^\d{4}$/.test(label));
}

function isImplicitFirstPlacement(placement: string) {
  if (['获奖', '优胜者', '入选'].includes(placement)) {
    return true;
  }

  return /最佳/.test(placement);
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
        <h3>{{ monthlyLayout ? '赛季、月份与获奖人' : '年份与获奖人' }}</h3>
        <p>
          {{
            monthlyLayout
              ? '每次月度获奖独立记录，同一赛季可维护多个月份。'
              : '一个奖项下维护所有年份和当年获奖对象。'
          }}
        </p>
      </div>
      <el-button type="success" @click="emit('create')">
        <IconFont name="add" />
        {{ monthlyLayout ? '新增记录' : '新增年份' }}
      </el-button>
    </div>

    <NoDataView v-if="!editions.length" text="暂无奖项年份" />

    <el-table v-else-if="monthlyLayout" :data="editions" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column label="赛季" min-width="120" sortable>
        <template #default="{ row }">{{ formatEditionYear(row) }}</template>
      </el-table-column>
      <el-table-column label="月份" width="100" sortable>
        <template #default="{ row }">
          <a
            v-if="resolveMonthlyEditionUrl(row)"
            class="external-text-link monthly-edition-link"
            :href="resolveMonthlyEditionUrl(row) ?? undefined"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ formatEditionMonth(row) }}
          </a>
          <span v-else>{{ formatEditionMonth(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="获奖人" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <div v-if="row.recipients?.length" class="inline-entity-list award-recipient-list">
            <template v-for="(recipient, index) in row.recipients" :key="recipient.id">
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
                :name="formatEntityName(recipient.club, true)"
              />
              <span v-if="index < row.recipients.length - 1" class="recipient-separator">、</span>
            </template>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">{{ formatMonthlyEditionRemark(row) }}</template>
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

    <el-table v-else-if="lineupLayout" :data="editions" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>
      <el-table-column :label="editionColumnLabel" :min-width="editionColumnMinWidth" sortable>
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
            class="inline-entity-list lineup-entity-list award-recipient-list"
          >
            <template
              v-for="(recipient, index) in getLineupRecipients(row, column.key)"
              :key="`separator-${recipient.id}`"
            >
              <EntityLink
                :id="recipient.player?.id"
                type="player"
                :name="recipient.player?.chineseName"
              />
              <span
                v-if="index < getLineupRecipients(row, column.key).length - 1"
                class="recipient-separator"
                >、</span
              >
            </template>
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
      <el-table-column :label="editionColumnLabel" :min-width="editionColumnMinWidth" sortable>
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
              :name="formatEntityName(getRecipientByRank(row, 1)?.club, true)"
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
              :name="formatEntityName(getRecipientByRank(row, 2)?.club, true)"
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
              :name="formatEntityName(getRecipientByRank(row, 3)?.club, true)"
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
      <el-table-column :label="editionColumnLabel" :min-width="editionColumnMinWidth" sortable>
        <template #default="{ row }">
          <div class="award-edition-time">
            <strong>{{ formatEditionTime(row) }}</strong>
            <span v-if="shouldShowEditionName(row)">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="获奖对象" min-width="260" show-overflow-tooltip>
        <template #default="{ row }">
          <div v-if="row.recipients?.length" class="inline-entity-list award-recipient-list">
            <span
              v-for="(recipient, index) in row.recipients"
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
                :name="formatEntityName(recipient.club, true)"
              />
              <span v-else>-</span>
              <span v-if="index < row.recipients.length - 1" class="recipient-separator">、</span>
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

    <div v-if="monthlyLayout && editions.length" class="edition-statistics">
      <div class="edition-statistics__header">
        <h4>获奖统计</h4>
        <p>按获奖人汇总已录入的全部月度获奖记录。</p>
      </div>

      <el-table :data="monthlyStatisticsRows" border class="edition-statistics-table">
        <el-table-column label="序号" width="60" align="center">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="获奖人" width="180">
          <template #default="{ row }">
            <EntityLink :id="row.id" :type="row.type" :name="row.name" />
          </template>
        </el-table-column>
        <el-table-column label="获奖记录" min-width="320" show-overflow-tooltip>
          <template #default="{ row }">
            <template
              v-for="(entry, entryIndex) in row.entries"
              :key="`${row.key}-${entry.label}-${entryIndex}`"
            >
              <a
                v-if="entry.externalUrl"
                class="external-text-link monthly-edition-link"
                :href="entry.externalUrl"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
              >
                {{ entry.label }}
              </a>
              <span v-else>{{ entry.label }}</span>
              <span v-if="entryIndex < row.entries.length - 1">、</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="总数" width="80" align="center">
          <template #default="{ row }">
            <strong>{{ row.total }}</strong>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="rankedLayout && !monthlyLayout && editions.length" class="edition-statistics">
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

.lineup-entity-list.award-recipient-list {
  gap: 0;
}

.monthly-edition-link {
  color: var(--color-accent-gold);
  font-weight: 800;
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

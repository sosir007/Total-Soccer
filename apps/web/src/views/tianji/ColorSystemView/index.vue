<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import NoDataView from '@/components/NoDataView.vue';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  chartColorGroups,
  semanticColorGroups,
  type ChartColorToken,
  type SemanticColorToken,
  type SemanticTagTheme
} from '@/utils/tag-theme';

type ColorGroupKey = 'all' | string;
type ColorRowKind = 'semantic' | 'chart';

interface ColorSystemRow {
  name: string;
  variant: string;
  description: string;
  groupLabel: string;
  kind: ColorRowKind;
  vars: SemanticTagTheme;
}

const activeGroup = ref<ColorGroupKey>('all');
const resolvedColors = ref<Record<string, SemanticTagTheme>>({});

const colorGroups = [...semanticColorGroups, ...chartColorGroups];

const colorTabs = computed(() => [
  {
    key: 'all' as const,
    label: '全部',
    description: '查看项目当前全部业务语义颜色和图表色。'
  },
  ...colorGroups.map((group) => ({
    key: group.key,
    label: group.label,
    description: group.description
  }))
]);

const activeTab = computed(
  () => colorTabs.value.find((tab) => tab.key === activeGroup.value) ?? colorTabs.value[0]
);

const colorRows = computed(() => {
  if (activeGroup.value === 'all') {
    return colorGroups.flatMap((group) =>
      group.colors.map((color) => normalizeColorRow(color, group.label, group.key))
    );
  }

  const group = colorGroups.find((item) => item.key === activeGroup.value);

  return (group?.colors ?? []).map((color) =>
    normalizeColorRow(color, group?.label ?? '-', group?.key ?? '')
  );
});

const totalColorCount = computed(() =>
  colorGroups.reduce((total, group) => total + group.colors.length, 0)
);

function resolveCssVar(name: string) {
  if (typeof window === 'undefined') {
    return '-';
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || '-';
}

function refreshResolvedColors() {
  resolvedColors.value = Object.fromEntries(
    colorRowsForResolve().map((color) => [
      color.variant,
      {
        text: resolveCssVar(color.vars.text),
        border: color.vars.border ? resolveCssVar(color.vars.border) : '-',
        background: color.vars.background ? resolveCssVar(color.vars.background) : '-'
      }
    ])
  );
}

function getResolvedColor(row: ColorSystemRow, type: keyof SemanticTagTheme) {
  return resolvedColors.value[row.variant]?.[type] ?? '-';
}

function isValidColor(value: string) {
  return value !== '-';
}

function normalizeColorRow(
  color: SemanticColorToken | ChartColorToken,
  groupLabel: string,
  groupKey: string
): ColorSystemRow {
  if ('variant' in color) {
    return {
      ...color,
      groupLabel,
      kind: 'semantic'
    };
  }

  return {
    name: color.name,
    variant: color.key,
    description: color.description,
    groupLabel,
    kind: groupKey === 'chart' ? 'chart' : 'semantic',
    vars: {
      text: color.varName,
      border: '',
      background: ''
    }
  };
}

function colorRowsForResolve() {
  return colorGroups.flatMap((group) =>
    group.colors.map((color) => normalizeColorRow(color, group.label, group.key))
  );
}

onMounted(() => {
  refreshResolvedColors();
});
</script>

<template>
  <section class="page-stack">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>色彩体系</h2>
          <p>集中查看项目当前业务标签、名次、能力值和图表色的前端颜色配置。</p>
        </div>
        <span class="status-pill">{{ totalColorCount }} 项颜色</span>
      </div>

      <el-tabs
        :model-value="activeGroup"
        class="color-system-tabs"
        @update:model-value="activeGroup = $event as ColorGroupKey"
      >
        <el-tab-pane v-for="tab in colorTabs" :key="tab.key" :label="tab.label" :name="tab.key" />
      </el-tabs>

      <div class="color-system-intro">
        <strong>{{ activeTab.label }}</strong>
        <span>{{ activeTab.description }}</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>颜色列表</h3>
        <span class="status-pill">{{ colorRows.length }} 条</span>
      </div>

      <NoDataView v-if="!colorRows.length" text="暂无颜色配置，当前分组没有可展示的颜色 token。" />

      <el-table v-else :data="colorRows" border class="color-system-table">
        <el-table-column label="序号" width="60" align="center">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column v-if="activeGroup === 'all'" label="分组" width="100" align="center">
          <template #default="{ row }">{{ row.groupLabel }}</template>
        </el-table-column>
        <el-table-column label="名称" width="130">
          <template #default="{ row }">
            <strong>{{ row.name }}</strong>
          </template>
        </el-table-column>
        <el-table-column label="Variant" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <code>{{ row.variant }}</code>
          </template>
        </el-table-column>
        <el-table-column label="预览" width="120" align="center">
          <template #default="{ row }">
            <SemanticTag v-if="row.kind === 'semantic'" :variant="row.variant">
              {{ row.name }}
            </SemanticTag>
            <span v-else class="chart-color-preview">
              <i :style="{ background: getResolvedColor(row, 'text') }" />
              <em>{{ row.name }}</em>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="activeGroup === 'chart' ? '图表色' : '文字色'"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="color-token-cell">
              <i
                class="color-swatch"
                :class="{ 'is-empty': !isValidColor(getResolvedColor(row, 'text')) }"
                :style="{ background: getResolvedColor(row, 'text') }"
              />
              <span>
                <strong>{{ getResolvedColor(row, 'text') }}</strong>
                <em>{{ row.vars.text }}</em>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="activeGroup !== 'chart'"
          label="边框色"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="color-token-cell">
              <i
                class="color-swatch"
                :class="{ 'is-empty': !isValidColor(getResolvedColor(row, 'border')) }"
                :style="{ background: getResolvedColor(row, 'border') }"
              />
              <span>
                <strong>{{ getResolvedColor(row, 'border') }}</strong>
                <em>{{ row.vars.border }}</em>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="activeGroup !== 'chart'"
          label="背景色"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="color-token-cell">
              <i
                class="color-swatch"
                :class="{ 'is-empty': !isValidColor(getResolvedColor(row, 'background')) }"
                :style="{ background: getResolvedColor(row, 'background') }"
              />
              <span>
                <strong>{{ getResolvedColor(row, 'background') }}</strong>
                <em>{{ row.vars.background }}</em>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="用途说明" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">{{ row.description }}</template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.color-system-tabs {
  margin-top: 6px;
}

.color-system-intro {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 2px 0 0;
  color: var(--text-color-secondary);

  strong {
    color: var(--color-brand-primary);
  }
}

.color-system-table {
  code {
    color: var(--text-color-primary);
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
    font-size: 12px;
    font-weight: 760;
  }
}

.color-token-cell {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  max-width: 100%;

  span {
    display: grid;
    min-width: 0;
  }

  strong {
    color: var(--text-color-primary);
    font-size: 13px;
    font-weight: 820;
  }

  em {
    overflow: hidden;
    color: var(--text-color-secondary);
    font-size: 12px;
    font-style: normal;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.chart-color-preview {
  display: inline-grid;
  gap: 5px;
  justify-items: center;
  color: var(--text-color-secondary);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;

  i {
    width: 54px;
    height: 10px;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text-color-white) 42%, transparent);
  }

  em {
    font-style: normal;
  }
}

.color-swatch {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border-default);
  border-radius: 7px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-surface-default) 45%, transparent);

  &.is-empty {
    background:
      linear-gradient(
        45deg,
        transparent 47%,
        var(--tag-neutral-border) 47%,
        var(--tag-neutral-border) 53%,
        transparent 53%
      ),
      var(--tag-neutral-bg) !important;
  }
}
</style>

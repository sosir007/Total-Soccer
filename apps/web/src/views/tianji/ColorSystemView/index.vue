<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import SemanticTag from '@/components/SemanticTag.vue';
import {
  semanticColorGroups,
  type SemanticColorToken,
  type SemanticTagTheme
} from '@/utils/tag-theme';

type ColorGroupKey = 'all' | (typeof semanticColorGroups)[number]['key'];

const activeGroup = ref<ColorGroupKey>('all');
const resolvedColors = ref<Record<string, SemanticTagTheme>>({});

const colorTabs = computed(() => [
  {
    key: 'all' as const,
    label: '全部',
    description: '查看项目当前全部业务语义颜色。'
  },
  ...semanticColorGroups.map((group) => ({
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
    return semanticColorGroups.flatMap((group) =>
      group.colors.map((color) => ({
        ...color,
        groupLabel: group.label
      }))
    );
  }

  const group = semanticColorGroups.find((item) => item.key === activeGroup.value);

  return (group?.colors ?? []).map((color) => ({
    ...color,
    groupLabel: group?.label ?? '-'
  }));
});

const totalColorCount = computed(() =>
  semanticColorGroups.reduce((total, group) => total + group.colors.length, 0)
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
    semanticColorGroups.flatMap((group) =>
      group.colors.map((color) => [
        color.variant,
        {
          text: resolveCssVar(color.vars.text),
          border: resolveCssVar(color.vars.border),
          background: resolveCssVar(color.vars.background)
        }
      ])
    )
  );
}

function getResolvedColor(row: SemanticColorToken, type: keyof SemanticTagTheme) {
  return resolvedColors.value[row.variant]?.[type] ?? '-';
}

function isValidColor(value: string) {
  return value !== '-';
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
          <p>集中查看项目当前业务标签、名次和能力值的前端颜色配置。</p>
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

      <div v-if="!colorRows.length" class="empty-panel">
        <h3>暂无颜色配置</h3>
        <p>当前分组没有可展示的颜色 token。</p>
      </div>

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
            <SemanticTag :variant="row.variant">{{ row.name }}</SemanticTag>
          </template>
        </el-table-column>
        <el-table-column label="文字色" min-width="180" show-overflow-tooltip>
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
        <el-table-column label="边框色" min-width="180" show-overflow-tooltip>
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
        <el-table-column label="背景色" min-width="180" show-overflow-tooltip>
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
  color: var(--muted);

  strong {
    color: var(--green);
  }
}

.color-system-table {
  code {
    color: #3d4d43;
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
    color: #334155;
    font-size: 13px;
    font-weight: 820;
  }

  em {
    overflow: hidden;
    color: #8a9890;
    font-size: 12px;
    font-style: normal;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.color-swatch {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border: 1px solid rgba(15, 37, 27, 0.12);
  border-radius: 7px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);

  &.is-empty {
    background:
      linear-gradient(45deg, transparent 47%, #cbd5e1 47%, #cbd5e1 53%, transparent 53%), #f8fafc !important;
  }
}
</style>

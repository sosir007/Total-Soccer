<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SelectOption } from '@/stores/options';

const confederationPattern =
  /亚足联|亚洲|欧足联|欧洲|南美|非足联|非洲|中北美|北中美|加勒比|大洋足联|大洋洲|AFC|UEFA|CONMEBOL|CAF|CONCACAF|OFC/i;
const model = defineModel<string | string[]>({ default: '' });
const props = withDefaults(
  defineProps<{
    options: SelectOption[];
    loading?: boolean;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    filterable?: boolean;
    multiple?: boolean;
  }>(),
  {
    loading: false,
    placeholder: '请选择',
    clearable: true,
    disabled: false,
    filterable: true,
    multiple: false
  }
);

const keyword = ref('');
const visibleOptions = computed(() => {
  const query = keyword.value.trim().toLowerCase();

  if (!query) {
    return props.options;
  }

  return props.options.filter((option) =>
    [
      option.label,
      option.code,
      option.uid,
      option.description,
      option.group,
      option.chipLabel,
      ...(option.meta ?? [])
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  );
});

function handleFilter(value: string) {
  keyword.value = value;
}

function isSelected(value: string) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value;
}

function optionMeta(option: SelectOption) {
  if (option.meta) {
    return option.meta.filter(Boolean).join(' · ');
  }

  return [option.uid ? `UID ${option.uid}` : '', option.group, option.description]
    .filter(Boolean)
    .join(' · ');
}

function chipLabel(option: SelectOption) {
  if (option.chipLabel) {
    return option.chipLabel;
  }

  const label = option.confederationName ?? option.description ?? option.label;

  return isConfederation(label) ? label : '';
}

function optionTheme(option: SelectOption) {
  if (option.chipTheme) {
    return option.chipTheme;
  }

  const label = chipLabel(option);

  if (/亚足联|亚洲|AFC/i.test(label)) {
    return 'afc';
  }

  if (/欧足联|欧洲|UEFA/i.test(label)) {
    return 'uefa';
  }

  if (/南美|CONMEBOL/i.test(label)) {
    return 'conmebol';
  }

  if (/非足联|非洲|CAF/i.test(label)) {
    return 'caf';
  }

  if (/中北美|北中美|加勒比|CONCACAF/i.test(label)) {
    return 'concacaf';
  }

  if (/大洋足联|大洋洲|OFC/i.test(label)) {
    return 'ofc';
  }

  return 'default';
}

function optionAccentVar(option: SelectOption) {
  const theme = optionTheme(option);

  if (theme.startsWith('position-')) {
    return `var(--${theme})`;
  }

  return `var(--confed-${theme})`;
}

function isConfederation(value?: string | null) {
  return Boolean(value && confederationPattern.test(value));
}
</script>

<template>
  <el-select
    v-model="model"
    class="common-select"
    :loading="loading"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="filterable"
    :filter-method="filterable ? handleFilter : undefined"
    :multiple="multiple"
    collapse-tags
    collapse-tags-tooltip
    popper-class="common-select-popper"
  >
    <el-option
      v-for="option in visibleOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    >
      <div
        class="select-option"
        :class="{ 'is-selected': isSelected(option.value) }"
        :style="{ '--option-accent-color': optionAccentVar(option) }"
      >
        <div class="select-option-main">
          <strong>{{ option.label }}</strong>
          <span v-if="optionMeta(option)">{{ optionMeta(option) }}</span>
        </div>
        <span
          v-if="chipLabel(option)"
          class="select-option-chip"
          :class="`theme-${optionTheme(option)}`"
        >
          {{ chipLabel(option) }}
        </span>
      </div>
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">
.common-select {
  width: 100%;

  :deep(.el-select__wrapper) {
    min-height: 38px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--line) inset;
    transition:
      box-shadow 0.18s ease,
      background 0.18s ease;

    &:hover {
      box-shadow: 0 0 0 1px rgba(31, 139, 85, 0.38) inset;
    }

    &.is-focused {
      background: #fff;
      box-shadow:
        0 0 0 1px var(--green) inset,
        0 8px 20px rgba(31, 139, 85, 0.1);
    }
  }

  :deep(.el-select__placeholder),
  :deep(.el-select__selected-item) {
    color: #263f32;
  }
}

.select-option {
  --option-accent-color: var(--green);

  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 46px;
  padding: 6px 8px;
  border-radius: 8px;
  line-height: 1.35;

  &.is-selected {
    position: relative;

    &::before {
      position: absolute;
      top: 8px;
      bottom: 8px;
      left: 0;
      width: 3px;
      border-radius: 999px;
      background: var(--option-accent-color);
      content: '';
    }
  }
}

.select-option-main {
  display: grid;
  min-width: 0;
  gap: 2px;
  padding-left: 4px;

  strong {
    overflow: hidden;
    color: #14382a;
    font-size: 14px;
    font-weight: 760;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: var(--muted);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.select-option-chip {
  flex: 0 0 auto;
  max-width: 116px;
  padding: 4px 12px;
  overflow: hidden;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 760;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.theme-afc {
    color: var(--confed-afc);
    background: var(--confed-afc-bg);
  }

  &.theme-uefa {
    color: var(--confed-uefa);
    background: var(--confed-uefa-bg);
  }

  &.theme-conmebol {
    color: var(--confed-conmebol);
    background: var(--confed-conmebol-bg);
  }

  &.theme-caf {
    color: var(--confed-caf);
    background: var(--confed-caf-bg);
  }

  &.theme-concacaf {
    color: var(--confed-concacaf);
    background: var(--confed-concacaf-bg);
  }

  &.theme-ofc {
    color: var(--confed-ofc);
    background: var(--confed-ofc-bg);
  }

  &.theme-position-forward {
    color: var(--position-forward);
    background: var(--position-forward-bg);
  }

  &.theme-position-midfield {
    color: var(--position-midfield);
    background: var(--position-midfield-bg);
  }

  &.theme-position-backfield {
    color: var(--position-backfield);
    background: var(--position-backfield-bg);
  }

  &.theme-position-goalkeeper {
    color: var(--position-goalkeeper);
    background: var(--position-goalkeeper-bg);
  }

  &.theme-position-default {
    color: var(--position-default);
    background: #edf8f1;
  }

  &.theme-default {
    color: var(--green);
    background: #edf8f1;
  }
}

:global(.common-select-popper.el-popper) {
  overflow: hidden;
  border: 1px solid #dfe8df;
  border-radius: 12px;
  box-shadow: 0 20px 48px rgba(22, 64, 47, 0.14);

  :global(.el-popper__arrow::before) {
    border-color: #dfe8df;
  }

  :global(.el-select-dropdown) {
    border: 0;
  }
}

:global(.common-select-popper .el-select-dropdown__wrap) {
  max-height: 320px;
}

:global(.common-select-popper .el-select-dropdown__list) {
  padding: 8px;
}

:global(.common-select-popper .el-select-dropdown__item) {
  height: auto;
  min-height: 50px;
  padding: 0;
  margin-bottom: 4px;
  border-radius: 8px;
  color: var(--ink);
  line-height: normal;
}

:global(.common-select-popper .el-select-dropdown__item:last-child) {
  margin-bottom: 0;
}

:global(.common-select-popper .el-select-dropdown__item.hover),
:global(.common-select-popper .el-select-dropdown__item:hover) {
  background: #faf7ec;
}

:global(.common-select-popper .el-select-dropdown__item.selected) {
  background: #edf8f1;
  color: var(--ink);
  font-weight: 400;
}

:global(.common-select-popper .el-select-dropdown__item.selected::after) {
  right: 14px;
  color: var(--green);
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import type {
  CompetitionDetail,
  CompetitionEditionStandingMode
} from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';
import HonorPlacementLabel from '@/components/honors/HonorPlacementLabel.vue';
import { ClubSelect, CountrySelect } from '@/components/selects';
import type { EditionRow, PlacementField } from './types';

const props = defineProps<{
  title: string;
  mode: 'batch' | 'single';
  rows: EditionRow[];
  allRowsCount: number;
  competition: CompetitionDetail | null;
  placementFields: PlacementField[];
  standingModeOptions: Array<{ label: string; value: CompetitionEditionStandingMode }>;
  getPlacementFieldsByMode: (standingMode: CompetitionEditionStandingMode) => PlacementField[];
  sortAscending: boolean;
  saving: boolean;
}>();

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  add: [];
  remove: [row: EditionRow];
  save: [];
  'update:sortAscending': [value: boolean];
}>();

const gridTemplateColumns = computed(
  () =>
    `72px 120px 150px 120px 120px ${props.placementFields
      .map(() => '170px')
      .join(' ')} 90px 220px 150px 72px`
);
const gridMinWidth = computed(() => `${1184 + props.placementFields.length * 180}px`);
const rowGridStyle = computed(() => ({
  gridTemplateColumns: gridTemplateColumns.value,
  width: gridMinWidth.value,
  minWidth: gridMinWidth.value
}));

function hasPlacementField(row: EditionRow, field: PlacementField) {
  return props
    .getPlacementFieldsByMode(row.standingMode)
    .some((candidate) => candidate.key === field.key);
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="1180px" class="edition-result-dialog">
    <div class="edition-result-dialog__content">
      <div class="edition-editor-toolbar">
        <el-button v-if="mode === 'batch'" type="primary" @click="emit('add')">
          <IconFont name="add" />
          新增一行
        </el-button>
        <span v-else class="status-pill">编辑当前行</span>
        <el-switch
          :model-value="sortAscending"
          active-text="按年份升序"
          inactive-text="倒序"
          @update:model-value="emit('update:sortAscending', $event)"
        />
      </div>

      <div class="edition-editor-table">
        <div class="edition-editor-row edition-editor-head" :style="rowGridStyle">
          <span>序号</span>
          <span>年份</span>
          <span>赛季/别名</span>
          <span>举办地</span>
          <span>名次口径</span>
          <span v-for="field in placementFields" :key="field.key" class="edition-placement-head">
            <HonorPlacementLabel :placement="field.placement" />
            <span v-if="field.standingOrder" class="edition-placement-order">
              {{ field.standingOrder }}
            </span>
          </span>
          <span>数量</span>
          <span>届次外链</span>
          <span>备注</span>
          <span>操作</span>
        </div>

        <div
          v-for="(row, index) in rows"
          :key="row.clientId"
          class="edition-editor-row"
          :class="{ locked: row.locked }"
          :style="rowGridStyle"
        >
          <span class="edition-editor-index">{{ index + 1 }}</span>
          <el-date-picker
            v-model="row.year"
            type="year"
            value-format="YYYY"
            placeholder="年份"
            style="width: 100%"
          />
          <el-input v-model="row.season" placeholder="2023-24 / 可空" />
          <el-input v-model="row.host" placeholder="举办地" />
          <el-select v-model="row.standingMode" placeholder="名次口径">
            <el-option
              v-for="option in standingModeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <template v-for="field in placementFields" :key="field.key">
            <CountrySelect
              v-if="competition?.targetType === 'COUNTRY' && hasPlacementField(row, field)"
              v-model="row.standings[field.key].countryId"
              :placeholder="field.label"
              include-hidden
              include-historical
            />
            <ClubSelect
              v-else-if="hasPlacementField(row, field)"
              v-model="row.standings[field.key].clubId"
              :placeholder="field.label"
            />
            <span v-else class="edition-editor-disabled">-</span>
          </template>
          <el-input-number
            v-model="row.quantity"
            :min="0"
            :controls="false"
            placeholder="可空"
            style="width: 100%"
          />
          <el-input v-model="row.externalUrl" placeholder="https://..." />
          <el-input v-model="row.remark" placeholder="备注" />
          <el-button link type="danger" :disabled="allRowsCount <= 1" @click="emit('remove', row)">
            <IconFont name="delete" />
            删除
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button :disabled="saving" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="emit('save')">
        <IconFont name="save" />
        保存结果
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.edition-result-dialog__content {
  padding-right: 4px;
}

.edition-editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.edition-editor-table {
  display: grid;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.edition-editor-row {
  display: grid;
  gap: 10px;
  align-items: center;

  &.locked {
    opacity: 0.92;
  }
}

.edition-editor-head {
  color: var(--text-color-regular);
  font-size: 13px;
  font-weight: 850;
}

.edition-editor-index {
  color: var(--text-color-secondary);
  font-weight: 800;
  text-align: center;
}

.edition-placement-head {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.edition-placement-order {
  flex: 0 0 auto;
}

.edition-editor-disabled {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  color: var(--text-color-secondary);
}
</style>

<script setup lang="ts">
import type {
  CompetitionDetail,
  CompetitionStandingPlacement
} from '@/services/types/competitions';
import IconFont from '@/components/IconFont.vue';
import { ClubSelect, CountrySelect } from '@/components/selects';
import type { EditionRow } from './types';

defineProps<{
  title: string;
  mode: 'batch' | 'single';
  rows: EditionRow[];
  allRowsCount: number;
  competition: CompetitionDetail | null;
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

const placementFields: CompetitionStandingPlacement[] = [
  'CHAMPION',
  'RUNNER_UP',
  'THIRD_PLACE',
  'FOURTH_PLACE'
];
const placementLabels: Record<CompetitionStandingPlacement, string> = {
  CHAMPION: '冠军',
  RUNNER_UP: '亚军',
  THIRD_PLACE: '季军',
  FOURTH_PLACE: '殿军'
};
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="1180px">
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
      <div class="edition-editor-row edition-editor-head">
        <span>年份</span>
        <span>赛季/别名</span>
        <span>举办地</span>
        <span>冠军</span>
        <span>亚军</span>
        <span>季军</span>
        <span>殿军</span>
        <span>数量</span>
        <span>备注</span>
        <span>操作</span>
      </div>

      <div
        v-for="row in rows"
        :key="row.clientId"
        class="edition-editor-row"
        :class="{ locked: row.locked }"
      >
        <el-date-picker
          v-model="row.year"
          type="year"
          value-format="YYYY"
          placeholder="年份"
          style="width: 100%"
        />
        <el-input v-model="row.season" placeholder="2023-24 / 可空" />
        <el-input v-model="row.host" placeholder="举办地" />
        <template v-for="placement in placementFields" :key="placement">
          <CountrySelect
            v-if="competition?.targetType === 'COUNTRY'"
            v-model="row.standings[placement].countryId"
            :placeholder="placementLabels[placement]"
            include-hidden
            include-historical
          />
          <ClubSelect
            v-else
            v-model="row.standings[placement].clubId"
            :placeholder="placementLabels[placement]"
          />
        </template>
        <el-input-number
          v-model="row.quantity"
          :min="0"
          :controls="false"
          placeholder="可空"
          style="width: 100%"
        />
        <el-input v-model="row.remark" placeholder="备注" />
        <el-button
          link
          type="danger"
          :disabled="allRowsCount <= 1 || row.locked"
          @click="emit('remove', row)"
        >
          <IconFont name="delete" />
          删除
        </el-button>
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
  grid-template-columns: 120px 150px 90px 140px repeat(4, 170px) 150px 72px;
  gap: 10px;
  align-items: center;
  min-width: 1330px;

  &.locked {
    opacity: 0.92;
  }
}

.edition-editor-head {
  color: #51665b;
  font-size: 13px;
  font-weight: 850;
}
</style>

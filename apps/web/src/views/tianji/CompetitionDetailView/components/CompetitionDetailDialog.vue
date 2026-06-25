<script setup lang="ts">
import { toRef } from 'vue';
import type {
  CompetitionCategory,
  CompetitionFormat,
  CompetitionLevel,
  CompetitionScopeType,
  CompetitionTargetType
} from '@/services/competitions';
import { ConfederationSelect, CountrySelect } from '@/components/selects';
import type { CompetitionDetailForm } from './types';

const props = defineProps<{
  form: CompetitionDetailForm;
  saving: boolean;
  showFormatField: boolean;
  targetTypeOptions: Array<{ label: string; value: CompetitionTargetType }>;
  scopeTypeOptions: Array<{ label: string; value: CompetitionScopeType }>;
  categoryOptions: Array<{ label: string; value: CompetitionCategory }>;
  levelOptions: Array<{ label: string; value: CompetitionLevel }>;
  formatOptions: Array<{ label: string; value: CompetitionFormat }>;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const form = toRef(props, 'form');

const emit = defineEmits<{
  save: [];
}>();
</script>

<template>
  <el-dialog v-model="visible" title="编辑赛事资料" width="760px" destroy-on-close>
    <el-form class="competition-form-grid" label-position="top" @submit.prevent="emit('save')">
      <el-form-item label="赛事编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="赛事名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="对象">
        <el-select v-model="form.targetType">
          <el-option
            v-for="targetType in targetTypeOptions"
            :key="targetType.value"
            :label="targetType.label"
            :value="targetType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="适用范围">
        <el-select v-model="form.scopeType">
          <el-option
            v-for="scopeType in scopeTypeOptions"
            :key="scopeType.value"
            :label="scopeType.label"
            :value="scopeType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'CONFEDERATION'" label="足联">
        <ConfederationSelect
          v-model="form.confederationIds"
          placeholder="选择一个或多个足联"
          :clearable="false"
          multiple
        />
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'COUNTRY'" label="国家">
        <CountrySelect
          v-model="form.countryIds"
          placeholder="选择一个或多个国家"
          :clearable="false"
          multiple
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category" clearable placeholder="选择分类">
          <el-option
            v-for="category in categoryOptions"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="级别">
        <el-select v-model="form.level" clearable placeholder="选择级别">
          <el-option
            v-for="level in levelOptions"
            :key="level.value"
            :label="level.label"
            :value="level.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showFormatField" label="赛制">
        <el-select v-model="form.format" clearable placeholder="选择赛制">
          <el-option
            v-for="format in formatOptions"
            :key="format.value"
            :label="format.label"
            :value="format.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="外链">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="描述" class="form-wide">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="赛事说明、统计口径或备注"
        />
      </el-form-item>
      <div class="form-wide form-help">
        适用范围决定哪些国家或俱乐部会看到赛事；分类、级别用于归类和后续计分，赛制仅用于国内赛事区分联赛和杯赛。
      </div>
      <el-form-item label="状态">
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <el-form-item label="统计">
        <el-switch
          v-model="form.includeInStats"
          active-text="纳入奖牌/荣誉统计"
          inactive-text="排除统计"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button :disabled="saving" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="emit('save')"> 保存资料 </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.form-help {
  color: #66756d;
  font-size: 13px;
  line-height: 1.7;
}
</style>

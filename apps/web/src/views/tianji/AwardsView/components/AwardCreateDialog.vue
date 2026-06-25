<script setup lang="ts">
import { toRef } from 'vue';
import type { AwardScopeType } from '@/services/awards';
import { ConfederationSelect, CountrySelect } from '@/components/selects';

const props = defineProps<{
  form: {
    code: string;
    name: string;
    scopeType: AwardScopeType;
    confederationId: string;
    countryId: string;
    category: string;
    level: string;
    externalUrl: string;
    description: string;
    enabled: boolean;
    sortOrder: number;
  };
  creating: boolean;
  scopeTypeOptions: Array<{ label: string; value: AwardScopeType }>;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const form = toRef(props, 'form');

const emit = defineEmits<{
  submit: [];
}>();
</script>

<template>
  <el-dialog v-model="visible" title="创建奖项" width="760px" destroy-on-close>
    <el-form class="competition-form-grid" label-position="top" @submit.prevent="emit('submit')">
      <el-form-item label="奖项编码">
        <el-input v-model="form.code" placeholder="BALLON_DOR" />
      </el-form-item>
      <el-form-item label="奖项名称">
        <el-input v-model="form.name" placeholder="金球奖" />
      </el-form-item>
      <el-form-item label="范围">
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
          v-model="form.confederationId"
          placeholder="选择足联"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item v-if="form.scopeType === 'COUNTRY'" label="国家">
        <CountrySelect v-model="form.countryId" placeholder="选择国家" :clearable="false" />
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="form.category" placeholder="个人奖项 / 年度评选" />
      </el-form-item>
      <el-form-item label="级别">
        <el-input v-model="form.level" placeholder="世界 / 洲际 / 国家" />
      </el-form-item>
      <el-form-item label="外链">
        <el-input v-model="form.externalUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortOrder" :min="0" :controls="false" />
      </el-form-item>
      <el-form-item label="描述" class="form-wide">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="奖项说明、统计口径或备注"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <div class="competition-form-actions">
        <el-button type="primary" :loading="creating" @click="emit('submit')"> 创建奖项 </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
